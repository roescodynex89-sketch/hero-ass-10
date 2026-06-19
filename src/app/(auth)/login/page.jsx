"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FaPalette,
  FaGoogle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSpinner,
} from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // EMAIL
  const onSubmit = async (data) => {
    setAuthError("");
    setIsSubmitting(true);
    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      if (response?.error) {
        setAuthError(response.error.message || "Invalid email or password.");
        return;
      }

      if (response?.data?.user) {
        await authClient.reloadSession();

        const userRole = (response.data.user.role || "user")
          .toLowerCase()
          .trim();

        if (userRole === "artist") {
          router.push("/dashboard/artist");
        } else if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // GOOGLE
  const handleGoogleLogin = async () => {
    setAuthError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google login error:", error);
      setAuthError("Google authentication failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] px-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155]">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7C3AED] text-white mb-3 shadow-md">
            <FaPalette className="text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue to ArtHub
          </p>
        </div>

        {authError && (
          <div className="p-3 text-sm text-[#EC4899] bg-[#EC4899]/10 border border-[#EC4899]/20 rounded-xl text-center font-medium">
            {authError}
          </div>
        )}

        {/* Social Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E2E8F0] dark:border-[#334155] rounded-xl bg-white dark:bg-[#0F172A] text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
        >
          <FaGoogle className="text-red-500 text-lg" />
          <span>Continue with Google</span>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-[#E2E8F0] dark:border-[#334155]"></div>
          <span className="shrink mx-4 text-xs text-gray-400 uppercase tracking-wider">
            Or log in with email
          </span>
          <div className="grow border-t border-[#E2E8F0] dark:border-[#334155]"></div>
        </div>

        {/* Form Starts */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-[#EC4899] text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9]"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 pointer-events-none">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#EC4899] text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting && <FaSpinner className="animate-spin" />}
            <span>Sign In</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
