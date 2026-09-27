import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustNet — Digital Trust, Quantified & Verified",
  description:
    "Next-generation digital trust platform detecting phishing URLs, generative deepfakes, altered documents, and transaction fraud via real-time ML forensics.",
  keywords: [
    "deepfake detection",
    "phishing protection",
    "error level analysis",
    "document forensics",
    "zero trust",
    "transaction fraud",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] antialiased selection:bg-[#0071e3] selection:text-white flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        
        {/* Apple-style minimalist Footer */}
        <footer className="border-t border-black/[0.06] bg-[#f5f5f7]/60 py-12 text-xs text-[#86868b]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1d1d1f]">TrustNet Platform</span>
                <span>•</span>
                <span>Zero-Retention Digital Trust Microservice</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#scan-hub" className="hover:text-[#1d1d1f] transition-colors">
                  Inference Hub
                </a>
                <a href="#threat-feed" className="hover:text-[#1d1d1f] transition-colors">
                  Threat Feed
                </a>
                <a href="/login" className="hover:text-[#1d1d1f] transition-colors">
                  Analyst Access
                </a>
              </div>
            </div>
            <p className="text-[11px] text-[#86868b] leading-relaxed">
              Copyright © 2026 TrustNet Inc. All rights reserved. Zero-Retention ML Pipeline: Uploaded media and documents are hashed for IOC records and wiped from volatile memory immediately upon scoring.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
