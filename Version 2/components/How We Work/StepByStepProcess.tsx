"use client"
import Image from "next/image";
import Heading from "../ui components/Heading";
import { useRouter } from "next/navigation";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { assets } from "@/assets/assets";

const StepByStepProcess = () => {
  const router = useRouter();

  const handleReferralClick = () => {
    router.push('/referral');
  };

  const steps = [
    {
      id: "1",
      title: "Referral & Initial Contact",
      description: "A referral is made by Local Authority, Health, Education, or a family themselves. We respond within 24 hours to discuss needs and suitability.",
      status: "completed",
    },
    {
      id: "2",
      title: "Assessment & Planning",
      description: "Our team conducts a comprehensive assessment of family needs, strengths, and risks. We co-create a bespoke intervention plan with clear outcomes.",
      status: "completed",
    },
    {
      id: "3",
      title: "Intervention & Support",
      description: "Qualified social workers, therapists, and project managers deliver evidence-based, trauma-informed interventions. Families receive wraparound support tailored to their timeline (8 weeks to 12 months).",
      status: "active",
    },
    {
      id: "4",
      title: "Monitoring & Review",
      description: "Progress is tracked through regular reviews, with reports provided daily or weekly. We ensure transparency, accountability, and continuous improvement throughout the intervention.",
      status: "pending",
    },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "border-primary bg-primary text-white";
      case "active":
        return "border-primary bg-white text-primary animate-pulse";
      case "pending":
        return "border-gray-300 bg-white text-gray-400";
      default:
        return "border-gray-300 bg-white text-gray-400";
    }
  };

  const getConnectorStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary";
      case "active":
        return "bg-primary";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Heading 
            title="Our Step-by-Step Process"
            subtitle="From referral to ongoing support — every family receives a bespoke plan, evidence-based monitoring, and wraparound support"
            showButton={false}
            buttonText="Make a Referral"
            onButtonClick={handleReferralClick}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="hidden lg:block w-[470px] h-[470px] rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src={assets.StepByStep}
              alt="Step-by-Step Process"
              width={470}
              height={470}
              className="w-full h-full object-cover"
              draggable={false}
              priority
            />
          </div>

          <div className="flex-1 relative flex flex-col gap-8">
            {steps.map((step, index) => {
              return (
                <div key={step.id} className="relative flex gap-6">
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-3 top-9 h-full w-px",
                        getConnectorStyles(step.status)
                      )}
                    />
                  )}

                  <div className="relative z-10 flex shrink-0">
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                        getStatusStyles(step.status)
                      )}
                    >
                      {step.status === "completed" ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      ) : (
                        <Circle className="h-2 w-2 fill-current" />
                      )}
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2 pb-6">
                    <h3 className="text-lg font-light leading-tight text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepByStepProcess;