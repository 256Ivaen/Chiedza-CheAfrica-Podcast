# Chiedza CheAfrica Podcast - Website

![Chiedza CheAfrica Logo](public/main%20logo)

A comprehensive web platform for Chiedza CheAfrica Podcast, built to showcase and amplify African stories of innovation, courage, and purpose through modern web technologies.

## Project Overview

Chiedza CheAfrica Podcast is a digital platform that celebrates Africa's ascent through inspirational narratives across aviation, STEM, disability inclusion, mental health, and community empowerment. The website serves as the central hub for the podcast movement, featuring episodes, blog content, and community engagement tools.

## Technical Stack

- **Frontend Framework**: React 18 with Vite
- **Routing**: React Router DOM v6 with future flags
- **Styling**: Tailwind CSS with custom UI components
- **SEO Optimization**: React Helmet Async for meta management
- **Notifications**: Sonner for toast notifications
- **State Management**: Custom ShopContext provider
- **Build Tool**: Vite for development and production

## Key Features

### SEO & Meta Optimization
- Comprehensive meta tags for search engine optimization
- Open Graph tags for social media sharing
- Twitter Card integration
- Structured data (JSON-LD) for rich snippets including:
  - Organization schema
  - Podcast series schema
  - Website schema
  - FAQ schema
  - Breadcrumb schema
  - Creative work schema

### Progressive Web App (PWA)
- Web app manifest with proper PWA configuration
- Theme color (#F6931B) and mobile web app capabilities
- Comprehensive icon set for all platforms:
  - Windows 11 (various scales and target sizes)
  - Android (multiple launcher icon sizes)
  - iOS (16px to 1024px coverage)

### Performance Optimizations
- Resource preloading for critical assets
- DNS prefetching for external resources
- Smooth scroll behavior
- Optimized image loading

## Project Structure
```
src/
├── components/
│ ├── Layout/
│ │ ├── Navbar.jsx
│ │ └── Footer.jsx
│ ├── ui/
│ │ └── Shared/
│ │ └── TopScroll.jsx
│ └── Insight/
│ └── InsightDetail.jsx
├── pages/
│ ├── Home.jsx
│ ├── AboutUs.jsx
│ ├── ContactUs.jsx
│ ├── Insights.jsx
│ └── NotFound.jsx
├── context/
│ └── ShopContext.jsx
└── App.jsx
```

### Main Components
- **App.jsx**: Main application component with routing and SEO wrapper
- **main.jsx**: Application entry point with React Router configuration
- **NavbarDemo**: Navigation component with smooth scrolling
- **Footer**: Site footer with links and information
- **TopScroll**: Scroll-to-top functionality
- **InsightDetail**: Individual episode/blog post detail view

## Pages

- **Home** (`/`): Landing page with featured content and podcast highlights
- **About Us** (`/about`): Mission, vision, and team information
- **Episodes** (`/episodes`): Podcast episodes listing and playback
- **Blog** (`/blog`): Articles and behind-the-scenes content
- **Contact Us** (`/contact`): Contact form and information
- **404**: Custom error page for invalid routes

## SEO Configuration

The application includes a comprehensive SEO configuration system:

```javascript
const seoConfig = {
  default: {
    title: 'Chiedza CheAfrica Podcast | Amplifying African Stories...',
    description: 'Chiedza CheAfrica Podcast lights paths and inspires minds...',
    keywords: 'Africa podcast, African innovation, women in aviation...',
    // ... more configuration
  },
  routes: {
    '/': { /* home page SEO */ },
    '/about': { /* about page SEO */ },
    // ... route-specific configurations
  }
}
```

## Installation & Development

### Clone the repository
```bash
git clone [repository-url]
cd chiedza-cheafrica-website
```

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## Browser Support
Modern browsers with ES6+ support

Mobile-responsive design across all devices

PWA capabilities for mobile installation

## Build Information
The project uses Vite as the build tool with optimized production builds. The sitemap.xml is included for search engine crawling with proper priority and change frequency settings.

## Contact
Developer: Ivan Odeke  
Email: iodekeivan@gmail.com  
WhatsApp: 0709165008

## License
All rights reserved. This project contains proprietary code and content for Chiedza CheAfrica Podcast. Unauthorized use or distribution is prohibited.

