"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FaCheck, FaCrown, FaRocket, FaGem } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const plans = [
  {
    id: "free",
    name: "Free",
    planName: "free",
    price: "$0",
    limit: "3 paintings",
    icon: FaRocket,
    gradient: "from-slate-400 to-slate-600",
    features: ["Standard Access", "Basic Support", "Up to 3 Artworks"],
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    id: "pro",
    name: "Pro",
    planName: "pro",
    price: "$9.99",
    limit: "9 paintings",
    icon: FaCrown,
    gradient: "from-[#7C3AED] to-[#8B5CF6]",
    features: ["Pro Gallery Access", "Priority Support", "Up to 9 Artworks"],
    buttonText: "Upgrade to Pro",
    disabled: false,
  },
  {
    id: "premium",
    name: "Premium",
    planName: "premium",
    price: "$19.99",
    limit: "Unlimited",
    icon: FaGem,
    gradient: "from-[#8B5CF6] to-[#EC4899]",
    features: ["Unlimited Artworks", "Dedicated Support", "Early Access"],
    buttonText: "Get Premium",
    disabled: false,
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(null);
  const { data: session } = authClient.useSession();

  const handleCheckout = async (plan) => {
    if (plan.disabled) return;

    if (!session?.user) {
      toast.error("Please login first to upgrade your plan.");
      return;
    }

    setLoading(plan.id);
    try {
      const data = await fetchWithAuth(
        `/api/create-subscription-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ planName: plan.planName }),
        },
      );

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Session creation failed");
      }
    } catch (error) {
      toast.error("Something went wrong with checkout.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          Choose your <span className="text-[#7C3AED]">Artistic Tier</span>
        </h1>
        <p className="text-slate-500">
          Upgrade your experience and expand your collection limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-8 rounded-3xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white text-xl mb-6`}
            >
              <plan.icon />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {plan.name}
            </h3>
            <div className="mt-4 mb-6">
              <span className="text-5xl font-black">{plan.price}</span>
              <span className="text-slate-400">/month</span>
            </div>

            <div className="flex-grow space-y-4 mb-8">
              <div className="font-bold text-[#7C3AED]">{plan.limit}</div>
              {plan.features.map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
                >
                  <FaCheck className="text-[#22C55E]" />
                  {feat}
                </div>
              ))}
            </div>

            <button
              disabled={plan.disabled || loading === plan.id}
              onClick={() => handleCheckout(plan)}
              className={`w-full py-4 rounded-xl font-bold transition-all cursor-pointer disabled:cursor-not-allowed ${
                plan.disabled
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  : `bg-gradient-to-r ${plan.gradient} text-white hover:scale-[1.02] shadow-lg shadow-[#7C3AED]/20 disabled:opacity-60`
              }`}
            >
              {loading === plan.id ? "Processing..." : plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
