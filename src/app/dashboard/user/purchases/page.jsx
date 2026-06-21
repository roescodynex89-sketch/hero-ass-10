"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  FaShoppingBag,
  FaSpinner,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function PurchaseHistory() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/purchases/${user.email}`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Failed to load purchase history");
        const data = await res.json();
        setPurchases(data);
      } catch (error) {
        console.error("Purchase history error:", error);
        toast.error("Could not load your billing records.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user?.email]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  if (sessionPending || loading) {
    return (
      <div className="h-[60vh] flex justify-center items-center w-full">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#7C3AED] dark:text-[#8B5CF6]">
          <FaShoppingBag className="text-xl md:text-2xl" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Purchase{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              History
            </span>
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Review and track all your successful art orders, invoices, and
          transaction timelines.
        </p>
      </div>

      {purchases.length > 0 ? (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-[#F8FAFC] dark:bg-[#1E293B] shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-100 dark:bg-[#0F172A]/50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Artwork Details
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Artist Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Purchase Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price Paid
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-slate-200/60 dark:divide-slate-700/50"
              >
                {purchases.map((item) => (
                  <motion.tr
                    key={item._id}
                    variants={rowVariants}
                    whileHover={{ backgroundColor: "rgba(124, 58, 237, 0.02)" }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[220px] font-extrabold text-base tracking-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                          ID: #{item.artworkId?.slice(-8) || item._id.slice(-8)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                      {item.artistName || "Independent Artist"}
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-slate-400" />
                        <span>
                          {item.purchaseDate
                            ? new Date(item.purchaseDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "Recent"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white text-base">
                      <span className="bg-gradient-to-r from-[#22C55E] to-emerald-400 bg-clip-text text-transparent">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 w-fit text-[11px] font-bold bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-1 rounded-full border border-[#22C55E]/20">
                        <FaCheckCircle className="text-[10px]" />
                        <span className="uppercase tracking-wider">
                          Success
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-[#F8FAFC]/50 dark:bg-[#1E293B]/20 min-h-[350px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 flex items-center justify-center text-xl mb-4">
            <FaShoppingBag />
          </div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">
            No Orders Found
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1">
            You haven't made any purchases yet. Once you complete checkout for a
            painting, the transactional ledger invoices will display here.
          </p>
        </motion.div>
      )}
    </div>
  );
}
