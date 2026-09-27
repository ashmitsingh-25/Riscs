import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RiskTheme {
  score: number;
  label: "Safe" | "Suspicious" | "Critical";
  colorClass: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  badgeBg: string;
  badgeText: string;
  progressColor: string;
  hex: string;
}

export function getRiskTheme(score: number): RiskTheme {
  const normalizedScore = Math.max(0, Math.min(100, score));

  if (normalizedScore < 30) {
    return {
      score: normalizedScore,
      label: "Safe",
      colorClass: "text-cyan-500",
      bgClass: "bg-cyan-500/10",
      borderClass: "border-cyan-500/30",
      glowClass: "shadow-[0_0_20px_rgba(6,182,212,0.25)]",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      badgeText: "text-cyan-700",
      progressColor: "bg-cyan-500",
      hex: "#06b6d4",
    };
  } else if (normalizedScore <= 70) {
    return {
      score: normalizedScore,
      label: "Suspicious",
      colorClass: "text-violet-500",
      bgClass: "bg-violet-500/15",
      borderClass: "border-violet-500/40",
      glowClass: "shadow-[0_0_20px_rgba(139,92,246,0.25)]",
      badgeBg: "bg-violet-50 text-violet-800 border-violet-200",
      badgeText: "text-violet-800",
      progressColor: "bg-violet-500",
      hex: "#8b5cf6",
    };
  } else {
    return {
      score: normalizedScore,
      label: "Critical",
      colorClass: "text-fuchsia-500",
      bgClass: "bg-fuchsia-500/10",
      borderClass: "border-fuchsia-500/30",
      glowClass: "shadow-[0_0_25px_rgba(217,70,239,0.3)]",
      badgeBg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
      badgeText: "text-fuchsia-700",
      progressColor: "bg-fuchsia-500",
      hex: "#d946ef",
    };
  }
}

export function formatTimeAgo(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function truncateText(text: string, maxLen: number = 40): string {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + "...";
}
