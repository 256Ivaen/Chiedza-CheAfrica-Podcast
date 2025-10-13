// Products.jsx
import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "../../assets/products";

const Products = () => {
  const navigate = useNavigate();
  const products = getFeaturedProducts().slice(0, 5); // Get first 5 featured products

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const handleProductClick = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  return (
    <motion.section 
      className="w-full bg-gray-50 py-16 sm:py-20 relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div className="text-start mb-6" variants={fadeInUp}>
          <p className="text-[#b8a979] text-sm font-semibold uppercase tracking-wider">
            Most Popular Products
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold uppercase text-black">
            Customer Favorites
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Main Featured Product */}
          <motion.div 
            className="lg:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 h-80 group"
            variants={fadeInUp}
            onClick={() => handleProductClick(products[0]?.slug)}
          >
            <img
              src={products[0]?.images[0]}
              alt={products[0]?.name}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                {products[0]?.name}
              </h3>
              
              <p className="text-sm text-white/90 mb-4 line-clamp-2">
                {products[0]?.description}
              </p>
              
              <button className="inline-flex items-center px-4 py-2 bg-[#b8a979] text-white text-xs font-semibold rounded-lg hover:bg-[#a69968] transition-all duration-300 group-hover:scale-105">
                <span className="mr-2">View Product</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Right Column */}
          {products[1] && (
            <motion.div 
              className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 h-80 group"
              variants={fadeInUp}
              onClick={() => handleProductClick(products[1]?.slug)}
            >
              <img
                src={products[1]?.images[0]}
                alt={products[1]?.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {products[1]?.name}
                </h4>

                <p className="text-sm text-white/90 line-clamp-1">
                  {products[1]?.shortDescription}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 max-w-7xl mx-auto">
          {products.slice(2, 5).map((product, index) => (
            <motion.div 
              key={product?.id || `product-${index + 2}`}
              className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 h-80 group"
              variants={fadeInUp}
              onClick={() => handleProductClick(product?.slug)}
            >
              <img
                src={product?.images[0]}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {product?.name}
                </h4>

                <p className="text-sm text-white/90 line-clamp-1">
                  {product?.shortDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Products;