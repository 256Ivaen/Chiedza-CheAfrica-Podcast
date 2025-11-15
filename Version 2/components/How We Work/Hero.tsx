"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SharedHero from "../ui components/SharedHero";
import { assets } from "@/assets/assets";

const HowWeWorkHero: React.FC = () => {
  const router = useRouter();

  const handleReferralClick = () => {
    router.push('/referral');
  };

  return (
    <SharedHero
      image={assets.HowWeWork}
      title="How We Work"
      subtitle="Our Process for Supporting Families"
      description="A clear, structured approach from initial referral to sustainable outcomes. We work transparently with families and professionals to deliver trauma-informed, evidence-based support that creates lasting change."
      buttonText="Make a Referral"
      onButtonClick={handleReferralClick}
      imageAlt="Emerge Family Support - How We Work Process"
      overlayOpacity={40}
      titleSize="lg"
      height="medium"
    />
  );
};

export default HowWeWorkHero;