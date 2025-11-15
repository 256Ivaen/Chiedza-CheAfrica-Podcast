'use client'
import React from "react";
import { Users, Building, Shield, Heart } from "lucide-react";

const AcceptedReferrals = () => {
  const referralSources = [
    {
      icon: Building,
      title: "Local Authority Children's Services",
      description: "Social work teams and child protection services"
    },
    {
      icon: Users,
      title: "Education and Health professionals",
      description: "Schools, NHS teams, and healthcare providers"
    },
    {
      icon: Shield,
      title: "Youth Justice and Probation teams",
      description: "Youth offending teams and probation services"
    },
    {
      icon: Heart,
      title: "Voluntary/Community sector partners",
      description: "Community organizations and voluntary services"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-light uppercase text-primary mb-2">
            Accepted Referrals
          </h2>
          <p className="text-xs text-gray-600">
            Emerge accepts referrals from the following professional sources:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {referralSources.map((source, index) => (
            <div 
              key={index} 
              className="bg-primary text-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <source.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {source.title}
              </h3>
              <p className="text-xs text-white/80">
                {source.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcceptedReferrals;