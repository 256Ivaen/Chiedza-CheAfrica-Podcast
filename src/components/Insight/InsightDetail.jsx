import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  BookOpen,
  Eye,
  MessageSquare,
  Heart,
  ThumbsUp,
  Sparkles,
  Award,
  Send,
  Mail,
  Shield,
  UserX,
  MoreVertical,
  Bookmark,
  Share2,
  X,
} from "lucide-react";
import { get, post, del } from "../../utils/service";
import CTA from "../ui/Shared/CTA";

// Skeleton Components
const SkeletonPost = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl animate-pulse max-w-6xl mx-auto">
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>

      <div className="w-full h-96 bg-gray-700 rounded-xl mb-4"></div>

      <div className="flex items-center justify-between pt-3">
        <div className="flex space-x-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-700 rounded w-20"></div>
          ))}
        </div>
      </div>
    </div>
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
  const [shareSuccess, setShareSuccess] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Comment state
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
    isAnonymous: false,
  });
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Generate device identifier
  const getDeviceIdentifier = () => {
    let deviceId = localStorage.getItem("device_identifier");

    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("device_identifier", deviceId);
    }

    return deviceId;
  };

  // Reaction types
  const reactionTypes = {
    like: {
      icon: ThumbsUp,
      label: "Like",
      color: "text-blue-500",
      activeColor: "text-blue-400",
      activeBg: "bg-blue-500/20",
    },
    love: {
      icon: Heart,
      label: "Love",
      color: "text-red-500",
      activeColor: "text-red-400",
      activeBg: "bg-red-500/20",
    },
    insightful: {
      icon: Sparkles,
      label: "Insightful",
      color: "text-purple-500",
      activeColor: "text-purple-400",
      activeBg: "bg-purple-500/20",
    },
    celebrate: {
      icon: Award,
      label: "Celebrate",
      color: "text-yellow-500",
      activeColor: "text-yellow-400",
      activeBg: "bg-yellow-500/20",
    },
  };

  // Load cached reaction from localStorage
  useEffect(() => {
    const cachedReaction = localStorage.getItem(`blog_${id}_reaction`);
    if (cachedReaction) {
      setUserReaction(cachedReaction);
    }
  }, [id]);

  // Fetch insight details
  const fetchInsightDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const deviceIdentifier = getDeviceIdentifier();
      const insightResponse = await get(
        `blogs/${id}?identifier=${deviceIdentifier}`
      );

      if (insightResponse?.success && insightResponse?.data) {
        const blogData = insightResponse.data;

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
          date: new Date(blogData.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          createdAt: blogData.created_at,
          featured: blogData.featured,
          visible: blogData.visible,
          tags: blogData.tags || [],
          heroData: blogData.hero_data || {},
          viewCount: blogData.view_count || 0,
          commentCount: blogData.comment_count || 0,
          reactionCount: blogData.reaction_count || 0,
          viewStats: blogData.view_stats || {},
          viewId: blogData.view_id,
        };

        setInsight(transformedInsight);
        await fetchRelatedInsights(blogData.category, blogData.id);
        await fetchComments();
        await fetchReactions(deviceIdentifier);
      } else {
        setError("Insight not found");
      }
    } catch (error) {
      console.error("Error fetching insight details:", error);
      setError("Failed to load insight. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedInsights = async (category, currentId) => {
    try {
      const allBlogsResponse = await get("blogs");
      if (allBlogsResponse?.success && allBlogsResponse?.data?.blogs) {
        const related = allBlogsResponse.data.blogs
          .filter((blog) => blog.id !== currentId && blog.visible)
          .sort((a, b) => {
            if (a.category === category && b.category !== category) return -1;
            if (b.category === category && a.category !== category) return 1;
            if (a.featured && !b.featured) return -1;
            if (b.featured && !a.featured) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
          })
          .slice(0, 3)
          .map((blog) => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.excerpt,
            category: blog.category,
            author: blog.author,
            image: blog.image,
            readTime: blog.read_time,
            date: new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            viewCount: blog.view_count || 0,
            commentCount: blog.comment_count || 0,
            reactionCount: blog.reaction_count || 0,
          }));

        setRelatedInsights(related);
      }
    } catch (error) {
      console.error("Error fetching related insights:", error);
      setRelatedInsights([]);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsResponse = await get(`blogs/${id}/comments`);
      if (commentsResponse?.success && commentsResponse?.data) {
        setComments(
          Array.isArray(commentsResponse.data) ? commentsResponse.data : []
        );
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const fetchReactions = async (identifier) => {
    try {
      const reactionsResponse = await get(
        `blogs/${id}/reactions?identifier=${identifier}`
      );
      if (reactionsResponse?.success) {
        setReactions(reactionsResponse.data?.reactions || []);
        const serverReaction = reactionsResponse.data?.userReaction || null;

        // Update local state and cache if server has a reaction
        if (serverReaction) {
          setUserReaction(serverReaction);
          localStorage.setItem(`blog_${id}_reaction`, serverReaction);
        }
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
      setReactions([]);
    }
  };

  const handleReaction = async (reactionType) => {
    try {
      const deviceIdentifier = getDeviceIdentifier();

      if (userReaction === reactionType) {
        // Remove reaction
        const response = await del(`blogs/${id}/reactions`, {
          identifier: deviceIdentifier,
        });
        if (response?.success) {
          setUserReaction(null);
          localStorage.removeItem(`blog_${id}_reaction`);
          await fetchReactions(deviceIdentifier);
        }
      } else {
        // Add reaction
        const response = await post(`blogs/${id}/reactions`, {
          type: reactionType,
          identifier: deviceIdentifier,
        });
        if (response?.success) {
          setUserReaction(reactionType);
          localStorage.setItem(`blog_${id}_reaction`, reactionType);
          await fetchReactions(deviceIdentifier);
        }
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentForm.content.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const commentData = {
        content: commentForm.content.trim(),
      };

      if (commentForm.isAnonymous) {
        const deviceIdentifier = getDeviceIdentifier();
        commentData.name = `Anonymous_${deviceIdentifier.substr(0, 8)}`;
        commentData.email = `${deviceIdentifier}@anonymous.chiedzacheafrica.com`;
      } else {
        commentData.name = commentForm.name.trim();
        commentData.email = commentForm.email.trim();
      }

      const response = await post(`blogs/${id}/comments`, commentData);

      if (response?.success) {
        setCommentForm({
          name: "",
          email: "",
          content: "",
          isAnonymous: false,
        });
        setCommentSuccess(true);
        await fetchComments();

        setTimeout(() => setCommentSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    if (!insight?.viewId) return;

    const startTime = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      if (duration > 5) {
        updateViewDuration(duration);
      }
    };
  }, [insight?.viewId]);

  const updateViewDuration = async (duration) => {
    try {
      await post(`views/${insight.viewId}`, { duration });
    } catch (error) {
      console.error("Error updating view duration:", error);
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = insight.title;
    const description = insight.excerpt;
    const shareText = `${title}\n\n${description}\n\nRead more: ${url}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        setShareSuccess("facebook");
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        setShareSuccess("twitter");
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        setShareSuccess("linkedin");
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(shareText);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        } catch (err) {
          const textArea = document.createElement("textarea");
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        }
        break;
    }

    if (platform !== "copy") {
      setTimeout(() => setShareSuccess(""), 2000);
    }
    setShowShareMenu(false);
  };

  const Toast = ({ message, type = "success" }) => (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg ${
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-blue-500 text-white"
      }`}
    >
      <Check className="w-5 h-5" />
      <span className="font-medium text-sm">{message}</span>
    </motion.div>
  );

  // Image Lightbox Component
  const ImageLightbox = ({ image, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <motion.img
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        src={image}
        alt="Full size"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Insight - Chiedza CheAfrica Podcast</title>
        </Helmet>

        <div className="min-h-screen pt-[100px]">
          <section className="px-4 sm:px-6">
            <SkeletonPost />
          </section>
        </div>
      </>
    );
  }

  // Error state
  if (error || !insight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-20">
        <div className="text-center px-4">
          <h1 className="text-2xl font-light text-white mb-4">
            Insight not found
          </h1>
          <p className="text-gray-300 text-sm mb-6">
            {error || "The insight you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-sm font-light"
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
        <meta name="title" content={insight.title} />
        <meta name="description" content={insight.excerpt} />
        <meta name="keywords" content={insight.tags?.join(", ")} />
        <meta name="author" content={insight.author} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <link
          rel="canonical"
          href={`https://chiedzacheafrica.com/blog/${id}`}
        />

        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://chiedzacheafrica.com/blog/${id}`}
        />
        <meta property="og:title" content={insight.title} />
        <meta property="og:description" content={insight.excerpt} />
        <meta
          property="og:image"
          content={insight.heroImage || insight.image}
        />
        <meta
          property="og:image:secure_url"
          content={insight.heroImage || insight.image}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={insight.title} />
        <meta property="og:site_name" content="Chiedza CheAfrica Podcast" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={insight.createdAt} />
        <meta property="article:modified_time" content={insight.createdAt} />
        <meta property="article:author" content={insight.author} />
        <meta property="article:section" content={insight.category} />
        {insight.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@chiedzacheafrica" />
        <meta name="twitter:creator" content="@chiedzacheafrica" />
        <meta
          name="twitter:url"
          content={`https://chiedzacheafrica.com/blog/${id}`}
        />
        <meta name="twitter:title" content={insight.title} />
        <meta name="twitter:description" content={insight.excerpt} />
        <meta
          name="twitter:image"
          content={insight.heroImage || insight.image}
        />
        <meta name="twitter:image:alt" content={insight.title} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: insight.title,
            description: insight.excerpt,
            image: {
              "@type": "ImageObject",
              url: insight.heroImage || insight.image,
              width: 1200,
              height: 630,
              caption: insight.title,
            },
            author: {
              "@type": "Person",
              name: insight.author,
              url: "https://chiedzacheafrica.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "Chiedza CheAfrica Podcast",
              logo: {
                "@type": "ImageObject",
                url: "https://chiedzacheafrica.com/logo.png",
                width: 600,
                height: 60,
              },
              url: "https://chiedzacheafrica.com",
            },
            datePublished: insight.createdAt,
            dateModified: insight.createdAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://chiedzacheafrica.com/blog/${id}`,
            },
            url: `https://chiedzacheafrica.com/blog/${id}`,
            keywords: insight.tags?.join(", "),
            articleSection: insight.category,
            wordCount: insight.content.split(" ").length,
            commentCount: comments.length,
            inLanguage: "en-US",
            isAccessibleForFree: true,
            interactionStatistic: [
              {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/ViewAction",
                userInteractionCount: insight.viewCount,
              },
              {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/CommentAction",
                userInteractionCount: comments.length,
              },
              {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/LikeAction",
                userInteractionCount: insight.reactionCount,
              },
            ],
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://chiedzacheafrica.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://chiedzacheafrica.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: insight.title,
                item: `https://chiedzacheafrica.com/blog/${id}`,
              },
            ],
          })}
        </script>
      </Helmet>

      <AnimatePresence>
        {copySuccess && <Toast message="Content copied to clipboard!" />}
        {shareSuccess === "facebook" && (
          <Toast message="Shared to Facebook!" type="info" />
        )}
        {shareSuccess === "twitter" && (
          <Toast message="Shared to Twitter!" type="info" />
        )}
        {shareSuccess === "linkedin" && (
          <Toast message="Shared to LinkedIn!" type="info" />
        )}
        {commentSuccess && <Toast message="Comment submitted successfully!" />}
        {lightboxImage && (
          <ImageLightbox
            image={lightboxImage}
            onClose={() => setLightboxImage(null)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen pt-[50px]">
        {/* Main Feed Container - Full Width */}
        <section className="py-4 sm:py-8">
          <div className="max-w-6xl mx-auto">
            {/* Main Post Card */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {/* Post Header */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">
                        {insight.author}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-400 text-xs">
                        <span>{insight.date}</span>
                        <span>•</span>
                        <span>{insight.readTime}</span>
                        <span>•</span>
                        <span className="text-primary">{insight.category}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-3 leading-tight">
                    {insight.title}
                  </h1>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {insight.excerpt}
                  </p>
                </div>
              </div>

              {/* Post Images - Side by Side */}
              <div className="relative w-full">
                {insight.heroImage && insight.image ? (
                  <div className="grid grid-cols-2 gap-0.5">
                    <img
                      src={insight.heroImage}
                      alt={`${insight.title} - Image 1`}
                      className="w-full h-64 sm:h-80 md:h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxImage(insight.heroImage)}
                    />
                    <img
                      src={insight.image}
                      alt={`${insight.title} - Image 2`}
                      className="w-full h-64 sm:h-80 md:h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxImage(insight.image)}
                    />
                  </div>
                ) : (
                  <img
                    src={insight.heroImage || insight.image}
                    alt={insight.title}
                    className="w-full h-64 sm:h-80 md:h-[500px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() =>
                      setLightboxImage(insight.heroImage || insight.image)
                    }
                  />
                )}
              </div>

              {/* Engagement Bar */}
              <div className="px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex -space-x-1">
                        {Object.entries(reactionTypes)
                          .slice(0, 3)
                          .map(([type, { icon: Icon, color }]) => (
                            <div
                              key={type}
                              className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center border border-gray-900"
                            >
                              <Icon className={`w-3 h-3 ${color}`} />
                            </div>
                          ))}
                      </div>
                      <span className="text-gray-400 ml-1">
                        {insight.reactionCount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 text-gray-400">
                    <button className="hover:underline">
                      {comments.length} comments
                    </button>
                    <span className="hidden sm:inline">•</span>
                    <button className="hover:underline hidden sm:inline">
                      {insight.viewCount} views
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-2 sm:px-6 py-2 border-t border-white/10">
                <div className="flex items-center justify-around">
                  {/* Reactions */}
                  <div className="relative group">
                    <button
                      className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all ${
                        userReaction
                          ? `${reactionTypes[userReaction]?.activeBg}`
                          : "hover:bg-white/10"
                      }`}
                    >
                      {userReaction ? (
                        <>
                          {React.createElement(
                            reactionTypes[userReaction]?.icon,
                            {
                              className: `w-4 h-4 sm:w-5 sm:h-5 ${reactionTypes[userReaction]?.activeColor} fill-current`,
                            }
                          )}
                          <span
                            className={`text-xs sm:text-sm font-medium hidden sm:inline ${reactionTypes[userReaction]?.activeColor}`}
                          >
                            {reactionTypes[userReaction]?.label}
                          </span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <span className="text-xs sm:text-sm font-medium text-gray-400 hidden sm:inline">
                            Like
                          </span>
                        </>
                      )}
                    </button>

                    {/* Reactions Popup */}
                    <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-gray-800 border border-white/10 rounded-full px-2 py-2 flex items-center space-x-1 shadow-xl">
                        {Object.entries(reactionTypes).map(
                          ([type, { icon: Icon, label, color }]) => (
                            <motion.button
                              key={type}
                              onClick={() => handleReaction(type)}
                              className={`p-2 rounded-full hover:bg-white/10 transition-all ${
                                userReaction === type
                                  ? "bg-white/20 ring-2 ring-white/30"
                                  : ""
                              }`}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              title={label}
                            >
                              <Icon
                                className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`}
                              />
                            </motion.button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <span className="text-xs sm:text-sm font-medium text-gray-400 hidden sm:inline">
                      Comment
                    </span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-400 hidden sm:inline">
                        Share
                      </span>
                    </button>

                    {/* Share Menu Dropdown */}
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-white/10 rounded-lg shadow-xl py-2 min-w-[180px] sm:min-w-[200px] z-50"
                        >
                          <button
                            onClick={() => handleShare("facebook")}
                            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-white/10 transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-blue-400" />
                            <span className="text-xs sm:text-sm text-gray-300">
                              Share to Facebook
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("twitter")}
                            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-white/10 transition-colors"
                          >
                            <Twitter className="w-4 h-4 text-sky-400" />
                            <span className="text-xs sm:text-sm text-gray-300">
                              Share to Twitter
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("linkedin")}
                            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-white/10 transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-blue-500" />
                            <span className="text-xs sm:text-sm text-gray-300">
                              Share to LinkedIn
                            </span>
                          </button>
                          <div className="h-px bg-white/10 my-2"></div>
                          <button
                            onClick={() => handleShare("copy")}
                            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-white/10 transition-colors"
                          >
                            <Link2 className="w-4 h-4 text-gray-400" />
                            <span className="text-xs sm:text-sm text-gray-300">
                              Copy link
                            </span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Full Article Content */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 text-sm leading-relaxed space-y-4">
                  {insight.content.split("\n").map(
                    (paragraph, index) =>
                      paragraph.trim() && (
                        <p key={index} className="mb-4">
                          {paragraph.trim()}
                        </p>
                      )
                  )}
                </div>

                {/* Tags Section */}
                {insight.tags && insight.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {insight.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 text-xs rounded-full cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h3 className="text-white text-base sm:text-lg font-semibold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex items-start space-x-2 sm:space-x-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      required
                      value={commentForm.content}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder-gray-500"
                      placeholder="Write a comment..."
                    />
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commentForm.isAnonymous}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          isAnonymous: e.target.checked,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        commentForm.isAnonymous
                          ? "bg-primary border-primary"
                          : "bg-white/5 border-white/20"
                      }`}
                    >
                      {commentForm.isAnonymous && (
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Post anonymously
                    </span>
                  </label>
                </div>

                {!commentForm.isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <input
                      type="text"
                      required
                      value={commentForm.name}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors placeholder-gray-500"
                      placeholder="Your name"
                    />
                    <input
                      type="email"
                      required
                      value={commentForm.email}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors placeholder-gray-500"
                      placeholder="Your email"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    disabled={commentLoading}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {commentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="hidden sm:inline">Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Post</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 sm:space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-2 sm:space-x-3"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {comment.is_admin_reply ? (
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        ) : comment.email?.includes("@anonymous.") ? (
                          <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        ) : (
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-white text-xs sm:text-sm font-semibold">
                            {comment.name || comment.admin_email}
                          </span>
                          {comment.is_admin_reply && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                              Admin
                            </span>
                          )}
                          {comment.email?.includes("@anonymous.") && (
                            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                              Anonymous
                            </span>
                          )}
                          <span className="text-gray-500 text-xs">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                          {comment.content}
                        </p>

                        {/* Comment Actions */}
                        <div className="flex items-center space-x-4 mt-3 text-xs">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            Like
                          </button>
                          <button className="text-gray-400 hover:text-white transition-colors">
                            Reply
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-3 sm:space-y-4 pl-3 sm:pl-4 border-l-2 border-white/10">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start space-x-2 sm:space-x-3"
                              >
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  {reply.is_admin_reply ? (
                                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                  ) : (
                                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-white text-xs sm:text-sm font-semibold">
                                      {reply.name || reply.admin_email}
                                    </span>
                                    {reply.is_admin_reply && (
                                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                        Admin
                                      </span>
                                    )}
                                    <span className="text-gray-500 text-xs">
                                      {new Date(
                                        reply.created_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-xs sm:text-sm">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Related Articles */}
            {relatedInsights.length > 0 && (
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 mb-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-base sm:text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Related Articles
                  </h3>
                </div>

                <div className="space-y-4">
                  {relatedInsights.map((relatedInsight, index) => (
                    <motion.div
                      key={relatedInsight.id}
                      className="group cursor-pointer"
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        navigate(`/blog/${relatedInsight.id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={relatedInsight.image}
                            alt={relatedInsight.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm sm:text-base font-medium group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {relatedInsight.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{relatedInsight.category}</span>
                            <span>•</span>
                            <span>{relatedInsight.readTime}</span>
                          </div>
                        </div>
                      </div>
                      {index < relatedInsights.length - 1 && (
                        <div className="mt-4 border-b border-white/10"></div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/blog")}
                  className="w-full mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                >
                  View All Insights
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <CTA
          title="Have an African Story to Share?"
          subtitle="If you're making an impact in aviation, STEM, disability inclusion, or community empowerment, we'd love to feature your journey and amplify your voice."
          primaryButton={{
            text: "Share Your Story",
            onClick: () => (window.location.href = "/contact"),
          }}
          secondaryButton={{
            text: "Listen to Podcast",
            onClick: () => (window.location.href = "/episodes"),
          }}
        />
      </div>
    </>
  );
};
export default InsightDetail;
