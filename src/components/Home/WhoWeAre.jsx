import React from 'react';
import { motion } from "framer-motion";

const WhoWeAre = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Content Grid - Two Columns Only */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Image */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >
            <img
              src="/assets/images/who-we-are.jpg"
              alt="Chiedza CheAfrica"
              className="w-full h-auto object-contain rounded-3xl"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-4">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-normal text-white mb-6">
                WHO WE ARE
              </h2>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  At <span className="text-primary font-normal">Chiedza CheAfrica</span>, we believe every story carries light — 
                  <span className="italic"> "Chiedza"</span> means light in Shona.
                </p>
                
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  We are storytellers, dreamers, and changemakers passionate about showcasing the brilliance 
                  of Africa and its people to the world.
                </p>
                
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Our mission is to <span className="text-white font-normal">educate, empower, and connect</span> — 
                  through conversations that spark curiosity, hope, and action.
                </p>
              </div>

              {/* We Champion Section */}
              <div className="pt-4">
                <h3 className="text-base font-normal text-white mb-3">
                  We champion:
                </h3>
                <ul className="space-y-2">
                  <li className="text-xs text-gray-300 font-light leading-relaxed pl-4 relative">
                    <span className="absolute left-0 text-primary">•</span>
                    <span className="font-normal text-white">Aviation & STEM Pathways</span> – inspiring the next generation of innovators.
                  </li>
                  <li className="text-xs text-gray-300 font-light leading-relaxed pl-4 relative">
                    <span className="absolute left-0 text-primary">•</span>
                    <span className="font-normal text-white">Disability Awareness & Inclusion</span> – creating empathy and equal opportunity.
                  </li>
                  <li className="text-xs text-gray-300 font-light leading-relaxed pl-4 relative">
                    <span className="absolute left-0 text-primary">•</span>
                    <span className="font-normal text-white">Mental Health & Dementia Advocacy</span> – promoting care and understanding.
                  </li>
                  <li className="text-xs text-gray-300 font-light leading-relaxed pl-4 relative">
                    <span className="absolute left-0 text-primary">•</span>
                    <span className="font-normal text-white">Youth Empowerment & Community Outreach</span> – tackling real issues like the Sugar Daddy Campaign and grassroots mentorship.
                  </li>
                </ul>
              </div>

              {/* Closing Statement */}
              <div className="pt-4">
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Chiedza CheAfrica isn't just a podcast — it's a{" "}
                  <span className="text-primary font-normal">movement</span> for light, leadership, and legacy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;