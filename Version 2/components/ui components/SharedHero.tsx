"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image, { StaticImageData } from "next/image";

interface SharedHeroProps {
  image: string | StaticImageData;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  imageAlt?: string;
  overlayOpacity?: number;
  titleSize?: "sm" | "md" | "lg" | "xl";
  height?: "small" | "medium" | "large" | "full";
}

const SharedHero: React.FC<SharedHeroProps> = ({
  image,
  title,
  subtitle,
  description,
  buttonText,
  onButtonClick,
  imageAlt = "Hero background",
  overlayOpacity = 40,
  titleSize = "lg",
  height = "medium"
}) => {
  const contentVariants: Variants = {
    enter: {
      opacity: 0,
      y: 30
    },
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const titleSizes = {
    sm: "text-2xl md:text-4xl",
    md: "text-3xl md:text-5xl",
    lg: "text-3xl md:text-6xl",
    xl: "text-4xl md:text-7xl"
  };

  const heightClasses = {
    small: "h-64 md:h-80",
    medium: "h-80 md:h-96",
    large: "h-96 md:h-[500px]",
    full: "h-[calc(100vh-64px)]"
  };

  return (
    <section className={`${heightClasses[height]} flex items-center overflow-hidden relative`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div 
          className={`absolute inset-0 bg-black/${overlayOpacity}`}
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 w-full relative z-10">
        <div className="flex flex-col items-start text-left max-w-3xl">
          <motion.div
            className="space-y-4 w-full"
            initial="enter"
            animate="center"
            variants={contentVariants}
          >
            <div>
              <motion.h1 className={`${titleSizes[titleSize]} font-light text-white leading-tight`}>
                {title}
              </motion.h1>
              {subtitle && (
                <motion.h2 className="text-lg md:text-xl font-light text-white/90 mt-2">
                  {subtitle}
                </motion.h2>
              )}
            </div>

            {description && (
              <motion.p className="text-xs text-white leading-relaxed max-w-2xl">
                {description}
              </motion.p>
            )}

            {buttonText && onButtonClick && (
              <motion.button 
                onClick={onButtonClick}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-1.5 rounded-full text-sm uppercase font-light transition-colors w-full sm:w-auto max-w-xs"
              >
                {buttonText}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SharedHero;