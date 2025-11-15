"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { assets } from "@/assets/assets";

export interface ServicesIntroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  className?: string;
}

export function ServicesIntroCard(props: ServicesIntroProps) {
  const {
    title = "Our Comprehensive Services",
    subtitle = "Specialist Family Support & Therapeutic Interventions",
    description = "Emerge Family Support provides social-work-led, trauma-informed services designed to strengthen families, reduce risk, and prevent escalation into statutory care.\n\nWe offer comprehensive family assessments, therapeutic interventions, disability support, and auxiliary services that operate 24/7 across the community.\n\nOur evidence-based approaches include specialized parenting assessments, therapeutic programmes, and practical support services that bring stability, healing, and hope to families in crisis or transition.\n\nEvery service is overseen by qualified social workers, therapists, and project managers, ensuring bespoke support plans and wraparound care for each family.",
    imageUrl = assets.ServiceCard,
    className,
  } = props;

  return (
    <div className={cn("w-full max-w-7xl px-4 sm:px-6 mx-auto py-10", className)}>
      {/* Desktop */}
      <div className='hidden md:flex items-center gap-12'>
        {/* Square Image - Left Side */}
        <div className='w-[470px] h-[470px] rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center'>
          <Image
            src={imageUrl}
            alt={title}
            width={470}
            height={470}
            className='w-full h-full object-cover'
            draggable={false}
            priority
          />
        </div>
        
        {/* Content - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className='flex-1 max-w-2xl'
        >
          <div className='mb-6'>
            <h2 className='text-xl font-light text-gray-900 mb-1'>
              {title}
            </h2>

            <p className='text-xs font-medium text-gray-600'>
              {subtitle}
            </p>
          </div>

          <div className="text-gray-900 text-xs leading-relaxed mb-8 space-y-4">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <Link 
              href="/contact"
              className="bg-primary text-white px-5 py-1.5 rounded-full text-xs uppercase font-normal hover:bg-primary/90 transition-colors inline-block"
            >
              Make a Referral
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='md:hidden max-w-sm mx-auto text-start bg-transparent'
      >
        <div className='w-full aspect-square rounded-xl overflow-hidden mb-6 flex items-center justify-center'>
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={400}
            className='w-full h-full object-cover'
            draggable={false}
            priority
          />
        </div>

        <div className='px-4'>
          <h2 className='text-xl font-light text-gray-900 mb-2'>
            {title}
          </h2>

          <p className='text-xs font-medium text-gray-600 mb-4'>
            {subtitle}
          </p>

          <div className="text-gray-900 text-xs leading-relaxed mb-6 space-y-4">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mb-6">
            <Link 
              href="/contact"
              className="bg-primary text-white px-5 py-1.5 rounded-full text-xs uppercase font-light hover:bg-primary/90 transition-colors inline-block"
            >
              Make a Referral
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ServicesIntroSection() {
  return (
    <div className="min-h-fit py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-light uppercase text-start text-primary">
              Our Services
            </h1>
            <h1 className="text-sm font-light uppercase text-start text-primary">
              Comprehensive Family Support & Therapeutic Solutions
            </h1>
          </div>

          <div className="group inline-block hidden md:block">
            <Link href="/services#all-services">
              <button className="text-xs uppercase bg-primary py-2 px-5 rounded-full text-white border border-transparent transition-all duration-300 ease-in-out group-hover:bg-transparent group-hover:text-primary group-hover:border-primary">
                View All Services
              </button>
            </Link>
          </div>
        </div>

        <ServicesIntroCard />
      </div>
    </div>
  );
}

export default ServicesIntroSection;