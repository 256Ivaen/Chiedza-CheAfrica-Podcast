import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from "lucide-react";
import SectionHeader from '../ui/Shared/SectionHeader';

const FeaturedInsights = ({ insights = [] }) => {
  const featuredInsights = insights?.filter(insight => insight.featured) || [];
  const regularInsights = insights?.filter(insight => !insight.featured) || [];
  const navigate = useNavigate();

  // Fill up to 5 slots with featured first, then regular insights
  const displayInsights = [];
  const totalSlots = 5;
  
  // Add featured insights first
  displayInsights.push(...featuredInsights.slice(0, totalSlots));
  
  // Fill remaining slots with regular insights if needed
  const remainingSlots = totalSlots - displayInsights.length;
  if (remainingSlots > 0) {
    displayInsights.push(...regularInsights.slice(0, remainingSlots));
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  if (displayInsights.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <SectionHeader 
          subtitle="Editor's Choice"
          title="Featured Insights"
          icon={Calendar}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Article - Fixed Height */}
          <motion.div 
            className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-primary transition-colors h-80"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            onClick={() => navigate(`/blog/${displayInsights[0]?.id}`)}
          >
            <div className="flex flex-col md:flex-row h-full gap-4">
              <div className="md:w-1/2 relative flex-shrink-0">
                <img
                  src={displayInsights[0]?.image}
                  alt={displayInsights[0]?.title}
                  className="w-full h-48 md:h-full object-cover rounded-xl"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-xs font-light rounded-full shadow-2xl ring-1 ring-primary/10">
                    {displayInsights[0]?.category}
                  </span>
                </div>
              </div>
              
              <div className="md:w-1/2 flex flex-col justify-center min-h-0">
                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4 font-light">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{displayInsights[0]?.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{displayInsights[0]?.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-light text-white mb-3 line-clamp-2">
                  {displayInsights[0]?.title}
                </h3>
                
                <p className="text-xs text-gray-300 mb-4 line-clamp-3 flex-1">
                  {displayInsights[0]?.excerpt}
                </p>
                
                <button className="self-start flex items-center px-4 py-2 bg-primary text-white text-xs font-light rounded-lg transition-all duration-300 mt-auto hover:bg-primary/90">
                  <span className="mr-2">Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Fixed Height */}
          {displayInsights[1] && (
            <motion.div 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-primary transition-colors h-80 flex flex-col"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onClick={() => navigate(`/blog/${displayInsights[1]?.id}`)}
            >
              <div className="relative mb-4 flex-shrink-0">
                <img
                  src={displayInsights[1]?.image}
                  alt={displayInsights[1]?.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-xs font-light rounded-full shadow-2xl ring-1 ring-primary/10">
                    {displayInsights[1]?.featured ? 'Featured' : displayInsights[1]?.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-400 mb-2 space-x-3 font-light">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{displayInsights[1]?.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{displayInsights[1]?.readTime}</span>
                </div>
              </div>
              
              <h4 className="text-sm font-light text-white mb-2 line-clamp-2">
                {displayInsights[1]?.title}
              </h4>

              <p className="text-xs text-gray-300 line-clamp-3 flex-1">
                {displayInsights[1]?.excerpt}
              </p>
            </motion.div>
          )}
        </div>

        {/* Bottom Section - Fixed Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {displayInsights.slice(2, 5).map((insight, index) => (
            <motion.div 
              key={insight?.id || `insight-${index + 2}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-primary transition-colors h-80 flex flex-col"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onClick={() => navigate(`/insights/${insight?.id}`)}
            >
              <div className="relative mb-4 flex-shrink-0">
                <img
                  src={insight?.image}
                  alt={insight?.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-xs font-light rounded-full shadow-2xl ring-1 ring-primary/10">
                    {insight?.featured ? 'Featured' : insight?.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-400 mb-2 space-x-3 font-light">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{insight?.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{insight?.readTime}</span>
                </div>
              </div>
              
              <h4 className="text-sm font-light text-white mb-3 line-clamp-2">
                {insight?.title}
              </h4>

              <p className="text-xs text-gray-300 line-clamp-3 flex-1">
                {insight?.excerpt}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedInsights;