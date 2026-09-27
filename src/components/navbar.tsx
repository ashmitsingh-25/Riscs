"use client";

import React from "react";
import Link from "next/link";
import { Shield, ShieldAlert, Activity, Lock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/70 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Status */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#1d1d1f]">
                Trust<span className="text-[#0071e3]">Net</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-[#86868b] uppercase -mt-1">
                Zero-Trust Verification
              </span>
            </div>
          </Link>

          {/* Microservice Live Status */}
          <div className="hidden items-center gap-2 rounded-full border border-black/[0.06] bg-[#f5f5f7]/80 px-3 py-1 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#30d158] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#30d158]"></span>
            </span>
            <span className="text-xs font-medium text-[#1d1d1f]">
              Inference Engine: <span className="text-emerald-700 font-semibold">Active</span>
            </span>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/dashboard"
            className="rounded-full px-4 py-2 text-xs md:text-sm font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors"
          >
            Dashboard
          </Link>
          <a
            href="#scan-hub"
            className="rounded-full px-4 py-2 text-xs md:text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/5 transition-colors"
          >
            Scan Hub
          </a>
          <a
            href="#threat-feed"
            className="rounded-full px-4 py-2 text-xs md:text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/5 transition-colors"
          >
            Threat Intelligence
          </a>
        </nav>

        {/* Action Button & User */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <a href="#scan-hub">
            <Button variant="default" size="sm" className="shadow-sm">
              New Inspection
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
