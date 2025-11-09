import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ImageIcon, Loader, X } from "lucide-react";
import { FileUpload } from "@ark-ui/react/file-upload";
import { upload } from "../../utils/service";
import { toast } from "sonner";

const EditStep2ImageManagement = ({
  formData,
  setFormData,
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

  const handleThumbnailChange = (details) => {
    const files = details.acceptedFiles;
    if (files.length > 0) {
      const file = files[0];
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Clear old preview if exists
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      const newPreview = URL.createObjectURL(file);
      setThumbnailFile(file);
      setThumbnailPreview(newPreview);
      
      // Update formData image to show it has changed
      setFormData(prev => ({
        ...prev,
        image: newPreview
      }));

      toast.success("Cover image selected");
    }
  };

  const removeThumbnail = () => {
    if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview("");
    
    setFormData(prev => ({
      ...prev,
      image: prev.image && !prev.image.startsWith('blob:') ? prev.image : ""
    }));
    
    toast.success("Cover image removed");
  };

  const handleContentImagesChange = (details) => {
    const files = details.acceptedFiles;
    
    const totalExisting = uploadedImageUrls?.contentImages?.length || 0;
    const totalNew = contentImageFiles.length;
    const totalAfterAdd = totalExisting + totalNew + files.length;

    if (totalAfterAdd > 6) {
      toast.error(
        `You can only have a maximum of 6 content images total. Currently: ${totalExisting} existing + ${totalNew} new = ${totalExisting + totalNew} images.`
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
      toast.success(`${validFiles.length} new image(s) added`);
    }
  };

  const removeContentImage = (index) => {
    const fileToRemove = contentImageFiles[index];
    const preview = URL.createObjectURL(fileToRemove);
    URL.revokeObjectURL(preview);
    
    setContentImageFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const removeExistingImage = (imageId) => {
    setUploadedImageUrls(prev => ({
      ...prev,
      contentImages: prev.contentImages.filter(img => img.id !== imageId)
    }));
    toast.success("Existing image removed");
  };

  // UPLOAD IMAGES FUNCTION - EXACTLY LIKE CREATE BLOG
  const uploadImages = async () => {
    setUploadingImages(true);
    const totalImages = (thumbnailFile ? 1 : 0) + contentImageFiles.length;
    setUploadProgress({ current: 0, total: totalImages });

    try {
      let coverImageUrl = uploadedImageUrls.coverImage; // Keep existing if not changed
      const contentImageUrls = [...uploadedImageUrls.contentImages]; // Start with existing images

      // Upload cover image if a new file was selected
      if (thumbnailFile) {
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
      }

      // Upload new content images one by one
      if (contentImageFiles.length > 0) {
        for (let i = 0; i < contentImageFiles.length; i++) {
          const file = contentImageFiles[i];
          toast.info(`Uploading image ${i + 1} of ${contentImageFiles.length}...`);
          setUploadProgress({ current: (thumbnailFile ? 1 : 0) + i + 1, total: totalImages });

          const imageFormData = new FormData();
          imageFormData.append("image", file);

          const imageResult = await upload("upload/image", imageFormData);

          if (imageResult.success && imageResult.data.url) {
            contentImageUrls.push({
              id: `new-img-${Date.now()}-${i}`,
              url: imageResult.data.url,
              name: file.name,
            });
          } else {
            throw new Error(imageResult.message || `Failed to upload ${file.name}`);
          }
        }
        toast.success("Content images uploaded successfully!");
      }

      // Store all uploaded URLs
      setUploadedImageUrls({
        coverImage: coverImageUrl,
        contentImages: contentImageUrls,
      });

      toast.success("All images processed successfully!");
      onNext(); // Move to next step
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleNext = () => {
    // If there are new images to upload, upload them first
    if (thumbnailFile || contentImageFiles.length > 0) {
      uploadImages();
    } else {
      // No new images, just proceed
      onNext();
    }
  };

  const totalContentImages = (uploadedImageUrls?.contentImages?.length || 0) + contentImageFiles.length;

  return (
    <motion.div
      key="edit-step2"
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> {thumbnailFile || contentImageFiles.length > 0 
              ? "New images will be uploaded to the server when you continue." 
              : "No new images selected. Existing images will be kept."}
          </p>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Cover Image <span className="text-red-500">*</span>
            {thumbnailFile && (
              <span className="text-green-600 ml-2">(New image selected - will be uploaded)</span>
            )}
          </label>
          
          <FileUpload.Root
            maxFiles={1}
            accept="image/*"
            onFileChange={handleThumbnailChange}
            className="flex flex-col items-start gap-3"
          >
            <FileUpload.Context>
              {({ acceptedFiles }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-24 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {(thumbnailPreview || formData.image) ? (
                        <img
                          src={thumbnailPreview || formData.image}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    
                    <FileUpload.Trigger 
                      disabled={uploadingImages}
                      className="px-4 py-2 bg-primary text-secondary text-xs font-medium uppercase rounded-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                      {(thumbnailPreview || formData.image) ? "Change Cover Image" : "Upload Cover Image"}
                    </FileUpload.Trigger>
                  </div>
                  
                  {thumbnailFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{thumbnailFile.name}</span>
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        disabled={uploadingImages}
                        className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  
                  {!thumbnailFile && formData.image && (
                    <div className="text-xs text-gray-600">
                      Current cover image will be kept
                    </div>
                  )}
                </>
              )}
            </FileUpload.Context>
            <FileUpload.HiddenInput />
          </FileUpload.Root>
        </div>

        {/* Content Images */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Content Images
            <span className="text-gray-500 font-normal ml-2">
              (Total: {totalContentImages}/6 images)
            </span>
          </label>
          
          <FileUpload.Root
            maxFiles={6 - totalContentImages}
            accept="image/*"
            multiple
            onFileChange={handleContentImagesChange}
            className="flex flex-col items-start gap-3"
          >
            <FileUpload.Context>
              {({ acceptedFiles }) => (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Show existing content images from blog */}
                    {uploadedImageUrls?.contentImages?.map((imageData, index) => (
                      <div key={imageData.id} className="relative group">
                        <div className="w-24 h-24 rounded-lg border-2 border-blue-300 bg-blue-50 overflow-hidden">
                          <img
                            src={imageData.url}
                            alt={imageData.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imageData.id)}
                          disabled={uploadingImages}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all disabled:opacity-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-[9px] px-1 py-0.5 text-center">
                          Existing
                        </div>
                      </div>
                    ))}

                    {/* Show newly selected content images */}
                    {contentImageFiles.map((file, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="w-24 h-24 rounded-lg border-2 border-green-300 bg-green-50 overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeContentImage(index)}
                          disabled={uploadingImages}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all disabled:opacity-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-[9px] px-1 py-0.5 text-center">
                          New
                        </div>
                      </div>
                    ))}
                    
                    {/* Upload Button */}
                    {totalContentImages < 6 && (
                      <FileUpload.Trigger 
                        disabled={uploadingImages}
                        className="w-24 h-24 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {totalContentImages}/6
                        </span>
                      </FileUpload.Trigger>
                    )}
                  </div>
                </>
              )}
            </FileUpload.Context>
            <FileUpload.HiddenInput />
          </FileUpload.Root>
          
          <p className="text-xs text-gray-500 mt-2">
            <strong>Note:</strong> Blue-bordered images are existing. Green-bordered images are newly added and will be uploaded when you continue.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF, WebP, SVG (max 5MB each).
        </p>
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
          Back to Info
        </button>
        <button
          type="button"
          onClick={handleNext}
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
              Continue to Content
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default EditStep2ImageManagement;