"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";
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
} from "lucide-react";
import { get } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

function EnhancedDashboardContent({ loading, onRefresh }) {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalComments: 0,
    totalReactions: 0,
    totalViews: 0,
    recentBlogs: [],
  });
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
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Fetch blog data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);

        const blogsResponse = await get("blogs?include_hidden=true");
        
        if (blogsResponse?.success && blogsResponse?.data?.blogs) {
          const allBlogs = blogsResponse.data.blogs;
          setBlogs(allBlogs);

          const totalBlogs = allBlogs.length;
          const totalComments = allBlogs.reduce((sum, blog) => sum + parseInt(blog.comment_count || 0), 0);
          const totalReactions = allBlogs.reduce((sum, blog) => sum + parseInt(blog.reaction_count || 0), 0);
          const totalViews = allBlogs.reduce((sum, blog) => sum + parseInt(blog.view_count || 0), 0);
          const recentBlogs = allBlogs.slice(0, 5);

          setStats({
            totalBlogs,
            totalComments,
            totalReactions,
            totalViews,
            recentBlogs,
          });
        } else {
          setStats({
            totalBlogs: 0,
            totalComments: 0,
            totalReactions: 0,
            totalViews: 0,
            recentBlogs: [],
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setStats({
          totalBlogs: 0,
          totalComments: 0,
          totalReactions: 0,
          totalViews: 0,
          recentBlogs: [],
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch Google Analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setAnalyticsLoading(true);

        // Fetch complete dashboard data
        const dashboardResponse = await get("analytics/dashboard?start_date=30daysAgo&end_date=today");
        
        if (dashboardResponse?.success && dashboardResponse?.data) {
          const { overview, realTime, topPages, devices, trafficSources } = dashboardResponse.data;
          
          setAnalyticsData({
            totalUsers: overview?.totalUsers || 0,
            totalSessions: overview?.totalSessions || 0,
            totalPageViews: overview?.totalPageViews || 0,
            avgSessionDuration: overview?.avgSessionDuration || 0,
            bounceRate: overview?.bounceRate || 0,
            sessionsPerUser: overview?.sessionsPerUser || 0,
            activeUsers: realTime?.activeUsers || 0,
            topPages: topPages || [],
            devices: devices || [],
            trafficSources: trafficSources || [],
          });
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        // Fail silently for analytics - it's optional
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalyticsData();

    // Refresh real-time data every 60 seconds
    const interval = setInterval(async () => {
      try {
        const realtimeResponse = await get("analytics/realtime");
        if (realtimeResponse?.success) {
          setAnalyticsData(prev => ({
            ...prev,
            activeUsers: realtimeResponse.data.activeUsers || 0,
          }));
        }
      } catch (error) {
        console.error("Error refreshing real-time data:", error);
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCreateBlog = () => {
    navigate("/blogs/create");
  };

  const handleViewBlogs = () => {
    navigate("/blogs");
  };

  const isLoading = loading || dataLoading;

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

  const NoBlogsCard = () => (
    <div className="text-center py-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            No Blogs Available
          </h3>
          <p className="text-xs text-gray-600 max-w-md">
            Your blog portfolio is empty. Create your first blog post to start sharing your content with the world.
          </p>
        </div>
        <Button
          onClick={handleCreateBlog}
          className="mt-4 text-xs bg-primary text-secondary hover:bg-primary/90"
        >
          <IoIosAddCircleOutline className="w-4 h-4 mr-2" />
          Create Your First Blog
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Google Analytics Section */}
          {/* <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Website Analytics (Last 30 Days)
              </h2>
              {!analyticsLoading && (
                <span className="text-xs text-gray-500">
                  Powered by Google Analytics
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Activity className="h-4 w-4 text-green-600 mr-1" />
                      <p className="text-xs text-green-700 font-medium uppercase">
                        Active Now
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-12" />
                      ) : (
                        <span className="flex items-center gap-2">
                          {analyticsData.activeUsers}
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-green-600">
                      Live visitors
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Visitors */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-blue-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Total Visitors
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        analyticsData.totalUsers.toLocaleString()
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Unique users
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Sessions */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MousePointerClick className="h-4 w-4 text-purple-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Total Sessions
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        analyticsData.totalSessions.toLocaleString()
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      User sessions
                    </p>
                  </div>
                </div>
              </div>

              {/* Page Views */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Page Views
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        analyticsData.totalPageViews.toLocaleString()
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total views
                    </p>
                  </div>
                </div>
              </div>

              {/* Avg Session Duration */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-indigo-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Avg Duration
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        formatDuration(analyticsData.avgSessionDuration)
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Per session
                    </p>
                  </div>
                </div>
              </div>

              {/* Bounce Rate */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Bounce Rate
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        `${analyticsData.bounceRate.toFixed(1)}%`
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Exit rate
                    </p>
                  </div>
                </div>
              </div>

              {/* Sessions Per User */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-teal-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Sessions/User
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        analyticsData.sessionsPerUser.toFixed(2)
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Average visits
                    </p>
                  </div>
                </div>
              </div>

              {/* Device Breakdown Summary */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Monitor className="h-4 w-4 text-gray-600 mr-1" />
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Top Device
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {analyticsLoading ? (
                        <SkeletonBox className="h-6 w-20" />
                      ) : (
                        <span className="flex items-center gap-2">
                          {analyticsData.devices[0] ? getDeviceIcon(analyticsData.devices[0].device) : <Monitor className="w-5 h-5" />}
                          <span className="text-base capitalize">
                            {analyticsData.devices[0]?.device || 'N/A'}
                          </span>
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {analyticsData.devices[0]?.users.toLocaleString() || 0} users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Top Pages from Analytics */}
          {/* {!analyticsLoading && analyticsData.topPages.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Most Viewed Pages
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Top performing pages from Google Analytics
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {analyticsData.topPages.map((page, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-secondary rounded-full flex items-center justify-center text-xs font-bold">
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
                            {page.views.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">views</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-700">
                            {page.users.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">users</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} */}

          {/* Device & Traffic Sources Grid */}
          {/* {!analyticsLoading && (analyticsData.devices.length > 0 || analyticsData.trafficSources.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {analyticsData.devices.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">
                      Device Breakdown
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Visitors by device type
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {analyticsData.devices.map((device, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(device.device)}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 capitalize">
                                {device.device}
                              </p>
                              <p className="text-xs text-gray-500">
                                {device.sessions.toLocaleString()} sessions
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {device.users.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">users</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Traffic Sources */}
              {analyticsData.trafficSources.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">
                      Traffic Sources
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Where visitors come from
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {analyticsData.trafficSources.slice(0, 5).map((source, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {source.source}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {source.medium}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-lg font-bold text-gray-900">
                              {source.sessions.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">sessions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )} */}

          {/* Blog Performance Section */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Blog Performance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileText className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500 font-medium">
                        Total Blogs
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {isLoading ? (
                        <SkeletonBox className="h-6 w-12" />
                      ) : (
                        stats.totalBlogs
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Published blog posts
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500 font-medium">
                        Total Comments
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {isLoading ? (
                        <SkeletonBox className="h-6 w-16" />
                      ) : (
                        stats.totalComments
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      User engagements
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Heart className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500 font-medium">
                        Total Reactions
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {isLoading ? (
                        <SkeletonBox className="h-6 w-12" />
                      ) : (
                        stats.totalReactions
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      User reactions
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Eye className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500 font-medium">
                        Total Views
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {isLoading ? (
                        <SkeletonBox className="h-6 w-12" />
                      ) : (
                        stats.totalViews
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Page views
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Blogs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Recent Blogs
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your latest blog posts
                </p>
              </div>
              <button
                onClick={handleViewBlogs}
                className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-sm text-xs uppercase font-medium transition-colors duration-200"
              >
                View All
              </button>
            </div>
            <div className="p-4 space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-3"
                  >
                    <SkeletonBox className="h-4 w-3/4 mb-2" />
                    <SkeletonBox className="h-3 w-1/2 mb-3" />
                    <SkeletonBox className="h-2 w-full" />
                  </div>
                ))
              ) : stats.recentBlogs.length > 0 ? (
                stats.recentBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                  >
                    <div className="w-full flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
                            {blog.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-0.5">
                            By {blog.author} | {blog.category}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(blog.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex flex-wrap gap-4 items-center text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {blog.view_count} views
                        </span>
                        <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                          {blog.comment_count} comments
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {blog.reaction_count} reactions
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg min-w-fit h-fit self-end sm:self-center ${
                        blog.visible
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {blog.visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                ))
              ) : (
                <NoBlogsCard />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function Dashboard({ loading, onRefresh }) {
  return (
    <EnhancedDashboardContent
      loading={loading}
      onRefresh={onRefresh}
    />
  );
}