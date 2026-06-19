"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] px-4 transition-colors duration-300">
      
      {/* Animated Icon/Illustration */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
        className="text-[#EC4899] text-7xl md:text-9xl mb-6 drop-shadow-lg"
      >
        <FaExclamationTriangle />
      </motion.div>

      {/* Text Content */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold  mb-3"
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 dark:text-gray-400 max-w-md text-center text-base md:text-lg mb-8"
      >
        Oops! The masterpiece you are looking for doesn't exist or has been moved to another gallery.
      </motion.p>

      {/* Home Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl shadow-lg shadow-[#7C3AED]/20 transition-all"
        >
          <FaHome />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;