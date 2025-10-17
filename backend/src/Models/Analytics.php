<?php

namespace App\Models;

use App\Utils\GoogleAuth;

class Analytics {
    private $auth;
    private $propertyId;
    private $apiEndpoint = 'https://analyticsdata.googleapis.com/v1beta/%s:runReport';

    public function __construct() {
        // Get environment variables
        $credentialsPath = __DIR__ . '/../../' . ($_ENV['GA_CREDENTIALS_PATH'] ?? 'config/google-analytics-credentials.json');
        $this->propertyId = $_ENV['GA_VIEW_ID'] ?? ''; // This should be your GA4 Property ID

        // Log configuration for debugging
        error_log("Google Analytics GA4 Configuration:");
        error_log("Credentials Path: " . $credentialsPath);
        error_log("Property ID: " . $this->propertyId);
        error_log("File exists: " . (file_exists($credentialsPath) ? 'Yes' : 'No'));

        if (empty($this->propertyId)) {
            throw new \Exception('Google Analytics Property ID not configured. Please set GA_VIEW_ID in your environment variables.');
        }

        if (!file_exists($credentialsPath)) {
            throw new \Exception('Google Analytics credentials file not found at: ' . $credentialsPath);
        }

        $this->auth = new GoogleAuth($credentialsPath);
    }

    /**
     * Make API request to Google Analytics GA4 API - FIXED URL FORMATTING
     */
    private function makeRequest($requestBody) {
        $accessToken = $this->auth->getAccessToken();
        
        // Format the property ID correctly for GA4 API - FIXED: Don't double-format
        $formattedPropertyId = $this->propertyId;
        if (!str_starts_with($formattedPropertyId, 'properties/')) {
            $formattedPropertyId = 'properties/' . $this->propertyId;
        }
        
        $endpoint = sprintf($this->apiEndpoint, $formattedPropertyId);
        
        $jsonBody = json_encode($requestBody);

        // Log the request for debugging
        error_log("Google Analytics GA4 API Request:");
        error_log("Endpoint: " . $endpoint);
        error_log("Property ID: " . $formattedPropertyId);
        error_log("Request Body: " . $jsonBody);
        error_log("Access Token Length: " . strlen($accessToken));

        $ch = curl_init($endpoint);
        
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $jsonBody,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json'
            ],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_TIMEOUT => 30,
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        // Log the actual response for debugging
        error_log("Google Analytics GA4 API Response - HTTP Code: " . $httpCode);
        error_log("Google Analytics GA4 API Response - Body: " . $response);
        
        if ($error) {
            throw new \Exception('cURL error: ' . $error);
        }
        
        if ($httpCode !== 200) {
            $errorData = json_decode($response, true);
            $errorMessage = 'GA4 API request failed with HTTP code ' . $httpCode;
            
            if (isset($errorData['error']['message'])) {
                $errorMessage .= ': ' . $errorData['error']['message'];
            } else {
                $errorMessage .= ' - Response: ' . $response;
            }
            
            // Add more debug info
            $errorMessage .= ' [Property: ' . $formattedPropertyId . ']';
            
            throw new \Exception($errorMessage);
        }
        
        $data = json_decode($response, true);
        
        if (!$data) {
            throw new \Exception('Invalid JSON response: ' . $response);
        }
        
        return $data;
    }

    /**
     * Get overview analytics data for GA4
     */
    public function getOverview($startDate = '30daysAgo', $endDate = 'today') {
        $requestBody = [
            'dateRanges' => [
                [
                    'startDate' => $startDate,
                    'endDate' => $endDate
                ]
            ],
            'metrics' => [
                ['name' => 'totalUsers'],
                ['name' => 'sessions'],
                ['name' => 'screenPageViews'],
                ['name' => 'averageSessionDuration'],
                ['name' => 'bounceRate'],
                ['name' => 'sessionsPerUser']
            ]
        ];

        $report = $this->makeRequest($requestBody);
        
        $rows = $report['rows'][0] ?? [];
        $metricValues = $rows['metricValues'] ?? [];
        
        return [
            'totalUsers' => (int)($metricValues[0]['value'] ?? 0),
            'totalSessions' => (int)($metricValues[1]['value'] ?? 0),
            'totalPageViews' => (int)($metricValues[2]['value'] ?? 0),
            'avgSessionDuration' => round((float)($metricValues[3]['value'] ?? 0), 2),
            'bounceRate' => round((float)($metricValues[4]['value'] ?? 0) * 100, 2), // Convert to percentage
            'sessionsPerUser' => round((float)($metricValues[5]['value'] ?? 0), 2)
        ];
    }

    /**
     * Get real-time active users for GA4
     */
    public function getRealTimeUsers() {
        try {
            $accessToken = $this->auth->getAccessToken();
            
            // Format the property ID correctly for GA4 API - FIXED: Don't double-format
            $formattedPropertyId = $this->propertyId;
            if (!str_starts_with($formattedPropertyId, 'properties/')) {
                $formattedPropertyId = 'properties/' . $this->propertyId;
            }
            
            $url = "https://analyticsdata.googleapis.com/v1beta/{$formattedPropertyId}:runRealtimeReport";
            
            $requestBody = [
                'metrics' => [
                    ['name' => 'activeUsers']
                ]
            ];
            
            error_log("Real-time API Request: " . $url);
            
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($requestBody),
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $accessToken,
                    'Content-Type: application/json'
                ],
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_TIMEOUT => 10,
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);
            
            error_log("Real-time API Response - HTTP Code: " . $httpCode);
            
            if ($error || $httpCode !== 200) {
                // Real-time API often has issues, return 0 instead of throwing error
                error_log("Real-time API error, returning 0: " . ($error ?: "HTTP $httpCode"));
                return ['activeUsers' => 0];
            }
            
            $data = json_decode($response, true);
            $activeUsers = (int)($data['rows'][0]['metricValues'][0]['value'] ?? 0);
            
            return ['activeUsers' => $activeUsers];
            
        } catch (\Exception $e) {
            error_log("Real-time users error: " . $e->getMessage());
            return ['activeUsers' => 0];
        }
    }

    /**
     * Get top pages for GA4
     */
    public function getTopPages($limit = 10, $startDate = '30daysAgo', $endDate = 'today') {
        $requestBody = [
            'dateRanges' => [
                [
                    'startDate' => $startDate,
                    'endDate' => $endDate
                ]
            ],
            'dimensions' => [
                ['name' => 'pageTitle'],
                ['name' => 'pagePath']
            ],
            'metrics' => [
                ['name' => 'screenPageViews'],
                ['name' => 'totalUsers'],
                ['name' => 'averageSessionDuration']
            ],
            'orderBys' => [
                [
                    'metric' => ['metricName' => 'screenPageViews'],
                    'desc' => true
                ]
            ],
            'limit' => $limit
        ];

        $report = $this->makeRequest($requestBody);
        
        $pages = [];
        $rows = $report['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensionValues = $row['dimensionValues'] ?? [];
            $metricValues = $row['metricValues'] ?? [];
            
            $pages[] = [
                'title' => $dimensionValues[0]['value'] ?? 'Unknown',
                'path' => $dimensionValues[1]['value'] ?? '/',
                'views' => (int)($metricValues[0]['value'] ?? 0),
                'uniqueViews' => (int)($metricValues[1]['value'] ?? 0),
                'avgTimeOnPage' => round((float)($metricValues[2]['value'] ?? 0), 2)
            ];
        }
        
        return $pages;
    }

    /**
     * Get analytics by date range for GA4
     */
    public function getByDateRange($startDate = '7daysAgo', $endDate = 'today') {
        $requestBody = [
            'dateRanges' => [
                [
                    'startDate' => $startDate,
                    'endDate' => $endDate
                ]
            ],
            'dimensions' => [
                ['name' => 'date']
            ],
            'metrics' => [
                ['name' => 'totalUsers'],
                ['name' => 'sessions'],
                ['name' => 'screenPageViews']
            ],
            'orderBys' => [
                [
                    'dimension' => ['dimensionName' => 'date'],
                    'desc' => false
                ]
            ]
        ];

        $report = $this->makeRequest($requestBody);
        
        $byDate = [];
        $rows = $report['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensionValues = $row['dimensionValues'] ?? [];
            $metricValues = $row['metricValues'] ?? [];
            
            $date = $dimensionValues[0]['value'] ?? '';
            // Format date from YYYYMMDD to YYYY-MM-DD
            if (strlen($date) === 8) {
                $date = substr($date, 0, 4) . '-' . substr($date, 4, 2) . '-' . substr($date, 6, 2);
            }
            
            $byDate[] = [
                'date' => $date,
                'users' => (int)($metricValues[0]['value'] ?? 0),
                'sessions' => (int)($metricValues[1]['value'] ?? 0),
                'pageViews' => (int)($metricValues[2]['value'] ?? 0)
            ];
        }
        
        return $byDate;
    }

    /**
     * Get traffic sources for GA4
     */
    public function getTrafficSources($startDate = '30daysAgo', $endDate = 'today') {
        $requestBody = [
            'dateRanges' => [
                [
                    'startDate' => $startDate,
                    'endDate' => $endDate
                ]
            ],
            'dimensions' => [
                ['name' => 'source'],
                ['name' => 'medium']
            ],
            'metrics' => [
                ['name' => 'sessions'],
                ['name' => 'totalUsers']
            ],
            'orderBys' => [
                [
                    'metric' => ['metricName' => 'sessions'],
                    'desc' => true
                ]
            ],
            'limit' => 10
        ];

        $report = $this->makeRequest($requestBody);
        
        $sources = [];
        $rows = $report['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensionValues = $row['dimensionValues'] ?? [];
            $metricValues = $row['metricValues'] ?? [];
            
            $sources[] = [
                'source' => $dimensionValues[0]['value'] ?? 'Unknown',
                'medium' => $dimensionValues[1]['value'] ?? 'Unknown',
                'sessions' => (int)($metricValues[0]['value'] ?? 0),
                'users' => (int)($metricValues[1]['value'] ?? 0)
            ];
        }
        
        return $sources;
    }

    /**
     * Get device breakdown for GA4
     */
    public function getDeviceBreakdown($startDate = '30daysAgo', $endDate = 'today') {
        $requestBody = [
            'dateRanges' => [
                [
                    'startDate' => $startDate,
                    'endDate' => $endDate
                ]
            ],
            'dimensions' => [
                ['name' => 'deviceCategory']
            ],
            'metrics' => [
                ['name' => 'totalUsers'],
                ['name' => 'sessions']
            ]
        ];

        $report = $this->makeRequest($requestBody);
        
        $devices = [];
        $rows = $report['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensionValues = $row['dimensionValues'] ?? [];
            $metricValues = $row['metricValues'] ?? [];
            
            $devices[] = [
                'device' => $dimensionValues[0]['value'] ?? 'Unknown',
                'users' => (int)($metricValues[0]['value'] ?? 0),
                'sessions' => (int)($metricValues[1]['value'] ?? 0)
            ];
        }
        
        return $devices;
    }

    /**
     * Get geographic data for GA4
     */
    public function getGeographicData($startDate = '30daysAgo', $endDate = 'today', $limit = 10) {
        $requestBody = [
            'dateRanges' => [
                [
                    'startDate' => $startDate,
                    'endDate' => $endDate
                ]
            ],
            'dimensions' => [
                ['name' => 'country'],
                ['name' => 'city']
            ],
            'metrics' => [
                ['name' => 'totalUsers'],
                ['name' => 'sessions']
            ],
            'orderBys' => [
                [
                    'metric' => ['metricName' => 'totalUsers'],
                    'desc' => true
                ]
            ],
            'limit' => $limit
        ];

        $report = $this->makeRequest($requestBody);
        
        $locations = [];
        $rows = $report['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensionValues = $row['dimensionValues'] ?? [];
            $metricValues = $row['metricValues'] ?? [];
            
            $locations[] = [
                'country' => $dimensionValues[0]['value'] ?? 'Unknown',
                'city' => $dimensionValues[1]['value'] ?? 'Unknown',
                'users' => (int)($metricValues[0]['value'] ?? 0),
                'sessions' => (int)($metricValues[1]['value'] ?? 0)
            ];
        }
        
        return $locations;
    }
}