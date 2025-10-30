import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBrandById, getCategoryById } from '../../assets/products';

const ProductItem = ({ 
  id, 
  image, 
  name, 
  brand, 
  category, 
  slug,
  dimensions,
  packaging 
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  if (!id || !image || !Array.isArray(image) || !name) {
    return null;
  }
  
  const productUrl = slug ? `/product/${slug}` : `/product/${id}`;
  const displayImage = imageError ? '/assets/images/placeholder.jpg' : (image[0] || '/assets/images/placeholder.jpg');
  
  // Get brand and category names
  const brandData = getBrandById(brand);
  const categoryData = getCategoryById(category);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const handleViewProduct = (e) => {
    e.preventDefault();
    navigate(productUrl);
    window.scrollTo(0, 0);
  };
  
  return (
    <motion.div
      className="group cursor-pointer h-full"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={handleViewProduct}
    >
      <div className="bg-white rounded-lg overflow-hidden h-full border border-gray-100 hover:border-primary/40 flex flex-col transition-all duration-300">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50">
          <motion.img
            src={displayImage}
            alt={name}
            className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        
        {/* Content Container */}
        <div className="flex-1 flex flex-col p-4">
          {/* Brand and Category */}
          <div className="flex items-center text-sm text-textdark/60 mb-2">
            {brandData && (
              <span className="font-medium text-textdark">{brandData.name}</span>
            )}
            {brandData && categoryData && (
              <span className="mx-2">•</span>
            )}
            {categoryData && (
              <span className="text-textdark/70">{categoryData.name}</span>
            )}
          </div>
          
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-textdark mb-3 line-clamp-2 leading-tight">
            {name}
          </h3>
          
          {/* Technical Details - This is where dimensions and packaging should display */}
          <div className="mt-auto space-y-2 mb-4">
            {dimensions && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-textdark/60 font-medium">Dimensions:</span>
                <span className="text-textdark font-semibold">{dimensions}</span>
              </div>
            )}
            {packaging && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-textdark/60 font-medium">Packaging:</span>
                <span className="text-textdark font-semibold">{packaging}</span>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <motion.button
            className="w-full py-2.5 bg-secondary text-textlight text-sm font-semibold rounded-md transition-all duration-300 hover:bg-secondary/90 uppercase tracking-wide"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleViewProduct(e);
            }}
          >
            VIEW PRODUCT
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductItem;