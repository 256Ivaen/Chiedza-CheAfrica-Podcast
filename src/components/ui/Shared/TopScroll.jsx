import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X } from "lucide-react";

const FloatingButtons = () => {
  const { pathname } = useLocation();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [whatsAppClicked, setWhatsAppClicked] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);

        if (!sessionStorage.getItem("whatsappPopupShown") && !whatsAppClicked) {
          const timer = setTimeout(() => {
            setShowWhatsAppPopup(true);
            sessionStorage.setItem("whatsappPopupShown", "true");
          }, 3000);
          return () => clearTimeout(timer);
        }
      } else {
        setShowScrollToTop(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [whatsAppClicked]);

  useEffect(() => {
    if (showWhatsAppPopup) {
      const timer = setTimeout(() => {
        setShowWhatsAppPopup(false);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [showWhatsAppPopup]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowWhatsAppPopup(false);
      }
    };

    if (showWhatsAppPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWhatsAppPopup]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showWhatsAppPopup) {
        setShowWhatsAppPopup(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showWhatsAppPopup]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleWhatsAppClick = () => {
    setWhatsAppClicked(true);
    setShowWhatsAppPopup(false);

    const phoneNumber = "971503701424";
    const message = "Hello! I'm messaging from the Royal Techno website. I need to enquire about your food products and services.";
    const encodedMessage = encodeURIComponent(message);
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    const whatsappUrl = isMobile 
      ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.2
      }
    }
  };

  const popupVariants = {
    hidden: { 
      x: 100, 
      opacity: 0
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3
      }
    },
    exit: { 
      x: 100, 
      opacity: 0,
      transition: { 
        duration: 0.2
      }
    }
  };

  // Official WhatsApp SVG Icon
  const WhatsAppIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 175.216 175.552" 
      width="18" 
      height="18"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <defs>
        <linearGradient id="b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#57d163"/>
          <stop offset="1" stopColor="#23b33a"/>
        </linearGradient>
        <filter id="a" width="1.115" height="1.114" x="-.057" y="-.057" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3.531"/>
        </filter>
      </defs>
      <path fill="#b3b3b3" d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.013-40.556 33.021-73.55 73.578-73.550 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.013 40.557-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0" filter="url(#a)"/>
      <path fill="#fff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.013-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.013 40.557-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"/>
      <path fill="url(#linearGradient1780)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"/>
      <path fill="url(#b)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"/>
      <path fill="#fff" fillRule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.300-.153-3.22-4.032-10.011-5.666-13.647"/>
    </svg>
  );
  
  return (
    <>
      <style jsx="true">{`
        .message-bubble::before {
          content: '';
          position: absolute;
          right: -10px;
          bottom: 20px;
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 12px solid white;
        }

        .focus-visible:focus {
          outline: 3px solid #60a5fa;
          outline-offset: 2px;
        }
      `}</style>

      {/* Scroll to Top Button - Top Position */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={buttonVariants}
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 z-40 bg-secondary text-textlight p-3 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus-visible"
            aria-label="Scroll to top"
            title="Back to top"
          >
            <ArrowUp size={18} strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button - Bottom Position */}
      <motion.button
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus-visible"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <WhatsAppIcon />
      </motion.button>

      {/* WhatsApp Popup */}
      <AnimatePresence>
        {showWhatsAppPopup && (
          <motion.div
            ref={popupRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            className="fixed bottom-20 right-6 z-40 bg-white rounded-lg shadow-xl p-4 max-w-xs message-bubble"
            role="dialog"
            aria-labelledby="whatsapp-popup-title"
            aria-describedby="whatsapp-popup-description"
          >
            <button
              onClick={() => setShowWhatsAppPopup(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible"
              aria-label="Close popup"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center p-2">
                  <WhatsAppIcon />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="whatsapp-popup-title" className="text-sm font-semibold text-gray-900 mb-1">
                  Need Help? Chat with us!
                </h3>
                <p id="whatsapp-popup-description" className="text-xs text-gray-600 mb-3">
                  Get instant answers about our premium food products and services.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingButtons;