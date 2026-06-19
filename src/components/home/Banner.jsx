"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaCompass } from "react-icons/fa";
import { LuLampCeiling } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
const Banner = () => {
  const artworks = [
    { id: 1, src: "/art4.jpg", title: "Neon Cyberpunk Metropolis" },
    { id: 2, src: "/art2.jpg", title: "Ethereal Mystic Forest" },
    { id: 3, src: "/art3.jpg", title: "Abstract Golden Horizon" },
    { id: 4, src: "/art1.jpg", title: "Futuristic Astral Voyager" },
  ];

  const [activeArt, setActiveArt] = useState(artworks[0]);

  return (
    <section className="relative w-full min-h-[90vh] flex items-center bg-[#F8FAFC] dark:bg-[#0F172A] px-4 sm:px-6 lg:px-8 py-12 overflow-hidden transition-colors duration-300">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/*  LEFT SIDE: CONTENT */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
              Premium Digital Gallery
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-none"
          >
            Own an Extraordinary <br />
            <span className="bg-linear-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
              Digital Masterpiece
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0"
          >
            Welcome to ArtHub showroom. Discover unique digital arts curated by
            world-class creators and secure your authentic ownership today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <Link href="/artworks">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl shadow-lg shadow-[#7C3AED]/20 transition-all cursor-pointer"
              >
                <FaShoppingBag />
                <span>Explore Marketplace</span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] font-semibold rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <FaCompass />
              <span>View Plans</span>
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT SIDE: PREMIUM GALLERY SHOWROOM  */}
        <div className="lg:col-span-7 flex flex-col items-center relative w-full">
          {/* 💡 HANGING LAMP & SPOTLIGHT EFFECT */}

          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            <div className="w-[1.5px] h-25 bg-gray-400 dark:bg-gray-500" />

            <motion.div
              animate={{ rotate: [-4, 4, -4] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ originX: "50%", originY: "0%" }}
              className="text-yellow-500 dark:text-yellow-400 text-5xl drop-shadow-md -mt-[18px]"
            >
              <LuLampCeiling />
            </motion.div>

            <motion.div
              animate={{ opacity: [0.6, 0.9, 0.6], scaleX: [0.98, 1.04, 0.98] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[450px] h-[360px] bg-linear-to-b
from-[#FFF3C4]/70
via-[#F4C430]/20
to-transparent
blur-[80px] -mt-2"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>

          {/* MAIN ARTWORK CONTAINER */}
          <div className="relative w-full max-w-[440px] h-[480px] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 shadow-2xl z-10 mt-16 flex flex-col justify-between">
            <div className="relative w-full h-[88%] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeArt.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeArt.src}
                    alt={activeArt.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-[10%] flex items-center justify-between px-1">
              <span className="text-sm font-bold truncate pr-4 text-[#0F172A] dark:text-[#F8FAFC]">
                {activeArt.title}
              </span>
              <span className="text-xs font-semibold text-[#7C3AED] shrink-0">
                Premium Drop
              </span>
            </div>
          </div>

          {/* BOTTOM STACKED THUMBNAILS */}
          <div className="grid grid-cols-4 gap-3 w-full max-w-[440px] mt-6 z-10">
            {artworks.map((art) => {
              const isActive = art.id === activeArt.id;
              return (
                <motion.button
                  key={art.id}
                  onClick={() => setActiveArt(art)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 bg-white dark:bg-[#1E293B] shadow-sm cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20"
                      : "border-[#E2E8F0] dark:border-[#334155] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={art.src}
                    alt={art.title}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
