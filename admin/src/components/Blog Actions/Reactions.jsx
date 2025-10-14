"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  X,
  ExternalLink,
  ThumbsUp,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react";
import { get } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const Badge = ({ children, variant = "default", icon }) => {
  const variants = {
    like: "bg-blue-100 text-blue-700",
    love: "bg-red-100 text-red-700",
    insightful: "bg-purple-100 text-purple-700",
    celebrate: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${variants[variant]}`}>
      {icon}
      {children}
    </span>
  );
};

const reactionIcons = {
  like: <ThumbsUp className="w-3 h-3" />,
  love: <Heart className="w-3 h-3" />,
  insightful: <Sparkles className="w-3 h-3" />,
  celebrate: <Award className="w-3 h-3" />,
};

// Main Component
export default function Reactions() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalStats, setTotalStats] = useState({
    like: 0,
    love: 0,
    insightful: 0,
    celebrate: 0,
    total: 0,
  });

  // Fetch all blogs with reactions
  const fetchBlogsWithReactions = async () => {
    try {
      setLoading(true);
      const blogsResponse = await get("blogs?include_hidden=true");

      if (blogsResponse?.success && blogsResponse?.data?.blogs) {
        const blogsWithReactions = [];
        let stats = { like: 0, love: 0, insightful: 0, celebrate: 0, total: 0 };

        for (const blog of blogsResponse.data.blogs) {
          try {
            const reactionsResponse = await get(`blogs/${blog.id}/reactions`);
            if (reactionsResponse?.success && reactionsResponse?.data?.reactions) {
              const reactions = reactionsResponse.data.reactions;
              const reactionCounts = {
                like: 0,
                love: 0,
                insightful: 0,
                celebrate: 0,
              };

              reactions.forEach((reaction) => {
                const count = parseInt(reaction.count) || 0;
                reactionCounts[reaction.type] = count;
                stats[reaction.type] += count;
                stats.total += count;
              });

              blogsWithReactions.push({
                ...blog,
                reactions: reactionCounts,
                totalReactions: Object.values(reactionCounts).reduce((a, b) => a + b, 0),
              });
            } else {
              blogsWithReactions.push({
                ...blog,
                reactions: { like: 0, love: 0, insightful: 0, celebrate: 0 },
                totalReactions: 0,
              });
            }
          } catch (error) {
            console.error(`Error fetching reactions for blog ${blog.id}:`, error);
            blogsWithReactions.push({
              ...blog,
              reactions: { like: 0, love: 0, insightful: 0, celebrate: 0 },
              totalReactions: 0,
            });
          }
        }

        // Sort by total reactions
        blogsWithReactions.sort((a, b) => b.totalReactions - a.totalReactions);

        setBlogs(blogsWithReactions);
        setFilteredBlogs(blogsWithReactions);
        setTotalStats(stats);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load reactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsWithReactions();
  }, []);

  // Search logic
  useEffect(() => {
    let filtered = [...blogs];

    if (searchQuery) {
      filtered = filtered.filter((blog) =>
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  // No reactions empty state
  const NoReactionsState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reactions Found</h3>
      <p className="text-xs text-gray-600 mb-6 max-w-md mx-auto">
        {searchQuery
          ? "Try adjusting your search query"
          : "No reactions have been added yet"}
      </p>
    </motion.div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <h1 className="text-base font-bold text-gray-900 mb-0.5">Reactions</h1>
              <p className="text-xs text-gray-500">
                View and analyze reactions across all blog posts
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Like</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {loading ? <SkeletonBox className="h-6 w-12" /> : totalStats.like}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Love</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {loading ? <SkeletonBox className="h-6 w-12" /> : totalStats.love}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Insightful</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {loading ? <SkeletonBox className="h-6 w-12" /> : totalStats.insightful}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Celebrate</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {loading ? <SkeletonBox className="h-6 w-12" /> : totalStats.celebrate}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Total</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {loading ? <SkeletonBox className="h-6 w-12" /> : totalStats.total}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <span>
                Showing <span className="font-semibold text-gray-900">{filteredBlogs.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{blogs.length}</span> blogs
              </span>
            </div>
          </motion.div>

          {/* Blogs List */}
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <SkeletonBox className="h-4 w-3/4 mb-2" />
                      <SkeletonBox className="h-3 w-1/2" />
                    </div>
                  </div>
                  <SkeletonBox className="h-6 w-full" />
                </div>
              ))
            ) : filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {blog.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/blogs/${blog.id}`);
                          }}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Blog
                        </button>
                      </div>
  
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {blog.totalReactions}
                        </p>
                        <p className="text-xs text-gray-500">Total Reactions</p>
                      </div>
                    </div>
  
                    {/* Reaction Breakdown */}
                    <div className="flex flex-wrap gap-2">
                      {blog.reactions.like > 0 && (
                        <Badge variant="like" icon={reactionIcons.like}>
                          {blog.reactions.like} Like{blog.reactions.like !== 1 && "s"}
                        </Badge>
                      )}
                      {blog.reactions.love > 0 && (
                        <Badge variant="love" icon={reactionIcons.love}>
                          {blog.reactions.love} Love
                        </Badge>
                      )}
                      {blog.reactions.insightful > 0 && (
                        <Badge variant="insightful" icon={reactionIcons.insightful}>
                          {blog.reactions.insightful} Insightful
                        </Badge>
                      )}
                      {blog.reactions.celebrate > 0 && (
                        <Badge variant="celebrate" icon={reactionIcons.celebrate}>
                          {blog.reactions.celebrate} Celebrate
                        </Badge>
                      )}
                      {blog.totalReactions === 0 && (
                        <span className="text-xs text-gray-500">No reactions yet</span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <NoReactionsState />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }