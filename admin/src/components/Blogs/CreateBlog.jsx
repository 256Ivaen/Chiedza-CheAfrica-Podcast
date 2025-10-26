"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Upload,
  X,
  Tag,
  Image as ImageIcon,
  AlignLeft,
  Sparkles,
  EyeOff,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Grid3x3,
  Layers,
  Check,
  FileText,
  CheckCircle,
  Loader,
  Grid2x2,
  LayoutGrid,
} from "lucide-react";
import { post, upload } from "../../utils/service";
import { toast } from "sonner";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [currentStep, setCurrentStep] = useState(1);
  const thumbnailInputRef = useRef(null);
  const contentImagesInputRef = useRef(null);
  const editorRef = useRef(null);

  // Step 1: Basic Information
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    tags: [],
    visibility: "public",
    summary: "",
    featured: false,
  });

  // Step 2: Image Upload
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [contentImageFiles, setContentImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState({
    coverImage: "",
    contentImages: [],
  });

  // Step 3: Content Editor
  const [blogContent, setBlogContent] = useState("");
  const [showGridLayoutModal, setShowGridLayoutModal] = useState(false);
  const [selectedGridLayout, setSelectedGridLayout] = useState(null);
  const [gridImages, setGridImages] = useState([]);

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

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

  // ==================== STEP 1: BASIC INFORMATION ====================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      toast.success("Step 1 completed!");
    }
  };

  // ==================== STEP 2: IMAGE UPLOAD ====================

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const handleContentImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (contentImageFiles.length + files.length > 6) {
      toast.error(`You can only upload a maximum of 6 images. Currently you have ${contentImageFiles.length} image(s).`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setContentImageFiles((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} image(s) added`);
    }

    e.target.value = "";
  };

  const removeContentImage = (index) => {
    setContentImageFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const validateStep2 = () => {
    if (!thumbnailFile) {
      toast.error("Please upload a cover image");
      return false;
    }
    if (contentImageFiles.length === 0) {
      toast.error("Please upload at least one content image");
      return false;
    }
    return true;
  };

  const handleStep2Upload = async () => {
    if (!validateStep2()) return;

    setUploadingImages(true);
    const totalImages = 1 + contentImageFiles.length;
    setUploadProgress({ current: 0, total: totalImages });

    try {
      let coverImageUrl = "";
      const contentImageUrls = [];

      // Upload cover image first using 'image' field name
      toast.info("Uploading cover image...");
      setUploadProgress({ current: 1, total: totalImages });
      
      const coverFormData = new FormData();
      coverFormData.append("image", thumbnailFile);

      const coverResult = await upload("upload/image", coverFormData);

      if (coverResult.success && coverResult.data.url) {
        coverImageUrl = coverResult.data.url;
        toast.success("Cover image uploaded!");
      } else {
        throw new Error(coverResult.message || "Failed to upload cover image");
      }

      // Upload content images one by one using 'image' field name
      for (let i = 0; i < contentImageFiles.length; i++) {
        const file = contentImageFiles[i];
        toast.info(`Uploading image ${i + 1} of ${contentImageFiles.length}...`);
        setUploadProgress({ current: i + 2, total: totalImages });

        const imageFormData = new FormData();
        imageFormData.append("image", file);

        const imageResult = await upload("upload/image", imageFormData);

        if (imageResult.success && imageResult.data.url) {
          contentImageUrls.push({
            id: `img-${i}`,
            url: imageResult.data.url,
            name: file.name,
          });
        } else {
          throw new Error(imageResult.message || `Failed to upload ${file.name}`);
        }
      }

      // Store all uploaded URLs
      setUploadedImageUrls({
        coverImage: coverImageUrl,
        contentImages: contentImageUrls,
      });

      toast.success("All images uploaded successfully!");
      setCurrentStep(3);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  // ==================== STEP 3: CONTENT EDITOR ====================

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHeading = (level) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const heading = document.createElement(`h${level}`);
    
    if (range.toString()) {
      heading.textContent = range.toString();
      range.deleteContents();
      range.insertNode(heading);
    } else {
      heading.textContent = `Heading ${level}`;
      range.insertNode(heading);
    }
    
    const newRange = document.createRange();
    newRange.setStartAfter(heading);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    updateContent();
  };

  const insertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText) {
      setLinkText(selectedText);
    }
    setShowLinkModal(true);
  };

  const applyLink = () => {
    if (!linkUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    let url = linkUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (linkText.trim()) {
      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #667eea; text-decoration: underline;">${linkText}</a>`;
      document.execCommand('insertHTML', false, link);
    } else {
      execCommand('createLink', url);
    }

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    updateContent();
  };

  // Image Grid Layout Functions
  const openGridLayoutModal = () => {
    setSelectedGridLayout(null);
    setGridImages([]);
    setShowGridLayoutModal(true);
  };

  const selectGridLayout = (layout) => {
    setSelectedGridLayout(layout);
    const slots = layout === 'single' ? 1 : layout === 'double' ? 2 : 3;
    setGridImages(new Array(slots).fill(null));
  };

  const selectImageForSlot = (slotIndex, imageData) => {
    setGridImages(prev => {
      const newImages = [...prev];
      newImages[slotIndex] = imageData;
      return newImages;
    });
  };

  const insertGrid = () => {
    if (!selectedGridLayout) {
      toast.error("Please select a grid layout");
      return;
    }

    const emptySlots = gridImages.filter(img => img === null).length;
    if (emptySlots > 0) {
      toast.error(`Please fill all ${gridImages.length} image slot(s)`);
      return;
    }

    let htmlContent = '';

    if (selectedGridLayout === 'single') {
      // Single image - max height 300px
      const imageData = gridImages[0];
      htmlContent = `
        <div class="blog-grid-parent blog-grid-single">
          <div class="blog-grid-div1" style="background-image: url('${imageData.url}');"></div>
        </div>
      `;
    } 
    else if (selectedGridLayout === 'double') {
      // Double images side by side - max height 300px
      htmlContent = `
        <div class="blog-grid-parent blog-grid-double">
          <div class="blog-grid-div1" style="background-image: url('${gridImages[0].url}');"></div>
          <div class="blog-grid-div2" style="background-image: url('${gridImages[1].url}');"></div>
        </div>
      `;
    }
    else if (selectedGridLayout === 'triple') {
      // Triple images - max height 500px
      htmlContent = `
        <div class="blog-grid-parent blog-grid-triple">
          <div class="blog-grid-div1" style="background-image: url('${gridImages[0].url}');"></div>
          <div class="blog-grid-div2" style="background-image: url('${gridImages[1].url}');"></div>
          <div class="blog-grid-div3" style="background-image: url('${gridImages[2].url}');"></div>
        </div>
      `;
    }

    // Insert the grid and add a paragraph after it for continued typing
    const fullContent = htmlContent + '<p><br></p>';
    document.execCommand('insertHTML', false, fullContent);
    
    // Move cursor to the new paragraph
    if (editorRef.current) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      editorRef.current.focus();
    }
    
    updateContent();
    setShowGridLayoutModal(false);
    setSelectedGridLayout(null);
    setGridImages([]);
    
    toast.success("Image grid inserted successfully!");
  };

  const updateContent = () => {
    if (editorRef.current) {
      setBlogContent(editorRef.current.innerHTML);
    }
  };

  // ==================== FINAL SUBMISSION ====================

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!blogContent.trim()) {
      toast.error("Please add some content to your blog");
      return;
    }

    setLoading(true);

    try {
      const blogData = {
        title: formData.title.trim(),
        category: formData.category,
        author: formData.author || "Admin",
        image: uploadedImageUrls.coverImage,
        hero_image: uploadedImageUrls.coverImage,
        slideshow_images: [],
        excerpt: formData.summary.trim(),
        content: blogContent,
        featured: Boolean(formData.featured),
        visible: formData.visibility === "public",
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        hero_data: {},
        read_time: "5 min read",
      };

      const response = await post("blogs", blogData);

      if (response.success) {
        toast.success("Blog created successfully!");
        navigate("/dashboard/blogs");
      } else {
        toast.error(response.message || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(error.message || "An error occurred while creating the blog");
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard/blogs")}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h1 className="text-sm font-bold text-gray-900">Create New Blog</h1>
                <p className="text-xs text-gray-500">Step {currentStep} of 3</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                currentStep >= 1 ? 'bg-primary text-secondary' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-3 h-3" /> : <span>1</span>}
                <span className="hidden md:inline">Info</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                currentStep >= 2 ? 'bg-primary text-secondary' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-3 h-3" /> : <span>2</span>}
                <span className="hidden md:inline">Images</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                currentStep >= 3 ? 'bg-primary text-secondary' : 'bg-gray-200 text-gray-600'
              }`}>
                <span>3</span>
                <span className="hidden md:inline">Content</span>
              </div>
            </div>

            {/* Submit Button */}
            {currentStep === 3 && (
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary text-secondary rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-colors text-xs font-medium uppercase"
              >
                {loading ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    Create Blog
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {/* ==================== STEP 1: BASIC INFORMATION ==================== */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Basic Information</h2>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter your blog title..."
                    className={`w-full px-3 py-2 border ${
                      errors.title ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Category & Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.category ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter author name..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Write a brief summary of your blog..."
                    rows={4}
                    className={`w-full px-3 py-2 border ${
                      errors.summary ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs resize-none`}
                  />
                  {errors.summary && (
                    <p className="mt-1 text-xs text-red-500">{errors.summary}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type a tag and press Enter..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs"
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

                {/* Visibility & Featured */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-700">Visibility:</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          visibility: prev.visibility === "public" ? "private" : "public"
                        }))}
                        className="inline-flex items-center gap-1.5 text-xs font-medium"
                      >
                        {formData.visibility === "public" ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600">Public</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-gray-600" />
                            <span className="text-gray-600">Private</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="featured" className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                        Featured Blog
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  Continue to Images
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 2: IMAGE UPLOAD ==================== */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <ImageIcon className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Upload Images</h2>
                </div>

                {/* Upload Progress */}
                {uploadingImages && uploadProgress.total > 0 && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary">
                        Uploading images...
                      </span>
                      <span className="text-sm text-primary">
                        {uploadProgress.current} / {uploadProgress.total}
                      </span>
                    </div>
                    <div className="w-full bg-primary/20 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={uploadingImages}
                      className="px-4 py-2 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Cover Image
                    </button>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    {thumbnailPreview && (
                      <div className="relative inline-block">
                        <img
                          src={thumbnailPreview}
                          alt="Cover preview"
                          className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          disabled={uploadingImages}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Images */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Content Images <span className="text-red-500">*</span>
                    <span className="text-gray-500 font-normal ml-2">
                      (Upload 1-6 images for use in blog content)
                    </span>
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => contentImagesInputRef.current?.click()}
                      disabled={contentImageFiles.length >= 6 || uploadingImages}
                      className="px-4 py-2 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4" />
                      Add Content Images ({contentImageFiles.length}/6)
                    </button>
                    <input
                      ref={contentImagesInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleContentImagesSelect}
                      className="hidden"
                    />
                    
                    {contentImageFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {contentImageFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeContentImage(index)}
                              disabled={uploadingImages}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all disabled:opacity-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Note:</strong> All images will be uploaded to the server and available for inserting into your blog content.
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  disabled={uploadingImages}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep2Upload}
                  disabled={uploadingImages}
                  className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  {uploadingImages ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading {uploadProgress.current}/{uploadProgress.total}...
                    </>
                  ) : (
                    <>
                      Upload & Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 3: CONTENT EDITOR ==================== */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <AlignLeft className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">Blog Content</h2>
                  </div>
                </div>

                {/* Rich Text Editor Toolbar */}
                <div className="border-b border-gray-200 bg-gray-50">
                  <div className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {/* Text Formatting */}
                      <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2">
                        <button
                          type="button"
                          onClick={() => execCommand('bold')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={() => execCommand('italic')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={() => execCommand('underline')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Underline"
                        >
                          <Underline className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                      </div>

                      {/* Headings */}
                      <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2">
                        <button
                          type="button"
                          onClick={() => insertHeading(1)}
                          className="px-2 py-1.5 hover:bg-gray-200 rounded transition-colors text-xs font-bold"
                          title="Heading 1"
                        >
                          H1
                        </button>
                        <button
                          type="button"
                          onClick={() => insertHeading(2)}
                          className="px-2 py-1.5 hover:bg-gray-200 rounded transition-colors text-xs font-bold"
                          title="Heading 2"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertHeading(3)}
                          className="px-2 py-1.5 hover:bg-gray-200 rounded transition-colors text-xs font-bold"
                          title="Heading 3"
                        >
                          H3
                        </button>
                      </div>

                      {/* Lists */}
                      <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2">
                        <button
                          type="button"
                          onClick={() => execCommand('insertUnorderedList')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Bullet List"
                        >
                          <List className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={() => execCommand('insertOrderedList')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Numbered List"
                        >
                          <ListOrdered className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                      </div>

                      {/* Quote & Link */}
                      <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2">
                        <button
                          type="button"
                          onClick={() => execCommand('formatBlock', 'blockquote')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Quote"
                        >
                          <Quote className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={insertLink}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Insert Link"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                      </div>

                      {/* Insert Image Grid Button */}
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={openGridLayoutModal}
                          className="px-2 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded transition-colors text-xs font-medium inline-flex items-center gap-1"
                          title="Insert Image Grid"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          Insert Image Grid
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Editor - NO MIN HEIGHT, EXPANDS AUTOMATICALLY */}
                <div className="p-6">
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={updateContent}
                    className="prose max-w-none focus:outline-none text-xs"
                    data-placeholder="Start writing your blog content here..."
                    style={{ lineHeight: '1.6', minHeight: '200px' }}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Images
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating Blog...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Blog
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Link Text (optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors text-xs font-medium uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  className="px-3 py-1.5 bg-primary text-secondary rounded-sm hover:bg-primary/90 transition-colors text-xs font-medium uppercase"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Grid Layout Modal */}
      {showGridLayoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 my-8"
          >
            <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" />
              Insert Image Grid
            </h3>

            {/* Step 1: Select Layout */}
            {!selectedGridLayout && (
              <div>
                <p className="text-xs text-gray-600 mb-4">Step 1: Choose a grid layout</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => selectGridLayout('single')}
                    className="p-6 border-2 border-gray-300 hover:border-primary rounded-lg transition-all group"
                  >
                    <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                    <p className="text-xs font-medium text-gray-900">Single Image</p>
                    <p className="text-[10px] text-gray-500 mt-1">Max height: 300px</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectGridLayout('double')}
                    className="p-6 border-2 border-gray-300 hover:border-primary rounded-lg transition-all group"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="w-full h-32 bg-gray-200 rounded"></div>
                      <div className="w-full h-32 bg-gray-200 rounded"></div>
                    </div>
                    <p className="text-xs font-medium text-gray-900">Two Side by Side</p>
                    <p className="text-[10px] text-gray-500 mt-1">Max height: 300px</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectGridLayout('triple')}
                    className="p-6 border-2 border-gray-300 hover:border-primary rounded-lg transition-all group"
                  >
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 mb-3">
                      <div className="w-full h-32 bg-gray-200 rounded row-span-2"></div>
                      <div className="w-full h-[60px] bg-gray-200 rounded"></div>
                      <div className="w-full h-[60px] bg-gray-200 rounded"></div>
                    </div>
                    <p className="text-xs font-medium text-gray-900">Three Grid</p>
                    <p className="text-[10px] text-gray-500 mt-1">Max height: 500px</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Select Images */}
            {selectedGridLayout && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-600">
                    Step 2: Select {gridImages.length} image(s) for your grid
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGridLayout(null);
                      setGridImages([]);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Change Layout
                  </button>
                </div>

                {/* Image Slots */}
                <div className="mb-6">
                  <div className={`grid gap-4 mb-4 ${
                    selectedGridLayout === 'single' ? 'grid-cols-1' :
                    selectedGridLayout === 'double' ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'
                  }`}>
                    {gridImages.map((image, index) => (
                      <div 
                        key={index} 
                        className={`border-2 border-dashed ${image ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-4 ${
                          selectedGridLayout === 'triple' && index === 0 ? 'row-span-2' : ''
                        }`}
                      >
                        {image ? (
                          <div className="relative">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-32 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => selectImageForSlot(index, null)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-gray-700 mt-2 truncate">{image.name}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32">
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-600">Slot {index + 1}</p>
                            <p className="text-xs text-gray-500">Click image below</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Images */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Available Images:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                    {uploadedImageUrls.contentImages.map((imageData) => (
                      <button
                        key={imageData.id}
                        type="button"
                        onClick={() => {
                          const emptySlotIndex = gridImages.findIndex(img => img === null);
                          if (emptySlotIndex !== -1) {
                            selectImageForSlot(emptySlotIndex, imageData);
                          } else {
                            toast.error("All slots are filled. Remove an image first.");
                          }
                        }}
                        className="relative group cursor-pointer"
                        disabled={gridImages.every(img => img !== null)}
                      >
                        <img
                          src={imageData.url}
                          alt={imageData.name}
                          className="w-full h-16 object-cover rounded border-2 border-gray-200 group-hover:border-primary transition-colors"
                        />
                        {gridImages.some(img => img?.id === imageData.id) && (
                          <div className="absolute inset-0 bg-green-500/20 rounded flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowGridLayoutModal(false);
                  setSelectedGridLayout(null);
                  setGridImages([]);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 text-xs font-medium uppercase"
              >
                Cancel
              </button>
              {selectedGridLayout && (
                <button
                  type="button"
                  onClick={insertGrid}
                  className="px-4 py-2 bg-primary text-secondary rounded-sm hover:bg-primary/90 text-xs font-medium uppercase"
                >
                  Insert Grid
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }

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

        .prose strong {
          font-weight: 600;
          color: #111827;
        }

        .prose em {
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

        /* ==================== GRID LAYOUTS ==================== */
        
        /* Base Grid Parent */
        .prose .blog-grid-parent {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(5, 1fr);
          gap: 8px;
          margin: 1em 0;
          overflow: hidden;
        }

        /* Single Image Layout - Max height 300px */
        .prose .blog-grid-single {
          max-height: 300px;
        }

        .prose .blog-grid-single .blog-grid-div1 {
          grid-area: 1 / 1 / 6 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 8px;
          overflow: hidden;
        }

        /* Double Image Layout - Max height 300px */
        .prose .blog-grid-double {
          max-height: 300px;
        }

        .prose .blog-grid-double .blog-grid-div1 {
          grid-area: 1 / 1 / 6 / 3;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 8px;
          overflow: hidden;
        }

        .prose .blog-grid-double .blog-grid-div2 {
          grid-area: 1 / 3 / 6 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 8px;
          overflow: hidden;
        }

        /* Triple Image Layout - Max height 500px */
        .prose .blog-grid-triple {
          max-height: 500px;
        }

        .prose .blog-grid-triple .blog-grid-div1 {
          grid-area: 1 / 1 / 6 / 4;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 8px;
          overflow: hidden;
        }

        .prose .blog-grid-triple .blog-grid-div2 {
          grid-area: 1 / 4 / 3 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 8px;
          overflow: hidden;
        }

        .prose .blog-grid-triple .blog-grid-div3 {
          grid-area: 3 / 4 / 6 / 6;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 8px;
          overflow: hidden;
        }

        /* Responsive: Mobile devices */
        @media (max-width: 640px) {
          .prose .blog-grid-single {
            max-height: 250px;
          }

          .prose .blog-grid-double {
            max-height: 250px;
          }

          .prose .blog-grid-triple {
            max-height: 400px;
          }
        }

        /* Ensure grids maintain aspect ratio on all devices */
        @media (min-width: 641px) and (max-width: 1024px) {
          .prose .blog-grid-single {
            max-height: 280px;
          }

          .prose .blog-grid-double {
            max-height: 280px;
          }

          .prose .blog-grid-triple {
            max-height: 450px;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateBlog;