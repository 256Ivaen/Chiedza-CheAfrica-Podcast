import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { get } from '../../utils/service';

const BlogsSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await get('blogs');
        
        if (response?.success && response?.data?.blogs) {
          const blogsData = response.data.blogs;
          
          // Transform API data to match frontend structure
          const transformedBlogs = blogsData
            .filter(blog => blog.visible) // Only show visible blogs
            .map(blog => ({
              id: blog.id,
              title: blog.title,
              author: blog.author,
              date: new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              readTime: blog.read_time,
              category: blog.category,
              image: blog.image,
              excerpt: blog.excerpt,
              featured: blog.featured
            }));

          setBlogs(transformedBlogs);

          // Extract unique categories from blogs
          const uniqueCategories = ["All", ...new Set(blogsData.map(blog => blog.category).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          setBlogs([]);
          setCategories(["All"]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs');
        setBlogs([]);
        setCategories(["All"]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Filter blogs and limit to 4
  const filteredBlogs = blogs
    .filter(blog => selectedCategory === "All" || blog.category === selectedCategory)
    .slice(0, 4); // Maximum 4 blogs

  // Skeleton loading component
  const BlogCardSkeleton = () => (
    <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 animate-pulse">
      <div className="w-20 h-20 bg-gray-700 rounded-xl flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-gray-700 rounded-full w-16"></div>
          <div className="h-3 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  // If no blogs at all, don't show the section
  if (!loading && blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-white">
            Popular podcasts
          </h2>
          <button
            onClick={() => navigate('/blog')}
            className="text-gray-400 hover:text-primary transition-colors text-sm font-light"
          >
            See All
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center space-x-2 flex-shrink-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-light whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2 flex-shrink-0 ml-auto">
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blogs Grid - Horizontal Layout */}
        {!loading && !error && filteredBlogs.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                variants={fadeInUp}
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-primary transition-all cursor-pointer group"
              >
                {/* Blog Image */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Blog Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-white text-sm font-normal mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>

                  {/* Author */}
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <span className="font-light uppercase truncate">{blog.author}</span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-2">
                    {/* Play Button Icon */}
                    <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-gray-400 border-b-[4px] border-b-transparent ml-0.5"></div>
                    </div>
                    {blog.readTime && (
                      <span className="text-sm text-gray-400">{blog.readTime}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && filteredBlogs.length === 0 && blogs.length > 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-white mb-2">No blogs found</h3>
            <p className="text-gray-300 text-sm mb-4">Try selecting a different category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-sm font-light"
            >
              Show All Blogs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogsSection;