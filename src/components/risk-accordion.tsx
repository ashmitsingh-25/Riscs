"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ExplainableFlag } from "@/types";
import { ShieldCheck, AlertCircle, Info, Sparkles, Terminal } from "lucide-react";

interface RiskAccordionProps {
  flags: ExplainableFlag[];
  engineDetails?: Record<string, any>;
}

export function RiskAccordion({ flags, engineDetails }: RiskAccordionProps) {
  if (!flags || flags.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 text-sm text-emerald-800">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <p className="font-semibold">Clean Baseline — No Active Flags Triggered</p>
          <p className="text-xs text-emerald-700/90 mt-0.5">
            The target passed all forensic heuristics, spectral checks, and indicator lookups.
          </p>
        </div>
      </div>
    );
  }

  const getBadgeVariant = (level: string) => {
    switch (level.toUpperCase()) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "danger";
      case "MEDIUM":
        return "warning";
      case "LOW":
      default:
        return "safe";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#86868b]">
          Explainable Risk Signals ({flags.length})
        </h4>
        <span className="text-xs text-[#86868b]">
          Click any factor to expand evidence
        </span>
      </div>

      <Accordion type="multiple" className="w-full space-y-2">
        {flags.map((flag, idx) => (
          <AccordionItem
            key={`flag-${idx}`}
            value={`item-${idx}`}
            className="rounded-2xl border border-black/[0.06] bg-white px-5 shadow-sm transition-all hover:border-black/15"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex flex-wrap items-center gap-2.5 text-left pr-3">
                <Badge variant={getBadgeVariant(flag.riskLevel)}>
                  {flag.riskLevel}
                </Badge>
                <span className="text-xs font-semibold text-[#86868b]">
                  [{flag.category}]
                </span>
                <span className="text-sm font-semibold text-[#1d1d1f]">
                  {flag.message}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1">
              <div className="rounded-xl bg-[#f5f5f7] p-4 text-xs md:text-sm text-[#424245]">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 text-[#0071e3] mt-0.5" />
                  <div>
                    <strong className="font-semibold text-[#1d1d1f]">
                      Forensic Findings:{" "}
                    </strong>
                    {flag.evidence || "Statistical discrepancy detected during automated model evaluation."}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Diagnostic Metadata Accordion Item */}
        {engineDetails && Object.keys(engineDetails).length > 0 && (
          <AccordionItem
            value="engine-diagnostics"
            className="rounded-2xl border border-black/[0.06] bg-[#fbfbfd] px-5 shadow-sm"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <Sparkles className="h-4 w-4 text-[#0071e3]" />
                <span className="text-sm font-semibold text-[#1d1d1f]">
                  Technical Engine Diagnostics & RAW Telemetry
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1">
              <div className="rounded-xl bg-[#1d1d1f] p-4 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner">
                <pre>{JSON.stringify(engineDetails, null, 2)}</pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
