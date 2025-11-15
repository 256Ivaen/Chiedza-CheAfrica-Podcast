'use client'

import React from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";

interface ProcessCTASectionProps {
  inView?: boolean;
}

const ProcessCTASection = ({ }: ProcessCTASectionProps) => {
  const router = useRouter();

  const handleReferralClick = () => {
    router.push('/referral');
  };

  return (
    <section className="py-10">
      <div className="mx-auto">
        <div className="bg-primary pt-12">
          <div className="flex flex-col lg:flex-row-reverse gap-8 px-4 sm:px-6 lg:gap-12 max-w-7xl mx-auto items-start">
            <div className="hidden lg:block w-full lg:w-auto flex justify-center lg:justify-end">
              <div className="space-y-8 lg:h-[300px] lg:overflow-hidden">
                <Image
                  src={assets.CTAImg} 
                  alt="Emerge Family Support - Start Your Referral"
                  width={300}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            <div className="space-y-6 flex-1 px-4 sm:px-6 lg:px-0 pb-12">
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-relaxed max-w-2xl">
                  Ready to Make a Referral?
                </h3>
              </div>

              <p className="text-sm sm:text-xs leading-relaxed max-w-2xl text-white/90">
                Emerge accepts referrals from Local Authority Children&apos;s Services, Education and Health professionals, Youth Justice and Probation teams, and Voluntary/Community sector partners. We screen within 24 hours and begin delivery within 3-5 working days.
              </p>

              <div className="pt-4">
                <button 
                  onClick={handleReferralClick}
                  className="bg-white text-primary px-6 py-1.5 text-xs uppercase rounded-full font-semibold transition-colors hover:bg-gray-100"
                >
                  Submit Referral Form
                </button>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-white/20">
                <div className="flex flex-col sm:flex-row gap-4 text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>info@emergefamilysupport.co.uk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>07508 863 433</span>
                  </div>
                </div>
                <p className="text-white/60 text-xs italic mt-2">
                  &quot;At Emerge, we believe every child deserves a stable, loving environment — and every parent deserves the tools to make that possible.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessCTASection;