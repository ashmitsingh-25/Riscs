import io
import os
import tempfile
import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from typing import Dict, Any, List, Tuple
from datetime import datetime, timezone

try:
    import pytesseract
    PYTESSERACT_AVAILABLE = True
except ImportError:
    PYTESSERACT_AVAILABLE = False


def perform_error_level_analysis(pil_img: Image.Image, quality: int = 90) -> Tuple[float, float, float, Dict[str, Any]]:
    """
    Computes Error Level Analysis (ELA) on an image.
    When a JPEG is resaved, the entire image should degrade at roughly the same rate.
    If a section of the image was copied, inserted, or modified after the original save,
    its compression error level will differ noticeably from the surrounding pixels.
    """
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
        temp_path = tmp_file.name

    try:
        # Save as 90% quality JPEG
        pil_rgb = pil_img.convert("RGB")
        pil_rgb.save(temp_path, "JPEG", quality=quality)
        
        # Read back resaved image
        resaved_img = Image.open(temp_path)
        
        # Calculate pixel difference
        ela_img = ImageChops.difference(pil_rgb, resaved_img)
        
        # Extrapolate differences to make subtle tampering visible
        extrema = ela_img.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0:
            max_diff = 1
        scale = 255.0 / max_diff
        
        ela_enhanced = ImageEnhance.Brightness(ela_img).enhance(scale)
        ela_np = np.array(ela_enhanced)

        # Compute noise variance across 16x16 grid patches
        gray_ela = cv2.cvtColor(ela_np, cv2.COLOR_RGB2GRAY)
        
        mean_intensity = float(np.mean(gray_ela))
        variance = float(np.var(gray_ela))
        std_dev = float(np.std(gray_ela))

        # Check for localized high-variance clusters (spliced text/stamps)
        h, w = gray_ela.shape
        patch_h, patch_w = max(16, h // 8), max(16, w // 8)
        patch_variances = []

        for y in range(0, h - patch_h + 1, patch_h):
            for x in range(0, w - patch_w + 1, patch_w):
                patch = gray_ela[y:y+patch_h, x:x+patch_w]
                patch_variances.append(float(np.var(patch)))

        max_patch_var = max(patch_variances) if patch_variances else variance
        patch_spread = max_patch_var - (min(patch_variances) if patch_variances else 0)

        metrics = {
            "meanElaIntensity": round(mean_intensity, 2),
            "noiseVariance": round(variance, 2),
            "stdDev": round(std_dev, 2),
            "maxLocalPatchVariance": round(max_patch_var, 2),
            "patchSpread": round(patch_spread, 2),
            "compressionQualityTested": quality
        }

        return mean_intensity, variance, patch_spread, metrics

    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


def extract_ocr_text(pil_img: Image.Image) -> Tuple[str, List[Dict[str, Any]]]:
    """Extracts OCR text from the document and inspects suspicious patterns."""
    extracted_text = ""
    suspicious_patterns: List[Dict[str, Any]] = []

    if not PYTESSERACT_AVAILABLE:
        return "[OCR Engine in Simulated Mode - pytesseract binary unavailable in environment]", []

    try:
        # Preprocess for OCR: grayscale and Otsu thresholding
        gray = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
        
        extracted_text = pytesseract.image_to_string(thresh)
        
        # Scan for conflicting amounts or altered invoice keywords
        lines = [line.strip() for line in extracted_text.split("\n") if line.strip()]
        
        # Check for duplicate total lines or mismatched currency signs
        total_counts = sum(1 for line in lines if "total" in line.lower() or "amount due" in line.lower())
        if total_counts > 2:
            suspicious_patterns.append({
                "category": "Document Structure",
                "riskLevel": "MEDIUM",
                "message": "Multiple Conflicting Total / Amount Statements",
                "evidence": f"Found {total_counts} distinct 'Total' declaration lines."
            })
            
    except Exception as e:
        extracted_text = f"[OCR Warning: {str(e)}]"

    return extracted_text[:1000], suspicious_patterns


def analyze_document_forensics(file_bytes: bytes, filename: str = "document.jpg") -> Dict[str, Any]:
    """
    Main forensic pipeline for checking altered IDs, forged invoices,
    receipts, bank statements, and contract tampering.
    """
    try:
        pil_img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except Exception as e:
        return {
            "score": 0.0,
            "verdict": "ERROR",
            "suggestedAction": "Unable to process document format.",
            "flags": [{"category": "Format", "riskLevel": "CRITICAL", "message": f"Unsupported or corrupt file: {str(e)}"}],
            "engineDetails": {}
        }

    flags: List[Dict[str, Any]] = []
    risk_score = 0.0

    # 1. Error Level Analysis (ELA)
    mean_intensity, variance, patch_spread, ela_metrics = perform_error_level_analysis(pil_img)

    # If patch spread is exceptionally high, localized insertion occurred
    if patch_spread > 1800.0:
        risk_score += 45.0
        flags.append({
            "category": "Copy-Move Forgery",
            "riskLevel": "CRITICAL",
            "message": "Localized Compression Discrepancy (ELA High Variance)",
            "evidence": f"Local noise variance spread is {ela_metrics['patchSpread']}, indicating spliced numbers, stamps, or modified text."
        })
    elif patch_spread > 900.0:
        risk_score += 25.0
        flags.append({
            "category": "Compression Forensics",
            "riskLevel": "MEDIUM",
            "message": "Heterogeneous Compression Noise",
            "evidence": f"Variance divergence detected ({ela_metrics['patchSpread']}). Potential resaving over edited layer."
        })

    # 2. Metadata / EXIF Inspection
    exif = getattr(pil_img, "_getexif", lambda: None)()
    software_tag = None
    if exif:
        # Tag 305 is Software
        software_tag = exif.get(305, None)
        if software_tag:
            software_str = str(software_tag).lower()
            if any(tool in software_str for tool in ["photoshop", "gimp", "canva", "illustrator", "paint.net"]):
                risk_score += 30.0
                flags.append({
                    "category": "Metadata Provenance",
                    "riskLevel": "HIGH",
                    "message": f"Editing Software Footprint ({software_tag})",
                    "evidence": f"EXIF metadata indicates manipulation via {software_tag}."
                })

    # 3. OCR Text and Semantic Anomaly Verification
    ocr_preview, ocr_flags = extract_ocr_text(pil_img)
    if ocr_flags:
        risk_score += 20.0
        flags.extend(ocr_flags)

    final_score = min(100.0, round(risk_score, 1))

    if final_score < 30.0:
        verdict = "SAFE"
        suggested_action = "Document exhibits uniform compression layers and intact baseline forensic consistency."
    elif final_score <= 70.0:
        verdict = "SUSPICIOUS"
        suggested_action = "Inconsistent compression error rates detected. Request original PDF or vector source."
    else:
        verdict = "MALICIOUS"
        suggested_action = "CRITICAL: Document forgery detected. Evidence of spliced text or altered financial figures."

    return {
        "score": final_score,
        "verdict": verdict,
        "suggestedAction": suggested_action,
        "flags": flags,
        "engineDetails": {
            "filename": filename,
            "dimensions": f"{pil_img.width}x{pil_img.height}",
            "elaMetrics": ela_metrics,
            "softwareSignature": str(software_tag) if software_tag else "None / Stripped",
            "ocrTextSnippet": ocr_preview[:200] if ocr_preview else "",
            "analyzedAt": datetime.now(timezone.utc).isoformat()
        }
    }
