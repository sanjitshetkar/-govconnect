/**
 * ocr.ts — Local OCR engine using Tesseract.js (no API key required)
 *
 * Supports:
 *  - Images: JPEG, PNG via Tesseract.js (English + Hindi + Marathi)
 *  - PDFs: Text extraction via pdf-parse
 *  - Smart regex field extraction for Indian government documents
 */

import Tesseract from "tesseract.js";
import { createRequire } from "module";
const _require = createRequire(import.meta.url);
const pdfParse: (buf: Buffer) => Promise<{ text: string }> = _require("pdf-parse");

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

// ---------------------------------------------------------------------------
// Step 1: Extract raw text from image or PDF
// ---------------------------------------------------------------------------

export async function extractRawText(
  base64Data: string,
  fileType: string
): Promise<string> {
  const cleanBase64 = base64Data.includes(",")
    ? base64Data.split(",")[1]
    : base64Data;
  const buffer = Buffer.from(cleanBase64, "base64");

  if (fileType === "application/pdf") {
    // Use pdf-parse for PDFs (fast, no visual OCR needed for text-based PDFs)
    try {
      const data = await pdfParse(buffer);
      const text = data.text?.trim();
      if (text && text.length > 30) {
        console.log("[OCR] PDF text extracted via pdf-parse:", text.length, "chars");
        return text;
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
    console.log("[OCR] Tesseract extracted:", text.length, "chars");
    return text;
  } catch (err) {
    console.error("[OCR] Tesseract.js error:", err);
    return "";
  }
}

// ---------------------------------------------------------------------------
// Step 2: Smart Indian document field parser
// ---------------------------------------------------------------------------

export function parseIndianDocument(
  rawText: string,
  docTypeHint?: string
): OCRResult {
  const text = rawText.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
  const lower = text.toLowerCase();

  // ── Document type detection ──────────────────────────────────────────────
  let docType = "Other Certificate";
  let confidence = 55;
  let summary = "Document processed via Tesseract.js local OCR engine.";

  const isAadhaar =
    lower.includes("uidai") ||
    lower.includes("unique identification authority") ||
    lower.includes("aadhaar") ||
    lower.includes("आधार") ||
    /\d{4}\s\d{4}\s\d{4}/.test(text);

  const isPAN =
    lower.includes("permanent account number") ||
    lower.includes("income tax department") ||
    lower.includes("pan card") ||
    /\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(text);

  const isIncomeCert =
    (lower.includes("income") || lower.includes("आय")) &&
    (lower.includes("certificate") || lower.includes("प्रमाण पत्र"));

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
    lower.includes("telephone bill");

  if (isAadhaar) {
    docType = "National ID";
    confidence = 91;
    summary = "Aadhaar Card detected via OCR — identity fields extracted.";
  } else if (isPAN) {
    docType = "National ID";
    confidence = 91;
    summary = "PAN Card detected via OCR — tax identity fields extracted.";
  } else if (isVoterID) {
    docType = "National ID";
    confidence = 88;
    summary = "Voter ID (EPIC) detected via OCR.";
  } else if (isPassport) {
    docType = "Passport";
    confidence = 92;
    summary = "Indian Passport detected via OCR — travel document fields extracted.";
  } else if (isDrivingLicence) {
    docType = "Driver License";
    confidence = 89;
    summary = "Driving Licence detected via OCR.";
  } else if (isIncomeCert) {
    docType = "Income Certificate / Tax W2";
    confidence = 87;
    summary = "Income Certificate detected via OCR — financial fields extracted.";
  } else if (isDegree) {
    docType = "Academic Degree / Transcript";
    confidence = 86;
    summary = "Academic document detected via OCR — institution and qualification extracted.";
  } else if (isDomicile) {
    docType = "Utility Bill / Address Proof";
    confidence = 84;
    summary = "Domicile / Residence Certificate detected via OCR.";
  } else if (isUtilityBill) {
    docType = "Utility Bill / Address Proof";
    confidence = 80;
    summary = "Utility bill or address proof detected via OCR.";
  } else if (docTypeHint === "identity") {
    docType = "National ID";
    confidence = 55;
    summary = "Identity document — some fields may be unclear.";
  }

  // Very short text = bad scan / not a document
  if (text.length < 40) {
    confidence = Math.min(confidence, 25);
    summary = "Document could not be read clearly. Image may be blurry or not a valid document.";
  } else if (text.length < 100) {
    confidence = Math.min(confidence, 50);
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
    /(?:Name|नाम|To)[:\s]+([A-Z][a-zA-Z\s\.]{2,35})/,
    /(?:Sh\.|Smt\.|Kum\.|Mr\.|Mrs\.|Dr\.)\s+([A-Z][a-zA-Z\s\.]{2,35})/i,
    /^([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)\s*$/m, // all-caps line (common on Aadhaar)
  ];
  for (const p of namePatterns) {
    const m = text.match(p);
    if (m?.[1]) {
      const candidate = m[1].trim();
      // Filter out false positives (too short, numeric, common keywords)
      const skipWords = ["INDIA", "GOVERNMENT", "INCOME", "CERTIFICATE", "REPUBLIC", "DEPARTMENT"];
      if (candidate.length >= 4 && !skipWords.some(w => candidate.toUpperCase().includes(w))) {
        fullName = candidate;
        break;
      }
    }
  }

  // — Date of Birth —
  const dobPatterns = [
    /(?:DOB|Date of Birth|D\.O\.B|जन्म तिथि|जन्म दिनांक)[:\s\/]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:Year of Birth|Born)[:\s]+(\d{4})/i,
    /(?:DOB|Date of Birth)[:\s]+(\d{2}\s+\w+\s+\d{4})/i, // "01 Jan 2003"
  ];
  for (const p of dobPatterns) {
    const m = text.match(p);
    if (m?.[1]) { dob = m[1]; break; }
  }
  // Fallback: grab first date-like string if DOB not found
  if (!dob) {
    const firstDate = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
    if (firstDate) dob = firstDate[1];
  }

  // — ID Numbers —
  // Aadhaar: 4-4-4 digit pattern
  const aadhaarMatch = text.match(/\b(\d{4}\s\d{4}\s\d{4})\b/);
  // PAN: XXXXX9999X
  const panMatch = text.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
  // Driving Licence: State code + numbers
  const dlMatch = text.match(/\b([A-Z]{2}[0-9]{2}\s?[0-9]{4}\s?[0-9]{7})\b/);
  // Voter ID EPIC
  const epicMatch = text.match(/\b([A-Z]{3}[0-9]{7})\b/);
  // Passport number: Letter + 7 digits
  const passportMatch = text.match(/\b([A-Z][0-9]{7})\b/);

  if (aadhaarMatch) idNumber = aadhaarMatch[1];
  else if (panMatch) idNumber = panMatch[1];
  else if (dlMatch) idNumber = dlMatch[1].replace(/\s/g, "");
  else if (epicMatch) idNumber = epicMatch[1];
  else if (passportMatch) idNumber = passportMatch[1];

  // — Dates (issue and expiry) —
  const allDates = [...text.matchAll(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/g)].map(m => m[1]);
  // Remove DOB from allDates pool
  const nonDobDates = allDates.filter(d => d !== dob);
  if (nonDobDates.length >= 1) issueDate = nonDobDates[0];
  if (nonDobDates.length >= 2) expiryDate = nonDobDates[1];

  // — Income —
  const incomePatterns = [
    /(?:Annual Income|Total Income|Income|आय)[:\s]*(?:Rs\.?|₹|INR)?\s*([\d,]+(?:\.\d{0,2})?)/i,
    /(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{0,2})?)\s*(?:per annum|\/year|p\.a\.|-|annually)/i,
  ];
  for (const p of incomePatterns) {
    const m = text.match(p);
    if (m?.[1]) { incomeAmount = `₹${m[1]}`; break; }
  }

  // — Issuing Authority —
  const authorityPatterns = [
    /(?:Issued by|Issuing Authority|Issued at|Under the authority of)[:\s]+(.{5,60}?)(?:\n|$)/i,
    /(UIDAI|Unique Identification Authority of India)/i,
    /(Income Tax Department[^,\n]*)/i,
    /(Mamlatdar[^,\n]*|Tehsildar[^,\n]*|Collectorate[^,\n]*|Sub-Divisional Magistrate[^,\n]*)/i,
    /(Government of Goa|Government of Maharashtra|Government of India)/i,
    /(Election Commission of India)/i,
    /(Ministry of [A-Za-z\s]+)/i,
    /(Regional Transport Office|RTO[^,\n]*)/i,
  ];
  for (const p of authorityPatterns) {
    const m = text.match(p);
    if (m?.[1]) { issuingAuthority = m[1].trim(); break; }
  }

  // — Address —
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
  // Extract pincode if visible
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
    if (m?.[1]) { employerOrInstitution = m[1].trim(); break; }
  }

  // — Qualification / Category —
  const qualPatterns = [
    /(?:Programme|Course|Qualification|Degree|Diploma)[:\s]+([A-Za-z\s\(\)\.]+?)(?:\n|$)/i,
    /(Bachelor of [A-Za-z\s]+|Master of [A-Za-z\s]+|Doctor of [A-Za-z\s]+|B\.Tech|M\.Tech|B\.Sc|M\.Sc|MBA|BBA)/i,
    /(?:Category|Caste|Class)[:\s]+([A-Za-z\s]+?)(?:\n|$)/i,
  ];
  for (const p of qualPatterns) {
    const m = text.match(p);
    if (m?.[1]) { qualificationOrCategory = m[1].trim(); break; }
  }

  // — Derived quality & status ——————————————————————————————————————————————
  const readableQuality: "High" | "Medium" | "Low" =
    text.length > 300 ? "High" : text.length > 100 ? "Medium" : "Low";

  const verificationStatus: "verified" | "warning" | "analyzing" | "failed" =
    confidence >= 80
      ? "verified"
      : confidence >= 55
      ? "warning"
      : confidence >= 30
      ? "analyzing"
      : "failed";

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
      notes: `Processed locally by Tesseract.js v7 OCR engine. Language: eng+hin+mar. No external API used. Text length: ${text.length} chars.`,
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
  const rawText = await extractRawText(base64Data, fileType);

  if (!rawText || rawText.trim().length < 20) {
    return {
      docType: "Other Certificate",
      confidenceScore: 0,
      verificationStatus: "failed",
      summary: "Could not extract any text from the uploaded file.",
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
        notes: "File produced no readable text. Please upload a clear image or valid PDF.",
      },
    };
  }

  return parseIndianDocument(rawText, docTypeHint);
}
