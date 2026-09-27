"use client";

import React, { useState } from "react";
import { CreditCard, DollarSign, ShieldAlert, AlertCircle, Loader2, Sparkles, MapPin, Smartphone, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskMeter } from "@/components/risk-meter";
import { RiskAccordion } from "@/components/risk-accordion";
import { ScanTaskData } from "@/types";

interface TransactionScannerProps {
  onScanComplete?: (scan: ScanTaskData) => void;
}

export function TransactionScanner({ onScanComplete }: TransactionScannerProps) {
  const [amount, setAmount] = useState("3200");
  const [userHistoricalAvg, setUserHistoricalAvg] = useState("120");
  const [email, setEmail] = useState("user.target99@tempmail.com");
  const [ipCountry, setIpCountry] = useState("RU");
  const [billingCountry, setBillingCountry] = useState("US");
  const [deviceIsNew, setDeviceIsNew] = useState(true);
  const [velocityPastHour, setVelocityPastHour] = useState("4");
  const [hoursSincePasswordReset, setHoursSincePasswordReset] = useState("0.5");

  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanTaskData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAudit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TRANSACTION",
          transaction: {
            amount: parseFloat(amount) || 0,
            userHistoricalAvg: parseFloat(userHistoricalAvg) || 100,
            email: email.trim(),
            ipCountry: ipCountry.trim(),
            billingCountry: billingCountry.trim(),
            deviceIsNew: deviceIsNew,
            velocityPastHour: parseInt(velocityPastHour, 10) || 1,
            hoursSincePasswordReset: hoursSincePasswordReset ? parseFloat(hoursSincePasswordReset) : null,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to audit transaction");
      }

      setCurrentResult(data.scan);
      if (onScanComplete) {
        onScanComplete(data.scan);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Audit request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (preset: any) => {
    setAmount(preset.amount);
    setUserHistoricalAvg(preset.avg);
    setEmail(preset.email);
    setIpCountry(preset.ipCountry);
    setBillingCountry(preset.billingCountry);
    setDeviceIsNew(preset.deviceIsNew);
    setVelocityPastHour(preset.velocity);
    setHoursSincePasswordReset(preset.hoursReset);
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#86868b]">Simulate Scenarios:</span>
        <button
          type="button"
          onClick={() =>
            applyPreset({
              amount: "4800",
              avg: "120",
              email: "victim@tempmail.com",
              ipCountry: "RU",
              billingCountry: "US",
              deviceIsNew: true,
              velocity: "5",
              hoursReset: "0.2",
            })
          }
          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
        >
          High-Risk Account Takeover (ATO)
        </button>

        <button
          type="button"
          onClick={() =>
            applyPreset({
              amount: "85",
              avg: "95",
              email: "alex@company.com",
              ipCountry: "US",
              billingCountry: "US",
              deviceIsNew: false,
              velocity: "1",
              hoursReset: "720",
            })
          }
          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          Authentic Everyday Payment
        </button>

        <button
          type="button"
          onClick={() =>
            applyPreset({
              amount: "750",
              avg: "150",
              email: "dev@gmail.com",
              ipCountry: "GB",
              billingCountry: "US",
              deviceIsNew: true,
              velocity: "2",
              hoursReset: "48",
            })
          }
          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
        >
          Cross-Border Travel Spurt
        </button>
      </div>

      {/* Transaction Parameter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl border border-black/[0.08] bg-[#f5f5f7]/40 p-6">
        <div>
          <label className="text-xs font-semibold text-[#1d1d1f]">
            Transaction Amount ($ USD)
          </label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-[#86868b]" />
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-9"
              placeholder="5000"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1d1d1f]">
            User 90-Day Baseline Avg ($ USD)
          </label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-[#86868b]" />
            <Input
              value={userHistoricalAvg}
              onChange={(e) => setUserHistoricalAvg(e.target.value)}
              className="pl-9"
              placeholder="120"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1d1d1f]">
            User Account Email
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            placeholder="user@example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-[#1d1d1f]">
              Origin IP Country
            </label>
            <Input
              value={ipCountry}
              onChange={(e) => setIpCountry(e.target.value)}
              className="mt-1 uppercase"
              maxLength={2}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1d1d1f]">
              Billing Country
            </label>
            <Input
              value={billingCountry}
              onChange={(e) => setBillingCountry(e.target.value)}
              className="mt-1 uppercase"
              maxLength={2}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1d1d1f]">
            Transactions Past 60 Minutes (Velocity)
          </label>
          <Input
            type="number"
            value={velocityPastHour}
            onChange={(e) => setVelocityPastHour(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1d1d1f]">
            Hours Since Password Reset
          </label>
          <Input
            type="number"
            value={hoursSincePasswordReset}
            onChange={(e) => setHoursSincePasswordReset(e.target.value)}
            className="mt-1"
            placeholder="e.g. 0.5"
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between pt-2 border-t border-black/5">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1d1d1f]">
            <input
              type="checkbox"
              checked={deviceIsNew}
              onChange={(e) => setDeviceIsNew(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-apple-blue focus:ring-apple-blue"
            />
            Flag as Unrecognized / First-Time Device Hardware Profile
          </label>

          <Button onClick={handleAudit} disabled={isLoading} className="px-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Audit Transaction Risk
              </>
            )}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs font-semibold text-[#ff453a] flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {errorMessage}
        </p>
      )}

      {/* Audit Output */}
      {currentResult && currentResult.riskResult && (
        <div className="space-y-6 pt-2 animate-in fade-in-50 duration-500">
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
