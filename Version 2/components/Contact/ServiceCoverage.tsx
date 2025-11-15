'use client'

import React from "react";
import { MapPin, Users, Heart } from "lucide-react";

const ServiceCoverage = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light uppercase text-white mb-4">
            Our Service Coverage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Community-Based</h3>
            <p className="text-white/80 text-sm">
              We operate 24/7 across the community, working in family homes and local settings to provide support where it&apos;s needed most.
            </p>
          </div>

          <div className="text-center">
            <Users className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Multi-Agency</h3>
            <p className="text-white/80 text-sm">
              Working alongside Local Authorities, Health, and Education partners to bring coordinated, effective support to families.
            </p>
          </div>

          <div className="text-center">
            <Heart className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Trauma-Informed</h3>
            <p className="text-white/80 text-sm">
              Every intervention is guided by trauma-informed principles, ensuring care, safety, and empowerment are always at the centre.
            </p>
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-white/20">
          <p className="text-white/80 text-sm">
            Response times: General inquiries within 48 hours • Urgent matters: Immediate attention
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceCoverage;