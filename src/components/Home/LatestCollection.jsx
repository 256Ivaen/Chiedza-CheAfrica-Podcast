// CategoriesShowcase.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFeaturedCategories } from '../../assets/products';

import { MdOutlineProductionQuantityLimits } from "react-icons/md";

const CategoriesShowcase = () => {
  const navigate = useNavigate();

  // Get featured categories or all categories if no featured ones
  const featuredCategories = getFeaturedCategories();
  const displayCategories = featuredCategories.length > 0 ? featuredCategories : [];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  return (
    <motion.section 
      className="py-16 lg:py-20 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header with title on left and button on right */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4"
          variants={fadeInUp}
        >
          <div className="max-w-lg">
            <p className="text-[#b8a979] text-sm font-semibold uppercase tracking-wider ">
              Product Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              EXPLORE OUR RANGE
            </h2>
          </div>
          
          <button 
            onClick={() => navigate('/categories')}
            className="flex items-center px-6 py-3 bg-[#b8a979] text-white font-semibold rounded-lg hover:bg-[#a69968] transition-all duration-300 shadow-md hover:shadow-lg self-end sm:self-auto"
          >
            <span className="mr-2 text-xs">View All</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Grid with exactly 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group cursor-pointer h-full"
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#b8a979] group-hover:border-[#b8a979]/50 flex flex-col h-full">
                {/* Category Image */}
                <div className="relative overflow-hidden h-48 sm:h-56">
                  <motion.img
                    src={category.heroImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 backdrop-blur-xl bg-white/20 border border-white/30 text-white text-xs font-semibold rounded-full shadow-lg">
                      {category.featured ? 'Featured' : 'Category'}
                    </span>
                  </div>

                  {/* Stats Badge */}
                  {category.stats?.productsCount && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 backdrop-blur-xl bg-[#b8a979]/20 border border-[#b8a979]/30 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                        <MdOutlineProductionQuantityLimits className="w-3 h-3" />
                        {category.stats.productsCount}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Category Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#b8a979] transition-colors duration-300 line-clamp-1">
                    {category.name}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed line-clamp-3 flex-grow">
                    {category.description}
                  </p>

                  {/* Category Stats */}
                  {category.stats && (
                    <div className="grid grid-cols-2 gap-4 mb-2 p-3 bg-gray-300 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#b8a979]">
                          {category.stats.suppliersCount || category.stats.brandPartners || '0'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {category.stats.suppliersCount ? 'Suppliers' : 'Partners'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#b8a979]">
                          {category.stats.qualityScore || '0'}
                        </div>
                        <div className="text-xs text-gray-600">Quality</div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <motion.button
                      className="w-full flex items-center px-4 py-2 bg-[#b8a979] text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-300 hover:bg-[#a69968]"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.slug);
                      }}
                    >
                      <span className="mr-2">Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CategoriesShowcase;