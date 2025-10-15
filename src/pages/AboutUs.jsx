// pages/AboutUs.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Mic2,
  Lightbulb,
  Heart,
  Target,
  Globe,
  Award,
  Sparkles,
  TrendingUp,
  Radio,
  MapPin,
} from "lucide-react";
import { assets } from "../assets/assets";
import PageHero from "../components/ui/Shared/PageHero";
import SectionHeader from "../components/ui/Shared/SectionHeader";
import CTA from "../components/ui/Shared/CTA";

const AboutUs = () => {
  const location = useLocation();

  const focusAreas = [
    {
      icon: Target,
      title: "Aviation & STEM Pathways",
      description:
        "Inspiring the next generation of innovators through stories of pilots, engineers, and space scientists breaking barriers and reaching for the stars.",
    },
    {
      icon: Users,
      title: "Disability Awareness & Inclusion",
      description:
        "Creating empathy and equal opportunity by amplifying voices that champion accessibility and inclusive communities across Africa.",
    },
    {
      icon: Heart,
      title: "Mental Health & Dementia Advocacy",
      description:
        "Promoting care, understanding, and compassion through conversations about mental wellness and dementia care in African communities.",
    },
    {
      icon: Sparkles,
      title: "Youth Empowerment & Community Outreach",
      description:
        "Tackling real issues through mentorship programs, awareness campaigns, and grassroots initiatives that transform lives.",
    },
  ];

  const stats = [
    {
      icon: Radio,
      number: "50+",
      label: "Episodes Published",
    },
    {
      icon: Users,
      number: "100K+",
      label: "Listeners Reached",
    },
    {
      icon: MapPin,
      number: "25+",
      label: "African Countries",
    },
  ];

  const approaches = [
    {
      icon: Mic2,
      title: "Authentic Storytelling",
      description:
        "We believe in the power of authentic voices. Every story is told in the words of the changemakers themselves, preserving the raw emotion and truth of their journeys.",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Sparkles,
      title: "Quality Production",
      description:
        "Professional audio quality and engaging narratives ensure that every episode is not just heard, but experienced. We invest in the best to honor our storytellers.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Heart,
      title: "Community Impact",
      description:
        "Beyond storytelling, we're committed to creating tangible impact through mentorship programs, awareness campaigns, and community outreach initiatives.",
      color: "from-orange-500/20 to-red-500/20",
    },
  ];

  const getCanonicalUrl = () => {
    const baseUrl = "https://chiedzacheafrica.com";
    return baseUrl + location.pathname;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>
          About Us - Chiedza CheAfrica Podcast | Our Story & Mission
        </title>
        <meta
          name="description"
          content="Learn about Chiedza CheAfrica Podcast - a movement amplifying African stories of innovation, courage, and purpose through conversations on aviation, STEM, disability inclusion, and mental health."
        />
        <link rel="canonical" href={getCanonicalUrl()} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta
          property="og:title"
          content="About Chiedza CheAfrica - Our Story & Mission"
        />
        <meta
          property="og:description"
          content="A global podcast and movement celebrating Africa's ascent through stories of courage, innovation, and purpose."
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <PageHero
          title="About Chiedza CheAfrica"
          subtitle="Lighting paths. Inspiring minds. Amplifying African stories."
          image={assets.hero1}
        />

        {/* Mission Section */}
        <section className="pt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-12 items-stretch mb-20"
            >
              {/* Left Column - Content + Stats */}
              <motion.div variants={itemVariants} className="space-y-8">
                <div>
                  <div className="flex items-center mb-6">
                    <h2 className="text-white text-2xl font-light uppercase tracking-wide">
                      Our Story & Mission
                    </h2>
                  </div>

                  <p className="text-white text-lg font-light mb-6 leading-relaxed">
                    At{" "}
                    <span className="text-primary font-normal">
                      Chiedza CheAfrica
                    </span>
                    , we believe every story carries light —
                    <span className="text-primary italic">
                      {" "}
                      "Chiedza" means light in Shona
                    </span>
                    .
                  </p>

                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                      We are storytellers, dreamers, and changemakers passionate
                      about showcasing the brilliance of Africa and its people
                      to the world. Our mission is to educate, empower, and
                      connect — through conversations that spark curiosity,
                      hope, and action.
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                      Chiedza CheAfrica isn't just a podcast — it's a movement
                      for light, leadership, and legacy. A global platform
                      celebrating Africa's brilliance through storytelling,
                      featuring voices shaping the future—from pilots and
                      engineers to advocates and creators—while promoting
                      inclusivity, education, and empowerment.
                    </p>
                  </div>
                </div>

                {/* Stats Section - Below Text */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="transition-all duration-300 group"
                        whileHover={{ y: -5 }}
                      >
                        <IconComponent className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                        <div className="text-primary text-2xl font-light mb-1">
                          {stat.number}
                        </div>
                        <div className="text-gray-300 text-xs font-light">
                          {stat.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Right Column - Standalone Image */}
              <motion.div variants={itemVariants}>
                <div className="relative rounded-2xl overflow-hidden h-full">
                  <img
                    src={assets.hero1}
                    alt="Chiedza CheAfrica Team"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Text on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white text-2xl font-light mb-2">
                      Lighting Africa's Path
                    </h3>
                    <p className="text-gray-200 text-sm font-light">
                      Stories of Innovation, Inspiration & Impact
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* What We Champion Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-20"
            >
              <SectionHeader
                subtitle="Our Focus Areas"
                title="What We Champion"
                icon={Award}
              />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {focusAreas.map((area, index) => {
                  const IconComponent = area.icon;
                  return (
                    <motion.div
                      key={area.title}
                      variants={itemVariants}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                      whileHover={{ y: -5 }}
                    >
                      <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-white text-base font-normal mb-3">
                        {area.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {area.description}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Vision Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 mb-20"
            >
              <div className="flex items-center mb-6">
                <Globe className="w-8 h-8 text-primary mr-4" />
                <h3 className="text-white text-2xl font-light">Our Vision</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed font-light max-w-4xl">
                To create a world where every African story of innovation,
                courage, and purpose is heard, celebrated, and inspires action.
                We envision a continent where every voice contributes to shaping
                extraordinary futures, and where the brilliance of Africa's
                changemakers lights the path for generations to come.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              subtitle="Our Methodology"
              title="Our Approach"
              icon={Users}
            />

            <div className="grid md:grid-cols-3 gap-8">
              {approaches.map((approach, index) => {
                const IconComponent = approach.icon;
                return (
                  <motion.div
                    key={approach.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary transition-all duration-300 group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="text-white text-base font-normal mb-3">
                      {approach.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                      {approach.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
