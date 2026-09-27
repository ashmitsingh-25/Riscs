export type ScanType = 'URL' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'TRANSACTION';

export type ScanStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'ERROR';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ExplainableFlag {
  category: string;
  riskLevel: RiskLevel;
  message: string;
  evidence?: string;
}

export interface EngineDetails {
  [key: string]: any;
}

export interface RiskResultData {
  id?: string;
  scanTaskId?: string;
  score: number; // 0 - 100
  verdict: Verdict;
  suggestedAction: string;
  flags: ExplainableFlag[];
  engineDetails?: EngineDetails;
  createdAt?: string;
}

export interface ScanTaskData {
  id: string;
  trackingId: string;
  type: ScanType;
  status: ScanStatus;
  target: string;
  targetHash?: string | null;
  metadata?: any;
  userId?: string | null;
  riskResult?: RiskResultData | null;
  createdAt: string;
  updatedAt: string;
}

export interface ThreatLogData {
  id: string;
  indicator: string;
  type: 'DOMAIN' | 'IP' | 'HASH' | 'URL' | 'PATTERN';
  threatType: 'PHISHING' | 'DEEPFAKE_SIGNATURE' | 'MALWARE_HOST' | 'FRAUD_RING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  confidence: number;
  isActive: boolean;
  details?: any;
  detectedAt: string;
}

export interface DashboardStats {
  totalScans: number;
  threatsBlocked: number;
  avgRiskScore: number;
  activeThreatIocs: number;
  typeBreakdown: {
    urls: number;
    images: number;
    videos: number;
    documents: number;
    transactions: number;
  };
}
