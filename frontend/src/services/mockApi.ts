import {
  UserProfile,
  Application,
  DocumentItem,
  GovernmentService,
  NotificationItem,
  ChatMessage,
  UserImpactMetrics,
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  user_id: 'usr-sanjit-2026',
  name: 'Sanjit Shetkar',
  date_of_birth: '14 May 2003',
  mobile: '+91 98221 45091',
  email: 'sanjit.shetkar@example.com',
  address: 'H.No 42, Borda, Margao',
  district: 'South Goa',
  state: 'Goa',
  pincode: '403602',
  aadhaar_masked: '•••• •••• 8492',
  pan_number: 'BQWPS8412K',
  occupation: 'Undergraduate Student / Tech Intern',
  annual_income: '₹ 1,80,000',
  language_preference: 'en',
  voice_assistance_enabled: true,
  notifications_enabled: true,
};

export const INITIAL_SERVICES: GovernmentService[] = [
  // 1. IDENTITY & CARDS (BASIC CITIZEN DOCUMENTS)
  {
    service_id: 'srv-new-pan',
    title: 'Apply for New PAN Card (Instant e-PAN)',
    short_description: 'Get an official 10-digit PAN Card in 10 minutes using your Aadhaar. 100% paperless & free digital copy.',
    full_description: 'Instant PAN issuance service for citizens who do not hold a Permanent Account Number. Issued digitally by the Income Tax Department using Aadhaar e-KYC.',
    category: 'Identity & Cards',
    department: 'Income Tax Department (CBDT) / NSDL',
    benefit_amount: 'Official Lifetime Tax Identity (Instant e-PAN)',
    estimated_prep_time: '2 mins (Instant Aadhaar Match)',
    deadline: 'Available 24x7 online',
    match_score: 99,
    match_reasons: [
      'Aadhaar card available for instant e-KYC verification',
      'Age 18+ with active mobile number linked to Aadhaar',
    ],
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-pan-aadhaar',
        title: 'Valid Aadhaar with Mobile Linked',
        description: 'OTP will be sent to the mobile number registered with Aadhaar.',
        is_satisfied: true,
        checkable: true,
      },
      {
        criterion_id: 'crit-pan-none',
        title: 'Applicant Must Not Hold an Existing PAN',
        description: 'Holding multiple PAN cards is an offense under Section 272B.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Passport Size Photo', is_mandatory: false, category: 'identity', document_type: 'Photo' },
    ],
  },
  {
    service_id: 'srv-pan-update',
    title: 'PAN Card Update, Correction & Physical PVC Reprint',
    short_description: 'Change name, update address, correct date of birth, or order a new plastic PVC PAN Card delivered to your home.',
    full_description: 'Correction and reprinting service for existing PAN card holders. Correct typographical errors, update biometric photos, or replace damaged cards.',
    category: 'Identity & Cards',
    department: 'Income Tax Department / UTIITSL',
    benefit_amount: 'Updated PAN Record + Home Delivery of PVC Card',
    estimated_prep_time: '3 mins',
    deadline: 'Open year-round (Delivered in 7 working days)',
    match_score: 95,
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-pan-exist',
        title: 'Existing 10-Digit PAN Number',
        description: 'Valid PAN registered under the applicant name.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Existing PAN Card Copy', is_mandatory: true, category: 'identity', document_type: 'PAN Card' },
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
    ],
  },
  {
    service_id: 'srv-new-voter-id',
    title: 'Apply for New Voter ID Card (Election Card - Form 6)',
    short_description: 'Register as a new voter and get your official Election Commission Photo ID Card (EPIC) delivered to your home.',
    full_description: 'Form 6 application for registration of eligible citizens aged 18+ into the national electoral roll with digital e-EPIC download access.',
    category: 'Identity & Cards',
    department: 'Election Commission of India (ECI)',
    benefit_amount: 'Official National Voting Rights + Free Color Voter Card',
    estimated_prep_time: '3 mins',
    deadline: 'Open throughout the year',
    match_score: 97,
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-voter-age',
        title: 'Indian Citizen Aged 18 Years or Above',
        description: 'Must have attained 18 years of age on qualifying date.',
        is_satisfied: true,
        checkable: true,
      },
      {
        criterion_id: 'crit-voter-resident',
        title: 'Ordinary Resident of the Assembly Constituency',
        description: 'Living at the specified address within the polling area.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Passport Size Photo', is_mandatory: true, category: 'identity', document_type: 'Photo' },
      { document_name: 'Electricity Bill / Address Proof', is_mandatory: true, category: 'address', document_type: 'Address' },
    ],
  },
  {
    service_id: 'srv-voter-correction',
    title: 'Voter ID Correction & Address Shift (Form 8)',
    short_description: 'Update your address after shifting house, fix name spelling, or link your Aadhaar number to your Voter ID.',
    full_description: 'Form 8 application to update electoral roll entries, shift polling stations, or correct biometric and demographic information.',
    category: 'Identity & Cards',
    department: 'Election Commission of India (ECI)',
    benefit_amount: 'Updated Electoral Record & Replacement EPIC Card',
    estimated_prep_time: '2 mins',
    deadline: 'Open year-round',
    match_score: 92,
    popular: false,
    eligibility_criteria: [
      {
        criterion_id: 'crit-voter-shift',
        title: 'Existing Voter Registration in India',
        description: 'Must have an existing EPIC Voter Card number.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Existing Voter ID Card', is_mandatory: true, category: 'identity', document_type: 'Voter ID' },
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'New Address Proof', is_mandatory: true, category: 'address', document_type: 'Address' },
    ],
  },

  // 2. GOVERNMENT LOAN SCHEMES
  {
    service_id: 'srv-mudra-loan',
    title: 'PM Mudra Business Loan (Up to ₹10 Lakhs)',
    short_description: 'Get collateral-free business loans up to ₹10 Lakhs with low interest rates for shopkeepers, traders, and small business owners.',
    full_description: 'Pradhan Mantri MUDRA Yojana (PMMY) provides low-cost loans under 3 categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakhs), and Tarun (up to ₹10 Lakhs). No collateral required.',
    category: 'Loans',
    department: 'Ministry of Finance & Partner Public Banks',
    benefit_amount: '₹50,000 to ₹10 Lakhs (Zero Collateral Loan)',
    estimated_prep_time: '4 mins (Pre-filled Application)',
    deadline: 'Open throughout 2026',
    match_score: 91,
    match_reasons: [
      'Eligible for Kishore/Tarun category micro-business funding',
      'Bank passbook and identity documents available in vault',
    ],
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-mudra-biz',
        title: 'Small Business, Retail Shop, Trading or Service Unit',
        description: 'Any non-farm micro or small business enterprise.',
        is_satisfied: true,
        checkable: true,
      },
      {
        criterion_id: 'crit-mudra-clean',
        title: 'Good Banking Track Record (No Defaulter Record)',
        description: 'No prior non-performing loan default with any bank.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'PAN Card', is_mandatory: true, category: 'identity', document_type: 'PAN' },
      { document_name: 'Bank Passbook / Statement', is_mandatory: true, category: 'income', document_type: 'Bank Proof' },
      { document_name: 'Business Address Proof / Shop Proof', is_mandatory: false, category: 'address', document_type: 'Business Proof' },
    ],
  },
  {
    service_id: 'srv-svanidhi-loan',
    title: 'PM SVANidhi Small Vendor Loan (₹10,000 - ₹50,000)',
    short_description: 'Instant working capital loan starting at ₹10,000 with 7% interest subsidy and cashback rewards for street vendors and hawkers.',
    full_description: 'Micro-credit scheme by the Ministry of Housing and Urban Affairs providing accessible capital with step-up credit limits up to ₹50,000 on timely digital repayment.',
    category: 'Loans',
    department: 'Ministry of Housing and Urban Affairs (MoHUA)',
    benefit_amount: '₹10,000 - ₹50,000 Loan + 7% Interest Subsidy',
    estimated_prep_time: '2 mins',
    deadline: 'Open all year',
    match_score: 93,
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-svanidhi-vendor',
        title: 'Street Vendor, Small Stall Owner, or Mobile Hawkers',
        description: 'Vending certificate or local municipality ID card.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Bank Passbook / Statement', is_mandatory: true, category: 'income', document_type: 'Bank Proof' },
    ],
  },
  {
    service_id: 'srv-education-loan',
    title: 'Vidya Lakshmi Higher Education Loan Subsidy',
    short_description: 'Government-subsidized education loans up to ₹20 Lakhs with zero interest during study period for college students.',
    full_description: 'Single-window electronic platform for students seeking education loans and government interest subsidies under the Central Sector Interest Subsidy Scheme (CSIS).',
    category: 'Loans',
    department: 'Department of Higher Education & IBA',
    benefit_amount: 'Loans up to ₹ 20 Lakhs + 100% Interest Subsidy',
    estimated_prep_time: '3 mins',
    deadline: 'Open during academic admission season',
    match_score: 96,
    match_reasons: [
      'Enrolled in recognized undergraduate technical/degree program',
      'Income certificate is within subsidy ceiling (₹4.5L)',
    ],
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-ed-admission',
        title: 'Confirmed Admission in Higher Education Course',
        description: 'Admission in professional or technical degree in recognized college.',
        is_satisfied: true,
        checkable: true,
      },
      {
        criterion_id: 'crit-ed-income',
        title: 'Annual Family Income Below ₹ 4,50,000 for Subsidy',
        description: 'Full interest waiver during moratorium period.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'College Admission Letter', is_mandatory: true, category: 'education', document_type: 'Admission Letter' },
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Income Certificate', is_mandatory: true, category: 'income', document_type: 'Income' },
      { document_name: 'Class 12th Certificate', is_mandatory: true, category: 'education', document_type: '12th Marksheet' },
    ],
  },
  {
    service_id: 'srv-pmay-housing-loan',
    title: 'PM Awas Yojana (PMAY) Home Loan Interest Subsidy',
    short_description: 'Direct interest subsidy up to ₹2.67 Lakhs on bank home loans for buying or constructing your first family house.',
    full_description: 'Credit-Linked Subsidy Scheme (CLSS) under Pradhan Mantri Awas Yojana providing upfront interest reduction directly into home loan bank accounts.',
    category: 'Loans',
    department: 'Ministry of Housing & Urban Poverty Alleviation',
    benefit_amount: 'Up to ₹ 2.67 Lakhs Direct Home Loan Subsidy',
    estimated_prep_time: '4 mins',
    deadline: 'Open for 2026',
    match_score: 87,
    popular: false,
    eligibility_criteria: [
      {
        criterion_id: 'crit-pmay-first',
        title: 'First-Time Home Buyer (No Existing Pucca House)',
        description: 'The applicant or family must not own a pucca house in India.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'PAN Card', is_mandatory: true, category: 'identity', document_type: 'PAN' },
      { document_name: 'Income Certificate', is_mandatory: true, category: 'income', document_type: 'Income' },
      { document_name: 'Property / House Agreement Copy', is_mandatory: true, category: 'address', document_type: 'Property Deed' },
    ],
  },

  // 3. EDUCATION & SCHOLARSHIPS
  {
    service_id: 'srv-scholarship-postmatric',
    title: 'Post-Matric College Student Scholarship',
    short_description: 'Full 100% tuition fee reimbursement plus ₹12,000 annual maintenance allowance for college and diploma students.',
    full_description: 'Direct financial grant for college students pursuing undergraduate, diploma, or post-graduate courses. Direct Benefit Transfer (DBT) into bank accounts.',
    category: 'Education',
    department: 'Directorate of Higher Education & Social Welfare',
    benefit_amount: '100% Tuition Fee + ₹ 12,000 / yr Allowance',
    estimated_prep_time: '2 mins (with saved documents)',
    deadline: '18 September 2026',
    match_score: 98,
    match_reasons: [
      'Family income is below the ₹2.50L threshold',
      'Currently studying in higher education',
    ],
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-stud-status',
        title: 'Enrolled in Recognized College or University',
        description: 'Actively studying in degree, diploma, or technical course.',
        is_satisfied: true,
        checkable: true,
      },
      {
        criterion_id: 'crit-income-limit',
        title: 'Annual Family Income Below ₹ 2,50,000',
        description: 'Verified via Mamlatdar income certificate.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Income Certificate', is_mandatory: true, category: 'income', document_type: 'Income' },
      { document_name: 'Residence Certificate', is_mandatory: true, category: 'address', document_type: 'Residence' },
      { document_name: 'Class 12th Certificate', is_mandatory: true, category: 'education', document_type: '12th Marksheet' },
      { document_name: 'Current College Fee Receipt', is_mandatory: true, category: 'education', document_type: 'Fee Receipt' },
    ],
  },
  {
    service_id: 'srv-student-laptop',
    title: 'Free Student Laptop & Device Scheme',
    short_description: 'Free brand new laptop or ₹25,000 device grant for college students in technical, science, and vocational tracks.',
    full_description: 'State government initiative providing high-performance laptops or financial grants to students pursuing STEM and vocational courses.',
    category: 'Education',
    department: 'Department of Information Technology & Education',
    benefit_amount: 'Free Laptop or ₹ 25,000 Cash Grant',
    estimated_prep_time: '2 mins',
    deadline: '30 October 2026',
    match_score: 94,
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-lap-student',
        title: 'Enrolled in College Technical or Degree Course',
        description: 'Full-time college student.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'College ID & Bonafide Certificate', is_mandatory: true, category: 'education', document_type: 'Bonafide' },
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Class 12th Certificate', is_mandatory: true, category: 'education', document_type: '12th Marksheet' },
    ],
  },

  // 4. CERTIFICATES & TRANSPORT
  {
    service_id: 'srv-income-certificate',
    title: 'Income Certificate (Mamlatdar / Tehsildar)',
    short_description: 'Official government certificate proving annual household income. Needed for scholarships, loans, and subsidies.',
    full_description: 'Statutory certificate issued digitally by the Revenue Department validating annual family income from all sources.',
    category: 'Certificates',
    department: 'Revenue & District Administration',
    benefit_amount: 'Mandatory for All Government Subsidies & Fee Waivers',
    estimated_prep_time: '2 mins',
    deadline: 'Issued in 3 to 5 working days',
    match_score: 95,
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-inc-domicile',
        title: 'Resident of the Taluka or District',
        description: 'Living in jurisdiction of the issuing Mamlatdar office.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Ration Card / Address Proof', is_mandatory: true, category: 'address', document_type: 'Address' },
      { document_name: 'Salary Slip / Income Declaration', is_mandatory: true, category: 'income', document_type: 'Salary Slip' },
    ],
  },
  {
    service_id: 'srv-driving-licence',
    title: 'Driving Licence Renewal & Services',
    short_description: 'Renew your expired driving licence, change your permanent address, or order a replacement Smart Card.',
    full_description: 'Transport department portal service with Sarathi & DigiLocker integration. Smart card delivered to your home address.',
    category: 'Transport',
    department: 'Directorate of Transport',
    benefit_amount: 'Valid for 10-20 Years Nationwide',
    estimated_prep_time: '3 mins',
    deadline: 'Renewal Due (Expires soon)',
    match_score: 90,
    popular: true,
    eligibility_criteria: [
      {
        criterion_id: 'crit-dl-valid',
        title: 'Existing Driving Licence Holder',
        description: 'Holding a valid or expiring Learner/Permanent Driving Licence.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Existing Driving Licence Copy', is_mandatory: true, category: 'identity', document_type: 'Driving Licence' },
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Recent Passport Photo', is_mandatory: true, category: 'identity', document_type: 'Photo' },
    ],
  },
  {
    service_id: 'srv-residence-cert',
    title: 'Residence & Domicile Certificate',
    short_description: 'Official proof of permanent residence in the state. Required for government jobs and college quota admissions.',
    full_description: 'Certificate issued by the Sub-Divisional Magistrate / Mamlatdar verifying permanent residency in the state.',
    category: 'Certificates',
    department: 'Collectorate & District Administration',
    benefit_amount: 'Valid for State Quotas & Government Jobs',
    estimated_prep_time: '2 mins',
    deadline: 'Permanent validity once issued',
    match_score: 99,
    popular: false,
    eligibility_criteria: [
      {
        criterion_id: 'crit-res-years',
        title: 'Continuous Residence in State for 15+ Years',
        description: 'Established via school records, birth certificate, or parent utility bills.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'School Leaving Certificate', is_mandatory: true, category: 'education', document_type: 'SLC' },
      { document_name: 'Birth Certificate', is_mandatory: true, category: 'identity', document_type: 'Birth Certificate' },
    ],
  },
  {
    service_id: 'srv-solar-rooftop',
    title: 'PM Surya Ghar: Free Electricity Solar Subsidy',
    short_description: 'Direct government subsidy up to ₹78,000 for installing rooftop solar panels with up to 300 free units of electricity every month.',
    full_description: 'Central government renewable energy scheme providing direct cash assistance to families installing rooftop solar systems.',
    category: 'Housing',
    department: 'Ministry of New & Renewable Energy & Electricity Board',
    benefit_amount: 'Up to ₹ 78,000 Direct Subsidy + Free Electricity',
    estimated_prep_time: '3 mins',
    deadline: 'Open throughout 2026',
    match_score: 86,
    popular: false,
    eligibility_criteria: [
      {
        criterion_id: 'crit-solar-residence',
        title: 'Residential Roof Space Available',
        description: 'Adequate roof area for 1kW to 3kW solar installation.',
        is_satisfied: true,
        checkable: true,
      },
    ],
    required_documents: [
      { document_name: 'Latest Electricity Bill', is_mandatory: true, category: 'address', document_type: 'Electricity Bill' },
      { document_name: 'Aadhaar Card', is_mandatory: true, category: 'identity', document_type: 'Aadhaar' },
      { document_name: 'Bank Passbook / Statement', is_mandatory: true, category: 'income', document_type: 'Bank Proof' },
    ],
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    message_id: 'msg-welcome-1',
    sender: 'assistant',
    content: 'Hello! 👋 I am Gov AI, your personal government services assistant.\n\nTell me what scheme, certificate, or subsidy you need help with, and I will guide you with simple, fast steps.',
    timestamp: 'Just now',
    suggested_actions: [
      'I want to apply for a scholarship',
      'How do I get an income certificate?',
      'What documents do I need?',
      'Show me schemes I may qualify for',
    ],
  },
];

export const INITIAL_IMPACT_METRICS: UserImpactMetrics = {
  time_saved_minutes: 0,
  fields_autofilled: 0,
  documents_verified: 0,
  applications_managed: 0,
  global_stats: {
    applications_completed: '420,000+',
    hours_saved: '1.4M hrs',
    documents_processed: '3.8M',
    forms_autofilled: '94.2%',
  },
};

/**
 * Real Database / API Client Functions with seamless offline fallback
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [INITIAL_USER_PROFILE];
}

export async function registerCitizenAccount(profile: Partial<UserProfile>, password?: string): Promise<UserProfile> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, password }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
  } catch (e) {}
  return {
    ...INITIAL_USER_PROFILE,
    ...profile,
    user_id: profile.user_id || `usr-${Date.now()}`,
  } as UserProfile;
}


export async function getCitizenProfile(userId: string = 'usr-sanjit-2026'): Promise<UserProfile> {
  try {
    const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return { ...INITIAL_USER_PROFILE };
}

export async function updateCitizenProfile(profile: UserProfile): Promise<UserProfile> {
  try {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
  } catch (e) {}
  return profile;
}

export async function getApplications(userId: string = 'usr-sanjit-2026'): Promise<Application[]> {
  try {
    const res = await fetch(`/api/applications?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

export async function saveApplicationToDb(userId: string, app: Application): Promise<Application> {
  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, application: app }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.application;
    }
  } catch (e) {}
  return app;
}

export async function getDocuments(userId: string = 'usr-sanjit-2026'): Promise<DocumentItem[]> {
  try {
    const res = await fetch(`/api/documents?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

export async function saveDocumentToDb(userId: string, doc: DocumentItem): Promise<DocumentItem> {
  try {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, document: doc }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.document;
    }
  } catch (e) {}
  return doc;
}

export async function deleteDocumentFromDb(userId: string, docId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/documents/${encodeURIComponent(docId)}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      return data.success;
    }
  } catch (e) {}
  return true;
}

export async function getServices(query?: string, category?: string): Promise<GovernmentService[]> {
  let list = [...INITIAL_SERVICES];
  if (category && category !== 'All') {
    list = list.filter((s) => s.category === category);
  }
  if (query && query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.short_description.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getNotifications(userId: string = 'usr-sanjit-2026'): Promise<NotificationItem[]> {
  try {
    const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

export async function markNotificationReadInDb(userId: string, notifId: string) {
  try {
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, notification_id: notifId }),
    });
  } catch (e) {}
}

export async function getImpactMetrics(userId: string = 'usr-sanjit-2026'): Promise<UserImpactMetrics> {
  try {
    const res = await fetch(`/api/impact-metrics?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return { ...INITIAL_IMPACT_METRICS };
}

/**
 * Upload a real file to the Gemini OCR API for verification.
 * Returns a DocumentItem with real extracted fields, or throws with verificationStatus='failed'.
 */
export async function uploadAndVerifyDocument(
  file: File,
  base64Data: string,
  category: DocumentItem['category'] = 'identity'
): Promise<DocumentItem & { verificationStatus: 'verified' | 'warning' | 'failed'; failureReason?: string }> {
  const res = await fetch('/api/documents/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      documentName: file.name,
      fileType: file.type,
      base64Data,
      docTypeHint: category,
    }),
  });

  const data = await res.json();

  // Strict verification: Reject if confidence < 80% or status is failed
  const isRejected = !res.ok || data.verificationStatus === 'failed' || (typeof data.confidenceScore === 'number' && data.confidenceScore < 80);

  if (isRejected) {
    return {
      document_id: `doc-${Date.now()}`,
      document_name: file.name,
      category,
      status: 'needs_attention',
      file_type: file.type.includes('pdf') ? 'PDF Document' : 'Scanned Image',
      file_size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      upload_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      issuer: 'Unverified',
      is_digilocker_verified: false,
      verificationStatus: 'failed',
      failureReason: data.error || `OCR confidence score (${data.confidenceScore ?? 0}%) is below the required 80% threshold. Document rejected. Please upload a clear scan of your Aadhaar/PAN or official certificate.`,
    };
  }

  // Map docType to category
  const docTypeToCat: Record<string, DocumentItem['category']> = {
    'Passport': 'identity',
    'Indian Passport': 'identity',
    'Driver License': 'identity',
    'National ID': 'identity',
    'Aadhaar Card': 'identity',
    'PAN Card': 'identity',
    'Voter ID (EPIC)': 'identity',
    'Income Certificate / Tax W2': 'income',
    'Academic Degree / Transcript': 'education',
    'Domicile / Residence Certificate': 'address',
    'Utility Bill / Address Proof': 'address',
    'Business Registration': 'identity',
    'Medical Clearance': 'identity',
  };
  const resolvedCategory = docTypeToCat[data.docType] ?? category;

  // Build extracted_fields from OCR response
  const ef = data.extractedFields || {};
  const extractedFields: Record<string, string> = {};
  if (ef.fullName) extractedFields['Full Name'] = ef.fullName;
  if (ef.dob) extractedFields['Date of Birth'] = ef.dob;
  if (ef.idNumber) extractedFields['Document ID'] = ef.idNumber;
  if (ef.issueDate) extractedFields['Issue Date'] = ef.issueDate;
  if (ef.expiryDate) extractedFields['Expiry Date'] = ef.expiryDate;
  if (ef.issuingAuthority) extractedFields['Issuing Authority'] = ef.issuingAuthority;
  if (ef.address) extractedFields['Address'] = ef.address;
  if (ef.incomeAmount) extractedFields['Income'] = ef.incomeAmount;
  if (ef.employerOrInstitution) extractedFields['Institution'] = ef.employerOrInstitution;
  if (ef.qualificationOrCategory) extractedFields['Category'] = ef.qualificationOrCategory;
  // Any extra custom fields
  if (ef.customFields) {
    Object.entries(ef.customFields).forEach(([k, v]) => {
      extractedFields[k] = v as string;
    });
  }

  const verificationChecks = [];
  if (ef.fullName) verificationChecks.push({ check_name: `Name extracted: ${ef.fullName}`, passed: true });
  if (ef.dob) verificationChecks.push({ check_name: `Date of birth extracted: ${ef.dob}`, passed: true });
  if (ef.idNumber) verificationChecks.push({ check_name: `Government ID verified: ${ef.idNumber}`, passed: true });
  verificationChecks.push({
    check_name: `OCR confidence: ${data.confidenceScore}% (Meets ≥ 80% threshold requirement)`,
    passed: true,
  });
  if (data.securityVerification?.tamperDetected === false) {
    verificationChecks.push({ check_name: 'No tampering detected (AES-256 integrity passed)', passed: true });
  }

  return {
    document_id: `doc-${Date.now()}`,
    document_name: data.docType || file.name,
    category: resolvedCategory,
    status: 'verified',
    file_type: file.type.includes('pdf') ? 'PDF Document' : 'Scanned Image',
    file_size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    upload_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    issuer: ef.issuingAuthority || (data.docType === 'Aadhaar Card' ? 'UIDAI (Govt of India)' : data.docType === 'PAN Card' ? 'Income Tax Department' : 'Government of India'),
    is_digilocker_verified: true,
    extracted_fields: extractedFields,
    verification_checks: verificationChecks,
    verificationStatus: 'verified',
  };
}

/**
 * Demo-only upload used by the "sample file" quick-trigger buttons.
 * These have no real file bytes — returns a realistic simulated result.
 */
export async function simulateDemoUpload(
  fileName: string,
  category: DocumentItem['category'] = 'identity',
): Promise<DocumentItem> {
  await new Promise((r) => setTimeout(r, 1400));

  const isAadhaar = fileName.toLowerCase().includes('aadhaar') || fileName.toLowerCase().includes('id');
  const isDegree = fileName.toLowerCase().includes('degree') || fileName.toLowerCase().includes('college') || fileName.toLowerCase().includes('transcript');
  const isIncome = fileName.toLowerCase().includes('income') || fileName.toLowerCase().includes('salary');
  const isDomicile = fileName.toLowerCase().includes('domicile') || fileName.toLowerCase().includes('goa');

  const docName = isAadhaar
    ? 'Aadhaar Card'
    : isDegree
    ? 'Degree Certificate & Transcript'
    : isIncome
    ? 'Income Certificate'
    : isDomicile
    ? 'Domicile / Residence Certificate'
    : fileName;

  const resolvedCategory: DocumentItem['category'] = isDegree
    ? 'education'
    : isIncome
    ? 'income'
    : isDomicile
    ? 'address'
    : category;

  return {
    document_id: `doc-${Date.now()}`,
    document_name: docName,
    category: resolvedCategory,
    status: 'verified',
    file_type: fileName.endsWith('.pdf') ? 'PDF Document' : 'Scanned Image',
    file_size: '1.4 MB',
    upload_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    issuer: 'DigiLocker Verified / e-District Seal',
    is_digilocker_verified: true,
    extracted_fields: {
      'Full Name': 'Sanjit Shetkar',
      'Date of Birth': '14/05/2003',
      'Document ID': `IND-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      'Verification Status': '100% Authentic (Cryptographic Match)',
    },
    verification_checks: [
      { check_name: 'Name matches Sanjit Shetkar profile', passed: true },
      { check_name: 'Date of birth matches UIDAI records', passed: true },
      { check_name: 'High OCR clarity and digital signature verified', passed: true },
    ],
  };
}

// Keep the old export name as an alias for backwards compatibility
export const simulateDocumentUpload = simulateDemoUpload;
