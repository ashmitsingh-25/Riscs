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
      colorClass: "text-[#30d158]",
      bgClass: "bg-[#30d158]/10",
      borderClass: "border-[#30d158]/30",
      glowClass: "shadow-[0_0_20px_rgba(48,209,88,0.25)]",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: "text-emerald-700",
      progressColor: "bg-[#30d158]",
      hex: "#30d158",
    };
  } else if (normalizedScore <= 70) {
    return {
      score: normalizedScore,
      label: "Suspicious",
      colorClass: "text-[#e5a900]",
      bgClass: "bg-[#ffd60a]/15",
      borderClass: "border-[#ffd60a]/40",
      glowClass: "shadow-[0_0_20px_rgba(255,214,10,0.25)]",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      badgeText: "text-amber-800",
      progressColor: "bg-[#ffd60a]",
      hex: "#ffd60a",
    };
  } else {
    return {
      score: normalizedScore,
      label: "Critical",
      colorClass: "text-[#ff453a]",
      bgClass: "bg-[#ff453a]/10",
      borderClass: "border-[#ff453a]/30",
      glowClass: "shadow-[0_0_25px_rgba(255,69,58,0.3)]",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      badgeText: "text-rose-700",
      progressColor: "bg-[#ff453a]",
      hex: "#ff453a",
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
