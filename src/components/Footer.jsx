"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaPalette,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.footer
      className="w-full border-t border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] transition-colors duration-300 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUpVariants}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#7C3AED]"
            >
              <FaPalette className="text-2xl" />
              <span className="text-xl font-bold tracking-wider">ArtHub</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              The premier marketplace for digital artists and collectors.
              Discover, buy, and sell extraordinary masterpieces.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Marketplace
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/browse"
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Browse Artworks
                </Link>
              </li>
              <li>
                <Link
                  href="/artists"
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions"
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Live Auctions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join our newsletter to get the latest drops and features.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 text-sm rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-transparent focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              />
              {/* Newsletter Button Hover Effect */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, backgroundColor: "#6D28D9" }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-[#7C3AED] text-white rounded-xl shadow-md shadow-[#7C3AED]/20 transition-colors flex items-center justify-center cursor-pointer"
              >
                <FaPaperPlane className="text-sm" />
              </motion.button>
            </form>
          </div>
        </div>

        <hr className="my-8 border-[#E2E8F0] dark:border-[#334155]" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {currentYear} ArtHub. All rights reserved.
          </p>

          {/* Social Icons Hover Scale Effect */}
          <div className="flex space-x-4">
            {[
              { icon: <FaFacebookF />, url: "#" },
              { icon: <FaTwitter />, url: "#" },
              { icon: <FaInstagram />, url: "#" },
              { icon: <FaLinkedinIn />, url: "#" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] hover:text-[#7C3AED] transition-colors text-sm"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
