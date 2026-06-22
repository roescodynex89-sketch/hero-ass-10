"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { FaImages, FaSpinner, FaEye } from "react-icons/fa";

export default function BoughtCollection() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;

  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchCollection = async () => {
      try {
        const data = await fetchWithAuth(
          `/api/user/purchases/${user.email}`
        );

        setCollection(data);
      } catch (error) {
        console.error("Collection fetch error:", error);
        toast.error("Could not load your purchased artworks.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [user?.email]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
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
          <FaImages className="text-xl md:text-2xl" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Bought{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              Artworks
            </span>
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Your personal digital gallery holding all your acquired masterpiece
          collections.
        </p>
      </div>

      {collection.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {collection.map((art) => (
            <motion.div
              key={art._id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-700/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="relative w-full h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <motion.div
                  className="w-full h-full relative"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={art.imageUrl || "/fallback-art.jpg"}
                    alt={art.title}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </motion.div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                  <Link
                    href={`/artworks/${art.artworkId || art._id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFFFF] text-[#0F172A] font-bold text-xs hover:bg-[#7C3AED] hover:text-white transition-colors shadow-lg cursor-pointer"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </Link>
                </div>

                <span className="absolute top-3 right-3 text-xs font-black bg-gradient-to-r from-[#22C55E] to-emerald-500 text-white px-2.5 py-1 rounded-lg shadow-md">
                  ${art.price}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base tracking-tight text-slate-800 dark:text-slate-100 truncate group-hover:text-[#7C3AED] dark:group-hover:text-[#8B5CF6] transition-colors duration-200">
                    {art.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Artist:
                    </span>
                    <span className="truncate max-w-[150px] text-slate-500 dark:text-slate-400">
                      {art.artistName || "Unknown Artist"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-700/50 pt-3 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-[#22C55E]/90 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 px-2 py-0.5 rounded-md uppercase tracking-wider text-[9px]">
                    Owned Asset
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">
                    ID: #{art.artworkId?.slice(-6) || art._id.slice(-6)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-[#F8FAFC]/50 dark:bg-[#1E293B]/20 min-h-[350px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 flex items-center justify-center text-2xl mb-4">
            <FaImages />
          </div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">
            Your Gallery is Empty
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1 mb-6">
            You haven't purchased any artwork yet. Explore our main public asset
            house to buy your first premium master art.
          </p>
          <Link
            href="/artworks"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-xs font-bold hover:from-[#8B5CF6] hover:to-[#EC4899] transition-all duration-300 shadow-md shadow-[#7C3AED]/20 cursor-pointer"
          >
            Browse Artworks Market
          </Link>
        </motion.div>
      )}
    </div>
  );
}
