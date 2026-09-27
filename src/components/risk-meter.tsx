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
      return <ShieldCheck className="h-6 w-6 text-cyan-500" />;
    } else if (score <= 70) {
      return <AlertTriangle className="h-6 w-6 text-violet-500" />;
    } else {
      return <AlertOctagon className="h-6 w-6 text-fuchsia-500" />;
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
              ? "bg-cyan-50 text-cyan-700 border-cyan-200"
              : score <= 70
              ? "bg-violet-50 text-violet-800 border-violet-200"
              : "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
          }
        >
          {verdict}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 rounded-3xl border border-black/10 bg-white p-6 md:p-8 shadow-sm">
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
              <h4 className="text-xl font-bold tracking-tight text-black">
                {verdict.toUpperCase()}
              </h4>
              <Badge
                className={
                  score < 30
                    ? "bg-cyan-100 text-cyan-800 border-cyan-300"
                    : score <= 70
                    ? "bg-violet-100 text-violet-900 border-violet-300"
                    : "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300"
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
        <div className="flex justify-between text-[11px] font-medium text-gray-500">
          <span className="text-cyan-600 font-semibold">0% Safe</span>
          <span className="text-violet-600 font-semibold">30% - 70% Suspicious</span>
          <span className="text-fuchsia-600 font-semibold">100% Malicious</span>
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
