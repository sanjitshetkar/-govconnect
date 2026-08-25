/**
 * GovConnect — Python Backend-ready Data Architecture
 * All API models use snake_case to match future FastAPI / Python schemas.
 */

export type LanguageCode = 'en' | 'hi' | 'mr' | 'kok' | 'EN' | 'HI' | 'MR' | 'KOK';
export type Language = LanguageCode;

export type ApplicationStatus =
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'action_required'
  | 'draft'
  | 'Drafting'
  | 'In Review'
  | 'Approved'
  | 'Action Needed'
  | 'Documents Required';

export interface ApplicationTimelineItem {
  step_index: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  department?: string;
}

export interface Application {
  application_id: string;
  service_id: string;
  service_name: string;
  category: string;
  status: ApplicationStatus;
  progress_step: number; // 0 to 6
  total_steps: number;
  current_step_name: string;
  last_updated: string;
  submitted_date?: string;
  department: string;
  next_action: string;
  timeline: ApplicationTimelineItem[];
  form_data: Record<string, any>;
  attached_documents: string[];
  warnings?: string[];
  reference_number?: string;
}

export type DocumentCategory = 'identity' | 'education' | 'income' | 'address';
export type DocumentStatus = 'verified' | 'needs_attention' | 'not_uploaded' | 'processing';

export interface VerificationCheck {
  check_name: string;
  passed: boolean;
  notes?: string;
}

export interface DocumentItem {
  document_id: string;
  document_name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  file_type?: string;
  file_size?: string;
  upload_date?: string;
  expiry_date?: string;
  extracted_fields?: Record<string, string>;
  verification_checks?: VerificationCheck[];
  issuer?: string;
  is_digilocker_verified?: boolean;
}

export interface EligibilityCriterion {
  criterion_id: string;
  title: string;
  description: string;
  is_satisfied: boolean;
  checkable: boolean;
}

export interface RequiredDocumentSpec {
  document_name: string;
  is_mandatory: boolean;
  category: DocumentCategory;
  document_type: string;
}

export interface GovernmentService {
  service_id: string;
  title: string;
  short_description: string;
  full_description: string;
  category:
    | 'Education'
    | 'Employment'
    | 'Certificates'
    | 'Housing'
    | 'Transport'
    | 'Financial Assistance'
    | 'Healthcare'
    | 'Agriculture'
    | 'Family & Social Welfare'
    | string;
  department: string;
  eligibility_criteria: EligibilityCriterion[];
  required_documents: RequiredDocumentSpec[];
  benefit_amount?: string;
  estimated_prep_time: string;
  deadline?: string;
  match_score?: number; // 0 - 100
  match_reasons?: string[];
  popular?: boolean;
}

export interface NotificationItem {
  notification_id: string;
  type: 'action_required' | 'update' | 'reminder';
  title: string;
  description: string;
  time_ago: string;
  is_read: boolean;
  related_service_id?: string;
  related_application_id?: string;
  action_label?: string;
  urgency?: 'high' | 'medium' | 'low';
  days_remaining?: number;
}

export interface InteractiveCardData {
  type: 'eligibility' | 'document_check' | 'service_recommendation' | 'action_prompt';
  title: string;
  service_id?: string;
  service_name?: string;
  items?: { label: string; checked: boolean; note?: string }[];
  cta_text?: string;
  cta_action?: string;
  benefit?: string;
}

export interface ChatMessage {
  message_id?: string;
  id?: string;
  sender?: 'user' | 'assistant' | 'citizen' | 'ai_sahayak' | string;
  role?: 'user' | 'assistant' | 'system' | string;
  content?: string;
  text?: string;
  timestamp: string;
  interactive_card?: InteractiveCardData;
  suggested_actions?: string[];
  suggestions?: string[];
  suggestedActions?: string[];
  referenced_service_id?: string;
  isVoice?: boolean;
}

export interface UserProfile {
  user_id?: string;
  name: string;
  date_of_birth?: string;
  mobile?: string;
  email: string;
  address?: string;
  state?: string;
  district?: string;
  pincode?: string;
  aadhaar_masked?: string;
  pan_number?: string;
  occupation?: string;
  annual_income?: string;
  language_preference?: 'en' | 'hi' | 'mr' | 'kok';
  voice_assistance_enabled?: boolean;
  notifications_enabled?: boolean;

  // Legacy backwards compatibility properties
  id?: string;
  hindiName?: string;
  aadhaarMasked?: string;
  panNumber?: string;
  phone?: string;
  avatarUrl?: string;
  assuranceLevel?: any;
  authMethod?: any;
  sessionTokenHash?: string;
  storageUsedBytes?: number;
  storageQuotaBytes?: number;
  provider?: any;
  is2FAEnabled?: boolean;
  stateOrUT?: string;
  cityOrDistrict?: string;
  primaryAddress?: string;
  dateOfBirth?: string;
  gender?: string;
  digiLockerDocCount?: number;
}

export interface UserImpactMetrics {
  time_saved_minutes: number;
  fields_autofilled: number;
  documents_verified: number;
  applications_managed: number;
  global_stats: {
    applications_completed: string;
    hours_saved: string;
    documents_processed: string;
    forms_autofilled: string;
  };
}

export type NavTab =
  | 'dashboard'
  | 'assistant'
  | 'services'
  | 'documents'
  | 'applications'
  | 'tracking'
  | 'autofill'
  | 'alerts'
  | 'profile'
  | 'service_detail';
