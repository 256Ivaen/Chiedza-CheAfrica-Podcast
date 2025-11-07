import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  LayoutGrid,
  Check,
  Loader,
  X,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

const Step3ContentEditor = ({
  blogContent,
  setBlogContent,
  uploadedImageUrls,
  loading,
  onSubmit,
  onBack,
}) => {
  const editorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showGridLayoutModal, setShowGridLayoutModal] = useState(false);
  const [selectedGridLayout, setSelectedGridLayout] = useState(null);
  const [gridImages, setGridImages] = useState([]);

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
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    if (linkText.trim()) {
      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #667eea; text-decoration: underline;">${linkText}</a>`;
      document.execCommand("insertHTML", false, link);
    } else {
      execCommand("createLink", url);
    }

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    updateContent();
  };

  const openGridLayoutModal = () => {
    setSelectedGridLayout(null);
    setGridImages([]);
    setShowGridLayoutModal(true);
  };

  const selectGridLayout = (layout) => {
    setSelectedGridLayout(layout);
    const slots = layout === "single" ? 1 : layout === "double" ? 2 : 3;
    setGridImages(new Array(slots).fill(null));
  };

  const selectImageForSlot = (slotIndex, imageData) => {
    setGridImages((prev) => {
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

    const emptySlots = gridImages.filter((img) => img === null).length;
    if (emptySlots > 0) {
      toast.error(`Please fill all ${gridImages.length} image slot(s)`);
      return;
    }

    let htmlContent = "";

    if (selectedGridLayout === "single") {
      const imageData = gridImages[0];
      htmlContent = `
        <div class="blog-grid-parent blog-grid-single">
          <div class="blog-grid-div1" style="background-image: url('${imageData.url}');"></div>
        </div>
      `;
    } else if (selectedGridLayout === "double") {
      htmlContent = `
        <div class="blog-grid-parent blog-grid-double">
          <div class="blog-grid-div1" style="background-image: url('${gridImages[0].url}');"></div>
          <div class="blog-grid-div2" style="background-image: url('${gridImages[1].url}');"></div>
        </div>
      `;
    } else if (selectedGridLayout === "triple") {
      htmlContent = `
        <div class="blog-grid-parent blog-grid-triple">
          <div class="blog-grid-div1" style="background-image: url('${gridImages[0].url}');"></div>
          <div class="blog-grid-div2" style="background-image: url('${gridImages[1].url}');"></div>
          <div class="blog-grid-div3" style="background-image: url('${gridImages[2].url}');"></div>
        </div>
      `;
    }

    const fullContent = htmlContent + "<p><br></p>";
    document.execCommand("insertHTML", false, fullContent);

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

  return (
    <>
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
                    onClick={() => execCommand("bold")}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execCommand("italic")}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execCommand("underline")}
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
                    onClick={() => execCommand("insertUnorderedList")}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execCommand("insertOrderedList")}
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
                    onClick={() => execCommand("formatBlock", "blockquote")}
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

          {/* Content Editor */}
          <div className="p-6">
            <div
              ref={editorRef}
              contentEditable
              onInput={updateContent}
              className="prose max-w-none focus:outline-none text-xs"
              data-placeholder="Start writing your blog content here..."
              style={{ lineHeight: "1.6", minHeight: "200px" }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Images
          </button>
          <button
            type="button"
            onClick={onSubmit}
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
                <p className="text-xs text-gray-600 mb-4">
                  Step 1: Choose a grid layout (All layouts: 500px height)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => selectGridLayout("single")}
                    className="p-6 border-2 border-gray-300 hover:border-primary rounded-lg transition-all group"
                  >
                    <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-3 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-xs font-medium text-gray-900">Single Image</p>
                    <p className="text-[10px] text-gray-500 mt-1">Height: 500px</p>
                    <p className="text-[10px] text-gray-400">Full width, perfect for hero shots</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectGridLayout("double")}
                    className="p-6 border-2 border-gray-300 hover:border-primary rounded-lg transition-all group"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-blue-300 rounded flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="w-full h-40 bg-gradient-to-br from-green-200 to-green-300 rounded flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-900">
                      Two Side by Side
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">Height: 500px</p>
                    <p className="text-[10px] text-gray-400">Equal split, great for comparison</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectGridLayout("triple")}
                    className="p-6 border-2 border-gray-300 hover:border-primary rounded-lg transition-all group"
                  >
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 mb-3">
                      <div className="w-full h-40 bg-gradient-to-br from-purple-200 to-purple-300 rounded row-span-2 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-purple-500" />
                      </div>
                      <div className="w-full h-[76px] bg-gradient-to-br from-orange-200 to-orange-300 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="w-full h-[76px] bg-gradient-to-br from-pink-200 to-pink-300 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-pink-500" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-900">Three Grid</p>
                    <p className="text-[10px] text-gray-500 mt-1">Height: 500px</p>
                    <p className="text-[10px] text-gray-400">1 large + 2 small, dynamic layout</p>
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
                  <div
                    className={`grid gap-4 mb-4 ${
                      selectedGridLayout === "single"
                        ? "grid-cols-1"
                        : selectedGridLayout === "double"
                        ? "grid-cols-2"
                        : "grid-cols-2 grid-rows-2"
                    }`}
                  >
                    {gridImages.map((image, index) => (
                      <div
                        key={index}
                        className={`border-2 border-dashed ${
                          image
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-gray-50"
                        } rounded-lg p-4 ${
                          selectedGridLayout === "triple" && index === 0
                            ? "row-span-2"
                            : ""
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
                            <p className="text-xs text-gray-700 mt-2 truncate">
                              {image.name}
                            </p>
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
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    Available Images:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                    {uploadedImageUrls.contentImages.map((imageData) => (
                      <button
                        key={imageData.id}
                        type="button"
                        onClick={() => {
                          const emptySlotIndex = gridImages.findIndex(
                            (img) => img === null
                          );
                          if (emptySlotIndex !== -1) {
                            selectImageForSlot(emptySlotIndex, imageData);
                          } else {
                            toast.error("All slots are filled. Remove an image first.");
                          }
                        }}
                        className="relative group cursor-pointer"
                        disabled={gridImages.every((img) => img !== null)}
                      >
                        <img
                          src={imageData.url}
                          alt={imageData.name}
                          className="w-full h-16 object-cover rounded border-2 border-gray-200 group-hover:border-primary transition-colors"
                        />
                        {gridImages.some((img) => img?.id === imageData.id) && (
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
    </>
  );
};

export default Step3ContentEditor;