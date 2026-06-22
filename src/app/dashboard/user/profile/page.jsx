"use client";

import { useState, useEffect } from "react";

import {
  FaUser,
  FaPhone,
  FaFileAlt,
  FaCloudUploadAlt,
  FaSpinner,
  FaSave,
  FaIdCard,
} from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
export default function UserProfileManagement() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [updating, setUpdating] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    bio: "",
    image: "/avatar.png",
  });

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        phone: session.user.phoneNumber || "",
        bio:
          session.user.bio ||
          "Passionate Art Collector & Connoisseur of fine digital masterpieces.",
        image: session.user.image || "/avatar.png",
      });
    }
  }, [session]);

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Loading collector profile...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-12 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Please sign in to manage your collector account.
        </p>
      </div>
    );
  }

  const userEmail = session.user.email;

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    const toastId = toast.loading("Uploading new avatar to imgBB...");

    const imgBBKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgBBKey}`,
        {
          method: "POST",
          body: data,
        },
      );
      const resData = await res.json();

      if (resData.success) {
        setProfile((prev) => ({ ...prev, image: resData.data.url }));
        toast.success("Avatar uploaded successfully!", { id: toastId });
      } else {
        toast.error("Upload failed. Verify API Key.", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error during image upload", { id: toastId });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const toastId = toast.loading("Saving updates to your ArtHub profile...");

    try {
      await fetchWithAuth(`/api/user/profile/${userEmail}`, {
        method: "PUT",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          image: profile.image,
          bio: profile.bio,
          phoneNumber: profile.phone,
        }),
      });

      toast.success("Collector profile updated successfully!", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Express backend server connection lost", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
          Profile{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal details, contact preferences, and public identity
          across the ArtHub marketplace.
        </p>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] border border-slate-200/60 dark:border-slate-700/50 rounded-2xl shadow-xs p-6 transition-all">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* 🖼️ AVATAR UPDATE SECTION */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-200/60 dark:border-slate-700/50">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#7C3AED] bg-slate-100 dark:bg-slate-800 shadow-sm flex items-center justify-center">
              <Image
                src={profile.image}
                alt="Collector Avatar"
                fill
                className="object-cover"
              />
              {uploadingImg && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                  <FaSpinner className="animate-spin text-white text-lg" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <label className="inline-flex items-center gap-2 bg-[#F8FAFC] dark:bg-[#0F172A]/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all">
                <FaCloudUploadAlt className="text-base text-[#7C3AED]" />
                <span>Change Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImg}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Supports JPG, PNG or GIF. Recommended ratio 1:1.
              </p>
            </div>
          </div>

          {/* 📝 FORM INPUTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <FaUser className="text-[#8B5CF6]" /> Account Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <FaPhone className="text-[#8B5CF6]" /> Contact Number
              </label>
              <input
                type="text"
                placeholder="+880 1XXX-XXXXXX"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] transition-all"
              />
            </div>
          </div>

          {/* Collector Bio / Interests */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <FaFileAlt className="text-[#8B5CF6]" /> Collector Statement & Bio
            </label>
            <textarea
              rows={4}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] transition-all resize-none"
            />
          </div>

          {/* 💾 SUBMIT & SAVE OPTIONS */}
          <div className="flex justify-end pt-4 border-t border-slate-200/60 dark:border-slate-700/50">
            <button
              type="submit"
              disabled={updating || uploadingImg}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md shadow-purple-500/10 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>
                {updating ? "Saving Changes..." : "Save Profile Details"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
