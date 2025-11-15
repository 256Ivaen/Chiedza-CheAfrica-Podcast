"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Shield, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { StaticImageData } from "next/image";
import SharedHero from "../ui components/SharedHero";

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconElement: React.ReactNode;
  color?: string;
  accentColor?: string;
  image: string | StaticImageData;
  features: string[];
  detailedFeatures?: {
    title: string;
    description: string;
  }[];
  category?: string;
}

interface ServiceDetailsProps {
  service: Service;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/contact');
  };

  const handleBackToServices = () => {
    router.push('/services');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  // Get service stats based on category
  const getServiceStats = () => {
    const baseStats = [
      { icon: Clock, label: "24/7 Availability", value: "Round-the-clock support" },
      { icon: Users, label: "Expert Team", value: "Qualified professionals" },
      { icon: Shield, label: "Fully Insured", value: "Comprehensive coverage" }
    ];

    if (service.category === "assessments") {
      return [
        { icon: Clock, label: "Assessment Duration", value: "Tailored timelines" },
        { icon: Users, label: "Multi-disciplinary", value: "Social work led" },
        { icon: Shield, label: "Court Ready", value: "Evidence-based reports" }
      ];
    }

    return baseStats;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <SharedHero
        image={service.image}
        title={service.title}
        subtitle={service.shortDescription}
        buttonText="Make a Referral"
        onButtonClick={handleContactClick}
        imageAlt={service.title}
        overlayOpacity={50}
        titleSize="lg"
        height="medium"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <motion.button
          onClick={handleBackToServices}
          className="flex items-center gap-2 text-black hover:text-black/80 mb-12 transition-colors duration-300 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-light uppercase">All Services</span>
        </motion.button>

        {/* Service Stats */}
        {getServiceStats().length > 0 && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getServiceStats().map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-primary text-white rounded-lg p-6 text-left"
                >
                  <stat.icon className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-white/80 text-xs">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Overview */}
            {service.fullDescription && (
              <motion.section variants={itemVariants} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-light text-black uppercase">
                    Service Overview
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-black leading-relaxed text-sm pl-6 py-2">
                    {service.fullDescription.replace(/'/g, "&rsquo;")}
                  </p>
                </div>
              </motion.section>
            )}

            {/* Detailed Features */}
            {service.detailedFeatures && service.detailedFeatures.length > 0 && (
              <motion.section variants={itemVariants} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-light text-black uppercase">
                    Comprehensive Service Features
                  </h2>
                </div>
                <div className="space-y-4">
                  {service.detailedFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="p-3"
                      variants={itemVariants}
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 rounded-full p-2 mt-1 flex-shrink-0">
                          <Circle className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-black mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-black text-xs leading-relaxed">
                            {feature.description.replace(/'/g, "&rsquo;")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={itemVariants}
              className="sticky top-24 space-y-6"
            >
              {/* Service Category Card */}
              {service.category && (
                <div className="bg-primary text-white rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {service.iconElement}
                    <h3 className="text-sm font-semibold uppercase">
                      Service Category
                    </h3>
                  </div>
                  <p className="text-primary text-xs capitalize bg-white rounded-sm px-3 py-2">
                    {service.category}
                  </p>
                </div>
              )}

              {/* Key Features Card */}
              {service.features && service.features.length > 0 && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-black uppercase mb-4">
                    Core Features
                  </h3>
                  <ul className="space-y-3">
                    {service.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-primary/10 rounded-full p-1 mt-0.3 flex-shrink-0">
                          <Circle className="h-2 w-2 text-primary" />
                        </div>
                        <span className="text-xs text-black leading-tight">{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 6 && (
                      <li className="text-xs text-gray-500 italic">
                        +{service.features.length - 6} additional features
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* All Features Grid */}
        {service.features && service.features.length > 0 && (
          <motion.section
            variants={itemVariants}
            className="mt-20 bg-white rounded-lg p-8"
          >
            <div className="text-left mb-10">
              <h2 className="text-2xl font-light text-black uppercase mb-3">
                Complete Service Capabilities
              </h2>
              <p className="text-black text-xs max-w-2xl">
                Our comprehensive approach ensures every aspect of your family&rsquo;s needs is addressed with expertise and care.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {service.features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-2"
                  variants={itemVariants}
                >
                  <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
                    <Circle className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs text-black font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;