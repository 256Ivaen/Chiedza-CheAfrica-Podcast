import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Tag,
  X,
  FileText,
} from "lucide-react";

const Step1BasicInfo = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onNext,
}) => {
  const [tagInput, setTagInput] = useState("");

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

  return (
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
              errors.title ? "border-red-500" : "border-gray-200"
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
                errors.category ? "border-red-500" : "border-gray-200"
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
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
              errors.summary ? "border-red-500" : "border-gray-200"
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
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    visibility: prev.visibility === "public" ? "private" : "public",
                  }))
                }
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
              <label
                htmlFor="featured"
                className="text-xs font-medium text-gray-700 flex items-center gap-1.5"
              >
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
          onClick={onNext}
          className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium inline-flex items-center gap-2"
        >
          Continue to Images
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Step1BasicInfo;