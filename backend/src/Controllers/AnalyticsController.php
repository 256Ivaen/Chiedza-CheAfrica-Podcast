<?php

namespace App\Controllers;

use App\Models\Analytics;
use App\Utils\Response;

class AnalyticsController {
    private $analyticsModel;

    public function __construct() {
        try {
            $this->analyticsModel = new Analytics();
        } catch (\Exception $e) {
            $this->analyticsModel = null;
            error_log('Analytics initialization failed: ' . $e->getMessage());
        }
    }

    /**
     * Get overview analytics
     */
    public function getOverview($queryParams = []) {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $startDate = $queryParams['start_date'] ?? '30daysAgo';
            $endDate = $queryParams['end_date'] ?? 'today';

            $data = $this->analyticsModel->getOverview($startDate, $endDate);
            Response::success($data, 'Analytics overview retrieved successfully');

        } catch (\Exception $e) {
            error_log('OVERVIEW ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get real-time users
     */
    public function getRealTime() {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $data = $this->analyticsModel->getRealTimeUsers();
            Response::success($data, 'Real-time data retrieved successfully');

        } catch (\Exception $e) {
            error_log('REAL-TIME ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get top pages
     */
    public function getTopPages($queryParams = []) {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $limit = (int)($queryParams['limit'] ?? 10);
            $startDate = $queryParams['start_date'] ?? '30daysAgo';
            $endDate = $queryParams['end_date'] ?? 'today';

            $data = $this->analyticsModel->getTopPages($limit, $startDate, $endDate);
            Response::success($data, 'Top pages retrieved successfully');

        } catch (\Exception $e) {
            error_log('TOP PAGES ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get analytics by date range
     */
    public function getByDateRange($queryParams = []) {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $startDate = $queryParams['start_date'] ?? '7daysAgo';
            $endDate = $queryParams['end_date'] ?? 'today';

            $data = $this->analyticsModel->getByDateRange($startDate, $endDate);
            Response::success($data, 'Date range analytics retrieved successfully');

        } catch (\Exception $e) {
            error_log('DATE RANGE ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get traffic sources
     */
    public function getTrafficSources($queryParams = []) {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $startDate = $queryParams['start_date'] ?? '30daysAgo';
            $endDate = $queryParams['end_date'] ?? 'today';

            $data = $this->analyticsModel->getTrafficSources($startDate, $endDate);
            Response::success($data, 'Traffic sources retrieved successfully');

        } catch (\Exception $e) {
            error_log('TRAFFIC SOURCES ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get device breakdown
     */
    public function getDeviceBreakdown($queryParams = []) {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $startDate = $queryParams['start_date'] ?? '30daysAgo';
            $endDate = $queryParams['end_date'] ?? 'today';

            $data = $this->analyticsModel->getDeviceBreakdown($startDate, $endDate);
            Response::success($data, 'Device breakdown retrieved successfully');

        } catch (\Exception $e) {
            error_log('DEVICE BREAKDOWN ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get geographic data
     */
    public function getGeographicData($queryParams = []) {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $limit = (int)($queryParams['limit'] ?? 10);
            $startDate = $queryParams['start_date'] ?? '30daysAgo';
            $endDate = $queryParams['end_date'] ?? 'today';

            $data = $this->analyticsModel->getGeographicData($startDate, $endDate, $limit);
            Response::success($data, 'Geographic data retrieved successfully');

        } catch (\Exception $e) {
            error_log('GEOGRAPHIC DATA ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get complete dashboard data
     */
    public function getDashboardData($queryParams = []) {
        if (!$this->analyticsModel) {
            Response::error('Analytics not configured. Check GA_VIEW_ID and GA_CREDENTIALS_PATH in your .env file', 500);
            return;
        }

        try {
            $startDate = $queryParams['start_date'] ?? '30daysAgo';
            $endDate = $queryParams['end_date'] ?? 'today';

            $overview = $this->analyticsModel->getOverview($startDate, $endDate);
            $realTime = $this->analyticsModel->getRealTimeUsers();
            $topPages = $this->analyticsModel->getTopPages(5, $startDate, $endDate);
            $traffic = $this->analyticsModel->getTrafficSources($startDate, $endDate);
            $devices = $this->analyticsModel->getDeviceBreakdown($startDate, $endDate);

            $data = [
                'overview' => $overview,
                'realTime' => $realTime,
                'topPages' => $topPages,
                'trafficSources' => $traffic,
                'devices' => $devices
            ];

            Response::success($data, 'Dashboard data retrieved successfully');

        } catch (\Exception $e) {
            error_log('DASHBOARD DATA ERROR: ' . $e->getMessage());
            Response::error('Google Analytics Error: ' . $e->getMessage(), 500);
        }
    }
}