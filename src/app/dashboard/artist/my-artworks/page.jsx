"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import {
  getArtistArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from "@/lib/actions/artworkActions";

export default function MyArtworks() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [editId, setEditId] = useState(null);

  const artistEmail = session?.user?.email;
  const artistName = session?.user?.name || "Anonymous Artist";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  // fetchArtworks-e
  const fetchArtworks = useCallback(async () => {
    if (!artistEmail) return;
    try {
      setLoading(true);
      const { data: tokenData } = await authClient.getToken();
      const token = tokenData?.token;

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const data = await getArtistArtworks(artistEmail, token);
      if (data?.error) {
        toast.error(data.message || "Failed to load artworks");
      } else {
        setArtworks(data || []);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [artistEmail]);

  useEffect(() => {
    if (artistEmail) {
      fetchArtworks();
    }
  }, [artistEmail, fetchArtworks]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    const toastId = toast.loading("Uploading image to imgBB...");

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
        setFormData((prev) => ({ ...prev, imageUrl: resData.data.url }));
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("imgBB upload failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error uploading image", { id: toastId });
    } finally {
      setUploadingImg(false);
    }
  };

  // handleSubmit-e
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl)
      return toast.error("Please upload an artwork image first");
    if (!artistEmail)
      return toast.error("User session not found. Please log in.");

    const { data: tokenData } = await authClient.getToken();
    const token = tokenData?.token;
    if (!token) {
      toast.error("Please login first");
      return;
    }
    const toastId = toast.loading(
      editId ? "Updating artwork..." : "Adding artwork...",
    );
    try {
      let result;
      if (editId) {
        result = await updateArtwork(editId, formData, token);
      } else {
        const payload = { ...formData, artistEmail, artistName };
        result = await createArtwork(payload, token);
      }
      if (result && !result.error) {
        toast.success(editId ? "Artwork updated!" : "Artwork added!", {
          id: toastId,
        });
        closeModal();
        fetchArtworks();
      } else {
        toast.error(result?.message || "Something went wrong", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to communicate with server", { id: toastId });
    }
  };

  // handleDelete-e
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    const { data: tokenData } = await authClient.getToken();
    const token = tokenData?.token;
    if (!token) {
      toast.error("Please login first");
      return;
    }
    const toastId = toast.loading("Deleting artwork...");
    try {
      const result = await deleteArtwork(id, token);
      if (result && !result.error) {
        toast.success("Artwork deleted successfully", { id: toastId });
        fetchArtworks();
      } else {
        toast.error(result?.message || "Delete failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Server action error", { id: toastId });
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditId(art._id);
    setFormData({
      title: art.title,
      description: art.description,
      price: art.price,
      category: art.category,
      imageUrl: art.imageUrl,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  if (sessionLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-2 text-slate-400">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm">Verifying artist session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <p className="text-base font-semibold text-red-500">Access Denied</p>
        <p className="text-xs mt-1">
          Please log in to view your customized dashboard workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            My Artworks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back,{" "}
            <span className="font-semibold text-[#7C3AED]">{artistName}</span>!
            Manage your showcase gallery.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <FaPlus />
          <span>Add New Artwork</span>
        </motion.button>
      </div>

      {/* MANAGE ARTWORKS TABLE / LIST */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-60 flex flex-col items-center justify-center gap-2 text-slate-400">
            <FaSpinner className="animate-spin text-2xl text-[#7C3AED]" />
            <p className="text-xs">Loading your digital vault...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <p className="text-sm font-medium">No artworks found.</p>
            <p className="text-xs mt-1">
              Click "Add New Artwork" to start building your gallery.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                {artworks.map((art) => (
                  <tr
                    key={art._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                        <Image
                          src={art.imageUrl}
                          alt={art.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">{art.title}</td>
                    <td className="px-6 py-4 text-purple-600 dark:text-purple-400 font-extrabold">
                      ${art.price}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 hover:scale-105 transition-transform cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(art._id)}
                          className="p-2 rounded-lg bg-red-50 text-[#EF4444] dark:bg-red-950/30 dark:text-red-400 hover:scale-105 transition-transform cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🗔 INTERACTIVE ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FFFFFF] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl z-10 overflow-y-auto max-h-[90vh] text-[#0F172A] dark:text-[#F8FAFC]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                <h3 className="text-lg font-bold">
                  {editId ? "🎨 Edit Artwork" : "➕ Add New Artwork"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter artwork title"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-[#7C3AED] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="e.g. 250"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-[#7C3AED] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FFFFFF] dark:bg-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all"
                    >
                      <option value="">Select Category</option>
                      <option value="Cyberpunk">Cyberpunk</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Abstract">Abstract</option>
                      <option value="Minimalism">Minimalism</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your masterpiece..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Artwork Image
                  </label>

                  {formData.imageUrl ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-dashed border-purple-300 group">
                      <Image
                        src={formData.imageUrl}
                        alt="Uploaded preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <label className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg cursor-pointer font-bold shadow-sm">
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#7C3AED] dark:hover:border-[#7C3AED] transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-900/10">
                      {uploadingImg ? (
                        <div className="flex flex-col items-center gap-1">
                          <FaSpinner className="animate-spin text-xl text-[#7C3AED]" />
                          <span className="text-xs text-slate-400">
                            Processing file...
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500">
                          <FaCloudUploadAlt className="text-3xl text-slate-300" />
                          <span className="text-xs font-semibold">
                            Click to upload artwork image
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImg}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-all cursor-pointer text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingImg}
                    className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#7C3AED] to-[#EC4899] shadow-md shadow-purple-500/10 transition-all cursor-pointer"
                  >
                    {editId ? "Save Changes" : "Create Upload"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
