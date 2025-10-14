"use client";
import React from "react";
import { motion } from "motion/react";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-[#0f4761] hover:text-[#155b7a] font-medium"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-[#0f4761]/10 shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent bg-white/80 backdrop-blur-sm shadow-sm flex justify-center space-x-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({ title, description, href, src }) => {
  return (
    <a href={href} className="flex space-x-2 hover:bg-[#0f4761]/5 p-2 rounded-lg transition-colors">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-lg"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-[#0f4761]">
          {title}
        </h4>
        <p className="text-[#0f4761]/70 text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </a>
  );
};

export const LocationItem = ({ title, description, address, href, mapUrl, image }) => {
  return (
    <a href={href} className="flex space-x-2 hover:bg-[#0f4761]/5 p-2 rounded-lg transition-colors">
      <div className="shrink-0">
        <iframe
          src={mapUrl}
          width={140}
          height={70}
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-md shadow-lg"
        />
      </div>
      <div>
        <h4 className="text-xl font-bold mb-1 text-[#0f4761]">
          {title}
        </h4>
        <p className="text-[#0f4761]/70 text-sm max-w-[10rem] mb-1">
          {description}
        </p>
        <p className="text-[#0f4761]/60 text-sm max-w-[10rem]">
          {address}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }) => {
  return (
    <a
      {...rest}
      className="text-[#0f4761]/70 hover:text-[#0f4761] transition-colors"
    >
      {children}
    </a>
  );
};