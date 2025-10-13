import React from "react";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { assets } from "../../assets/assets";

export function Services() {
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

  return (
    <motion.section 
      className="w-full bg-[#F6931B]/10 py-20"
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
            Our Solutions
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold uppercase text-black">
            What We Can Do For You
          </h2>
        </motion.div>

        {/* Solutions Grid */}
        <motion.div variants={fadeInUp}>
          <BentoGrid className="w-full mx-auto">
            {items.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={i === 3 || i === 6 ? "md:col-span-2" : ""} />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </motion.section>
  );
}

const Outsourcing = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <img 
      src="https://www.tekjuice.co.uk/assets/images/sol001.jpg"
      alt="Service"
      className="w-full h-full object-cover"
    />
  </div>
);

const TalentPlacement = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <img 
    src="https://www.tekjuice.co.uk/assets/images/sol002.jpg"
      alt="Service"
      className="w-full h-full object-cover"
    />
  </div>
);

const AIAcademy = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <img 
    src={assets.AiService}
      alt="Service"
      className="w-full h-full object-cover"
    />
  </div>
);

const SoftwareSolutions = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <img 
    src="https://www.tekjuice.co.uk/assets/images/sol003.jpg"
      alt="Service"
      className="w-full h-full object-cover"
    />
  </div>
);

const DigitalMarketing = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <img 
    src="https://www.tekjuice.co.uk/assets/images/sol001.jpg"
      alt="Service"
      className="w-full h-full object-cover"
    />
  </div>
);

const ServiceImage = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <img 
      src={assets.hero} 
      alt="Service"
      className="w-full h-full object-cover"
    />
  </div>
);

const items = [
  {
    title: "Outsourcing",
    description: "Streamline your business operations with our efficient outsourcing solutions.",
    header: <Outsourcing />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Talent Placement",
    description: "Access a pool of talented and skilled professionals tailored to your needs.",
    header: <TalentPlacement />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Software Solutions",
    description: "Navigate through our suite of powerful software products, ready to transform how you work.",
    header: <SoftwareSolutions />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "AI Academy",
    description: "Equip your team with the latest cutting-edge AI skills through our comprehensive training programs.",
    header: <AIAcademy />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Digital Marketing",
    description: "Boost your online presence with our comprehensive digital marketing strategies and campaigns.",
    header: <DigitalMarketing />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
];