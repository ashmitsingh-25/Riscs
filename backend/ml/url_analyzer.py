import re
import math
import difflib
from urllib.parse import urlparse
from typing import Dict, Any, List, Tuple
from datetime import datetime, timezone

try:
    import whois
    WHOIS_AVAILABLE = True
except ImportError:
    WHOIS_AVAILABLE = False

try:
    import tldextract
    TLD_AVAILABLE = True
except ImportError:
    TLD_AVAILABLE = False

HIGH_VALUE_DOMAINS = [
    "apple.com", "google.com", "microsoft.com", "paypal.com",
    "amazon.com", "netflix.com", "chase.com", "bankofamerica.com",
    "wellsfargo.com", "binance.com", "coinbase.com", "instagram.com",
    "facebook.com", "twitter.com", "x.com", "github.com", "linkedin.com",
    "dropbox.com", "spotify.com", "adobe.com", "whatsapp.com", "telegram.org"
]

HIGH_RISK_TLDS = {
    "xyz", "top", "buzz", "work", "click", "rest", "fit", "gq", "cf",
    "ml", "ga", "country", "stream", "live", "zip", "mov", "cam", "icu"
}

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "secure", "account", "update", "banking",
    "confirm", "wallet", "support", "auth", "token", "suspended", "security",
    "recover", "billing", "invoice", "refund", "kyc", "portal", "2fa"
]

def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy to identify algorithmic / randomized domain strings."""
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob])
    return entropy

def check_ip_host(hostname: str) -> bool:
    """Check if the hostname is a direct IPv4 or IPv6 address."""
    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    return bool(re.match(ip_pattern, hostname))

def check_punycode_or_homograph(hostname: str) -> bool:
    """Check if the domain uses Punycode (xn--) or non-ASCII homograph characters."""
    if "xn--" in hostname.lower():
        return True
    try:
        hostname.encode("ascii")
        return False
    except UnicodeEncodeError:
        return True

def find_typosquatting(domain: str) -> Tuple[bool, str, float]:
    """
    Computes Levenshtein/gestalt similarity against known high-value targets.
    Returns (is_typosquat, target_domain, similarity_score).
    """
    clean_domain = domain.lower()
    for target in HIGH_VALUE_DOMAINS:
        if clean_domain == target:
            return False, target, 1.0
        
        # Strip common TLDs for root comparison
        target_root = target.split(".")[0]
        domain_root = clean_domain.split(".")[0]

        similarity = difflib.SequenceMatcher(None, domain_root, target_root).ratio()
        
        # If very close but not exact, or target is embedded inside domain
        if 0.78 <= similarity < 1.0 or (target_root in domain_root and domain_root != target_root):
            return True, target, round(similarity, 3)

    return False, "", 0.0

def get_whois_age_days(domain: str) -> Tuple[int, Dict[str, Any]]:
    """Query WHOIS to get domain age in days with fallback."""
    if not WHOIS_AVAILABLE:
        return 400, {"status": "whois_module_not_installed"}

    try:
        w = whois.whois(domain)
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
            
        if creation_date:
            if isinstance(creation_date, datetime):
                # Ensure tz-naive or UTC
                now = datetime.now()
                if creation_date.tzinfo:
                    now = datetime.now(timezone.utc)
                age_days = (now - creation_date).days
                return max(0, age_days), {
                    "registrar": str(w.registrar or "Unknown"),
                    "creation_date": str(creation_date),
                    "country": str(w.country or "Unknown")
                }
    except Exception as e:
        return -1, {"error": str(e)}

    return -1, {"status": "unavailable"}

def analyze_url_heuristics(url: str) -> Dict[str, Any]:
    """
    Main heuristic engine to analyze URLs for phishing, spoofing, and malicious intent.
    Returns composite risk score (0-100), verdict, actionable recommendations, and explainable flags.
    """
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""

    flags: List[Dict[str, Any]] = []
    risk_score = 0.0

    # 1. IP Host Check
    is_ip = check_ip_host(hostname)
    if is_ip:
        risk_score += 35.0
        flags.append({
            "category": "Host Obfuscation",
            "riskLevel": "HIGH",
            "message": "Raw IP Address Host",
            "evidence": f"URL uses direct IP {hostname} instead of a registered domain name."
        })

    # 2. Punycode / Homograph Attack
    is_homograph = check_punycode_or_homograph(hostname)
    if is_homograph:
        risk_score += 40.0
        flags.append({
            "category": "Brand Impersonation",
            "riskLevel": "CRITICAL",
            "message": "Punycode / Homoglyph Deception",
            "evidence": f"Domain {hostname} contains internationalized characters often used to spoof legitimate brands."
        })

    # 3. TLD extraction & Risk
    tld = ""
    domain_name = hostname
    if TLD_AVAILABLE:
        extracted = tldextract.extract(hostname)
        tld = extracted.suffix.lower()
        domain_name = f"{extracted.domain}.{extracted.suffix}" if extracted.domain else hostname
    else:
        parts = hostname.split(".")
        if len(parts) > 1:
            tld = parts[-1].lower()
            domain_name = ".".join(parts[-2:])

    if tld in HIGH_RISK_TLDS:
        risk_score += 25.0
        flags.append({
            "category": "Domain Reputation",
            "riskLevel": "MEDIUM",
            "message": f"High-Abuse Top Level Domain (. {tld})",
            "evidence": f"The '.{tld}' TLD has a statistically high correlation with disposable phishing infrastructure."
        })

    # 4. Typosquatting Check
    is_typo, target_brand, sim = find_typosquatting(domain_name)
    if is_typo:
        risk_score += 45.0
        flags.append({
            "category": "Typosquatting",
            "riskLevel": "CRITICAL",
            "message": f"Target Brand Spoofing Detected ({target_brand})",
            "evidence": f"Domain '{domain_name}' is {int(sim * 100)}% visually identical to authentic brand target '{target_brand}'."
        })

    # 5. Suspicious Subdomains & Chaining
    subdomain_parts = hostname.split(".")
    if len(subdomain_parts) > 3:
        risk_score += 15.0
        flags.append({
            "category": "DNS Complexity",
            "riskLevel": "LOW",
            "message": "Excessive Subdomain Chaining",
            "evidence": f"Found {len(subdomain_parts)} domain segments ({hostname}), commonly used in phishing kits."
        })

    # 6. Keyword Poisoning
    found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in hostname.lower() or kw in path.lower() or kw in query.lower()]
    if found_keywords and (is_typo or is_ip or tld in HIGH_RISK_TLDS or len(found_keywords) >= 2):
        risk_score += min(30.0, len(found_keywords) * 12.0)
        flags.append({
            "category": "Credential Harvesting",
            "riskLevel": "HIGH",
            "message": "Phishing Trigger Keywords Detected",
            "evidence": f"URL parameters contain high-urgency keywords: {', '.join(found_keywords)}."
        })

    # 7. Shannon Entropy
    entropy = calculate_entropy(hostname)
    if entropy > 3.8 and len(hostname) > 15:
        risk_score += 15.0
        flags.append({
            "category": "DGA Pattern",
            "riskLevel": "MEDIUM",
            "message": "High Randomness (DGA Entropy)",
            "evidence": f"Domain entropy is {entropy:.2f} (threshold: 3.80), indicative of algorithmic generation."
        })

    # 8. Protocol Security
    if parsed.scheme == "http" and not is_ip:
        risk_score += 10.0
        flags.append({
            "category": "Transport Security",
            "riskLevel": "LOW",
            "message": "Unencrypted HTTP Protocol",
            "evidence": "URL transmits data in plaintext without valid SSL/TLS encryption."
        })

    # 9. Domain Age (WHOIS)
    domain_age_days, whois_meta = get_whois_age_days(domain_name)
    if 0 <= domain_age_days < 30:
        risk_score += 35.0
        flags.append({
            "category": "Domain Lifecycle",
            "riskLevel": "HIGH",
            "message": f"Newly Registered Domain ({domain_age_days} days old)",
            "evidence": f"Domain was registered within the last 30 days ({whois_meta.get('creation_date', 'recent')})."
        })
    elif 30 <= domain_age_days < 90:
        risk_score += 15.0
        flags.append({
            "category": "Domain Lifecycle",
            "riskLevel": "MEDIUM",
            "message": f"Young Domain ({domain_age_days} days old)",
            "evidence": "Domain is less than 90 days old."
        })

    # Cap risk score at 100
    final_score = min(100.0, round(risk_score, 1))

    # Verdict & Suggested Actions
    if final_score < 30.0:
        verdict = "SAFE"
        suggested_action = "No malicious indicators detected. Safe to browse, but always verify TLS certificate."
    elif final_score <= 70.0:
        verdict = "SUSPICIOUS"
        suggested_action = "Exercise caution. Do not enter passwords, credit card numbers, or download unverified attachments."
    else:
        verdict = "MALICIOUS"
        suggested_action = "CRITICAL: Block traffic immediately. Add domain/IP to firewall threat blacklists."

    return {
        "score": final_score,
        "verdict": verdict,
        "suggestedAction": suggested_action,
        "flags": flags,
        "engineDetails": {
            "hostname": hostname,
            "tld": tld,
            "entropy": round(entropy, 2),
            "domainAgeDays": domain_age_days,
            "whois": whois_meta,
            "checkedAt": datetime.now(timezone.utc).isoformat()
        }
    }
