// components/PageHero.jsx
import React from "react";
import { motion } from "framer-motion";
import HeroTitle from "./HeroTitle";

const PageHero = ({ title, subtitle, image }) => {
  return (
    <section className="relative h-[50vh] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <HeroTitle title={title} subtitle={subtitle} />
        </div>
      </div>
    </section>
  );
};

export default PageHero;