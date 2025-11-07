import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, X, ImageIcon, Loader } from "lucide-react";
import { upload } from "../../utils/service";
import { toast } from "sonner";

const Step2ImageUpload = ({
  thumbnailFile,
  setThumbnailFile,
  thumbnailPreview,
  setThumbnailPreview,
  contentImageFiles,
  setContentImageFiles,
  uploadedImageUrls,
  setUploadedImageUrls,
  onNext,
  onBack,
}) => {
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const thumbnailInputRef = useRef(null);
  const contentImagesInputRef = useRef(null);

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
      toast.error(
        `You can only upload a maximum of 6 images. Currently you have ${contentImageFiles.length} image(s).`
      );
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
      onNext();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
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
              <span className="text-xs font-medium text-primary">
                Uploading images...
              </span>
              <span className="text-xs text-primary">
                {uploadProgress.current} / {uploadProgress.total}
              </span>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-[2px]">
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
            <strong>Note:</strong> All images will be uploaded to the server and
            available for inserting into your blog content.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
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
  );
};

export default Step2ImageUpload;