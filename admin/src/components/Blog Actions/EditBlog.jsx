"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  FileText,
  User,
  Tag,
  Image as ImageIcon,
  AlignLeft,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  EyeOff,
} from "lucide-react";
import { MdOutlineContentPasteGo } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { get, put } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const imageInputRef = useRef(null);
  const heroInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    image: "",
    hero_image: "",
    excerpt: "",
    content: "",
    featured: false,
    visible: true,
    tags: [],
    read_time: "5 min read",
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  // Predefined categories
  const categories = [
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Entertainment",
    "Sports",
    "Science",
    "Travel",
    "Food",
    "Fashion",
    "Other",
  ];

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetchLoading(true);
        const response = await get(`blogs/${id}`);

        if (response?.success && response?.data) {
          const blog = response.data;
          setFormData({
            title: blog.title || "",
            category: blog.category || "",
            author: blog.author || "",
            image: blog.image || "",
            hero_image: blog.hero_image || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            featured: Boolean(blog.featured),
            visible: Boolean(blog.visible),
            tags: Array.isArray(blog.tags) ? blog.tags : [],
            read_time: blog.read_time || "5 min read",
          });
        } else {
          toast.error("Blog not found");
          navigate("/blogs");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog");
        navigate("/blogs");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle image selection
  const handleImageSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    toast.info("Image selected for preview. Please ensure image URLs are properly hosted elsewhere.");
    
    setFormData((prev) => ({
      ...prev,
      [type === "hero" ? "hero_image" : "image"]: imageUrl,
    }));

    e.target.value = "";
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author name is required";
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        title: formData.title.trim(),
        category: formData.category,
        author: formData.author.trim(),
        image: formData.image,
        hero_image: formData.hero_image,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        featured: Boolean(formData.featured),
        visible: Boolean(formData.visible),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        hero_data: {},
        read_time: formData.read_time || "5 min read",
      };

      console.log("Updating blog data:", submitData);

      const response = await put(`blogs/${id}`, submitData);

      if (response.success) {
        toast.success(response.message || "Blog updated successfully!");
        navigate(`/blogs/${id}`);
      } else {
        toast.error(response.message || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to update blog. Check console for details.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields to preview");
      return;
    }
    navigate(`/blogs/${id}`);
  };

  // Clear image
  const clearImage = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type === "hero" ? "hero_image" : "image"]: "",
    }));
  };

  // Loading state
  if (fetchLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <SkeletonBox className="h-8 w-32 mb-6" />
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <SkeletonBox className="h-6 w-48 mb-4" />
                <SkeletonBox className="h-10 w-full mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <SkeletonBox className="h-10 w-full" />
                  <SkeletonBox className="h-10 w-full" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <SkeletonBox className="h-6 w-32 mb-4" />
                <SkeletonBox className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(`/blogs/${id}`)}
              className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 mb-4 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-base font-bold text-gray-900 mb-0.5">Edit Blog</h1>
                <p className="text-xs text-gray-500">
                  Update your blog post details
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-sm text-xs font-medium uppercase inline-flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  type="submit"
                  form="blog-form"
                  disabled={loading}
                  className="px-3 py-1.5 bg-primary text-secondary rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-colors text-xs font-medium uppercase inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Blog
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            id="blog-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" />
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title..."
                    className={`w-full px-3 py-2 border ${
                      errors.title ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Category and Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.category ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Author name"
                      className={`w-full px-3 py-2 border ${
                        errors.author ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs`}
                    />
                    {errors.author && (
                      <p className="text-xs text-red-500 mt-1">{errors.author}</p>
                    )}
                  </div>
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleChange}
                    placeholder="e.g., 5 min read"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type a tag and press Enter"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-secondary" />
                Images
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs mb-2"
                  />
                  <div className="relative">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Cover"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => clearImage("cover")}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary"
                      >
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-medium">
                          Select Cover Image
                        </span>
                      </button>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, "cover")}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Hero Image URL
                  </label>
                  <input
                    type="text"
                    name="hero_image"
                    value={formData.hero_image}
                    onChange={handleChange}
                    placeholder="https://example.com/hero-image.jpg"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs mb-2"
                  />
                  <div className="relative">
                    {formData.hero_image ? (
                      <div className="relative">
                        <img
                          src={formData.hero_image}
                          alt="Hero"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => clearImage("hero")}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => heroInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary"
                      >
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-medium">
                          Select Hero Image
                        </span>
                      </button>
                    )}
                    <input
                      ref={heroInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, "hero")}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: Provide full image URLs or use the file selector for local preview. Images need to be hosted elsewhere.
              </p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MdOutlineContentPasteGo className="w-4 h-4 text-secondary" />
                Content
              </h2>

              <div className="space-y-4">
                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Subtitle <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your blog post..."
                    className={`w-full px-3 py-2 border ${
                      errors.excerpt ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs resize-none`}
                  />
                  {errors.excerpt && (
                    <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Blog Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={12}
                    placeholder="Write your blog content here..."
                    className={`w-full px-3 py-2 border ${
                      errors.content ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs resize-none`}
                  />
                  {errors.content && (
                    <p className="text-xs text-red-500 mt-1">{errors.content}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CiSettings className="w-4 h-4 text-secondary" />
                Settings
              </h2>

              <div className="space-y-3">
                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {formData.featured ? (
                      <ToggleRight className="w-5 h-5 text-primary" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-900">Featured Blog</p>
                      <p className="text-xs text-gray-500">Show in featured section</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Visible Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {formData.visible ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-900">Visibility</p>
                      <p className="text-xs text-gray-500">
                        {formData.visible ? "Visible to public" : "Hidden from public"}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="visible"
                      checked={formData.visible}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons - Mobile */}
            <div className="sm:hidden flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePreview}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-sm text-xs font-medium uppercase inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-primary text-secondary rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-colors text-xs font-medium uppercase inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Blog
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;