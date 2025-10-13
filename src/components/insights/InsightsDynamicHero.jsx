import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import PageHero from '../ui/Shared/PageHero';

const InsightsDynamicHero = ({ insights = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const cycleDuration = 10000;

  const heroInsights = insights.filter(insight => insight.heroData);

  useEffect(() => {
    if (heroInsights.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroInsights.length);
    }, cycleDuration);

    return () => clearInterval(timer);
  }, [heroInsights.length]);

  const currentInsight = heroInsights[currentSlide];
  
  if (!currentInsight) {
    // Fallback to first insight if no hero insights
    const firstInsight = insights[0];
    if (!firstInsight) return null;
    
    return (
      <PageHero 
        title={firstInsight.title}
        subtitle={`${firstInsight.category} • ${firstInsight.readTime} • ${firstInsight.author}`}
        image={firstInsight.heroImage || firstInsight.image}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <PageHero 
          title={currentInsight.title}
          subtitle={`${currentInsight.category} • ${currentInsight.readTime} • ${currentInsight.author}`}
          image={currentInsight.heroImage || currentInsight.image}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default InsightsDynamicHero;