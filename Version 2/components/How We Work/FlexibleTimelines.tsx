"use client"
import React from "react";
import Heading from "../ui components/Heading";
import { useRouter } from "next/navigation";

const FlexibleTimelines = () => {
  const router = useRouter();

  const handleReferralClick = () => {
    router.push('/referral');
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Left Aligned */}
        <div className="mb-12">
          <Heading 
            title="Flexible Intervention Timelines"
            subtitle="Intervention duration is flexible — from short-term (8-12 weeks) to longer-term wrap-around programmes (6-12 months)"
            showButton={false}
            buttonText="Make a Referral"
            onButtonClick={handleReferralClick}
          />
        </div>

        {/* Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Short-term */}
          <div className="bg-primary text-white rounded-lg p-6 border border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <div className="inline-block bg-white/20 rounded-full px-4 py-1 mb-4">
              <span className="text-sm font-semibold text-white">8-12 Weeks</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Short-Term</h3>
            <p className="text-white/80 text-xs">
              Focused interventions for immediate crisis support and early help
            </p>
          </div>

          {/* Medium-term */}
          <div className="bg-primary text-white rounded-lg p-6 border border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <div className="inline-block bg-white/20 rounded-full px-4 py-1 mb-4">
              <span className="text-sm font-semibold text-white">3-6 Months</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Medium-Term</h3>
            <p className="text-white/80 text-xs">
              Structured support for families requiring deeper therapeutic work
            </p>
          </div>

          {/* Long-term */}
          <div className="bg-primary text-white rounded-lg p-6 border border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <div className="inline-block bg-white/20 rounded-full px-4 py-1 mb-4">
              <span className="text-sm font-semibold text-white">6-12 Months</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Long-Term</h3>
            <p className="text-white/80 text-xs">
              Comprehensive wraparound programmes for sustained family transformation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlexibleTimelines;