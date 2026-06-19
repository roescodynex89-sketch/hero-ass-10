"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  // লোকাল অ্যাসেট ইমেজের পাথসহ ৩টি রিভিউ ডাটা
  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Digital Collector",
      rating: 5,
      comment: "Amazing platform! The user experience is incredibly smooth, and purchasing authentic digital masterpieces has never been this seamless and secure.",
      avatar: "/e1.jpg", // public/e1.jpg ফোল্ডার থেকে রিড করবে
    },
    {
      id: 2,
      name: "Rahat Chowdhury",
      role: "Visual Artist",
      rating: 5,
      comment: "As a creator, ArtHub completely changed how I showcase my work. The loading speeds and custom animations make my gallery look premium.",
      avatar: "/e2.jpg", // public/e2.jpg ফোল্ডার থেকে রিড করবে
    },
    {
      id: 3,
      name: "Emma Watson",
      role: "Art Enthusiast",
      rating: 5,
      comment: "The mixed architecture and fast real-time search filtering let me discover hidden gems in seconds. Absolutely love the dark mode aesthetics!",
      avatar: "/e3.jpg", // public/e3.jpg ফোল্ডার থেকে রিড করবে
    },
  ];

  // ১. সেকশন কন্টেইনার ভ্যারিয়েন্ট (Stagger Effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // ২. গ্লাস কার্ডের জন্য অ্যানিমেশন
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-4 py-20 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] overflow-hidden">
      
      {/* ✨ ব্যাকগ্রাউন্ড গ্লো ব্লব */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#7C3AED]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#EC4899]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 👑 Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
          What Our <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Collectors Say</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Hear from the passionate creators and avid collectors who make up our thriving global art community.
        </p>
      </div>

      {/* 📊 3 Glassmorphism Cards Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
      >
        {reviews.map((user) => (
          <motion.div
            key={user.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="relative p-6 rounded-3xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-[#1E293B]/40 backdrop-blur-md shadow-xs hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between"
          >
            <FaQuoteLeft className="absolute right-6 top-6 text-2xl text-purple-500/10 dark:text-purple-400/10 pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: user.rating }).map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-sm" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic">
                "{user.comment}"
              </p>
            </div>

            {/* 👤 ইউজার প্রোফাইল ফুটার (Next.js Image Optimized) */}
            <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-200/40 dark:border-slate-700/50">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-purple-500/20 bg-slate-100 dark:bg-[#0F172A]">
                <Image
                  src={user.avatar} // এখানে /e1.jpg, /e2.jpg, /e3.jpg পাস হচ্ছে
                  alt={user.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">
                  {user.name}
                </h4>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {user.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}