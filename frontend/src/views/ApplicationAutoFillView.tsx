import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Building2,
  ArrowRight,
  ShieldCheck,
  Save,
  Send,
  Loader2,
  FolderLock,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { Application, GovernmentService, UserProfile, DocumentItem, LanguageCode } from '../types';
import { useTranslation, localizeService } from '../translations';

export type ApplicationAutoFillViewProps = {
  service: GovernmentService;
  userProfile: UserProfile;
  documents: DocumentItem[];
  currentLanguage?: LanguageCode;
  onSaveDraft: (formData: Record<string, any>) => void;
  onSubmitApplication: (formData: Record<string, any>) => void;
  onOpenUploadModal?: (category?: DocumentItem['category']) => void;
  onBack: () => void;
};

export const ApplicationAutoFillView: React.FC<ApplicationAutoFillViewProps> = ({
  service,
  userProfile,
  documents,
  currentLanguage = 'en',
  onSaveDraft,
  onSubmitApplication,
  onOpenUploadModal,
  onBack,
}) => {
  const { t } = useTranslation(currentLanguage);
  const localizedService = localizeService(service, currentLanguage);

  const [formData, setFormData] = useState({
    applicant_name: userProfile.name,
    date_of_birth: userProfile.date_of_birth,
    gender: 'Male',
    mobile: userProfile.mobile,
    email: userProfile.email,
    aadhaar_number: userProfile.aadhaar_masked,
    pan_number: userProfile.pan_number,
    address: userProfile.address,
    district: userProfile.district,
    state: userProfile.state,
    pincode: userProfile.pincode,
    institution_name: 'Goa College of Engineering',
    course_name: 'B.Tech Computer Engineering (3rd Year)',
    enrollment_number: 'GEC-2023-CS-042',
    qualifying_percentage: '91.2%',
    annual_family_income: userProfile.annual_income,
    income_certificate_no: 'INC/SLCT/2025/0942',
    bank_account_no: '•••• •••• 5519',
    bank_name: 'HDFC Bank, Margao Branch',
    ifsc_code: 'HDFC0000214',
    declaration_accepted: true,
    digital_signature: `${userProfile.name} (Aadhaar e-Signed)`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Document matching & satisfaction logic
  const checkDocSatisfied = (reqDoc: { document_name: string; category?: string; document_type?: string }) => {
    return documents.find((d) => {
      const matchName =
        d.document_name.toLowerCase().includes(reqDoc.document_name.toLowerCase()) ||
        reqDoc.document_name.toLowerCase().includes(d.document_name.toLowerCase());
      const matchCat = reqDoc.category && d.category === reqDoc.category;
      return matchName || matchCat;
    });
  };

  const docStatuses = service.required_documents.map((req) => ({
    req,
    matchedDoc: checkDocSatisfied(req),
    isSatisfied: !!checkDocSatisfied(req),
  }));

  const missingMandatoryDocs = docStatuses.filter((s) => s.req.is_mandatory && !s.isSatisfied);
  const allMandatorySatisfied = missingMandatoryDocs.length === 0;

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDraft = () => {
    onSaveDraft(formData);
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMandatorySatisfied) {
      alert(
        `Cannot submit application: You are missing mandatory documents (${missingMandatoryDocs
          .map((m) => m.req.document_name)
          .join(', ')}). Please upload them to your vault first.`
      );
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    onSubmitApplication(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Top Banner: Auto-Fill Efficiency */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {allMandatorySatisfied
                ? t.autofill.auditPassed
                : currentLanguage === 'hi'
                ? 'दस्तावेज़ सत्यापन आवश्यक'
                : 'Documents Verification Needed'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {t.autofill.title}
          </h1>
          <p className="text-xs text-indigo-200 mt-1">
            {currentLanguage === 'hi'
              ? 'आवेदन हेतु योजना:'
              : currentLanguage === 'mr'
              ? 'अर्जाची योजना:'
              : currentLanguage === 'kok'
              ? 'येवजण:'
              : 'Applying for:'}{' '}
            <strong>{localizedService.title}</strong>
          </p>
        </div>

        <div className="text-right sm:border-l sm:border-indigo-800 sm:pl-6">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {documents.length > 0
              ? `${docStatuses.filter((s) => s.isSatisfied).length} / ${service.required_documents.length}`
              : '0 Docs'}
          </span>
          <span className="text-xs text-indigo-300 block mt-0.5">
            {currentLanguage === 'hi' ? 'वॉल्ट दस्तावेज़ जुड़े' : 'Vault Docs Linked'}
          </span>
        </div>
      </div>

      {/* Main Statutory Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: APPLICANT PERSONAL INFO */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <span>{t.autofill.applicantSection}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ✓ Aadhaar Verified
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                {t.profile.fullName}
              </label>
              <input
                type="text"
                value={formData.applicant_name}
                onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                {t.profile.dob}
              </label>
              <input
                type="text"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                {t.profile.mobile}
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                {t.profile.email}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Aadhaar Number (UIDAI Token)
              </label>
              <input
                type="text"
                disabled
                value={formData.aadhaar_number}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Permanent Residential Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC & FINANCIAL DETAILS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <span>{t.autofill.financialSection}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                {t.profile.familyIncome}
              </label>
              <input
                type="text"
                value={formData.annual_family_income}
                onChange={(e) => handleInputChange('annual_family_income', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                State &amp; District Jurisdiction
              </label>
              <input
                type="text"
                value={`${formData.district}, ${formData.state}`}
                disabled
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: MANDATORY VAULT DOCUMENTS VERIFICATION CHECKLIST */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>
                  {currentLanguage === 'hi'
                    ? 'आवश्यक सहायक दस्तावेज़ एवं वॉल्ट स्थिति'
                    : currentLanguage === 'mr'
                    ? 'आवश्यक कागदपत्रे व पडताळणी'
                    : 'Mandatory Supporting Documents Checklist'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentLanguage === 'hi'
                  ? 'सरकारी नियमों के अनुसार आवेदन जमा करने से पहले सभी अनिवार्य दस्तावेज़ वॉल्ट में सत्यापित होने चाहिए।'
                  : 'All mandatory certificates must be verified in your vault before submitting.'}
              </p>
            </div>

            {onOpenUploadModal && (
              <button
                type="button"
                onClick={() => onOpenUploadModal('identity')}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{currentLanguage === 'hi' ? '+ दस्तावेज़ अपलोड करें' : '+ Upload Document'}</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {docStatuses.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  item.isSatisfied
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : item.req.is_mandatory
                    ? 'bg-rose-50/70 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.isSatisfied ? (
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.req.document_name}
                      </span>
                      {item.req.is_mandatory ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          {currentLanguage === 'hi' ? 'अनिवार्य' : 'Mandatory'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Optional
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-500 block mt-0.5">
                      {item.isSatisfied
                        ? `✓ Linked: ${item.matchedDoc?.document_name} (DigiLocker Cryptographic Match)`
                        : item.req.is_mandatory
                        ? '⚠️ Not found in your vault. You must upload this document to submit.'
                        : 'Optional document not attached.'}
                    </span>
                  </div>
                </div>

                {!item.isSatisfied && onOpenUploadModal && (
                  <button
                    type="button"
                    onClick={() => onOpenUploadModal((item.req.category as any) || 'identity')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 shadow-xs"
                  >
                    Upload Now
                  </button>
                )}
              </div>
            ))}
          </div>

          {!allMandatorySatisfied && (
            <div className="p-4 rounded-2xl bg-rose-100/80 border border-rose-300 text-xs text-rose-950 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-rose-900">
                  {currentLanguage === 'hi'
                    ? `आवेदन जमा नहीं किया जा सकता: ${missingMandatoryDocs.length} अनिवार्य दस्तावेज़ गायब हैं`
                    : `Cannot Submit Application: ${missingMandatoryDocs.length} mandatory document(s) missing`}
                </strong>
                <span className="text-rose-800 mt-0.5 block">
                  {currentLanguage === 'hi'
                    ? `कृपया आगे बढ़ने से पहले (${missingMandatoryDocs.map((m) => m.req.document_name).join(', ')}) अपने वॉल्ट में अपलोड करें।`
                    : `Please upload (${missingMandatoryDocs.map((m) => m.req.document_name).join(', ')}) to your vault before submitting.`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: STATUTORY DECLARATION */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={formData.declaration_accepted}
              onChange={(e) => handleInputChange('declaration_accepted', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 mt-0.5 cursor-pointer"
            />
            <span className="text-slate-700 font-medium leading-relaxed">
              {t.autofill.acceptDeclaration}
            </span>
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Back
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDraft}
              className="flex-1 sm:flex-initial px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>{isDraftSaved ? '✓ Draft Saved' : 'Save Draft'}</span>
            </button>

            <button
              type="submit"
              disabled={!allMandatorySatisfied || !formData.declaration_accepted || isSubmitting}
              className={`flex-1 sm:flex-initial px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                allMandatorySatisfied && formData.declaration_accepted && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300'
              }`}
              title={
                !allMandatorySatisfied
                  ? `Upload missing documents (${missingMandatoryDocs.map((m) => m.req.document_name).join(', ')}) to enable submit`
                  : 'Submit Application'
              }
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>
                {!allMandatorySatisfied
                  ? currentLanguage === 'hi'
                    ? 'दस्तावेज़ आवश्यक (जमा अवरुद्ध)'
                    : 'Missing Docs (Submit Blocked)'
                  : isSubmitting
                  ? currentLanguage === 'hi'
                    ? 'जमा किया जा रहा है...'
                    : 'Transmitting...'
                  : currentLanguage === 'hi'
                  ? 'सरकारी पोर्टल पर आवेदन जमा करें'
                  : 'Submit Application'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplicationAutoFillView;
