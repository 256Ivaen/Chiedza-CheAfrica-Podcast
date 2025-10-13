"use client";
import React from "react";
import { motion } from "framer-motion";
import { PinContainer } from "../ui/3d-pin";

export function Location() {
  // Animation variants copied from About component
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const locations = [
    {
      id: 1,
      title: "United Kingdom",
      address: [
        "2nd Floor, Mansion House",
        "41 Guildhall Lane, Leicester LE1 5FQ"
      ],
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.836269538482!2d36.80766777350048!3d-1.271267535606815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877610f7f1da765%3A0x418f89bb260c8d84!2sMansion%20House!5e0!3m2!1sen!2sug!4v1748617284307!5m2!1sen!2sug",
      href: "https://maps.google.com/maps?q=Mansion+House+Leicester",
      country: "uk"
    },
    {
      id: 2,
      title: "Uganda",
      address: [
        "Plot 19 Binayomba Road",
        "Bugolobi, Kampala - Uganda"
      ],
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.5582762106337!2d32.62044171777208!3d0.30811696877380085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbdfbc2cb0ad3%3A0xddd0f9bae612240!2sTek%20Juice!5e0!3m2!1sen!2sug!4v1748616759333!5m2!1sen!2sug",
      href: "https://maps.google.com/maps?q=Tek+Juice+Kampala",
      country: "uganda"
    },
    {
      id: 3,
      title: "Rwanda",
      address: [
        "1st Floor, Tele10 Building, 3 KG 230 ST",
        "Remera, Gasabo, Kigali, Rwanda"
      ],
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d498.43745433661593!2d30.10269099554574!3d-1.9534533395965081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6fa26ac6c41%3A0x1b146f1d0deebf00!2sTele-10%20Group!5e0!3m2!1sen!2sug!4v1748616977526!5m2!1sen!2sug",
      href: "https://maps.google.com/maps?q=Tele10+Building+Kigali",
      country: "rwanda"
    },
    {
      id: 4,
      title: "Kenya",
      address: [
        "6th floor-Room 621 Pramukh Towers",
        "PRH6+F3X, Westlands Rd, Nairobi"
      ],
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.836269538482!2d36.80766777350048!3d-1.271267535606815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17ab9bbcf071%3A0x13cbecdabe1ef902!2sPramukh%20Tower!5e0!3m2!1sen!2sug!4v1748617188364!5m2!1sen!2sug",
      href: "https://maps.google.com/maps?q=Pramukh+Towers+Nairobi",
      country: "kenya"
    }
  ];

  return (
    <motion.section 
      className="w-full bg-black py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-start mb-6"
          variants={fadeInUp}
        >
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-wider">
            Find us
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold uppercase text-white">
            Our Locations
          </h2>
        </motion.div>

        {/* Locations Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto place-items-center"
          variants={fadeInUp}
        >
          {locations.map((location) => (
            <div key={location.id} className="w-full max-w-sm flex justify-center">
              <PinContainer
                title={
                  <div className="flex items-center space-x-2">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-900"
                    >
                      <path 
                        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-gray-900 uppercase text-xs font-semibold">{location.title}</span>
                  </div>
                }
                href={location.href}
                containerClassName="w-full"
              >
                <div className="flex basis-full flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[22rem]">
                  {/* Location Title */}
                  <h3 className="max-w-xs !pb-3 !m-0 font-semibold text-xl uppercase text-white z-10 relative">
                    {location.title}
                  </h3>
                  
                  {/* Address */}
                  <div className="text-sm !m-0 !p-0 font-normal mb-4 z-10 relative">
                    <div className="text-white space-y-1">
                      {location.address.map((line, index) => (
                        <div key={index} className="text-xs leading-relaxed">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Map Background */}
                  <div className="flex flex-1 w-full rounded-lg mt-5 relative overflow-hidden">
                    <iframe
                      src={location.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      title={`${location.title} Location`}
                    />
                    {/* Overlay for better text readability */}
                    {/* <div className="absolute inset-0 bg-orange-900/20 rounded-lg pointer-events-none" /> */}
                  </div>
                </div>
              </PinContainer>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}