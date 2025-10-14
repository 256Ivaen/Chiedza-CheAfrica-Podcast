import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// Import all components
import EpisodesDynamicHero from '../components/Episodes/EpisodeDynamicHero';
import AllEpisodes from '../components/Episodes/AllEpisodes';
import { youtubeService } from '../services/youtubeService';

const EpisodesPage = () => {
  const location = useLocation();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await youtubeService.getChannelVideos(50);
        setEpisodes(response.videos);
      } catch (err) {
        setError('Failed to load podcast episodes. Please check your YouTube API configuration.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);
  
  const getCanonicalUrl = () => {
    const baseUrl = "https://chiedzacheafrica.com";
    return baseUrl + location.pathname;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "name": "Chiedza CheAfrica Podcast Episodes",
    "url": "https://chiedzacheafrica.com/episodes",
    "description": "Latest podcast episodes from Chiedza CheAfrica - African aviation, STEM pathways, disability inclusion, mental health advocacy, and youth empowerment.",
    "publisher": {
      "@type": "Organization",
      "name": "Chiedza CheAfrica Podcast"
    }
  };

  const categories = ['All', 'Podcast Episode'];

  // Skeleton loading for hero section
  const HeroSkeleton = () => (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="h-8 bg-gray-700 rounded-lg w-64 mx-auto mb-6 animate-pulse"></div>
        <div className="h-16 bg-gray-700 rounded-lg w-3/4 mx-auto mb-6 animate-pulse"></div>
        <div className="h-6 bg-gray-700 rounded-lg w-1/2 mx-auto mb-8 animate-pulse"></div>
        <div className="flex justify-center gap-4">
          <div className="h-12 bg-gray-700 rounded-full w-32 animate-pulse"></div>
          <div className="h-12 bg-gray-700 rounded-full w-32 animate-pulse"></div>
        </div>
      </div>
    </section>
  );

  // Render loading, error, or main content - no early returns that break hooks
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <HeroSkeleton />
          <AllEpisodes episodes={[]} categories={categories} loading={true} />
        </>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-white mb-2">Unable to load episodes</h3>
            <p className="text-gray-300 mb-4">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <main className="overflow-hidden">
        <section id="episodes-hero" aria-label="Episodes hero section">
          <EpisodesDynamicHero episodes={episodes} />
        </section>

        <section id="all-episodes-section" aria-label="All episodes">
          <AllEpisodes episodes={episodes} categories={categories} loading={false} />
        </section>
      </main>
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {loading ? 'Loading Episodes' : error ? 'Error Loading Episodes' : 'Episodes - Chiedza CheAfrica Podcast | African Stories & Innovation'}
        </title>
        <meta 
          name="description" 
          content="Explore podcast episodes from Chiedza CheAfrica - African aviation stories, STEM pathways, disability inclusion, mental health advocacy, and youth empowerment initiatives." 
        />
        <meta 
          name="keywords" 
          content="African podcast, aviation Africa, STEM Africa, disability inclusion, mental health advocacy, youth empowerment, African stories, Chiedza CheAfrica, podcast episodes" 
        />
        
        <link rel="canonical" href={getCanonicalUrl()} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta property="og:title" content="Podcast Episodes | Chiedza CheAfrica Podcast" />
        <meta property="og:description" content="African aviation, STEM pathways, disability inclusion, and youth empowerment podcast episodes from Chiedza CheAfrica." />
        <meta property="og:image" content="https://chiedzacheafrica.com/og-episodes-image.jpg" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {renderContent()}
    </>
  );
};

export default EpisodesPage;