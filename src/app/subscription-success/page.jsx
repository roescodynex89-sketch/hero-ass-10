"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasSaved = useRef(false);

  // URL থেকে শুধু প্ল্যানের নাম (যেমন: pro বা premium) নেওয়া হচ্ছে
  const planName = searchParams.get("planName");

  useEffect(() => {
    if (planName && !hasSaved.current) {
      hasSaved.current = true;

      const updateSubscriptionInDB = async () => {
        try {
          // ব্যাকএন্ডের API-তে শুধু planName পাঠানো হচ্ছে
          const data = await fetchWithAuth("/api/subscription-success", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ planName }),
          });
          
          if (data.success) {
            toast.success(`Successfully upgraded to ${planName} plan! 🎉`);
            // সফল হলে মেইন ড্যাশবোর্ডে রিডাইরেক্ট
            router.push("/dashboard/user");
          }
        } catch (error) {
          console.error("Failed to update subscription:", error);
          toast.error("Failed to update subscription dashboard.");
          router.push("/dashboard/user");
        }
      };

      updateSubscriptionInDB();
    }
  }, [planName, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="p-8 bg-white shadow-xl rounded-2xl text-center max-w-md mx-4">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Subscription Activated! 🚀</h2>
        <p className="text-sm text-slate-500 mb-6">Please wait while we provision your account premium privileges...</p>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#7C3AED]">
          <FaSpinner className="animate-spin text-lg" />
          <span>Upgrading Account...</span>
        </div>
      </div>
    </div>
  );
}