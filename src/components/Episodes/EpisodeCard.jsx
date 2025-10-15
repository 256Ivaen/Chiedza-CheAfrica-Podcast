import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Play } from 'lucide-react';

const EpisodeCard = ({ insight, index }) => {
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

  const handleWatchEpisode = (e) => {
    e.preventDefault();
    if (insight.youtubeUrl) {
      window.open(insight.youtubeUrl, '_blank');
    }
  };

  return (
    <motion.div 
      className="group cursor-pointer h-full"
      variants={cardVariants}
      whileHover={{ y: -2 }}
      onClick={handleWatchEpisode}
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition-all duration-500 overflow-hidden h-full group-hover:border-primary/50 flex flex-col">
        <div className="relative overflow-hidden rounded-xl">
          <img 
            src={insight.image}
            alt={insight.title}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-red-600 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>


          {/* YouTube Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 backdrop-blur-xl bg-red-600/80 border border-red-400/20 text-white text-sm font-light rounded-full shadow-2xl">
              YouTube
            </span>
          </div>
        </div>
        
        <div className="px-4 py-6 flex-1 flex flex-col">
          <div className="flex items-center text-sm text-gray-400 mb-4 space-x-4 font-light">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(insight.date).toLocaleDateString()}</span>
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
              className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-light rounded-lg transition-all duration-300 ml-4 flex-shrink-0 hover:bg-red-700"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleWatchEpisode(e);
              }}
            >
              <span className="mr-2">Watch Episode</span>
              <Play className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EpisodeCard;