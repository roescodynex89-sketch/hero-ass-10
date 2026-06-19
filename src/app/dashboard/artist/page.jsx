"use client";

import { motion } from "framer-motion";
import { FaPalette, FaDollarSign, FaShoppingCart, FaGem } from "react-icons/fa";

export default function ArtistOverview() {
  // পরবর্তী ধাপে এই ডাটা আমরা useEffect দিয়ে ব্যাকএন্ড API থেকে Fetch করব।
  // আপাদত তোমার প্ল্যান অনুযায়ী ডামি ডাটা দিয়ে UI স্ট্রাকচার দেওয়া হলো।
  const stats = [
    { id: 1, name: "Total Artworks", value: "12", icon: <FaPalette />, color: "from-blue-500 to-cyan-500" },
    { id: 2, name: "Total Sales Amount", value: "$1,250", icon: <FaDollarSign />, color: "from-emerald-500 to-teal-500" },
    { id: 3, name: "Artworks Sold", value: "5 Items", icon: <FaShoppingCart />, color: "from-purple-500 to-indigo-500" },
    { id: 4, name: "Current Plan", value: "Premium Artist", icon: <FaGem />, color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome Back, Artist!</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is a quick look at your gallery performance today.</p>
      </div>

      {/* 📊 ৪টি প্রিমিয়াম স্ট্যাটস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between overflow-hidden relative group hover:shadow-md transition-shadow"
          >
            <div className="space-y-2 z-10">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {stat.name}
              </span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 block">
                {stat.value}
              </span>
            </div>

            {/* আইকন বক্স */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center text-xl shadow-lg shadow-purple-500/10`}>
              {stat.icon}
            </div>

            {/* ডেকোরেটিভ ব্যাকগ্রাউন্ড এফেক্ট */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/40 rounded-full group-hover:scale-110 transition-transform -z-0" />
          </motion.div>
        ))}
      </div>

      {/* নিচের ফাঁকা জায়গায় তুমি চাইলে একটি সুন্দর চার্ট বা রিসেন্ট সেলস অ্যাক্টিভিটি দিতে পারো */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-64 flex items-center justify-center p-6 shadow-sm">
        <p className="text-sm text-slate-400 dark:text-slate-500">Analytics charts or recent activities will be loaded here...</p>
      </div>
    </div>
  );
}

