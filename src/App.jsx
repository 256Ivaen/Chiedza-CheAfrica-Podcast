import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner'; 

// Import all components
import Home from './pages/Home';
import AboutUs from './pages/AboutUs'
import { NavbarDemo } from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import NotFound from './pages/NotFound'; 
import 'react-toastify/dist/ReactToastify.css';
import TopScroll from './components/ui/Shared/TopScroll';
import InsightsPage from './pages/Insights';
import InsightDetail from './components/Insight/InsightDetail';
import ContactUs from './pages/ContactUs';

const seoConfig = {
  default: {
    title: 'Chiedza CheAfrica Podcast | Amplifying African Stories of Innovation & Impact',
    description: 'Chiedza CheAfrica Podcast lights paths and inspires minds with African stories. Listen to changemakers in aviation, STEM, disability inclusion & mental health across Africa.',
    keywords: 'Chiedza CheAfrica Podcast, Africa podcast, African innovation, women in aviation, STEM in Africa, disability inclusion, youth empowerment, inspirational African stories, African storytellers, leadership and community outreach',
    og_image: 'https://chiedzacheafrica.com/assets/images/hero.jpg',
    canonical: 'https://chiedzacheafrica.com',
    theme_color: '#edab12',
    author: 'Chiedza CheAfrica Podcast',
    og_site_name: 'Chiedza CheAfrica Podcast',
    twitter_site: '@chiedzacheafrica',
    twitter_creator: '@chiedzacheafrica',
    locale: 'en_US',
    email: 'hello@chiedzacheafrica.com'
  },
  routes: {
    '/': {
      title: 'Chiedza CheAfrica Podcast | Lighting Africa\'s Path Through Stories',
      description: 'Lighting paths. Inspiring minds. Amplifying African stories of courage, innovation, and purpose. Listen to changemakers shaping Africa\'s future in aviation, STEM, disability inclusion, and mental health.',
      keywords: 'African podcast, inspirational stories, aviation Africa, STEM education, disability inclusion, mental health Africa, youth empowerment, African innovators'
    },
    '/about': {
      title: 'About Chiedza CheAfrica | Our Mission to Amplify African Stories',
      description: 'Learn about Chiedza CheAfrica Podcast - a movement celebrating Africa\'s ascent through stories of courage, innovation, and purpose. Lighting paths and inspiring minds across the continent.',
      keywords: 'about Chiedza CheAfrica, African storytelling, podcast mission, aviation STEM Africa, disability inclusion, mental health advocacy'
    },
    '/episodes': {
      title: 'Podcast Episodes | Inspiring African Stories & Conversations',
      description: 'Listen to Chiedza CheAfrica Podcast episodes featuring African changemakers in aviation, STEM, disability inclusion, mental health, and community empowerment.',
      keywords: 'podcast episodes, African stories, aviation stories, STEM Africa, disability inclusion stories, mental health Africa, inspirational interviews'
    },
    '/contact': {
      title: 'Contact Chiedza CheAfrica | Collaborate & Share Your Story',
      description: 'Contact Chiedza CheAfrica Podcast to collaborate, share your story, sponsor, or volunteer. Join us in amplifying African voices and stories of innovation.',
      keywords: 'contact Chiedza CheAfrica, collaborate podcast, share African story, podcast sponsorship, volunteer opportunities'
    },
    '/support': {
      title: 'Support Chiedza CheAfrica | Help Amplify African Stories',
      description: 'Support Chiedza CheAfrica Podcast to continue producing impactful episodes, cover travel expenses, maintain equipment, and fund community outreach initiatives across Africa.',
      keywords: 'support podcast, donate Chiedza CheAfrica, fund African stories, podcast sponsorship, community outreach Africa'
    },
    '/blog': {
      title: 'Blog & Articles | Behind the Scenes & African Innovation Stories',
      description: 'Read the Chiedza CheAfrica blog for behind-the-scenes stories, insights on STEM innovation, aviation careers, disability inclusion, and community impact projects across Africa.',
      keywords: 'African innovation blog, STEM Africa, aviation careers, disability inclusion articles, community projects, inspirational journeys'
    }
  }
};

// Podcast Schema for Rich Results
const podcastSchema = {
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
};

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Chiedza CheAfrica Podcast",
  "alternateName": "Chiedza CheAfrica",
  "url": "https://chiedzacheafrica.com",
  "logo": "https://chiedzacheafrica.com/assets/images/logo.png",
  "description": "Lighting paths. Inspiring minds. Amplifying African stories through podcast conversations with changemakers across aviation, STEM, disability inclusion, mental health, and community empowerment.",
  "sameAs": [
    "https://youtube.com/@chiedzacheafrica",
    "https://www.instagram.com/chiedzacheafrica",
    "https://open.spotify.com/show/5YBekTisDE8CawmkxGiesr",
    "https://www.tiktok.com/@chiedzacheafrica",
    "https://www.facebook.com/share/16Mf6x5vw3/"
  ]
};

const SEOWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  let routeConfig = seoConfig.routes[path] || {};
  
  const title = routeConfig.title || seoConfig.default.title;
  const description = routeConfig.description || seoConfig.default.description;
  const keywords = routeConfig.keywords || seoConfig.default.keywords;
  const ogImage = routeConfig.og_image || seoConfig.default.og_image;
  
  const baseUrl = seoConfig.default.canonical;
  const canonical = path === '/' ? baseUrl : `${baseUrl}${path}`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={seoConfig.default.author} />
        <meta name="theme-color" content={seoConfig.default.theme_color} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical & Favicon */}
        <link rel="canonical" href={canonical} />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={seoConfig.default.og_site_name} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={seoConfig.default.locale} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={seoConfig.default.twitter_site} />
        <meta name="twitter:creator" content={seoConfig.default.twitter_creator} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        
        {/* Podcast Specific Tags */}
        <meta property="og:audio" content="https://chiedzacheafrica.com/assets/audio/trailer.mp3" />
        <meta property="og:audio:type" content="audio/mpeg" />
        <meta name="apple-itunes-app" content="app-id=123456789" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(podcastSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* Additional Schema for Homepage */}
        {path === '/' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Chiedza CheAfrica Podcast",
              "url": "https://chiedzacheafrica.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://chiedzacheafrica.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })}
          </script>
        )}
      </Helmet>
      {children}
    </>
  );
};

const PageWrapper = ({ children, pathname }) => {
  const fullScreenPages = ['/'];
  
  const needsNavbarSpacing = !fullScreenPages.includes(pathname);
  
  return (
    <div className={needsNavbarSpacing ? 'pt-16 lg:pt-20' : ''}>
      {children}
    </div>
  );
};

const App = () => {
  const location = useLocation();

  return (
    <HelmetProvider>
      <SEOWrapper>
        <Toaster position="top-right" richColors closeButton />
        <NavbarDemo />
        <PageWrapper pathname={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            Episodes Pages comming soon
            <Route path="/episodes" element={<InsightsPage />} />
            <Route path="/episodes/:id" element={<InsightDetail />} />
            <Route path="/blog" element={<InsightsPage />} />
            <Route path="/blog/:id" element={<InsightDetail />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </PageWrapper>
        <Footer />
        <TopScroll />
      </SEOWrapper>
    </HelmetProvider>
  );
};

export default App;