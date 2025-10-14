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
  const [dataLoading, setDataLoading] = useState(true);

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

  const handleCreateBlog = () => {
    navigate("/blogs/create");
  };

  const handleViewBlogs = () => {
    navigate("/blogs");
  };

  const isLoading = loading || dataLoading;

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