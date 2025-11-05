import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Award, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Mail,
  Globe,
  Heart,
  ArrowRight
} from "lucide-react";

import PageHero from "../components/ui/Shared/PageHero";
import SectionHeader from "../components/ui/Shared/SectionHeader";
import SupportUs from "../components/Home/SupportUs";
import { assets } from "../assets/assets";

const Support = () => {
  const location = useLocation();

  const scholarshipTypes = [
    {
      icon: BookOpen,
      title: "High School Scholarship",
      subtitle: "Africa-based Students",
      description: "This scholarship is open to high school students across Africa who show promise in academics and a commitment to bettering their communities.",
      support: [
        "Tuition fees",
        "Books and learning materials", 
        "School uniforms and accessories"
      ],
      eligibility: [
        "Must be currently enrolled in a high school in Africa",
        "Must demonstrate financial need",
        "Must maintain good academic performance",
        "Must show leadership, initiative, or involvement in community service"
      ],
      note: "Scholarship amounts vary annually based on available funding and the number of selected recipients."
    },
    {
      icon: GraduationCap,
      title: "Vocational & Tertiary Scholarship",
      subtitle: "Aviation & STEM Fields",
      description: "This scholarship supports African students studying in Africa within aviation or STEM-related disciplines, such as engineering, computer science, environmental sciences, and technical trades.",
      support: [
        "Tuition and registration fees",
        "Training or certification materials",
        "Study tools, equipment, or resources"
      ],
      eligibility: [
        "Must be an African national studying within Africa",
        "Must be enrolled or accepted into a recognized vocational or tertiary institution",
        "Must be pursuing aviation or STEM-related field",
        "Must demonstrate financial need, academic excellence, and leadership potential"
      ],
      note: "Award amounts are based on available funds and applicant merit. Each award cycle is competitive and reviewed by the Chiedza CheAfrica selection panel."
    }
  ];

  const timeline = [
    { period: "April – June", event: "Application Period" },
    { period: "August", event: "Recipients Announced" }
  ];

  const getCanonicalUrl = () => {
    const baseUrl = "https://chiedzacheafrica.com";
    return baseUrl + location.pathname;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Scholarship",
    name: "Chiedza CheAfrica Scholarship",
    description: "Need-based initiative designed to empower Africa's next generation of innovators, aviators, and changemakers through educational assistance.",
    provider: {
      "@type": "Organization",
      name: "Chiedza CheAfrica",
      url: "https://chiedzacheafrica.com"
    },
    educationalLevel: ["HighSchool", "Undergraduate", "Vocational"],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Student"
    },
    award: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "Varies"
    },
    applicationDeadline: "June 30 (Annual)",
    datePosted: "2024-01-01"
  };

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
    <>
      <Helmet>
        <title>Chiedza CheAfrica Scholarship | Support African Students in Education</title>
        <meta
          name="description"
          content="Apply for Chiedza CheAfrica Scholarship - need-based educational support for African students in high school, vocational, and tertiary education focusing on aviation and STEM fields."
        />
        <meta
          name="keywords"
          content="Chiedza CheAfrica scholarship, African student scholarship, education funding Africa, aviation scholarship, STEM scholarship Africa, need-based scholarship, high school scholarship Africa"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta
          property="og:title"
          content="Chiedza CheAfrica Scholarship | Empowering Africa's Next Generation"
        />
        <meta
          property="og:description"
          content="Need-based scholarships for African students in high school, vocational, and tertiary education. Supporting aviation, STEM, and community impact."
        />
        <meta
          property="og:image"
          content="https://chiedzacheafrica.com/assets/images/scholarship-hero.jpg"
        />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={getCanonicalUrl()} />
        <meta
          name="twitter:title"
          content="Chiedza CheAfrica Scholarship"
        />
        <meta
          name="twitter:description"
          content="Educational support for African students in aviation, STEM, and community development."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        <link rel="canonical" href={getCanonicalUrl()} />
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <PageHero 
          title="Chiedza CheAfrica Scholarship"
          subtitle="Empowering Africa's next generation of innovators, aviators, and changemakers through need-based educational support."
          image={assets.hero1}
        />

        {/* Introduction Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 max-w-6xl mx-auto">
                {/* <Award className="w-12 h-12 text-primary mx-auto mb-4" /> */}
                <h2 className="text-white text-2xl font-light mb-4">
                  Potential Should Never Be Limited by Circumstance
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  The Chiedza CheAfrica Scholarship is a need-based initiative designed to provide 
                  educational assistance to deserving students across Africa who demonstrate financial 
                  need, academic dedication, leadership potential, and a passion for community impact.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Each year, we support learners at both high school and vocational or tertiary levels, 
                  with a focus on those pursuing aviation and STEM fields. Award amounts vary each year 
                  depending on available funds.
                </p>
              </div>
            </motion.div>

            {/* Scholarship Types */}
            <SectionHeader 
              subtitle="Educational Support"
              title="Scholarship Programs"
              icon={Award}
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-8 mb-16"
            >
              {scholarshipTypes.map((scholarship, index) => {
                const IconComponent = scholarship.icon;
                return (
                  <motion.div
                    key={scholarship.title}
                    variants={itemVariants}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="flex items-start mb-6">
                      <div className="bg-primary/20 w-14 h-14 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <IconComponent className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-xl font-light mb-1">{scholarship.title}</h3>
                        <p className="text-primary text-sm font-medium">{scholarship.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-grow">{scholarship.description}</p>

                    <div className="space-y-6 flex-grow">
                      <div>
                        <h4 className="text-white text-sm font-light mb-3">Support Covers:</h4>
                        <ul className="space-y-2">
                          {scholarship.support.map((item, idx) => (
                            <li key={idx} className="text-gray-300 text-sm flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white text-sm font-light mb-3">Eligibility:</h4>
                        <ul className="space-y-2">
                          {scholarship.eligibility.map((item, idx) => (
                            <li key={idx} className="text-gray-300 text-sm flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {scholarship.note && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                          <p className="text-primary text-sm italic">{scholarship.note}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Timeline Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SectionHeader 
                subtitle="Annual Cycle"
                title="Scholarship Timeline"
                icon={Calendar}
              />

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {timeline.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-white text-lg font-light mb-2">{item.period}</h3>
                      <p className="text-gray-300 text-sm">{item.event}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-300 text-sm mb-6">
                    Stay connected with us on social media or subscribe to our newsletter for updates 
                    on opening dates and eligibility requirements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => window.open("https://buymeacoffee.com/chiedzacheafrica", "_blank")}
                      className="flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors text-sm font-light"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Support the Scholarship Fund
                    </button>
                    <button
                      onClick={() => window.location.href = "/contact"}
                      className="flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-light"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us for Inquiries
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Application Information Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-start"
            >
              <SectionHeader 
                subtitle="How to Apply"
                title="Application Process"
                icon={Globe}
              />

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 text-left mb-8">
                  <div>
                    <h4 className="text-white text-sm font-light mb-4">When Applications Open:</h4>
                    <ul className="space-y-3">
                      <li className="text-gray-300 text-sm flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Complete the official Chiedza CheAfrica Scholarship Form
                      </li>
                      <li className="text-gray-300 text-sm flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Upload required supporting documents
                      </li>
                      <li className="text-gray-300 text-sm flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Include proof of enrollment
                      </li>
                      <li className="text-gray-300 text-sm flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Provide recommendation letters
                      </li>
                      <li className="text-gray-300 text-sm flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Submit personal statement
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-light mb-4">Application Link:</h4>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                      <p className="text-primary text-sm italic">
                        Available when the scholarship season opens (April – June)
                      </p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      For inquiries, email us at hello@chiedzacheafrica.com or visit www.chiedzacheafrica.com.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Support Fund Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-start"
            >
              <SectionHeader 
                subtitle="Make a Difference"
                title="Support the Scholarship Fund"
                icon={Heart}
              />

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 max-w-6xl mx-auto">
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  The Chiedza CheAfrica Scholarship Fund is powered by contributions from individuals 
                  and partners who share our vision of equal access to education. Your support helps 
                  more students pursue their dreams and gain the tools to build a better future.
                </p>
                <p className="text-primary text-sm font-light mb-8">
                  Every contribution — big or small — creates an opportunity for a deserving student to shine.
                </p>
                <button
                  onClick={() => window.open("https://buymeacoffee.com/chiedzacheafrica", "_blank")}
                  className="flex items-center justify-center mx-auto bg-primary text-white px-5 py-1.5 rounded-lg hover:bg-primary/80 transition-colors text-sm font-light"
                >
                  <Heart className="w-3 h-3 mr-2" />
                  Support the Scholarship Fund
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SupportUs Component Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <SupportUs />
          </div>
        </section>
      </main>
    </>
  );
};

export default Support;