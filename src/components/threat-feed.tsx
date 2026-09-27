"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { ShieldAlert, RefreshCw, Radio, ExternalLink, ShieldCheck, Database, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreatLogData } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ThreatFeed() {
  const { data, error, mutate, isValidating } = useSWR("/api/threats", fetcher, {
    refreshInterval: 20000, // 20s live sync
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncFeeds = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/threats/sync", { method: "POST" });
      const result = await res.json();
      if (res.ok) {
        setSyncStatus(result.message);
        mutate();
      }
    } catch (e) {
      setSyncStatus("Failed to reach feed mirrors.");
    } finally {
      setIsSyncing(false);
    }
  };

  const threats: ThreatLogData[] = data?.threats || [];

  return (
    <Card className="border-black/[0.08] shadow-apple-card" id="threat-feed">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff453a] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff453a]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff453a]">
              Global Threat Intelligence Feed
            </span>
          </div>
          <CardTitle className="mt-1 text-xl md:text-2xl font-bold tracking-tight">
            Live Indicators of Compromise (IOCs)
          </CardTitle>
          <CardDescription className="text-xs text-[#86868b]">
            Automated ingestion from PhishTank, URLhaus, and TrustNet Honeypots.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSyncFeeds}
            disabled={isSyncing || isValidating}
            className="h-9 px-4 text-xs font-semibold"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isSyncing || isValidating ? "animate-spin" : ""}`} />
            Sync Feeds
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {syncStatus && (
          <div className="mb-4 rounded-2xl bg-gray-100 border border-black/10 p-3 text-xs text-black flex items-center justify-between animate-in fade-in-50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>{syncStatus}</span>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {threats.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#86868b]">
              Loading live threat intelligence...
            </div>
          ) : (
            threats.map((threat) => (
              <div
                key={threat.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-[#f5f5f7]/60 p-4 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        threat.severity === "CRITICAL"
                          ? "danger"
                          : threat.severity === "HIGH"
                          ? "danger"
                          : "warning"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {threat.severity}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {threat.type}
                    </Badge>
                    <span className="text-[11px] font-semibold text-[#86868b]">
                      via {threat.source}
                    </span>
                  </div>
                  <p className="font-mono text-xs md:text-sm font-semibold text-[#1d1d1f] break-all">
                    {threat.indicator}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[11px] font-medium text-[#86868b]">
                    {formatTimeAgo(threat.detectedAt)}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {(threat.confidence * 100).toFixed(0)}% Confidence
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
