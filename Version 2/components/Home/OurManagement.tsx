"use client";

import React from "react";
import Image from "next/image";
import { assets } from "../../assets/assets";

const OurManagement = () => {
  return (
    <div className="min-h-fit py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-light uppercase text-start text-primary">
              Our Management
            </h1>
            <h1 className="text-sm font-light uppercase text-start text-primary">
              Expert Leadership & Governance
            </h1>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto">
          <div className="overflow-hidden rounded-xl bg-primary text-white flex flex-col lg:flex-row">
            <div className="lg:w-1/3 w-full relative overflow-hidden order-2 lg:order-1">
              <div className="w-full h-48 lg:h-full relative">
                <Image
                  src={assets.OurManagement}
                  alt="Our Management Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>

            <div className="lg:w-2/3 w-full p-6 lg:p-8 flex flex-col justify-center order-1 lg:order-2">
              <div>
                <p className="text-xs font-semibold text-white/90">Our Management</p>
                <h2 className="mt-1 text-2xl lg:text-3xl font-light tracking-tight text-white">
                  Experienced Leadership & Governance
                </h2>
                <div className="mt-4 text-white/90 text-xs leading-relaxed space-y-4">
                  <p>
                    Our leadership team brings together experienced Social Workers, Family Practitioners, 
                    and Therapeutic Coordinators. They provide clinical supervision, reflective practice, 
                    and real-time oversight on all cases.
                  </p>
                  <p>
                    We combine governance with heart—blending statutory social-work standards with 
                    relational, trauma-aware practice that meets families where they are.
                  </p>
                  <p>
                    Reports are provided daily or weekly depending on need, ensuring transparency and 
                    accountability to Local Authorities and commissioning partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurManagement;