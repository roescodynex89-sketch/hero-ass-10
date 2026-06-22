"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  FaPalette,
  FaTrashAlt,
  FaSpinner,
  FaSearch,
  FaDollarSign,
} from "react-icons/fa";

export default function AdminArtworksManagement() {
  const [artworks, setArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchGlobalArtworks = async () => {
    try {
      setLoading(true);

      const data = await fetchWithAuth(
        `/api/public/artworks?limit=1000`,
      );

      setArtworks(data.artworks || []);
    } catch (error) {
      console.error("Error loading artworks:", error);
      toast.error("Could not sync global artwork database nodes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalArtworks();
  }, []);

  const handleAdministrativeDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you absolutely sure you want to administratively delete "${title}"? This action cannot be reversed.`,
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(id);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/artworks/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Delete operation failed");

      setArtworks((prev) => prev.filter((art) => art._id !== id));
      toast.success(`"${title}" has been purged from the asset index.`);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Administrative delete operation failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredArtworks = artworks.filter(
    (art) =>
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artistName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center w-full space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Syncing active catalog clusters...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
            <FaPalette className="text-[#7C3AED] text-xl" /> Global Gallery
            Index
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, moderate, and manage hosted digital assets across ArtHub
            nodes.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search title, category, or artist..."
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
                <th className="py-4 px-5">Artwork Preview</th>
                <th className="py-4 px-5">Title / Context</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Valuation</th>
                <th className="py-4 px-5">Hosted By</th>
                <th className="py-4 px-5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800/60">
              <AnimatePresence>
                {filteredArtworks.length > 0 ? (
                  filteredArtworks.map((art) => (
                    <motion.tr
                      key={art._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/40 dark:hover:bg-[#0F172A]/20 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                          <Image
                            src={art.imageUrl || "/placeholder-art.jpg"}
                            alt={art.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </td>

                      <td className="py-4 px-5 max-w-[200px]">
                        <span className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] block truncate">
                          {art.title}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5 truncate">
                          ID: {art._id}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 text-[#7C3AED] dark:text-[#8B5CF6]">
                          {art.category || "General"}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-black text-[#0F172A] dark:text-[#F8FAFC]">
                        <span className="inline-flex items-center text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <FaDollarSign className="text-[10px] mr-0.5" />{" "}
                          {Number(art.price || 0).toLocaleString()}
                        </span>
                      </td>

                      <td className="py-4 px-5 max-w-[180px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block truncate">
                          {art.artistName || "Unknown Artist"}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                          {art.artistEmail}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          disabled={actionLoading === art._id}
                          onClick={() =>
                            handleAdministrativeDelete(art._id, art.title)
                          }
                          className="p-2.5 rounded-xl text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444] hover:text-white transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center shadow-xs"
                          title="Administrative Purge"
                        >
                          {actionLoading === art._id ? (
                            <FaSpinner className="animate-spin text-sm" />
                          ) : (
                            <FaTrashAlt className="text-sm" />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-xs font-medium text-slate-400 dark:text-slate-500"
                    >
                      No active artwork nodes matched your query parameters.
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
