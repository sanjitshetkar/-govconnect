export type AppTab = 'dashboard' | 'chat' | 'vault' | 'autofill';

export type Language = 'EN' | 'HI';

export type VerificationAssuranceLevel =
  | 'MeriPehchaan (Level 3 - Aadhaar e-KYC)'
  | 'DigiLocker Authenticated'
  | 'Income Tax e-Filing Verified'
  | 'e-Pramaan High Assurance';

export interface UserProfile {
  id: string;
  name: string;
  hindiName?: string;
  email: string;
  aadhaarMasked: string;
  panNumber: string;
  phone: string;
  avatarUrl: string;
  assuranceLevel: VerificationAssuranceLevel;
  authMethod: 'MeriPehchaan NSSO' | 'DigiLocker OAuth 2.0' | 'Aadhaar OTP';
  sessionTokenHash: string;
  storageUsedBytes: number;
  storageQuotaBytes: number;
  provider: 'MeriPehchaan (National SSO)' | 'DigiLocker' | 'e-Pramaan';
  is2FAEnabled: boolean;
  stateOrUT: string;
  cityOrDistrict?: string;
  primaryAddress?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: string;
  occupation?: string;
  digiLockerDocCount: number;
}

export interface CitizenRegistrationData {
  name: string;
  hindiName?: string;
  aadhaarNumber: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  panNumber?: string;
  primaryAddress: string;
  cityOrDistrict: string;
  stateOrUT: string;
  pincode: string;
  occupation: string;
  mpin: string;
  consentAccepted: boolean;
}

export type DocumentVerificationStatus = 'verified' | 'processing' | 'rejected' | 'pending';

export interface ExtractedFields {
  fullName?: string;
  dob?: string;
  idNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  fatherOrSpouseName?: string;
  address?: string;
  incomeAmount?: string;
  taxYear?: string;
  employerOrInstitution?: string | null;
  employerOrBusiness?: string | null;
  qualificationOrCategory?: string | null;
  customFields?: Record<string, string>;
}

export interface UploadedDocument {
  id: string;
  name: string;
  originalName: string;
  fileType: string;
  size: number;
  uploadDate: string;
  base64Preview?: string;
  isEncrypted: boolean;
  encryptionAlgorithm: string;
  sha256Hash: string;
  docType: string;
  confidenceScore: number;
  verificationStatus: DocumentVerificationStatus;
  summary: string;
  extractedFields: ExtractedFields;
  digiLockerIssuer?: string;
  itActSection65BVerified?: boolean;
  securityVerification?: {
    tamperDetected: boolean;
    readableQuality: 'High' | 'Medium' | 'Low';
    notes: string;
  };
}

export type ApplicationStatus =
  | 'Drafting'
  | 'In Review'
  | 'Approved'
  | 'Action Needed'
  | 'Documents Required';

export type ApplicationCategory =
  | 'Startup & MSME Grant'
  | 'Academic & Research Fellowship'
  | 'Trade & Industrial License'
  | 'Citizen Welfare & Subsidy'
  | 'Employment & Skill Development'
  | 'Tax Exemption & Section 80G'
  | 'Regulatory Permit';

export interface ApplicationTimelineEvent {
  title: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'pending';
}

export interface AuditReport {
  readinessScore: number;
  passedChecks: string[];
  warnings: string[];
  recommendations: string[];
  verdict: string;
}

export interface ApplicationFormData {
  applicantName: string;
  dateOfBirth: string;
  gender?: string;
  aadhaarOrPan: string;
  email: string;
  phone: string;
  primaryAddress: string;
  cityOrDistrict: string;
  stateOrUT: string;
  pincode: string;
  citizenshipOrDomicile: string;
  employerOrBusiness: string;
  annualGrossIncome: string;
  occupationOrDesignation: string;
  schemeOrCategory: string;
  requestedGrantOrSubsidy: string;
  purposeStatement: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;
  declarationAccepted: boolean;
  digitalSignature: string;
  dateSigned: string;
  additionalFields?: Record<string, string>;
}

export interface ApplicationRecord {
  id: string;
  title: string;
  category: ApplicationCategory;
  applicationNumber: string;
  schemeCode: string;
  status: ApplicationStatus;
  submissionDate?: string | null;
  lastUpdated: string;
  deadline: string;
  ministryName: string;
  departmentName: string;
  progressPercentage: number;
  formTemplateId: string;
  formData: ApplicationFormData;
  attachedDocIds: string[];
  auditReport?: AuditReport;
  timeline: ApplicationTimelineEvent[];
  officialNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender?: 'citizen' | 'ai_sahayak' | string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
  suggestedActions?: string[];
  isVoice?: boolean;
}

export interface ApplicationTemplate {
  id: string;
  title: string;
  name?: string;
  category: ApplicationCategory;
  ministryName: string;
  departmentName: string;
  schemeCode: string;
  description: string;
  requiredDocTypes: string[];
  requiredEvidenceList?: string[];
  estimatedProcessingTime: string;
  statutoryDeadline?: string;
  defaultAmount?: string;
  defaultFundingAmount?: string;
  defaultFormData: Partial<ApplicationFormData>;
}

export interface GovNotice {
  id: string;
  type: 'info' | 'warning' | 'deadline';
  title: string;
  titleHindi?: string;
  description: string;
  date: string;
}
