// components/HeroTitle.jsx
import React from "react";
import { motion } from "framer-motion";

const HeroTitle = ({ title, subtitle }) => {
  return (
    <motion.div 
      className="max-w-4xl"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3
          }
        }
      }}
    >
      <motion.h1 
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-4"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
        }}
      >
        {title}
      </motion.h1>
      <motion.p 
        className="text-primary text-xs sm:text-sm font-light uppercase tracking-wider"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
        }}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};

export default HeroTitle;