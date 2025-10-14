import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
import AdvancedFilterSearch from './AdvancedFilterSearch';
import InsightCard from './EpisodeCard';
import EnhancedPagination from './EnhancedPagination';
import SectionHeader from '../ui/Shared/SectionHeader';
import NoInsightsAvailable from './NoEpisodeAvailable';
import { youtubeService } from '../../services/youtubeService';

const AllEpisodes = ({ episodes = [], categories = [], loading: propLoading = false }) => {
  const [localEpisodes, setLocalEpisodes] = useState(episodes);
  const [loading, setLoading] = useState(!episodes || episodes.length === 0);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const episodesPerPage = 6;

  // Use prop loading if provided
  const isLoading = propLoading || loading;

  // Fetch episodes if not provided via props
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!episodes || episodes.length === 0) {
        try {
          setLoading(true);
          setError(null);
          const response = await youtubeService.getChannelVideos(50);
          setLocalEpisodes(response.videos);
        } catch (error) {
          console.error('Error fetching episodes:', error);
          setError('Failed to load episodes from YouTube. Please check the console for details.');
        } finally {
          setLoading(false);
        }
      } else {
        setLocalEpisodes(episodes);
        setLoading(false);
      }
    };

    if (!propLoading) {
      fetchEpisodes();
    }
  }, [episodes, propLoading]);

  // Refresh episodes
  const refreshEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await youtubeService.getChannelVideos(50);
      setLocalEpisodes(response.videos);
    } catch (error) {
      console.error('Error refreshing episodes:', error);
      setError('Failed to refresh episodes. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  // Filter and sort episodes using useMemo to prevent unnecessary re-renders
  const filteredEpisodes = useMemo(() => {
    return (Array.isArray(localEpisodes) ? localEpisodes : [])
      .filter(episode => {
        if (!episode) return false;
        
        const selectedCategories = Array.isArray(selectedCategory) ? selectedCategory : [selectedCategory];
        const matchesCategory = selectedCategories.includes("All") || selectedCategories.includes(episode.category);
        
        const matchesSearch = episode.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             episode.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             episode.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             episode.author?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        switch (sortBy) {
          case 'newest':
            return new Date(b.date || 0) - new Date(a.date || 0);
          case 'oldest':
            return new Date(a.date || 0) - new Date(b.date || 0);
          case 'readTime':
            return parseInt(a.readTime || 0) - parseInt(b.readTime || 0);
          case 'alphabetical':
            return (a.title || '').localeCompare(b.title || '');
          default:
            return 0;
        }
      });
  }, [localEpisodes, selectedCategory, searchTerm, sortBy]);

  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = filteredEpisodes.slice(indexOfFirstEpisode, indexOfLastEpisode);
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  // Check if there are no episodes at all
  const hasNoEpisodes = !localEpisodes || localEpisodes.length === 0;

  // Skeleton loading components
  const EpisodeCardSkeleton = ({ viewMode = 'grid' }) => {
    if (viewMode === 'list') {
      return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 animate-pulse">
          <div className="flex space-x-4">
            <div className="w-48 h-32 bg-gray-700 rounded-xl flex-shrink-0"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 animate-pulse h-full flex flex-col">
        <div className="relative overflow-hidden rounded-xl mb-4">
          <div className="w-full h-48 bg-gray-700 rounded-xl"></div>
        </div>
        <div className="px-2 py-4 flex-1 flex flex-col">
          <div className="flex items-center text-xs mb-4 space-x-4">
            <div className="h-3 bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-5 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2 mb-5 flex-grow">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-4/5"></div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
            </div>
            <div className="h-8 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  };

  const FilterSkeleton = () => (
    <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg animate-pulse">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full flex-1">
            <div className="w-full h-12 bg-gray-700 rounded-full"></div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="h-8 bg-gray-700 rounded-full w-24"></div>
            <div className="flex items-center bg-gray-700 rounded-lg p-1 w-20 h-9"></div>
            <div className="h-9 bg-gray-700 rounded-lg w-32"></div>
            <div className="h-9 bg-gray-700 rounded-lg w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render different states
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          {/* Refresh Button Skeleton */}
          <div className="flex justify-end mb-6">
            <div className="h-9 bg-gray-700 rounded-lg w-40 animate-pulse"></div>
          </div>

          {/* Filter Skeleton */}
          <FilterSkeleton />

          {/* Episodes Grid/List Skeleton */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
          }>
            {Array.from({ length: 6 }).map((_, index) => (
              <EpisodeCardSkeleton key={index} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-12 w-full">
            <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="h-9 bg-gray-700 rounded-full w-9 animate-pulse"></div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-9 bg-gray-700 rounded-full w-9 animate-pulse"></div>
              ))}
              <div className="h-9 bg-gray-700 rounded-full w-9 animate-pulse"></div>
            </div>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-light text-white mb-2">Unable to load episodes</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={refreshEpisodes}
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-sm font-light"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (hasNoEpisodes) {
      return <NoInsightsAvailable />;
    }

    return (
      <>
        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={refreshEpisodes}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-light flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Episodes'}
          </button>
        </div>

        {/* Advanced Filter and Search */}
        <AdvancedFilterSearch 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filteredCount={filteredEpisodes.length}
          categories={categories}
        />

        {/* Episodes Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedCategory}-${searchTerm}-${currentPage}-${viewMode}-${sortBy}`}
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
            }
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {currentEpisodes.map((episode, index) => (
              <InsightCard 
                key={episode?.id || index}
                insight={episode}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results from filtering */}
        {filteredEpisodes.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-light text-white mb-2">No episodes found</h3>
            <p className="text-gray-300 text-sm mb-4">Try adjusting your search terms or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(['All']);
              }}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-xs font-light"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Enhanced Pagination */}
        {filteredEpisodes.length > 0 && (
          <EnhancedPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            indexOfFirstInsight={indexOfFirstEpisode}
            indexOfLastInsight={indexOfLastEpisode}
            filteredCount={filteredEpisodes.length}
          />
        )}
      </>
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <SectionHeader 
          subtitle="Browse All Episodes"
          title="All Podcast Episodes"
          icon={Search}
        />

        {renderContent()}
      </div>
    </section>
  );
};

export default AllEpisodes;