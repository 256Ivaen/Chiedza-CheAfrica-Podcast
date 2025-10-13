import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SolutionsHero } from '../components/Solutions/hero';
import { SolutionsServices } from '../components/Solutions/SolutionsServices';
import { SolutionsProjects } from '../components/Solutions/SolutionsProjects';
import { SolutionsApproach } from '../components/Solutions/SolutionsApproach';
import { SolutionsCTA } from '../components/Solutions/SolutionsCTA';

const Solutions = () => {
  const location = useLocation();
  
  // Generate canonical URL for SEO
  const getCanonicalUrl = () => {
    const baseUrl = "https://tekjuice.co.uk";
    return baseUrl + location.pathname;
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TekJuice Solutions",
    "provider": {
      "@type": "Organization",
      "name": "TekJuice Consultancy",
      "url": "https://tekjuice.co.uk"
    },
    "description": "Comprehensive tech solutions including outsourcing, talent placement, AI training, and software development.",
    "serviceType": ["Outsourcing", "Talent Placement", "AI Training", "Software Development", "Digital Marketing", "IT Consulting"],
    "areaServed": ["United Kingdom", "Uganda", "Kenya", "Rwanda", "Global"]
  };

  return (
    <>
      {/* SEO and Meta Tags */}
      <Helmet>
        <title>Our Solutions - TekJuice Consultancy | Creating Opportunity Through Technology</title>
        <meta 
          name="description" 
          content="Discover comprehensive tech solutions from TekJuice: outsourcing, talent placement, AI training, software development and more. Creating opportunity through technology." 
        />
        <meta 
          name="keywords" 
          content="TekJuice solutions, tech outsourcing, talent placement, AI academy, software development, digital marketing, IT consulting, East Africa tech" 
        />
        
        {/* Canonical URL */}
        <link rel="canonical" href={getCanonicalUrl()} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta property="og:title" content="TekJuice Solutions | Creating Opportunity Through Technology" />
        <meta property="og:description" content="Comprehensive tech solutions bridging talent, innovation and opportunity across Africa and the UK." />
        <meta property="og:image" content="https://tekjuice.co.uk/assets/images/solutions-hero.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={getCanonicalUrl()} />
        <meta name="twitter:title" content="TekJuice Solutions | Creating Opportunity Through Technology" />
        <meta name="twitter:description" content="Comprehensive tech solutions bridging talent, innovation and opportunity." />
        <meta name="twitter:image" content="https://tekjuice.co.uk/assets/images/solutions-hero.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Main Page Content */}
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section id="solutions-hero" aria-label="Solutions hero section">
          <SolutionsHero />
        </section>

        {/* Services Overview Section */}
        <section id="solutions-services" aria-label="Our solutions and services">
          <SolutionsServices />
        </section>

        {/* Projects Section */}
        <section id="solutions-projects" aria-label="Our projects and platforms">
          <SolutionsProjects />
        </section>

        {/* Approach Section */}
        <section id="solutions-approach" aria-label="Our approach and methodology">
          <SolutionsApproach />
        </section>

        {/* Call to Action Section - Full Width */}
        <SolutionsCTA />
      </main>
    </>
  );
};

export default Solutions;