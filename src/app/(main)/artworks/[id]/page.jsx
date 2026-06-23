"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaShoppingBag,
  FaEdit,
  FaTrashAlt,
  FaCommentAlt,
  FaSpinner,
  FaPaperPlane,
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ArtworkDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArtworkData = async () => {
      try {
        setLoading(true);

        // Public route - normal fetch
        const artRes = await fetch(
           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/artworks/${id}`,
        );
        const artData = await artRes.json();
        setArtwork(artData);

        // Comments - public route
        const commentRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/${id}`,
        );
        const commentData = await commentRes.json();
        setComments(commentData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load artwork details.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkData();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase this artwork.");
      return;
    }
    try {
      setActionLoading(true);
      const data = await fetchWithAuth("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: artwork._id }),
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout session failed");
      }
    } catch (error) {
      toast.error("Failed to initialize Stripe checkout.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      setCommentSubmitting(true);
      const freshComment = await fetchWithAuth("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId: id,
          text: newComment,
          userImage: user.image,
        }),
      });

      setComments((prev) => [freshComment, ...prev]);
      setNewComment("");
      toast.success("Comment posted successfully!");
    } catch (error) {
      toast.error("You must purchase this artwork to comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteArtwork = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this masterpiece permanently?",
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      await fetchWithAuth(`/api/artist/artworks/${id}`, {
        method: "DELETE",
      });
      toast.success("Artwork deleted successfully.");
      router.push("/artworks");
    } catch (error) {
      toast.error("Failed to delete artwork.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-500 text-center py-20 flex flex-col justify-center items-center gap-3">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
        <p className="text-sm font-medium text-slate-400">
          Loading Masterpiece Documentation...
        </p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="text-center py-20 text-slate-500 max-w-md mx-auto">
        <h2 className="text-2xl font-black text-[#EF4444]">
          Artwork Not Found
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          The item might have been removed or the link is invalid.
        </p>
        <Link
          href="/artworks"
          className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-[#7C3AED] hover:underline inline-flex items-center gap-2"
        >
          <FaArrowLeft /> Return to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user?.email === artwork.artistEmail;

  return (
    <div className="max-w-275 mx-auto p-4 md:p-6 text-[#0F172A] dark:text-[#F8FAFC] mt-6 space-y-12">
      <div className="flex items-center justify-between">
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#7C3AED] transition-colors"
        >
          <FaArrowLeft /> BACK TO GALLERY
        </Link>

        {isOwner && (
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/artist/edit/${id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#7C3AED] transition-all"
            >
              <FaEdit /> Edit
            </Link>
            <button
              onClick={handleDeleteArtwork}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 transition-all cursor-pointer"
            >
              <FaTrashAlt /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B] flex items-center justify-center p-4">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-contain p-4"
            priority
          />
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="bg-[#7C3AED]/10 text-[#7C3AED] text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
              {artwork.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {artwork.title}
            </h1>

            <p className="text-xs text-slate-400 font-medium">
              Created by:{" "}
              <Link
                href={`/artists/${artwork.artistEmail}`}
                className="font-bold text-[#8B5CF6] hover:underline"
              >
                {artwork.artistName}
              </Link>
              {artwork.createdAt && (
                <span className="ml-3 text-[11px] text-slate-400 block sm:inline">
                  Published: {new Date(artwork.createdAt).toLocaleDateString()}
                </span>
              )}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed whitespace-pre-line pt-2">
              {artwork.description}
            </p>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-4 shadow-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase font-black text-slate-400 tracking-wider">
                Valuation
              </span>
              <span className="text-3xl font-black bg-linear-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                ${artwork.price}
              </span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isOwner || actionLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white cursor-pointer ${
                isOwner
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                  : "bg-linear-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 active:scale-[0.99] shadow-md shadow-purple-500/10"
              }`}
            >
              {actionLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaShoppingBag />
              )}
              <span>
                {isOwner ? "Your Own Masterpiece" : "Proceed to Purchase"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/60 dark:border-slate-800 pt-8 space-y-6">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <FaCommentAlt className="text-[#7C3AED]" />
          <h3 className="font-extrabold text-lg tracking-tight">
            Discussion ({comments.length})
          </h3>
        </div>

        <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
          <div className="w-9 h-9 relative rounded-full overflow-hidden bg-slate-200 shrink-0">
            {user?.image ? (
              <Image
                src={user.image}
                alt="User"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600">
                {user ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <textarea
              rows={2}
              value={newComment}
              disabled={!user}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                user
                  ? "Write an appreciation or feedback about this art..."
                  : "Please sign in to participate in the conversation."
              }
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
            />
            {user && (
              <button
                type="submit"
                disabled={commentSubmitting || !newComment.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white text-xs font-bold rounded-lg hover:bg-[#8B5CF6] transition-colors cursor-pointer disabled:opacity-50"
              >
                {commentSubmitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
                <span>Post Comment</span>
              </button>
            )}
          </div>
        </form>




        <div className="space-y-4 pt-2">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={comment._id}
                className="flex gap-3 p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B]/40 border border-slate-200/40 dark:border-slate-800/60"
              >
                <div className="w-8 h-8 relative rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <Image
                    src={comment.userImage || "/avatar.png"}
                    alt={comment.userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {comment.userName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString()
                        : "Just now"}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No thoughts shared yet. Be the first to start the discussion!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}





// ......