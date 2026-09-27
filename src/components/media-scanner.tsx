"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileVideo, Image as ImageIcon, Loader2, Lock, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskMeter } from "@/components/risk-meter";
import { RiskAccordion } from "@/components/risk-accordion";
import { ScanTaskData } from "@/types";

interface MediaScannerProps {
  onScanComplete?: (scan: ScanTaskData) => void;
}

export function MediaScanner({ onScanComplete }: MediaScannerProps) {
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

      // Create preview for images
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
      "video/*": [".mp4", ".mov", ".webm", ".avi"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleExecuteScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", file.type.includes("video") ? "VIDEO" : "IMAGE");

      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process media scan");
      }

      setCurrentResult(data.scan);
      if (onScanComplete) {
        onScanComplete(data.scan);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error analyzing media file.");
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
      {/* Zero-Retention Privacy Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-gray-50 border border-black/10 px-4 py-2.5 text-xs text-black">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            Zero-Retention Privacy: Media is hashed, analyzed in memory, and purged immediately.
          </span>
        </div>
        <Badge variant="blue" className="hidden sm:inline-flex text-[10px]">
          SHA-256 Audit Only
        </Badge>
      </div>

      {/* Drag & Drop Zone */}
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
            <UploadCloud className="h-8 w-8 text-black" />
          </div>
          <h4 className="mt-4 text-lg font-bold text-[#1d1d1f]">
            Drag & drop biometric photo or video
          </h4>
          <p className="mt-1 text-xs md:text-sm text-[#86868b] max-w-sm">
            Supports MP4, MOV, WebM, JPEG, PNG (up to 50MB). Evaluated against ViT Vision Transformer & Fourier FFT spectral analyzer.
          </p>
          <Button variant="secondary" size="sm" className="mt-5 pointer-events-none">
            Choose from Device
          </Button>
        </div>
      ) : (
        /* Selected Media Preview Card */
        <div className="flex flex-col md:flex-row items-center gap-6 rounded-3xl border border-black/[0.08] bg-white p-6 shadow-sm">
          {preview ? (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-black/10">
              <img
                src={preview}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-[#f5f5f7] border border-black/10">
              <FileVideo className="h-12 w-12 text-black" />
            </div>
          )}

          <div className="flex-1 space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="secondary">{file.type.includes("video") ? "Video Stream" : "Image Frame"}</Badge>
              <span className="text-xs text-[#86868b]">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            <h4 className="font-bold text-base text-[#1d1d1f] truncate max-w-md">
              {file.name}
            </h4>
            <p className="text-xs text-[#86868b]">
              Ready for deepfake generative artifact and facial reenactment inspection.
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
                  Analyzing Frames...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run Deepfake AI Scan
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

      {/* Dynamic Results */}
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
