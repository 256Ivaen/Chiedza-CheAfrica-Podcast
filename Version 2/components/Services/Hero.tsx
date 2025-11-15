"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SharedHero from "../ui components/SharedHero";
import { assets } from "@/assets/assets";

const ServicesHero: React.FC = () => {
  const router = useRouter();

  const handleReferralClick = () => {
    router.push('/referral');
  };

  return (
    <SharedHero
      image={assets.Hero1}
      title="Our Services"
      subtitle="Comprehensive Family Support & Therapeutic Services"
      description="Specialist social-work-led services designed to strengthen families, reduce risk, and provide trauma-informed support. From parenting assessments to therapeutic interventions and disability support."
      buttonText="Make a Referral"
      onButtonClick={handleReferralClick}
      imageAlt="Emerge Family Support Services - Comprehensive Family Support"
      overlayOpacity={40}
      titleSize="lg"
      height="medium"
    />
  );
};

export default ServicesHero;