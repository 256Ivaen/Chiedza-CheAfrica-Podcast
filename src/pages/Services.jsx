import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Users2, 
  Building, 
  MessageCircle,
  Target,
  ArrowRight
} from "lucide-react";
import { assets } from "../assets/assets";
import PageHero from "../components/ui/Shared/PageHero";
import SectionHeader from "../components/ui/Shared/SectionHeader";
import CTA from "../components/ui/Shared/CTA";

const Services = () => {
  const mainServices = [
    {
      icon: User,
      title: "Individual Services",
      description: "One-on-one mentorship, career and education consultations, university application support, and tailored guidance for students and early-career professionals.",
      features: [
        "Personal mentorship and goal setting",
        "Scholarship and application planning", 
        "Career strategy and growth mapping",
        "University and program matching",
        "Application and essay support",
        "Interview preparation and academic readiness"
      ],
      link: "/services/individual"
    },
    {
      icon: Users2,
      title: "Group Engagements",
      description: "Interactive workshops and small-cohort programmes (25 participants and below) designed for schools, youth groups and community organisations.",
      features: [
        "Pathways to Professions in Aviation & STEM",
        "Leadership and Confidence Building",
        "Scholarship and Career Readiness",
        "Girls in Innovation and Entrepreneurship"
      ],
      link: "/services/group"
    },
    {
      icon: Building,
      title: "Corporate & Institutional Partnerships",
      description: "Co-created CSR initiatives, outreach campaigns, project design and implementation support, and partnership programmes that align with organisational sustainability goals.",
      features: [
        "Outreach & CSR Programs",
        "Co-Created Impact Projects", 
        "Project Design & Implementation Support",
        "Planning, delivery and impact reporting"
      ],
      link: "/services/corporate"
    },
    {
      icon: MessageCircle,
      title: "Speaking & Event Engagements",
      description: "Keynote talks, panel contributions, training sessions and moderated conversations tailored for conferences, schools, corporate events and community gatherings.",
      features: [
        "Breaking Barriers in Aviation and STEM",
        "Empowering the Next Generation of African Leaders",
        "Storytelling for Change",
        "Innovation, Resilience, and Representation"
      ],
      link: "/services/speaking"
    }
  ];

  const stats = [
    { number: "100+", label: "Students Mentored" },
    { number: "50+", label: "Workshops Conducted" },
    { number: "25+", label: "Corporate Partners" },
    { number: "30+", label: "Speaking Events" }
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
        title="Services & Consultancy"
        subtitle="Shaping Africa's future through knowledge, innovation, and opportunity. Turning aspirations into real-world achievements."
        image={assets.hero1}
      />

      {/* Introduction Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          > 
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-primary text-xl font-light mb-1">{stat.number}</div>
                  <div className="text-gray-300 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Main Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeader 
              subtitle="Our Expertise"
              title="Service Areas"
              icon={Target}
            />

            <div className="grid lg:grid-cols-2 gap-8">
              {mainServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-start mb-4">
                      <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/30 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-sm font-light mb-2">{service.title}</h3>
                        <p className="text-gray-300 text-xs leading-relaxed mb-4">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-gray-300 text-xs flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-gray-300 text-xs flex items-start">
                          <span className="text-primary mr-2">•</span>
                          +{service.features.length - 3} more services
                        </li>
                      )}
                    </ul>
                    
                    {/* <button 
                      onClick={() => window.location.href = service.link}
                      className="flex items-center text-primary text-xs hover:text-primary/80 transition-colors"
                    >
                      Learn more <ArrowRight className="w-3 h-3 ml-1" />
                    </button> */}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader 
            subtitle="How We Work"
            title="Our Process"
            icon={Target}
          />

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white text-sm font-light mb-3">Consultation</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                We begin with understanding your unique needs, goals, and challenges through personalized consultations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white text-sm font-light mb-3">Custom Solution</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                We design tailored programs and strategies that align with your specific objectives and aspirations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white text-sm font-light mb-3">Implementation & Support</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                We execute with excellence and provide ongoing support to ensure you achieve your desired outcomes.
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
          text: "Book a Consultation",
          onClick: () => window.location.href = "/contact"
        }}
        secondaryButton={{
          text: "View Service Details", 
          onClick: () => window.location.href = "/services-details"
        }}
      />
    </div>
  );
};

export default Services;