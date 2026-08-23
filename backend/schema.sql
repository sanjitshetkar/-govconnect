-- ==============================================================================
-- GovConnect Database Schema (Supabase PostgreSQL)
-- 
-- 7 Core Tables:
-- 1. users
-- 2. schemes
-- 3. scheme_eligibility
-- 4. applications
-- 5. documents
-- 6. document_verifications
-- 7. reminders
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    user_id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(50),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    aadhaar_masked VARCHAR(30),
    pan_number VARCHAR(30),
    address TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    pincode VARCHAR(20),
    annual_income NUMERIC(15, 2) DEFAULT 0,
    occupation VARCHAR(150),
    assurance_level VARCHAR(100) DEFAULT 'MeriPehchaan (Level 3 - Aadhaar e-KYC)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. SCHEMES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schemes (
    scheme_id VARCHAR(64) PRIMARY KEY,
    scheme_code VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    name_hindi VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    state VARCHAR(100) DEFAULT 'All India',
    funding_amount VARCHAR(100),
    processing_time VARCHAR(100),
    application_url VARCHAR(500),
    deadline DATE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. SCHEME ELIGIBILITY TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scheme_eligibility (
    eligibility_id VARCHAR(64) PRIMARY KEY,
    scheme_id VARCHAR(64) NOT NULL REFERENCES public.schemes(scheme_id) ON DELETE CASCADE,
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 120,
    max_income NUMERIC(15, 2),
    occupation VARCHAR(150),
    gender VARCHAR(50) DEFAULT 'All',
    category VARCHAR(100) DEFAULT 'All',
    requires_residence VARCHAR(100) DEFAULT 'All India',
    required_documents TEXT[],
    eligibility_description TEXT
);

-- ------------------------------------------------------------------------------
-- 4. APPLICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    application_id VARCHAR(64) PRIMARY KEY,
    application_number VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    scheme_id VARCHAR(64) NOT NULL REFERENCES public.schemes(scheme_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL, 
    -- Statuses: draft, documents_pending, ready_to_submit, submitted, in_review, approved, rejected
    progress_percentage INT DEFAULT 20,
    notes TEXT,
    form_data JSONB DEFAULT '{}'::jsonb,
    attached_doc_ids TEXT[] DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. DOCUMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    document_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    file_type VARCHAR(100),
    sha256_hash VARCHAR(128),
    is_encrypted BOOLEAN DEFAULT TRUE,
    verification_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    -- Statuses: pending, processing, verified, mismatch, rejected
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. DOCUMENT VERIFICATION TABLE (OCR & Document AI Results)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_verifications (
    verification_id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES public.documents(document_id) ON DELETE CASCADE,
    matched BOOLEAN DEFAULT FALSE NOT NULL,
    confidence_score NUMERIC(5, 2) DEFAULT 0.0,
    extracted_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
    flags JSONB DEFAULT '[]'::jsonb NOT NULL,
    security_summary TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. REMINDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reminders (
    reminder_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    application_id VARCHAR(64) REFERENCES public.applications(application_id) ON DELETE SET NULL,
    reminder_type VARCHAR(50) NOT NULL, -- deadline, document_expiry, action_required, notice
    reminder_date DATE NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON public.schemes(is_active);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.schemes(category);
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_scheme ON public.applications(scheme_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_verif_doc_id ON public.document_verifications(document_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(reminder_date);


-- ==============================================================================
-- INITIAL SEED DATA (Government Schemes, Eligibility Rules, Demo User & Records)
-- ==============================================================================

-- 1. Seed Schemes
INSERT INTO public.schemes (scheme_id, scheme_code, name, name_hindi, description, category, ministry, department, state, funding_amount, processing_time, application_url, deadline, is_active)
VALUES
(
    'scheme-sisfs-01',
    'DPIIT/SISFS/2026/G-424',
    'Startup India Seed Fund Scheme (SISFS)',
    'स्टार्टअप इंडिया सीड फंड योजना (SISFS)',
    'Financial assistance to early-stage startups for proof of concept, prototype development, product trials, market entry, and commercialization under DPIIT.',
    'Startup & MSME Grant',
    'Ministry of Commerce and Industry',
    'Department for Promotion of Industry and Internal Trade (DPIIT)',
    'All India',
    '₹25,00,000 INR (Grant & Convertible Debenture)',
    '21 Working Days',
    'https://www.startupindia.gov.in/content/sih/en/seed-fund-scheme.html',
    '2026-11-15',
    TRUE
),
(
    'scheme-inspire-02',
    'DST/INSPIRE/2026/F-101',
    'DST INSPIRE Senior Research Faculty Fellowship',
    'डीएसटी इंस्पायर सीनियर रिसर्च फैकल्टी फैलोशिप',
    'Prestigious research fellowship providing independent faculty positions and research grant support for postdoctoral scientists to conduct frontier research in Indian labs.',
    'Academic & Research Fellowship',
    'Ministry of Science and Technology',
    'Department of Science & Technology (DST)',
    'All India',
    '₹35,00,000 Research Grant + ₹1,25,000/mo Fellowship',
    '45 Working Days',
    'https://online-inspire.gov.in/',
    '2026-11-30',
    TRUE
),
(
    'scheme-pmegp-03',
    'MSME/PMEGP/2026/S-88',
    'Prime Minister Employment Generation Programme (PMEGP)',
    'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
    'Credit-linked subsidy programme to generate self-employment opportunities through establishment of micro-enterprises in non-farm sectors with up to 35% government subsidy.',
    'Employment & Skill Development',
    'Ministry of Micro, Small & Medium Enterprises',
    'Khadi and Village Industries Commission (KVIC)',
    'All India',
    '₹50,00,000 Project Capital (35% Margin Subsidy)',
    '15 Working Days',
    'https://www.kviconline.gov.in/pmegpeportal/',
    '2026-12-31',
    TRUE
),
(
    'scheme-udyam-04',
    'MSME/UDYAM/2026/REG-99',
    'MSME Udyam Enterprise Certification & Priority Lending',
    'एमएसएमई उद्यम पंजीकरण प्रमाणपत्र एवं प्राथमिकता ऋण',
    'Statutory permanent identity number and electronic registration certificate for micro, small, and medium enterprises with priority sector bank lending eligibility.',
    'Trade & Industrial License',
    'Ministry of Micro, Small & Medium Enterprises',
    'Udyam Registration Portal Directorate',
    'All India',
    'Statutory Zero Fee (Free National Registration)',
    'Instant (1-2 Days)',
    'https://udyamregistration.gov.in/',
    '2026-12-31',
    TRUE
),
(
    'scheme-pmkisan-05',
    'AGRI/PMKISAN/2026/D-12',
    'PM Kisan Samman Nidhi',
    'प्रधानमंत्री किसान सम्मान निधि',
    'Income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.',
    'Citizen Welfare & Subsidy',
    'Ministry of Agriculture and Farmers Welfare',
    'Department of Agriculture & Cooperation',
    'All India',
    '₹6,000 / year (Direct Benefit Transfer)',
    '7 Working Days',
    'https://pmkisan.gov.in/',
    '2026-12-31',
    TRUE
)
ON CONFLICT (scheme_id) DO NOTHING;

-- 2. Seed Scheme Eligibility Rules
INSERT INTO public.scheme_eligibility (eligibility_id, scheme_id, min_age, max_age, max_income, occupation, gender, category, requires_residence, required_documents, eligibility_description)
VALUES
(
    'elig-sisfs-01',
    'scheme-sisfs-01',
    18,
    65,
    5000000.00,
    'Founder / Entrepreneur',
    'All',
    'Startup & MSME',
    'All India',
    ARRAY['Aadhaar Card (UIDAI)', 'Income Tax PAN Card', 'ITR-V / Balance Sheet', 'DPIIT Certificate of Recognition'],
    'Must be a DPIIT recognized startup with proof of concept/prototype. Incorporated within last 2 years.'
),
(
    'elig-inspire-02',
    'scheme-inspire-02',
    22,
    32,
    NULL,
    'Researcher / Scientist',
    'All',
    'Academic & Research',
    'All India',
    ARRAY['Aadhaar Card (UIDAI)', 'Doctorate Degree Transcript', 'Institutional Endorsement Letter'],
    'Must hold Ph.D. in Science/Engineering/Medicine. Age under 32 years with at least 2 peer-reviewed publications.'
),
(
    'elig-pmegp-03',
    'scheme-pmegp-03',
    18,
    70,
    2500000.00,
    'Self-Employed / Artisan / Entrepreneur',
    'All',
    'All',
    'All India',
    ARRAY['Aadhaar Card (UIDAI)', 'PAN Card', 'EDP Training Certificate', 'Detailed Project Report (DPR)'],
    'Any individual above 18 years. At least 8th standard pass for manufacturing units above ₹10 lakhs project cost.'
),
(
    'elig-udyam-04',
    'scheme-udyam-04',
    18,
    99,
    NULL,
    'Business Owner / Enterprise',
    'All',
    'All',
    'All India',
    ARRAY['Aadhaar Card', 'PAN Card', 'GSTIN Certificate'],
    'Any operational or emerging enterprise classified under Micro, Small, or Medium criteria.'
),
(
    'elig-pmkisan-05',
    'scheme-pmkisan-05',
    18,
    85,
    600000.00,
    'Farmer / Cultivator',
    'All',
    'All',
    'All India',
    ARRAY['Aadhaar Card', 'Land Record / Khatauni', 'Bank Passbook'],
    'Small and marginal farmer families possessing cultivable land in their names.'
)
ON CONFLICT (eligibility_id) DO NOTHING;

-- 3. Seed Demo Users
INSERT INTO public.users (user_id, full_name, hindi_name, date_of_birth, gender, phone, email, aadhaar_masked, pan_number, address, state, district, pincode, annual_income, occupation, assurance_level)
VALUES
(
    'usr-digilocker-8849',
    'Shivang Khorjuvekar',
    'शिवांग खोर्जुवेकर',
    '1995-11-20',
    'Male',
    '+91 98201 55492',
    'khorjuvekarshivang@gmail.com',
    'XXXX-XXXX-8421',
    'ABCDE1234F',
    'Flat 402, Shiv Shristi Enclave, Baner Road',
    'Maharashtra',
    'Pune',
    '411045',
    1450000.00,
    'Founder & CTO (Apex Cybernetics)',
    'MeriPehchaan (Level 3 - Aadhaar e-KYC)'
),
(
    'usr-digilocker-9921',
    'Dr. Ananya Sharma',
    'डॉ. अनन्या शर्मा',
    '1992-04-14',
    'Female',
    '+91 98110 44219',
    'ananya.sharma.dst@gov.res.in',
    'XXXX-XXXX-3190',
    'ANASP4821M',
    'C-4/18, Hauz Khas Enclave',
    'Delhi (NCT)',
    'New Delhi',
    '110016',
    1200000.00,
    'Postdoctoral Research Scientist (DST Fellow)',
    'MeriPehchaan (Level 3 - Aadhaar e-KYC)'
),
(
    'usr-digilocker-7740',
    'Ramesh Patel',
    'रमेश पटेल',
    '1984-08-05',
    'Male',
    '+91 94260 11893',
    'ramesh.patel.msme@gmail.com',
    'XXXX-XXXX-9902',
    'RPATL7732K',
    'Plot 48, GIDC Industrial Estate, Vatva',
    'Gujarat',
    'Ahmedabad',
    '382445',
    1850000.00,
    'Managing Director (Patel Precision Works)',
    'MeriPehchaan (Level 3 - Aadhaar e-KYC)'
)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Seed Documents for Demo User
INSERT INTO public.documents (document_id, user_id, document_type, original_name, file_url, file_size_bytes, file_type, sha256_hash, is_encrypted, verification_status)
VALUES
(
    'doc-aadhaar-01',
    'usr-digilocker-8849',
    'Aadhaar Card (UIDAI Verified)',
    'Aadhaar_Card_UIDAI_Verified.pdf',
    'https://storage.supabase.co/govconnect-vault/usr-8849/aadhaar_verified.pdf',
    1458900,
    'application/pdf',
    '9f83c14298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    TRUE,
    'verified'
),
(
    'doc-pan-02',
    'usr-digilocker-8849',
    'Permanent Account Number (PAN)',
    'Income_Tax_PAN_Card_NSDL.pdf',
    'https://storage.supabase.co/govconnect-vault/usr-8849/pan_nsdl_verified.pdf',
    984500,
    'application/pdf',
    '4a6b2c89f412e6501a3b8c7e9d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    TRUE,
    'verified'
),
(
    'doc-itr-03',
    'usr-digilocker-8849',
    'Income Tax Return (ITR-V)',
    'ITR_V_Acknowledgement_AY2025-26.pdf',
    'https://storage.supabase.co/govconnect-vault/usr-8849/itr_v_ay2025_26.pdf',
    2150000,
    'application/pdf',
    '7b3e1c94d82f5a01e3b6c8f9a0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8',
    TRUE,
    'verified'
)
ON CONFLICT (document_id) DO NOTHING;

-- 5. Seed Document Verifications (Sangharsh's OCR/Verification output format)
INSERT INTO public.document_verifications (verification_id, document_id, matched, confidence_score, extracted_fields, flags, security_summary)
VALUES
(
    'verif-aadhaar-01',
    'doc-aadhaar-01',
    TRUE,
    99.8,
    '{"fullName": "Shivang Khorjuvekar", "dob": "1995-11-20", "idNumber": "XXXX-XXXX-8421", "address": "Flat 402, Shiv Shristi Enclave, Baner Road, Pune, Maharashtra 411045"}'::jsonb,
    '[]'::jsonb,
    'UIDAI PKI signature validated. Level 3 e-KYC authenticated.'
),
(
    'verif-pan-02',
    'doc-pan-02',
    TRUE,
    99.6,
    '{"fullName": "Shivang Khorjuvekar", "dob": "1995-11-20", "idNumber": "ABCDE1234F", "incomeAmount": "₹14,50,000 / annum"}'::jsonb,
    '[]'::jsonb,
    'NSDL/CBDT direct tax master record match.'
)
ON CONFLICT (verification_id) DO NOTHING;

-- 6. Seed Application
INSERT INTO public.applications (application_id, application_number, user_id, scheme_id, status, progress_percentage, notes, form_data, attached_doc_ids)
VALUES
(
    'app-sisfs-2026-001',
    'GOV-2026-SISFS-884901',
    'usr-digilocker-8849',
    'scheme-sisfs-01',
    'ready_to_submit',
    85,
    'All statutory identity and income documents verified via DigiLocker e-KYC.',
    '{"applicantName": "Shivang Khorjuvekar", "annualGrossIncome": "₹14,50,000", "requestedGrantOrSubsidy": "₹25,00,000 INR", "employerOrBusiness": "Apex Cybernetics India Pvt. Ltd."}'::jsonb,
    ARRAY['doc-aadhaar-01', 'doc-pan-02', 'doc-itr-03']
)
ON CONFLICT (application_id) DO NOTHING;

-- 7. Seed Reminders
INSERT INTO public.reminders (reminder_id, user_id, application_id, reminder_type, reminder_date, message, is_sent)
VALUES
(
    'rem-01',
    'usr-digilocker-8849',
    'app-sisfs-2026-001',
    'deadline',
    '2026-11-15',
    'DPIIT Startup India Seed Fund application deadline is November 15, 2026. Submit before 11:59 PM IST.',
    FALSE
),
(
    'rem-02',
    'usr-digilocker-8849',
    NULL,
    'notice',
    '2026-11-30',
    'DST INSPIRE Fellowship winter cycle closes November 30. Check updated guidelines.',
    FALSE
)
ON CONFLICT (reminder_id) DO NOTHING;
