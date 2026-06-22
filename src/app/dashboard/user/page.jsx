"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";
import {
  FaShoppingBag,
  FaCrown,
  FaLayerGroup,
  FaArrowUp,
  FaSpinner,
  FaChartLine,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UserOverview() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchStats = async () => {
      try {
        const data = await fetchWithAuth(
          `/api/user/stats/${user.email}`,
        );

        setStats(data);
      } catch (error) {
        console.error("Dashboard stats error:", error);
        toast.error("Could not load overview metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.email]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  if (sessionPending || loading) {
    return (
      <div className="h-[60vh] flex  justify-center items-center w-full">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
      </div>
    );
  }

  const cardItems = [
    {
      title: "Total Purchased",
      value: stats?.totalPurchased || 0,
      subText: "Artworks collected",
      icon: <FaShoppingBag />,
      gradient: "from-[#7C3AED] to-[#8B5CF6]",
      textGlow: "shadow-[#7C3AED]/20",
    },
    {
      title: "Current Membership",
      value: stats?.currentPlan || "Free",
      subText: `Tier limit: ${stats?.maxAllowed || 3} Arts`,
      icon: <FaCrown />,
      gradient: "from-[#EC4899] to-[#7C3AED]",
      textGlow: "shadow-[#EC4899]/20",
    },
    {
      title: "Remaining Limit",
      value: stats?.remainingLimit ?? 3,
      subText: "Available slots left",
      icon: <FaLayerGroup />,
      gradient:
        stats?.remainingLimit === 0
          ? "from-[#EF4444] to-[#EC4899]"
          : "from-[#22C55E] to-[#8B5CF6]",
      textGlow: "shadow-[#22C55E]/20",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Welcome Back,{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            {user?.name || "Collector"}
          </span>{" "}
          ✨
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Here is an overview of your art collection progress and current tier
          limit status.
        </p>
      </motion.div>

      {/*.  (Hover scale: 1.05 + y: -5) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cardItems.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-700/50 shadow-xs flex justify-between items-center relative overflow-hidden group transition-all duration-300"
          >
            <div
              className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
            />

            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {card.title}
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {card.value}
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.subText}
              </p>
            </div>

            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center text-xl shadow-md ${card.textGlow}`}
            >
              {card.icon}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="p-5 md:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#8B5CF6]">
              <FaChartLine />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Collection Investment Trends
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Visual mapping of prices per purchase asset
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-1 rounded-md">
            <FaArrowUp className="text-[10px]" />
            <span>Active Portfolio</span>
          </div>
        </div>

        <div className="w-full h-[300px] mt-2 text-xs">
          {stats?.chartData && stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart
                data={stats.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.1}
                />
                <XAxis dataKey="name" stroke="#64748B" tickLine={false} />
                <YAxis stroke="#64748B" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "12px",
                    borderColor: "#334155",
                    color: "#F8FAFC",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#chartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="font-semibold text-sm">No Purchase History Found</p>
              <p className="text-xs">
                Your collected paintings analytics will appear here.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
