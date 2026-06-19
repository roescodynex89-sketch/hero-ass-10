"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FaPalette,
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPaintBrush,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { role: "user" },
  });

  const password = watch("password");

  //
  const onSubmit = async (data) => {
    setAuthError("");
    setIsSubmitting(true);
    try {
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        callbackURL: "/",
      });

      if (response?.error) {
        setAuthError(response.error.message || "Registration failed.");
        return;
      }

      if (response?.data) {
        if (data.role === "artist") {
          router.push("/dashboard/artist");
        } else {
          router.push("/dashboard/user");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError("Registration failed. Email might already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setAuthError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign up error:", error);
      setAuthError("Google signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7C3AED] text-white mb-3 shadow-md">
            <FaPalette className="text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join ArtHub to discover & sell extraordinary art
          </p>
        </div>

        {authError && (
          <div className="p-3 text-sm text-[#EC4899] bg-[#EC4899]/10 border border-[#EC4899]/20 rounded-xl text-center font-medium">
            {authError}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E2E8F0] dark:border-[#334155] rounded-xl bg-white dark:bg-[#0F172A] text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
        >
          <FaGoogle className="text-red-500 text-lg" />
          <span>Sign up with Google</span>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-[#E2E8F0] dark:border-[#334155]"></div>
          <span className="shrink mx-4 text-xs text-gray-400 uppercase tracking-wider">
            Or register with email
          </span>
          <div className="grow border-t border-[#E2E8F0] dark:border-[#334155]"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaUser />
              </span>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="text-[#EC4899] text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Join As
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  {...register("role")}
                  className="sr-only peer"
                />
                <div className="p-4 border rounded-xl flex flex-col items-center gap-2 transition-all bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155] peer-checked:border-[#7C3AED] peer-checked:ring-2 peer-checked:ring-[#7C3AED]/20 text-gray-500 dark:text-gray-400 peer-checked:text-[#7C3AED]">
                  <FaUser className="text-xl" />
                  <span className="text-sm font-semibold">Buyer / User</span>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="artist"
                  {...register("role")}
                  className="sr-only peer"
                />
                <div className="p-4 border rounded-xl flex flex-col items-center gap-2 transition-all bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155] peer-checked:border-[#7C3AED] peer-checked:ring-2 peer-checked:ring-[#7C3AED]/20 text-gray-500 dark:text-gray-400 peer-checked:text-[#7C3AED]">
                  <FaPaintBrush className="text-xl" />
                  <span className="text-sm font-semibold">Artist</span>
                </div>
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 pointer-events-none">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters",
                  },
                })}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 pointer-events-none">
                <FaLock />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-transparent text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[#EC4899] text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/20 transition-all duration-200 mt-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting && <FaSpinner className="animate-spin" />}
            <span>Register Now</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
