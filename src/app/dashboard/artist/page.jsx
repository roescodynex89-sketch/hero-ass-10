"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  FaPalette,
  FaDollarSign,
  FaShoppingCart,
  FaGem,
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

export default function ArtistOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const artistEmail = session?.user?.email;

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistEmail) return;

    const fetchArtistDashboardData = async () => {
      try {
        setLoading(true);

        const statsData = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/artist/stats/${artistEmail}`,
        );

        setStats(statsData);

        const salesData = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/artist/sales/${artistEmail}`,
        );

        const formattedChart = salesData.reverse().map((sale, index) => ({
          name: sale.title
            ? sale.title.slice(0, 10) + "..."
            : `Art ${index + 1}`,
          Earnings: Number(sale.price || 0),
        }));

        setChartData(formattedChart);
      } catch (error) {
        console.error("Dashboard metrics load error:", error);
        toast.error("Could not sync your live performance metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDashboardData();
  }, [artistEmail]);

  if (sessionLoading || loading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center w-full space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Syncing artist dashboard nodes...
        </p>
      </div>
    );
  }

  const cardsConfig = [
    {
      id: 1,
      name: "Total Artworks",
      value: stats?.totalArtworks || 0,
      icon: <FaPalette />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Total Earnings",
      value: `$${Number(stats?.totalSalesAmount || 0).toLocaleString()}`,
      icon: <FaDollarSign />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 3,
      name: "Artworks Sold",
      value: `${stats?.totalSoldItems || 0} Items`,
      icon: <FaShoppingCart />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: 4,
      name: "Current Tier",
      value: stats?.currentPlan || "Free Plan",
      icon: <FaGem />,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome Back,{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            {session?.user?.name || "Artist"}
          </span>
          !
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Here is a real-time live performance audit of your hosted digital
          assets and active income metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardsConfig.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.35,
              ease: "easeOut",
            }}
            className="bg-white dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center justify-between overflow-hidden relative group hover:shadow-md transition-all duration-300"
          >
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {stat.name}
              </span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 block">
                {stat.value}
              </span>
            </div>

            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center text-xl shadow-md shadow-purple-500/5`}
            >
              {stat.icon}
            </div>

            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/20 rounded-full group-hover:scale-110 transition-transform duration-300 -z-0" />
          </motion.div>
        ))}
      </div>

      {/* RECHARTS ANALYTICS GRAPH COMPONENT */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <FaChartLine className="text-[#7C3AED] text-lg" />
          <h3 className="font-extrabold text-base tracking-tight">
            Sales Revenue Flow & Valuation Curve
          </h3>
        </div>

        <div className="w-full h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorEarnings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.12)"
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(148, 163, 184, 0.6)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(148, 163, 184, 0.6)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  itemStyle={{ color: "#A78BFA" }}
                />
                <Area
                  type="monotone"
                  dataKey="Earnings"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl text-center p-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                No revenue vectors generated yet. Your sales graph curve will
                appear here once users purchase your artworks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
