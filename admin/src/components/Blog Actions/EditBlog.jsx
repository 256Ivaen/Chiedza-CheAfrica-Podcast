"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
} from "lucide-react";
import { get, put } from "../../utils/service";
import { toast } from "sonner";
import EditStep1BasicInfo from "./EditStep1BasicInfo";
import EditStep2ImageManagement from "./EditStep2ImageManagement";
import EditStep3ContentEditor from "./EditStep3ContentEditor";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

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

  // Step 2: Image Upload - SAME AS CREATE BLOG
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [contentImageFiles, setContentImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState({
    coverImage: "",
    contentImages: [],
  });

  const [errors, setErrors] = useState({});

  // Extract images from HTML content
  const extractImagesFromContent = (htmlContent) => {
    const images = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const gridDivs = doc.querySelectorAll('[class*="blog-grid-div"]');
    gridDivs.forEach((div, index) => {
      const style = div.getAttribute('style');
      if (style) {
        const match = style.match(/url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          images.push({
            id: `existing-img-${index}`,
            url: match[1],
            name: `Image ${index + 1}`,
          });
        }
      }
    });

    return images;
  };

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetchLoading(true);
        const response = await get(`blogs/${id}`);

        if (response?.success && response?.data) {
          const blog = response.data;
          
          // Extract existing images from content
          const existingImages = extractImagesFromContent(blog.content || "");
          
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

          // Set existing images - IMPORTANT: Set the uploadedImageUrls with existing data
          setUploadedImageUrls({
            coverImage: blog.image || "",
            contentImages: existingImages,
          });

          // Set thumbnail preview if image exists
          if (blog.image) {
            setThumbnailPreview(blog.image);
          }
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

  // Handle submit - NO IMAGE UPLOADS HERE, THEY ARE ALREADY DONE IN STEP 2
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error("Please add content to your blog");
      return;
    }

    setLoading(true);

    try {
      // Prepare blog data with the already uploaded image URLs
      const blogData = {
        title: formData.title.trim(),
        category: formData.category,
        author: formData.author.trim(),
        image: uploadedImageUrls.coverImage, // Use the uploaded cover image URL
        hero_image: uploadedImageUrls.coverImage, // Use the uploaded cover image URL
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        featured: Boolean(formData.featured),
        visible: Boolean(formData.visible),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        hero_data: {},
        read_time: formData.read_time || "5 min read",
      };

      console.log("Updating blog data:", blogData);

      const response = await put(`blogs/${id}`, blogData);

      if (response.success) {
        toast.success(response.message || "Blog updated successfully!");
        
        // Clean up object URLs
        if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
          URL.revokeObjectURL(thumbnailPreview);
        }
        contentImageFiles.forEach(file => {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        });
        
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
    navigate(`/blogs/${id}`);
  };

  // Loading state
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <SkeletonBox className="h-6 w-32" />
              <SkeletonBox className="h-8 w-24" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <SkeletonBox className="h-6 w-48 mb-4" />
              <SkeletonBox className="h-10 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <SkeletonBox className="h-10 w-full" />
                <SkeletonBox className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/blogs/${id}`)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h1 className="text-sm font-bold text-gray-900">Edit Blog</h1>
                <p className="text-xs text-gray-500">Step {currentStep} of 3</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  currentStep >= 1
                    ? "bg-primary text-secondary"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 1 ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <span>1</span>
                )}
                <span className="hidden md:inline">Info</span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  currentStep >= 2
                    ? "bg-primary text-secondary"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 2 ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <span>2</span>
                )}
                <span className="hidden md:inline">Images</span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  currentStep >= 3
                    ? "bg-primary text-secondary"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <span>3</span>
                <span className="hidden md:inline">Content</span>
              </div>
            </div>

            {/* Preview Button */}
            <button
              onClick={handlePreview}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-sm transition-colors text-xs font-medium uppercase"
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <EditStep1BasicInfo
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {/* Step 2: Image Management - NOW WITH UPLOAD FUNCTIONALITY */}
          {currentStep === 2 && (
            <EditStep2ImageManagement
              formData={formData}
              setFormData={setFormData}
              thumbnailFile={thumbnailFile}
              setThumbnailFile={setThumbnailFile}
              thumbnailPreview={thumbnailPreview}
              setThumbnailPreview={setThumbnailPreview}
              contentImageFiles={contentImageFiles}
              setContentImageFiles={setContentImageFiles}
              uploadedImageUrls={uploadedImageUrls}
              setUploadedImageUrls={setUploadedImageUrls}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Content Editor - NO UPLOADS HERE */}
          {currentStep === 3 && (
            <EditStep3ContentEditor
              formData={formData}
              setFormData={setFormData}
              uploadedImageUrls={uploadedImageUrls}
              loading={loading}
              onSubmit={handleSubmit}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditBlog;