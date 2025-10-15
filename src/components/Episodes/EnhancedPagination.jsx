import React from 'react';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EnhancedPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  indexOfFirstInsight, 
  indexOfLastInsight, 
  filteredCount 
}) => {
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div 
      className="flex items-center justify-between mt-12 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Results Summary */}
      <div className="text-sm text-gray-300 font-light">
        Showing {indexOfFirstInsight + 1}-{Math.min(indexOfLastInsight, filteredCount)} of {filteredCount} insights
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous Button */}
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full transition-all duration-200 ${
            currentPage === 1 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-gray-300 hover:text-primary hover:bg-white/10'
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <motion.button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 rounded-full text-sm font-light transition-all duration-200 ${
                page === currentPage
                  ? 'text-primary border-2 border-primary'
                  : typeof page === 'number'
                  ? 'text-gray-300 hover:text-primary hover:bg-white/10'
                  : 'text-gray-500 cursor-default'
              }`}
              disabled={typeof page !== 'number'}
              whileHover={typeof page === 'number' && page !== currentPage ? { scale: 1.1 } : {}}
              whileTap={typeof page === 'number' && page !== currentPage ? { scale: 0.9 } : {}}
            >
              {page}
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full transition-all duration-200 ${
            currentPage === totalPages 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-gray-300 hover:text-primary hover:bg-white/10'
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EnhancedPagination;