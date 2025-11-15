"use client";

import React, { useState } from "react";
import { ChevronDown, PhoneCall } from "lucide-react";

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      q: "How long does the referral process take?",
      a: "We screen referrals within 24 hours and arrange an Initial Consultation. A Social Worker then conducts an assessment and co-creates a Family Support Plan. Delivery begins within 3-5 working days, with urgent cases mobilised same-day."
    },
    {
      q: "What types of family assessments do you offer?",
      a: "We offer comprehensive assessments including Reverse Parenting (24/7 community-based), PAMs Assessment for learning disabilities, ParentAssess for cognitive needs, CUBAS Assessment, Viability & Kinship Assessments, Fostering & Adoption Assessments, Pre-Birth Assessments, and Specialist Risk Assessments."
    },
    {
      q: "Do you provide therapeutic services?",
      a: "Yes, we integrate therapy within family work including Restorative & Solution-Focused Interventions, Life Story & Identity Work, Play-based & Creative Therapies, Family Group Conferencing, and Advocacy & Independent Visitor Services."
    },
    {
      q: "What support do you offer for children with disabilities?",
      a: "Our Short Breaks and Disability Support teams provide specialist care including structured activity programmes, 1:1 and 2:1 support tailored to sensory/behavioural needs, outreach and in-home support, and 24-hour availability for complex care scenarios."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-fit py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div className="flex gap-2 flex-col">
                <h4 className="text-3xl md:text-4xl tracking-tighter max-w-xl text-left font-regular text-gray-900">
                  Your family support questions answered
                </h4>
                <p className="text-xs max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-gray-600 text-left">
                  Get clear answers about our family assessment process, therapeutic support services, 
                  and how we help families achieve stability and healing.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-gray-600">Social-work-led, trauma-informed practice</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-gray-600">24/7 availability for urgent cases</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-gray-600">Therapeutic oversight in every intervention</span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border-b border-gray-200 last:border-b-0 transition-colors hover:border-primary"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex items-center justify-between w-full py-6 px-6 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-900 pr-4 leading-relaxed">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        openItems.includes(index) ? "rotate-180" : ""
                      }`} 
                    />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openItems.includes(index) 
                        ? "max-h-96 opacity-100 pb-6" 
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}