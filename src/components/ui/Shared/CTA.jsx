import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../../assets/assets';
import { CiMicrophoneOn } from "react-icons/ci";

const CTA = ({ 
  inView = true,
  title = "Ready to Be Part of the Movement?",
  subtitle = "Join us in amplifying African stories and lighting paths for future generations.",
  primaryButton = {
    text: "Get Started",
    onClick: () => window.location.href = "/contact"
  },
  secondaryButton = null,
  showEmailInput = false
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

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl shadow-2xl relative overflow-hidden max-h-[350px]"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Decorative Circle Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Content */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
            >
              <h2 className="text-3xl md:text-4xl font-light text-white mb-4 leading-tight">
                {title}
              </h2>
              <p className="text-base text-gray-300 mb-8 leading-relaxed font-light">
                {subtitle}
              </p>

              {/* Email Input or Buttons */}
              {showEmailInput ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your e-mail"
                    className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <button
                    onClick={primaryButton.onClick}
                    className="px-8 py-4 bg-primary text-white rounded-full font-normal text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    {primaryButton.text}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    className="px-8 py-4 bg-primary text-white rounded-full font-normal text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={primaryButton.onClick}
                  >
                    {primaryButton.text}
                  </motion.button>
                  
                  {secondaryButton && (
                    <motion.button
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-normal text-sm hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={secondaryButton.onClick}
                    >
                      {secondaryButton.text}
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Right Side - Person with Microphone Icon */}
            <motion.div 
              variants={itemVariants}
              className="relative hidden lg:block h-full overflow-hidden"
            >
              <div className="relative h-full">
                {/* Microphone Icon Circle - Top Right */}
                <div className="absolute top-8 right-8 flex items-center justify-center shadow-xl z-20">
                  <CiMicrophoneOn className="text-2xl text-white font-light" strokeWidth={0.5} />
                </div>

                {/* Decorative Circle - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/30 rounded-full blur-xl"></div>
                
                {/* Person Image - Starts from top, cuts from bottom */}
                <div className="absolute top-0 right-0 w-full h-full">
                  <img
                    src={assets.CTA}
                    alt="Join Chiedza CheAfrica"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default CTA;