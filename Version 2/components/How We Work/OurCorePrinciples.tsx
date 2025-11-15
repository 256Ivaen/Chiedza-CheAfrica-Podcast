"use client"
import React, { useEffect, useMemo, useState } from "react";
import Heading from "../ui components/Heading";
import { useRouter } from "next/navigation";

const INTRO_STYLE_ID = "principles-animations";

const palettes = {
  dark: {
    surface: "bg-white text-neutral-900",
    panel: "bg-primary",
    border: "border-white/10",
    heading: "text-white",
    muted: "text-white/80",
    iconRing: "border-white/20",
    iconSurface: "bg-white/5",
    icon: "text-white",
    shadow: "shadow-[0_36px_140px_-60px_rgba(10,10,10,0.95)]",
  },
};

const OurCorePrinciples = () => {
  const router = useRouter();

  const handleReferralClick = () => {
    router.push('/referral');
  };

  const principles = [
    {
      title: "Children First",
      description: "Every decision starts with the child's safety, voice, and long-term wellbeing. We ensure the child's perspective is central to all interventions and planning.",
    },
    {
      title: "Healing Relationships", 
      description: "We believe connection, not control, changes behaviour. Our approach focuses on building trust and strengthening family bonds through therapeutic relationships.",
    },
    {
      title: "Family Empowerment",
      description: "We build on strengths, not deficits. Families are supported to develop their own solutions and build resilience for sustainable long-term change.",
    },
    {
      title: "Early Help Intervention",
      description: "We intervene before crisis becomes removal. Proactive support prevents escalation and helps families stay together safely wherever possible.",
    },
    {
      title: "Cultural Humility",
      description: "We honour identity, heritage, and diverse ways of caring. Our team respects and incorporates cultural values into all assessment and support work.",
    }
  ];

  const [theme] = useState("dark");
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(INTRO_STYLE_ID)) return;
    
    const style = document.createElement("style");
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
      @keyframes principles-fade-up {
        0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
        60% { filter: blur(0); }
        100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
      }
      .principles-fade {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
        filter: blur(12px);
        transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
      }
      .principles-fade--ready {
        animation: principles-fade-up 860ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
      }
    `;

    document.head.appendChild(style);

    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  const palette = useMemo(() => palettes[theme], [theme]);

  const togglePrinciple = (index) => setActiveIndex((prev) => (prev === index ? -1 : index));

  useEffect(() => {
    if (typeof window === "undefined") {
      setHasEntered(true);
      return;
    }

    let timeout;
    const onLoad = () => {
      timeout = window.setTimeout(() => setHasEntered(true), 120);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section className={`w-full py-16 relative overflow-hidden transition-colors duration-700 ${palette.surface}`}>
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className={hasEntered ? "principles-fade--ready" : "principles-fade"}>
          <Heading 
            title="Our Core Principles"
            subtitle="Trauma-Informed, Relational & Strengths-Based Framework"
            showButton={false}
            buttonText="Make a Referral"
            onButtonClick={handleReferralClick}
          />
        </div>
        
        <ul className={`space-y-4 ${hasEntered ? "principles-fade--ready" : "principles-fade"}`}>
          {principles.map((principle, index) => {
            const open = activeIndex === index;
            const panelId = `principle-panel-${index}`;
            const buttonId = `principle-trigger-${index}`;

            return (
              <li
                key={principle.title}
                className={`group relative overflow-hidden rounded-xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5 ${palette.border} ${palette.panel} ${palette.shadow}`}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => togglePrinciple(index)}
                  className="relative flex w-full items-center gap-5 px-3 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/35"
                >
                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-105 ${palette.iconRing} ${palette.iconSurface}`}
                  >
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-full border opacity-30 ${palette.iconRing} ${open ? "animate-ping" : ""}`}
                    />
                    <svg
                      className={`relative h-4 w-4 transition-transform duration-500 ${palette.icon} ${open ? "rotate-45" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>

                  <div className="flex flex-1 flex-col gap-3">
                    <h2 className={`text-lg uppercase font-light leading-tight ${palette.heading}`}>
                      {principle.title}
                    </h2>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden text-xs leading-relaxed transition-[max-height] duration-500 ease-out ${
                        open ? "max-h-64" : "max-h-0"
                      } ${palette.muted}`}
                    >
                      <p className="pr-2">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default OurCorePrinciples;