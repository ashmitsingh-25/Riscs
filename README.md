# TrustNet — Digital-Trust & Multi-Modal Threat Verification Platform

TrustNet is an enterprise-grade digital trust platform designed to detect, verify against, and mitigate phishing URLs, generative deepfakes, manipulated documents (Error Level Analysis), fraudulent transactions, and identity theft in real-time.

---

## 🏛️ Architecture Overview

```
TrustNet/
├── backend/                       # Python FastAPI ML Microservice
│   ├── main.py                    # RESTful async inference endpoints (Pydantic typed)
│   ├── requirements.txt           # ML dependencies (Transformers, OpenCV, PyTesseract, Whois)
│   ├── ml/
│   │   ├── url_analyzer.py        # Heuristic typosquatting, DGA entropy, WHOIS domain age
│   │   ├── deepfake_detector.py   # ViT vision transformer + Fourier 2D FFT spectral analyzer
│   │   ├── document_forensics.py  # OpenCV Error Level Analysis (ELA) + OCR integrity
│   │   └── transaction_auditor.py # Velocity, geo-spoof, burner domains, and ATO detector
│   └── utils/
│       └── privacy.py             # Zero-Retention: memory wipe & SHA-256 audit hashing
│
├── prisma/
│   └── schema.prisma              # User, NextAuth, ScanTask, RiskResult, ThreatLog models
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth v5 credentials auth
│   │   │   ├── scan/              # API bridge to FastAPI inference & Prisma storage
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts  # Polling endpoint for long-running scans
│   │   │   └── threats/           # ThreatLog IOCs & PhishTank / URLhaus sync
│   │   │       ├── route.ts
│   │   │       └── sync/route.ts
│   │   ├── dashboard/page.tsx     # React Server Component for SOC dashboard
│   │   ├── login/page.tsx         # Apple-minimalist authentication card
│   │   ├── globals.css            # Apple design system tokens
│   │   ├── layout.tsx             # Root layout with Apple frosted top-nav
│   │   └── page.tsx               # Flagship interactive scanning experience
│   │
│   ├── components/
│   │   ├── navbar.tsx             # Frosted glass top-nav (no heavy sidebars)
│   │   ├── scan-hub.tsx           # Segmented switcher for all 4 detection engines
│   │   ├── url-scanner.tsx        # High-contrast URL & Phishing inspection bar
│   │   ├── media-scanner.tsx      # iOS-style drag & drop Deepfake analyzer
│   │   ├── doc-forensics.tsx      # ELA noise variance & OCR alteration inspector
│   │   ├── transaction-scanner.tsx# Financial ATO & fraud audit widget
│   │   ├── risk-meter.tsx         # Apple Health style score & progress bar (Green/Yellow/Red)
│   │   ├── risk-accordion.tsx     # Shadcn accordions for explainable risk factors
│   │   ├── threat-feed.tsx        # Real-time IOC intelligence ticker (PhishTank/URLhaus)
│   │   ├── scan-history.tsx       # Historical inspection logs with expandable details
│   │   └── ui/                    # Shadcn & Apple UI primitives
│   │
│   ├── lib/
│   │   ├── auth.ts                # NextAuth v5 credentials provider
│   │   ├── prisma.ts              # Singleton Prisma client
│   │   └── utils.ts               # Risk theming helpers & color calculations
│   └── types/
│       └── index.ts               # Shared TypeScript interfaces
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## 🚀 Quick Start

### 1. Python ML Microservice (FastAPI)

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
# Running on http://localhost:8000
```

### 2. Next.js 14 Frontend & API

```bash
# In the project root:
npm install

# Push database schema (or use in-memory fallback):
npx prisma generate
npx prisma db push

# Start dev server:
npm run dev
# Running on http://localhost:3000
```

---

## 🎨 Visualizing Risk (Apple-Style Minimalism)

* **Score < 30 (Safe)**: `#30d158` (Safe Green)
* **Score 30 – 70 (Suspicious)**: `#ffd60a` (Warning Amber)
* **Score > 70 (Critical)**: `#ff453a` (Danger Red)
* **Explainability**: Shadcn Accordions decode the exact mathematical anomaly (Levenshtein distance, Fourier frequency ratios, ELA noise variance, and OCR glyph elevation).
