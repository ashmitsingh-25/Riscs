import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_MOCK_THREATS = [
  {
    id: "ioc-1",
    indicator: "apple-id-verify-auth.xyz",
    type: "DOMAIN",
    threatType: "PHISHING",
    severity: "CRITICAL",
    source: "PhishTank",
    confidence: 0.99,
    isActive: true,
    details: { targetBrand: "Apple", asn: "AS13335 Cloudflare", kit: "Pro-Phish v4" },
    detectedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "ioc-2",
    indicator: "185.220.101.5",
    type: "IP",
    threatType: "MALWARE_HOST",
    severity: "HIGH",
    source: "URLhaus",
    confidence: 0.94,
    isActive: true,
    details: { payload: "Vidar Stealer", tags: ["c2", "loader", "stealer"] },
    detectedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "ioc-3",
    indicator: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    type: "HASH",
    threatType: "DEEPFAKE_SIGNATURE",
    severity: "HIGH",
    source: "TrustNet-Internal",
    confidence: 0.96,
    isActive: true,
    details: { format: "MP4", modelSignature: "LivePortrait-GAN-v2" },
    detectedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "ioc-4",
    indicator: "secure-paypal-payment-update.top",
    type: "DOMAIN",
    threatType: "PHISHING",
    severity: "CRITICAL",
    source: "Spamhaus",
    confidence: 0.98,
    isActive: true,
    details: { targetBrand: "PayPal", tldAbuseScore: 92 },
    detectedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "ioc-5",
    indicator: "chase-online-signon-portal.info",
    type: "DOMAIN",
    threatType: "FRAUD_RING",
    severity: "HIGH",
    source: "PhishTank",
    confidence: 0.95,
    isActive: true,
    details: { campaign: "Financial-ATO-Wave-9" },
    detectedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "15", 10);
  const severity = searchParams.get("severity");

  try {
    const threats = await prisma.threatLog.findMany({
      where: severity ? { severity: severity as any, isActive: true } : { isActive: true },
      take: limit,
      orderBy: { detectedAt: "desc" },
    });

    if (threats.length === 0) {
      return NextResponse.json({ threats: DEFAULT_MOCK_THREATS.slice(0, limit) });
    }

    return NextResponse.json({ threats });
  } catch (error) {
    // Return mock feed if DB is not populated or in development
    return NextResponse.json({ threats: DEFAULT_MOCK_THREATS.slice(0, limit) });
  }
}
