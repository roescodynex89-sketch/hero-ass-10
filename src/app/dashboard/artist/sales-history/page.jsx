"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaDollarSign, FaSpinner, FaUser } from "react-icons/fa";
import { toast } from "sonner";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const artistEmail = "john.doe@example.com"; // Better Auth ইন্টিগ্রেশনের সময় ডাইনামিক হবে

  useEffect(() => {
    const fetchSalesHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/artist/sales/${artistEmail}`);
        const data = await res.json();
        setSales(data);
      } catch (error) {
        toast.error("Failed to load sales history");
      } finally {
        setLoading(false);
      }
    };
    fetchSalesHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Sales History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track your earnings and monitor who is purchasing your artwork.</p>
      </div>

      {/* 📊 SALES TABLE */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-60 flex flex-col items-center justify-center gap-2 text-slate-400">
            <FaSpinner className="animate-spin text-2xl text-[#7C3AED]" />
            <p className="text-xs">Fetching payment records...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <p className="text-sm font-medium">No sales recorded yet.</p>
            <p className="text-xs mt-1">Once a collector buys your art, the invoice statement will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-4">Artwork Title</th>
                  <th className="px-6 py-4">Buyer Name</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                {sales.map((sale, index) => (
                  <motion.tr 
                    key={sale._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      {sale.artworkTitle}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-xs text-slate-300" />
                        <span>{sale.buyerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-xs text-slate-300" />
                        <span>{new Date(sale.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-[#22C55E] font-black">
                      <span className="inline-flex items-center">
                        <FaDollarSign className="text-xs" />
                        {sale.amount}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}