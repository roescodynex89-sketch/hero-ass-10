"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  FaUsers,
  FaPalette,
  FaShoppingCart,
  FaDollarSign,
  FaSpinner,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AdminOverview() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const PIE_COLORS = ["#7C3AED", "#EC4899", "#22C55E", "#8B5CF6", "#3B82F6"];

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth(
          `/api/admin/stats`
          
        );
        
        setStats(data);
      } catch (error) {
        console.error("Admin stats load error:", error);
        toast.error("Failed to sync system analytics nodes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center w-full space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Loading master analytics panel...
        </p>
      </div>
    );
  }

  const cardItems = [
    {
      id: 1,
      name: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <FaUsers />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Active Artists",
      value: stats?.totalArtists || 0,
      icon: <FaPalette />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: 3,
      name: "Artworks Sold",
      value: `${stats?.totalArtworksSold || 0} Items`,
      icon: <FaShoppingCart />,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 4,
      name: "Total Revenue",
      value: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <FaDollarSign />,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
          System Intelligence Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, {session?.user?.name || "Admin"}. Tracking global
          platform scaling metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardItems.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center justify-between overflow-hidden relative group hover:shadow-md transition-all duration-300"
          >
            <div className="space-y-2 z-10">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {stat.name}
              </span>
              <span className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] block">
                {stat.value}
              </span>
            </div>

            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center text-xl shadow-lg shadow-purple-500/5`}
            >
              {stat.icon}
            </div>

            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white dark:bg-slate-800/20 rounded-full group-hover:scale-110 transition-transform -z-0" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F8FAFC]">
            <FaChartBar className="text-[#7C3AED]" />
            <h3 className="font-extrabold text-sm tracking-tight">
              Recent Platform Revenue Flow
            </h3>
          </div>

          <div className="w-full h-72">
            {stats?.salesChartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.salesChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(148, 163, 184, 0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(124, 58, 237, 0.05)" }}
                  />
                  <Bar
                    dataKey="Amount"
                    fill="#7C3AED"
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                No active transaction logs to map.
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F8FAFC]">
            <FaChartPie className="text-[#EC4899]" />
            <h3 className="font-extrabold text-sm tracking-tight">
              Artworks by Category
            </h3>
          </div>

          <div className="w-full h-72 flex items-center justify-center">
            {stats?.categoryData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                No artwork classifications found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
