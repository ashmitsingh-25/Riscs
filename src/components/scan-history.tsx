"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { History, Globe, Video, FileText, CreditCard, CheckCircle2, ChevronRight, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScanTaskData, ScanType } from "@/types";
import { formatTimeAgo, getRiskTheme, truncateText } from "@/lib/utils";
import { RiskMeter } from "./risk-meter";
import { RiskAccordion } from "./risk-accordion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ScanHistoryProps {
  initialScans?: ScanTaskData[];
}

export function ScanHistory({ initialScans = [] }: ScanHistoryProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [selectedScan, setSelectedScan] = useState<ScanTaskData | null>(null);

  const { data, mutate } = useSWR(
    `/api/scan?limit=25${filterType !== "ALL" ? `&type=${filterType}` : ""}`,
    fetcher,
    {
      fallbackData: { scans: initialScans },
      refreshInterval: 10000,
    }
  );

  const scans: ScanTaskData[] = data?.scans || [];

  const getTypeIcon = (type: ScanType) => {
    switch (type) {
      case "URL":
        return <Globe className="h-4 w-4 text-[#0071e3]" />;
      case "IMAGE":
      case "VIDEO":
        return <Video className="h-4 w-4 text-purple-600" />;
      case "DOCUMENT":
        return <FileText className="h-4 w-4 text-amber-600" />;
      case "TRANSACTION":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const filterOptions = [
    { label: "All Types", value: "ALL" },
    { label: "URLs", value: "URL" },
    { label: "Media (Deepfake)", value: "IMAGE" },
    { label: "Documents (ELA)", value: "DOCUMENT" },
    { label: "Transactions", value: "TRANSACTION" },
  ];

  return (
    <Card className="border-black/[0.08] shadow-apple-card">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#86868b]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
              Audited Records
            </span>
          </div>
          <CardTitle className="mt-1 text-xl md:text-2xl font-bold tracking-tight">
            Recent Inspections Log
          </CardTitle>
          <CardDescription className="text-xs text-[#86868b]">
            Historical verification trail with explainable risk flags and audit hashes.
          </CardDescription>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                filterType === opt.value
                  ? "bg-[#1d1d1f] text-white shadow-sm"
                  : "bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#e8e8ed]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {scans.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f7]">
              <History className="h-6 w-6 text-[#86868b]" />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1d1d1f]">No audits recorded yet</p>
            <p className="text-xs text-[#86868b]">
              Run an inspection in the Scan Hub above to generate records.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => {
              const score = scan.riskResult?.score ?? 0;
              const verdict = scan.riskResult?.verdict ?? "PENDING";
              const theme = getRiskTheme(score);
              const isSelected = selectedScan?.id === scan.id;

              return (
                <div
                  key={scan.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? "border-apple-blue shadow-md bg-white ring-1 ring-apple-blue"
                      : "border-black/[0.06] bg-[#f5f5f7]/50 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div
                    onClick={() => setSelectedScan(isSelected ? null : scan)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 cursor-pointer"
                  >
                    {/* Left Info */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white border border-black/10 shadow-sm">
                        {getTypeIcon(scan.type)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {scan.trackingId}
                          </Badge>
                          <span className="text-[11px] font-medium text-[#86868b]">
                            {formatTimeAgo(scan.createdAt)}
                          </span>
                        </div>
                        <p className="font-semibold text-xs md:text-sm text-[#1d1d1f] break-all max-w-md">
                          {truncateText(scan.target, 55)}
                        </p>
                      </div>
                    </div>

                    {/* Right Risk Score Bar & Verdict */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                      <div className="w-28 sm:w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-[#86868b]">{verdict}</span>
                          <span className={theme.colorClass}>{score.toFixed(1)}%</span>
                        </div>
                        <Progress value={score} autoColorByScore className="h-2" />
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 text-[#86868b] transition-transform duration-200 ${
                          isSelected ? "rotate-90 text-[#0071e3]" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isSelected && scan.riskResult && (
                    <div className="border-t border-black/5 bg-white p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#f5f5f7] p-3 rounded-2xl">
                        <div>
                          <span className="text-[#86868b]">Target SHA-256 Hash:</span>
                          <p className="font-mono font-semibold text-[#1d1d1f] truncate">
                            {scan.targetHash || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#86868b]">Scan Type:</span>
                          <p className="font-semibold text-[#1d1d1f]">{scan.type}</p>
                        </div>
                        <div>
                          <span className="text-[#86868b]">Verification Timestamp:</span>
                          <p className="font-semibold text-[#1d1d1f]">
                            {new Date(scan.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <RiskMeter
                        score={scan.riskResult.score}
                        verdict={scan.riskResult.verdict}
                        suggestedAction={scan.riskResult.suggestedAction}
                      />

                      <RiskAccordion
                        flags={scan.riskResult.flags}
                        engineDetails={scan.riskResult.engineDetails}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
