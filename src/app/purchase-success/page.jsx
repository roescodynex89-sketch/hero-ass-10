"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasSaved = useRef(false); // ২ বার যেন API কল না হয় সেজন্য

  // URL থেকে শুধু artworkId নেওয়া হচ্ছে
  const artworkId = searchParams.get("artworkId");

  useEffect(() => {
    if (artworkId && !hasSaved.current) {
      hasSaved.current = true;

      const savePurchaseToDB = async () => {
        try {
          // ব্যাকএন্ডের API-তে শুধু artworkId পাঠানো হচ্ছে
          const data = await fetchWithAuth("/api/user/buy-artwork", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ artworkId }),
          });
          
          if (data.success) {
            toast.success("Order recorded successfully!");
            // ৪. সফল হলে ড্যাশবোর্ডে রিডাইরেক্ট
            router.push("/dashboard/user/purchases");
          }
        } catch (error) {
          console.error("Failed to update database:", error);
          toast.error("Failed to sync dashboard.");
          router.push("/dashboard/user/purchases");
        }
      };

      savePurchaseToDB();
    }
  }, [artworkId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="p-8 bg-white shadow-xl rounded-2xl text-center max-w-md">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful! 🎉</h2>
        <p className="text-sm text-slate-500 mb-6">Please wait while we update your dashboard...</p>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#7C3AED]">
          <FaSpinner className="animate-spin text-lg" />
          <span>Updating Dashboard...</span>
        </div>
      </div>
    </div>
  );
}