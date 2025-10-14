import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { get } from '../utils/service';

// Import all components
import InsightsDynamicHero from '../components/insights/InsightsDynamicHero';
import FeaturedInsights from '../components/insights/FeaturedInsights';
import AllInsights from '../components/insights/AllInsights';
import NoInsightsAvailable from '../components/insights/NoInsightsAvailable';

// Skeleton Components
const SkeletonHero = () => (
  <div className="w-full h-96 bg-gray-800 animate-pulse rounded-lg">
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
);

const SkeletonFeaturedInsights = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="bg-gray-800 rounded-2xl p-4 animate-pulse">
        <div className="h-48 bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

const SkeletonAllInsights = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-gray-800 rounded-2xl p-4 animate-pulse">
        <div className="h-40 bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

const SkeletonAuthorSpotlight = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="text-center animate-pulse">
        <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6 mx-auto"></div>
      </div>
    ))}
  </div>
);

const InsightsPage = () => {
  const location = useLocation();
  const [insights, setInsights] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await get('blogs');
      
      if (response?.success && response?.data?.blogs) {
        const blogs = response.data.blogs;
        
        // Transform API data to match your frontend structure
        const transformedInsights = blogs.map(blog => ({
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category,
          author: blog.author,
          image: blog.image,
          heroImage: blog.hero_image,
          readTime: blog.read_time,
          date: new Date(blog.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          featured: blog.featured,
          visible: blog.visible,
          tags: blog.tags || [],
          heroData: blog.hero_data || {},
          // Add stats from API
          viewCount: blog.view_count || 0,
          commentCount: blog.comment_count || 0,
          reactionCount: blog.reaction_count || 0
        }));

        setInsights(transformedInsights);

        // Extract unique categories
        const uniqueCategories = [...new Set(blogs.map(blog => blog.category))].filter(Boolean);
        setCategories(uniqueCategories);

        // Extract and format authors data
        const authorsData = extractAuthorsData(blogs);
        setAuthors(authorsData);
        
      } else {
        setInsights([]);
        setCategories([]);
        setAuthors([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load insights. Please try again later.');
      setInsights([]);
      setCategories([]);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract authors data from blogs
  const extractAuthorsData = (blogs) => {
    const authorMap = new Map();
    
    blogs.forEach(blog => {
      if (blog.author && blog.visible) {
        if (!authorMap.has(blog.author)) {
          authorMap.set(blog.author, {
            name: blog.author,
            articles: 0,
            expertise: blog.category,
            latestArticle: blog.title,
            avatar: generateAvatarUrl(blog.author)
          });
        }
        
        const author = authorMap.get(blog.author);
        author.articles += 1;
        
        // Update expertise to most common category
        if (blog.category) {
          author.expertise = blog.category;
        }
      }
    });

    // Convert to array and sort by number of articles
    return Array.from(authorMap.values())
      .sort((a, b) => b.articles - a.articles)
      .slice(0, 3); // Take top 3 authors
  };

  // Generate avatar URL based on author name (you can replace with actual avatar logic)
  const generateAvatarUrl = (authorName) => {
    // Using a placeholder service - you can replace with your own logic
    const encodedName = encodeURIComponent(authorName);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=0D8ABC&color=fff&size=150`;
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getCanonicalUrl = () => {
    const baseUrl = "https://chiedzacheafrica.com";
    return baseUrl + location.pathname;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Chiedza CheAfrica Insights",
    "url": "https://chiedzacheafrica.com/insights",
    "description": "Latest insights and stories from Chiedza CheAfrica Podcast - African aviation, STEM pathways, disability inclusion, mental health advocacy, and youth empowerment.",
    "publisher": {
      "@type": "Organization",
      "name": "Chiedza CheAfrica Podcast"
    }
  };

  // Show loading state with skeletons
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Insights - Chiedza CheAfrica Podcast</title>
        </Helmet>

        <main className="overflow-hidden">
          <section id="insights-hero" aria-label="Insights hero section" className="py-8">
            <SkeletonHero />
          </section>

          <section id="featured-insights" aria-label="Featured insights" className="py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="h-8 bg-gray-800 rounded w-64 mb-6 animate-pulse"></div>
              <SkeletonFeaturedInsights />
            </div>
          </section>

          <section id="all-insights-section" aria-label="All insights" className="py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="h-8 bg-gray-800 rounded w-64 mb-6 animate-pulse"></div>
              <SkeletonAllInsights />
            </div>
          </section>

          <section id="author-spotlight" aria-label="Author spotlight" className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-12 animate-pulse"></div>
              <SkeletonAuthorSpotlight />
            </div>
          </section>
        </main>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchBlogs}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show no insights available if empty
  if (insights.length === 0) {
    return <NoInsightsAvailable />;
  }

  return (
    <>
      <Helmet>
        <title>Insights - Chiedza CheAfrica Podcast | African Stories & Innovation</title>
        <meta 
          name="description" 
          content="Explore insights from Chiedza CheAfrica Podcast - African aviation stories, STEM pathways, disability inclusion, mental health advocacy, and youth empowerment initiatives." 
        />
        <meta 
          name="keywords" 
          content="African podcast, aviation Africa, STEM Africa, disability inclusion, mental health advocacy, youth empowerment, African stories, Chiedza CheAfrica" 
        />
        
        <link rel="canonical" href={getCanonicalUrl()} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta property="og:title" content="Insights & Stories | Chiedza CheAfrica Podcast" />
        <meta property="og:description" content="African aviation, STEM pathways, disability inclusion, and youth empowerment stories from Chiedza CheAfrica Podcast." />
        <meta property="og:image" content="https://chiedzacheafrica.com/og-insights-image.jpg" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="overflow-hidden">
        <section id="insights-hero" aria-label="Insights hero section">
          <InsightsDynamicHero insights={insights} />
        </section>

        <section id="featured-insights" aria-label="Featured insights">
          <FeaturedInsights insights={insights} />
        </section>

        <section id="all-insights-section" aria-label="All insights">
          <AllInsights insights={insights} categories={categories} />
        </section>
      </main>
    </>
  );
};

export default InsightsPage;