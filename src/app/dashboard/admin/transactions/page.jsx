"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FaExchangeAlt,
  FaSearch,
  FaSpinner,
  FaReceipt,
  FaCreditCard,
  FaCrown,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";

export default function AdminTransactionsHistory() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/transactions`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Failed to load transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Transaction log fetch error:", error);
        toast.error("Failed to sync system financial transaction ledgers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.buyerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center w-full space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Loading central accounting ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
            <FaExchangeAlt className="text-[#7C3AED] text-xl" /> Financial
            Ledger Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit master settlement history, subscription allocations, and
            artwork sales protocols.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search Trx ID, email, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B] text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-[#0F172A]/40 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5">Transaction ID</th>
                <th className="py-4 px-5">Allocation Type</th>
                <th className="py-4 px-5">User / Entity Email</th>
                <th className="py-4 px-5">Settlement Node</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800/60">
              <AnimatePresence>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => {
                    const isSubscription = tx.type === "subscription";

                    return (
                      <motion.tr
                        key={tx._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/40 dark:hover:bg-[#0F172A]/20 transition-colors"
                      >
                        <td className="py-4 px-5 font-mono text-xs text-[#0F172A] dark:text-[#F8FAFC] font-bold max-w-[140px] truncate">
                          <span className="inline-flex items-center gap-1.5">
                            <FaReceipt className="text-slate-400 dark:text-slate-500 text-[11px]" />
                            {tx._id}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          {isSubscription ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-purple-500/10 text-[#8B5CF6]">
                              <FaCrown className="text-[10px]" /> Subscription
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-[#22C55E]">
                              <FaCreditCard className="text-[10px]" /> Art
                              Purchase
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 font-medium text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                          {tx.buyerEmail || "anonymous_user"}
                        </td>

                        <td className="py-4 px-5 font-semibold text-[#0F172A] dark:text-[#F8FAFC] max-w-[160px] truncate">
                          {isSubscription
                            ? `${tx.planName || "Standard"} Tier`
                            : tx.title || "Digital Asset"}
                        </td>

                        <td className="py-4 px-5 font-black text-slate-800 dark:text-slate-100">
                          <span className="inline-flex items-center text-xs">
                            <FaDollarSign className="text-[10px] text-slate-400" />
                            {Number(tx.price || 0).toLocaleString()}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right text-xs text-slate-400 dark:text-slate-500 font-medium">
                          <span className="inline-flex items-center gap-1.5 justify-end w-full">
                            <FaCalendarAlt className="text-[10px]" />
                            {tx.purchaseDate
                              ? new Date(tx.purchaseDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "N/A"}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-xs font-medium text-slate-400 dark:text-slate-500"
                    >
                      No matching transactional vectors found in system history.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
