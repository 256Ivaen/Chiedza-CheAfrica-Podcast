"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { servicesData } from "../../assets/services";
import Heading from "../ui components/Heading";
import useEmblaCarousel from "embla-carousel-react";

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

interface AllServicesSectionProps {
  searchQuery?: string;
}

const AllServicesSection: React.FC<AllServicesSectionProps> = ({ 
  searchQuery = "", 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const router = useRouter();
  
  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    containScroll: "trimSnaps"
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Show ALL services
  const displayedServices = servicesData;

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  // Update button states
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleImageError = (serviceId: string) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
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
          priority={false}
        />
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

  const ServiceCard = ({ service }: { service: Service }) => {
    return (
      <motion.div 
        className="bg-primary text-white rounded-lg shadow-lg h-full overflow-hidden cursor-pointer border border-primary/30 hover:shadow-xl transition-shadow duration-300 mx-2"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        onClick={() => handleServiceClick(service.id)}
        layout
      >
        <ServiceImage service={service} />
        
        <div className="p-6">
          {service.category && (
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
    );
  };

  return (
    <section ref={containerRef} className="w-full py-10" id="all-services">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Heading 
          title="Our Services"
          subtitle="Comprehensive Family Support & Therapeutic Services"
          showButton={false}
        />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ServiceCardSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute -top-16 right-4 flex gap-2 z-10">
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <motion.div 
                className="flex"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {displayedServices.length > 0 ? (
                  displayedServices.map((service) => (
                    <div key={service.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
                      <ServiceCard service={service} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">No services found</div>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllServicesSection;