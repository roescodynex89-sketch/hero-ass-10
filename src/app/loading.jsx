"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-300">
      <div className="relative w-24 h-24 flex items-center justify-center">
        
        {/* Outer Pulsing Ring */}
        <motion.div
          className="absolute w-full h-full rounded-full border-4 border-[#7C3AED]/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner Rotating Loader */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-t-[#7C3AED] border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Small Accent Dot in Center */}
        <div className="absolute w-3 h-3 bg-[#EC4899] rounded-full shadow-md" />
      </div>
      
      {/* Brand Tagline Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 text-sm font-semibold tracking-widest text-[#7C3AED] dark:text-[#7C3AED] uppercase"
      >
        Loading ArtHub...
      </motion.p>
    </div>
  );
};

export default Loading;
