import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from "lucide-react";

const InsightCard = ({ insight, index }) => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }
    }
  };

  const handleReadMore = (e) => {
    e.preventDefault();
    navigate(`/blog/${insight.id}`);
  };

  return (
    <motion.div 
      className="group cursor-pointer h-full"
      variants={cardVariants}
      whileHover={{ y: -2 }}
      onClick={handleReadMore}
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition-all duration-500 overflow-hidden h-full group-hover:border-primary/50 flex flex-col">
        <div className="relative overflow-hidden rounded-xl">
          <img 
            src={insight.image}
            alt={insight.title}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          
          {/* Glass Effect Badges */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-3 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-sm font-light rounded-full shadow-2xl ring-1 ring-primary/10">
              {insight.category}
            </span>
            {insight.featured && (
              <span className="px-3 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-sm font-light rounded-full shadow-2xl ring-1 ring-primary/10">
                Featured
              </span>
            )}
          </div>
        </div>
        
        <div className="px-4 py-6 flex-1 flex flex-col">
          <div className="flex items-center text-sm text-gray-400 mb-4 space-x-4 font-light">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{insight.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{insight.readTime}</span>
            </div>
          </div>
          
          <h3 className="text-lg sm:text-xl font-light text-white mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight flex-shrink-0">
            {insight.title}
          </h3>
          
          <p className="text-sm text-gray-300 mb-5 leading-relaxed line-clamp-2 flex-grow">
            {insight.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="flex flex-wrap gap-2">
              {insight.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="px-3 py-1 text-gray-300 text-sm font-light rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200">
                  #{tag}
                </span>
              ))}
            </div>
            
            <motion.button
              className="flex items-center px-4 py-2 bg-primary text-white text-sm font-light rounded-lg transition-all duration-300 ml-4 flex-shrink-0 hover:bg-primary/90"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleReadMore(e);
              }}
            >
              <span className="mr-2">Read</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;