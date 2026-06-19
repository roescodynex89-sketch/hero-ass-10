"use client";

import { motion } from "framer-motion";
import { FaPalette, FaShieldAlt, FaGlobe } from "react-icons/fa";

export default function WhyChoose() {
  // ৩টি কলামের জন্য ডাটা অবজেক্ট
  const features = [
    {
      id: 1,
      title: "Original Artwork",
      description: "Discover exclusive, one-of-a-kind masterpieces directly from the creators. Every piece comes with a verified digital certificate of authenticity.",
      icon: FaPalette,
      gradient: "from-[#7C3AED] to-[#8B5CF6]", // Violet to Purple
      shadow: "hover:shadow-purple-500/10",
    },
    {
      id: 2,
      title: "Secure Payment",
      description: "Your transactions are shielded with industry-leading encryption. We support secure escrow payments ensuring safety for both buyers and artists.",
      icon: FaShieldAlt,
      gradient: "from-[#8B5CF6] to-[#EC4899]", // Purple to Pink
      shadow: "hover:shadow-pink-500/10",
    },
    {
      id: 3,
      title: "Global Artists",
      description: "Connect with a diverse community of talented creators from every corner of the world. Explore cultural heritage and modern art in one place.",
      icon: FaGlobe,
      gradient: "from-[#EC4899] to-[#7C3AED]", // Pink to Violet
      shadow: "hover:shadow-violet-500/10",
    },
  ];

  // সেকশন এন্ট্রান্স অ্যানিমেশন (Staggered Effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-4 py-20 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] overflow-hidden">
      
      {/* ✨ background subtle UI glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 👑 Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
          Why Choose <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Our Gallery</span>
        </h2>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          We bridge the gap between extraordinary creativity and art enthusiasts worldwide, offering an unmatched secure experience.
        </p>
      </div>

      {/* 📊 3-Column Grid Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
      >
        {features.map((item) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }} // কার্ডের স্কেল ১ থেকে ১.০৫ এ বৃদ্ধি
              className={`group bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 transition-all duration-300 shadow-sm ${item.shadow} hover:border-[#7C3AED]/30 dark:hover:border-[#8B5CF6]/30`}
            >
              {/* 🎨 Icon Wrapper with 5deg Hover Rotation */}
              <div className="mb-6 inline-block">
                <motion.div 
                  whileHover={{ rotate: 5 }} // আইকন হোভারে ৫ ডিগ্রি রোটেশন
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-2xl shadow-md transition-transform duration-300`}
                >
                  <IconComponent />
                </motion.div>
              </div>

              {/* 📝 Title & Description */}
              <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-[#7C3AED] dark:group-hover:text-[#8B5CF6] transition-colors duration-300">
                {item.title}
              </h3>
              
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.description}
              </p>

              {/* ⚡ UI Decorative Element */}
              <div className="mt-6 w-8 h-[3px] rounded-full bg-slate-200 dark:bg-slate-700 group-hover:w-16 group-hover:bg-gradient-to-r group-hover:from-[#7C3AED] group-hover:to-[#EC4899] transition-all duration-500" />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}