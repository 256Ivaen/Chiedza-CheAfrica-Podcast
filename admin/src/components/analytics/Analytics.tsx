"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge-2";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-charts-2";
import { 
  FileText, 
  MessageSquare, 
  Heart, 
  Eye, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Globe, 
  Activity, 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock,
  Calendar,
  BarChart3
} from "lucide-react";
import { get } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

// Chart configuration
const chartConfig = {
  users: {
    label: 'Users',
    color: 'var(--color-blue-500)',
  },
  sessions: {
    label: 'Sessions',
    color: 'var(--color-purple-500)',
  },
  pageViews: {
    label: 'Page Views',
    color: 'var(--color-green-500)',
  },
} satisfies ChartConfig;

export function WebsiteAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalPageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    sessionsPerUser: 0,
    activeUsers: 0,
    topPages: [],
    devices: [],
    trafficSources: [],
    geographic: [],
  });
  const [dateRangeData, setDateRangeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  // Time range configurations
  const timeRanges = {
    "7d": { label: "7 Days", days: 7 },
    "30d": { label: "30 Days", days: 30 },
    "3m": { label: "3 Months", days: 90 },
    "6m": { label: "6 Months", days: 180 },
    "1y": { label: "1 Year", days: 365 }
  };

  // Format date for API
  const getDateRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const { start_date, end_date } = getDateRange(timeRanges[timeRange].days);

        // Fetch dashboard data
        const dashboardResponse = await get(`analytics/dashboard?start_date=${start_date}&end_date=${end_date}`);
        
        if (dashboardResponse?.success && dashboardResponse?.data) {
          const { overview, realTime, topPages, devices, trafficSources } = dashboardResponse.data;
          
          setAnalyticsData(prev => ({
            ...prev,
            totalUsers: overview?.totalUsers || 0,
            totalSessions: overview?.totalSessions || 0,
            totalPageViews: overview?.totalPageViews || 0,
            avgSessionDuration: overview?.avgSessionDuration || 0,
            bounceRate: overview?.bounceRate || 0,
            sessionsPerUser: overview?.sessionsPerUser || 0,
            activeUsers: realTime?.activeUsers || 0,
            topPages: Array.isArray(topPages) ? topPages : [],
            devices: Array.isArray(devices) ? devices : [],
            trafficSources: Array.isArray(trafficSources) ? trafficSources : [],
          }));
        }

        // Fetch geographic data
        const geoResponse = await get("analytics/geographic");
        if (geoResponse?.success && geoResponse?.data) {
          setAnalyticsData(prev => ({
            ...prev,
            geographic: Array.isArray(geoResponse.data) ? geoResponse.data : [],
          }));
        }

      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Fetch date range data for chart
  useEffect(() => {
    const fetchDateRangeData = async () => {
      try {
        setChartLoading(true);
        const { start_date, end_date } = getDateRange(timeRanges[timeRange].days);

        const response = await get(`analytics/by-date?start_date=${start_date}&end_date=${end_date}`);
        
        if (response?.success && response?.data) {
          const formattedData = Array.isArray(response.data) 
            ? response.data.map(item => ({
                date: item.date,
                users: item.users || 0,
                sessions: item.sessions || 0,
                pageViews: item.pageViews || 0,
              }))
            : [];
          setDateRangeData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching date range data:", error);
        setDateRangeData([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchDateRangeData();
  }, [timeRange]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const getDeviceIcon = (device) => {
    const deviceLower = device?.toLowerCase() || '';
    if (deviceLower.includes('mobile')) return <Smartphone className="w-4 h-4 text-blue-600" />;
    if (deviceLower.includes('tablet')) return <Tablet className="w-4 h-4 text-green-600" />;
    return <Monitor className="w-4 h-4 text-purple-600" />;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (timeRange === "7d") {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeRange === "30d") {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  // Custom Tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {new Date(label).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.dataKey}:</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Globe className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Website Analytics</h1>
                <p className="text-sm text-gray-600">Track and analyze your website performance</p>
              </div>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Visitors */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-blue-600 mr-2" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Total Visitors
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        analyticsData.totalUsers.toLocaleString()
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Unique users
                    </p>
                  </div>
                  <Badge variant="primary" appearance="light">
                    +12%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Total Sessions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MousePointerClick className="h-4 w-4 text-purple-600 mr-2" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Total Sessions
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        analyticsData.totalSessions.toLocaleString()
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      User sessions
                    </p>
                  </div>
                  <Badge variant="primary" appearance="light">
                    +8%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Page Views */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Eye className="h-4 w-4 text-orange-600 mr-2" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Page Views
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        analyticsData.totalPageViews.toLocaleString()
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total views
                    </p>
                  </div>
                  <Badge variant="primary" appearance="light">
                    +15%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Avg Session Duration */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-indigo-600 mr-2" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Avg Duration
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        formatDuration(analyticsData.avgSessionDuration)
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Per session
                    </p>
                  </div>
                  <Badge variant="primary" appearance="light">
                    +5%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Traffic Overview - {timeRanges[timeRange].label}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {getDateRange(timeRanges[timeRange].days).start_date} to {getDateRange(timeRanges[timeRange].days).end_date}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chartLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <SkeletonBox className="h-64 w-full" />
                </div>
              ) : dateRangeData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <ComposedChart
                    data={dateRangeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <ChartTooltip content={<CustomTooltip />} />
                    
                    {/* Area for Page Views */}
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      stroke={chartConfig.pageViews.color}
                      fill={`url(#pageViewsGradient)`}
                      strokeWidth={2}
                      fillOpacity={0.2}
                    />
                    
                    {/* Line for Users */}
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke={chartConfig.users.color}
                      strokeWidth={3}
                      dot={{ fill: chartConfig.users.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    
                    {/* Line for Sessions */}
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke={chartConfig.sessions.color}
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: chartConfig.sessions.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />

                    <defs>
                      <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig.pageViews.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartConfig.pageViews.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ChartContainer>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No data available for the selected time range</p>
                  </div>
                </div>
              )}
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Page Views</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Metrics Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Bounce Rate & Sessions per User */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Bounce Rate
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <SkeletonBox className="h-6 w-16 mx-auto" />
                      ) : (
                        `${analyticsData.bounceRate.toFixed(1)}%`
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Exit rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-4 w-4 text-teal-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Sessions/User
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <SkeletonBox className="h-6 w-16 mx-auto" />
                      ) : (
                        analyticsData.sessionsPerUser.toFixed(2)
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Average visits
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Pages & Geographic Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            {!loading && analyticsData.topPages.length > 0 && (
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold">Top Pages</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {analyticsData.topPages.slice(0, 5).map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {page.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 truncate ml-8">
                            {page.path}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {page.views?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-gray-500">views</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Geographic Data */}
            {!loading && analyticsData.geographic.length > 0 && (
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold">Top Locations</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {analyticsData.geographic.slice(0, 5).map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {location.country}
                            </p>
                            <p className="text-xs text-gray-500">
                              {location.city}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {location.users?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-gray-500">users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Device Breakdown */}
          {!loading && analyticsData.devices.length > 0 && (
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyticsData.devices.map((device, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.device)}
                        <div>
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {device.device || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {device.sessions?.toLocaleString() || 0} sessions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {device.users?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-500">users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid } from 'recharts';