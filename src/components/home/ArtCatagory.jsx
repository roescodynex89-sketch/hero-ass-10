"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaPaintBrush,
  FaLaptopCode,
  FaCamera,
  FaPenNib,
  FaCubes,
  FaTheaterMasks,
  FaMountain,
  FaMonument,
} from "react-icons/fa";

export default function ArtCategory() {
  const categories = [
    { id: 1, name: "Painting", icon: FaPaintBrush },
    { id: 2, name: "Digital Art", icon: FaLaptopCode },
    { id: 3, name: "Photography", icon: FaCamera },
    { id: 4, name: "Sketch", icon: FaPenNib },
    { id: 5, name: "Sculpture", icon: FaCubes },
    { id: 6, name: "Abstract", icon: FaTheaterMasks },
    { id: 7, name: "Landscape", icon: FaMountain },
    { id: 8, name: "Traditional", icon: FaMonument },
  ];

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 py-16 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC]">
      {/*  Section Header */}
      <div className="mb-10 space-y-2">
        <h2 className="text-3xl font-black tracking-tight bg-linear-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent inline-block">
          Browse by Category
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Find the perfect artwork from your favorite style.
        </p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link href="/artworks" key={cat.id} className="block">
              <motion.div
                //  Section Load Animation
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                //  Hover Animation
                whileHover={{
                  scale: 1.05,
                  y: -4,
                }}
                
                className="group relative flex items-center w-full px-6 py-4 rounded-full overflow-hidden cursor-pointer transition-all duration-300 bg-[#7C3AED]/10 dark:bg-[#8B5CF6]/10 border border-[#7C3AED]/20 dark:border-[#8B5CF6]/20"
              >
                {/*  Hover Background Layer: Purple Gradient Pop-up */}
                <div className="absolute inset-0 bg-linear-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                {/*  Content Container (Relative to sit above the hover background) */}
                <div className="relative z-10 flex items-center w-full">
                  {/*  Left Aligned Icon */}
                  <div className="text-xl mr-4 text-[#7C3AED] dark:text-[#8B5CF6] group-hover:text-white transition-colors duration-200 shrink-0">
                    <Icon />
                  </div>

                  {/*  Center/Flex-1 Text Alignment */}
                  <span className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-200 group-hover:text-white transition-colors duration-200 mx-auto pr-6">
                    {cat.name}
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
