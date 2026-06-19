import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./provider.jsx"; // আগের স্টেপে তৈরি করা প্রোভাইডার ফাইল

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ArtHub - Digital Art Marketplace",
  description: "Discover and sell extraordinary digital artworks",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#0F172A] dark:bg-[#0F172A] dark:text-[#F8FAFC]">
        <Providers>
          <Navbar/>
          <main className="grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
