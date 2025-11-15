"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SharedHero from "../ui components/SharedHero";
import { assets } from "@/assets/assets";

const ContactHero: React.FC = () => {
  const router = useRouter();

  const handleReferralClick = () => {
    router.push('/referral');
  };

  return (
    <SharedHero
      image={assets.ContactUsHero}
      title="Contact Us"
      subtitle="Get in Touch with Emerge Family Support"
      description="We're here to answer your questions about our services, support options, and partnership opportunities. Whether you're a family seeking help or a professional looking to collaborate, we're ready to assist."
      buttonText="Make a Professional Referral"
      onButtonClick={handleReferralClick}
      imageAlt="Emerge Family Support - Contact Us"
      overlayOpacity={40}
      titleSize="lg"
      height="medium"
    />
  );
};

export default ContactHero;