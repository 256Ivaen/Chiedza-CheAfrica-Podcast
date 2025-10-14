import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Grid, List } from "lucide-react";

const AdvancedFilterSearch = ({ 
  selectedCategory, 
  setSelectedCategory, 
  searchTerm, 
  setSearchTerm, 
  viewMode, 
  setViewMode,
  sortBy,
  setSortBy,
  filteredCount,
  categories = []
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'readTime', label: 'Read Time' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  // Handle multiple category selection
  const selectedCategories = Array.isArray(selectedCategory) ? selectedCategory : [selectedCategory];
  const isAllSelected = selectedCategories.includes('All') || selectedCategories.length === 0;

  const handleCategoryToggle = (category) => {
    if (category === 'All') {
      setSelectedCategory(['All']);
      return;
    }

    let newSelection;
    if (selectedCategories.includes(category)) {
      newSelection = selectedCategories.filter(cat => cat !== category);
      if (newSelection.length === 0) {
        newSelection = ['All'];
      }
    } else {
      newSelection = selectedCategories.filter(cat => cat !== 'All');
      newSelection.push(category);
    }
    setSelectedCategory(newSelection);
  };

  const clearFilters = () => {
    setSelectedCategory(['All']);
    setSearchTerm('');
    setSortBy('newest');
  };

  const categoryList = Array.isArray(categories) ? categories : [];

  return (
    <motion.div 
      className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar - Full Width */}
          <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-white placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm text-gray-300 bg-white/10 px-3 py-2 rounded-full font-light">
              {filteredCount} results
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-sm text-white font-light"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-colors duration-200 ${
                isFilterOpen 
                  ? 'bg-primary text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(!isAllSelected || searchTerm) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-gray-300 font-light">Active:</span>
            {!isAllSelected && selectedCategories.map(category => (
              <span key={category} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-light">
                {category}
              </span>
            ))}
            {searchTerm && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-light">
                "{searchTerm}"
              </span>
            )}
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm font-light hover:bg-white/20 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-6">
              <h4 className="text-sm font-light text-white mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categoryList.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-2 rounded-full text-sm font-light transition-colors duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedFilterSearch;