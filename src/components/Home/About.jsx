import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

export function About() {
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

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Content Side - Left on desktop, Second on mobile/tablet */}
          <motion.div 
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
            variants={fadeInUp}
          >
            {/* Header Section */}
            <div className="text-start">
              <motion.h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
                variants={fadeInUp}
              >
                OUR <span className="text-[#b8a979]">STORY</span>
              </motion.h2>
            </div>

            {/* Description */}
            <motion.div 
              className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed"
              variants={fadeInUp}
            >
              <p className="text-xs sm:text-sm leading-relaxed font-semibold">
                <span className="font-semibold text-[#b8a979]">Adam Agada Distributors Ltd</span> is a distribution company that has grown over the years into one of the prominent companies in the supplies business.
              </p>
              
              <p className="text-xs sm:text-sm leading-relaxed">
              We specialize in the provision of cost effective products and services ranging from supply of food items, packaging and distribution of spices and provision of transportation services all over Kampala. We focus on delivery of high impact solutions that incorporate customized functionality specific to the client requirements.
              </p>
              
              <p className="text-xs sm:text-sm leading-relaxed">
              The combination of process comprehensive experience and expensive creative vision enables us to provide services and products that are innovative, usable and reliable
              </p>
            </motion.div>

            {/* Call to Action Button */}
            <motion.div 
              className="pt-2"
              variants={fadeInUp}
            >
              <button className="inline-flex items-center gap-2 bg-[#b8a979] hover:bg-[#a69968] text-white px-6 lg:px-8 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 group shadow-lg hover:shadow-xl">
                <span>LEARN MORE</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xs sm:text-sm"
                >
                  →
                </motion.div>
              </button>
            </motion.div>
          </motion.div>

          {/* Image Side - Right on desktop, First on mobile/tablet */}
          <motion.div 
            className="relative order-1 lg:order-2"
            variants={fadeInUp}
          >
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={assets.about}
                  alt="About Agada Distributions - Our Story"
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}