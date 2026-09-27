"use client";

import React, { useState } from "react";
import { Globe, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiskMeter } from "@/components/risk-meter";
import { RiskAccordion } from "@/components/risk-accordion";
import { ScanTaskData } from "@/types";

interface URLScannerProps {
  onScanComplete?: (scan: ScanTaskData) => void;
}

export function URLScanner({ onScanComplete }: URLScannerProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanTaskData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleScan = async (targetUrl?: string) => {
    const urlToScan = targetUrl || url;
    if (!urlToScan || urlToScan.trim().length === 0) {
      setErrorMessage("Please enter a URL to analyze.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "URL",
          url: urlToScan.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to scan URL");
      }

      setCurrentResult(data.scan);
      if (onScanComplete) {
        onScanComplete(data.scan);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const sampleUrls = [
    { label: "Spoofed Apple Auth", url: "https://apple-id-verify.secure-login.xyz/portal" },
    { label: "PayPal Phish Kit", url: "http://185.220.101.5/paypal-invoice-confirm.html" },
    { label: "Authentic Apple Domain", url: "https://apple.com" },
  ];

  return (
    <div className="space-y-6">
      {/* Input Bar */}
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-semibold text-[#1d1d1f]">
          Target URL or IP Address
        </label>
        <div className="relative flex items-center">
          <Globe className="absolute left-4 h-5 w-5 text-[#86868b]" />
          <Input
            type="url"
            placeholder="e.g. https://auth-apple-support.security-gate.xyz"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            className="pl-12 pr-32 h-14 text-base rounded-full shadow-sm"
          />
          <Button
            onClick={() => handleScan()}
            disabled={isLoading}
            className="absolute right-2 h-10 px-6 rounded-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                Analyze
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-[#86868b]">Test samples:</span>
          {sampleUrls.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleScan(sample.url);
              }}
              className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <p className="text-xs font-semibold text-[#ff453a] flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMessage}
          </p>
        )}
      </div>

      {/* Dynamic Results */}
      {currentResult && currentResult.riskResult && (
        <div className="space-y-6 pt-4 animate-in fade-in-50 duration-500">
          <RiskMeter
            score={currentResult.riskResult.score}
            verdict={currentResult.riskResult.verdict}
            suggestedAction={currentResult.riskResult.suggestedAction}
          />
          <RiskAccordion
            flags={currentResult.riskResult.flags}
            engineDetails={currentResult.riskResult.engineDetails}
          />
        </div>
      )}
    </div>
  );
}
