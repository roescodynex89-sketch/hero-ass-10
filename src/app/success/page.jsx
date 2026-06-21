"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { HiCheckCircle, HiRefresh } from "react-icons/hi";

export default function SuccessPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session?.user?.id) {
     
      fetch("http://localhost:5000/api/user/upgrade-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          planName: "pro"
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("success");
            
            setTimeout(() => {
              router.push("/seeker");
            }, 2500);
          } else {
            setStatus("error");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("error");
        });
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-white px-4">
      <div className="bg-[#161b26] p-8 rounded-3xl border border-white/10 text-center max-w-sm w-full space-y-6 shadow-2xl">
        
        {status === "verifying" && (
          <>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-bold text-blue-400">Activating Premium Access</h2>
            <p className="text-gray-400 text-sm">Please wait while we securely update your account plan...</p>
          </>
        )}

        {status === "success" && (
          <>
            <HiCheckCircle className="text-6xl text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-xl font-bold text-emerald-400">Payment Successful!</h2>
            <p className="text-gray-400 text-sm">Your Plan has been upgraded to Pro. Redirecting to your dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mx-auto">❌</div>
            <h2 className="text-xl font-bold text-red-400">Update Failed</h2>
            <p className="text-gray-400 text-sm">Payment was received but database could not be updated. Please contact support.</p>
            <button 
              onClick={() => router.push("/seeker")}
              className="mt-2 text-xs bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all"
            >
              Go to Dashboard Manually
            </button>
          </>
        )}
      </div>
    </div>
  );
}