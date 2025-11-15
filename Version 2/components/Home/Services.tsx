"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, Star, Filter, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { servicesData } from "../../assets/services";
import Heading from "../ui components/Heading";

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category?: string;
  features: string[];
  image: string | StaticImageData;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  accentColor?: string;
}

interface ServicesSectionProps {
  featuredOnly?: boolean;
  filteredServices?: Service[];
  searchQuery?: string;
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  featuredOnly = true, 
  filteredServices = null,
  searchQuery = "", 
  activeFilter = "all",
  setActiveFilter = () => {}
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const router = useRouter();
  
  const allCategories = servicesData
    .map(service => service.category)
    .filter(Boolean);
  
  const categories = ["all", ...Array.from(new Set(allCategories))];
  
  const displayedServices = filteredServices 
    ? filteredServices 
    : featuredOnly 
      ? servicesData.slice(0, 3) 
      : servicesData;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobile && featuredOnly && displayedServices.length > 0 && !isLoading) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => 
          prevIndex === displayedServices.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMobile, displayedServices.length, featuredOnly, isLoading]);

  const handleImageError = (serviceId: string) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  const handleViewAllServices = () => {
    router.push('/services');
  };

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const ServiceImage = ({ service }: { service: Service }) => {
    const hasError = imageErrors[service.id];
    
    if (hasError) {
      return (
        <div className="h-48 bg-primary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <ImageIcon size={48} className="mx-auto mb-2 opacity-60" />
            <p className="text-sm opacity-80">{service.title}</p>
          </div>
        </div>
      );
    }

    const IconComponent = service.icon;

    return (
      <div className="h-48 overflow-hidden relative">
        <Image 
          src={service.image} 
          alt={service.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => handleImageError(service.id)}
          priority={featuredOnly}
        />
        {/* <div className="absolute inset-0 bg-primary/60"></div> */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
          <IconComponent className="text-white text-xl" />
        </div>
      </div>
    );
  };

  const ServiceCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md h-full overflow-hidden animate-pulse border border-gray-200">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="flex space-x-1 mb-4">
          <div className="h-2 bg-gray-300 rounded w-1/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );

  const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
    const isActive = isMobile && featuredOnly ? index === activeIndex : true;
    
    return (
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className="bg-primary text-white rounded-lg shadow-lg h-full overflow-hidden cursor-pointer border border-primary/30"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            onClick={() => handleServiceClick(service.id)}
            layout
          >
            <ServiceImage service={service} />
            
            <div className="p-6">
              {service.category && !featuredOnly && (
                <motion.span
                  className="inline-block px-3 py-1 text-xs rounded-full mb-3 bg-white/20 text-white/90 backdrop-blur-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                </motion.span>
              )}
              
              <h3 className="text-xl font-bold mb-3 text-white">
                {service.title}
              </h3>
              
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                {service.shortDescription}
              </p>
              
              <div className="mb-4 space-y-1">
                {service.features.slice(0, 3).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center text-white/70 text-xs">
                    <div className="w-1 h-1 bg-white/50 rounded-full mr-2 flex-shrink-0"></div>
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
                {service.features.length > 3 && (
                  <div className="text-white/60 text-xs italic">
                    +{service.features.length - 3} more features
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-sm font-semibold text-white">Learn More</span>
                <ArrowRight size={16} className="text-white" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <section ref={containerRef} className="w-full py-16">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <Heading 
          title={featuredOnly ? "Featured Services" : "Our Services"}
          subtitle={featuredOnly ? "Professional Social Work Solutions" : "Comprehensive Family Support & Therapeutic Services"}
          showButton={featuredOnly}
          buttonText="View All Services"
          onButtonClick={handleViewAllServices}
        />
        
        {!featuredOnly && !searchQuery && (
          <motion.div 
            className="flex flex-wrap gap-3 mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mr-3">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">Filter by:</span>
            </div>
            
            {categories.map((category) => (
              <motion.button
                key={category || 'uncategorized'}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 text-sm rounded-full transition-all font-medium ${
                  activeFilter === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-primary/50 hover:text-primary"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                animate={activeFilter === category ? { scale: [1, 1.05, 1] } : {}}
              >
                {category === 'all' ? 'All Services' : category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
            
            {activeFilter !== "all" && (
              <motion.button
                onClick={() => handleFilterChange("all")}
                className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-600 flex items-center font-medium hover:bg-gray-200"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <X size={14} className="mr-1" />
                Clear
              </motion.button>
            )}
          </motion.div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <ServiceCardSkeleton key={item} />
            ))}
          </div>
        ) : (
          <>
            {isMobile && featuredOnly && displayedServices.length > 0 && (
              <div className="flex justify-center mb-8">
                {displayedServices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`mx-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? "bg-primary w-6 h-2" 
                        : "bg-gray-300 w-2 h-2"
                    }`}
                    aria-label={`View service ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            <motion.div 
              className={isMobile && featuredOnly ? "relative h-[400px]" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              layout
            >
              {displayedServices.length > 0 ? (
                displayedServices.map((service, index) => (
                  <motion.div 
                    key={service.id} 
                    className={isMobile && featuredOnly ? "absolute inset-0" : "h-full"}
                    layout
                  >
                    <ServiceCard service={service} index={index} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No services found</div>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;