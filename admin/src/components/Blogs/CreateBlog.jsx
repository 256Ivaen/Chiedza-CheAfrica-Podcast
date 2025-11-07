"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Loader,
} from "lucide-react";
import { post } from "../../utils/service";
import { toast } from "sonner";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2ImageUpload from "./Step2ImageUpload";
import Step3ContentEditor from "./Step3ContentEditor";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
  const [errors, setErrors] = useState({});

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

  // ==================== STEP VALIDATIONS ====================

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

  const handleStep2Next = () => {
    setCurrentStep(3);
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
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              onNext={handleStep1Next}
            />
          )}

          {/* Step 2: Image Upload */}
          {currentStep === 2 && (
            <Step2ImageUpload
              thumbnailFile={thumbnailFile}
              setThumbnailFile={setThumbnailFile}
              thumbnailPreview={thumbnailPreview}
              setThumbnailPreview={setThumbnailPreview}
              contentImageFiles={contentImageFiles}
              setContentImageFiles={setContentImageFiles}
              uploadedImageUrls={uploadedImageUrls}
              setUploadedImageUrls={setUploadedImageUrls}
              onNext={handleStep2Next}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Content Editor */}
          {currentStep === 3 && (
            <Step3ContentEditor
              blogContent={blogContent}
              setBlogContent={setBlogContent}
              uploadedImageUrls={uploadedImageUrls}
              loading={loading}
              onSubmit={handleFinalSubmit}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS for Editor Styles */}
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
};

export default CreateBlog;