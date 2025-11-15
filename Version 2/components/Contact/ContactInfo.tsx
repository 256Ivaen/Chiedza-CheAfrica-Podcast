'use client'

import React from "react";
import { Mail, Phone, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light uppercase text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            We operate 24/7 across the community, working alongside Local Authorities, 
            Health, and Education partners to bring stability, healing, and hope to families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email */}
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-sm text-gray-600">info@emergefamilysupport.co.uk</p>
            <p className="text-xs text-gray-500 mt-2">General inquiries & information</p>
          </div>

          {/* Phone */}
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-sm text-gray-600">07508 863 433</p>
            <p className="text-xs text-gray-500 mt-2">24/7 availability for urgent matters</p>
          </div>

          {/* Service Hours */}
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Hours</h3>
            <p className="text-sm text-gray-600">24/7 Support</p>
            <p className="text-xs text-gray-500 mt-2">Community-based interventions</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm italic max-w-3xl mx-auto">
            &quot;At Emerge, we believe every child deserves a stable, loving environment — 
            and every parent deserves the tools to make that possible.&quot;
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;