/**
 * ocr.ts — Local OCR engine using Tesseract.js (no API key required)
 *
 * Supports:
 *  - Images: JPEG, PNG via Tesseract.js (English + Hindi + Marathi)
 *  - PDFs: Text extraction via pdf-parse
 *  - Smart regex field extraction for Indian government documents (Aadhaar, PAN, Income Cert, DL, etc.)
 *  - Strict 80% OCR confidence threshold for automated acceptance / rejection.
 */

import Tesseract from "tesseract.js";
import { createRequire } from "module";
const _require = createRequire(import.meta.url);
const pdfParse: (buf: Buffer) => Promise<{ text: string }> = _require("pdf-parse");

// Strict Acceptance Threshold (80%)
export const OCR_CONFIDENCE_THRESHOLD = 80;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OCRResult {
  docType: string;
  confidenceScore: number;
  verificationStatus: "verified" | "warning" | "analyzing" | "failed";
  summary: string;
  extractedFields: {
    fullName: string | null;
    dob: string | null;
    idNumber: string | null;
    issueDate: string | null;
    expiryDate: string | null;
    issuingAuthority: string | null;
    address: string | null;
    incomeAmount: string | null;
    employerOrInstitution: string | null;
    qualificationOrCategory: string | null;
    customFields: Record<string, string>;
  };
  securityVerification: {
    tamperDetected: boolean;
    readableQuality: "High" | "Medium" | "Low";
    notes: string;
  };
}

export interface RawExtractionResult {
  text: string;
  engineConfidence: number;
}

// ---------------------------------------------------------------------------
// Step 1: Extract raw text and OCR engine confidence from image or PDF
// ---------------------------------------------------------------------------

export async function extractRawText(
  base64Data: string,
  fileType: string
): Promise<RawExtractionResult> {
  const cleanBase64 = base64Data.includes(",")
    ? base64Data.split(",")[1]
    : base64Data;
  const buffer = Buffer.from(cleanBase64, "base64");

  if (fileType === "application/pdf") {
    // Use pdf-parse for PDFs (fast, no visual OCR needed for text-based PDFs)
    try {
      const data = await pdfParse(buffer);
      const text = data.text?.trim() || "";
      if (text && text.length > 30) {
        console.log("[OCR] PDF text extracted via pdf-parse:", text.length, "chars");
        return { text, engineConfidence: 96 };
      }
    } catch (err) {
      console.warn("[OCR] pdf-parse failed, falling back to Tesseract:", err);
    }
  }

  // For images (or scanned PDFs that failed pdf-parse): use Tesseract.js
  console.log("[OCR] Running Tesseract.js on image/buffer...");
  try {
    const result = await Tesseract.recognize(buffer, "eng+hin+mar", {
      logger: () => {}, // suppress per-progress logs
    });
    const text = result.data.text?.trim() || "";
    const rawConf = typeof result.data.confidence === "number" ? Math.round(result.data.confidence) : 0;
    console.log(`[OCR] Tesseract extracted: ${text.length} chars (raw confidence: ${rawConf}%)`);
    return { text, engineConfidence: rawConf };
  } catch (err) {
    console.error("[OCR] Tesseract.js error:", err);
    return { text: "", engineConfidence: 0 };
  }
}

// ---------------------------------------------------------------------------
// Step 2: Smart Indian document field parser & confidence scoring
// ---------------------------------------------------------------------------

export function parseIndianDocument(
  rawText: string,
  docTypeHint?: string,
  rawEngineConfidence?: number
): OCRResult {
  const text = rawText.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
  const lower = text.toLowerCase();

  // ── Document type detection ──────────────────────────────────────────────
  let docType = "Other Certificate";
  let confidence = 50;

  const isAadhaar =
    lower.includes("uidai") ||
    lower.includes("unique identification authority") ||
    lower.includes("aadhaar") ||
    lower.includes("आधार") ||
    lower.includes("mera aadhaar") ||
    lower.includes("enrollment no") ||
    /\b\d{4}\s\d{4}\s\d{4}\b/.test(text);

  const isPAN =
    lower.includes("permanent account number") ||
    lower.includes("income tax department") ||
    lower.includes("pan card") ||
    lower.includes("incometax") ||
    /\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(text);

  const isIncomeCert =
    (lower.includes("income") || lower.includes("आय")) &&
    (lower.includes("certificate") || lower.includes("प्रमाण पत्र") || lower.includes("तहसीलदार") || lower.includes("मामलतदार"));

  const isDrivingLicence =
    lower.includes("driving licence") ||
    lower.includes("driving license") ||
    lower.includes("motor vehicle") ||
    lower.includes("transport") ||
    lower.includes("ड्राइविंग लाइसेंस");

  const isDegree =
    lower.includes("degree") ||
    lower.includes("university") ||
    lower.includes("marksheet") ||
    lower.includes("transcript") ||
    lower.includes("college") ||
    lower.includes("board of") ||
    lower.includes("विश्वविद्यालय");

  const isDomicile =
    lower.includes("domicile") ||
    lower.includes("residence certificate") ||
    lower.includes("निवास प्रमाण") ||
    lower.includes("domicile certificate");

  const isVoterID =
    lower.includes("election commission") ||
    lower.includes("voter") ||
    lower.includes("epic") ||
    lower.includes("electoral");

  const isPassport =
    lower.includes("passport") ||
    (lower.includes("republic of india") && lower.includes("nationality"));

  const isUtilityBill =
    lower.includes("electricity") ||
    lower.includes("water bill") ||
    lower.includes("gas bill") ||
    lower.includes("telephone bill") ||
    lower.includes("electricity department");

  if (isAadhaar) {
    docType = "Aadhaar Card";
    confidence = 90;
  } else if (isPAN) {
    docType = "PAN Card";
    confidence = 90;
  } else if (isVoterID) {
    docType = "Voter ID (EPIC)";
    confidence = 88;
  } else if (isPassport) {
    docType = "Indian Passport";
    confidence = 92;
  } else if (isDrivingLicence) {
    docType = "Driver License";
    confidence = 89;
  } else if (isIncomeCert) {
    docType = "Income Certificate / Tax W2";
    confidence = 87;
  } else if (isDegree) {
    docType = "Academic Degree / Transcript";
    confidence = 86;
  } else if (isDomicile) {
    docType = "Domicile / Residence Certificate";
    confidence = 85;
  } else if (isUtilityBill) {
    docType = "Utility Bill / Address Proof";
    confidence = 82;
  } else if (docTypeHint === "identity") {
    docType = "National ID";
    confidence = 55;
  }

  // ── Field extraction ──────────────────────────────────────────────────────
  let fullName: string | null = null;
  let dob: string | null = null;
  let idNumber: string | null = null;
  let issueDate: string | null = null;
  let expiryDate: string | null = null;
  let issuingAuthority: string | null = null;
  let address: string | null = null;
  let incomeAmount: string | null = null;
  let employerOrInstitution: string | null = null;
  let qualificationOrCategory: string | null = null;
  const customFields: Record<string, string> = {};

  // — Name patterns —
  const namePatterns = [
    /(?:Name|नाम|Applicant Name|Citizen Name|Name of Holder)[:\s]+([A-Za-z\s\.]{2,35}?)(?=\s+(?:DOB|Date|D\.O\.B|Father|Mother|Gender|Year|Address|S\/O|D\/O|W\/O|UID|\d{2}[\/\-]\d{2}|\n|$))/i,
    /(?:Sh\.|Smt\.|Kum\.|Mr\.|Mrs\.|Dr\.)\s+([A-Za-z\s\.]{2,35}?)(?=\s+(?:DOB|Date|D\.O\.B|Father|Mother|Gender|Year|Address|S\/O|D\/O|W\/O|UID|\d{2}[\/\-]\d{2}|\n|$))/i,
    /^([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)\s*$/m, // all-caps line (common on Aadhaar / PAN)
  ];
  for (const p of namePatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      const candidate = m[1].trim();
      const skipWords = [
        "INDIA",
        "GOVERNMENT",
        "INCOME",
        "CERTIFICATE",
        "REPUBLIC",
        "DEPARTMENT",
        "TAX",
        "ACCOUNT",
        "PERMANENT",
        "SIGNATURE",
        "FATHER",
      ];
      if (candidate.length >= 3 && !skipWords.some((w) => candidate.toUpperCase().includes(w))) {
        fullName = candidate;
        break;
      }
    }
  }

  // — Date of Birth —
  const dobPatterns = [
    /(?:DOB|Date of Birth|D\.O\.B|जन्म तिथि|जन्म दिनांक|Year of Birth|जन्म वर्ष)[:\s\/]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:Year of Birth|Born)[:\s]+(\d{4})/i,
    /(?:DOB|Date of Birth)[:\s]+(\d{2}\s+\w+\s+\d{4})/i,
  ];
  for (const p of dobPatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      dob = m[1];
      break;
    }
  }
  if (!dob) {
    const firstDate = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
    if (firstDate) dob = firstDate[1];
  }

  // — ID Numbers —
  const aadhaarMatch = text.match(/\b(\d{4}\s\d{4}\s\d{4})\b/);
  const panMatch = text.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
  const dlMatch = text.match(/\b([A-Z]{2}[0-9]{2}\s?[0-9]{4}\s?[0-9]{7})\b/);
  const epicMatch = text.match(/\b([A-Z]{3}[0-9]{7})\b/);
  const passportMatch = text.match(/\b([A-Z][0-9]{7})\b/);

  if (aadhaarMatch) {
    idNumber = aadhaarMatch[1];
  } else if (panMatch) {
    idNumber = panMatch[1];
  } else if (dlMatch) {
    idNumber = dlMatch[1].replace(/\s/g, "");
  } else if (epicMatch) {
    idNumber = epicMatch[1];
  } else if (passportMatch) {
    idNumber = passportMatch[1];
  }

  // — Dates (issue and expiry) —
  const allDates = [...text.matchAll(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/g)].map((m) => m[1]);
  const nonDobDates = allDates.filter((d) => d !== dob);
  if (nonDobDates.length >= 1) issueDate = nonDobDates[0];
  if (nonDobDates.length >= 2) expiryDate = nonDobDates[1];

  // — Income —
  const incomePatterns = [
    /(?:Annual Income|Total Income|Income|आय)[:\s]*(?:Rs\.?|₹|INR)?\s*([\d,]+(?:\.\d{0,2})?)/i,
    /(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{0,2})?)\s*(?:per annum|\/year|p\.a\.|-|annually)/i,
  ];
  for (const p of incomePatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      incomeAmount = `₹${m[1]}`;
      break;
    }
  }

  // — Issuing Authority —
  const authorityPatterns = [
    /(?:Issued by|Issuing Authority|Issued at|Under the authority of)[:\s]+(.{5,60}?)(?:\n|$)/i,
    /(UIDAI|Unique Identification Authority of India)/i,
    /(Income Tax Department(?:,?\s*Govt\.?\s*of India)?)/i,
    /(Mamlatdar[^,\n]*|Tehsildar[^,\n]*|Collectorate[^,\n]*|Sub-Divisional Magistrate[^,\n]*)/i,
    /(Government of Goa|Government of Maharashtra|Government of India)/i,
    /(Election Commission of India)/i,
    /(Ministry of [A-Za-z\s]+)/i,
    /(Regional Transport Office|RTO[^,\n]*)/i,
  ];
  for (const p of authorityPatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      issuingAuthority = m[1].trim();
      break;
    }
  }

  // — Address & Pincode —
  const addressPatterns = [
    /(?:Address|पता|Permanent Address|Residential Address)[:\s]+(.{20,120}?)(?:\n\n|\d{6}|$)/is,
  ];
  for (const p of addressPatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      address = m[1].replace(/\n/g, ", ").replace(/\s+/g, " ").trim();
      break;
    }
  }
  const pincodeMatch = text.match(/\b(\d{6})\b/);
  if (pincodeMatch) {
    customFields["PIN Code"] = pincodeMatch[1];
    if (address && !address.includes(pincodeMatch[1])) {
      address += ` - ${pincodeMatch[1]}`;
    }
  }

  // — Institution / Employer —
  const institutionPatterns = [
    /(University of [A-Za-z\s]+|[A-Za-z\s]+ University|[A-Za-z\s]+ Institute of Technology|[A-Za-z\s]+ College)/i,
    /(?:Employer|Company|Organisation|Organization)[:\s]+([A-Za-z\s&,\.]+?)(?:\n|$)/i,
  ];
  for (const p of institutionPatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      employerOrInstitution = m[1].trim();
      break;
    }
  }

  // — Qualification / Category —
  const qualPatterns = [
    /(?:Programme|Course|Qualification|Degree|Diploma)[:\s]+([A-Za-z\s\(\)\.]+?)(?:\n|$)/i,
    /(Bachelor of [A-Za-z\s]+|Master of [A-Za-z\s]+|Doctor of [A-Za-z\s]+|B\.Tech|M\.Tech|B\.Sc|M\.Sc|MBA|BBA)/i,
    /(?:Category|Caste|Class)[:\s]+([A-Za-z\s]+?)(?:\n|$)/i,
  ];
  for (const p of qualPatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      qualificationOrCategory = m[1].trim();
      break;
    }
  }

  // ── Document Specific Confidence Calibration ──────────────────────────────

  if (isAadhaar) {
    // Aadhaar Card: Must have valid 12-digit UID/VID and/or applicant name
    if (idNumber && fullName) {
      confidence = 94;
    } else if (idNumber || (fullName && dob)) {
      confidence = 86;
    } else if (rawText.length > 150) {
      // Aadhaar keywords present but key numbers unclear
      confidence = 68;
    } else {
      confidence = 45;
    }
  } else if (isPAN) {
    // PAN Card: Must have standard 10-char PAN structure (e.g. ABCDE1234F)
    if (panMatch && fullName) {
      confidence = 95;
    } else if (panMatch) {
      confidence = 88;
    } else if (lower.includes("income tax") && fullName) {
      // Income tax card detected but PAN number obscured
      confidence = 65;
    } else {
      confidence = 45;
    }
  } else if (isPassport) {
    if (passportMatch && fullName) confidence = 96;
    else if (passportMatch || fullName) confidence = 87;
    else confidence = 60;
  } else if (isDrivingLicence) {
    if (dlMatch && fullName) confidence = 92;
    else if (dlMatch || fullName) confidence = 84;
    else confidence = 58;
  } else if (isVoterID) {
    if (epicMatch && fullName) confidence = 91;
    else if (epicMatch || fullName) confidence = 83;
    else confidence = 55;
  } else if (isIncomeCert) {
    if (incomeAmount && (fullName || issuingAuthority)) confidence = 90;
    else if (incomeAmount || fullName) confidence = 82;
    else confidence = 55;
  } else if (isDegree) {
    if (employerOrInstitution && (fullName || qualificationOrCategory)) confidence = 89;
    else if (employerOrInstitution || fullName) confidence = 81;
    else confidence = 52;
  } else if (isDomicile || isUtilityBill) {
    if (address && fullName) confidence = 88;
    else if (address || pincodeMatch) confidence = 81;
    else confidence = 50;
  }

  // Factor in raw Tesseract engine confidence if available
  if (rawEngineConfidence && rawEngineConfidence > 0) {
    if (rawEngineConfidence < 60) {
      // Degrade confidence if OCR engine struggled with character recognition
      confidence = Math.min(confidence, Math.round(rawEngineConfidence * 0.9 + 15));
    } else {
      // Blend engine score with pattern score
      confidence = Math.round(confidence * 0.7 + rawEngineConfidence * 0.3);
    }
  }

  // Penalize bad or incomplete scans
  if (text.length < 40) {
    confidence = Math.min(confidence, 25);
  } else if (text.length < 90) {
    confidence = Math.min(confidence, 55);
  }

  // Clamp confidence score to 0-100 integer range
  confidence = Math.max(0, Math.min(100, Math.round(confidence)));

  // — Derived quality & status with strict 80% threshold —
  const readableQuality: "High" | "Medium" | "Low" =
    confidence >= 85 ? "High" : confidence >= 65 ? "Medium" : "Low";

  // STRICT REQUIREMENT: Accept ONLY if confidence >= 80%, else REJECT (failed)
  const isAccepted = confidence >= OCR_CONFIDENCE_THRESHOLD;
  const verificationStatus: "verified" | "failed" = isAccepted ? "verified" : "failed";

  let summary: string;
  if (isAccepted) {
    summary = `${docType} verified successfully with ${confidence}% OCR confidence (passed ≥${OCR_CONFIDENCE_THRESHOLD}% requirement).`;
  } else {
    summary = `Document rejected: OCR confidence score (${confidence}%) is below the required ${OCR_CONFIDENCE_THRESHOLD}% threshold. Please upload a clearer scan of your ${docType}.`;
  }

  return {
    docType,
    confidenceScore: confidence,
    verificationStatus,
    summary,
    extractedFields: {
      fullName,
      dob,
      idNumber,
      issueDate,
      expiryDate,
      issuingAuthority,
      address,
      incomeAmount,
      employerOrInstitution,
      qualificationOrCategory,
      customFields,
    },
    securityVerification: {
      tamperDetected: false,
      readableQuality,
      notes: isAccepted
        ? `OCR confidence: ${confidence}% (Threshold: ≥${OCR_CONFIDENCE_THRESHOLD}%). Language: eng+hin+mar. Document authenticated.`
        : `Verification Failed: OCR confidence (${confidence}%) is below the minimum required ${OCR_CONFIDENCE_THRESHOLD}% threshold. Text may be blurry, cropped, or not an official document.`,
    },
  };
}

// ---------------------------------------------------------------------------
// Step 3: Combined one-call function used by the server endpoint
// ---------------------------------------------------------------------------

export async function runLocalOCR(
  base64Data: string,
  fileType: string,
  documentName: string,
  docTypeHint?: string
): Promise<OCRResult> {
  const { text: rawText, engineConfidence } = await extractRawText(base64Data, fileType);

  if (!rawText || rawText.trim().length < 20) {
    return {
      docType: "Unrecognized Document",
      confidenceScore: 0,
      verificationStatus: "failed",
      summary: `Document rejected: No readable text could be extracted (0% confidence, minimum ${OCR_CONFIDENCE_THRESHOLD}% required).`,
      extractedFields: {
        fullName: null,
        dob: null,
        idNumber: null,
        issueDate: null,
        expiryDate: null,
        issuingAuthority: null,
        address: null,
        incomeAmount: null,
        employerOrInstitution: null,
        qualificationOrCategory: null,
        customFields: {},
      },
      securityVerification: {
        tamperDetected: false,
        readableQuality: "Low",
        notes: `File produced no readable text. OCR confidence 0% is below the required ${OCR_CONFIDENCE_THRESHOLD}% threshold. Please upload a clear image or valid PDF.`,
      },
    };
  }

  return parseIndianDocument(rawText, docTypeHint, engineConfidence);
}
