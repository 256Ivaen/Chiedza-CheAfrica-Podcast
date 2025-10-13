import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils"; 

// HoverEffect Component with TekJuice styling
export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-6", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-[#F6931B]/5 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <CardCategory>{item.category}</CardCategory>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 overflow-hidden bg-white border border-gray-100 group-hover:border-[#F6931B]/30 relative z-20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#F6931B]/10",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-gray-900 font-bold tracking-wide mt-2 text-sm md:text-lg group-hover:text-[#F6931B] transition-colors duration-300", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p className={cn("mt-4 text-gray-600 tracking-wide leading-relaxed text-xs md:text-sm", className)}>
      {children}
    </p>
  );
};

export const CardCategory = ({ className, children }) => {
  return (
    <span className={cn("inline-block mt-4 px-3 py-1 bg-[#F6931B]/10 text-[#F6931B] rounded-full text-xs font-medium", className)}>
      {children}
    </span>
  );
};

const WhyChooseUs = () => {
  // Animation variants copied from About component
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const advantages = [
    {
      title: "Elite Tech Talent, Proven Results",
      description: "Our team is not just skilled. They are specialists handpicked for their excellence in delivering innovative, scalable and secure tech solutions across industries.",
      category: "Expertise"
    },
    {
      title: "Track Record of Success",
      description: "From startups to enterprise clients, we have solved real-world problems with dependable results. Our portfolio reflects consistent delivery, measurable Return-On-Investment and long-term client satisfaction.",
      category: "Results"
    },
    {
      title: "Strategic, Growth-Driven Partnerships",
      description: "We do not just work for you, we work with you. Our long-term partnerships are built on trust, transparency and shared success, fueling growth for both sides.",
      category: "Partnership"
    },
    {
      title: "Africa-Rooted, Globally Connected",
      description: "We bridge continents, with a tech hub in Africa and deep connections in the UK and beyond, you benefit from top-tier talent and global service standards.",
      category: "Global Reach"
    },
    {
      title: "End-to-End Support",
      description: "Whether it is software development, digital marketing or talent placement, we handle it all with clarity, consistency and unwavering commitment to your goals.",
      category: "Comprehensive"
    },
    {
      title: "Innovation at Scale",
      description: "We leverage cutting-edge technologies and methodologies to deliver solutions that not only meet current needs but are built to scale and adapt for future growth.",
      category: "Innovation"
    }
  ];

  return (
    <motion.section 
      className="w-full bg-white py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-start mb-6"
          variants={fadeInUp}
        >
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-wider">
            Our Advantage
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold uppercase text-black">
            Why Work With Us?
          </h2>
        </motion.div>

        {/* Advantages Grid */}
        <motion.div variants={fadeInUp}>
          <HoverEffect items={advantages} className="w-full mx-auto" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyChooseUs;