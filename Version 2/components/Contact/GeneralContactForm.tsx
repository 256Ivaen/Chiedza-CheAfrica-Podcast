"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { assets } from '@/assets/assets';
import { Mail, Phone, Clock, Heart, MapPin } from 'lucide-react';

type SubmitStatus = 'success' | 'error' | null;

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const inquiryTypes = [
    'General Information',
    'Partnership Opportunity',
    'Media Inquiry',
    'Career Opportunities',
    'Service Information',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        inquiryType: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div 
          className="text-start mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-wider">Contact Us</p>
          <h2 className="text-2xl md:text-3xl font-semibold uppercase text-black">Get In Touch</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* FORM ON LEFT */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }} 
            viewport={{ once: true }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-full shadow-sm">
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-300 text-xs"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-300 text-xs"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-300 text-xs"
                        placeholder="+44 7508 863 433"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Organization</label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-300 text-xs"
                        placeholder="Enter your organization name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Inquiry Type *</label>
                    <div className="relative">
                      <select
                        name="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-300 text-xs appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-300 text-xs"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-300 text-xs resize-vertical"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                </div>
                <div className="text-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs font-medium min-w-full"
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Message'}
                  </motion.button>
                </div>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-lg text-center ${submitStatus === 'success'
                        ? 'bg-primary/5 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                      }`}
                  >
                    <p className="text-xs">
                      {submitStatus === 'success'
                        ? 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.'
                        : 'Something went wrong. Please try again or contact us directly.'}
                    </p>
                  </motion.div>
                )}
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500">
                    For professional referrals, please use our{' '}
                    <a href="/referral" className="text-primary hover:underline font-semibold">
                      dedicated referral form
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>

          {/* INFO CARD ON RIGHT WITH BACKGROUND IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl h-full overflow-hidden min-h-[600px] shadow-sm">
              {/* Background Image using Next.js Image */}
              <div className="absolute inset-0">
                <Image
                  src={assets.ContactForm}
                  alt="Contact Background"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center p-8 lg:p-10">
                <div className="text-left text-white max-w-md">
                  <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                      GET IN TOUCH
                    </p>
                    <h3 className="text-2xl md:text-3xl font-semibold uppercase text-white leading-tight">
                      Let&apos;s Start a Conversation
                    </h3>
                  </motion.div>
                  <motion.p className="text-sm text-white/95 mb-8 leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    Our team is ready to help you with information about our services, partnership opportunities, or general inquiries. We&apos;re here to support professionals and families alike.
                  </motion.p>
                  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">24/7 Availability</h4>
                        <p className="text-xs text-white/80">Round-the-clock support for urgent family matters and crises</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Community-Based</h4>
                        <p className="text-xs text-white/80">Working across communities with Local Authorities and partners</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Trauma-Informed</h4>
                        <p className="text-xs text-white/80">Every intervention guided by trauma-informed principles and care</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div className="mt-8 pt-6 border-t border-white/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-white" />
                        <span className="text-xs text-white/90">info@emergefamilysupport.co.uk</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-white" />
                        <span className="text-xs text-white/90">+44 7508 863 433</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactFormSection;