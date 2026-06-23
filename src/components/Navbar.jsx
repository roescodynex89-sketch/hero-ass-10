"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import {
  FaPalette,
  FaHome,
  FaImages,
  FaUsers,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import Image from "next/image";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user || null;

  const role = (session?.user?.role || "user").toLowerCase().trim();

  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter();
  const toggleMobileMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] shadow-sm dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LS--- Logo & Name */}
          <Link href="/" className="flex items-center space-x-2 text-[#7C3AED]">
            <FaPalette className="text-2xl" />
            <span className="text-xl font-bold tracking-wider">ArtHub</span>
          </Link>

          {/* CENTER: Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <Link
              href="/"
              className="flex items-center space-x-1 hover:text-[#7C3AED] transition-colors"
            >
              <FaHome /> <span>Home</span>
            </Link>
            <Link
              href="/artworks"
              className="flex items-center space-x-1 hover:text-[#7C3AED] transition-colors"
            >
              <FaImages /> <span>Artworks</span>
            </Link>
          </div>

          {/* Rs Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-xl transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon />
              )}
            </button>

            {/* Guest / Logged In State */}
            {!user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium hover:text-[#7C3AED] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/*  AVATAR TOGGLE BUTTON */}
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">
                    Hi, {user.name?.split(" ")[0]}
                  </span>

                  {user.image ? (
                    <div className="w-8 h-8 relative rounded-full overflow-hidden border border-[#7C3AED]">
                      <Image
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#7C3AED] to-[#EC4899] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <FaChevronDown
                    className={`text-[10px] text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/*  DROPDOWN OPTIONS */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] py-2 shadow-xl dark:border-[#334155] dark:bg-[#1E293B] z-50">
                    <div className="px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-xs font-bold text-slate-400 ">
                        Account: {role}
                      </p>
                    </div>

                    {role === "artist" ? (
                      <>
                        <Link
                          href="/dashboard/artist"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors font-semibold text-[#7C3AED]"
                        >
                          Artist Dashboard
                        </Link>
                        <Link
                          href="/dashboard/artist/my-artworks"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Manage Artworks
                        </Link>
                        <Link
                          href="/dashboard/artist/profile"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Profile Settings
                        </Link>

                        <Link
                          href="/dashboard/artist/sales-history"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Sales History
                        </Link>
                      </>
                    ) : role === "admin" ? (
                      <>
                        <Link
                          href="/dashboard/admin"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Admin Dashboard
                        </Link>

                        <Link
                          href="/dashboard/admin/transactions"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Transactions
                        </Link>

                        <Link
                          href="/dashboard/admin/artworks"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Artworks Control
                        </Link>

                        <Link
                          href="/dashboard/admin/users"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Manage Users
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard/user"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          User Dashboard
                        </Link>

                        <Link
                          href="/dashboard/user/billing"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          Plan
                        </Link>

                        <Link
                          href="/dashboard/user/collection"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          User collection
                        </Link>

                        <Link
                          href="/dashboard/user/purchases"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          User Purchases
                        </Link>

                        <Link
                          href="/dashboard/user/profile"
                          className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                        >
                          My Profile
                        </Link>
                      </>
                    )}
                    <hr className="border-[#E2E8F0] dark:border-[#334155] my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#EC4899] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] cursor-pointer font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-xl cursor-pointer"
            >
              {theme === "dark" ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-xl focus:outline-none cursor-pointer"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] px-4 py-4 space-y-3 shadow-inner dark:border-[#334155] dark:bg-[#0F172A]">
          <Link href="/" className="block font-medium text-[#7C3AED]">
            Home
          </Link>
          <Link
            href="/browse"
            className="block font-medium hover:text-[#7C3AED]"
          >
            Browse Artworks
          </Link>

          <hr className="border-[#E2E8F0] dark:border-[#334155]" />

          {!user ? (
            <div className="space-y-2">
              <Link
                href="/login"
                className="block w-full text-center py-2 font-medium border border-[#E2E8F0] dark:border-[#334155] rounded-lg"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full text-center py-2 font-medium text-white bg-[#7C3AED] rounded-lg"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 py-1">
                {user.image ? (
                  <div className="w-6 h-6 relative rounded-full overflow-hidden">
                    <Image
                      src={user.image}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-bold">Hi, {user.name}</span>
              </div>
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Account: {role}
              </p>

              {role === "artist" ? (
                <>
                  <Link
                    href="/dashboard/artist"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors font-semibold text-[#7C3AED]"
                  >
                    Artist Dashboard
                  </Link>
                  <Link
                    href="/dashboard/artist/my-artworks"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Manage Artworks
                  </Link>
                  <Link
                    href="/dashboard/artist/profile"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Profile Settings
                  </Link>

                  <Link
                    href="/dashboard/artist/sales-history"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Sales History
                  </Link>
                </>
              ) : role === "admin" ? (
                <>
                  <Link
                    href="/dashboard/admin"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    href="/dashboard/admin/transactions"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Transactions
                  </Link>

                  <Link
                    href="/dashboard/admin/artworks"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Artworks Control
                  </Link>

                  <Link
                    href="/dashboard/admin/users"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Manage Users
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/user"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    User Dashboard
                  </Link>

                  <Link
                    href="/dashboard/user/billing"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    Plan
                  </Link>

                  <Link
                    href="/dashboard/collection"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    User collection
                  </Link>

                  <Link
                    href="/dashboard/user/purchases"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    User Purchases
                  </Link>

                  <Link
                    href="/dashboard/user/profile"
                    className="block px-4 py-2 text-sm hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    My Profile
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-sm text-[#EC4899] font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
