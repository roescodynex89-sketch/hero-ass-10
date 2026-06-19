"use client";

import { motion } from "framer-motion";
import { FaFire, FaBolt, FaCrown, FaGem, FaStar } from "react-icons/fa";

export default function Moving() {
  const tickerItems = [
    {
      text: "NEW CYBERPUNK DROP NOW LIVE",
      icon: <FaBolt className="text-[#EC4899]" />,
    },
    {
      text: "TOP ARTIST APPRECIATION WEEK",
      icon: <FaCrown className="text-amber-500" />,
    },
    {
      text: "EXPLORE AUTHENTIC DIGITAL VAULTS",
      icon: <FaGem className="text-cyan-400" />,
    },
    {
      text: "MINIMALISM ART 20% VALUATION BOOST",
      icon: <FaFire className="text-[#EF4444]" />,
    },
    {
      text: "JOIN THE ARTHUB CREATOR REVOLUTION",
      icon: <FaStar className="text-yellow-400" />,
    },
  ];

  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full overflow-hidden bg-linear-to-r from-[#7C3AED]/10 via-[#8B5CF6]/20 to-[#EC4899]/10 border-y border-purple-500/20 py-3 shadow-xs backdrop-blur-md relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-white dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap gap-10 items-center"
        animate={{ x: [0, -1000] }}
        transition={{
          ease: "linear",
          duration: 25,
          repeat: Infinity,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-xs sm:text-sm font-black uppercase tracking-widest text-[#0F172A] dark:text-[#F8FAFC]"
          >
            {item.icon}
            <span className="bg-linear-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent dark:from-[#F8FAFC] dark:to-purple-300">
              {item.text}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400/40 mx-2" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
