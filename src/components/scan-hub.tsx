"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { URLScanner } from "@/components/url-scanner";
import { MediaScanner } from "@/components/media-scanner";
import { DocForensics } from "@/components/doc-forensics";
import { TransactionScanner } from "@/components/transaction-scanner";
import { Globe, Video, FileText, CreditCard, Sparkles } from "lucide-react";
import { ScanTaskData } from "@/types";

interface ScanHubProps {
  onScanComplete?: (scan: ScanTaskData) => void;
}

export function ScanHub({ onScanComplete }: ScanHubProps) {
  const [activeTab, setActiveTab] = useState("url");

  return (
    <Card className="border-black/[0.08] shadow-apple-card overflow-hidden" id="scan-hub">
      <CardHeader className="border-b border-black/[0.04] bg-white/50 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#0071e3]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0071e3]">
                Zero-Trust Verification Engine
              </span>
            </div>
            <CardTitle className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight">
              Interactive Trust Scanner
            </CardTitle>
            <CardDescription className="mt-1 max-w-2xl text-sm text-[#86868b]">
              Evaluate suspected URLs, verify deepfake synthetic video/audio, perform Error Level Analysis on documents, and audit fraudulent transactions.
            </CardDescription>
          </div>
        </div>

        {/* Apple Segmented Switcher */}
        <div className="pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1.5 gap-1 bg-[#f5f5f7]">
              <TabsTrigger value="url" className="flex items-center gap-2 py-2.5">
                <Globe className="h-4 w-4" />
                <span>URL & Phishing</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2 py-2.5">
                <Video className="h-4 w-4" />
                <span>Deepfake Media</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2 py-2.5">
                <FileText className="h-4 w-4" />
                <span>Doc Alteration (ELA)</span>
              </TabsTrigger>
              <TabsTrigger value="tx" className="flex items-center gap-2 py-2.5">
                <CreditCard className="h-4 w-4" />
                <span>Fraud & Identity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="pt-6">
              <URLScanner onScanComplete={onScanComplete} />
            </TabsContent>

            <TabsContent value="media" className="pt-6">
              <MediaScanner onScanComplete={onScanComplete} />
            </TabsContent>

            <TabsContent value="docs" className="pt-6">
              <DocForensics onScanComplete={onScanComplete} />
            </TabsContent>

            <TabsContent value="tx" className="pt-6">
              <TransactionScanner onScanComplete={onScanComplete} />
            </TabsContent>
          </Tabs>
        </div>
      </CardHeader>
    </Card>
  );
}
