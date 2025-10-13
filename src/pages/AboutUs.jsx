// pages/AboutUs.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Mic2, 
  Lightbulb, 
  Heart, 
  Target,
  Globe,
  Award,
  Sparkles
} from "lucide-react";
import { assets } from "../assets/assets";
import PageHero from "../components/ui/Shared/PageHero";
import SectionHeader from "../components/ui/Shared/SectionHeader";
import CTA from "../components/ui/Shared/CTA";

const AboutUs = () => {
  const focusAreas = [
    {
      icon: Target,
      title: "Aviation & STEM Pathways",
      description: "Inspiring the next generation of innovators through stories of pilots, engineers, and space scientists breaking barriers and reaching for the stars."
    },
    {
      icon: Users,
      title: "Disability Awareness & Inclusion",
      description: "Creating empathy and equal opportunity by amplifying voices that champion accessibility and inclusive communities across Africa."
    },
    {
      icon: Heart,
      title: "Mental Health & Dementia Advocacy",
      description: "Promoting care, understanding, and compassion through conversations about mental wellness and dementia care in African communities."
    },
    {
      icon: Sparkles,
      title: "Youth Empowerment & Community Outreach",
      description: "Tackling real issues through mentorship programs, awareness campaigns, and grassroots initiatives that transform lives."
    }
  ];

  const stats = [
    { number: "50+", label: "Episodes Published" },
    { number: "100K+", label: "Listeners Reached" },
    { number: "25+", label: "African Countries" },
    { number: "40+", label: "Changemakers Featured" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHero 
        title="About Chiedza CheAfrica"
        subtitle="Lighting paths. Inspiring minds. Amplifying African stories."
        image={assets.hero1}
      />

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-6">
                <Lightbulb className="w-8 h-8 text-primary mr-4" />
                <h2 className="text-white text-xl font-light uppercase tracking-wide">
                  Our Story & Mission
                </h2>
              </div>
              
              <p className="text-white text-lg font-light mb-6 leading-relaxed">
                At <span className="text-primary">Chiedza CheAfrica</span>, we believe every story carries light —
                <span className="text-primary italic"> "Chiedza" means light in Shona</span>.
              </p>
              
              <div className="space-y-4">
                <p className="text-gray-300 text-xs leading-relaxed">
                  We are storytellers, dreamers, and changemakers passionate about showcasing the brilliance 
                  of Africa and its people to the world. Our mission is to educate, empower, and connect — 
                  through conversations that spark curiosity, hope, and action.
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Chiedza CheAfrica isn't just a podcast — it's a movement for light, leadership, and legacy. 
                  A global platform celebrating Africa's brilliance through storytelling, featuring voices 
                  shaping the future—from pilots and engineers to advocates and creators—while promoting 
                  inclusivity, education, and empowerment.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                  <div className="text-primary text-2xl font-light mb-2">{stat.number}</div>
                  <div className="text-gray-300 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* What We Champion Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
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
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-white text-sm font-light mb-3">{area.title}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
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
            className="bg-primary/10 border border-primary/20 rounded-lg p-8"
          >
            <div className="flex items-center mb-6">
              <Globe className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-white text-lg font-light">Our Vision</h3>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed max-w-4xl">
              To create a world where every African story of innovation, courage, and purpose is heard, 
              celebrated, and inspires action. We envision a continent where every voice contributes to 
              shaping extraordinary futures, and where the brilliance of Africa's changemakers lights 
              the path for generations to come.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team & Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader 
            subtitle="Our Methodology"
            title="Our Approach"
            icon={Users}
          />

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <Mic2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-white text-sm font-light mb-3">Authentic Storytelling</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                We believe in the power of authentic voices. Every story is told in the words of the changemakers themselves, preserving the raw emotion and truth of their journeys.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-white text-sm font-light mb-3">Quality Production</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Professional audio quality and engaging narratives ensure that every episode is not just heard, but experienced. We invest in the best to honor our storytellers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-white text-sm font-light mb-3">Community Impact</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Beyond storytelling, we're committed to creating tangible impact through mentorship programs, awareness campaigns, and community outreach initiatives.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA
        title="Ready to Be Part of the Movement?"
        subtitle="Whether you want to share your story, collaborate, or support our mission, we'd love to connect with you and continue lighting Africa's path together."
        primaryButton={{
          text: "Share Your Story",
          onClick: () => window.location.href = "/contact"
        }}
        secondaryButton={{
          text: "Support Our Mission", 
          onClick: () => window.location.href = "/support"
        }}
      />
    </div>
  );
};

export default AboutUs;