"use client";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { assets } from "../../assets/assets";

export function NavbarDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Episodes", link: "/episodes" },
    { name: "Blog", link: "/blog" },
    { name: "Contact", link: "/contact" },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsScrolled(window.scrollY > 20);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop blur overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        animate={{
          backgroundColor: isMobile 
            ? "rgb(255, 255, 255)" 
            : isScrolled 
              ? "rgb(255, 255, 255)" 
              : "rgba(0, 26, 35, 0)",
          backdropFilter: !isMobile && isScrolled ? "blur(10px)" : "none",
          boxShadow: isMobile 
            ? "0 2px 10px rgba(0, 0, 0, 0.1)" 
            : isScrolled 
              ? "0 4px 20px rgba(0, 0, 0, 0.1)" 
              : "none"
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleNavigation("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={assets.logo} 
                alt="Chiedza CheAfrica Podcast Logo"
                className="h-10 lg:h-14 max-w-[180px] lg:max-w-[220px] transition-all duration-300"
                style={{
                  filter: isMobile ? "none" : isScrolled ? "none" : "brightness(0) invert(1)"
                }}
              />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleNavigation(item.link)}
                  className={`relative px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                    isActive(item.link)
                      ? isScrolled ? "text-primary" : "text-white"
                      : isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  {item.name}
                  {isActive(item.link) && (
                    <motion.div
                      className={`absolute -bottom-1 left-1/2 w-1 h-1 rounded-full ${
                        isScrolled ? "bg-primary" : "bg-white"
                      }`}
                      layoutId="activeIndicator"
                      style={{ transform: "translateX(-50%)" }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Listen Now Button */}
            <div className="hidden lg:flex items-center">
              <motion.button
                onClick={() => handleNavigation("/support")}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase transition-all duration-300 ${
                  isScrolled 
                    ? "bg-primary text-white hover:bg-secondary"
                    : "bg-white text-primary hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Support Us
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <IconX className="h-6 w-6" />
              ) : (
                <IconMenu2 className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Separate from Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="fixed top-16 left-0 right-0 z-50 px-4 lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleNavigation(item.link)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-colors duration-200 text-sm font-medium uppercase tracking-wide ${
                      isActive(item.link)
                        ? "text-primary bg-primary/10"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                
                {/* Listen Now Button for Mobile */}
                <div className="pt-4 border-t border-gray-200">
                  <motion.button
                    onClick={() => handleNavigation("/episodes")}
                    className="w-full py-3 bg-primary text-white rounded-lg text-sm font-medium uppercase tracking-wide hover:bg-[#a69968] transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Listen Now
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Close Icon Below Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex justify-center mt-4"
            >
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconX className="h-6 w-6" />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}