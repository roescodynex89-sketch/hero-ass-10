"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function ArtworkDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  // তোমার প্রজেক্টের স্টাইলে ডিরেক্ট ব্যাকএন্ড এন্ডপয়েন্ট ফেচ মেথড
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:5000/api/public/artworks/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Artwork not found");
          return res.json();
        })
        .then((data) => setArtwork(data))
        .catch((err) => console.error("Error:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-slate-500 text-center py-10 flex justify-center items-center gap-2"><div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div> Loading Masterpiece Documentation...</div>;
  }

  if (!artwork) {
    return (
      <div className="text-center py-10 text-slate-500">
        <h2 className="text-xl font-bold text-red-500">Artwork not found</h2>
        <Link href="/artworks" className="text-[#7C3AED] hover:underline inline-flex items-center gap-1 mt-2"><FaArrowLeft /> Return to Browse</Link>
      </div>
    );
  }

  const isOwner = session?.user?.email === artwork.artistEmail;

  return (
    <div className="max-w-[1100px] mx-auto p-6 text-slate-800 dark:text-white mt-10">
      <Link href="/artworks" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#7C3AED] mb-6"><FaArrowLeft /> Back to Gallery</Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ফ্রেম শোকেস */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border bg-slate-50 dark:bg-[#1E293B]">
          <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-contain p-2" priority />
        </div>

        {/* ডাটা এবং কন্টেন্ট */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <span className="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] text-xs font-bold px-3 py-1 rounded-full uppercase">{artwork.category}</span>
            <h1 className="text-3xl font-extrabold mt-2">{artwork.title}</h1>
            <p className="text-sm text-slate-400 mt-1">Created by: <span className="font-semibold text-purple-500">{artwork.artistName}</span></p>
            <p className="text-gray-500 dark:text-gray-300 mt-4 leading-relaxed whitespace-pre-line">{artwork.description}</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase font-bold text-slate-400">Valuation</span>
              <span className="text-3xl font-black text-[#7C3AED]">${artwork.price}</span>
            </div>

            <button
              disabled={isOwner}
              className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-white ${
                isOwner
                  ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 active:scale-95 shadow-md shadow-purple-500/10"
              }`}
            >
              <FaShoppingBag />
              <span>{isOwner ? "Your Own Masterpiece" : "Proceed to Purchase"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}