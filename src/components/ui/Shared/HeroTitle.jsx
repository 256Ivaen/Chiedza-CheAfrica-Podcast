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
        className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-tight mb-4"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
        }}
      >
        {title}
      </motion.h1>
      <motion.p 
        className="text-primary text-sm font-semibold uppercase tracking-wider"
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