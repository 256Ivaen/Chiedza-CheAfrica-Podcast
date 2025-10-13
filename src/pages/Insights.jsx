import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { insights, categories } from "../assets/insights";

// Import all components
import InsightsDynamicHero from '../components/insights/InsightsDynamicHero';
import FeaturedInsights from '../components/insights/FeaturedInsights';
import AllInsights from '../components/insights/AllInsights';

const InsightsPage = () => {
  const location = useLocation();
  
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

        {/* <section id="author-spotlight" aria-label="Author spotlight">
          <AuthorSpotlight />
        </section> */}
      </main>
    </>
  );
};

export default InsightsPage;