// components/SectionHeader.jsx
import React from "react";
import { motion } from "framer-motion";

const SectionHeader = ({ subtitle, title, className = "" }) => (
  <div className={`mb-12 ${className}`}>
    <motion.p 
      className="text-primary text-sm font-light uppercase tracking-wider mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {subtitle}
    </motion.p>
    <motion.h2 
      className="text-white text-4xl font-light mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {title}
    </motion.h2>
    <motion.div 
      className="w-20 h-1 bg-primary rounded-full"
      initial={{ width: 0 }}
      animate={{ width: 80 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    />
  </div>
);

export default SectionHeader;