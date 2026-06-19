"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client"; // Better Auth ক্লায়েন্ট পাথ
import { 
  FaPalette, FaHistory, FaUser, FaHome, FaThLarge, 
  FaBars, FaTimes, FaSpinner 
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function ArtistDashboardLayout({ children }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🎯 Better Auth থেকে রিয়েল আর্টিস্ট ডাটা রিড করা
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // মোবাইল মেনু রুট চেঞ্জ হলে অটোমেটিক বন্ধ হওয়ার জন্য
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // মেনু আইটেমসমূহ
  const menuItems = [
    { name: "Overview", path: "/dashboard/artist", icon: <FaThLarge /> },
    { name: "My Artworks", path: "/dashboard/artist/my-artworks", icon: <FaPalette /> },
    { name: "Sales History", path: "/dashboard/artist/sales-history", icon: <FaHistory /> },
    { name: "Profile", path: "/dashboard/artist/profile", icon: <FaUser /> },
  ];

  // Better Auth লোড হতে থাকার সময় স্পিনার (যাতে কোনো গ্লিচ না হয়)
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#0F172A]">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
      </div>
    );
  }

  // সেফটি গার্ড: ইউজার যদি লগইন না থাকে বা রোল আর্টিস্ট না হয়
  const artistName = user?.name || "Artist";
  const artistImage = user?.image || null;

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-300   ">
      
      {/* 🛑 TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#FFFFFF] dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between px-4 md:px-6 z-30 shadow-xs">
        
        {/* বাম পাশ: হ্যামবার্গার বাটন (মোবাইল) + লোগো */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isMobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
          
          <span className="text-lg md:text-xl font-black bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            ArtHub Dashboard
          </span>
        </div>
        
        {/* 🎯 টপ রাইট: ইমেজ + মেম্বারশিপ ট্যাগ/ব্যাজ */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs">
            Artist Pro
          </span>
          
          <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-[#7C3AED] shadow-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {artistImage ? (
              <Image src={artistImage} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="font-bold text-[#7C3AED] dark:text-[#8B5CF6]">
                {artistName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 📋 SIDEBAR & MAIN CONTAINER */}
      <div className="flex pt-16">
        
        {/* ১. ডেস্কটপ সাইডবার (মিন-উইডথ md সংস্করণে ভিজিবল) */}
        <aside className="hidden md:flex fixed left-0 bottom-0 top-16 w-64 bg-[#FFFFFF] dark:bg-[#0F172A] border-r border-[#E2E8F0] dark:border-[#334155] flex-col justify-between p-4 z-20">
          <div className="space-y-6">
            
            {/* আর্টিস্ট প্রোফাইল কার্ড */}
            <div className="flex flex-col items-center text-center p-4 bg-[#F8FAFC] dark:bg-[#0F172A]/40 rounded-2xl border border-[#E2E8F0] dark:border-[#334155]">
              <div className="w-20 h-20 relative rounded-full overflow-hidden mb-3 border-2 border-dashed border-[#7C3AED] p-1 flex items-center justify-center bg-white dark:bg-slate-800">
                <div className="w-full h-full relative rounded-full overflow-hidden bg-slate-200">
                  {artistImage ? (
                    <Image src={artistImage} alt={artistName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white font-black text-xl">
                      {artistName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-sm truncate w-full px-1">
                {artistName}
              </h3>
              <p className="text-[10px] font-black text-[#7C3AED] dark:text-[#8B5CF6] uppercase tracking-widest mt-1 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 px-2 py-0.5 rounded-md">
                Artist
              </p>
            </div>

            {/* ডেস্কটপ নেভিগেশন লিংকসমূহ */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link href={item.path} key={item.name} className="relative block group">
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "text-[#7C3AED] dark:text-[#8B5CF6] font-bold"
                          : "text-gray-500 dark:text-gray-400 hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]/60 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSideNavDesktop"
                          className="absolute inset-0 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/10 rounded-xl -z-10 border-l-4 border-[#7C3AED]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ব্যাক টু হোম */}
          <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#EF4444] hover:bg-[#EF4444]/10 transition-all w-full"
            >
              <FaHome className="text-base" />
              <span>Back to Home</span>
            </Link>
          </div>
        </aside>

        {/* ২. মোবাইল ড্রয়ার রেসপন্সিভ সাইডবার (মোবাইল ওভারলে মেনু) */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* ব্লার ব্যাকড্রপ ওভারলে */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden pt-16"
              />
              
              {/* স্লাইডিং মেনু ড্রয়ার */}
              <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed left-0 top-16 bottom-0 w-72 bg-[#FFFFFF] dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col justify-between z-50 md:hidden shadow-2xl"
              >
                <div className="space-y-6">
                  {/* মোবাইল প্রোফাইল ইনফো */}
                  <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-[#0F172A]/40 rounded-xl">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden border border-[#7C3AED] bg-slate-200">
                      {artistImage ? (
                        <Image src={artistImage} alt={artistName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white font-bold">
                          {artistName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] truncate">{artistName}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Artist Account</p>
                    </div>
                  </div>

                  {/* মোবাইল নেভ আইটেম */}
                  <nav className="space-y-1">
                    {menuItems.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link href={item.path} key={item.name} className="relative block">
                          <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                ? "text-[#7C3AED] dark:text-[#8B5CF6] font-bold"
                                : "text-gray-500 dark:text-gray-400 hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]/60"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeSideNavMobile"
                                className="absolute inset-0 bg-[#7C3AED]/10 rounded-xl -z-10 border-l-4 border-[#7C3AED]"
                              />
                            )}
                            <span className="text-base">{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* মোবাইল ব্যাক হোম বাটন */}
                <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-4">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#EF4444] hover:bg-[#EF4444]/10 transition-all w-full"
                  >
                    <FaHome className="text-base" />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* 💻 MAIN CONTENT SCREEN (ফুলি রেসপন্সিভ মার্জিন) */}
        <main className="w-full md:ml-64 min-h-[calc(100vh-64px)] pb-16 p-4 sm:p-6 lg:p-8 bg-[#FFFFFF] dark:bg-[#0F172A]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}