import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  Clock,
  Users,
  MessageCircle,
  Youtube,
  Instagram,
  Facebook,
  Heart,
} from "lucide-react";
import { FaSpotify, FaTiktok } from "react-icons/fa";
import { assets } from "../assets/assets";
import PageHero from "../components/ui/Shared/PageHero";
import SectionHeader from "../components/ui/Shared/SectionHeader";
import CTA from "../components/ui/Shared/CTA";

const ContactUs = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "hello@chiedzacheafrica.com",
      link: "mailto:hello@chiedzacheafrica.com",
    },
    {
      icon: MessageCircle,
      title: "Collaborate",
      description: "Share your story with us",
      contact: "Share Your Journey",
      link: "#contact-form",
    }
  ];

  const socialLinks = [
    {
      name: "YouTube",
      url: "https://youtube.com/@chiedzacheafrica",
      icon: Youtube,
      color: "hover:text-red-500",
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/show/5YBekTisDE8CawmkxGiesr",
      icon: FaSpotify,
      color: "hover:text-green-400",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/chiedzacheafrica",
      icon: Instagram,
      color: "hover:text-pink-500",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/16Mf6x5vw3/",
      icon: Facebook,
      color: "hover:text-blue-500",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@chiedzacheafrica",
      icon: FaTiktok,
      color: "hover:text-black",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Add your form submission logic here
      // const response = await post('contact', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <title>Contact Us - Chiedza CheAfrica Podcast | Get In Touch</title>
        <meta
          name="description"
          content="Connect with Chiedza CheAfrica Podcast. Share your story, collaborate, or get in touch with us. We'd love to hear from you!"
        />
        <link rel="canonical" href={getCanonicalUrl()} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta
          property="og:title"
          content="Contact Us - Chiedza CheAfrica Podcast"
        />
        <meta
          property="og:description"
          content="Get in touch with Chiedza CheAfrica. Share your story or collaborate with us."
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <PageHero
          title="Get In Touch"
          subtitle="Let's connect and amplify African stories together"
          image={assets.hero1}
        />

        {/* Contact Methods Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              subtitle="How to Reach Us"
              title="Contact Methods"
              icon={MessageCircle}
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-8 mb-16"
            >
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <motion.a
                    key={method.title}
                    href={method.link}
                    variants={itemVariants}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center hover:bg-white/10 transition-all duration-300 group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-white text-base font-normal mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-300 text-xs mb-4 font-light">
                      {method.description}
                    </p>
                    <span className="text-primary text-sm font-normal hover:text-primary/80 transition-colors">
                      {method.contact}
                    </span>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Contact Form & Image Grid */}
            <motion.div
              id="contact-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-12 mb-16"
            >
              {/* Contact Form */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center mb-6">
                  <h3 className="text-white text-xl font-light">
                    Send Us a Message
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-300 text-sm font-light mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-300 text-sm font-light mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-300 text-sm font-light mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="" className="bg-gray-900">
                        Select a subject
                      </option>
                      <option value="collaboration" className="bg-gray-900">
                        Collaboration
                      </option>
                      <option value="story-submission" className="bg-gray-900">
                        Story Submission
                      </option>
                      <option value="sponsorship" className="bg-gray-900">
                        Sponsorship
                      </option>
                      <option value="volunteer" className="bg-gray-900">
                        Volunteer Opportunity
                      </option>
                      <option value="general" className="bg-gray-900">
                        General Inquiry
                      </option>
                      <option value="technical" className="bg-gray-900">
                        Technical Support
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-300 text-sm font-light mb-2"
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us about your story, collaboration idea, or how we can work together..."
                    />
                  </div>

                  {/* Submit Status Messages */}
                  {submitStatus === "success" && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-sm">
                      Thank you! Your message has been sent successfully. We'll
                      get back to you soon.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                      Something went wrong. Please try again or email us
                      directly.
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-3 rounded-full font-normal text-sm hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Image Card */}
              <motion.div variants={itemVariants}>
                <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden">
                  <img
                    src={assets.hero1}
                    alt="Chiedza CheAfrica Team"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Content on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 gap-5">
                    <h3 className="text-white text-2xl font-light mb-2">
                      Let's Connect
                    </h3>
                    <p className="text-gray-200 text-sm font-light">
                      We're here to listen, collaborate, and amplify your story.
                    </p>

                    <p className="text-gray-200 text-sm font-light mt-2">
                      We typically respond to all inquiries within 24-48 hours.
                      For urgent matters, please mention "URGENT" in your
                      subject line.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Connect With Us Section - Below Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center mb-8">
                <MessageCircle className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-white text-2xl font-light">
                  Connect With Us
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Newsletter Signup */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white/5 border border-white/10 rounded-lg p-6"
                >
                  <div className="flex items-center mb-3">
                    <Mail className="w-5 h-5 text-primary mr-2" />
                    <h4 className="text-white text-base font-normal">
                      Stay Updated
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 font-light leading-relaxed">
                    Subscribe to our newsletter for new episode alerts and
                    community updates.
                  </p>
                  <motion.button
                    onClick={() => (window.location.href = "/newsletter")}
                    className="bg-white/10 text-white px-6 py-2 rounded-full font-light text-sm hover:bg-white/20 transition-all duration-300 border border-white/20 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe to Newsletter
                  </motion.button>
                </motion.div>

                {/* Support Section */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white/5 border border-white/10 rounded-lg p-6"
                >
                  <div className="flex items-center mb-3">
                    <Heart className="w-5 h-5 text-primary mr-2" />
                    <h4 className="text-white text-base font-normal">
                      Support Our Mission
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 font-light leading-relaxed">
                    Love what we do? Consider supporting our podcast to help us
                    continue amplifying African stories.
                  </p>
                  <motion.button
                    onClick={() =>
                      window.open(
                        "https://buymeacoffee.com/chiedzacheafrica",
                        "_blank"
                      )
                    }
                    className="bg-primary text-white px-6 py-2 rounded-full font-normal text-sm hover:bg-primary/90 transition-all duration-300 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Support Chiedza CheAfrica
                  </motion.button>
                </motion.div>
              </div>

              {/* Social Media - Full Width Below */}
              <motion.div variants={itemVariants} className="mt-8">
                <h4 className="text-white text-lg font-normal mb-6">
                  Follow Our Journey
                </h4>
                <div className="flex flex-wrap gap-4 justify-start">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-white/70 ${social.color} transition-all duration-300 p-4 rounded-lg hover:bg-white/5 border border-white/10`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="w-6 h-6" />
                        <span className="text-sm font-light">
                          {social.name}
                        </span>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;
