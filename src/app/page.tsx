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
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#0071e3]/10 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-4 py-1.5 shadow-apple-pill backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#0071e3]" />
            <span className="text-xs font-semibold text-[#1d1d1f]">
              Introducing TrustNet 2.0 • Real-Time AI Forensic Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1d1d1f] leading-[1.08] apple-headline">
            Digital Trust. <br />
            <span className="bg-gradient-to-r from-[#0071e3] via-[#409cff] to-[#1d1d1f] bg-clip-text text-transparent">
              Quantified and Verified.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-xl text-[#86868b] leading-relaxed font-normal">
            Defend against phishing campaigns, generative deepfakes, forged documents, and account takeovers with explainable machine learning models.
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
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-[#86868b]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
              <span>Zero-Retention Privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
              <span>Vision Transformer & ELA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
              <span>WHOIS & Typosquat Heuristics</span>
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#0071e3]">
            Multi-Modal Threat Shield
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1d1d1f]">
            Four Core Pillars of Identity Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Pillar 1 */}
          <Card className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-apple-card hover:shadow-apple-float transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0071e3]/10 text-[#0071e3] mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Phishing & Malicious Sites</h3>
            <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
              Typosquatting distance algorithm, DGA entropy analysis, Punycode homograph alerts, and WHOIS domain age inspection.
            </p>
          </Card>

          {/* Pillar 2 */}
          <Card className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-apple-card hover:shadow-apple-float transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 mb-4">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Generative Deepfakes</h3>
            <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
              ViT vision transformer + Fourier FFT 2D spectral power analysis to expose synthetic checkerboards and temporal facial jitter.
            </p>
          </Card>

          {/* Pillar 3 */}
          <Card className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-apple-card hover:shadow-apple-float transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Document Forensics</h3>
            <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
              JPEG Error Level Analysis (ELA) with localized noise variance clustering and OCR text integrity scanning.
            </p>
          </Card>

          {/* Pillar 4 */}
          <Card className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-apple-card hover:shadow-apple-float transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-4">
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
