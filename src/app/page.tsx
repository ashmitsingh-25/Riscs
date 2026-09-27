import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Globe,
  Video,
  FileCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkles,
  Search,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScanHub } from "@/components/scan-hub";
import { ThreatFeed } from "@/components/threat-feed";
import { ScanHistory } from "@/components/scan-history";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24">
        {/* Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gray-100 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-black" />
            <span className="text-xs font-semibold text-black">
              TrustNet
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-black leading-[1.08]">
            Digital Trust.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-xl text-gray-500 leading-relaxed font-normal">
            Defend against threats with machine learning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a href="#scan-hub">
              <Button size="lg" className="shadow-md h-12 px-8 text-sm md:text-base font-semibold">
                Start Instant Inspection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#threat-feed">
              <Button variant="secondary" size="lg" className="h-12 px-6 text-sm md:text-base">
                View Live IOC Feed
              </Button>
            </a>
          </div>

          {/* Core Feature Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-black" />
              <span>Zero-Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-black" />
              <span>Vision Transformer</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-black" />
              <span>Heuristics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Scan Hub */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScanHub />
      </section>

      {/* Apple-style 4 Pillars Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-black">
            Four Core Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Pillar 1 */}
          <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-black mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Phishing & Malicious Sites</h3>
            <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
              Typosquatting distance algorithm, DGA entropy analysis, Punycode homograph alerts, and WHOIS domain age inspection.
            </p>
          </Card>

          {/* Pillar 2 */}
          <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-black mb-4">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Generative Deepfakes</h3>
            <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
              ViT vision transformer + Fourier FFT 2D spectral power analysis to expose synthetic checkerboards and temporal facial jitter.
            </p>
          </Card>

          {/* Pillar 3 */}
          <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-black mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Document Forensics</h3>
            <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
              JPEG Error Level Analysis (ELA) with localized noise variance clustering and OCR text integrity scanning.
            </p>
          </Card>

          {/* Pillar 4 */}
          <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-black mb-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Fraud & Identity Theft</h3>
            <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
              Detects account takeover (ATO) velocity bursts, geo-spoof mismatches, burner email domains, and sanctioned targets.
            </p>
          </Card>
        </div>
      </section>

      {/* Live Threat Feed and Historical Logs */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        <ThreatFeed />
        <ScanHistory />
      </section>
    </div>
  );
}
