"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SharedHero from "../ui components/SharedHero";
import { assets } from "@/assets/assets";

const ReferralHero: React.FC = () => {
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/contact');
  };

  return (
    <SharedHero
      image={assets.Reffer}
      title="Make a Referral"
      subtitle="Professional Referral Portal"
      description="Emerge accepts referrals from Local Authority Children's Services, Education and Health professionals, Youth Justice and Probation teams, and Voluntary/Community sector partners."
      buttonText="Contact for General Inquiries"
      onButtonClick={handleContactClick}
      imageAlt="Emerge Family Support - Professional Referrals"
      overlayOpacity={40}
      titleSize="lg"
      height="medium"
    />
  );
};

export default ReferralHero;