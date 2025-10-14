import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import Hero from '../components/Home/Hero';
import FeaturedEpisodes from '../components/Home/FeaturedEpisodes';
import { youtubeService } from '../Services/youtubeService';
import WhoWeAre from '../components/Home/WhoWeAre';
import SupportUs from '../components/Home/SupportUs';
import CTA from '../components/ui/Shared/CTA';
import BlogsSection from '../components/Home/Blogs';

const Home = () => {
  const location = useLocation();
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);

  // Fetch episodes from YouTube
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoadingEpisodes(true);
        const response = await youtubeService.getChannelVideos(50);
        setEpisodes(response.videos || []);
      } catch (error) {
        console.error('Error fetching episodes:', error);
        setEpisodes([]);
      } finally {
        setLoadingEpisodes(false);
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
    "@type": "Organization",
    "name": "Chiedza CheAfrica Podcast",
    "alternateName": "Chiedza CheAfrica",
    "url": "https://chiedzacheafrica.com",
    "logo": "https://chiedzacheafrica.com/assets/images/logo.png",
    "description": "Chiedza CheAfrica Podcast - Lighting paths. Inspiring minds. Amplifying African stories through conversations on aviation, STEM, disability inclusion, and mental health.",
    "foundingDate": "2023",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Africa"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@chiedzacheafrica.com",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://youtube.com/@chiedzacheafrica",
      "https://www.instagram.com/chiedzacheafrica",
      "https://www.tiktok.com/@chiedzacheafrica",
      "https://open.spotify.com/show/5YBekTisDE8CawmkxGiesr",
      "https://www.facebook.com/share/16Mf6x5vw3/"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "PodcastSeries",
          "name": "Chiedza CheAfrica Podcast",
          "description": "African stories of innovation, courage, and purpose"
        }
      }
    ],
    "areaServed": "Worldwide"
  };

  return (
    <>
      <Helmet>
        <title>Chiedza CheAfrica Podcast | Amplifying African Stories of Innovation & Impact</title>
        <meta 
          name="description" 
          content="Chiedza CheAfrica Podcast lights paths and inspires minds with African stories. Listen to changemakers in aviation, STEM, disability inclusion & mental health." 
        />
        <meta 
          name="keywords" 
          content="Chiedza CheAfrica Podcast, Africa podcast, African innovation, women in aviation, STEM in Africa, disability inclusion, youth empowerment, inspirational African stories, African storytellers, leadership and community outreach, mental health Africa, dementia advocacy, African pilots, STEM education Africa" 
        />
        
        {/* Geographic and Business Meta Tags */}
        <meta name="geo.region" content="Africa" />
        <meta name="geo.placename" content="Africa" />
        
        <link rel="canonical" href={getCanonicalUrl()} />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta property="og:title" content="Chiedza CheAfrica Podcast | African Stories of Innovation & Inspiration" />
        <meta property="og:description" content="Lighting paths. Inspiring minds. Amplifying African stories. Listen to changemakers shaping Africa's future in aviation, STEM, disability inclusion and mental health." />
        <meta property="og:image" content="https://chiedzacheafrica.com/assets/images/chiedza-hero.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Chiedza CheAfrica Podcast - Lighting Africa's Path" />
        <meta property="og:site_name" content="Chiedza CheAfrica Podcast" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={getCanonicalUrl()} />
        <meta name="twitter:title" content="Chiedza CheAfrica Podcast | Amplifying African Stories" />
        <meta name="twitter:description" content="Lighting paths. Inspiring minds. Amplifying African stories of innovation, courage and purpose." />
        <meta name="twitter:image" content="https://chiedzacheafrica.com/assets/images/chiedza-hero.jpg" />
        <meta name="twitter:image:alt" content="Chiedza CheAfrica Podcast - Stories of Innovation, Inspiration & Impact" />
        
        {/* Additional Business Meta Tags */}
        <meta name="author" content="Chiedza CheAfrica Podcast" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Podcast Specific Tags */}
        <meta property="og:audio" content="https://chiedzacheafrica.com/assets/audio/trailer.mp3" />
        <meta property="og:audio:type" content="audio/mpeg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        {/* Additional Structured Data for Podcast */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PodcastSeries",
            "name": "Chiedza CheAfrica Podcast",
            "description": "A global podcast and movement celebrating Africa's ascent through stories of courage, innovation, and purpose. Spotlighting changemakers across aviation, STEM, disability inclusion, mental health, and community empowerment.",
            "url": "https://chiedzacheafrica.com",
            "image": "https://chiedzacheafrica.com/assets/images/podcast-cover.jpg",
            "webFeed": "https://chiedzacheafrica.com/rss.xml",
            "author": {
              "@type": "Organization",
              "name": "Chiedza CheAfrica"
            },
            "copyrightHolder": {
              "@type": "Organization", 
              "name": "Chiedza CheAfrica"
            },
            "genre": ["Society & Culture", "Education", "Inspiration", "African Stories"],
            "keywords": "Africa podcast, African innovation, aviation, STEM, disability inclusion, mental health, youth empowerment"
          })}
        </script>

        {/* Local Business Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWorkSeries",
            "name": "Chiedza CheAfrica Podcast",
            "description": "Lighting paths. Inspiring minds. Amplifying African stories through podcast episodes featuring changemakers across various fields.",
            "publisher": {
              "@type": "Organization",
              "name": "Chiedza CheAfrica",
              "url": "https://chiedzacheafrica.com"
            },
            "url": "https://chiedzacheafrica.com",
            "sameAs": [
              "https://youtube.com/@chiedzacheafrica",
              "https://www.instagram.com/chiedzacheafrica",
              "https://open.spotify.com/show/5YBekTisDE8CawmkxGiesr"
            ],
            "genre": ["Society & Culture", "Education", "African Stories", "Inspiration"],
            "countryOfOrigin": "Africa"
          })}
        </script>
      </Helmet>

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section id="hero" aria-label="Welcome to Chiedza CheAfrica Podcast">
          <Hero />
        </section>

        <section aria-label="Welcome to Chiedza CheAfrica Podcast">
          <WhoWeAre />
        </section>

        {/* Featured Episodes Section */}
        {!loadingEpisodes && episodes.length > 0 && (
          <section id="featured-episodes" aria-label="Featured Podcast Episodes">
            <FeaturedEpisodes episodes={episodes} loading={loadingEpisodes} />
          </section>
        )}

        <section aria-label="Welcome to Chiedza CheAfrica Podcast">
          <BlogsSection />
        </section>

        <section aria-label="Welcome to Chiedza CheAfrica Podcast">
          <SupportUs />
        </section>

        <CTA
  title="Ready to Be Part of the Movement?"
  subtitle="Whether you want to share your story, collaborate, or support our mission, we'd love to connect with you and continue lighting Africa's path together."
  primaryButton={{
    text: "Share Your Story",
    onClick: () => window.location.href = "/contact"
  }}
  secondaryButton={{
    text: "Support Our Mission", 
    onClick: () => window.location.href = "/support"
  }}
/>
      </main>
    </>
  );
};

export default Home;