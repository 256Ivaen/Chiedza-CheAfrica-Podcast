import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Youtube,
  Instagram, 
  Facebook,
  MessageCircle
} from "lucide-react";

import { FaSpotify, FaTiktok } from "react-icons/fa";

import { assets } from "../../assets/assets";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Update year dynamically
  useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear());
    };
    
    updateYear();
    const interval = setInterval(updateYear, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
    }, 2000);
  };

  const quickLinks = [
    { name: "All Episodes", href: "/episodes" },
    { name: "Featured Stories", href: "/featured" },
    { name: "Blog & Articles", href: "/blog" }
  ];

  const podcastCategories = [
    { name: "Aviation & STEM", href: "/category/aviation-stem" },
    { name: "Disability Inclusion", href: "/category/disability-inclusion" },
    { name: "Mental Health", href: "/category/mental-health" },
    { name: "Youth Empowerment", href: "/category/youth-empowerment" }
  ];

  const helpLinks = [
    { name: "Email Us", href: "mailto:hello@chiedzacheafrica.com" },
    { name: "Collaborate", href: "/collaborate" },
    { name: "Share Your Story", href: "/share-story" },
    { name: "Volunteer", href: "/volunteer" }
  ];

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://youtube.com/@chiedzacheafrica",
      icon: Youtube,
      color: "hover:bg-red-600"
    },
    {
      name: "Spotify", 
      href: "https://open.spotify.com/show/5YBekTisDE8CawmkxGiesr",
      icon: FaSpotify,
      color: "hover:bg-green-500"
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/chiedzacheafrica",
      icon: Instagram,
      color: "hover:bg-pink-600"
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@chiedzacheafrica",
      icon: FaTiktok,
      color: "hover:bg-black"
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/16Mf6x5vw3/",
      icon: Facebook,
      color: "hover:bg-blue-600"
    }
  ];

  return (
    <footer className="bg-secondary relative">
      {/* Main Footer Content - Dark Background */}
      <div className="pt-20 pb-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Podcast Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 sm:w-24 sm:h-24 lg:w-24 lg:h-24 flex items-center justify-center flex-shrink-0 mr-4">
                  <img 
                    src={assets.logo} 
                    className="w-full h-full object-contain" 
                    alt="Chiedza CheAfrica Podcast Logo" 
                  />
                </div>
                <div>
                  <h1 className="text-white text-xl font-bold leading-tight">
                    Chiedza<br />
                    CheAfrica
                  </h1>
                  <p className="text-white/70 text-sm mt-1">Podcast</p>
                </div>
              </div>
              
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Lighting paths. Inspiring minds. Amplifying African stories through conversations 
                on aviation, STEM, disability inclusion, mental health, and community empowerment.
              </p>

              {/* Tagline */}
              <div className="mb-6">
                <p className="text-white/90 text-sm font-medium italic border-l-4 border-[#b8a979] pl-3 py-1">
                  "Lighting Africa's Path - Stories of Innovation, Inspiration & Impact."
                </p>
              </div>
            </motion.div>

            {/* Get Involved */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Get Involved</h3>
              <ul className="space-y-3">
                {helpLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Explore</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Podcast Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Categories</h3>
              <ul className="space-y-3">
                {podcastCategories.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Copyright & Social Links */}
          <motion.div 
            className="mt-12 pt-8 border-t border-white/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-white/80 text-sm">
                  © {currentYear} Chiedza CheAfrica Podcast. All rights reserved.
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Lighting paths. Inspiring minds. Amplifying African stories.
                </p>
              </div>
              
              {/* Social Links with Proper Icons */}
              <div className="flex justify-center md:justify-end space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white transition-all duration-300 ${social.color} backdrop-blur-sm`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Follow us on ${social.name}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;