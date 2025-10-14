// pages/ContactUs.jsx
import React, { useState } from "react";
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
  Heart
} from "lucide-react";
import { FaSpotify, FaTiktok } from "react-icons/fa";
import { assets } from "../assets/assets";
import PageHero from "../components/ui/Shared/PageHero";
import SectionHeader from "../components/ui/Shared/SectionHeader";
import CTA from "../components/ui/Shared/CTA";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "hello@chiedzacheafrica.com",
      link: "mailto:hello@chiedzacheafrica.com"
    },
    {
      icon: MessageCircle,
      title: "Collaborate",
      description: "Share your story with us",
      contact: "Share Your Journey",
      link: "/share-story"
    },
    {
      icon: Users,
      title: "Partner With Us",
      description: "For sponsorships and partnerships",
      contact: "partnerships@chiedzacheafrica.com",
      link: "mailto:partnerships@chiedzacheafrica.com"
    }
  ];

  const socialLinks = [
    {
      name: "YouTube",
      url: "https://youtube.com/@chiedzacheafrica",
      icon: Youtube,
      color: "hover:text-red-500"
    },
    {
      name: "Spotify", 
      url: "https://open.spotify.com/show/5YBekTisDE8CawmkxGiesr",
      icon: FaSpotify,
      color: "hover:text-green-400"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/chiedzacheafrica",
      icon: Instagram,
      color: "hover:text-pink-500"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/16Mf6x5vw3/",
      icon: Facebook,
      color: "hover:text-blue-500"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@chiedzacheafrica",
      icon: FaTiktok,
      color: "hover:text-black"
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
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
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={method.title}
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center hover:bg-white/10 transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/30 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-white text-sm font-light mb-2">{method.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{method.description}</p>
                  <a 
                    href={method.link}
                    className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                  >
                    {method.contact}
                  </a>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Form & Info Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-6">
                <Send className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-white text-lg font-light">Send Us a Message</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 text-sm font-light mb-2">
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
                    <label htmlFor="email" className="block text-gray-300 text-sm font-light mb-2">
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
                  <label htmlFor="subject" className="block text-gray-300 text-sm font-light mb-2">
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
                    <option value="">Select a subject</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="story-submission">Story Submission</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="volunteer">Volunteer Opportunity</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-300 text-sm font-light mb-2">
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
                
                <motion.button
                  type="submit"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-light text-sm hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-6">
                <MessageCircle className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-white text-lg font-light">Connect With Us</h3>
              </div>

              <div className="space-y-6">
                {/* Response Time */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-primary mr-2" />
                    <span className="text-white text-sm font-medium">Response Time</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    We typically respond to all inquiries within 24-48 hours. For urgent matters, 
                    please mention "URGENT" in your subject line.
                  </p>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-white text-sm font-light mb-4">Follow Our Journey</h4>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-white/70 ${social.color} transition-all duration-300 p-3 rounded-lg hover:bg-white/5`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-light">{social.name}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Mail className="w-4 h-4 text-primary mr-2" />
                    <h4 className="text-white text-sm font-light">Stay Updated</h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Subscribe to our newsletter for new episode alerts and community updates.
                  </p>
                  <motion.button
                    onClick={() => window.location.href = "/newsletter"}
                    className="bg-white/10 text-white px-6 py-2 rounded-full font-light text-sm hover:bg-white/20 transition-all duration-300 border border-white/20 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe to Newsletter
                  </motion.button>
                </div>

                {/* Support Section */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Heart className="w-4 h-4 text-primary mr-2" />
                    <h4 className="text-white text-sm font-light">Support Our Mission</h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Love what we do? Consider supporting our podcast to help us continue 
                    amplifying African stories.
                  </p>
                  <motion.button
                    onClick={() => window.location.href = "/support"}
                    className="bg-primary text-white px-6 py-2 rounded-full font-light text-sm hover:bg-primary/90 transition-all duration-300 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Support Chiedza CheAfrica
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA
        title="Ready to Share Your Story?"
        subtitle="Whether you're a pilot breaking barriers, an innovator shaping the future, or a community leader making a difference, your story deserves to be heard."
        primaryButton={{
          text: "Share Your Story",
          onClick: () => window.location.href = "/share-story"
        }}
        secondaryButton={{
          text: "Listen to Stories", 
          onClick: () => window.location.href = "/episodes"
        }}
      />
    </div>
  );
};

export default ContactUs;