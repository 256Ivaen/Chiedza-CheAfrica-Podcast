import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import AdvancedFilterSearch from './AdvancedFilterSearch';
import InsightCard from './InsightCard';
import EnhancedPagination from './EnhancedPagination';
import SectionHeader from '../ui/Shared/SectionHeader';
import NoInsightsAvailable from './NoInsightsAvailable'; // Import the new component

const AllInsights = ({ insights = [], categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const insightsPerPage = 6;

  // Check if there are no insights at all
  const hasNoInsights = !insights || insights.length === 0;

  // If no insights exist, show the NoInsightsAvailable component
  if (hasNoInsights) {
    return <NoInsightsAvailable />;
  }

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

  // Rest of your existing component logic...
  const filteredInsights = (Array.isArray(insights) ? insights : [])
    .filter(insight => {
      if (!insight) return false;
      
      const selectedCategories = Array.isArray(selectedCategory) ? selectedCategory : [selectedCategory];
      const matchesCategory = selectedCategories.includes("All") || selectedCategories.includes(insight.category);
      
      const matchesSearch = insight.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.author?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const indexOfLastInsight = currentPage * insightsPerPage;
  const indexOfFirstInsight = indexOfLastInsight - insightsPerPage;
  const currentInsights = filteredInsights.slice(indexOfFirstInsight, indexOfLastInsight);
  const totalPages = Math.ceil(filteredInsights.length / insightsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <SectionHeader 
          subtitle="Browse All Content"
          title="All Insights & Stories"
          icon={Search}
        />

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
          filteredCount={filteredInsights.length}
          categories={categories}
        />

        {/* Insights Grid/List */}
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
            {currentInsights.map((insight, index) => (
              <InsightCard 
                key={insight?.id || index}
                insight={insight}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results from filtering */}
        {filteredInsights.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-light text-white mb-2">No insights found</h3>
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
        {filteredInsights.length > 0 && (
          <EnhancedPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            indexOfFirstInsight={indexOfFirstInsight}
            indexOfLastInsight={indexOfLastInsight}
            filteredCount={filteredInsights.length}
          />
        )}
      </div>
    </section>
  );
};

export default AllInsights;