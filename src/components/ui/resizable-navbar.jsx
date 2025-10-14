"use client";
import { cn } from "../../lib/utils";
import { IconMenu2, IconX, IconChevronDown } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";

export const Navbar = ({
  children,
  className
}) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child)}
    </motion.div>
  );
};

export const NavBody = ({
  children,
  className,
  visible = false,
  ...props
}) => {
  // Filter out the visible prop from being passed to the DOM
  const { visible: _, ...domProps } = props;
  
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(164, 165, 170, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "87%" : "100%",
        y: visible ? 20 : 10,
        backgroundColor: visible ? "rgba(255, 255, 255, 0.84)" : "#b8a979",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "320px",
        maxWidth: "98vw",
      }}
      className={cn(
        "relative z-[60] mx-auto w-full flex-row items-center justify-between self-start rounded-lg px-6 py-3",
        "hidden [@media(min-width:980px)]:flex",
        className
      )}
      {...domProps}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child)}
    </motion.div>
  );
};

export const NavItems = ({
  items = [],
  className,
  isActive = () => false,
  onItemClick = () => {},
  servicesData = [],
  locationsData = [],
  visible = false
}) => {
  const [hovered, setHovered] = useState(null);
  const [locationHovered, setLocationHovered] = useState(false);

  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
        setLocationHovered(false);
      }}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center transition duration-200",
        "[@media(min-width:980px)]:flex",
        "min-w-0 overflow-visible",
        className
      )}
      style={{
        maxWidth: "calc(100% - 400px)",
        marginLeft: "200px",
        marginRight: "200px",
      }}
    >
      
      <div className="flex items-center justify-center space-x-4 text-sm font-medium">
        {/* Regular nav items */}
        {items && items.map((item, idx) => (
          <a
            key={`link-${idx}`}
            onMouseEnter={() => {
              setHovered(idx);
              setLocationHovered(false);
            }}
            onClick={(e) => {
              e.preventDefault();
              onItemClick(item.link);
            }}
            className="relative px-3 py-2 uppercase transition-colors whitespace-nowrap text-sm"
            style={{
              color: isActive(item.link)
                ? (visible ? "#b8a979" : "white")
                : (visible ? "black" : "white")
            }}
            href={item.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className={`absolute inset-0 h-full w-full rounded-full ${
                  visible ? "bg-black/10" : "bg-white/10"
                }`} />
            )}
            <span className="relative z-20">{item.name}</span>
            {isActive(item.link) && (
              <motion.div
                className={`absolute -bottom-1 left-1/2 w-1 h-1 rounded-full ${
                  visible ? "bg-[#b8a979]" : "bg-white"
                }`}
                layoutId="activeIndicator"
                style={{ transform: "translateX(-50%)" }}
              />
            )}
          </a>
        ))}

        {/* Our Locations dropdown */}
        {locationsData && locationsData.length > 0 && (
          <div
            className="relative"
            onMouseEnter={() => {
              setLocationHovered(true);
              setHovered(null);
            }}
          >
            <a
              href="/locations"
              onClick={(e) => {
                e.preventDefault();
                onItemClick("/locations");
              }}
              className="relative px-3 py-2 uppercase transition-colors whitespace-nowrap text-sm flex items-center gap-1"
              style={{
                color: visible ? "black" : "white"
              }}
            >
              {locationHovered && (
                <motion.div
                  layoutId="hovered"
                  className={`absolute inset-0 h-full w-full rounded-full ${
                    visible ? "bg-black/10" : "bg-white/10"
                  }`} />
              )}
              <span className="relative z-20">Our Locations</span>
              <IconChevronDown className={`w-3 h-3 relative z-20 transition-transform ${locationHovered ? 'rotate-180' : ''}`} />
            </a>

            {locationHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  backgroundColor: visible ? "rgba(255, 255, 255, 0.84)" : "#b8a979"
                }}
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-80 rounded-lg shadow-xl border p-4 z-[100] ${
                  visible 
                    ? "border-gray-200 shadow-lg backdrop-blur-sm" 
                    : "border-[#b8a979] shadow-2xl"
                }`}
              >
                <div className="space-y-3">
                  {locationsData.map((location, i) => (
                    <a
                      key={i}
                      href={`/locations/${i}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick(`/locations/${i}`);
                      }}
                      className={`block p-3 rounded-lg transition-colors ${
                        visible 
                          ? "hover:bg-black/10" 
                          : "hover:bg-white/10"
                      }`}
                      style={{
                        color: visible ? "black" : "white"
                      }}
                    >
                      <div className="font-medium">
                        {location.title}
                      </div>
                      <div 
                        className="text-sm mt-1"
                        style={{
                          color: visible ? "#374151" : "rgba(255, 255, 255, 0.8)"
                        }}
                      >
                        {location.address}
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const MobileNav = ({
  children,
  className,
  visible = false,
  ...props
}) => {
  // Filter out the visible prop from being passed to the DOM
  const { visible: _, ...domProps } = props;
  
  return (
    <motion.div
      animate={{
        backgroundColor: "white",
        width: "100%",
        paddingRight: "16px",
        paddingLeft: "16px",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-col items-center justify-between px-4 py-3",
        "[@media(max-width:979px)]:flex [@media(min-width:980px)]:hidden",
        className
      )}
      {...domProps}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { isMobile: true })
          : child)}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
  visible = false,
  isMobile = false,
  ...props
}) => {
  // Filter out non-DOM props
  const { visible: _, isMobile: __, ...domProps } = props;
  
  return (
    <div
      className={cn("flex w-full flex-row items-center justify-between", className)}
      {...domProps}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { isMobile: true })
          : child)}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen = false,
  onClose = () => {},
  ...props
}) => {
  // Filter out non-DOM props
  const { isOpen: _, onClose: __, ...domProps } = props;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            "w-full overflow-hidden bg-white rounded-lg mt-2 shadow-lg border border-gray-200",
            className
          )}
          {...domProps}
        >
          <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen = false,
  onClick = () => {},
  className,
  visible = false,
  isMobile = false,
  ...props
}) => {
  // Filter out non-DOM props
  const { isOpen: _, onClick: __, visible: ___, isMobile: ____, ...domProps } = props;
  
  return (
    <button 
      onClick={onClick}
      className={cn("p-2 rounded-lg hover:bg-gray-100 transition-colors text-black", className)}
      {...domProps}
    >
      {isOpen ? (
        <IconX className="h-5 w-5" />
      ) : (
        <IconMenu2 className="h-5 w-5" />
      )}
    </button>
  );
};

export const NavbarLogo = ({ 
  children, 
  visible = false, 
  isMobile = false,
  ...props
}) => {
  // Filter out non-DOM props
  const { visible: _, isMobile: __, ...domProps } = props;
  
  return (
    <div 
      className="relative z-20 flex-shrink-0 transition-all duration-300"
      style={{
        filter: isMobile ? "none" : (visible ? "none" : "brightness(0) invert(1)")
      }}
      {...domProps}
    >
      {children}
    </div>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "button",
  children,
  className,
  variant = "primary",
  onClick = () => {},
  visible = false,
  isMobile = false,
  ...props
}) => {
  // Filter out non-DOM props
  const { variant: _, visible: __, isMobile: ___, ...domProps } = props;
  
  const baseStyles =
    "px-6 py-3 rounded-lg text-sm font-medium relative cursor-pointer hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center uppercase flex-shrink-0";

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        if (isMobile) {
          return "bg-[#b8a979] text-white hover:bg-[#a69968] shadow-md hover:shadow-lg border-2 border-[#b8a979] hover:border-[#a69968]";
        }
        return visible 
          ? "bg-[#b8a979] text-white hover:bg-[#a69968] shadow-md hover:shadow-lg border-2 border-[#b8a979] hover:border-[#a69968]"
          : "bg-white text-[#b8a979] hover:bg-gray-100 shadow-md hover:shadow-lg border-2 border-white hover:border-gray-100";
      case "mobile":
        return "w-full bg-[#b8a979] text-white hover:bg-[#a69968] shadow-md hover:shadow-lg border-2 border-[#b8a979] hover:border-[#a69968]";
      case "secondary":
        return "bg-transparent border-2 border-[#b8a979] text-[#b8a979] hover:bg-[#b8a979] hover:text-white";
      default:
        return "bg-[#b8a979] text-white hover:bg-[#a69968]";
    }
  };

  return (
    <Tag
      href={href || undefined}
      onClick={onClick}
      className={cn(baseStyles, getVariantStyles(), className)}
      {...domProps}
    >
      {children}
    </Tag>
  );
};