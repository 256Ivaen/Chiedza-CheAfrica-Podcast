"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Heart,
  Eye,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  EyeOff,
  Calendar,
  User,
  Tag,
  X,
} from "lucide-react";
import { get, del, post } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    primary: "bg-primary/10 text-primary",
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, blogTitle, loading }) => {
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
          Are you sure you want to delete <span className="font-semibold">"{blogTitle}"</span>? All comments and reactions will be permanently removed.
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

// Blog Actions Dropdown
const BlogActionsDropdown = ({ blog, onEdit, onDelete, onToggleVisibility }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit Blog
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                {blog.visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {blog.visible ? "Hide Blog" : "Show Blog"}
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
export default function AllBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blog: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await get("blogs?include_hidden=true");

      if (response?.success && response?.data?.blogs) {
        setBlogs(response.data.blogs);
        setFilteredBlogs(response.data.blogs);
      } else {
        setBlogs([]);
        setFilteredBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
      setBlogs([]);
      setFilteredBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...blogs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === filterCategory);
    }

    // Visibility filter
    if (filterVisibility !== "all") {
      filtered = filtered.filter((blog) =>
        filterVisibility === "visible" ? blog.visible : !blog.visible
      );
    }

    setFilteredBlogs(filtered);
  }, [searchQuery, filterCategory, filterVisibility, blogs]);

  // Get unique categories
  const categories = ["all", ...new Set(blogs.map((blog) => blog.category))];

  // Toggle visibility
  const handleToggleVisibility = async (blogId) => {
    try {
      const response = await post(`blogs/${blogId}/toggle-visibility`);
      if (response.success) {
        toast.success("Blog visibility updated");
        fetchBlogs();
      } else {
        toast.error("Failed to update visibility");
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  // Delete blog
  const handleDeleteBlog = async () => {
    if (!deleteModal.blog) return;

    setDeleteLoading(true);
    try {
      const response = await del(`blogs/${deleteModal.blog.id}`);
      if (response.success) {
        toast.success("Blog deleted successfully");
        setDeleteModal({ isOpen: false, blog: null });
        fetchBlogs();
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

  // No blogs empty state
  const NoBlogsState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blogs Found</h3>
      <p className="text-xs text-gray-600 mb-6 max-w-md mx-auto">
        {searchQuery || filterCategory !== "all" || filterVisibility !== "all"
          ? "Try adjusting your filters or search query"
          : "Get started by creating your first blog post"}
      </p>
      {!searchQuery && filterCategory === "all" && filterVisibility === "all" && (
        <button
          onClick={() => navigate("/blogs/create")}
          className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors text-xs font-medium inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Your First Blog
        </button>
      )}
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
                <h1 className="text-base font-bold text-gray-900 mb-0.5">All Blogs</h1>
                <p className="text-xs text-gray-500">
                  Manage and organize your blog posts
                </p>
              </div>
              <button
                onClick={() => navigate("/blogs/create")}
                className="px-3 py-1.5 bg-primary text-secondary rounded-sm hover:bg-primary/90 transition-colors text-xs font-medium uppercase inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Blog
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search blogs by title, author, or category..."
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
                  {(filterCategory !== "all" || filterVisibility !== "all") && (
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs"
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category === "all"
                                  ? "All Categories"
                                  : category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Visibility
                          </label>
                          <select
                            value={filterVisibility}
                            onChange={(e) => setFilterVisibility(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs"
                          >
                            <option value="all">All Posts</option>
                            <option value="visible">Visible Only</option>
                            <option value="hidden">Hidden Only</option>
                          </select>
                        </div>
                      </div>

                      {(filterCategory !== "all" || filterVisibility !== "all") && (
                        <button
                          onClick={() => {
                            setFilterCategory("all");
                            setFilterVisibility("all");
                          }}
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
                Showing <span className="font-semibold text-gray-900">{filteredBlogs.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{blogs.length}</span> blogs
              </span>
              {(searchQuery || filterCategory !== "all" || filterVisibility !== "all") && (
                <span className="text-primary font-medium">Filters active</span>
              )}
            </div>
          </motion.div>

          {/* Blogs Grid */}
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <SkeletonBox className="h-4 w-3/4 mb-2" />
                      <SkeletonBox className="h-3 w-1/2" />
                    </div>
                    <SkeletonBox className="h-6 w-16" />
                  </div>
                  <SkeletonBox className="h-3 w-full mb-2" />
                  <SkeletonBox className="h-3 w-2/3" />
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
                  className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-0.5 line-clamp-2">
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

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {blog.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {blog.comment_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {blog.reaction_count || 0}
                        </span>
                        {blog.featured && (
                          <Badge variant="primary">Featured</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={blog.visible ? "success" : "default"}>
                        {blog.visible ? "Visible" : "Hidden"}
                      </Badge>
                      <BlogActionsDropdown
                        blog={blog}
                        onEdit={() => navigate(`/blogs/${blog.id}/edit`)}
                        onDelete={() => setDeleteModal({ isOpen: true, blog })}
                        onToggleVisibility={() => handleToggleVisibility(blog.id)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <NoBlogsState />
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, blog: null })}
            onConfirm={handleDeleteBlog}
            blogTitle={deleteModal.blog?.title}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}