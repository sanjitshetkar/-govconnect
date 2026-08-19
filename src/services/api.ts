import {
  UserProfile,
  UploadedDocument,
  ApplicationRecord,
  ApplicationFormData,
  AuditReport,
  Language,
} from '../types';

export interface ChatContext {
  userProfile: UserProfile;
  documents: UploadedDocument[];
  applications: ApplicationRecord[];
  activeApplication: ApplicationRecord | null;
  language?: Language;
}

export interface ChatResponse {
  text: string;
  timestamp: string;
  suggestions?: string[];
  suggestedActions?: string[];
  actionPayload?: any;
}

export async function sendChatMessage(
  prompt: string,
  history: Array<{ role: string; text: string }>,
  userProfileOrContext: UserProfile | ChatContext,
  documents?: UploadedDocument[],
  applications?: ApplicationRecord[],
  activeApplication?: ApplicationRecord | null,
  language: Language = 'EN'
): Promise<ChatResponse> {
  // Simulate network latency (250-500ms)
  await new Promise((resolve) => setTimeout(resolve, 350));

  let profile: UserProfile;
  let docs: UploadedDocument[];
  let apps: ApplicationRecord[];
  let activeApp: ApplicationRecord | null;
  let lang: Language = language;

  if ('userProfile' in userProfileOrContext) {
    profile = userProfileOrContext.userProfile;
    docs = userProfileOrContext.documents;
    apps = userProfileOrContext.applications;
    activeApp = userProfileOrContext.activeApplication;
    if (userProfileOrContext.language) {
      lang = userProfileOrContext.language;
    }
  } else {
    profile = userProfileOrContext;
    docs = documents || [];
    apps = applications || [];
    activeApp = activeApplication || null;
  }

  const lowerPrompt = prompt.toLowerCase();
  const timestamp =
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';

  // 1. Startup India / SISFS Eligibility
  if (
    lowerPrompt.includes('sisfs') ||
    lowerPrompt.includes('startup') ||
    lowerPrompt.includes('seed fund') ||
    lowerPrompt.includes('25 lakh') ||
    lowerPrompt.includes('grant')
  ) {
    if (lang === 'HI') {
      const suggestions = [
        'डिजिलॉकर से SISFS फॉर्म स्वतः भरें',
        'डीएसटी इंस्पायर फैलोशिप पात्रता जांचें',
        'अनुपालन स्कोर की समीक्षा करें',
      ];
      return {
        text: `🇮🇳 **DPIIT स्टार्टअप इंडिया सीड फंड योजना (SISFS) पात्रता समीक्षा:**

आपके सिंक किए गए **डिजिलॉकर** रिपॉजिटरी के आधार पर:
1. **DPIIT एवं MSME मान्यता**: आपका उद्यम प्रमाणपत्र (\`UDYAM-MH-26-0048921\`) आपको सूक्ष्म उद्यम के रूप में मान्य करता है।
2. **पहचान एवं अधिवास**: आधार ई-केवाईसी द्वारा महाराष्ट्र अधिकार क्षेत्र सत्यापित है।
3. **वित्तीय स्थिति**: ITR-V टैक्स अनुपालन की पुष्टि करता है।

**SISFS दिशानिर्देशों के तहत अनुदान लाभ:**
- प्रोटोटाइप और अवधारणा के प्रमाण (PoC) के लिए **₹20,00,000 (बीस लाख रुपये)** तक 100% अनुदान।
- बाजार प्रवेश और व्यावसायीकरण के लिए **₹50,00,000 (पचास लाख रुपये)** तक सहायता।

क्या आप **DPIIT-SISFS-2026** फॉर्म अभी स्वतः भरना चाहते हैं?`,
        timestamp,
        suggestions,
        suggestedActions: suggestions,
      };
    }

    const suggestions = [
      'Auto-Fill DPIIT-SISFS Form from DigiLocker',
      'Check DST INSPIRE Fellowship Eligibility',
      'Review Compliance Audit Score',
    ];
    return {
      text: `🇮🇳 **DPIIT Startup India Seed Fund Scheme (SISFS) Eligibility Scrutiny:**

Based on your synchronized **DigiLocker** repository:
1. **DPIIT & MSME Recognition**: Your Udyam Certificate (\`UDYAM-MH-26-0048921\`) qualifies you as a recognized micro-enterprise.
2. **Identity & Domicile**: Aadhaar e-KYC confirms Maharashtra jurisdiction.
3. **Financial Standing**: ITR-V verifies tax compliance with clean statutory standing.

**Grant Benefits under SISFS Guidelines:**
- Up to **₹20,00,000 (Twenty Lakhs INR)** as 100% grant for Proof of Concept (PoC) & prototype development.
- Up to **₹50,00,000 (Fifty Lakhs INR)** for market entry and commercialization via convertible debentures.

Would you like me to pre-fill the **DPIIT-SISFS-2026** form now?`,
      timestamp,
      suggestions,
      suggestedActions: suggestions,
    };
  }

  // 2. DST INSPIRE Fellowship
  if (
    lowerPrompt.includes('inspire') ||
    lowerPrompt.includes('dst') ||
    lowerPrompt.includes('fellowship') ||
    lowerPrompt.includes('research') ||
    lowerPrompt.includes('35 lakh')
  ) {
    if (lang === 'HI') {
      const suggestions = [
        'डीएसटी इंस्पायर फॉर्म स्वतः भरें',
        'डिजिलॉकर वॉल्ट रिकॉर्ड्स जांचें',
        'आवेदन केस ट्रैकर देखें',
      ];
      return {
        text: `🏛️ **विज्ञान एवं प्रौद्योगिकी विभाग (DST) इंस्पायर फैकल्टी योजना:**

**INSPIRE फैकल्टी फैलोशिप** प्रदान करती है:
- **₹1,25,000 / माह** समेकित फैलोशिप (3.3% वार्षिक वृद्धि के साथ)।
- **₹7,00,000 / वर्ष** अनुसंधान अनुदान (5 वर्षों में कुल ₹35 लाख)।
- किसी भी मान्यता प्राप्त भारतीय विश्वविद्यालय या राष्ट्रीय प्रयोगशाला में स्वतंत्र शोध दर्जा।

**डिजिलॉकर साक्ष्य स्थिति:**
- ✅ आधार पहचान (UIDAI सत्यापित)
- ✅ पैन कार्ड (NSDL सत्यापित)
- ⚠️ मेजबान संस्थान समर्थन (अंतिम जमा करने से पहले अनुलग्नक-II आवश्यक)

आप अपने डिजिलॉकर क्रेडेंशियल्स का उपयोग करके सीधे इस फॉर्म को स्वतः भर सकते हैं!`,
        timestamp,
        suggestions,
        suggestedActions: suggestions,
      };
    }

    const suggestions = [
      'Auto-Fill DST INSPIRE Form',
      'Inspect DigiLocker Vault Records',
      'View Application Case Tracker',
    ];
    return {
      text: `🏛️ **Department of Science & Technology (DST) INSPIRE Faculty Scheme:**

The **INSPIRE Faculty Fellowship** offers:
- **₹1,25,00,000 / month** consolidated fellowship with 3.3% annual increment.
- **₹7,00,000 / year** research grant (Total ₹35 Lakhs over 5 years).
- Independent research status at any recognized Indian university or national laboratory.

**DigiLocker Evidence Status:**
- ✅ Aadhaar Identity (UIDAI Verified)
- ✅ PAN Card (NSDL Verified)
- ⚠️ Host Institution Endorsement (Annexure-II required prior to final submission)

You can auto-fill this form directly using your DigiLocker credentials!`,
      timestamp,
      suggestions,
      suggestedActions: suggestions,
    };
  }

  // 3. PMEGP / MSME Subsidy
  if (
    lowerPrompt.includes('pmegp') ||
    lowerPrompt.includes('subsidy') ||
    lowerPrompt.includes('kvic') ||
    lowerPrompt.includes('50 lakh')
  ) {
    if (lang === 'HI') {
      const suggestions = [
        'PMEGP वैधानिक आवेदन प्रारंभ करें',
        'डिजिलॉकर से फॉर्म स्वतः भरें',
        'आधार-पैन लिंकिंग के बारे में पूछें',
      ];
      return {
        text: `📋 **प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP):**

**KVIC / सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय** द्वारा संचालित:
- **विनिर्माण इकाइयां**: ₹50 लाख तक परियोजना परिव्यय पर **35% सरकारी सब्सिडी** (₹17.5 लाख)।
- **सेवा इकाइयां**: ₹20 लाख तक परियोजना परिव्यय पर **35% सरकारी सब्सिडी** (₹7 लाख)।
- **संपार्श्विक-मुक्त ऋण**: CGTMSE क्रेडिट गारंटी योजना के तहत कवर।
- **प्रत्यक्ष लाभ अंतरण (DBT)**: लाभार्थी बैंक खाते में सीधे मार्जिन मनी सब्सिडी।

आपका आधार-लिंक्ड बैंक खाता (\`••••8492\`) प्रत्यक्ष इलेक्ट्रॉनिक डीबीटी संवितरण हेतु पात्र है।`,
        timestamp,
        suggestions,
        suggestedActions: suggestions,
      };
    }

    const suggestions = [
      'Start PMEGP Statutory Application',
      'Auto-fill form from DigiLocker',
      'Ask about Aadhaar-PAN linking',
    ];
    return {
      text: `📋 **Prime Minister Employment Generation Programme (PMEGP):**

Administered by **KVIC / Ministry of MSME**:
- **Manufacturing Units**: Up to ₹50 Lakhs project outlay with **35% Govt Subsidy** (₹17.5 Lakhs).
- **Service Units**: Up to ₹20 Lakhs project outlay with **35% Govt Subsidy** (₹7 Lakhs).
- **Collateral-Free Loan**: Covered under CGTMSE credit guarantee scheme.
- **Direct Benefit Transfer (DBT)**: Margin money subsidy directly locked into beneficiary bank account.

Your Aadhaar-linked HDFC Bank account (\`••••8492\`) is eligible for direct electronic DBT disbursement.`,
      timestamp,
      suggestions,
      suggestedActions: suggestions,
    };
  }

  // 4. Auto-fill request
  if (
    lowerPrompt.includes('auto-fill') ||
    lowerPrompt.includes('autofill') ||
    lowerPrompt.includes('fill') ||
    lowerPrompt.includes('form') ||
    lowerPrompt.includes('pre-fill')
  ) {
    if (lang === 'HI') {
      const suggestions = [
        'ऑटो-फिल पूर्वावलोकन एवं प्रिंट खोलें',
        'नियामक अनुपालन समीक्षा चलाएं',
        'केस डैशबोर्ड पर जाएं',
      ];
      return {
        text: `✨ **डिजिलॉकर 1-क्लिक ऑटो-फिल इंजन सक्रिय!**

मैंने आपके डिजिलॉकर रिपॉजिटरी से सभी सत्यापित पहचान डेटा को सक्रिय वैधानिक डॉकेट में मैप कर दिया है:
- **पूरा कानूनी नाम**: ${profile.name}
- **आधार / पैन**: ${profile.aadhaarMasked} / ${profile.panNumber}
- **आवासीय अधिवास**: ${profile.stateOrUT || 'महाराष्ट्र'}
- **सकल वार्षिक आय**: ₹14,50,000 (कर वर्ष 2025-26)
- **डिजिलॉकर प्रमाण संख्या**: ${docs.length} सत्यापित प्रमाणपत्र धारा 65B हैश सील के साथ जुड़े हुए हैं।

आधिकारिक भारत सरकार प्रिंट करने योग्य प्रपत्र की समीक्षा करने और आधार ई-साइन के साथ प्रेषित करने के लिए नीचे क्लिक करें।`,
        timestamp,
        suggestions,
        suggestedActions: suggestions,
      };
    }

    const suggestions = [
      'Open Auto-Fill Preview & Print',
      'Run Regulatory Audit',
      'Go to Case Dashboard',
    ];
    return {
      text: `✨ **DigiLocker One-Click Auto-Fill Engine Activated!**

I have mapped all verified identity data from your DigiLocker repository into the active statutory docket:
- **Full Legal Name**: ${profile.name}
- **Aadhaar / PAN**: ${profile.aadhaarMasked} / ${profile.panNumber}
- **Residential Domicile**: Pune, Maharashtra - 411045
- **Gross Revenue**: ₹14,50,000 (AY 2025-26)
- **DigiLocker Evidence Count**: ${docs.length} verified certificates linked with Section 65B hash seals.

Click below to review the official Government of India printable form and transmit with Aadhaar e-Sign.`,
      timestamp,
      suggestions,
      suggestedActions: suggestions,
    };
  }

  // 5. Hindi or Greeting inquiry
  if (
    lowerPrompt.includes('namaste') ||
    lowerPrompt.includes('namaskar') ||
    lowerPrompt.includes('hindi') ||
    lowerPrompt.includes('kaise') ||
    lowerPrompt.includes('hello') ||
    lowerPrompt.includes('hi')
  ) {
    const suggestions = [
      'DPIIT Startup India Seed Fund (₹25 Lakhs)',
      'DST INSPIRE Fellowship (₹35 Lakhs)',
      'DigiLocker Document Vault',
    ];
    return {
      text: `नमस्ते ${profile.name}! **JanSeva.gov.in (जन सेवा पोर्टल)** में आपका स्वागत है।

आप भारत सरकार के विभिन्न विभागों के अनुदान (Grants), फैलोशिप, और एमएसएमई योजनाओं के लिए सीधे आवेदन कर सकते हैं:
1. **DPIIT स्टार्टअप इंडिया सीड फंड** (₹25 लाख तक अनुदान)
2. **डीएसटी इंस्पायर फैकल्टी फैलोशिप** (₹35 लाख अनुसंधान अनुदान)
3. **पीएमईजीपी योजना** (35% सरकारी सब्सिडी)

आप अपनी डिजिलॉकर फ़ाइलों से सीधे फॉर्म ऑटो-फिल और प्रिंट कर सकते हैं। आप किस योजना में आवेदन करना चाहते हैं?`,
      timestamp,
      suggestions,
      suggestedActions: suggestions,
    };
  }

  // Default response
  if (lang === 'HI') {
    const suggestions = [
      'डिजिलॉकर से सक्रिय फॉर्म स्वतः भरें',
      'प्रस्तुति-पूर्व समीक्षा जांच चलाएं',
      'केस ट्रैकर डैशबोर्ड देखें',
    ];
    return {
      text: `🏛️ **जन सेवा पोर्टल आधिकारिक मार्गदर्शन अधिकारी:**

मैंने भारत सरकार के आधिकारिक दिशानिर्देशों, राजपत्र अधिसूचनाओं और **सूचना प्रौद्योगिकी अधिनियम, 2000** के अनुसार आपकी क्वेरी का विश्लेषण किया है।

- **सक्रिय योजना केस**: ${activeApp ? activeApp.title : 'DPIIT स्टार्टअप इंडिया सीड फंड'}
- **साक्ष्य वॉल्ट**: ${docs.length} डिजिलॉकर सत्यापित दस्तावेज़ सिंक्रनाइज़ किए गए हैं।
- **पहचान स्तर**: मेरी पहचान राष्ट्रीय सिंगल साइन-ऑन (आधार स्तर 3 ई-केवाईसी)।

क्या आप फॉर्म ऑटो-फिलिंग, पात्रता सत्यापन, या आधिकारिक आवेदन प्रिंट करने में सहायता चाहते हैं?`,
      timestamp,
      suggestions,
      suggestedActions: suggestions,
    };
  }

  const suggestions = [
    'Auto-Fill Active Form from DigiLocker',
    'Run Pre-Submission Audit Check',
    'View Case Tracker Dashboard',
  ];
  return {
    text: `🏛️ **JanSeva.gov.in Official Guidance Officer:**

I have processed your query against official **Government of India** guidelines, Gazette notifications, and the **Information Technology Act, 2000**.

- **Active Case**: ${activeApp ? activeApp.title : 'DPIIT Startup India Seed Fund'}
- **Evidentiary Vault**: ${docs.length} DigiLocker verified documents synchronized.
- **Assurance**: MeriPehchaan National Single Sign-On (Aadhaar Level 3 e-KYC).

Would you like me to guide you through form auto-filling, eligibility verification, or printing the official application?`,
    timestamp,
    suggestions,
    suggestedActions: suggestions,
  };
}

export async function processDocumentOcr(file: File): Promise<{
  docType: string;
  confidenceScore: number;
  sha256Hash: string;
  summary: string;
  extractedFields: any;
  securityVerification: any;
}> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const fileName = file.name.toLowerCase();
  const randomHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  let docType = 'Official Government Certificate';
  let summary = 'Verified electronic document under Information Technology Act 2000 Section 65B.';
  let extractedFields: any = {
    fullName: 'Shivang Khorjuvekar',
    issueDate: '2026-08-18',
    idNumber: 'GOI-VERIFIED-' + Math.floor(100000 + Math.random() * 900000),
  };

  if (fileName.includes('aadhaar') || fileName.includes('aadhar')) {
    docType = 'Aadhaar Card (UIDAI Verified)';
    summary = 'Unique Identification Authority of India e-KYC Aadhaar record. Biometric and domicile details authenticated.';
    extractedFields = {
      fullName: 'Shivang Khorjuvekar',
      dob: '1995-11-20',
      idNumber: 'XXXX-XXXX-8421',
      fatherOrSpouseName: 'Ramesh Khorjuvekar',
      address: 'Flat 402, Shiv Shristi Enclave, Baner Road, Pune, Maharashtra 411045',
    };
  } else if (fileName.includes('pan')) {
    docType = 'Permanent Account Number (PAN Card)';
    summary = 'Income Tax Department (CBDT) validated PAN card. Linked with Aadhaar for direct tax compliance.';
    extractedFields = {
      fullName: 'Shivang Khorjuvekar',
      dob: '1995-11-20',
      idNumber: 'ABCDE1234F',
      fatherOrSpouseName: 'Ramesh Khorjuvekar',
      incomeAmount: '₹14,50,000 / annum',
    };
  } else if (fileName.includes('itr') || fileName.includes('tax') || fileName.includes('income')) {
    docType = 'Income Tax Return Acknowledgement (ITR-V)';
    summary = 'Central Processing Centre Income Tax Return verification showing certified gross income of ₹14,50,000.';
    extractedFields = {
      fullName: 'Shivang Khorjuvekar',
      incomeAmount: '₹14,50,000',
      taxYear: 'AY 2025-26',
      employerOrInstitution: 'Apex Cybernetics India Pvt. Ltd.',
    };
  } else if (fileName.includes('udyam') || fileName.includes('msme')) {
    docType = 'MSME Udyam Registration Certificate';
    summary = 'Ministry of MSME statutory registration certificate under Micro Enterprise category.';
    extractedFields = {
      fullName: 'Shivang Khorjuvekar',
      idNumber: 'UDYAM-MH-26-0048921',
      employerOrBusiness: 'Apex Cybernetics India Pvt. Ltd.',
      qualificationOrCategory: 'Micro Enterprise (NIC 6201)',
    };
  }

  return {
    docType,
    confidenceScore: 99.4,
    sha256Hash: randomHash,
    summary,
    extractedFields,
    securityVerification: {
      tamperDetected: false,
      readableQuality: 'High',
      notes: 'DigiLocker PKI signature and SHA-256 hash successfully verified under Section 65B.',
    },
  };
}

export async function autoFillApplicationForm(payload: {
  templateId: string;
  applicationTitle: string;
  currentFormData: ApplicationFormData;
  documents: UploadedDocument[];
  userProfile: UserProfile;
}): Promise<{
  formData: ApplicationFormData;
  completenessPercentage: number;
  autofillSummary: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { currentFormData, userProfile, documents } = payload;

  const aadhaarDoc = documents.find((d) => d.docType.toLowerCase().includes('aadhaar'));
  const panDoc = documents.find((d) => d.docType.toLowerCase().includes('pan'));
  const itrDoc = documents.find((d) => d.docType.toLowerCase().includes('itr') || d.docType.toLowerCase().includes('tax'));
  const udyamDoc = documents.find((d) => d.docType.toLowerCase().includes('udyam') || d.docType.toLowerCase().includes('msme'));

  const updatedFormData: ApplicationFormData = {
    ...currentFormData,
    applicantName: aadhaarDoc?.extractedFields.fullName || userProfile.name,
    dateOfBirth: aadhaarDoc?.extractedFields.dob || currentFormData.dateOfBirth || '1995-11-20',
    gender: 'Male',
    aadhaarOrPan: `${userProfile.aadhaarMasked} / PAN: ${userProfile.panNumber}`,
    email: userProfile.email,
    phone: userProfile.phone,
    primaryAddress: aadhaarDoc?.extractedFields.address || 'Flat 402, Shiv Shristi Enclave, Baner Road',
    cityOrDistrict: 'Pune',
    stateOrUT: 'Maharashtra',
    pincode: '411045',
    citizenshipOrDomicile: 'Citizen of India (Maharashtra Domicile)',
    employerOrBusiness: udyamDoc?.extractedFields.employerOrBusiness || 'Apex Cybernetics India Pvt. Ltd.',
    annualGrossIncome: itrDoc?.extractedFields.incomeAmount || '₹14,50,000',
    occupationOrDesignation: 'Founder & Principal Systems Architect',
    declarationAccepted: true,
    digitalSignature: `${userProfile.name} (Aadhaar e-Signed)`,
    dateSigned: new Date().toISOString().split('T')[0],
  };

  return {
    formData: updatedFormData,
    completenessPercentage: 96,
    autofillSummary: `Form auto-filled with 100% precision from 4 DigiLocker verified certificates (Aadhaar, PAN, ITR-V, and Udyam).`,
  };
}

export async function runApplicationAudit(payload: {
  applicationTitle: string;
  formData: ApplicationFormData;
  documents: UploadedDocument[];
}): Promise<AuditReport> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const passedChecks = [
    'MeriPehchaan (National SSO) Level 3 Aadhaar e-KYC Verified',
    'PAN Card active and seeded with Aadhaar in CBDT Central Database',
    'DigiLocker Gross Annual Income matches declared ITR-V transcript',
    'Bank Account seeded with NPCI Aadhaar payment bridge for Direct Benefit Transfer (DBT)',
    'Section 65B Electronic Evidentiary Certificate generated with SHA-256 seals',
  ];

  const recommendations = [
    'Ensure all co-founders or institutional endorsers have active DigiLocker accounts for digital co-signing.',
  ];

  return {
    readinessScore: 98,
    passedChecks,
    warnings: [],
    recommendations,
    verdict: 'Compliant - Ready for Immediate Official Submission to Ministry',
  };
}
