import React, { useState } from 'react';
import {
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  Landmark,
  FileCheck,
  Send,
  Loader2,
  CheckCheck,
} from 'lucide-react';
import {
  ApplicationRecord,
  UploadedDocument,
  UserProfile,
  ApplicationFormData,
  AuditReport,
} from '../types';
import { autoFillApplicationForm, runApplicationAudit } from '../services/api';
import { useLanguage } from '../LanguageContext';

interface AutoFillPreviewProps {
  activeApplication: ApplicationRecord | null;
  setActiveApplication: (app: ApplicationRecord) => void;
  applications: ApplicationRecord[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationRecord[]>>;
  documents: UploadedDocument[];
  userProfile: UserProfile;
}

export const AutoFillPreview: React.FC<AutoFillPreviewProps> = ({
  activeApplication,
  setActiveApplication,
  applications,
  setApplications,
  documents,
  userProfile,
}) => {
  const { language, t } = useLanguage();
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  if (!activeApplication) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center font-sans">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">
          {language === 'HI' ? 'कोई सक्रिय योजना आवेदन चयनित नहीं है' : 'No Active Scheme Application Selected'}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
          {language === 'HI'
            ? 'वैधानिक डोजियर देखने और प्रिंट करने के लिए कृपया डैशबोर्ड से एक योजना आवेदन चुनें।'
            : 'Please select a scheme application from the Dashboard or create a new filing to preview and print statutory dossiers.'}
        </p>
      </div>
    );
  }

  const formData = activeApplication.formData;

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    const updatedFormData = { ...formData, [field]: value };
    const updatedApp: ApplicationRecord = {
      ...activeApplication,
      formData: updatedFormData,
      lastUpdated: language === 'HI' ? 'अभी-अभी (संपादित)' : 'Just now (Edited)',
    };

    setActiveApplication(updatedApp);
    setApplications((prev) =>
      prev.map((app) => (app.id === activeApplication.id ? updatedApp : app))
    );
  };

  const handleTriggerAutofill = async () => {
    setIsAutoFilling(true);
    setNotificationMsg(null);

    try {
      const result = await autoFillApplicationForm({
        templateId: activeApplication.formTemplateId,
        applicationTitle: activeApplication.title,
        currentFormData: activeApplication.formData,
        documents,
        userProfile,
      });

      const updatedApp: ApplicationRecord = {
        ...activeApplication,
        formData: result.formData,
        progressPercentage: result.completenessPercentage,
        lastUpdated:
          language === 'HI'
            ? 'अभी-अभी (डिजिलॉकर से स्वतः भरा गया)'
            : 'Just now (Auto-filled from DigiLocker)',
      };

      setActiveApplication(updatedApp);
      setApplications((prev) =>
        prev.map((app) => (app.id === activeApplication.id ? updatedApp : app))
      );

      setNotificationMsg(result.autofillSummary);
    } catch (err) {
      console.error('Autofill error:', err);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const auditResult = await runApplicationAudit({
        applicationTitle: activeApplication.title,
        formData: activeApplication.formData,
        documents,
      });

      const updatedApp: ApplicationRecord = {
        ...activeApplication,
        auditReport: auditResult,
      };

      setActiveApplication(updatedApp);
      setApplications((prev) =>
        prev.map((app) => (app.id === activeApplication.id ? updatedApp : app))
      );
    } catch (err) {
      console.error('Audit run error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedApp: ApplicationRecord = {
      ...activeApplication,
      status: 'In Review',
      submissionDate:
        new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ', ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' IST',
      lastUpdated:
        language === 'HI'
          ? 'अभी-अभी (मंत्रालय संवीक्षा समिति को प्रेषित)'
          : 'Just now (Transmitted to Ministry Scrutiny Committee)',
      progressPercentage: 95,
      timeline: [
        ...activeApplication.timeline,
        {
          title: language === 'HI' ? 'मंत्रालय संवीक्षा समिति को प्रेषित' : 'Transmitted to Ministry Scrutiny Committee',
          timestamp:
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
          description:
            language === 'HI'
              ? 'आधार ई-हस्ताक्षरित डोजियर और डिजिलॉकर साक्ष्य जमा किए गए।'
              : 'Aadhaar e-Signed dossier and DigiLocker evidence submitted.',
          status: 'completed',
        },
      ],
    };

    setActiveApplication(updatedApp);
    setApplications((prev) =>
      prev.map((app) => (app.id === activeApplication.id ? updatedApp : app))
    );

    setIsSubmitting(false);
    setSubmissionSuccess(true);
  };

  const displayTitle =
    language === 'HI' && activeApplication.titleHindi
      ? activeApplication.titleHindi
      : activeApplication.title;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans">
      
      {/* Top Toolbar (Hidden on Print) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-8 shadow-xs no-print flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-bold bg-[#f0f7ff] text-[#135ca2] px-2.5 py-1 rounded-md border border-slate-300">
              {activeApplication.applicationNumber}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-800">
              {displayTitle}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'HI' ? 'मंत्रालय:' : 'Ministry:'}{' '}
            <span className="text-slate-700">{activeApplication.ministryName}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* DigiLocker Auto-fill Button */}
          <button
            onClick={handleTriggerAutofill}
            disabled={isAutoFilling}
            className="px-3.5 py-2 bg-[#135ca2] hover:bg-[#0b3c6d] disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isAutoFilling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-sky-200" />
            )}
            <span>{isAutoFilling ? (language === 'HI' ? 'निकाला जा रहा है...' : 'Extracting...') : t.autofill.autoFillDigiLocker}</span>
          </button>

          {/* Compliance Audit Button */}
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{isAuditing ? (language === 'HI' ? 'जांच जारी...' : 'Auditing...') : t.autofill.runAudit}</span>
          </button>

          {/* Official Print Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#0c2340] hover:bg-[#061528] text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.autofill.printDossier}</span>
          </button>

        </div>

      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 sm:p-5 rounded-r-xl mb-8 text-xs sm:text-sm text-emerald-900 flex items-center justify-between no-print shadow-xs gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="font-medium">{notificationMsg}</span>
          </div>
          <button
            onClick={() => setNotificationMsg(null)}
            className="text-emerald-700 font-bold hover:underline shrink-0"
          >
            {language === 'HI' ? 'खारिज करें' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Pre-submission Audit Card (No-print) */}
      {activeApplication.auditReport && (
        <div className="bg-white border-2 border-emerald-300 rounded-xl p-6 sm:p-7 mb-8 shadow-xs no-print">
          <div className="flex items-start justify-between pb-4 mb-4 border-b border-emerald-100 gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
              <h4 className="text-base font-bold text-emerald-950">
                {t.autofill.statutoryComplianceAudit}: {activeApplication.auditReport.verdict}
              </h4>
            </div>
            <span className="font-mono text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-md">
              {t.autofill.score}: {activeApplication.auditReport.readinessScore}/100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                {t.autofill.passedChecks}:
              </span>
              <ul className="space-y-1.5 text-slate-700">
                {activeApplication.auditReport.passedChecks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                {t.autofill.recommendations}:
              </span>
              <ul className="space-y-1.5 text-slate-600">
                {activeApplication.auditReport.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#135ca2] font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          THE OFFICIAL GOVERNMENT OF INDIA STATUTORY APPLICATION FORM (PRINT-READY)
         ========================================================================= */}
      <div className="bg-white border-2 border-slate-400 rounded-xl p-8 sm:p-14 shadow-md print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto text-slate-900 font-serif">
        
        {/* Official State Emblem of India Header */}
        <div className="text-center pb-8 border-b-2 border-slate-800 space-y-1.5">
          <div className="flex justify-center mb-2 text-4xl leading-none">
            🏛️
          </div>
          <span className="text-xs font-bold tracking-widest text-slate-800 uppercase block font-sans">
            {t.autofill.satyamevaJayate}
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-slate-950 uppercase">
            {t.autofill.govOfIndiaFormHeader}
          </h2>
          <h3 className="text-base font-semibold text-slate-800">
            {activeApplication.ministryName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 italic font-sans">
            {activeApplication.departmentName}
          </p>

          <div className="pt-3 flex items-center justify-between text-xs font-mono text-slate-600 border-t border-slate-300 mt-4 font-sans flex-wrap gap-2">
            <span>{t.autofill.schemeCodeLabel}: <strong>{activeApplication.schemeCode}</strong></span>
            <span>{t.autofill.docketNoLabel}: <strong>{activeApplication.applicationNumber}</strong></span>
            <span>{t.autofill.digiLockerVerified}: <strong>{t.autofill.yesSec65b}</strong></span>
          </div>
        </div>

        {/* Title of Statutory Scheme Form */}
        <div className="my-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded border border-slate-300 inline-block font-sans">
            {t.autofill.officialDossierHeader}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-950 mt-3 leading-snug">
            {displayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-sans italic">
            {t.autofill.nationalGuidelinesNote}
          </p>
        </div>

        {/* Form Body Fields */}
        <div className="space-y-8 text-xs sm:text-sm font-sans">
          
          {/* Section 1: Applicant Identity & Domicile */}
          <div className="border border-slate-300 rounded-xl p-5 sm:p-6 bg-white">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 mb-4 flex items-center justify-between">
              <span>{t.autofill.section1Title}</span>
              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                {t.autofill.aadhaarL3Verified}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field1_1}
                </label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field1_2}
                </label>
                <input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field1_3}
                </label>
                <input
                  type="text"
                  value={formData.aadhaarOrPan}
                  onChange={(e) => handleInputChange('aadhaarOrPan', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field1_4}
                </label>
                <input
                  type="text"
                  value={`${formData.email} • ${formData.phone}`}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field1_5}
                </label>
                <input
                  type="text"
                  value={formData.primaryAddress}
                  onChange={(e) => handleInputChange('primaryAddress', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field1_6}
                </label>
                <input
                  type="text"
                  value={`${formData.cityOrDistrict}, ${formData.stateOrUT} - ${formData.pincode}`}
                  onChange={(e) => handleInputChange('cityOrDistrict', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field1_7}
                </label>
                <input
                  type="text"
                  value={formData.citizenshipOrDomicile}
                  onChange={(e) => handleInputChange('citizenshipOrDomicile', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Enterprise & Scheme Specifics */}
          <div className="border border-slate-300 rounded-xl p-5 sm:p-6 bg-white">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 mb-4 flex items-center justify-between">
              <span>{t.autofill.section2Title}</span>
              <span className="text-[11px] font-mono text-[#135ca2] font-bold bg-sky-50 px-2.5 py-0.5 rounded border border-sky-300">
                {t.autofill.itrvCertified}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field2_1}
                </label>
                <input
                  type="text"
                  value={formData.employerOrBusiness}
                  onChange={(e) => handleInputChange('employerOrBusiness', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field2_2}
                </label>
                <input
                  type="text"
                  value={formData.annualGrossIncome}
                  onChange={(e) => handleInputChange('annualGrossIncome', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-emerald-900 font-bold font-mono bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field2_3}
                </label>
                <input
                  type="text"
                  value={formData.schemeOrCategory}
                  onChange={(e) => handleInputChange('schemeOrCategory', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field2_4}
                </label>
                <input
                  type="text"
                  value={formData.requestedGrantOrSubsidy}
                  onChange={(e) => handleInputChange('requestedGrantOrSubsidy', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#135ca2] font-mono font-bold bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field2_5}
                </label>
                <textarea
                  rows={4}
                  value={formData.purposeStatement}
                  onChange={(e) => handleInputChange('purposeStatement', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Direct Benefit Transfer (DBT) Bank Account */}
          <div className="border border-slate-300 rounded-xl p-5 sm:p-6 bg-white">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 mb-4 flex items-center justify-between">
              <span>{t.autofill.section3Title}</span>
              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                {t.autofill.npciSeeded}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field3_1}
                </label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field3_2}
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">
                  {t.autofill.field3_3}
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: DigiLocker Evidentiary Records Attached */}
          <div className="border border-slate-300 rounded-xl p-5 sm:p-6 bg-white">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 mb-3">
              {t.autofill.section4Title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{doc.docType}</span>
                    <span className="text-[11px] text-slate-500 font-mono truncate block mt-0.5">
                      SHA-256: {doc.sha256Hash.substring(0, 16)}...
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                    {t.autofill.rule9AValidated}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Statutory Declaration & Aadhaar e-Sign */}
          <div className="border-2 border-slate-800 rounded-xl p-6 sm:p-7 bg-slate-50">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
              {t.autofill.section5Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
              "{t.autofill.declarationText}"
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-slate-300">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="declaration-checkbox"
                  checked={formData.declarationAccepted}
                  onChange={(e) => handleInputChange('declarationAccepted', e.target.checked)}
                  className="w-5 h-5 text-[#135ca2] rounded border-slate-400 focus:ring-[#135ca2] cursor-pointer"
                />
                <label htmlFor="declaration-checkbox" className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer">
                  {t.autofill.declarationCheckbox}
                </label>
              </div>

              {/* Aadhaar e-Signature Stamp Box */}
              <div className="p-4 bg-white border-2 border-emerald-700 rounded-xl text-center shrink-0 min-w-[220px] shadow-xs">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block font-sans">
                  {t.autofill.aadhaarESignVerified}
                </span>
                <span className="font-serif font-bold text-slate-900 text-sm block my-1">
                  {formData.digitalSignature || userProfile.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">
                  {language === 'HI' ? 'दिनांक:' : 'Date:'} {formData.dateSigned} • MeriPehchaan
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Final Government Footer on Print Form */}
        <div className="mt-10 pt-5 border-t border-slate-300 text-center text-xs text-slate-500 font-sans">
          <span>{t.autofill.printFooter}</span>
        </div>

      </div>

      {/* Submission Action Bar (No Print) */}
      <div className="max-w-4xl mx-auto mt-8 bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs no-print flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <span className="text-sm font-bold text-[#0c2340] block">
            {t.autofill.readyToTransmit}
          </span>
          <span className="text-xs text-slate-500 mt-0.5 block">
            {t.autofill.readyToTransmitSub}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {submissionSuccess ? (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t.autofill.dossierTransmittedSuccess}</span>
            </div>
          ) : (
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting || !formData.declarationAccepted}
              className="px-6 py-3 bg-[#135ca2] hover:bg-[#0b3c6d] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSubmitting ? (language === 'HI' ? 'मंत्रालय को प्रेषित किया जा रहा है...' : 'Transmitting to Ministry...') : t.autofill.submitApplication}</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
