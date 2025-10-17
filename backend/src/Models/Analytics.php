<?php

namespace App\Models;

use App\Utils\GoogleAuth;

class Analytics {
    private $auth;
    private $viewId;
    private $apiEndpoint = 'https://analyticsreporting.googleapis.com/v4/reports:batchGet';

    public function __construct() {
        // Get environment variables - using proper path from src/Models to root
        $credentialsPath = __DIR__ . '/../../' . ($_ENV['GA_CREDENTIALS_PATH'] ?? 'config/google-analytics-credentials.json');
        $this->viewId = $_ENV['GA_VIEW_ID'] ?? '';

        // Log configuration for debugging
        error_log("Google Analytics Configuration:");
        error_log("Credentials Path: " . $credentialsPath);
        error_log("View ID: " . $this->viewId);
        error_log("File exists: " . (file_exists($credentialsPath) ? 'Yes' : 'No'));

        if (empty($this->viewId)) {
            throw new \Exception('Google Analytics View ID not configured. Please set GA_VIEW_ID in your environment variables.');
        }

        if (!file_exists($credentialsPath)) {
            throw new \Exception('Google Analytics credentials file not found at: ' . $credentialsPath);
        }

        $this->auth = new GoogleAuth($credentialsPath);
    }

    /**
     * Make API request to Google Analytics - MODIFIED TO RETURN ACTUAL ERRORS
     */
    private function makeRequest($reportRequests) {
        $accessToken = $this->auth->getAccessToken();
        
        $requestBody = json_encode([
            'reportRequests' => $reportRequests
        ]);

        // Log the request for debugging
        error_log("Google Analytics API Request:");
        error_log("Endpoint: " . $this->apiEndpoint);
        error_log("View ID: " . $this->viewId);
        error_log("Request Body: " . $requestBody);

        $ch = curl_init($this->apiEndpoint);
        
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $requestBody,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json'
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 30,
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        // Log the actual response for debugging
        error_log("Google Analytics API Response - HTTP Code: " . $httpCode);
        error_log("Google Analytics API Response - Body: " . $response);
        
        if ($error) {
            throw new \Exception('cURL error: ' . $error);
        }
        
        if ($httpCode !== 200) {
            // Return the actual error response instead of throwing generic error
            $errorData = json_decode($response, true);
            $errorMessage = 'API request failed with HTTP code ' . $httpCode;
            
            if (isset($errorData['error']['message'])) {
                $errorMessage .= ': ' . $errorData['error']['message'];
            } else {
                $errorMessage .= '. Response: ' . $response;
            }
            
            // Include additional debug info
            $errorMessage .= ' [View ID: ' . $this->viewId . ']';
            
            throw new \Exception($errorMessage);
        }
        
        $data = json_decode($response, true);
        
        if (!$data) {
            throw new \Exception('Invalid JSON response: ' . $response);
        }
        
        if (!isset($data['reports'])) {
            throw new \Exception('Invalid API response structure. Expected "reports" key. Response: ' . $response);
        }
        
        return $data['reports'][0];
    }

    /**
     * Get overview analytics data
     */
    public function getOverview($startDate = '30daysAgo', $endDate = 'today') {
        $reportRequest = [
            [
                'viewId' => $this->viewId,
                'dateRanges' => [
                    [
                        'startDate' => $startDate,
                        'endDate' => $endDate
                    ]
                ],
                'metrics' => [
                    ['expression' => 'ga:users'],
                    ['expression' => 'ga:sessions'],
                    ['expression' => 'ga:pageviews'],
                    ['expression' => 'ga:avgSessionDuration'],
                    ['expression' => 'ga:bounceRate'],
                    ['expression' => 'ga:sessionsPerUser']
                ]
            ]
        ];

        $report = $this->makeRequest($reportRequest);
        
        $totals = $report['data']['totals'][0]['values'] ?? [];
        
        return [
            'totalUsers' => (int)($totals[0] ?? 0),
            'totalSessions' => (int)($totals[1] ?? 0),
            'totalPageViews' => (int)($totals[2] ?? 0),
            'avgSessionDuration' => round((float)($totals[3] ?? 0), 2),
            'bounceRate' => round((float)($totals[4] ?? 0), 2),
            'sessionsPerUser' => round((float)($totals[5] ?? 0), 2)
        ];
    }

    /**
     * Get real-time active users
     */
    public function getRealTimeUsers() {
        $accessToken = $this->auth->getAccessToken();
        $url = "https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:{$this->viewId}&metrics=rt:activeUsers";
        
        error_log("Real-time API Request: " . $url);
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 10,
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        error_log("Real-time API Response - HTTP Code: " . $httpCode);
        error_log("Real-time API Response - Body: " . $response);
        
        if ($error) {
            throw new \Exception('Real-time cURL error: ' . $error);
        }
        
        if ($httpCode !== 200) {
            $errorData = json_decode($response, true);
            $errorMessage = 'Real-time API request failed with HTTP code ' . $httpCode;
            
            if (isset($errorData['error']['message'])) {
                $errorMessage .= ': ' . $errorData['error']['message'];
            }
            
            throw new \Exception($errorMessage);
        }
        
        $data = json_decode($response, true);
        $activeUsers = (int)($data['totalsForAllResults']['rt:activeUsers'] ?? 0);
        
        return ['activeUsers' => $activeUsers];
    }

    /**
     * Get top pages
     */
    public function getTopPages($limit = 10, $startDate = '30daysAgo', $endDate = 'today') {
        $reportRequest = [
            [
                'viewId' => $this->viewId,
                'dateRanges' => [
                    [
                        'startDate' => $startDate,
                        'endDate' => $endDate
                    ]
                ],
                'dimensions' => [
                    ['name' => 'ga:pageTitle'],
                    ['name' => 'ga:pagePath']
                ],
                'metrics' => [
                    ['expression' => 'ga:pageviews'],
                    ['expression' => 'ga:uniquePageviews'],
                    ['expression' => 'ga:avgTimeOnPage']
                ],
                'orderBys' => [
                    [
                        'fieldName' => 'ga:pageviews',
                        'sortOrder' => 'DESCENDING'
                    ]
                ],
                'pageSize' => $limit
            ]
        ];

        $report = $this->makeRequest($reportRequest);
        
        $pages = [];
        $rows = $report['data']['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensions = $row['dimensions'] ?? [];
            $metrics = $row['metrics'][0]['values'] ?? [];
            
            $pages[] = [
                'title' => $dimensions[0] ?? 'Unknown',
                'path' => $dimensions[1] ?? '/',
                'views' => (int)($metrics[0] ?? 0),
                'uniqueViews' => (int)($metrics[1] ?? 0),
                'avgTimeOnPage' => round((float)($metrics[2] ?? 0), 2)
            ];
        }
        
        return $pages;
    }

    /**
     * Get analytics by date range
     */
    public function getByDateRange($startDate = '7daysAgo', $endDate = 'today') {
        $reportRequest = [
            [
                'viewId' => $this->viewId,
                'dateRanges' => [
                    [
                        'startDate' => $startDate,
                        'endDate' => $endDate
                    ]
                ],
                'dimensions' => [
                    ['name' => 'ga:date']
                ],
                'metrics' => [
                    ['expression' => 'ga:users'],
                    ['expression' => 'ga:sessions'],
                    ['expression' => 'ga:pageviews']
                ],
                'orderBys' => [
                    [
                        'fieldName' => 'ga:date',
                        'sortOrder' => 'ASCENDING'
                    ]
                ]
            ]
        ];

        $report = $this->makeRequest($reportRequest);
        
        $byDate = [];
        $rows = $report['data']['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensions = $row['dimensions'] ?? [];
            $metrics = $row['metrics'][0]['values'] ?? [];
            
            $date = $dimensions[0] ?? '';
            // Format date from YYYYMMDD to YYYY-MM-DD
            if (strlen($date) === 8) {
                $date = substr($date, 0, 4) . '-' . substr($date, 4, 2) . '-' . substr($date, 6, 2);
            }
            
            $byDate[] = [
                'date' => $date,
                'users' => (int)($metrics[0] ?? 0),
                'sessions' => (int)($metrics[1] ?? 0),
                'pageViews' => (int)($metrics[2] ?? 0)
            ];
        }
        
        return $byDate;
    }

    /**
     * Get traffic sources
     */
    public function getTrafficSources($startDate = '30daysAgo', $endDate = 'today') {
        $reportRequest = [
            [
                'viewId' => $this->viewId,
                'dateRanges' => [
                    [
                        'startDate' => $startDate,
                        'endDate' => $endDate
                    ]
                ],
                'dimensions' => [
                    ['name' => 'ga:source'],
                    ['name' => 'ga:medium']
                ],
                'metrics' => [
                    ['expression' => 'ga:sessions'],
                    ['expression' => 'ga:users']
                ],
                'orderBys' => [
                    [
                        'fieldName' => 'ga:sessions',
                        'sortOrder' => 'DESCENDING'
                    ]
                ],
                'pageSize' => 10
            ]
        ];

        $report = $this->makeRequest($reportRequest);
        
        $sources = [];
        $rows = $report['data']['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensions = $row['dimensions'] ?? [];
            $metrics = $row['metrics'][0]['values'] ?? [];
            
            $sources[] = [
                'source' => $dimensions[0] ?? 'Unknown',
                'medium' => $dimensions[1] ?? 'Unknown',
                'sessions' => (int)($metrics[0] ?? 0),
                'users' => (int)($metrics[1] ?? 0)
            ];
        }
        
        return $sources;
    }

    /**
     * Get device breakdown
     */
    public function getDeviceBreakdown($startDate = '30daysAgo', $endDate = 'today') {
        $reportRequest = [
            [
                'viewId' => $this->viewId,
                'dateRanges' => [
                    [
                        'startDate' => $startDate,
                        'endDate' => $endDate
                    ]
                ],
                'dimensions' => [
                    ['name' => 'ga:deviceCategory']
                ],
                'metrics' => [
                    ['expression' => 'ga:users'],
                    ['expression' => 'ga:sessions']
                ]
            ]
        ];

        $report = $this->makeRequest($reportRequest);
        
        $devices = [];
        $rows = $report['data']['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensions = $row['dimensions'] ?? [];
            $metrics = $row['metrics'][0]['values'] ?? [];
            
            $devices[] = [
                'device' => $dimensions[0] ?? 'Unknown',
                'users' => (int)($metrics[0] ?? 0),
                'sessions' => (int)($metrics[1] ?? 0)
            ];
        }
        
        return $devices;
    }

    /**
     * Get geographic data
     */
    public function getGeographicData($startDate = '30daysAgo', $endDate = 'today', $limit = 10) {
        $reportRequest = [
            [
                'viewId' => $this->viewId,
                'dateRanges' => [
                    [
                        'startDate' => $startDate,
                        'endDate' => $endDate
                    ]
                ],
                'dimensions' => [
                    ['name' => 'ga:country'],
                    ['name' => 'ga:city']
                ],
                'metrics' => [
                    ['expression' => 'ga:users'],
                    ['expression' => 'ga:sessions']
                ],
                'orderBys' => [
                    [
                        'fieldName' => 'ga:users',
                        'sortOrder' => 'DESCENDING'
                    ]
                ],
                'pageSize' => $limit
            ]
        ];

        $report = $this->makeRequest($reportRequest);
        
        $locations = [];
        $rows = $report['data']['rows'] ?? [];
        
        foreach ($rows as $row) {
            $dimensions = $row['dimensions'] ?? [];
            $metrics = $row['metrics'][0]['values'] ?? [];
            
            $locations[] = [
                'country' => $dimensions[0] ?? 'Unknown',
                'city' => $dimensions[1] ?? 'Unknown',
                'users' => (int)($metrics[0] ?? 0),
                'sessions' => (int)($metrics[1] ?? 0)
            ];
        }
        
        return $locations;
    }
}