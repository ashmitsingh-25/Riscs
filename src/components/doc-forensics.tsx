"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, UploadCloud, Loader2, Sparkles, CheckCircle, ShieldAlert, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskMeter } from "@/components/risk-meter";
import { RiskAccordion } from "@/components/risk-accordion";
import { ScanTaskData } from "@/types";

interface DocForensicsProps {
  onScanComplete?: (scan: ScanTaskData) => void;
}

export function DocForensics({ onScanComplete }: DocForensicsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanTaskData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      setErrorMessage("");
      setCurrentResult(null);

      if (selected.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(selected);
        setPreview(objectUrl);
      } else {
        setPreview(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleExecuteScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "DOCUMENT");

      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze document forensics");
      }

      setCurrentResult(data.scan);
      if (onScanComplete) {
        onScanComplete(data.scan);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error running document forensics.");
    } finally {
      setIsScanning(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-black bg-gray-50 scale-[1.01]"
              : "border-black/10 bg-[#f5f5f7]/40 hover:bg-[#f5f5f7] hover:border-black/20"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-apple-card transition-transform duration-200 group-hover:scale-110">
            <FileText className="h-8 w-8 text-black" />
          </div>
          <h4 className="mt-4 text-lg font-bold text-[#1d1d1f]">
            Drop Document, ID Card, Invoice, or Bank Statement
          </h4>
          <p className="mt-1 text-xs md:text-sm text-[#86868b] max-w-sm">
            Performs Error Level Analysis (ELA) to detect spliced numbers, photoshop tampering, font alterations, and OCR inconsistencies.
          </p>
          <Button variant="secondary" size="sm" className="mt-5 pointer-events-none">
            Select Document
          </Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6 rounded-3xl border border-black/[0.08] bg-white p-6 shadow-sm">
          {preview ? (
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white">
              <img src={preview} alt="Doc preview" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-[#f5f5f7] border border-black/10">
              <FileText className="h-10 w-10 text-black" />
            </div>
          )}

          <div className="flex-1 space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="secondary">Document Asset</Badge>
              <span className="text-xs text-[#86868b]">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <h4 className="font-bold text-base text-[#1d1d1f] truncate max-w-md">
              {file.name}
            </h4>
            <p className="text-xs text-[#86868b]">
              Ready for OpenCV ELA noise variance & OCR alteration analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={clearSelection} disabled={isScanning}>
              Remove
            </Button>
            <Button onClick={handleExecuteScan} disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running ELA & OCR...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Forensics
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-xs font-semibold text-[#ff453a] flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {errorMessage}
        </p>
      )}

      {/* Forensic Results */}
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
