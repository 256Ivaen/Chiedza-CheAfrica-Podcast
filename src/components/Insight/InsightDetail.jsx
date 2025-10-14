import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, User, ArrowLeft, ArrowRight, Facebook, Twitter, Linkedin, 
  Link2, Check, BookOpen, Eye, MessageSquare, Heart, ThumbsUp, Sparkles, 
  Award, Send, Mail, Shield, UserX 
} from 'lucide-react';
import { get, post, del } from '../../utils/service';
import PageHero from '../ui/Shared/PageHero';
import SectionHeader from '../ui/Shared/SectionHeader';
import CTA from '../ui/Shared/CTA';

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

const SkeletonContent = () => (
  <div className="space-y-6">
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-6">
          <div className="h-4 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    </div>
    
    <div className="bg-gray-800 rounded-lg p-8 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-700 rounded w-full mb-4"></div>
      ))}
      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
    </div>
    
    <div className="bg-gray-800 rounded-lg p-8 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-48 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="h-12 bg-gray-700 rounded"></div>
        <div className="h-12 bg-gray-700 rounded"></div>
      </div>
      <div className="h-24 bg-gray-700 rounded mb-4"></div>
      <div className="h-12 bg-gray-700 rounded w-32"></div>
    </div>
  </div>
);

const SkeletonSidebar = () => (
  <div className="bg-gray-800 rounded-lg p-6 animate-pulse sticky top-32">
    <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-700 rounded"></div>
      ))}
    </div>
    <div className="h-px bg-gray-700 my-6"></div>
    <div className="h-6 bg-gray-700 rounded w-32 mb-3"></div>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
      <div>
        <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  </div>
);

const SkeletonComments = () => (
  <div className="bg-gray-800 rounded-lg p-8 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-48 mb-6"></div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border-l-2 border-gray-700 pl-4 py-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const InsightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [relatedInsights, setRelatedInsights] = useState([]);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');
  
  // Comment state
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: '',
    isAnonymous: false
  });
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Generate device identifier
  const getDeviceIdentifier = () => {
    // Try to get from localStorage first
    let deviceId = localStorage.getItem('device_identifier');
    
    if (!deviceId) {
      // Generate a new device identifier
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_identifier', deviceId);
    }
    
    return deviceId;
  };

  // Reaction types
  const reactionTypes = {
    like: { icon: ThumbsUp, label: 'Like', color: 'text-blue-500', activeColor: 'text-blue-400' },
    love: { icon: Heart, label: 'Love', color: 'text-red-500', activeColor: 'text-red-400' },
    insightful: { icon: Sparkles, label: 'Insightful', color: 'text-purple-500', activeColor: 'text-purple-400' },
    celebrate: { icon: Award, label: 'Celebrate', color: 'text-yellow-500', activeColor: 'text-yellow-400' }
  };

  // Fetch insight details
  const fetchInsightDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const deviceIdentifier = getDeviceIdentifier();

      // Fetch main insight with device identifier for view tracking
      const insightResponse = await get(`blogs/${id}?identifier=${deviceIdentifier}`);
      
      if (insightResponse?.success && insightResponse?.data) {
        const blogData = insightResponse.data;
        
        // Transform API data to match frontend structure
        const transformedInsight = {
          id: blogData.id,
          title: blogData.title,
          excerpt: blogData.excerpt,
          content: blogData.content,
          category: blogData.category,
          author: blogData.author,
          image: blogData.image,
          heroImage: blogData.hero_image,
          readTime: blogData.read_time,
          date: new Date(blogData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          featured: blogData.featured,
          visible: blogData.visible,
          tags: blogData.tags || [],
          heroData: blogData.hero_data || {},
          viewCount: blogData.view_count || 0,
          commentCount: blogData.comment_count || 0,
          reactionCount: blogData.reaction_count || 0,
          viewStats: blogData.view_stats || {},
          viewId: blogData.view_id // For updating view duration
        };

        setInsight(transformedInsight);

        // Fetch related insights
        await fetchRelatedInsights(blogData.category, blogData.id);
        
        // Fetch comments
        await fetchComments();
        
        // Fetch reactions
        await fetchReactions(deviceIdentifier);

      } else {
        setError('Insight not found');
      }
    } catch (error) {
      console.error('Error fetching insight details:', error);
      setError('Failed to load insight. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedInsights = async (category, currentId) => {
    try {
      const allBlogsResponse = await get('blogs');
      if (allBlogsResponse?.success && allBlogsResponse?.data?.blogs) {
        const related = allBlogsResponse.data.blogs
          .filter(blog => 
            blog.id !== currentId && 
            blog.visible
          )
          .sort((a, b) => {
            // Prioritize same category, then featured, then by date
            if (a.category === category && b.category !== category) return -1;
            if (b.category === category && a.category !== category) return 1;
            if (a.featured && !b.featured) return -1;
            if (b.featured && !a.featured) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
          })
          .slice(0, 3)
          .map(blog => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.excerpt,
            category: blog.category,
            author: blog.author,
            image: blog.image,
            readTime: blog.read_time,
            date: new Date(blog.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            viewCount: blog.view_count || 0,
            commentCount: blog.comment_count || 0,
            reactionCount: blog.reaction_count || 0
          }));

        setRelatedInsights(related);
      }
    } catch (error) {
      console.error('Error fetching related insights:', error);
      setRelatedInsights([]);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsResponse = await get(`blogs/${id}/comments`);
      if (commentsResponse?.success && commentsResponse?.data) {
        setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const fetchReactions = async (identifier) => {
    try {
      const reactionsResponse = await get(`blogs/${id}/reactions?identifier=${identifier}`);
      if (reactionsResponse?.success) {
        setReactions(reactionsResponse.data?.reactions || []);
        setUserReaction(reactionsResponse.data?.userReaction || null);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
      setReactions([]);
      setUserReaction(null);
    }
  };

  // Handle reaction
  const handleReaction = async (reactionType) => {
    try {
      const deviceIdentifier = getDeviceIdentifier();
      
      if (userReaction === reactionType) {
        // Remove reaction
        const response = await del(`blogs/${id}/reactions`, { identifier: deviceIdentifier });
        if (response?.success) {
          setUserReaction(null);
          await fetchReactions(deviceIdentifier);
        }
      } else {
        // Add reaction
        const response = await post(`blogs/${id}/reactions`, {
          type: reactionType,
          identifier: deviceIdentifier
        });
        if (response?.success) {
          setUserReaction(reactionType);
          await fetchReactions(deviceIdentifier);
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentForm.content.trim()) {
      return;
    }

    try {
      setCommentLoading(true);
      
      const commentData = {
        content: commentForm.content.trim()
      };

      if (commentForm.isAnonymous) {
        // Use device identifier for anonymous comments
        const deviceIdentifier = getDeviceIdentifier();
        commentData.name = `Anonymous_${deviceIdentifier.substr(0, 8)}`;
        commentData.email = `${deviceIdentifier}@anonymous.chiedzacheafrica.com`;
      } else {
        // Use provided name and email
        commentData.name = commentForm.name.trim();
        commentData.email = commentForm.email.trim();
      }

      const response = await post(`blogs/${id}/comments`, commentData);

      if (response?.success) {
        setCommentForm({ name: '', email: '', content: '', isAnonymous: false });
        setCommentSuccess(true);
        await fetchComments(); // Refresh comments
        
        setTimeout(() => setCommentSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Update view duration when user spends time on page
  useEffect(() => {
    if (!insight?.viewId) return;

    const startTime = Date.now();
    
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
      if (duration > 5) { // Only record if user spent more than 5 seconds
        updateViewDuration(duration);
      }
    };
  }, [insight?.viewId]);

  const updateViewDuration = async (duration) => {
    try {
      await post(`views/${insight.viewId}`, { duration });
    } catch (error) {
      console.error('Error updating view duration:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInsightDetails();
    }
  }, [id]);

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

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = insight.title;
    const description = insight.excerpt;
    const shareText = `${title}\n\n${description}\n\nRead more: ${url}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShareSuccess('facebook');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        setShareSuccess('twitter');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        setShareSuccess('linkedin');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareText);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        } catch (err) {
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        }
        break;
    }

    if (platform !== 'copy') {
      setTimeout(() => setShareSuccess(''), 2000);
    }
  };

  const Toast = ({ message, type = 'success' }) => (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg flex items-center space-x-2 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
      }`}
    >
      <Check className="w-5 h-5" />
      <span className="font-medium text-xs">{message}</span>
    </motion.div>
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Insight - Chiedza CheAfrica Podcast</title>
        </Helmet>

        <div className="min-h-screen">
          {/* Skeleton Hero */}
          <section className="py-8">
            <SkeletonHero />
          </section>

          {/* Skeleton Content */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <SkeletonContent />
                </div>
                <div className="lg:col-span-1">
                  <SkeletonSidebar />
                </div>
              </div>
            </div>
          </section>

          {/* Skeleton Comments */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
            <div className="max-w-6xl mx-auto">
              <SkeletonComments />
            </div>
          </section>
        </div>
      </>
    );
  }

  // Error state
  if (error || !insight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Insight not found</h1>
          <p className="text-gray-300 text-xs mb-6">{error || 'The insight you\'re looking for doesn\'t exist.'}</p>
          <button 
            onClick={() => navigate('/insights')}
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-xs font-light"
          >
            Back to Insights
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{insight.title} | Chiedza CheAfrica Insights</title>
        <meta name="description" content={insight.excerpt} />
        <meta name="keywords" content={insight.tags?.join(', ')} />
        <meta property="og:title" content={insight.title} />
        <meta property="og:description" content={insight.excerpt} />
        <meta property="og:image" content={insight.heroImage || insight.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={insight.title} />
        <meta name="twitter:description" content={insight.excerpt} />
        <meta name="twitter:image" content={insight.heroImage || insight.image} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": insight.title,
            "description": insight.excerpt,
            "image": insight.heroImage || insight.image,
            "author": {
              "@type": "Person",
              "name": insight.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Chiedza CheAfrica Podcast",
              "logo": {
                "@type": "ImageObject",
                "url": "https://chiedzacheafrica.com/logo.png"
              }
            },
            "datePublished": insight.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          })}
        </script>
      </Helmet>

      <AnimatePresence>
        {copySuccess && (
          <Toast message="Content copied to clipboard!" />
        )}
        {shareSuccess === 'facebook' && (
          <Toast message="Shared to Facebook!" type="info" />
        )}
        {shareSuccess === 'twitter' && (
          <Toast message="Shared to Twitter!" type="info" />
        )}
        {shareSuccess === 'linkedin' && (
          <Toast message="Shared to LinkedIn!" type="info" />
        )}
        {commentSuccess && (
          <Toast message="Comment submitted successfully!" />
        )}
      </AnimatePresence>

      <div className="min-h-screen">
        {/* Hero Section */}
        <PageHero 
          title={insight.title}
          subtitle={`${insight.category} • ${insight.readTime} • ${insight.author}`}
          image={insight.heroImage || insight.image}
        />

        {/* Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <motion.div 
                className="lg:col-span-3 order-2 lg:order-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                {/* Stats Bar */}
                <motion.div 
                  className="mb-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-between"
                  variants={fadeInUp}
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-light">{insight.viewCount} views</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-light">{comments.length} comments</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-light">{insight.reactionCount} reactions</span>
                    </div>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center space-x-2">
                    {Object.entries(reactionTypes).map(([type, { icon: Icon, label, color, activeColor }]) => (
                      <motion.button
                        key={type}
                        onClick={() => handleReaction(type)}
                        className={`p-2 rounded-lg transition-all ${
                          userReaction === type 
                            ? 'bg-primary/20 border-2 border-primary/30' 
                            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title={label}
                      >
                        <Icon className={`w-4 h-4 ${userReaction === type ? activeColor : color}`} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Excerpt */}
                <motion.div 
                  className="mb-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
                  variants={fadeInUp}
                >
                  <p className="text-gray-300 text-sm leading-relaxed font-light">
                    {insight.excerpt}
                  </p>
                </motion.div>

                {/* Main Content */}
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-8"
                  variants={fadeInUp}
                >
                  <div className="text-gray-300 text-xs leading-relaxed space-y-6 font-light prose prose-invert max-w-none">
                    {insight.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-white text-sm font-light mb-4">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {insight.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full font-light">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Comments Section */}
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8"
                  variants={fadeInUp}
                >
                  <h3 className="text-white text-lg font-light mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Comments ({comments.length})
                  </h3>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    {/* Anonymous Toggle */}
                    <div className="flex items-center gap-3 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={commentForm.isAnonymous}
                          onChange={(e) => setCommentForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          commentForm.isAnonymous 
                            ? 'bg-primary border-primary' 
                            : 'bg-white/5 border-white/20'
                        }`}>
                          {commentForm.isAnonymous && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <UserX className="w-4 h-4" />
                          <span>Comment anonymously</span>
                        </div>
                      </label>
                    </div>

                    {!commentForm.isAnonymous && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-300 text-xs font-light mb-2">Name *</label>
                          <input
                            type="text"
                            required
                            value={commentForm.name}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-primary transition-colors"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-xs font-light mb-2">Email *</label>
                          <input
                            type="email"
                            required
                            value={commentForm.email}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-primary transition-colors"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-gray-300 text-xs font-light mb-2">Comment *</label>
                      <textarea
                        required
                        value={commentForm.content}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                        rows="4"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Share your thoughts..."
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={commentLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-xs font-light"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {commentLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Post Comment
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="border-l-2 border-primary/20 pl-4 py-2">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              {comment.is_admin_reply ? (
                                <Shield className="w-4 h-4 text-primary" />
                              ) : comment.email?.includes('@anonymous.') ? (
                                <UserX className="w-4 h-4 text-primary" />
                              ) : (
                                <User className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-white text-xs font-semibold">
                                  {comment.name || comment.admin_email}
                                </p>
                                {comment.is_admin_reply && (
                                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Admin</span>
                                )}
                                {comment.email?.includes('@anonymous.') && (
                                  <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">Anonymous</span>
                                )}
                              </div>
                              {comment.email && !comment.is_admin_reply && !comment.email.includes('@anonymous.') && (
                                <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                                  <Mail className="w-3 h-3" />
                                  {comment.email}
                                </p>
                              )}
                              <p className="text-gray-300 text-xs mb-1 leading-relaxed">
                                {comment.content}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-4 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="border-l-2 border-primary/10 pl-4 py-2">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      {reply.is_admin_reply ? (
                                        <Shield className="w-3 h-3 text-primary" />
                                      ) : (
                                        <User className="w-3 h-3 text-primary" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-white text-xs font-semibold">
                                          {reply.name || reply.admin_email}
                                        </p>
                                        {reply.is_admin_reply && (
                                          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Admin</span>
                                        )}
                                      </div>
                                      <p className="text-gray-300 text-xs mb-1 leading-relaxed">
                                        {reply.content}
                                      </p>
                                      <p className="text-gray-500 text-xs">
                                        {new Date(reply.created_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-xs">No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Sidebar */}
              <motion.div 
                className="lg:col-span-1 order-1 lg:order-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 sticky top-32"
                  variants={fadeInUp}
                >
                  <h3 className="text-white text-sm font-light mb-4">Share this insight</h3>
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Facebook className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-xs font-light group-hover:text-white transition-colors">Facebook</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Twitter className="w-4 h-4 text-sky-400" />
                      <span className="text-gray-300 text-xs font-light group-hover:text-white transition-colors">Twitter</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Linkedin className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300 text-xs font-light group-hover:text-white transition-colors">LinkedIn</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleShare('copy')}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all group ${
                        copySuccess 
                          ? 'bg-green-500/20 border-2 border-green-500/30' 
                          : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        animate={copySuccess ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {copySuccess ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Link2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        )}
                      </motion.div>
                      <span className={`text-xs font-light transition-colors ${
                        copySuccess ? 'text-green-400' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {copySuccess ? 'Copied!' : 'Copy Content'}
                      </span>
                    </motion.button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-white text-sm font-light mb-3">About the Author</h4>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-light">{insight.author}</p>
                        <p className="text-gray-300 text-xs mt-1 font-light">
                          Expert in {insight.category.toLowerCase()} with extensive industry experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Insights */}
        {relatedInsights.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
            <div className="max-w-6xl mx-auto">
              <SectionHeader 
                subtitle="Continue Reading"
                title="Related Insights"
                icon={BookOpen}
              />

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                {relatedInsights.map((relatedInsight) => (
                  <motion.div 
                    key={relatedInsight.id}
                    className="group cursor-pointer"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/insights/${relatedInsight.id}`)}
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 overflow-hidden h-full">
                      <div className="relative overflow-hidden">
                        <img 
                          src={relatedInsight.image}
                          alt={relatedInsight.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-primary text-white text-xs font-light rounded-full">
                            {relatedInsight.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-gray-400 text-xs mb-3 space-x-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{relatedInsight.readTime}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-white text-sm font-light mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {relatedInsight.title}
                        </h3>
                        
                        <p className="text-gray-300 text-xs mb-4 leading-relaxed line-clamp-2">
                          {relatedInsight.excerpt}
                        </p>
                        
                        <motion.div 
                          className="text-primary flex items-center text-xs font-light group-hover:text-primary/80 transition-colors duration-300"
                          whileHover={{ x: 4 }}
                        >
                          <span className="mr-1">Read More</span>
                          <ArrowRight className="w-3 h-3" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="text-center mt-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <button
                  onClick={() => navigate('/insights')}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-light text-xs"
                >
                  View All Insights
                </button>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <CTA
          title="Have an African Story to Share?"
          subtitle="If you're making an impact in aviation, STEM, disability inclusion, or community empowerment, we'd love to feature your journey and amplify your voice."
          primaryButton={{
            text: "Share Your Story",
            onClick: () => window.location.href = "/contact"
          }}
          secondaryButton={{
            text: "Listen to Podcast", 
            onClick: () => window.location.href = "/episodes"
          }}
        />
      </div>
    </>
  );
};

export default InsightDetail;