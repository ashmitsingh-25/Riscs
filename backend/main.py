import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime, timezone

from ml.url_analyzer import analyze_url_heuristics
from ml.deepfake_detector import analyze_image_deepfake, analyze_video_deepfake
from ml.document_forensics import analyze_document_forensics
from ml.transaction_auditor import audit_transaction_risk
from utils.privacy import compute_sha256

app = FastAPI(
    title="TrustNet Inference & Threat Detection Microservice",
    description="High-performance ML microservice for phishing, deepfakes, document tampering, and fraud audit.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Request & Response Schemas ---

class URLAnalysisRequest(BaseModel):
    url: str = Field(..., example="https://apple-security-login.verify-auth.xyz")

class TransactionAuditRequest(BaseModel):
    amount: float = Field(..., example=4500.00)
    userHistoricalAvg: float = Field(default=150.0, example=120.00)
    email: str = Field(..., example="victim@tempmail.com")
    ipCountry: str = Field(default="US", example="RU")
    billingCountry: str = Field(default="US", example="US")
    deviceIsNew: bool = Field(default=False, example=True)
    velocityPastHour: int = Field(default=1, example=4)
    hoursSincePasswordReset: Optional[float] = Field(default=None, example=0.5)

class ExplainableFlag(BaseModel):
    category: str
    riskLevel: str
    message: str
    evidence: Optional[str] = None

class InferenceResponse(BaseModel):
    trackingId: Optional[str] = None
    targetHash: Optional[str] = None
    target: str
    score: float = Field(..., ge=0.0, le=100.0, description="Risk score 0 (Safe) to 100 (Critical)")
    verdict: str = Field(..., description="SAFE | SUSPICIOUS | MALICIOUS")
    suggestedAction: str
    flags: List[ExplainableFlag]
    engineDetails: Dict[str, Any]
    analyzedAt: str

# --- Endpoints ---

@app.get("/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "TrustNet Inference Engine",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "modules": {
            "phishing_heuristics": "active",
            "vit_deepfake_detector": "active",
            "ela_document_forensics": "active",
            "transaction_auditor": "active",
            "zero_retention_privacy": "enforced"
        }
    }

@app.post("/analyze/url", response_model=InferenceResponse)
async def analyze_url(req: URLAnalysisRequest):
    """Analyze a URL for phishing, homograph attacks, typosquatting, and domain lifecycle anomalies."""
    if not req.url or len(req.url.strip()) == 0:
        raise HTTPException(status_code=400, detail="Invalid or empty URL")
    
    clean_url = req.url.strip()
    target_hash = compute_sha256(clean_url.encode("utf-8"))
    
    result = analyze_url_heuristics(clean_url)
    
    return InferenceResponse(
        target=clean_url,
        targetHash=target_hash,
        score=result["score"],
        verdict=result["verdict"],
        suggestedAction=result["suggestedAction"],
        flags=[ExplainableFlag(**f) for f in result["flags"]],
        engineDetails=result["engineDetails"],
        analyzedAt=datetime.now(timezone.utc).isoformat()
    )

@app.post("/detect/deepfake", response_model=InferenceResponse)
async def detect_deepfake(
    file: UploadFile = File(...),
    mediaType: Optional[str] = Form(None)
):
    """
    Detect deepfake synthetic artifacts in uploaded Image or Video.
    Zero-retention: Memory buffers are hashed and purged immediately following scoring.
    """
    try:
        content = await file.read()
        target_hash = compute_sha256(content)
        filename = file.filename or "media_upload"
        
        # Determine media type (image vs video)
        is_video = False
        content_type = (file.content_type or "").lower()
        if mediaType == "VIDEO" or "video" in content_type or filename.lower().endswith((".mp4", ".mov", ".avi", ".webm", ".mkv")):
            is_video = True

        if is_video:
            result = analyze_video_deepfake(content)
        else:
            result = analyze_image_deepfake(content)

        # Immediate privacy purge: clear content buffer from memory
        del content

        return InferenceResponse(
            target=filename,
            targetHash=target_hash,
            score=result["score"],
            verdict=result["verdict"],
            suggestedAction=result["suggestedAction"],
            flags=[ExplainableFlag(**f) for f in result["flags"]],
            engineDetails=result["engineDetails"],
            analyzedAt=datetime.now(timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/analyze/document", response_model=InferenceResponse)
async def analyze_document(
    file: UploadFile = File(...)
):
    """
    Perform forensic Error Level Analysis (ELA) and OCR integrity checks
    on identity cards, invoices, receipts, and altered document images.
    """
    try:
        content = await file.read()
        target_hash = compute_sha256(content)
        filename = file.filename or "document_upload"

        result = analyze_document_forensics(content, filename=filename)

        # Clear buffer immediately
        del content

        return InferenceResponse(
            target=filename,
            targetHash=target_hash,
            score=result["score"],
            verdict=result["verdict"],
            suggestedAction=result["suggestedAction"],
            flags=[ExplainableFlag(**f) for f in result["flags"]],
            engineDetails=result["engineDetails"],
            analyzedAt=datetime.now(timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document forensic error: {str(e)}")

@app.post("/analyze/transaction", response_model=InferenceResponse)
async def analyze_transaction(req: TransactionAuditRequest):
    """
    Audits financial and account activity for fraud rings, ATO, and identity theft.
    """
    target_str = f"Tx-${req.amount:.2f}-{req.email}"
    target_hash = compute_sha256(target_str.encode("utf-8"))
    
    result = audit_transaction_risk(req.dict())

    return InferenceResponse(
        target=target_str,
        targetHash=target_hash,
        score=result["score"],
        verdict=result["verdict"],
        suggestedAction=result["suggestedAction"],
        flags=[ExplainableFlag(**f) for f in result["flags"]],
        engineDetails=result["engineDetails"],
        analyzedAt=datetime.now(timezone.utc).isoformat()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
