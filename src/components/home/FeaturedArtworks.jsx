"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaArrowRight, FaSpinner } from "react-icons/fa";

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:5000/api/public/artworks?limit=4&sortBy=newest")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArtworks(data.slice(0, 4));
        } else if (data && Array.isArray(data.artworks)) {
          setArtworks(data.artworks.slice(0, 4));
        }
      })
      .catch((err) => console.error("Error fetching featured artworks:", err))
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="w-full max-w-350 mx-auto px-4 py-16 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC]"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/*  Header Title & View All Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-linear-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Featured Artworks
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Explore handpicked masterpieces from talented artists.
          </p>
        </div>

        {/* View All Button with Gradient Hover Effect */}
        <Link href="/artworks">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-linear-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-md hover:shadow-purple-500/20 transition-all cursor-pointer"
          >
            <span>View All</span>
            <FaArrowRight className="text-xs" />
          </motion.div>
        </Link>
      </div>

     
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-col gap-2">
          <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
          <p className="text-xs text-slate-400">Loading Featured Gallery...</p>
        </div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7">
          {artworks.map((art) => (
            <motion.div
              key={art._id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: "0px 20px 30px rgba(124, 58, 237, 0.12)",
              }}
              className="group bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 relative"
            >
              <div>
                {/* Image Container with Zoom Effect */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0F172A] mb-3 border border-slate-200/10">
                  <Image
                    src={
                      art.imageUrl ||
                      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
                    }
                    alt={art.title}
                    fill
                    sizes="(max-w-768px) 50vw, 16vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Text Meta Info */}
                <div className="space-y-0.5 px-0.5">
                  <h3 className="font-extrabold text-xs sm:text-sm line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                   Created By {art.artistName || "Unknown Artist"}
                  </p>
                </div>
              </div>

              {/* Price & Action Button Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-700/50 space-y-2.5">
                <div className="px-0.5">
                  <span className="text-xs font-black bg-linear-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                    ${art.price}
                  </span>
                </div>

                <Link href={`/artworks/${art._id}`} className="block w-full">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-1.5 bg-slate-200/60 dark:bg-slate-800 hover:bg-[#7C3AED] text-slate-700 dark:text-slate-300 hover:text-white font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 transition-all duration-300"
                  >
                    <FaEye className="text-[11px]" />
                    <span>View Details</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          No featured masterpieces found in database.
        </div>
      )}
    </motion.section>
  );
}
