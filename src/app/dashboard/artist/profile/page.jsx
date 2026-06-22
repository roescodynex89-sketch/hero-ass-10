"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaFileAlt,
  FaCloudUploadAlt,
  FaSpinner,
  FaSave,
} from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
export default function ProfileManagement() {
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
        bio: session.user.bio || "Digital Creator & Visual Artist.",
        image: session.user.image || "/avatar.png",
      });
    }
  }, [session]);

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Loading user session...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-12 bg-slate-50 dark:bg-[#1E293B] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Please sign in to manage your profile.
        </p>
      </div>
    );
  }

  const artistEmail = session.user.email;

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    const toastId = toast.loading("Uploading avatar to imgBB...");

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const toastId = toast.loading("Saving changes to ArtHub...");

    try {
      await fetchWithAuth(`/api/user/profile/${artistEmail}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          image: profile.image,
          bio: profile.bio,
          phoneNumber: profile.phone,
        }),
      });

      toast.success("Profile updated successfully!", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Server connection lost", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          Profile Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Update your personal information, contact numbers, and public avatar.
        </p>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#7C3AED] bg-slate-50">
              <Image
                src={profile.image}
                alt="Avatar"
                fill
                className="object-cover"
              />
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
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImg}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400">
                JPG, PNG or GIF. Max size of 800K.
              </p>
            </div>
          </div>

          {/*  FORM INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FaUser className="text-slate-300" /> Full Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
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
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
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
              rows={4}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={updating || uploadingImg}
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
