"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  FaThLarge,
  FaShoppingBag,
  FaImages,
  FaUser,
  FaCreditCard,
  FaHome,
  FaBars,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function UserDashboardLayout({ children }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: "Overview", path: "/dashboard/user", icon: <FaThLarge /> },
    {
      name: "Purchase History",
      path: "/dashboard/user/purchases",
      icon: <FaShoppingBag />,
    },
    {
      name: "Bought Artworks",
      path: "/dashboard/user/collection",
      icon: <FaImages />,
    },
    {
      name: "Subscription Plans",
      path: "/dashboard/user/billing",
      icon: <FaCreditCard />,
    },
    {
      name: "Profile Settings",
      path: "/dashboard/user/profile",
      icon: <FaUser />,
    },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#0F172A]">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
      </div>
    );
  }

  const userName = user?.name || "Collector";
  const userImage = user?.image || null;
  const userPlan = user?.plan || "Free Tier";

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-300">
      {/* 🛑 TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#FFFFFF] dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between px-4 md:px-6 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isMobileOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>

          <span className="text-lg md:text-xl font-black bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            ArtHub Collector
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs capitalize">
            {userPlan} Member
          </span>

          <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-[#7C3AED] shadow-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {userImage ? (
              <Image
                src={userImage}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-bold text-[#7C3AED] dark:text-[#8B5CF6]">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="hidden md:flex fixed left-0 bottom-0 top-16 w-64 bg-[#FFFFFF] dark:bg-[#0F172A] border-r border-[#E2E8F0] dark:border-[#334155] flex-col justify-between p-4 z-20">
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/40 rounded-2xl border border-[#E2E8F0] dark:border-[#334155]">
              <div className="w-20 h-20 relative rounded-full overflow-hidden mb-3 border-2 border-dashed border-[#7C3AED] p-1 flex items-center justify-center bg-white dark:bg-slate-800">
                <div className="w-full h-full relative rounded-full overflow-hidden bg-slate-200">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white font-black text-xl">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-sm truncate w-full px-1">
                {userName}
              </h3>
              <p className="text-[10px] font-black text-[#EC4899] dark:text-[#EC4899] uppercase tracking-widest mt-1 bg-[#EC4899]/10 dark:bg-[#EC4899]/20 px-2 py-0.5 rounded-md">
                Buyer Account
              </p>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    href={item.path}
                    key={item.name}
                    className="relative block group"
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "text-[#7C3AED] dark:text-[#8B5CF6] font-bold"
                          : "text-gray-500 dark:text-gray-400 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSideNavDesktop"
                          className="absolute inset-0 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/10 rounded-xl -z-10 border-l-4 border-[#7C3AED]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
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

        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden pt-16"
              />

              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed left-0 top-16 bottom-0 w-72 bg-[#FFFFFF] dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col justify-between z-50 md:hidden shadow-2xl"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-[#0F172A]/40 rounded-xl">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden border border-[#7C3AED] bg-slate-200">
                      {userImage ? (
                        <Image
                          src={userImage}
                          alt={userName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        {userName}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        {userPlan} Plan
                      </p>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    {menuItems.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          href={item.path}
                          key={item.name}
                          className="relative block"
                        >
                          <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                ? "text-[#7C3AED] dark:text-[#8B5CF6] font-bold"
                                : "text-gray-500 dark:text-gray-400 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
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

        {/*  MAIN CONTENT SCREEN */}
        <main className="w-full md:ml-64 min-h-[calc(100vh-64px)] pb-16 p-4 sm:p-6 lg:p-8 bg-[#FFFFFF] dark:bg-[#0F172A]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
