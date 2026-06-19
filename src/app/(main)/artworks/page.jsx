// "use client";

// import { useState, useEffect, useCallback, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { FaSearch, FaSlidersH } from "react-icons/fa";

// // তোমার তৈরি করা কমন পেজিনেশন কম্পোনেন্ট
// function Pagination({ currentPage, totalPages, onPageChange }) {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex items-center justify-center gap-2 mt-8 pb-4">
//       <button
//         disabled={currentPage === 1}
//         onClick={() => onPageChange(currentPage - 1)}
//         className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-medium rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition text-white"
//       >
//         Previous
//       </button>
//       {pages.map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`w-9 h-9 text-xs font-bold rounded-xl transition ${
//             currentPage === page
//               ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
//               : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
//           }`}
//         >
//           {page}
//         </button>
//       ))}
//       <button
//         disabled={currentPage === totalPages}
//         onClick={() => onPageChange(currentPage + 1)}
//         className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-medium rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition text-white"
//       >
//         Next
//       </button>
//     </div>
//   );
// }

// function BrowseArtworksContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // URL থেকে প্যারামস রিড করা
//   const searchParam = searchParams.get("search") || "";
//   const categoryParam = searchParams.get("category") || "";
//   const sortByParam = searchParams.get("sortBy") || "newest";
//   const pageParam = parseInt(searchParams.get("page")) || 1;

//   const [searchTerm, setSearchTerm] = useState(searchParam);
//   const [artworks, setArtworks] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);

//   // URL স্টেট ম্যানেজমেন্ট ফাংশন (তোমার আগের স্টাইল)
//   const updateURL = (key, value) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value) params.set(key, value);
//     else params.delete(key);
    
//     if (key !== "page") params.set("page", "1");
//     router.push(`/artworks?${params.toString()}`);
//   };

//   // তোমার ব্যাকএন্ড এপিআই এর সাথে কানেক্টেড ক্লায়েন্ট ফেচ মেথড
//   useEffect(() => {
//     setLoading(true);
//     const query = new URLSearchParams({
//       page: pageParam,
//       ...(searchParam && { search: searchParam }),
//       ...(categoryParam && { category: categoryParam }),
//       ...(sortByParam && { sortBy: sortByParam }),
//     });

//     fetch(`http://localhost:5000/api/public/artworks?${query.toString()}`)
//       .then((res) => res.json())
//       .then((data) => {
//         // ব্যাকএন্ড সরাসরি অ্যারে পাঠালে ডাটা সেট হবে, আর অবজেক্ট পাঠালে চেক করবে
//         if (Array.isArray(data)) {
//           setArtworks(data);
//           setTotalPages(1); // ব্যাকএন্ডে পেজিনেশন লজিক অ্যাড করলে এটা ডাইনামিক হবে
//         } else {
//           setArtworks(data.artworks || []);
//           setTotalPages(data.totalPages || 1);
//         }
//       })
//       .catch((err) => console.error("Error fetching artworks:", err))
//       .finally(() => setLoading(false));
//   }, [searchParam, categoryParam, sortByParam, pageParam]);

//   return (
//     <div className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC]">
//       <div className="text-center max-w-2xl mx-auto mb-10">
//         <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Explore Masterpieces</h1>
//       </div>

//       {/* সার্চ ও ফিল্টার প্যানেল */}
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 p-5 rounded-2xl mb-8">
//         <div className="relative flex items-center md:col-span-5">
//           <FaSearch className="absolute left-4 text-slate-400" />
//           <input 
//             type="text" 
//             placeholder="Search by title or artist..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && updateURL("search", searchTerm)}
//             className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#7C3AED]"
//           />
//         </div>

//         <div className="md:col-span-3">
//           <select
//             value={categoryParam}
//             onChange={(e) => updateURL("category", e.target.value)}
//             className="w-full px-4 py-2.5 text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#7C3AED]"
//           >
//             <option value="">All Categories</option>
//             <option value="Cyberpunk">Cyberpunk</option>
//             <option value="Fantasy">Fantasy</option>
//             <option value="Abstract">Abstract</option>
//             <option value="Minimalism">Minimalism</option>
//           </select>
//         </div>

//         <div className="md:col-span-4">
//           <select
//             value={sortByParam}
//             onChange={(e) => updateURL("sortBy", e.target.value)}
//             className="w-full px-4 py-2.5 text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#7C3AED]"
//           >
//             <option value="newest">Sort By: Newest</option>
//             <option value="price-low">Price: Low to High</option>
//             <option value="price-high">Price: High to Low</option>
//           </select>
//         </div>
//       </div>

//       {/* আর্টওয়ার্ক কার্ডস গ্রিড */}
//       {loading ? (
//         <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div></div>
//       ) : artworks.length > 0 ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//           {artworks.map((art) => (
//             <div key={art._id} className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
//               <Link href={`/artworks/${art._id}`}>
//                 <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0F172A] mb-3">
//                   <Image src={art.imageUrl} alt={art.title} fill className="object-cover" />
//                 </div>
//                 <div className="space-y-1">
//                   <h3 className="font-bold text-sm sm:text-base line-clamp-1">{art.title}</h3>
//                   <p className="text-xs text-slate-500">By {art.artistName}</p>
//                 </div>
//               </Link>
//               <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-200/30">
//                 <span className="text-sm font-extrabold text-[#7C3AED]">${art.price}</span>
//                 <span className="text-[10px] font-bold uppercase bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-md">{art.category}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 text-slate-400">No masterpieces found matching criteria.</div>
//       )}

//       <Pagination currentPage={pageParam} totalPages={totalPages} onPageChange={(targetPage) => updateURL("page", targetPage)} />
//     </div>
//   );
// }

// export default function BrowseArtworks() {
//   return (
//     <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div></div>}>
//       <BrowseArtworksContent />
//     </Suspense>
//   );
// }


"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaSearch, FaSlidersH, FaSpinner, FaEye, FaPalette, FaSortAmountDown } from "react-icons/fa";

// কমন পেজিনেশন কম্পোনেন্ট
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-white/10 transition active:scale-95"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${
            currentPage === page
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105"
              : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-white/10 transition active:scale-95"
      >
        Next
      </button>
    </div>
  );
}

function BrowseArtworksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL থেকে প্যারামস রিড করা
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortByParam = searchParams.get("sortBy") || "newest";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  
  const [artworks, setArtworks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // URL স্টেট ম্যানেজমেন্ট ফাংশন
  const updateURL = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    
    if (key !== "page") params.set("page", "1");
    router.push(`/artworks?${params.toString()}`);
  };

  // এক্সপ্রেস ব্যাকএন্ড থেকে ডিরেক্ট ফেচ মেথড
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      page: pageParam,
      limit: 8,
      ...(searchParam && { search: searchParam }),
      ...(categoryParam && { category: categoryParam }),
      ...(sortByParam && { sortBy: sortByParam }),
      ...(minPriceParam && { minPrice: minPriceParam }),
      ...(maxPriceParam && { maxPrice: maxPriceParam }),
    });

    fetch(`http://localhost:5000/api/public/artworks?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArtworks(data);
          setTotalPages(1);
        } else {
          setArtworks(data.artworks || []);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => console.error("Error fetching artworks:", err))
      .finally(() => setLoading(false));
  }, [searchParam, categoryParam, sortByParam, minPriceParam, maxPriceParam, pageParam]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC]">
      
      {/* 🚀 Hero Headline Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
          Explore Masterpieces
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Discover and collect authentic digital and physical artworks from top global creators.
        </p>
      </div>

      {/* 🔍 Interactive Search and Filter Controls Panel */}
      <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Input */}
          <div className="relative flex items-center md:col-span-5">
            <FaSearch className="absolute left-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by artwork title or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateURL("search", searchTerm)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#7C3AED] transition-all dark:text-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative flex items-center md:col-span-3">
            <FaPalette className="absolute left-4 text-slate-400 z-10" />
            <select
              value={categoryParam}
              onChange={(e) => updateURL("category", e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#7C3AED] cursor-pointer appearance-none dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="Cyberpunk">Cyberpunk</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Abstract">Abstract</option>
              <option value="Minimalism">Minimalism</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative flex items-center md:col-span-4">
            <FaSortAmountDown className="absolute left-4 text-slate-400 z-10" />
            <select
              value={sortByParam}
              onChange={(e) => updateURL("sortBy", e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#7C3AED] cursor-pointer appearance-none dark:text-white"
            >
              <option value="newest">Sort By: Newest Vault</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Price Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 inline-flex items-center gap-1.5">
            <FaSlidersH /> Price Range:
          </span>
          <input 
            type="number" 
            placeholder="Min $" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateURL("minPrice", minPrice)}
            className="w-28 px-3 py-1.5 text-xs bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#7C3AED] dark:text-white"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input 
            type="number" 
            placeholder="Max $" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateURL("maxPrice", maxPrice)}
            className="w-28 px-3 py-1.5 text-xs bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#7C3AED] dark:text-white"
          />
        </div>
      </div>

      {/* 📊 Responsive Cards Grid with Framer Motion Animation */}
      {loading ? (
        <div className="flex justify-center items-center py-24 flex-col gap-2">
          <FaSpinner className="animate-spin text-4xl text-[#7C3AED]" />
          <p className="text-sm text-slate-400">Loading Canvas Archives...</p>
        </div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <motion.div
              key={art._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                {/* Image Wrap Frame */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0F172A] mb-3 border border-slate-200/20">
                  <Image 
                    src={art.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"} 
                    alt={art.title} 
                    fill 
                    sizes="(max-w-768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Metadata Titles */}
                <div className="space-y-1 px-1">
                  <h3 className="font-extrabold text-sm sm:text-base line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    By <span className="font-semibold text-slate-700 dark:text-slate-300">{art.artistName}</span>
                  </p>
                </div>
              </div>

              {/* Action and Price Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm sm:text-base font-black text-[#7C3AED] dark:text-purple-400">
                    ${art.price}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-md border border-purple-100/50 dark:border-purple-900/30">
                    {art.category}
                  </span>
                </div>

                {/* ✨ View Details Trigger Button */}
                <Link href={`/artworks/${art._id}`} className="block w-full">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2 bg-slate-500/10 hover:bg-[#7C3AED] text-slate-700 dark:text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:shadow-md"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#F8FAFC] dark:bg-[#1E293B] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-sm">
          No masterpieces found matching your active criteria.
        </div>
      )}

      {/* Pagination Integration */}
      <Pagination 
        currentPage={pageParam} 
        totalPages={totalPages} 
        onPageChange={(targetPage) => updateURL("page", targetPage)} 
      />
    </div>
  );
}

export default function BrowseArtworks() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh] flex-col gap-2 bg-white dark:bg-[#0F172A]">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
      </div>
    }>
      <BrowseArtworksContent />
    </Suspense>
  );
}