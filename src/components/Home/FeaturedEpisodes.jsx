import React, { useMemo } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Play } from "lucide-react";
import SectionHeader from '../ui/Shared/SectionHeader';

const FeaturedEpisodes = ({ episodes = [], loading = false }) => {
  const navigate = useNavigate();

  // Get display episodes - just take first 5 valid episodes (no shorts)
  const displayEpisodes = useMemo(() => {
    if (!episodes || episodes.length === 0) return [];

    // Filter out shorts and take first 5
    const validEpisodes = episodes.filter(episode => {
      if (!episode) return false;
      
      // Filter out shorts based on multiple conditions
      const isShort = episode.isShort || 
                      episode.type === 'short' || 
                      episode.category === 'short' ||
                      (episode.duration && episode.duration < 60) ||
                      (episode.title && episode.title.toLowerCase().includes('#short')) ||
                      (episode.description && episode.description.toLowerCase().includes('#short'));
      
      return !isShort;
    });

    return validEpisodes.slice(0, 5);
  }, [episodes]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Skeleton loading component
  const EpisodeSkeletonCard = ({ isMain = false }) => {
    if (isMain) {
      return (
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 animate-pulse h-80">
          <div className="flex flex-col md:flex-row h-full gap-4">
            <div className="md:w-1/2 relative flex-shrink-0">
              <div className="w-full h-48 md:h-full bg-gray-700 rounded-xl"></div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center space-y-4">
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-5 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 animate-pulse h-80 flex flex-col">
        <div className="relative mb-4 flex-shrink-0">
          <div className="w-full h-40 bg-gray-700 rounded-xl"></div>
        </div>
        <div className="flex space-x-3 mb-2">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded mb-3"></div>
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-700 rounded w-4/5"></div>
        </div>
      </div>
    );
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeader 
            subtitle="Editor's Choice"
            title="Featured Episodes"
            icon={Play}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EpisodeSkeletonCard isMain={true} />
            <EpisodeSkeletonCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <EpisodeSkeletonCard />
            <EpisodeSkeletonCard />
            <EpisodeSkeletonCard />
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no episodes
  if (displayEpisodes.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <SectionHeader 
          subtitle="Editor's Choice"
          title="Featured Episodes"
          icon={Play}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Episode - Fixed Height */}
          {displayEpisodes[0] && (
            <motion.div 
              className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-primary transition-colors h-80"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onClick={() => navigate(`/episodes/${displayEpisodes[0]?.id}`)}
            >
              <div className="flex flex-col md:flex-row h-full gap-4">
                <div className="md:w-1/2 relative flex-shrink-0">
                  <img
                    src={displayEpisodes[0]?.image || displayEpisodes[0]?.thumbnail}
                    alt={displayEpisodes[0]?.title}
                    className="w-full h-48 md:h-full object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-sm font-light rounded-full shadow-2xl ring-1 ring-primary/10">
                      Featured
                    </span>
                  </div>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex flex-col justify-center min-h-0">
                  <div className="flex items-center text-sm text-gray-400 mb-3 font-light">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{displayEpisodes[0]?.date}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-light text-white mb-3 line-clamp-2">
                    {displayEpisodes[0]?.title}
                  </h3>
                  
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-1">
                    {displayEpisodes[0]?.excerpt || displayEpisodes[0]?.description || "From Masai Mara to the Skies — A young pilot's inspiring story of hope and community."}
                  </p>
                  
                  <button className="self-start flex items-center px-4 py-2 bg-primary text-white text-sm font-light rounded-lg transition-all duration-300 mt-auto hover:bg-primary/90">
                    <span className="mr-2">Watch Episode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Right Column - Fixed Height */}
          {displayEpisodes[1] && (
            <motion.div 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-primary transition-colors h-80 flex flex-col"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onClick={() => navigate(`/episodes/${displayEpisodes[1]?.id}`)}
            >
              <div className="relative mb-4 flex-shrink-0">
                <img
                  src={displayEpisodes[1]?.image || displayEpisodes[1]?.thumbnail}
                  alt={displayEpisodes[1]?.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-sm font-light rounded-full shadow-2xl ring-1 ring-primary/10">
                    Featured
                  </span>
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-400 mb-2 font-light">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{displayEpisodes[1]?.date}</span>
                </div>
              </div>
              
              <h4 className="text-sm font-light text-white mb-2 line-clamp-2">
                {displayEpisodes[1]?.title}
              </h4>

              <p className="text-sm text-gray-300 line-clamp-3 flex-1">
                {displayEpisodes[1]?.excerpt || displayEpisodes[1]?.description || "From Physics to Space Systems — How Africa's new generation is reaching for the stars."}
              </p>
            </motion.div>
          )}
        </div>

        {/* Bottom Section - Fixed Heights */}
        {displayEpisodes.length > 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {displayEpisodes.slice(2, 5).map((episode, index) => {
              const descriptions = [
                "Dementia & Dignity — Understanding compassion in care.",
                "STEM for All — Breaking barriers and building futures.",
                "Inspiring stories that light paths and change lives."
              ];
              
              return (
                <motion.div 
                  key={episode?.id || `episode-${index + 2}`}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-primary transition-colors h-80 flex flex-col"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  onClick={() => navigate(`/episodes/${episode?.id}`)}
                >
                  <div className="relative mb-4 flex-shrink-0">
                    <img
                      src={episode?.image || episode?.thumbnail}
                      alt={episode?.title}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 backdrop-blur-xl bg-white/10 border border-primary/20 text-white text-sm font-light rounded-full shadow-2xl ring-1 ring-primary/10">
                        Featured
                      </span>
                    </div>
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-2 font-light">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{episode?.date}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-light text-white mb-3 line-clamp-2">
                    {episode?.title}
                  </h4>

                  <p className="text-sm text-gray-300 line-clamp-3 flex-1">
                    {episode?.excerpt || episode?.description || descriptions[index]}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEpisodes;