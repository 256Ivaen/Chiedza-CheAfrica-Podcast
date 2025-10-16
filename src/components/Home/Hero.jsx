import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets/assets";
import { Youtube } from "lucide-react";
import { FaSpotify, FaApple, FaInstagram } from "react-icons/fa";

const Hero = () => {
  const heroData = {
    words: ["Innovation", "Courage", "Purpose", "Impact"],
    subtitle: "Lighting paths. Inspiring minds.",
    title: "Amplifying African",
    titleSuffix: "stories",
    primaryBtn: "Listen Now",
    secondaryBtn: "Support Us",
    image: assets.hero1,
  };

  const streamingPlatforms = [
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/@chiedzacheafrica",
      color: "hover:text-red-500",
    },
    {
      name: "Spotify",
      icon: FaSpotify,
      href: "https://open.spotify.com/show/5YBekTisDE8CawmkxGiesr",
      color: "hover:text-green-400",
    },
    // {
    //   name: "Apple Podcasts",
    //   icon: FaApple,
    //   href: "#",
    //   color: "hover:text-gray-300",
    // },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://www.instagram.com/chiedzacheafrica",
      color: "hover:text-pink-500",
    },
  ];

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -15,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const fadeVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      x: -20,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 120,
        damping: 25,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 40,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 150,
        damping: 30,
      },
    },
  };

  const backgroundVariants = {
    initial: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)",
    },
    enter: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const gradientVariants = {
    initial: {
      opacity: 0,
      x: -100,
      filter: "blur(20px)",
    },
    enter: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // New optimized FlipWords component
  const FlipWords = ({ words, duration = 2000 }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, duration);

      return () => clearInterval(interval);
    }, [words, duration]);

    return (
      <span className="inline-flex items-baseline">
        <motion.span
          className="relative inline-block overflow-hidden align-baseline"
          layout
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={currentIndex}
              initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="inline-block text-primary font-light align-baseline"
            >
              {words[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </span>
    );
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial="initial"
          animate="enter"
          variants={backgroundVariants}
          style={{ zIndex: 1 }}
        >
          <motion.img
            src={heroData.image}
            alt="Chiedza CheAfrica Podcast - Amplifying African Stories"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 2.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        </motion.div>
      </div>

      {/* Cool Gradient Effect */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 2 }}
        initial="initial"
        animate="enter"
        variants={gradientVariants}
      >
        <div className="relative w-full h-full">
          {/* Main Gradient Shade */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Blur Transition Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent backdrop-blur-[1px]" />

          {/* Subtle Edge Enhancement */}
          <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black/40 to-transparent" />
        </div>
      </motion.div>

      <div
        className="relative z-10 h-full flex items-center"
        style={{ zIndex: 10 }}
      >
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <motion.div
            className="max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.p
              className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 md:mb-4"
              variants={fadeVariants}
            >
              {heroData.subtitle}
            </motion.p>

            <motion.h1
              className="text-2xl sm:text-2xl md:text-4xl uppercase font-light text-white leading-tight mb-4 md:mb-6"
              variants={titleVariants}
            >
              {heroData.title}
              <br />
              <span className="inline-flex items-baseline">
                <FlipWords words={heroData.words} duration={2000} />
                <span className="inline-block align-baseline ml-1">
                  {heroData.titleSuffix}
                </span>
              </span>
            </motion.h1>

            {/* Interactive Show Tagline */}
            <motion.p
              className="text-primary text-sm font-light mb-6 md:mb-8 italic"
              variants={fadeVariants}
            >
              Lighting Africa's Path - Stories of Innovation, Inspiration &
              Impact.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12 w-full sm:w-auto"
              variants={buttonVariants}
            >
              <motion.button
                className="bg-primary text-white px-6 py-2 rounded-full font-light hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-sm w-full sm:w-auto"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => (window.location.href = "/episodes")}
              >
                <span>{heroData.primaryBtn}</span>
              </motion.button>

              <motion.button
                className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full font-light hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-sm w-full sm:w-auto"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.open(
                    "https://buymeacoffee.com/chiedzacheafrica",
                    "_blank"
                  )
                }
              >
                <span>{heroData.secondaryBtn}</span>
              </motion.button>
            </motion.div>

            {/* Streaming Platforms with Icons */}
            <motion.div className="flex flex-col gap-4" variants={fadeVariants}>
              <p className="text-white text-sm font-light">
                Available on all major platforms:
              </p>
              <div className="flex flex-wrap gap-4">
                {streamingPlatforms.map((platform, index) => {
                  const IconComponent = platform.icon;
                  return (
                    <motion.a
                      key={platform.name}
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-white/70 ${platform.color} transition-all duration-300 p-2 rounded-lg hover:bg-white/5`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm font-light">
                        {platform.name}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
