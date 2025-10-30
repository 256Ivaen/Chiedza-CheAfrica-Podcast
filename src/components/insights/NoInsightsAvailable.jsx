import React from "react";
import { motion } from "framer-motion";
import { Home, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBlog } from "react-icons/fa";


const NoInsightsAvailable = () => {
  const navigate = useNavigate();
  
  const goToHome = () => {
    navigate('/');
  };
  
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 100,
            damping: 15 
          }}
          className="relative mb-8"
        >
          <div className="mx-auto flex items-center justify-center">
            <FaBlog className="w-16 h-16 text-white" />
          </div>
        </motion.div>
        
        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7, 
            delay: 0.3,
            type: "spring",
            stiffness: 80
          }}
          className="mb-12 space-y-4"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-textlight uppercase tracking-wide mb-6 font-montserrat leading-tight">
            No Blogs Available
          </h2>
          <p className="text-gray-300 text-sm md:text-sm max-w-lg mx-auto font-montserrat leading-relaxed">
            We're currently preparing some amazing content for you. 
            Check back soon for inspiring African stories, Blogs, and podcast episodes.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7, 
            delay: 0.5,
            type: "spring",
            stiffness: 80
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.button
            onClick={goToHome}
            className="group relative inline-flex items-center px-8 py-2 bg-primary text-white font-light rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat overflow-hidden"
            whileTap={{ scale: 0.98 }}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
            <span className="relative z-10 text-sm font-light uppercase tracking-wide">Back to Home</span>
          </motion.button>
          
          <motion.button
            onClick={goBack}
            className="group inline-flex items-center px-8 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-textlight font-light rounded-full border border-white/20 hover:border-white/30 shadow-md hover:shadow-lg transition-all duration-300 font-montserrat"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm font-light uppercase tracking-wide">Go Back</span>
          </motion.button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-center"
        >
          <p className="text-gray-400 text-sm font-light font-montserrat">
            Want to be notified when new content is available?{" "}
            <a 
              href="/contact" 
              className="text-primary hover:text-primary/80 transition-colors duration-300"
            >
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NoInsightsAvailable;