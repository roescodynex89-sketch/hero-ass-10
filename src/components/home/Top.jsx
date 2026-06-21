"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaCrown, FaTrophy, FaMedal } from "react-icons/fa";
import { FaArrowTrendUp} from "react-icons/fa6"

export default function Top() {
 
  const topArtists = [
    {
      rank: 1,
      name: "Alex Rivers",
      sales: "$45,200",
      avatar: "/s1.jpg", 
      badgeColor: "bg-amber-500",
      icon: <FaCrown className="text-amber-400 text-xl animate-bounce" />,
      glow: "shadow-amber-500/10 dark:shadow-amber-500/5 border-amber-500/30",
    },
    {
      rank: 2,
      name: "Elena Rostova",
      sales: "$38,150",
      avatar: "/s2.jpg", 
      badgeColor: "bg-slate-400",
      icon: <FaTrophy className="text-slate-300 text-lg" />,
      glow: "shadow-slate-400/10 dark:shadow-slate-400/5 border-slate-400/20",
    },
    {
      rank: 3,
      name: "Marc Woods",
      sales: "$29,900",
      avatar: "/s3.jpg",
      badgeColor: "bg-amber-700",
      icon: <FaMedal className="text-amber-600 text-lg" />,
      glow: "shadow-amber-700/10 dark:shadow-amber-700/5 border-amber-700/20",
    },
  ];

 
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
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
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full max-w-[1400px] mx-auto px-4 py-16 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC]"
    >
      {/*  Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-[#7C3AED] to-[#EC4899] text-white">
          <FaArrowTrendUp className="text-xl" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Top Selling <span className="bg-linear-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Artists</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            The masterminds driving the highest trade volume this week.
          </p>
        </div>
      </div>

      {/* 3-Column Layout Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topArtists.map((artist) => (
          <motion.div
            key={artist.rank}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              y: -5,
              boxShadow: "0px 20px 35px rgba(124, 58, 237, 0.08)",
            }}
            className={`group relative flex items-center gap-5 p-5 bg-[#F8FAFC] dark:bg-[#1E293B] border rounded-2xl transition-all duration-300 ${artist.glow}`}
          >
            {/*  Rank Badge / Icon Slot */}
            <div className="absolute top-4 right-4 flex items-center justify-center">
              {artist.icon}
            </div>

            {/* 👤 Avatar Layer (Next.js Optimized with local public assets) */}
            <div className="relative w-16 h-16 rounded-full shrink-0 p-[2px] bg-linear-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#EC4899]">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#1E293B]">
                <Image
                  src={artist.avatar} 
                  alt={artist.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${artist.badgeColor} text-white font-black text-[10px] flex items-center justify-center border-2 border-white dark:border-[#1E293B]`}>
                {artist.rank}
              </span>
            </div>

            {/*  Artist Meta Info */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-base tracking-tight group-hover:text-[#7C3AED] dark:group-hover:text-[#8B5CF6] transition-colors duration-200">
                {artist.name}
              </h3>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Total Volume
                </span>
                <span className="text-sm font-black bg-linear-to-r from-[#22C55E] to-emerald-400 bg-clip-text text-transparent">
                  {artist.sales}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}