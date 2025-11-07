"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  Clock,
  MessageSquare,
  Heart,
  ThumbsUp,
  Sparkles,
  Award,
  Shield,
  MoreVertical,
  Mail,
} from "lucide-react";
import { get, del, patch } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const Badge = ({ children, variant = "default", icon }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    primary: "bg-primary/10 text-primary",
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

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-lg max-w-md w-full p-6 border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Delete Blog</h3>
            <p className="text-xs text-gray-600">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-xs text-gray-700 mb-6">
          Are you sure you want to delete this blog? All comments, reactions, and views will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-xs font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3" />
                Delete Blog
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Actions Dropdown
const ActionsDropdown = ({ onEdit, onDelete, onToggleVisibility, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-gray-200 py-1 z-20"
            >
              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit Blog
              </button>
              <button
                onClick={() => {
                  onToggleVisibility();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {isVisible ? "Hide Blog" : "Show Blog"}
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete Blog
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
export default function BlogDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  // Fetch blog details
  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch blog
      const blogResponse = await get(`blogs/${id}`);
      if (blogResponse?.success && blogResponse?.data) {
        setBlog(blogResponse.data);
      } else {
        toast.error("Blog not found");
        navigate("/dashboard/blogs");
        return;
      }

      // Fetch comments
      try {
        const commentsResponse = await get(`blogs/${id}/comments`);
        if (commentsResponse?.success && commentsResponse?.data) {
          const allComments = Array.isArray(commentsResponse.data) 
            ? commentsResponse.data 
            : [];
          setComments(allComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }

      // Fetch reactions
      try {
        const reactionsResponse = await get(`blogs/${id}/reactions`);
        if (reactionsResponse?.success && reactionsResponse?.data?.reactions) {
          const reactionCounts = {
            like: 0,
            love: 0,
            insightful: 0,
            celebrate: 0,
          };
          
          reactionsResponse.data.reactions.forEach((reaction) => {
            reactionCounts[reaction.type] = parseInt(reaction.count) || 0;
          });
          
          setReactions(reactionCounts);
        }
      } catch (error) {
        console.error("Error fetching reactions:", error);
        setReactions({ like: 0, love: 0, insightful: 0, celebrate: 0 });
      }

    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Failed to load blog details");
      navigate("/dashboard/blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  // Toggle visibility
  const handleToggleVisibility = async () => {
    setVisibilityLoading(true);
    try {
      const response = await patch(`blogs/${id}/visibility`);
      if (response.success) {
        toast.success(response.message || "Blog visibility updated");
        fetchBlogDetails();
      } else {
        toast.error(response.message || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to update visibility";
      toast.error(errorMessage);
    } finally {
      setVisibilityLoading(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async () => {
    setDeleteLoading(true);
    try {
      const response = await del(`blogs/${id}`);
      if (response.success) {
        toast.success("Blog deleted successfully");
        navigate("/dashboard/blogs");
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <SkeletonBox className="h-8 w-32 mb-6" />
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <SkeletonBox className="h-10 w-3/4 mb-4" />
              <SkeletonBox className="h-4 w-1/2 mb-6" />
              <SkeletonBox className="h-64 w-full mb-6" />
              <SkeletonBox className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const totalReactions = reactions 
    ? Object.values(reactions).reduce((a, b) => a + b, 0) 
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate("/dashboard/blogs")}
              className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </button>
          </motion.div>

          {/* Main Content - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blog Content - Left Side (2 columns on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant={blog.visible ? "success" : "default"}>
                        {blog.visible ? "Visible" : "Hidden"}
                      </Badge>
                      {blog.featured === 1 && (
                        <Badge variant="primary">Featured</Badge>
                      )}
                      {visibilityLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-gray-500 flex items-center gap-1"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"
                          />
                          Updating...
                        </motion.div>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                      {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {blog.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {blog.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.read_time}
                      </span>
                    </div>
                  </div>

                  <ActionsDropdown
                    onEdit={() => navigate(`/dashboard/blogs/${id}/edit`)}
                    onDelete={() => setDeleteModal(true)}
                    onToggleVisibility={handleToggleVisibility}
                    isVisible={blog.visible}
                  />
                </div>

                {/* Tags */}
                {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Excerpt */}
                {blog.excerpt && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
              </motion.div>

              {/* Cover/Hero Images */}
              {(blog.image || blog.hero_image) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Cover Images</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {blog.image && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Cover Image</p>
                        <img
                          src={blog.image}
                          alt="Cover"
                          className="w-full object-cover rounded-lg border border-gray-200"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}
                    {blog.hero_image && blog.hero_image !== blog.image && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Hero Image</p>
                        <img
                          src={blog.hero_image}
                          alt="Hero"
                          className="w-full object-cover rounded-lg border border-gray-200"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Blog Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-sm font-bold text-gray-900 mb-4">Content</h2>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </motion.div>

              {/* Comments Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Comments ({blog.comment_count || comments.length})
                  </h2>
                </div>

                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-l-2 border-gray-200 pl-4 py-2"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            {comment.is_admin_reply ? (
                              <Shield className="w-3 h-3 text-primary" />
                            ) : (
                              <User className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-semibold text-gray-900">
                                {comment.name || comment.admin_email}
                              </p>
                              {comment.is_admin_reply && (
                                <Badge variant="primary">Admin</Badge>
                              )}
                            </div>
                            {comment.email && !comment.is_admin_reply && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                <Mail className="w-3 h-3" />
                                {comment.email}
                              </p>
                            )}
                            <p className="text-xs text-gray-700 mb-1">
                              {comment.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-8 mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="border-l-2 border-primary/20 pl-4 py-2"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    {reply.is_admin_reply ? (
                                      <Shield className="w-3 h-3 text-primary" />
                                    ) : (
                                      <User className="w-3 h-3 text-primary" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-xs font-semibold text-gray-900">
                                        {reply.name || reply.admin_email}
                                      </p>
                                      {reply.is_admin_reply && (
                                        <Badge variant="primary">Admin</Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-700 mb-1">
                                      {reply.content}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(reply.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No comments yet</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Right Side (1 column) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-sm font-bold text-gray-900 mb-4">Statistics</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Views
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {blog.view_count || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comments
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {blog.comment_count || comments.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Reactions
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {blog.reaction_count || totalReactions}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Reactions Card */}
              {reactions && totalReactions > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Reactions Breakdown</h2>
                  <div className="space-y-3">
                    {reactions.like > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge variant="like" icon={reactionIcons.like}>
                          Like
                        </Badge>
                        <span className="text-sm font-bold text-gray-900">
                          {reactions.like}
                        </span>
                      </div>
                    )}
                    {reactions.love > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge variant="love" icon={reactionIcons.love}>
                          Love
                        </Badge>
                        <span className="text-sm font-bold text-gray-900">
                          {reactions.love}
                        </span>
                      </div>
                    )}
                    {reactions.insightful > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge variant="insightful" icon={reactionIcons.insightful}>
                          Insightful
                        </Badge>
                        <span className="text-sm font-bold text-gray-900">
                          {reactions.insightful}
                        </span>
                      </div>
                    )}
                    {reactions.celebrate > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge variant="celebrate" icon={reactionIcons.celebrate}>
                          Celebrate
                        </Badge>
                        <span className="text-sm font-bold text-gray-900">
                          {reactions.celebrate}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* View Stats Card */}
              {blog.view_stats && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <h2 className="text-sm font-bold text-gray-900 mb-4">View Analytics</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Views</p>
                      <p className="text-lg font-bold text-gray-900">
                        {blog.view_stats.total_views || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Unique Visitors</p>
                      <p className="text-lg font-bold text-gray-900">
                        {blog.view_stats.unique_views || 0}
                      </p>
                    </div>
                    {parseFloat(blog.view_stats.avg_duration) > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Avg. Read Time</p>
                        <p className="text-lg font-bold text-gray-900">
                          {Math.round(parseFloat(blog.view_stats.avg_duration) / 60)}m
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Actions Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/dashboard/blogs/${id}/edit`)}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors text-xs font-medium uppercase flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Blog
                  </button>
                  <button
                    onClick={handleToggleVisibility}
                    disabled={visibilityLoading}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 disabled:opacity-50 transition-colors text-xs font-medium uppercase flex items-center justify-center gap-2"
                  >
                    {visibilityLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        {blog.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {blog.visible ? "Hide Blog" : "Show Blog"}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <DeleteModal
            isOpen={deleteModal}
            onClose={() => setDeleteModal(false)}
            onConfirm={handleDeleteBlog}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>

      {/* Rich Text & Grid Styling */}
      <style jsx global>{`
        /* Base text size - text-xs (0.75rem / 12px) */
        .prose {
          font-size: 0.75rem;
          line-height: 1.6;
          color: #374151;
        }

        .prose p {
          margin-bottom: 0.75em;
          margin-top: 0.75em;
        }

        .prose h1 {
          font-size: 1.75em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #111827;
        }

        .prose h2 {
          font-size: 1.4em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #111827;
        }

        .prose h3 {
          font-size: 1.15em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #111827;
        }

        .prose h4 {
          font-size: 1em;
          font-weight: 600;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #111827;
        }

        .prose strong, .prose b {
          font-weight: 600;
          color: #111827;
        }

        .prose em, .prose i {
          font-style: italic;
        }

        .prose u {
          text-decoration: underline;
        }

        .prose a {
          color: #667eea;
          text-decoration: underline;
          font-weight: 500;
        }

        .prose a:hover {
          color: #5568d3;
        }

        .prose blockquote {
          border-left: 4px solid #667eea;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #64748b;
        }

        .prose ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .prose ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .prose li {
          margin: 0.5em 0;
          padding-left: 0.25em;
        }

        .prose li::marker {
          color: #667eea;
        }

        .prose img {
          margin: 0.75em 0;
          border-radius: 0.5rem;
          max-width: 100%;
          height: auto;
        }

        .prose code {
          color: #111827;
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-weight: 600;
        }

        .prose pre {
          background-color: #1f2937;
          color: #e5e7eb;
          overflow-x: auto;
          font-size: 0.875em;
          margin: 1em 0;
          border-radius: 0.5rem;
          padding: 1em;
        }

        .prose pre code {
          background-color: transparent;
          color: inherit;
          font-size: inherit;
          font-weight: inherit;
          padding: 0;
        }

        .prose hr {
          border-color: #e5e7eb;
          margin: 2em 0;
        }

        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
          font-size: 0.875em;
        }

        .prose th,
        .prose td {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
          text-align: left;
        }

        .prose th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        /* ==================== GRID LAYOUTS ==================== */
        /* All layouts maintain exactly 500px height on desktop */

        /* Base Grid Parent */
        .prose .blog-grid-parent {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(5, 1fr);
          gap: 8px;
          margin: 1.5em 0;
          overflow: hidden;
          width: 100%;
        }

        /* Single Image Layout - Exactly 500px height */
        .prose .blog-grid-single {
          min-height: 500px;
          max-height: 500px;
          height: 500px;
        }

        .prose .blog-grid-single .blog-grid-div1 {
          grid-area: 1 / 1 / 6 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        /* Double Image Layout - Exactly 500px height */
        .prose .blog-grid-double {
          min-height: 500px;
          max-height: 500px;
          height: 500px;
        }

        .prose .blog-grid-double .blog-grid-div1 {
          grid-area: 1 / 1 / 6 / 3;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .prose .blog-grid-double .blog-grid-div2 {
          grid-area: 1 / 3 / 6 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        /* Triple Image Layout - Exactly 500px height */
        .prose .blog-grid-triple {
          min-height: 500px;
          max-height: 500px;
          height: 500px;
        }

        .prose .blog-grid-triple .blog-grid-div1 {
          grid-area: 1 / 1 / 6 / 4;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .prose .blog-grid-triple .blog-grid-div2 {
          grid-area: 1 / 4 / 3 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .prose .blog-grid-triple .blog-grid-div3 {
          grid-area: 3 / 4 / 6 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        /* Responsive: Mobile devices (under 640px) */
        @media (max-width: 640px) {
          .prose .blog-grid-single,
          .prose .blog-grid-double,
          .prose .blog-grid-triple {
            min-height: 300px;
            max-height: 300px;
            height: 300px;
          }
        }

        /* Responsive: Tablet devices (641px to 1024px) */
        @media (min-width: 641px) and (max-width: 1024px) {
          .prose .blog-grid-single,
          .prose .blog-grid-double,
          .prose .blog-grid-triple {
            min-height: 400px;
            max-height: 400px;
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
}