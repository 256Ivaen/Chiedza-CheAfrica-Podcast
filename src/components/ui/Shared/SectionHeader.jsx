// components/SectionHeader.jsx
import React from "react";
import { motion } from "framer-motion";

const SectionHeader = ({ subtitle, title, icon: Icon, className = "" }) => (
  <div className={`text-center mb-12 ${className}`}>
    <motion.p 
      className="text-primary text-xs font-semibold uppercase tracking-wider mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {subtitle}
    </motion.p>
    <div className="flex items-center justify-center mb-4">
      {Icon && <Icon className="w-6 h-6 text-primary mr-3" />}
      <motion.h2 
        className="text-white text-xl font-light uppercase tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {title}
      </motion.h2>
    </div>
    <motion.div 
      className="w-16 h-0.5 bg-primary mx-auto"
      initial={{ width: 0 }}
      animate={{ width: 64 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    />
  </div>
);

export default SectionHeader;