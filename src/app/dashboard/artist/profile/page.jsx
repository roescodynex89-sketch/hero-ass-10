// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { FaUser, FaPhone, FaFileAlt, FaCloudUploadAlt, FaSpinner, FaSave } from "react-icons/fa";
// import Image from "next/image";
// import { toast } from "sonner";

// export default function ProfileManagement() {
//   const [updating, setUpdating] = useState(false);
//   const [uploadingImg, setUploadingImg] = useState(false);
//   const artistEmail = "john.doe@example.com";

//   // ফর্ম স্টেট
//   const [profile, setProfile] = useState({
//     name: "Jhon Doe",
//     phone: "",
//     bio: "Digital Creator & Visual Artist specialized in Cyberpunk concepts.",
//     image: "/avatar.png" // ডিফল্ট বা এক্সিস্টিং ইমেজ
//   });

//   // 📷 imgBB ইমেজ আপলোড প্রসেস
//   const handleAvatarUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadingImg(true);
//     const toastId = toast.loading("Uploading avatar to imgBB...");
    
//     const imgBBKey = "YOUR_IMGBB_API_KEY"; // ⚠️ এখানে তোমার imgBB API Key বসাবে
//     const data = new FormData();
//     data.append("image", file);

//     try {
//       const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
//         method: "POST",
//         body: data
//       });
//       const resData = await res.json();

//       if (resData.success) {
//         setProfile((prev) => ({ ...prev, image: resData.data.url }));
//         toast.success("Profile picture updated layout!", { id: toastId });
//       } else {
//         toast.error("Upload failed", { id: toastId });
//       }
//     } catch (error) {
//       toast.error("Network error during upload", { id: toastId });
//     } finally {
//       setUploadingImg(false);
//     }
//   };

//   // 💾 প্রোফাইল ডাটাবেজে সেভ করা
//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     const toastId = toast.loading("Saving changes to ArtHub...");

//     try {
//       const res = await fetch(`http://localhost:5000/api/user/profile/${artistEmail}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: profile.name,
//           image: profile.image,
//           bio: profile.bio,
//           phoneNumber: profile.phone
//         })
//       });

//       if (res.ok) {
//         toast.success("Profile updated successfully!", { id: toastId });
//       } else {
//         toast.error("Failed to update profile", { id: toastId });
//       }
//     } catch (error) {
//       toast.error("Server connection lost", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-3xl mx-auto">
//       <div>
//         <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Profile Management</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Update your personal information, contact numbers, and public avatar.</p>
//       </div>

//       <div className="bg-[#FFFFFF] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-6">
//         <form onSubmit={handleProfileSubmit} className="space-y-6">
          
//           {/* 🖼️ AVATAR UPDATE SECTION */}
//           <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
//             <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#7C3AED] bg-slate-50">
//               <Image src={profile.image} alt="Avatar" fill className="object-cover" />
//               {uploadingImg && (
//                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                   <FaSpinner className="animate-spin text-white" />
//                 </div>
//               )}
//             </div>
            
//             <div className="space-y-1.5 text-center sm:text-left">
//               <label className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
//                 <FaCloudUploadAlt className="text-sm text-[#7C3AED]" />
//                 <span>Upload New Photo</span>
//                 <input type="file" accept="image/*" disabled={uploadingImg} onChange={handleAvatarUpload} className="hidden" />
//               </label>
//               <p className="text-xs text-slate-400">JPG, PNG or GIF. Max size of 800K.</p>
//             </div>
//           </div>

//           {/* 📝 FORM INPUTS */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             {/* Name Input */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
//                 <FaUser className="text-slate-300" /> Full Name
//               </label>
//               <input 
//                 type="text" required
//                 value={profile.name}
//                 onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//                 className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all"
//               />
//             </div>

//             {/* Phone Input */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
//                 <FaPhone className="text-slate-300" /> Phone Number
//               </label>
//               <input 
//                 type="text"
//                 placeholder="+880 1700-000000"
//                 value={profile.phone}
//                 onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//                 className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all"
//               />
//             </div>
//           </div>

//           {/* Bio Input */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
//               <FaFileAlt className="text-slate-300" /> Professional Bio
//             </label>
//             <textarea 
//               rows={4} required
//               value={profile.bio}
//               onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//               className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
//             <button 
//               type="submit" disabled={updating || uploadingImg}
//               className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/15 cursor-pointer disabled:opacity-50"
//             >
//               {updating ? <FaSpinner className="animate-spin" /> : <FaSave />}
//               <span>Save Profile Changes</span>
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaFileAlt, FaCloudUploadAlt, FaSpinner, FaSave } from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";
// 🔐 Better Auth ক্লায়েন্ট হুক (তোমার প্রজেক্টের পাথ অনুযায়ী ইমপোর্টটি সেট করে নিও)
import { useSession } from "@/lib/auth-client"; 

export default function ProfileManagement() {
  // Better Auth থেকে সেশন ডাটা নিয়ে আসা
  const { data: session, isPending: sessionLoading } = useSession();
  
  const [updating, setUpdating] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);

  // ফর্ম স্টেট
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    bio: "",
    image: "/avatar.png" 
  });

  // 🔄 সেশন ডাটা লোড হলে এবং ব্যাকএন্ড থেকে ডাটাবেজের বর্তমান ডাটা ফেচ করা
  useEffect(() => {
    if (!session?.user) return;

    const fetchCurrentProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/profile/${session.user.email}`);
        if (res.ok) {
          const dbData = await res.json();
          // ডাটাবেজে ডাটা থাকলে সেটা বসবে, না থাকলে সেশনের ডিফল্ট ডাটা ফলব্যাক হিসেবে থাকবে
          setProfile({
            name: dbData?.name || session.user.name || "",
            phone: dbData?.phoneNumber || "",
            bio: dbData?.bio || "",
            image: dbData?.image || session.user.image || "/avatar.png"
          });
        } else {
          // ব্যাকএন্ডে প্রথমবার ইউজার ডাটা না পাওয়া গেলে সেশন ডাটা দিয়ে ইনিশিয়ালাইজ করা
          setProfile((prev) => ({
            ...prev,
            name: session.user.name || "",
            image: session.user.image || "/avatar.png"
          }));
        }
      } catch (error) {
        console.error("Error fetching database profile:", error);
      } finally {
        setInitialFetchLoading(false);
      }
    };

    fetchCurrentProfile();
  }, [session]);

  // 📷 imgBB ইমেজ আপলোড প্রসেস
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    const toastId = toast.loading("Uploading avatar to imgBB...");
    
    const imgBBKey = "YOUR_IMGBB_API_KEY"; // ⚠️ এখানে তোমার imgBB API Key বসাবে
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
        method: "POST",
        body: data
      });
      const resData = await res.json();

      if (resData.success) {
        setProfile((prev) => ({ ...prev, image: resData.data.url }));
        toast.success("Profile picture updated layout!", { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error during upload", { id: toastId });
    } finally {
      setUploadingImg(false);
    }
  };

  // 💾 প্রোফাইল ডাটাবেজে সেভ করা
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.email) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    setUpdating(true);
    const toastId = toast.loading("Saving changes to ArtHub...");

    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/${session.user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          image: profile.image,
          bio: profile.bio,
          phoneNumber: profile.phone
        })
      });

      if (res.ok) {
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        toast.error("Failed to update profile", { id: toastId });
      }
    } catch (error) {
      toast.error("Server connection lost", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  // ⏳ সেশন ভ্যালিডেশন বা ইনিশিয়াল লোডিং স্টেট স্ক্রিন
  if (sessionLoading || (session && initialFetchLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading profile records...</p>
      </div>
    );
  }

  // 🛑 লগইন না করা থাকলে সিকিউরিটি মেসেজ প্রোটেকশন
  if (!session?.user) {
    return (
      <div className="text-center p-12 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Access Denied. Please log in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Profile Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Update your personal information, contact numbers, and public avatar.</p>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          
          {/* 🖼️ AVATAR UPDATE SECTION */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#7C3AED] bg-slate-50">
              <Image src={profile.image} alt="Avatar" fill className="object-cover" priority />
              {uploadingImg && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <FaSpinner className="animate-spin text-white" />
                </div>
              )}
            </div>
            
            <div className="space-y-1.5 text-center sm:text-left">
              <label className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <FaCloudUploadAlt className="text-sm text-[#7C3AED]" />
                <span>Upload New Photo</span>
                <input type="file" accept="image/*" disabled={uploadingImg} onChange={handleAvatarUpload} className="hidden" />
              </label>
              <p className="text-xs text-slate-400">JPG, PNG or GIF. Max size of 800K.</p>
            </div>
          </div>

          {/* 📝 FORM INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FaUser className="text-slate-300" /> Full Name
              </label>
              <input 
                type="text" required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FaPhone className="text-slate-300" /> Phone Number
              </label>
              <input 
                type="text"
                placeholder="+880 1700-000000"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all"
              />
            </div>
          </div>

          {/* Bio Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FaFileAlt className="text-slate-300" /> Professional Bio
            </label>
            <textarea 
              rows={4} required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="submit" disabled={updating || uploadingImg}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/15 cursor-pointer disabled:opacity-50"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>Save Profile Changes</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}