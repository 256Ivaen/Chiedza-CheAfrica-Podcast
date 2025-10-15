import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import PageHero from '../ui/Shared/PageHero';

const EpisodeDynamicHero = ({ episodes = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const cycleDuration = 10000;

  // Use first 3 episodes as hero episodes
  const heroEpisodes = episodes.slice(0, 3);

  useEffect(() => {
    if (heroEpisodes.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroEpisodes.length);
    }, cycleDuration);

    return () => clearInterval(timer);
  }, [heroEpisodes.length]);

  const currentEpisode = heroEpisodes[currentSlide];
  
  if (!currentEpisode) {
    // Fallback to default hero if no episodes
    return (
      <PageHero 
        title="Chiedza CheAfrica Podcast"
        subtitle="African Stories & Innovation • Explore Our Latest Episodes"
        image="https://i.ytimg.com/vi/-mgj8ow89v8/maxresdefault.jpg"
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
          title={currentEpisode.title}
          subtitle={`${currentEpisode.category} • ${currentEpisode.readTime} • ${currentEpisode.author}`}
          image={currentEpisode.image || "https://i.ytimg.com/vi/-mgj8ow89v8/maxresdefault.jpg"}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default EpisodeDynamicHero;