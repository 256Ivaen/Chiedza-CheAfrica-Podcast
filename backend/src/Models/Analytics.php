<?php

namespace App\Models;

use App\Utils\GoogleAuth;

class Analytics {
    private $auth;
    private $viewId;
    private $apiEndpoint = 'https://analyticsreporting.googleapis.com/v4/reports:batchGet';

    public function __construct() {
        $credentialsPath = __DIR__ . '/../../' . ($_ENV['GA_CREDENTIALS_PATH'] ?? 'config/google-analytics-credentials.json');
        $this->viewId = $_ENV['GA_VIEW_ID'] ?? '';

        if (empty($this->viewId)) {
            throw new \Exception('Google Analytics View ID not configured');
        }

        $this->auth = new GoogleAuth($credentialsPath);
    }

    /**
     * Make API request to Google Analytics
     */
    private function makeRequest($reportRequests) {
        $accessToken = $this->auth->getAccessToken();
        
        $requestBody = json_encode([
            'reportRequests' => $reportRequests
        ]);

        $ch = curl_init($this->apiEndpoint);
        
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $requestBody,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json'
            ]
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            throw new \Exception('cURL error: ' . $error);
        }
        
        if ($httpCode !== 200) {
            throw new \Exception('API request failed with code ' . $httpCode . ': ' . $response);
        }
        
        $data = json_decode($response, true);
        
        if (!$data || !isset($data['reports'])) {
            throw new \Exception('Invalid API response');
        }
        
        return $data['reports'][0];
    }

    /**
     * Get overview analytics data
     */
    public function getOverview($startDate = '30daysAgo', $endDate = 'today') {
        try {
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

        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch analytics overview: ' . $e->getMessage());
        }
    }

    /**
     * Get real-time active users
     */
    public function getRealTimeUsers() {
        try {
            $accessToken = $this->auth->getAccessToken();
            $url = "https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:{$this->viewId}&metrics=rt:activeUsers";
            
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $accessToken
                ]
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode !== 200) {
                return ['activeUsers' => 0];
            }
            
            $data = json_decode($response, true);
            $activeUsers = (int)($data['totalsForAllResults']['rt:activeUsers'] ?? 0);
            
            return ['activeUsers' => $activeUsers];

        } catch (\Exception $e) {
            return ['activeUsers' => 0];
        }
    }

    /**
     * Get top pages
     */
    public function getTopPages($limit = 10, $startDate = '30daysAgo', $endDate = 'today') {
        try {
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

        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch top pages: ' . $e->getMessage());
        }
    }

    /**
     * Get analytics by date range
     */
    public function getByDateRange($startDate = '7daysAgo', $endDate = 'today') {
        try {
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

        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch analytics by date: ' . $e->getMessage());
        }
    }

    /**
     * Get traffic sources
     */
    public function getTrafficSources($startDate = '30daysAgo', $endDate = 'today') {
        try {
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

        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch traffic sources: ' . $e->getMessage());
        }
    }

    /**
     * Get device breakdown
     */
    public function getDeviceBreakdown($startDate = '30daysAgo', $endDate = 'today') {
        try {
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

        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch device breakdown: ' . $e->getMessage());
        }
    }

    /**
     * Get geographic data
     */
    public function getGeographicData($startDate = '30daysAgo', $endDate = 'today', $limit = 10) {
        try {
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

        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch geographic data: ' . $e->getMessage());
        }
    }
}