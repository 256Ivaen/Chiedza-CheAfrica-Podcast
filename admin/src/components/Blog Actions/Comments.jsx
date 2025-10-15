"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  Filter,
  X,
  Trash2,
  ExternalLink,
  User,
  Calendar,
  Mail,
  Reply,
  Shield,
  Send,
} from "lucide-react";
import { get, del, post } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
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
            <h3 className="text-base font-bold text-gray-900">Delete Comment</h3>
            <p className="text-xs text-gray-600">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-xs text-gray-700 mb-6">
          Are you sure you want to delete this comment? This will also remove all replies to this comment.
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
                Delete Comment
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Reply Modal
const ReplyModal = ({ isOpen, onClose, onConfirm, loading, comment }) => {
  const [replyContent, setReplyContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!replyContent.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }
    onConfirm(replyContent);
  };

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
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Reply className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Reply to Comment</h3>
            <p className="text-xs text-gray-600">Add an admin reply</p>
          </div>
        </div>

        {/* Original Comment Preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">
            <strong>{comment.name || comment.admin_email || "Unknown"}</strong> on{" "}
            {comment.blog_title}
          </p>
          <p className="text-xs text-gray-700">{comment.content}</p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Your Reply
          </label>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your reply here..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !replyContent.trim()}
            className="flex-1 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-xs font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-secondary border-t-transparent rounded-full"
                />
                Sending...
              </>
            ) : (
              <>
                Send Reply
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Main Component
export default function Comments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, comment: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [replyModal, setReplyModal] = useState({ isOpen: false, comment: null });
  const [replyLoading, setReplyLoading] = useState(false);

  // Fetch all comments from all blogs
  const fetchAllComments = async () => {
    try {
      setLoading(true);
      const blogsResponse = await get("blogs?include_hidden=true");

      if (blogsResponse?.success && blogsResponse?.data?.blogs) {
        const allComments = [];
        
        for (const blog of blogsResponse.data.blogs) {
          try {
            const commentsResponse = await get(`blogs/${blog.id}/comments`);
            if (commentsResponse?.success && commentsResponse?.data) {
              const blogComments = Array.isArray(commentsResponse.data) 
                ? commentsResponse.data 
                : [];
              
              blogComments.forEach(comment => {
                allComments.push({
                  ...comment,
                  blog_title: blog.title,
                  blog_id: blog.id,
                });
              });
            }
          } catch (error) {
            console.error(`Error fetching comments for blog ${blog.id}:`, error);
          }
        }

        setComments(allComments);
        setFilteredComments(allComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...comments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (comment) =>
          comment.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.blog_title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType === "admin") {
      filtered = filtered.filter((comment) => comment.is_admin_reply === 1);
    } else if (filterType === "user") {
      filtered = filtered.filter((comment) => !comment.is_admin_reply);
    }

    setFilteredComments(filtered);
  }, [searchQuery, filterType, comments]);

  // Delete comment
  const handleDeleteComment = async () => {
    if (!deleteModal.comment) return;

    setDeleteLoading(true);
    try {
      const response = await del(`comments/${deleteModal.comment.id}`);
      if (response.success) {
        toast.success("Comment deleted successfully");
        setDeleteModal({ isOpen: false, comment: null });
        fetchAllComments();
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Reply to comment
  const handleReplyComment = async (replyContent) => {
    if (!replyModal.comment) return;

    setReplyLoading(true);
    try {
      const response = await post(
        `blogs/${replyModal.comment.blog_id}/comments/${replyModal.comment.id}/reply`,
        { content: replyContent }
      );
      
      if (response.success) {
        toast.success("Reply added successfully");
        setReplyModal({ isOpen: false, comment: null });
        fetchAllComments();
      } else {
        toast.error("Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setReplyLoading(false);
    }
  };

  // No comments empty state
  const NoCommentsState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Comments Found</h3>
      <p className="text-xs text-gray-600 mb-6 max-w-md mx-auto">
        {searchQuery || filterType !== "all"
          ? "Try adjusting your filters or search query"
          : "No comments have been posted yet"}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-base font-bold text-gray-900 mb-0.5">Comments</h1>
                <p className="text-xs text-gray-500">
                  Manage comments from all blog posts
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, content, or blog..."
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

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-lg border transition-colors text-xs font-medium inline-flex items-center gap-2 whitespace-nowrap ${
                    showFilters
                      ? "bg-primary text-secondary border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {filterType !== "all" && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Comment Type
                        </label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs"
                        >
                          <option value="all">All Comments</option>
                          <option value="user">User Comments</option>
                          <option value="admin">Admin Replies</option>
                        </select>
                      </div>

                      {filterType !== "all" && (
                        <button
                          onClick={() => setFilterType("all")}
                          className="mt-3 text-xs text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <span>
                Showing <span className="font-semibold text-gray-900">{filteredComments.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{comments.length}</span> comments
              </span>
              {(searchQuery || filterType !== "all") && (
                <span className="text-primary font-medium">Filters active</span>
              )}
            </div>
          </motion.div>

          {/* Comments List */}
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <SkeletonBox className="h-4 w-32 mb-2" />
                      <SkeletonBox className="h-3 w-48" />
                    </div>
                    <SkeletonBox className="h-6 w-20" />
                  </div>
                  <SkeletonBox className="h-3 w-full mb-2" />
                  <SkeletonBox className="h-3 w-2/3" />
                </div>
              ))
            ) : filteredComments.length > 0 ? (
              filteredComments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          {comment.is_admin_reply ? (
                            <Shield className="w-4 h-4 text-primary" />
                          ) : (
                            <User className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-gray-900">
                              {comment.name || comment.admin_email || "Unknown"}
                            </p>
                            {comment.is_admin_reply && (
                              <Badge variant="primary">Admin</Badge>
                            )}
                          </div>
                          {comment.email && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              {comment.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                        {comment.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => navigate(`/blogs/${comment.blog_id}`)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {comment.blog_title}
                        </button>
                        {comment.parent_id && (
                          <span className="flex items-center gap-1">
                            <Reply className="w-3 h-3" />
                            Reply to comment
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Reply Button - Only show for non-admin comments */}
                      {!comment.is_admin_reply && (
                        <button
                          onClick={() => setReplyModal({ isOpen: true, comment })}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Reply to comment"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, comment })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <NoCommentsState />
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, comment: null })}
            onConfirm={handleDeleteComment}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyModal.isOpen && (
          <ReplyModal
            isOpen={replyModal.isOpen}
            onClose={() => setReplyModal({ isOpen: false, comment: null })}
            onConfirm={handleReplyComment}
            loading={replyLoading}
            comment={replyModal.comment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}