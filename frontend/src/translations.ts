export type LanguageCode = 'en' | 'hi' | 'mr' | 'kok' | 'EN' | 'HI' | 'MR' | 'KOK';

export interface TranslationDictionary {
  sidebar: {
    dashboard: string;
    assistant: string;
    services: string;
    documents: string;
    autofill: string;
    tracking: string;
    alerts: string;
    profile: string;
    badgeVerified: string;
    switchAccount: string;
    newAccount: string;
    govtPortal: string;
  };
  dashboard: {
    title?: string;
    subtitle?: string;
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    recommendedTitle: string;
    recommendedSubtitle: string;
    deadlinesTitle: string;
    deadlinesSubtitle: string;
    impactTitle: string;
    timeSaved: string;
    fieldsAutofilled: string;
    docsVerified: string;
    appsManaged: string;
    checkEligibility: string;
    autoFillNow: string;
    viewAllServices: string;
    viewAllDeadlines: string;
    [key: string]: any;
  };
  services: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    education: string;
    healthcare: string;
    agriculture: string;
    housing: string;
    socialWelfare: string;
    business: string;
    transport: string;
    prepTime: string;
    benefit: string;
    requiredDocs: string;
    checkEligibilityBtn: string;
    noServicesFound: string;
    [key: string]: any;
  };
  assistant: {
    title: string;
    subtitle: string;
    voiceGuidance: string;
    listening: string;
    speak: string;
    stop: string;
    placeholder: string;
    send: string;
    quickPromptsTitle: string;
    disclaimer: string;
    clearHistory: string;
    [key: string]: any;
  };
  documents: {
    title: string;
    subtitle: string;
    uploadBtn: string;
    identityTab: string;
    educationTab: string;
    incomeTab: string;
    addressTab: string;
    allTab: string;
    verifiedBadge: string;
    expiresIn: string;
    viewDetails: string;
    deleteDoc: string;
    noDocs: string;
    ocrVerified: string;
    [key: string]: any;
  };
  autofill: {
    title: string;
    subtitle: string;
    fieldsPopulated: string;
    auditPassed: string;
    applicantSection: string;
    academicSection: string;
    financialSection: string;
    bankSection: string;
    declarationSection: string;
    acceptDeclaration: string;
    submitBtn: string;
    saveDraftBtn: string;
    readyForSubmission: string;
    [key: string]: any;
  };
  tracking: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allFilter: string;
    inReviewFilter: string;
    approvedFilter: string;
    draftFilter: string;
    timelineTitle: string;
    nextActionTitle: string;
    referenceNumber: string;
    noApplications: string;
    [key: string]: any;
  };
  alerts: {
    title: string;
    subtitle: string;
    allTab: string;
    unreadTab: string;
    actionRequiredTab: string;
    markAllRead: string;
    noAlerts: string;
    daysLeft: string;
    [key: string]: any;
  };
  profile: {
    title: string;
    subtitle: string;
    personalInfo: string;
    fullName: string;
    dob: string;
    mobile: string;
    email: string;
    occupation: string;
    familyIncome: string;
    addressInfo: string;
    state: string;
    district: string;
    pincode: string;
    preferences: string;
    preferredLanguage: string;
    voiceAssistance: string;
    saveBtn: string;
    savedSuccess: string;
    [key: string]: any;
  };
  vault?: any;
  nav?: any;
  oauth?: any;
  banner?: any;
  chat?: any;
  auth?: any;
  newApp?: any;
  gateway?: any;
  footer?: any;
}

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      assistant: 'AI Assistant',
      services: 'Explore Schemes',
      documents: 'Document Vault',
      autofill: 'Auto-Fill Form',
      tracking: 'Track Status',
      alerts: 'Notifications',
      profile: 'Citizen Profile',
      badgeVerified: 'Verified Citizen',
      switchAccount: 'Switch Profile',
      newAccount: '+ Add Account',
      govtPortal: 'GovConnect Portal',
    },
    dashboard: {
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      heroTitle: 'Tell us what you need. We will guide you through the rest.',
      heroSubtitle: 'Instant eligibility matching, auto-filled applications, and document verification in plain English.',
      searchPlaceholder: 'Search anything (e.g. "I want a scholarship", "Income certificate", "Solar grant")...',
      searchButton: 'Search Services',
      recommendedTitle: 'Recommended Schemes for You',
      recommendedSubtitle: 'Matched with 90%+ confidence based on your verified vault documents and domicile.',
      deadlinesTitle: 'Upcoming Statutory Deadlines',
      deadlinesSubtitle: 'Important dates requiring your attention to maintain active benefits.',
      impactTitle: 'Your GovConnect Impact',
      timeSaved: 'Minutes Saved',
      fieldsAutofilled: 'Fields Auto-Filled',
      docsVerified: 'Documents Verified',
      appsManaged: 'Applications Active',
      checkEligibility: 'Check Eligibility',
      autoFillNow: 'Auto-Fill Application Now',
      viewAllServices: 'View All Schemes →',
      viewAllDeadlines: 'View All Alerts →',
    },
    services: {
      title: 'Government Schemes & Services',
      subtitle: 'Browse all central and state citizen welfare schemes, scholarships, and statutory certificates.',
      searchPlaceholder: 'Search schemes by keyword, ministry, or department...',
      allCategories: 'All Categories',
      education: 'Education & Grants',
      healthcare: 'Healthcare & Insurance',
      agriculture: 'Agriculture & Farming',
      housing: 'Housing & Energy',
      socialWelfare: 'Social Welfare',
      business: 'Business & Startups',
      transport: 'Transport & Licences',
      prepTime: 'Prep Time:',
      benefit: 'Benefit:',
      requiredDocs: 'Required Documents:',
      checkEligibilityBtn: 'Check Eligibility & Apply',
      noServicesFound: 'No schemes found matching your search criteria.',
    },
    assistant: {
      title: 'GovConnect AI Assistant',
      subtitle: 'Your personal 24/7 navigator for government schemes, document readiness, and 1-click filing.',
      voiceGuidance: 'Voice Typing',
      listening: 'Listening to your voice...',
      speak: 'Listen (Audio)',
      stop: 'Stop Audio',
      placeholder: 'Ask anything about schemes, eligibility, or required forms...',
      send: 'Send',
      quickPromptsTitle: 'Popular Citizen Questions:',
      disclaimer: 'GovConnect AI provides official scheme guidance. All final submissions require Aadhaar authentication.',
      clearHistory: 'Clear History',
    },
    documents: {
      title: 'Smart Document Vault',
      subtitle: 'Cryptographically verified certificates and digital documents ready for 1-click auto-fill.',
      uploadBtn: 'Upload New Document',
      identityTab: 'Identity & KYC',
      educationTab: 'Education & Degrees',
      incomeTab: 'Income & Tax',
      addressTab: 'Residence & Domicile',
      allTab: 'All Documents',
      verifiedBadge: 'Verified Authenticity',
      expiresIn: 'Expires in',
      viewDetails: 'Inspect Verification',
      deleteDoc: 'Remove',
      noDocs: 'No documents found in this category.',
      ocrVerified: 'AI OCR Extraction Verified (100% Match)',
    },
    autofill: {
      title: 'Application Auto-Fill & Review',
      subtitle: 'Pre-populated in seconds from your verified vault documents. Review and submit with one click.',
      fieldsPopulated: '18 of 21 fields auto-populated from your vault',
      auditPassed: 'Compliance Audit Passed (100% Ready)',
      applicantSection: '1. Applicant Information',
      academicSection: '2. Education & Institution Details',
      financialSection: '3. Income & Scheme Grant Allocation',
      bankSection: '4. Direct Benefit Transfer (DBT) Bank Account',
      declarationSection: '5. Legal Citizen Declaration',
      acceptDeclaration: 'I declare that the information provided is true and accurate to the best of my knowledge.',
      submitBtn: 'Submit Application to Government Portal',
      saveDraftBtn: 'Save Draft',
      readyForSubmission: 'Ready for Official Submission',
    },
    tracking: {
      title: 'Application Status & Tracking',
      subtitle: 'Real-time vertical progress tracking for all your submitted and in-progress government applications.',
      searchPlaceholder: 'Search by reference number, scheme name, or department...',
      allFilter: 'All Applications',
      inReviewFilter: 'In Review',
      approvedFilter: 'Approved',
      draftFilter: 'Drafts',
      timelineTitle: 'Stage-by-Stage Timeline',
      nextActionTitle: 'Next Required Action:',
      referenceNumber: 'Reference ID:',
      noApplications: 'No applications found.',
    },
    alerts: {
      title: 'Notifications & Statutory Alerts',
      subtitle: 'Actionable reminders, deadline warnings, and application status updates.',
      allTab: 'All Alerts',
      unreadTab: 'Unread',
      actionRequiredTab: 'Action Required',
      markAllRead: 'Mark All as Read',
      noAlerts: 'No alerts right now. You are all caught up!',
      daysLeft: 'days remaining',
    },
    profile: {
      title: 'Citizen Profile & Preferences',
      subtitle: 'Manage your verified identity, contact information, and accessibility preferences.',
      personalInfo: 'Personal Information (Aadhaar Verified)',
      fullName: 'Full Name',
      dob: 'Date of Birth',
      mobile: 'Mobile Number',
      email: 'Email Address',
      occupation: 'Occupation / Category',
      familyIncome: 'Annual Family Income',
      addressInfo: 'Residential Address',
      state: 'State',
      district: 'District',
      pincode: 'PIN Code',
      preferences: 'Language & Accessibility Preferences',
      preferredLanguage: 'Application Language',
      voiceAssistance: 'Enable Voice Dictation & Read-Aloud',
      saveBtn: 'Save Profile Changes',
      savedSuccess: 'Profile changes successfully saved & synchronized!',
    },
  },

  hi: {
    sidebar: {
      dashboard: 'डैशबोर्ड',
      assistant: 'एआई सहायक',
      services: 'सरकारी योजनाएं',
      documents: 'दस्तावेज़ वॉल्ट',
      autofill: 'ऑटो-फिल फॉर्म',
      tracking: 'आवेदन स्थिति',
      alerts: 'सूचनाएं व अलर्ट',
      profile: 'नागरिक प्रोफ़ाइल',
      badgeVerified: 'सत्यापित नागरिक',
      switchAccount: 'प्रोफ़ाइल बदलें',
      newAccount: '+ नया खाता जोड़ें',
      govtPortal: 'जनसेवा पोर्टल',
    },
    dashboard: {
      greetingMorning: 'शुभ प्रभात',
      greetingAfternoon: 'शुभ दोपहर',
      greetingEvening: 'शुभ संध्या',
      heroTitle: 'बताएं आपको क्या चाहिए। बाकी मार्गदर्शन हम करेंगे।',
      heroSubtitle: 'सटीक पात्रता जांच, स्वतः भरे जाने वाले आवेदन और आपकी मातृभाषा में दस्तावेज़ सत्यापन।',
      searchPlaceholder: 'कुछ भी खोजें (जैसे "मुझे छात्रवृत्ति चाहिए", "आय प्रमाणपत्र", "सोलर सब्सिडी")...',
      searchButton: 'योजनाएं खोजें',
      recommendedTitle: 'आपके लिए अनुशंसित सरकारी योजनाएं',
      recommendedSubtitle: 'आपके सत्यापित दस्तावेजों और पते के आधार पर 90%+ सटीकता से चुनी गई योजनाएं।',
      deadlinesTitle: 'आगामी महत्वपूर्ण अंतिम तिथियां',
      deadlinesSubtitle: 'सक्रिय लाभ बनाए रखने के लिए समय पर ध्यान देने योग्य आवश्यक तिथियां।',
      impactTitle: 'आपका GovConnect प्रभाव',
      timeSaved: 'बचाया गया समय (मिनट)',
      fieldsAutofilled: 'स्वतः भरे गए फ़ील्ड',
      docsVerified: 'सत्यापित दस्तावेज़',
      appsManaged: 'सक्रिय आवेदन',
      checkEligibility: 'पात्रता जांचें',
      autoFillNow: 'आवेदन स्वतः भरें',
      viewAllServices: 'सभी योजनाएं देखें →',
      viewAllDeadlines: 'सभी अलर्ट देखें →',
    },
    services: {
      title: 'सरकारी योजनाएं एवं सेवाएं',
      subtitle: 'केंद्र एवं राज्य सरकार की सभी कल्याणकारी योजनाएं, छात्रवृत्तियां एवं वैधानिक प्रमाणपत्र खोजें।',
      searchPlaceholder: 'योजना का नाम, मंत्रालय या विभाग द्वारा खोजें...',
      allCategories: 'सभी श्रेणियां',
      education: 'शिक्षा एवं छात्रवृत्ति',
      healthcare: 'स्वास्थ्य एवं बीमा',
      agriculture: 'कृषि एवं किसान',
      housing: 'आवास एवं सौर ऊर्जा',
      socialWelfare: 'सामाजिक कल्याण',
      business: 'व्यापार एवं स्टार्टअप',
      transport: 'परिवहन व लाइसेंस',
      prepTime: 'तैयारी का समय:',
      benefit: 'लाभ / राशि:',
      requiredDocs: 'आवश्यक दस्तावेज़:',
      checkEligibilityBtn: 'पात्रता जांचें और आवेदन करें',
      noServicesFound: 'आपकी खोज से मेल खाती कोई योजना नहीं मिली।',
    },
    assistant: {
      title: 'जनसेवा एआई सहायक',
      subtitle: 'सरकारी योजनाओं, दस्तावेज़ तैयारी और 1-क्लिक आवेदन के लिए आपका व्यक्तिगत 24/7 मार्गदर्शक।',
      voiceGuidance: 'आवाज द्वारा टाइप करें',
      listening: 'आपकी आवाज सुनी जा रही है...',
      speak: 'ऑडियो सुनें',
      stop: 'ऑडियो बंद करें',
      placeholder: 'योजनाओं, पात्रता या आवश्यक फॉर्म के बारे में कुछ भी पूछें...',
      send: 'भेजें',
      quickPromptsTitle: 'अक्सर पूछे जाने वाले प्रश्न:',
      disclaimer: 'GovConnect AI आधिकारिक सरकारी नियमों पर सलाह देता है। अंतिम आवेदन पर आधार सत्यापन आवश्यक है।',
      clearHistory: 'इतिहास साफ़ करें',
    },
    documents: {
      title: 'डिजिटल दस्तावेज़ वॉल्ट',
      subtitle: '1-क्लिक फॉर्म भरने के लिए तैयार क्रिप्टोग्राफ़िक रूप से सत्यापित डिजिटल प्रमाणपत्र।',
      uploadBtn: 'नया दस्तावेज़ अपलोड करें',
      identityTab: 'पहचान व आधार',
      educationTab: 'शिक्षा व डिग्रियां',
      incomeTab: 'आय व कर',
      addressTab: 'निवास व अधिवास',
      allTab: 'सभी दस्तावेज़',
      verifiedBadge: 'सत्यापित प्रमाणपत्र',
      expiresIn: 'वैधता शेष:',
      viewDetails: 'सत्यापन विवरण देखें',
      deleteDoc: 'हटाएं',
      noDocs: 'इस श्रेणी में कोई दस्तावेज़ नहीं मिला।',
      ocrVerified: 'एआई ओसीआर निष्कर्षण सत्यापित (100% सही)',
    },
    autofill: {
      title: 'आवेदन स्वतः भरें व समीक्षा करें',
      subtitle: 'आपके सत्यापित वॉल्ट दस्तावेज़ों से कुछ ही सेकंड में भरा गया फॉर्म। 1-क्लिक में समीक्षा करें और जमा करें।',
      fieldsPopulated: '21 में से 18 फ़ील्ड आपके वॉल्ट से स्वतः भरे गए',
      auditPassed: 'सरकारी अनुपालन जांच सफल (100% तैयार)',
      applicantSection: '1. आवेदक की व्यक्तिगत जानकारी',
      academicSection: '2. शैक्षणिक व संस्थान विवरण',
      financialSection: '3. आय व अनुरोधित योजना अनुदान',
      bankSection: '4. प्रत्यक्ष लाभ अंतरण (DBT) बैंक खाता',
      declarationSection: '5. वैधानिक घोषणा',
      acceptDeclaration: 'मैं घोषणा करता/करती हूँ कि दी गई जानकारी मेरी सर्वोत्तम जानकारी के अनुसार सत्य और सही है।',
      submitBtn: 'सरकारी पोर्टल पर आवेदन जमा करें',
      saveDraftBtn: 'प्रारूप सहेजें',
      readyForSubmission: 'आधिकारिक प्रस्तुति हेतु तैयार',
    },
    tracking: {
      title: 'आवेदन स्थिति एवं ट्रैकिंग',
      subtitle: 'आपके जमा किए गए और प्रगतिशील सरकारी आवेदनों की वास्तविक समय चरण-दर-चरण ट्रैकिंग।',
      searchPlaceholder: 'संदर्भ संख्या, योजना का नाम या विभाग द्वारा खोजें...',
      allFilter: 'सभी आवेदन',
      inReviewFilter: 'जांच में प्रगतिशील',
      approvedFilter: 'स्वीकृत आदेश',
      draftFilter: 'प्रारूप (ड्राफ्ट)',
      timelineTitle: 'चरणबद्ध प्रगति समयरेखा',
      nextActionTitle: 'अगली आवश्यक कार्रवाई:',
      referenceNumber: 'संदर्भ संख्या:',
      noApplications: 'कोई आवेदन नहीं मिला।',
    },
    alerts: {
      title: 'सूचनाएं एवं वैधानिक अलर्ट',
      subtitle: 'समय पर कार्रवाई के लिए अनुस्मारक, समय-सीमा चेतावनी और आवेदन स्थिति अपडेट।',
      allTab: 'सभी सूचनाएं',
      unreadTab: 'अपठित',
      actionRequiredTab: 'कार्रवाई आवश्यक',
      markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
      noAlerts: 'अभी कोई नया अलर्ट नहीं है। सब कुछ अद्यतित है!',
      daysLeft: 'दिन शेष',
    },
    profile: {
      title: 'नागरिक प्रोफ़ाइल एवं प्राथमिकताएं',
      subtitle: 'अपनी सत्यापित पहचान, संपर्क विवरण और भाषा प्राथमिकताओं का प्रबंधन करें।',
      personalInfo: 'व्यक्तिगत जानकारी (आधार सत्यापित)',
      fullName: 'पूरा नाम',
      dob: 'जन्म तिथि',
      mobile: 'मोबाइल नंबर',
      email: 'ईमेल पता',
      occupation: 'व्यवसाय / श्रेणी',
      familyIncome: 'वार्षिक पारिवारिक आय',
      addressInfo: 'स्थायी आवासीय पता',
      state: 'राज्य',
      district: 'ज़िला',
      pincode: 'पिन कोड',
      preferences: 'भाषा और पहुंच प्राथमिकताएं',
      preferredLanguage: 'पोर्टल की भाषा',
      voiceAssistance: 'आवाज श्रवण एवं वाचन सक्षम करें',
      saveBtn: 'प्रोफ़ाइल परिवर्तन सहेजें',
      savedSuccess: 'प्रोफ़ाइल सफलतापूर्वक सहेजी और सिंक की गई!',
    },
  },

  mr: {
    sidebar: {
      dashboard: 'डॅशबोर्ड',
      assistant: 'एआय सहाय्यक',
      services: 'शासकीय योजना',
      documents: 'कागदपत्र वॉल्ट',
      autofill: 'ऑटो-फिल अर्ज',
      tracking: 'अर्ज स्थिती ट्रॅकर',
      alerts: 'सूचना व नोटिसा',
      profile: 'नागरिक प्रोफाईल',
      badgeVerified: 'सत्यापित नागरिक',
      switchAccount: 'प्रोफाईल बदला',
      newAccount: '+ नवीन खाते जोडा',
      govtPortal: 'जनसेवा पोर्टल',
    },
    dashboard: {
      greetingMorning: 'शुभ सकाळ',
      greetingAfternoon: 'शुभ दुपार',
      greetingEvening: 'शुभ संध्याकाळ',
      heroTitle: 'आपल्याला काय हवे ते सांगा. पुढील मार्गदर्शन आम्ही करू.',
      heroSubtitle: 'अचूक पात्रता तपासणी, आपोआप भरलेले अर्ज आणि मातृभाषेत कागदपत्र पडताळणी.',
      searchPlaceholder: 'काहीही शोधा (उदा. "मला स्कॉलरशिप हवी आहे", "उत्पन्न दाखला", "सोलर सबसिडी")...',
      searchButton: 'योजना शोधा',
      recommendedTitle: 'आपल्यासाठी शिफारस केलेल्या शासकीय योजना',
      recommendedSubtitle: 'आपल्या कागदपत्रांवर आधारित 90%+ अचूकतेने निवडलेल्या योजना.',
      deadlinesTitle: 'महत्त्वाच्या अंतिम मुदती',
      deadlinesSubtitle: 'सक्रिय लाभ सुरू ठेवण्यासाठी वेळेवर पूर्ण करावयाच्या बाबी.',
      impactTitle: 'आपला GovConnect प्रभाव',
      timeSaved: 'वाचलेला वेळ (मिनिटे)',
      fieldsAutofilled: 'आपोआप भरलेले रकाने',
      docsVerified: 'पडताळलेली कागदपत्रे',
      appsManaged: 'सक्रिय अर्ज',
      checkEligibility: 'पात्रता तपासा',
      autoFillNow: 'अर्ज आपोआप भरा',
      viewAllServices: 'सर्व योजना पहा →',
      viewAllDeadlines: 'सर्व नोटिसा पहा →',
    },
    services: {
      title: 'शासकीय योजना व सेवा',
      subtitle: 'केंद्र व राज्य शासनाच्या सर्व कल्याणकारी योजना, शिष्यवृत्ती आणि प्रमाणपत्रे.',
      searchPlaceholder: 'योजनेचे नाव, मंत्रालय किंवा विभागाद्वारे शोधा...',
      allCategories: 'सर्व वर्गवारी',
      education: 'शिक्षण व शिष्यवृत्ती',
      healthcare: 'आरोग्य व विमा',
      agriculture: 'शेती व शेतकरी',
      housing: 'घरकुल व ऊर्जा',
      socialWelfare: 'सामाजिक कल्याण',
      business: 'उद्योग व स्टार्टअप',
      transport: 'वाहतूक व परवाना',
      prepTime: 'तयारीचा वेळ:',
      benefit: 'लाभ / रक्कम:',
      requiredDocs: 'आवश्यक कागदपत्रे:',
      checkEligibilityBtn: 'पात्रता तपासा आणि अर्ज करा',
      noServicesFound: 'शोध निकषांनुसार कोणतीही योजना आढळली नाही.',
    },
    assistant: {
      title: 'जनसेवा एआय सहाय्यक',
      subtitle: 'शासकीय योजना, कागदपत्रे आणि 1-क्लिक अर्ज भरण्यासाठी आपला २४/७ वैयक्तिक वाटाड्या.',
      voiceGuidance: 'व्हॉइस टायपिंग',
      listening: 'आपला आवाज ऐकत आहे...',
      speak: 'ऐका (Audio)',
      stop: 'ऑडिओ थांबवा',
      placeholder: 'योजना, पात्रता किंवा आवश्यक फॉर्मबद्दल काहीही विचारा...',
      send: 'पाठवा',
      quickPromptsTitle: 'नेहमी विचारले जाणारे प्रश्न:',
      disclaimer: 'GovConnect AI अधिकृत शासकीय नियमांनुसार सल्ला देते. अंतिम अर्जासाठी आधार स्वाक्षरी आवश्यक आहे.',
      clearHistory: 'इतिहास पुसा',
    },
    documents: {
      title: 'स्मार्ट कागदपत्र वॉल्ट',
      subtitle: '1-क्लिक अर्ज भरण्यासाठी डिजिटल स्वाक्षरीने प्रमाणित केलेली सर्व प्रमाणपत्रे.',
      uploadBtn: 'नवीन कागदपत्र जोडा',
      identityTab: 'ओळख व आधार',
      educationTab: 'शिक्षण व पदव्या',
      incomeTab: 'उत्पन्न व कर',
      addressTab: 'अधिवास व रहिवासी',
      allTab: 'सर्व कागदपत्रे',
      verifiedBadge: 'प्रमाणित सत्यता',
      expiresIn: 'मुदत संपते:',
      viewDetails: 'तपशील तपासा',
      deleteDoc: 'काढून टाका',
      noDocs: 'या वर्गात कोणतीही कागदपत्रे आढळली नाहीत.',
      ocrVerified: 'एआय ओसीआर पडताळणी यशस्वी (100% जुळणी)',
    },
    autofill: {
      title: 'अर्ज ऑटो-फिल व पुनरावलोकन',
      subtitle: 'आपल्या कागदपत्रांमधून काही सेकंदांत भरलेला अर्ज. 1-क्लिकमध्ये तपासा आणि सादर करा.',
      fieldsPopulated: '21 पैकी 18 रकाने आपोआप भरले गेले',
      auditPassed: 'शासकीय पडताळणी यशस्वी (100% तयार)',
      applicantSection: '१. अर्जदाराची वैयक्तिक माहिती',
      academicSection: '२. शैक्षणिक व महाविद्यालयीन तपशील',
      financialSection: '३. उत्पन्न व योजना अनुदान वाटप',
      bankSection: '४. थेट लाभ हस्तांतरण (DBT) बँक खाते',
      declarationSection: '५. वैधानिक हमीपत्र',
      acceptDeclaration: 'मी जाहीर करतो/करते की दिलेली सर्व माहिती माझ्या माहितीनुसार खरी व बिनचूक आहे.',
      submitBtn: 'शासकीय पोर्टलवर अर्ज सादर करा',
      saveDraftBtn: 'मसुदा जतन करा',
      readyForSubmission: 'सादरीकरणासाठी सज्ज',
    },
    tracking: {
      title: 'अर्ज स्थिती व ट्रॅकिंग',
      subtitle: 'आपल्या सादर केलेल्या आणि चालू असलेल्या शासकीय अर्जांची टप्प्याटप्प्याने होणारी प्रगती.',
      searchPlaceholder: 'संदर्भ क्रमांक, योजनेचे नाव किंवा विभागाद्वारे शोधा...',
      allFilter: 'सर्व अर्ज',
      inReviewFilter: 'पडताळणी चालू',
      approvedFilter: 'मंजूर आदेश',
      draftFilter: 'मसुदा (Draft)',
      timelineTitle: 'टप्प्याटप्प्याची प्रगती',
      nextActionTitle: 'पुढील आवश्यक कृती:',
      referenceNumber: 'संदर्भ क्रमांक:',
      noApplications: 'कोणतेही अर्ज आढळले नाहीत.',
    },
    alerts: {
      title: 'सूचना व शासकीय नोटिसा',
      subtitle: 'अंतिम मुदतीचे इशारे, स्मरणपत्रे आणि अर्जांच्या स्थितीचे अपडेट्स.',
      allTab: 'सर्व सूचना',
      unreadTab: 'न वाचलेल्या',
      actionRequiredTab: 'कृती आवश्यक',
      markAllRead: 'सर्व वाचल्याचे चिन्हांकित करा',
      noAlerts: 'सध्या कोणत्याही नवीन सूचना नाहीत!',
      daysLeft: 'दिवस शिल्लक',
    },
    profile: {
      title: 'नागरिक प्रोफाईल व प्राधान्ये',
      subtitle: 'आपली ओळख, संपर्क माहिती आणि भाषा प्राधान्ये व्यवस्थापित करा.',
      personalInfo: 'वैयक्तिक माहिती (आधार प्रमाणित)',
      fullName: 'पूर्ण नाव',
      dob: 'जन्मतारीख',
      mobile: 'मोबाईल क्रमांक',
      email: 'ईमेल पत्ता',
      occupation: 'व्यवसाय / वर्गवारी',
      familyIncome: 'वार्षिक कौटुंबिक उत्पन्न',
      addressInfo: 'कायमचा रहिवासी पत्ता',
      state: 'राज्य',
      district: 'जिल्हा',
      pincode: 'पिन कोड',
      preferences: 'भाषा आणि सुलभता प्राधान्ये',
      preferredLanguage: 'पोर्टलची भाषा',
      voiceAssistance: 'आवाज मार्गदर्शन व वाचन सक्षम करा',
      saveBtn: 'बदल जतन करा',
      savedSuccess: 'प्रोफाईल यशस्वीरीत्या जतन झाली!',
    },
  },

  kok: {
    sidebar: {
      dashboard: 'डॅशबोर्ड',
      assistant: 'एआय सहाय्यक',
      services: 'सरकारी येवजण्यो',
      documents: 'दस्तऐवज वॉल्ट',
      autofill: 'ऑटो-फिल अर्ज',
      tracking: 'अर्ज स्थिती',
      alerts: 'सुचोवण्यो व नोटिसा',
      profile: 'नागरीक प्रोफायल',
      badgeVerified: 'तपासिल्लो नागरीक',
      switchAccount: 'खातें बदला',
      newAccount: '+ नवें खातें',
      govtPortal: 'जनसेवा पोर्टल',
    },
    dashboard: {
      greetingMorning: 'देव बऱ्या दिसा',
      greetingAfternoon: 'बऱ्या दुपारां',
      greetingEvening: 'बऱ्या सांजवेळा',
      heroTitle: 'तुमकां कितें जाय तें सांगात. फुडलें मार्गदर्शन आमी करतले.',
      heroSubtitle: 'पात्रता तपासणी, आपशींच भरिल्ले अर्ज आनी कोंकणींत दस्तऐवज तपासणी.',
      searchPlaceholder: 'कितेंय सोधात (उदा. "म्हाका स्कॉलरशिप जाय", "उत्पन्नाचो दाखलो", "सोलर सबसिडी")...',
      searchButton: 'येवजण्यो सोधात',
      recommendedTitle: 'तुमच्या खातीर सरकारी येवजण्यो',
      recommendedSubtitle: 'तुमच्या कागदपत्रांचेर आदारून 90%+ खात्रीशीर येवजण्यो.',
      deadlinesTitle: 'महत्वाच्यो निमाण्यो तारखो',
      deadlinesSubtitle: 'सरकारी लाभां खातीर वेळार पूर्ण करपाच्यो गजाली.',
      impactTitle: 'तुमचो GovConnect प्रभाव',
      timeSaved: 'वांचयल्लो वेळ (मिनिटां)',
      fieldsAutofilled: 'आपशींच भरिल्लीं म्हायती',
      docsVerified: 'तपासिल्लीं कागदपत्रां',
      appsManaged: 'चालू अर्ज',
      checkEligibility: 'पात्रता पळयात',
      autoFillNow: 'अर्ज आपशींच भरात',
      viewAllServices: 'सगळ्यो येवजण्यो पळयात →',
      viewAllDeadlines: 'सगळ्यो सुचोवण्यो पळयात →',
    },
    services: {
      title: 'सरकारी येवजण्यो आनी सेवा',
      subtitle: 'सगळ्यो सरकारी येवजण्यो, स्कॉलरशिप्स आनी दाखले सोधात.',
      searchPlaceholder: 'येवजणेचें नांव वा खात्या वरवीं सोधात...',
      allCategories: 'सगळे प्रकार',
      education: 'शिक्षण आनी स्कॉलरशिप',
      healthcare: 'भलायकी आनी विमा',
      agriculture: 'शेतकामती येवजण्यो',
      housing: 'घरकुल आनी ऊर्जा',
      socialWelfare: 'समाजीक कल्याण',
      business: 'उद्योग आनी वेवसाय',
      transport: 'येरादारी आनी लायसन्स',
      prepTime: 'लागपी वेळ:',
      benefit: 'मेळपी लाभ:',
      requiredDocs: 'लागपी कागदपत्रां:',
      checkEligibilityBtn: 'पात्रता तपासात आनी अर्ज करात',
      noServicesFound: 'ह्या सोदाक जुळपी कसलीच येवजण मेळूंक ना.',
    },
    assistant: {
      title: 'जनसेवा एआय सहाय्यक',
      subtitle: 'सरकारी कामां, कागदपत्रां आनी अर्ज भरपा खातीर तुमचो २४/७ वांगडी.',
      voiceGuidance: 'उलवून टायप करात',
      listening: 'तुमचो आवाज आयकता...',
      speak: 'आयकात (Audio)',
      stop: 'ऑडिओ बंद करात',
      placeholder: 'येवजण्यो वा फॉर्म विशीं कितेंय विचारात...',
      send: 'धाडात',
      quickPromptsTitle: 'नेमान विचारिल्ले प्रस्न:',
      disclaimer: 'GovConnect AI अधिकृत सरकारी नियमां प्रमाणे मार्गदर्शन दिता.',
      clearHistory: 'इतिहास पुसात',
    },
    documents: {
      title: 'स्मार्ट दस्तऐवज वॉल्ट',
      subtitle: '१-क्लिकाचेर अर्ज भरपा खातीर डिजिटल तपासणी जाल्लीं कागदपत्रां.',
      uploadBtn: 'नवें कागदपत्र चढायात',
      identityTab: 'ओळख आनी आधार',
      educationTab: 'शिक्षण आनी पदव्यो',
      incomeTab: 'उत्पन्न दाखलो',
      addressTab: 'रावपाचो दाखलो',
      allTab: 'सगळीं कागदपत्रां',
      verifiedBadge: 'सत्यापित कागदपत्र',
      expiresIn: 'मुदत सोंपता:',
      viewDetails: 'तपशील पळयात',
      deleteDoc: 'काडून उडयात',
      noDocs: 'ह्या प्रकारांत कसलींच कागदपत्रां नात.',
      ocrVerified: 'एआय ओसीआर तपासणी जाली (100% जुळणी)',
    },
    autofill: {
      title: 'अर्ज आपशींच भरप आनी पळोवप',
      subtitle: 'तुमच्या कागदपत्रां वरवीं सेकंदांनी भरिल्लो अर्ज. १-क्लिकाचेर तपासात आनी धाडात.',
      fieldsPopulated: '21 तलीं 18 म्हायती आपशींच भरलीं',
      auditPassed: 'सरकारी तपासणी यशस्वी (100% तयार)',
      applicantSection: '१. अर्जदाराची म्हायती',
      academicSection: '२. शिक्षण आनी कॉलेज तपशील',
      financialSection: '३. उत्पन्न आनी मेळपी अनुदान',
      bankSection: '४. थेट बँक खाते (DBT)',
      declarationSection: '५. हमीपत्र',
      acceptDeclaration: 'हांव जाहीर करतां की दिल्ले सगळी म्हायती खरी आनी बरोबर आसा.',
      submitBtn: 'सरकारी पोर्टलार अर्ज धाडात',
      saveDraftBtn: 'मसुदो सांभाळात',
      readyForSubmission: 'धाडपा खातीर तयार',
    },
    tracking: {
      title: 'अर्ज स्थिती आनी ट्रॅकिंग',
      subtitle: 'तुमच्या धाडिल्ल्या सरकारी अर्जांची प्रगती आनी स्थिती पळयात.',
      searchPlaceholder: 'संदर्भ क्रमांक वा येवजणेच्या नांवान सोधात...',
      allFilter: 'सगळे अर्ज',
      inReviewFilter: 'तपासणी चालू',
      approvedFilter: 'मंजूर जाल्ले',
      draftFilter: 'मसुदो',
      timelineTitle: 'टप्प्या टप्प्यांची प्रगती',
      nextActionTitle: 'फुडें कितें करचें:',
      referenceNumber: 'संदर्भ क्रमांक:',
      noApplications: 'कसलेच अर्ज मेळूंक नात.',
    },
    alerts: {
      title: 'सुचोवण्यो आनी नोटिसा',
      subtitle: 'वेळार काम करपा खातीर शिटकावण्यो आनी अर्जांची म्हायती.',
      allTab: 'सगळ्यो सुचोवण्यो',
      unreadTab: 'वाचूंक नाशिल्ल्यो',
      actionRequiredTab: 'कारवाय जाय',
      markAllRead: 'सगळ्यो वाचिल्ल्यो करात',
      noAlerts: 'सध्या कसलीच नवी सुचोवणी ना!',
      daysLeft: 'दीस उरल्यात',
    },
    profile: {
      title: 'नागरीक प्रोफायल आनी पसंती',
      subtitle: 'तुमची ओळख, संपर्क म्हायती आनी भाशेची पसंती सांबाळात.',
      personalInfo: 'वैयक्तिक म्हायती (आधार तपासणी)',
      fullName: 'पुराय नांव',
      dob: 'जल्म तारीख',
      mobile: 'मोबाईल नंबर',
      email: 'ईमेल',
      occupation: 'वेवसाय / वर्गवारी',
      familyIncome: 'कुटुंबाचें वर्सुकी उत्पन्न',
      addressInfo: 'रावपाचो पत्तो',
      state: 'राज्य',
      district: 'जिल्हो',
      pincode: 'पिन कोड',
      preferences: 'भास आनी पसंती',
      preferredLanguage: 'पोर्टलाची भास',
      voiceAssistance: 'आवाज मार्गदर्शन चालू करात',
      saveBtn: 'बदल सांबाळात',
      savedSuccess: 'प्रोफायल सांबाळ्ळी आनी सिंक जाली!',
    },
  },
};

(TRANSLATIONS as any).EN = TRANSLATIONS.en;
(TRANSLATIONS as any).HI = TRANSLATIONS.hi;
(TRANSLATIONS as any).MR = TRANSLATIONS.mr;
(TRANSLATIONS as any).KOK = TRANSLATIONS.kok;

export const SCHEME_TRANSLATIONS: Record<string, Record<'hi' | 'mr' | 'kok', { title: string; short_description: string; benefit_amount: string; department: string }>> = {
  // 1. Identity & Basic Documents
  'srv-new-pan': {
    hi: {
      title: 'नया पैन कार्ड आवेदन (तुरंत ई-पैन)',
      short_description: 'आधार ई-केवाईसी के माध्यम से 10 मिनट में डिजिटल पैन कार्ड प्राप्त करें। 100% पेपरलेस व निःशुल्क।',
      benefit_amount: 'आधिकारिक आजीवन टैक्स पहचान (तुरंत ई-पैन)',
      department: 'आयकर विभाग (CBDT) / NSDL',
    },
    mr: {
      title: 'नवीन पॅन कार्ड अर्ज (त्वरित ई-पॅन)',
      short_description: 'आधार ई-केवायसी द्वारे 10 मिनिटांत डिजिटल पॅन कार्ड मिळवा. 100% मोफत व डिजिटल.',
      benefit_amount: 'कायमस्वरूपी कर ओळख (ई-पॅन)',
      department: 'आयकर विभाग / NSDL',
    },
    kok: {
      title: 'नवें पॅन कार्ड अर्ज (ई-पॅन)',
      short_description: 'आधार कार्डा वरवीं १० मिण्टांत डिजिटल पॅन कार्ड मेळयात.',
      benefit_amount: 'कर आयडेंटिटी कार्ड (ई-पॅन)',
      department: 'आयकर खातें',
    },
  },
  'srv-pan-update': {
    hi: {
      title: 'पैन कार्ड सुधार एवं नया प्लास्टिक कार्ड (PVC Reprint)',
      short_description: 'नाम, जन्मतिथि, पता सुधारें या घर पर नया प्लास्टिक पीवीसी पैन कार्ड मंगवाएं।',
      benefit_amount: 'सुधरा हुआ रिकॉर्ड + घर पर प्लास्टिक कार्ड डिलीवरी',
      department: 'आयकर विभाग / UTIITSL',
    },
    mr: {
      title: 'पॅन कार्ड दुरुस्ती व पीव्हीसी कार्ड पुनर्मुद्रण',
      short_description: 'नाव, पत्ता, जन्मतारीख दुरुस्त करा किंवा नवीन प्लास्टिक पीव्हीसी पॅन कार्ड घरपोच मिळवा.',
      benefit_amount: 'अद्ययावत पॅन + घरपोच पीव्हीसी कार्ड',
      department: 'आयकर विभाग / UTIITSL',
    },
    kok: {
      title: 'पॅन कार्ड दुरुस्ती आनी नवें कार्ड',
      short_description: 'नांव, जन्मतारीख दुरुस्त करात वा नवें कार्ड घरा मागयात.',
      benefit_amount: 'दुरुस्त पॅन + प्लास्टिक कार्ड',
      department: 'आयकर खातें',
    },
  },
  'srv-new-voter-id': {
    hi: {
      title: 'नया वोटर आईडी कार्ड आवेदन (फॉर्म 6)',
      short_description: '18 वर्ष से अधिक आयु के नागरिकों के लिए मतदाता पहचान पत्र (वोटर कार्ड)। घर पर निःशुल्क रंगीन कार्ड प्राप्त करें।',
      benefit_amount: 'मतदान अधिकार + निःशुल्क रंगीन वोटर कार्ड',
      department: 'भारत निर्वाचन आयोग (ECI)',
    },
    mr: {
      title: 'नवीन मतदार ओळखपत्र अर्ज (फॉर्म 6)',
      short_description: '18 वर्षे पूर्ण झालेल्या नागरिकांसाठी नवीन मतदार ओळखपत्र. घरपोच मोफत रंगीत कार्ड मिळवा.',
      benefit_amount: 'मतदान हक्क + मोफत मतदार कार्ड',
      department: 'भारतीय निवडणूक आयोग (ECI)',
    },
    kok: {
      title: 'नवें वेंचणूक कार्ड अर्ज (फॉर्म 6)',
      short_description: '१८ वर्सां भरिल्ल्या नागरिकां खातीर वेंचणूक ओळखपत्र (वोटर कार्ड).',
      benefit_amount: 'मतदान हक्क + वेंचणूक कार्ड',
      department: 'वेंचणूक आयोग',
    },
  },
  'srv-voter-correction': {
    hi: {
      title: 'वोटर कार्ड सुधार एवं पता परिवर्तन (फॉर्म 8)',
      short_description: 'घर बदलने पर पता बदलें, नाम की स्पेलिंग ठीक करें या वोटर कार्ड में आधार लिंक करें।',
      benefit_amount: 'सुधरा हुआ वोटर रिकॉर्ड + नया कार्ड',
      department: 'भारत निर्वाचन आयोग (ECI)',
    },
    mr: {
      title: 'मतदार कार्ड दुरुस्ती व पत्ता बदल (फॉर्म 8)',
      short_description: 'पत्ता बदलणे, नावाची दुरुस्ती किंवा मतदार कार्डाशी आधार लिंक करणे.',
      benefit_amount: 'अद्ययावत मतदार यादी + नवीन कार्ड',
      department: 'भारतीय निवडणूक आयोग (ECI)',
    },
    kok: {
      title: 'वेंचणूक कार्ड पत्तो बदल आनी दुरुस्ती (फॉर्म 8)',
      short_description: 'घर बदल्ल्यार पत्तो बदल करात वा नांव दुरुस्त करात.',
      benefit_amount: 'दुरुस्त वेंचणूक कार्ड',
      department: 'वेंचणूक आयोग',
    },
  },

  // 2. Loans
  'srv-mudra-loan': {
    hi: {
      title: 'पीएम मुद्रा व्यापार लोन (₹10 लाख तक)',
      short_description: 'दुकानदारों, व्यापारियों और छोटे उद्योगों के लिए बिना किसी गारंटी (कोलैटरल) के आसान लोन।',
      benefit_amount: '₹50,000 से ₹10 लाख तक (बिना गारंटी लोन)',
      department: 'वित्त मंत्रालय एवं बैंक',
    },
    mr: {
      title: 'पीएम मुद्रा व्यवसाय कर्ज (₹10 लाखांपर्यंत)',
      short_description: 'दुकानदार, छोटे व्यापारी आणि उद्योजकांसाठी विनातारण (Zero Collateral) सुलभ कर्ज.',
      benefit_amount: '₹50,000 ते ₹10 लाख (विनातारण कर्ज)',
      department: 'वित्त मंत्रालय व राष्ट्रीय बँका',
    },
    kok: {
      title: 'पीएम मुद्रा वेवसाय कर्ज (₹10 लाखां मेरेन)',
      short_description: 'दुकानदार आनी ल्हान वेवसायिकां खातीर गॅरंटी विरयत कर्ज.',
      benefit_amount: '₹10 लाखां मेरेन कर्ज',
      department: 'वित्त खातें',
    },
  },
  'srv-svanidhi-loan': {
    hi: {
      title: 'पीएम स्वनिधि स्ट्रीट वेंडर लोन (₹10,000 - ₹50,000)',
      short_description: 'रेहड़ी-पटरी विक्रेताओं और छोटे दुकानदारों के लिए 7% ब्याज सब्सिडी के साथ आसान कार्यशील पूंजी लोन।',
      benefit_amount: '₹10,000 से ₹50,000 लोन + 7% ब्याज सब्सिडी',
      department: 'आवासन एवं शहरी कार्य मंत्रालय (MoHUA)',
    },
    mr: {
      title: 'पीएम स्वनिधी फेरीवाला कर्ज (₹10,000 - ₹50,000)',
      short_description: 'फेरीवाले व लहान विक्रेत्यांसाठी 7% व्याज सवलतीसह सुलभ कर्ज.',
      benefit_amount: '₹10,000 ते ₹50,000 + 7% व्याज सवलत',
      department: 'गृहनिर्माण व शहरी व्यवहार मंत्रालय',
    },
    kok: {
      title: 'पीएम स्वनिधी ल्हान वेवसाय कर्ज',
      short_description: 'गाड्यो घालप्यां खातीर सोंपेपणान मेळपी कर्ज.',
      benefit_amount: '₹10,000 ते ₹50,000 कर्ज',
      department: 'शहरी विकास खातें',
    },
  },
  'srv-education-loan': {
    hi: {
      title: 'विद्या लक्ष्मी उच्च शिक्षा लोन सब्सिडी',
      short_description: 'कॉलेज और उच्च शिक्षा के लिए ₹20 लाख तक का रियायती लोन। पढ़ाई के दौरान 100% ब्याज माफ़।',
      benefit_amount: '₹20 लाख तक लोन + पढ़ाई के दौरान शून्य ब्याज',
      department: 'उच्च शिक्षा विभाग एवं IBA',
    },
    mr: {
      title: 'विद्या लक्ष्मी उच्च शिक्षण कर्ज योजना',
      short_description: 'महाविद्यालयीन शिक्षणासाठी ₹20 लाखांपर्यंत कर्ज आणि शिक्षण काळात 100% व्याज माफी.',
      benefit_amount: '₹20 लाखांपर्यंत कर्ज + व्याज सवलत',
      department: 'उच्च शिक्षण विभाग व IBA',
    },
    kok: {
      title: 'विद्या लक्ष्मी उच्च शिक्षण कर्ज येवजण',
      short_description: 'कॉलेजीच्या शिक्षणा खातीर ₹20 लाखां मेरेन सोंपें कर्ज.',
      benefit_amount: '₹20 लाखां मेरेन कर्ज + व्याज सवलत',
      department: 'शिक्षण खातें',
    },
  },
  'srv-pmay-housing-loan': {
    hi: {
      title: 'प्रधानमंत्री आवास योजना (PMAY) होम लोन सब्सिडी',
      short_description: 'पहला घर खरीदने या बनाने पर बैंक होम लोन ब्याज पर ₹2.67 लाख तक की सीधी सरकारी छूट।',
      benefit_amount: '₹2,67,000 तक की सीधी ब्याज सब्सिडी',
      department: 'आवासन एवं शहरी गरीबी उपशमन मंत्रालय',
    },
    mr: {
      title: 'प्रधानमंत्री आवास योजना (PMAY) गृहकर्ज सबसिडी',
      short_description: 'पहिले घर खरेदी किंवा बांधकामासाठी होम लोनवर ₹2.67 लाखांपर्यंत थेट सबसिडी.',
      benefit_amount: '₹2,67,000 थेट व्याज सबसिडी',
      department: 'गृहनिर्माण व नागरी विकास मंत्रालय',
    },
    kok: {
      title: 'प्रधानमंत्री घरकुल होम लोन सबसिडी',
      short_description: 'घर बांदपा खातीर होम लोनाचेर ₹2.67 लाखां पर्यंत सबसिडी.',
      benefit_amount: '₹2,67,000 व्याज सबसिडी',
      department: 'घरकुल खातें',
    },
  },

  // 3. Education & Scholarships
  'srv-scholarship-postmatric': {
    hi: {
      title: 'कॉलेज छात्रवृत्ति (पोस्ट-मैट्रिक उच्च शिक्षा)',
      short_description: 'कॉलेज एवं डिप्लोमा छात्रों के लिए 100% ट्यूशन फीस प्रतिपूर्ति और ₹12,000 वार्षिक वजीफा।',
      benefit_amount: '100% ट्यूशन फीस + ₹12,000 वार्षिक भत्ता',
      department: 'उच्च शिक्षा निदेशालय एवं समाज कल्याण',
    },
    mr: {
      title: 'महाविद्यालयीन पोस्ट-मॅट्रिक शिष्यवृत्ती',
      short_description: 'पदवी व पदविका विद्यार्थ्यांसाठी 100% शिक्षण शुल्क माफी व ₹12,000 वार्षिक भत्ता.',
      benefit_amount: '100% शिक्षण शुल्क + ₹12,000 भत्ता',
      department: 'उच्च शिक्षण संचालनालय',
    },
    kok: {
      title: 'कॉलेज पोस्ट-मॅट्रिक स्कॉलरशिप',
      short_description: 'कॉलेजीच्या विद्यार्थ्यां खातीर 100% फी सवलत आनी भत्ता.',
      benefit_amount: '100% फी + ₹12,000 भत्ता',
      department: 'उच्च शिक्षण खातें',
    },
  },
  'srv-student-laptop': {
    hi: {
      title: 'मुफ्त छात्र लैपटॉप एवं डिजिटल उपकरण योजना',
      short_description: 'कॉलेज और तकनीकी छात्रों के लिए नया ब्रांडेड लैपटॉप या ₹25,000 की नकद सहायता।',
      benefit_amount: 'मुफ्त लैपटॉप या ₹25,000 नकद अनुदान',
      department: 'सूचना प्रौद्योगिकी एवं शिक्षा विभाग',
    },
    mr: {
      title: 'मोफत विद्यार्थी लॅपटॉप व डिजिटल साधन योजना',
      short_description: 'तांत्रिक व पदवी विद्यार्थ्यांसाठी मोफत लॅपटॉप किंवा ₹25,000 रोख अनुदान.',
      benefit_amount: 'मोफत लॅपटॉप किंवा ₹25,000 अनुदान',
      department: 'माहिती तंत्रज्ञान व शिक्षण विभाग',
    },
    kok: {
      title: 'मोफत विद्यार्थी लॅपटॉप येवजण',
      short_description: 'विद्यार्थ्यां खातीर मोफत लॅपटॉप वा ₹25,000 अनुदान.',
      benefit_amount: 'मोफत लॅपटॉप वा ₹25,000',
      department: 'आयटी आनी शिक्षण खातें',
    },
  },

  // 4. Certificates & Transport
  'srv-income-certificate': {
    hi: {
      title: 'वार्षिक आय प्रमाणपत्र (मामलतदार / तहसीलदार)',
      short_description: 'पारिवारिक वार्षिक आय का सरकारी प्रमाण पत्र। छात्रवृत्ति, लोन व सरकारी योजनाओं हेतु आवश्यक।',
      benefit_amount: 'सभी सरकारी योजनाओं एवं छात्रवृत्तियों हेतु मान्य',
      department: 'राजस्व एवं ज़िला प्रशासन',
    },
    mr: {
      title: 'वार्षिक उत्पन्न दाखला (तहसीलदार / मामलेदार)',
      short_description: 'कौटुंबिक उत्पन्नाचे अधिकृत प्रमाणपत्र. शिष्यवृत्ती व योजनांसाठी आवश्यक.',
      benefit_amount: 'सर्व शासकीय योजनांसाठी आवश्यक',
      department: 'महसूल व जिल्हा प्रशासन',
    },
    kok: {
      title: 'उत्पन्नाचो दाखलो (मामलेदार कचेरी)',
      short_description: 'सगळ्या सरकारी येवजण्यां खातीर लागपी अधिकृत उत्पन्नाचो दाखलो.',
      benefit_amount: 'सगळ्या येवजण्यां खातीर सक्तीचो',
      department: 'महसूल खातें',
    },
  },
  'srv-driving-licence': {
    hi: {
      title: 'ड्राइविंग लाइसेंस नवीनीकरण व सेवाएं',
      short_description: 'समाप्त हो रहे लाइसेंस का नवीनीकरण, पता परिवर्तन या नया स्मार्ट कार्ड घर मंगवाएं।',
      benefit_amount: 'पूरे भारत में 10-20 वर्षों के लिए वैध',
      department: 'परिवहन निदेशालय',
    },
    mr: {
      title: 'ड्रायव्हिंग लायसन्स नूतनीकरण व सेवा',
      short_description: 'मुदत संपलेल्या ड्रायव्हिंग लायसन्सचे नूतनीकरण आणि स्मार्ट कार्ड घरपोच.',
      benefit_amount: 'संपूर्ण भारतात 10-20 वर्षे वैध',
      department: 'वाहतूक संचालनालय',
    },
    kok: {
      title: 'ड्रायव्हिंग लायसन्स रिन्यूअल आनी सेवा',
      short_description: 'ड्रायव्हिंग लायसन्स वेळार रिन्यू करात आनी स्मार्ट कार्ड मेळयात.',
      benefit_amount: '१०-२० वर्सां खातीर वैध',
      department: 'येरादारी खातें',
    },
  },
  'srv-residence-cert': {
    hi: {
      title: 'निवास एवं अधिवास प्रमाणपत्र (15 वर्ष निवास)',
      short_description: 'राज्य में स्थायी निवास का आधिकारिक प्रमाण पत्र। सरकारी नौकरियों और कॉलेज कोटे हेतु मान्य।',
      benefit_amount: 'सरकारी नौकरियों व कॉलेज कोटे हेतु वैध',
      department: 'कलेक्टर कार्यालय एवं ज़िला प्रशासन',
    },
    mr: {
      title: 'अधिवास व रहिवासी दाखला (15 वर्षे वास्तव्य)',
      short_description: 'राज्यातील कायमस्वरूपी वास्तव्याचे प्रमाणपत्र. शासकीय नोकऱ्या व शैक्षणिक कोट्यासाठी आवश्यक.',
      benefit_amount: 'शासकीय नोकऱ्या व कोट्यासाठी वैध',
      department: 'जिल्हाधिकारी कार्यालय व महसूल',
    },
    kok: {
      title: 'रावपाचो दाखलो (१५ वर्सां वास्तव्य)',
      short_description: 'राज्यांत रावपाचो अधिकृत दाखलो. सरकारी नोकऱ्यां खातीर लागता.',
      benefit_amount: 'सरकारी नोकऱ्यां खातीर वैध',
      department: 'जिल्हाधिकारी कचेरी',
    },
  },
  'srv-solar-rooftop': {
    hi: {
      title: 'पीएम सूर्य घर: मुफ्त बिजली सोलर सब्सिडी',
      short_description: 'छत पर सोलर लगाने के लिए ₹78,000 तक की सीधी बैंक सब्सिडी और 300 यूनिट तक मुफ्त बिजली।',
      benefit_amount: '₹78,000 तक की सीधी सब्सिडी + मुफ्त बिजली',
      department: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय',
    },
    mr: {
      title: 'पीएम सूर्य घर: मोफत वीज सोलर सबसिडी',
      short_description: 'घराच्या छतावर सोलर बसवण्यासाठी ₹78,000 पर्यंत थेट सबसिडी आणि मोफत वीज.',
      benefit_amount: '₹78,000 थेट सबसिडी + मोफत वीज',
      department: 'नवीन व नवीकरणीय ऊर्जा मंत्रालय',
    },
    kok: {
      title: 'पीएम सूर्य घर: मोफत सोलर सबसिडी',
      short_description: 'घराच्या पाख्यार सोलर बसोवपा खातीर ₹78,000 पर्यंत थेट सबसिडी.',
      benefit_amount: '₹78,000 थेट सबसिडी',
      department: 'ऊर्जा खातें',
    },
  },
};

export function localizeService(service: any, lang: any = 'en') {
  if (!service) return service;
  const code = (typeof lang === 'string' ? lang.toLowerCase() : 'en') as 'en' | 'hi' | 'mr' | 'kok';
  if (code === 'en') return service;

  const translation = SCHEME_TRANSLATIONS[service.service_id]?.[code];
  if (!translation) return service;

  return {
    ...service,
    title: translation.title || service.title,
    short_description: translation.short_description || service.short_description,
    benefit_amount: translation.benefit_amount || service.benefit_amount,
    department: translation.department || service.department,
  };
}

export function localizeApplication(app: any, lang: any = 'en') {
  if (!app) return app;
  const code = (typeof lang === 'string' ? lang.toLowerCase() : 'en') as 'en' | 'hi' | 'mr' | 'kok';
  if (code === 'en') return app;

  const translation = SCHEME_TRANSLATIONS[app.service_id]?.[code];
  return {
    ...app,
    service_name: translation?.title || app.service_name,
    department: translation?.department || app.department,
  };
}

export function useTranslation(lang: any = 'en') {
  const code = (typeof lang === 'string' ? lang.toLowerCase() : 'en') as 'en' | 'hi' | 'mr' | 'kok';
  const t = TRANSLATIONS[code] || TRANSLATIONS.en;
  return { t, lang: code };
}
