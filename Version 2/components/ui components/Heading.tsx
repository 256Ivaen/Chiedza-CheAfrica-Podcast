"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface HeadingProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
  onButtonClick?: () => void;
}

const Heading: React.FC<HeadingProps> = ({ 
  title, 
  subtitle, 
  buttonText = "Contact Us", 
  buttonLink,
  showButton = false,
  onButtonClick
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonLink) {
      router.push(buttonLink);
    }
  };

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-3xl font-light uppercase text-start text-primary">
          {title}
        </h1>
        <h1 className="text-sm font-light uppercase text-start text-primary">
          {subtitle}
        </h1>
      </div>

      {showButton && (
        <div className="group inline-block">
          <button 
            onClick={handleButtonClick}
            className="text-xs uppercase bg-primary py-2 px-5 rounded-full text-white border border-transparent transition-all duration-300 ease-in-out group-hover:bg-transparent group-hover:text-primary group-hover:border-primary"
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default Heading;