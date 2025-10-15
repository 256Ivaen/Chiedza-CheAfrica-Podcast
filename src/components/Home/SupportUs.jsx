import React from 'react';
import { motion } from "framer-motion";
import { Heart, Video, Plane, Mic, Users, Lightbulb } from "lucide-react";

const SupportUs = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const supportItems = [
    {
      icon: Video,
      text: "Continue producing impactful podcast episodes and video content"
    },
    {
      icon: Plane,
      text: "Cover travel expenses for on-site interviews and outreach work"
    },
    {
      icon: Mic,
      text: "Maintain and upgrade essential recording and production equipment"
    },
    {
      icon: Users,
      text: "Support our small team of editors, writers, and coordinators"
    },
    {
      icon: Lightbulb,
      text: "Fund community outreach initiatives such as mentorship programs and awareness campaigns"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Content Grid - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-6">

              {/* Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-normal text-white mb-4">
                  SUPPORT US
                </h2>
                <p className="text-xl text-primary font-light italic">
                  Love what we do? Help us keep the light shining!
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                At <span className="text-white font-normal">Chiedza CheAfrica Podcast</span>, we are more than just storytellers — 
                we are a passionate team of paid staff and volunteers working hard to bring you high-quality, uplifting content 
                that celebrates Africa's brilliance.
              </p>

              {/* Your Support Helps Section */}
              <div className="pt-4">
                <h3 className="text-base font-normal text-white mb-4">
                  Your support helps us to:
                </h3>
                <motion.ul 
                  className="space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {supportItems.map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={fadeInUp}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-5 h-5 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-sm text-gray-300 font-light leading-relaxed">
                        {item.text}
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Impact Statement */}
              <div className="pt-4 border-t border-white/10">
                {/* <p className="text-sm text-gray-300 font-light leading-relaxed mb-4">
                  Every contribution — no matter how small — helps us continue shining a light on stories that matter, 
                  empower young Africans, and reach a global audience.
                </p> */}
                <p className="text-sm text-white font-light leading-relaxed">
                  Together, we can keep telling the stories that inspire hope, action, and change.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Credit Card */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="credit-card-wrapper">
              <div className="credit-card">
                <div className="card-front">
                  <div className="card-header">
                    <div>CreditCard</div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" width="60" viewBox="-96 -98.908 832 593.448">
                      <path fill="#ff5f00" d="M224.833 42.298h190.416v311.005H224.833z" />
                      <path
                        d="M244.446 197.828a197.448 197.448 0 0175.54-155.475 197.777 197.777 0 100 311.004 197.448 197.448 0 01-75.54-155.53z"
                        fill="#eb001b"
                      />
                      <path
                        d="M621.101 320.394v-6.372h2.747v-1.319h-6.537v1.319h2.582v6.373zm12.691 0v-7.69h-1.978l-2.307 5.493-2.308-5.494h-1.977v7.691h1.428v-5.823l2.143 5h1.483l2.143-5v5.823z"
                        fill="#f79e1b"
                      />
                      <path
                        d="M640 197.828a197.777 197.777 0 01-320.015 155.474 197.777 197.777 0 000-311.004A197.777 197.777 0 01640 197.773z"
                        fill="#f79e1b"
                      />
                    </svg>
                  </div>

                  <div className="card-number">
                    {[...Array(16)].map((_, idx) => (
                      <span key={idx} className="card-digit">
                        <span className="digit-content">
                          <span className="digit-placeholder">#</span>
                          <span className="digit-value">#</span>
                        </span>
                        {(idx + 1) % 4 === 0 && idx < 15 && <span className="digit-space"></span>}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div className="card-holder-section">
                      <div className="card-label">Card Holder</div>
                      <div className="card-holder-name">FULL NAME</div>
                    </div>
                    <div className="card-expires-section">
                      <div className="card-label">Expires</div>
                      <div className="card-expires">
                        <span>MM</span>/<span>YY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Button Below Card */}
              <div className="mt-6">
                <a
                  href="https://buymeacoffee.com/chiedzacheafrica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-8 py-3 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-all hover:scale-105"
                >
                  <Heart className="w-4 h-4 mr-2" fill="currentColor" />
                  Support Chiedza CheAfrica
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .credit-card-wrapper {
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
        }

        .credit-card {
          width: 100%;
        }

        .card-front {
          width: 100%;
          max-width: 420px;
          height: 233px;
          border-radius: 20px;
          padding: 24px 30px 30px;
          background: linear-gradient(to right bottom, #323941, #061018);
          box-shadow: 0 33px 50px -15px rgba(50, 55, 63, 0.66);
          color: #fff;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-front::before {
          content: "";
          position: absolute;
          border: 16px solid #ff6be7;
          border-radius: 100%;
          left: -17%;
          top: -45px;
          height: 300px;
          width: 300px;
          filter: blur(13px);
        }

        .card-front::after {
          content: "";
          position: absolute;
          border: 16px solid #7288ff;
          border-radius: 100%;
          width: 300px;
          top: 55%;
          left: -200px;
          height: 300px;
          filter: blur(13px);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }

        .card-number {
          font-size: 22px;
          position: relative;
          z-index: 1;
          display: flex;
          height: 33px;
          overflow: hidden;
          color: #fff;
        }

        .card-digit {
          display: inline-flex;
          margin-right: 0;
        }

        .digit-space {
          width: 10px;
        }

        .digit-content {
          display: flex;
          flex-direction: column;
          height: 33px;
          line-height: 33px;
        }

        .digit-placeholder,
        .digit-value {
          height: 33px;
          display: block;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .card-holder-section,
        .card-expires-section {
          text-transform: uppercase;
        }

        .card-label {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .card-holder-name {
          margin-top: 4px;
        }

        .card-expires {
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .card-front {
            padding: 20px 24px 24px;
            height: 210px;
          }

          .card-number {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
};

export default SupportUs;