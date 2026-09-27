import math
from typing import Dict, Any, List
from datetime import datetime, timezone

DISPOSABLE_EMAIL_DOMAINS = {
    "tempmail.com", "guerrillamail.com", "10minutemail.com", "mailinator.com",
    "throwawaymail.com", "sharklasers.com", "yopmail.com", "dispostable.com"
}

HIGH_RISK_COUNTRIES = {"KP", "IR", "SY", "CU", "RU", "MM"}

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in km between two geo-coordinates."""
    r = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c

def audit_transaction_risk(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Audits financial transactions, crypto transfers, and user profile changes
    for signs of account takeover, identity theft, and fraudulent behavior.
    """
    amount = float(payload.get("amount", 0.0))
    user_avg_amount = float(payload.get("userHistoricalAvg", 150.0))
    email = payload.get("email", "").lower()
    ip_country = payload.get("ipCountry", "US").upper()
    billing_country = payload.get("billingCountry", "US").upper()
    device_is_new = bool(payload.get("deviceIsNew", False))
    velocity_1hr = int(payload.get("velocityPastHour", 1))
    hours_since_password_reset = payload.get("hoursSincePasswordReset", None)

    flags: List[Dict[str, Any]] = []
    risk_score = 0.0

    # 1. Amount Anomaly (Z-score / Ratio)
    if user_avg_amount > 0:
        ratio = amount / user_avg_amount
        if ratio >= 8.0 and amount > 500.0:
            risk_score += 35.0
            flags.append({
                "category": "Velocity & Amount",
                "riskLevel": "HIGH",
                "message": f"Abnormal Transaction Amount ({ratio:.1f}x Baseline Average)",
                "evidence": f"Attempted ${amount:,.2f} vs historic baseline of ${user_avg_amount:,.2f}."
            })
        elif ratio >= 4.0 and amount > 300.0:
            risk_score += 15.0
            flags.append({
                "category": "Velocity & Amount",
                "riskLevel": "MEDIUM",
                "message": "Elevated Transaction Amount",
                "evidence": f"Transaction amount is {ratio:.1f}x higher than 90-day median."
            })

    # 2. Geo-mismatch (IP country vs Billing Country)
    if ip_country != billing_country:
        risk_score += 25.0
        flags.append({
            "category": "Geo-Location Anomaly",
            "riskLevel": "HIGH",
            "message": "Cross-Border IP vs Billing Address Mismatch",
            "evidence": f"Request originated from {ip_country} while billing profile resides in {billing_country}."
        })

    if ip_country in HIGH_RISK_COUNTRIES or billing_country in HIGH_RISK_COUNTRIES:
        risk_score += 30.0
        flags.append({
            "category": "Sanctions & OFAC",
            "riskLevel": "CRITICAL",
            "message": "High-Risk / Sanctioned Jurisdiction",
            "evidence": f"Originating jurisdiction flagged in compliance watchlists."
        })

    # 3. Disposable / Burner Email
    domain = email.split("@")[-1] if "@" in email else ""
    if domain in DISPOSABLE_EMAIL_DOMAINS:
        risk_score += 30.0
        flags.append({
            "category": "Identity Verification",
            "riskLevel": "CRITICAL",
            "message": "Temporary / Disposable Email Domain",
            "evidence": f"Email host '{domain}' provides throwaway disposable mailboxes."
        })

    # 4. Password Reset & Instant Drain (Account Takeover - ATO)
    if hours_since_password_reset is not None and hours_since_password_reset < 2:
        risk_score += 40.0
        flags.append({
            "category": "Account Takeover (ATO)",
            "riskLevel": "CRITICAL",
            "message": "Immediate High-Value Transfer Post-Credential Reset",
            "evidence": f"Transaction initiated {hours_since_password_reset} hours following a critical credential modification."
        })

    # 5. Device Trust & Velocity Spikes
    if device_is_new and velocity_1hr >= 3:
        risk_score += 25.0
        flags.append({
            "category": "Device Fingerprint",
            "riskLevel": "HIGH",
            "message": "Unrecognized Device Burst Velocity",
            "evidence": f"First-time device identity initiated {velocity_1hr} operations in under 60 minutes."
        })
    elif device_is_new:
        risk_score += 10.0
        flags.append({
            "category": "Device Fingerprint",
            "riskLevel": "LOW",
            "message": "New Device Hardware Fingerprint",
            "evidence": "Session initialized from an unverified browser hardware profile."
        })

    final_score = min(100.0, round(risk_score, 1))

    if final_score < 30.0:
        verdict = "SAFE"
        suggested_action = "Approve transaction. Standard fraud parameters within normal tolerance."
    elif final_score <= 70.0:
        verdict = "SUSPICIOUS"
        suggested_action = "Trigger Step-Up 2FA (SMS OTP / Authenticator App / Hardware Key) prior to settlement."
    else:
        verdict = "MALICIOUS"
        suggested_action = "CRITICAL: Decline transaction immediately. Lock user account pending manual security review."

    return {
        "score": final_score,
        "verdict": verdict,
        "suggestedAction": suggested_action,
        "flags": flags,
        "engineDetails": {
            "amount": amount,
            "ipCountry": ip_country,
            "billingCountry": billing_country,
            "deviceTrusted": not device_is_new,
            "velocityHour": velocity_1hr,
            "auditedAt": datetime.now(timezone.utc).isoformat()
        }
    }
