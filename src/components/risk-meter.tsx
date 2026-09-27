"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getRiskTheme } from "@/lib/utils";

interface RiskMeterProps {
  score: number;
  verdict: string;
  suggestedAction?: string;
  compact?: boolean;
}

export function RiskMeter({
  score,
  verdict,
  suggestedAction,
  compact = false,
}: RiskMeterProps) {
  const theme = getRiskTheme(score);

  const getIcon = () => {
    if (score < 30) {
      return <ShieldCheck className="h-6 w-6 text-[#30d158]" />;
    } else if (score <= 70) {
      return <AlertTriangle className="h-6 w-6 text-[#ffd60a]" />;
    } else {
      return <AlertOctagon className="h-6 w-6 text-[#ff453a]" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-24">
          <Progress value={score} autoColorByScore className="h-2" />
        </div>
        <span className={`text-sm font-bold ${theme.colorClass}`}>
          {score.toFixed(0)}%
        </span>
        <Badge
          className={
            score < 30
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : score <= 70
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }
        >
          {verdict}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 rounded-3xl border border-black/[0.06] bg-[#f5f5f7]/60 p-6 md:p-8 backdrop-blur-sm">
      {/* Top Header & Big Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.bgClass} border ${theme.borderClass}`}>
            {getIcon()}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              Overall Risk Assessment
            </span>
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-bold tracking-tight text-[#1d1d1f]">
                {verdict.toUpperCase()}
              </h4>
              <Badge
                className={
                  score < 30
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : score <= 70
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-rose-100 text-rose-900 border-rose-300"
                }
              >
                {theme.label} Risk
              </Badge>
            </div>
          </div>
        </div>

        {/* Large Apple-style Score */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-0.5">
            <span className={`text-4xl md:text-5xl font-extrabold tracking-tight ${theme.colorClass}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-[#86868b]">/100</span>
          </div>
          <span className="text-[11px] font-medium text-[#86868b]">
            Threat Probability
          </span>
        </div>
      </div>

      {/* Sleek Progress Bar */}
      <div className="space-y-1.5 pt-2">
        <Progress value={score} autoColorByScore className="h-3.5 shadow-inner" />
        <div className="flex justify-between text-[11px] font-medium text-[#86868b]">
          <span className="text-emerald-600 font-semibold">0% Safe</span>
          <span className="text-amber-600 font-semibold">30% - 70% Suspicious</span>
          <span className="text-rose-600 font-semibold">100% Malicious</span>
        </div>
      </div>

      {/* Suggested Action Callout */}
      {suggestedAction && (
        <div className={`mt-2 flex items-start gap-3 rounded-2xl border p-4 text-xs md:text-sm ${theme.bgClass} ${theme.borderClass}`}>
          <CheckCircle2 className={`h-5 w-5 shrink-0 mt-0.5 ${theme.colorClass}`} />
          <div>
            <strong className="font-semibold text-[#1d1d1f]">Recommended Action: </strong>
            <span className="text-[#424245]">{suggestedAction}</span>
          </div>
        </div>
      )}
    </div>
  );
}
