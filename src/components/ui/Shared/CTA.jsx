import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../../assets/assets';

const CTA = ({ 
  inView = true,
  title = "Ready to Be Part of the Movement?",
  subtitle = "Join us in amplifying African stories and lighting paths for future generations.",
  primaryButton = {
    text: "Get Started",
    onClick: () => window.location.href = "/get-started"
  },
  secondaryButton = {
    text: "Learn More", 
    onClick: () => window.location.href = "/about"
  }
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -100, scale: 1.2 },
    visible: {
      opacity: 0.3,
      x: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-16">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm relative overflow-hidden"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Faded Logo Background - Left Side */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/3 z-0"
            variants={logoVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <img 
              src={assets.logo}
              alt="Chiedza CheAfrica Logo"
              className="w-full h-full object-contain object-left opacity-60"
              style={{
                maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)'
              }}
            />
          </motion.div>

          {/* Centered Content */}
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              {/* Main Heading */}
              <motion.h2 
                className="text-2xl font-light text-textdark mb-4 leading-tight uppercase tracking-wide"
                variants={itemVariants}
              >
                {title}
              </motion.h2>

              {/* Description */}
              <motion.p 
                className="text-xs text-gray-600 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={itemVariants}
              >
                {/* Primary Button */}
                <motion.button
                  className="bg-primary text-white px-8 py-3 rounded-full font-light text-xs hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={primaryButton.onClick}
                >
                  {primaryButton.text}
                </motion.button>
                
                {/* Secondary Button */}
                <motion.button
                  className="bg-textdark text-white px-8 py-3 rounded-full font-light text-xs hover:bg-textdark/90 transition-all duration-300 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={secondaryButton.onClick}
                >
                  {secondaryButton.text}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;