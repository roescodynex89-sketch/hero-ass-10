"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  FaUsers,
  FaSearch,
  FaSpinner,
  FaUserShield,
  FaUserCheck,
  FaUserAlt,
} from "react-icons/fa";

export default function AdminUsersManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchGlobalUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth(
        `/api/admin/users`,
      );

      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Could not sync central user profile registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalUsers();
  }, []);

  const handleRoleMutation = async (userId, currentName, targetRole) => {
    try {
      setUpdatingId(userId);
      await fetchWithAuth(
        `/api/admin/users/role/${userId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: targetRole }),
        },
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: targetRole } : user,
        ),
      );

      toast.success(
        `Security role for "${currentName}" altered to [${targetRole.toUpperCase()}].`,
      );
    } catch (error) {
      console.error("Mutation error:", error);
      toast.error("Administrative privilege mutation failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center w-full space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Loading master identity access matrices...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
            <FaUsers className="text-[#7C3AED] text-xl" /> Identity Access
            Matrix
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit registered node members, adjust access privileges, and
            configure role scaling.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search account name, email or role..."
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
                <th className="py-4 px-5">Account Identity</th>
                <th className="py-4 px-5">Email Handle</th>
                <th className="py-4 px-5">Database Cluster ID</th>
                <th className="py-4 px-5">Privilege Class</th>
                <th className="py-4 px-5 text-right">
                  Access Control Mutation
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800/60">
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role === "admin";
                    const isArtist = u.role === "artist";

                    return (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/40 dark:hover:bg-[#0F172A]/20 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 relative rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                              {u.image ? (
                                <Image
                                  src={u.image}
                                  alt={u.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="font-black text-xs text-[#7C3AED]">
                                  {u.name
                                    ? u.name.charAt(0).toUpperCase()
                                    : "U"}
                                </span>
                              )}
                            </div>
                            <span className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] block max-w-[150px] truncate">
                              {u.name || "Anonymous Member"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5 font-medium text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                          {u.email}
                        </td>

                        <td className="py-4 px-5 font-mono text-[11px] text-slate-400 dark:text-slate-500 max-w-[120px] truncate">
                          {u._id}
                        </td>

                        <td className="py-4 px-5">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 uppercase tracking-wider">
                              <FaUserShield className="text-[10px]" /> System
                              Admin
                            </span>
                          ) : isArtist ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#8B5CF6] uppercase tracking-wider">
                              <FaUserCheck className="text-[10px]" /> Verified
                              Artist
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-500 uppercase tracking-wider">
                              <FaUserAlt className="text-[9px]" /> Regular User
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right relative">
                          <div className="inline-flex items-center justify-end w-full">
                            {updatingId === u._id ? (
                              <FaSpinner className="animate-spin text-sm text-[#7C3AED] mr-3" />
                            ) : null}
                            <select
                              disabled={updatingId === u._id}
                              value={u.role || "user"}
                              onChange={(e) =>
                                handleRoleMutation(
                                  u._id,
                                  u.name,
                                  e.target.value,
                                )
                              }
                              className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] cursor-pointer transition-all disabled:opacity-50"
                            >
                              <option value="user">User Node</option>
                              <option value="artist">Artist Account</option>
                              <option value="admin">System Admin</option>
                            </select>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-xs font-medium text-slate-400 dark:text-slate-500"
                    >
                      No identities or authorization protocols found matching
                      your criteria.
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
