import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Facebook, Twitter, Linkedin, Link2, Check, BookOpen } from 'lucide-react';
import { insights } from '../../assets/insights';
import PageHero from '../ui/Shared/PageHero';
import SectionHeader from '../ui/Shared/SectionHeader';
import CTA from '../ui/Shared/CTA';

const InsightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const insight = insights.find(item => item.id === parseInt(id));
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');

  const relatedInsights = insights
    .filter(item => item.id !== parseInt(id) && item.category === insight?.category)
    .slice(0, 3);

  if (relatedInsights.length < 3) {
    const additionalInsights = insights
      .filter(item => item.id !== parseInt(id) && !relatedInsights.find(related => related.id === item.id))
      .slice(0, 3 - relatedInsights.length);
    relatedInsights.push(...additionalInsights);
  }

  if (!insight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Insight not found</h1>
          <p className="text-gray-300 text-xs mb-6">The insight you're looking for doesn't exist.</p>
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
              <motion.div 
                className="lg:col-span-3 order-2 lg:order-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div 
                  className="mb-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
                  variants={fadeInUp}
                >
                  <p className="text-gray-300 text-sm leading-relaxed font-light">
                    {insight.excerpt}
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8"
                  variants={fadeInUp}
                >
                  <div className="text-gray-300 text-xs leading-relaxed space-y-6 font-light">
                    {insight.content.split('...').map((paragraph, index) => (
                      <p key={index}>
                        {paragraph.trim()}
                        {index === 0 && '...'}
                      </p>
                    ))}
                  </div>

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
              </motion.div>

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