import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Clock,
  Sparkles,
  ShieldCheck,
  FolderLock,
  FileCheck,
} from 'lucide-react';
import { GovernmentService, DocumentItem, UserProfile, LanguageCode } from '../types';
import { useTranslation, localizeService } from '../translations';

export type ServiceDetailViewProps = {
  service: GovernmentService;
  documents: DocumentItem[];
  userProfile: UserProfile;
  currentLanguage?: LanguageCode;
  onBack: () => void;
  onContinueToAutoFill: (service: GovernmentService) => void;
  onOpenUploadModal: () => void;
};

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  service,
  documents,
  userProfile,
  currentLanguage = 'en',
  onBack,
  onContinueToAutoFill,
  onOpenUploadModal,
}) => {
  const { t } = useTranslation(currentLanguage);
  const localized = localizeService(service, currentLanguage);

  const [criteriaState, setCriteriaState] = useState<Record<string, boolean>>(
    service.eligibility_criteria.reduce((acc, c) => {
      acc[c.criterion_id] = c.is_satisfied;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleCriterion = (id: string) => {
    setCriteriaState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allEligible = Object.values(criteriaState).every(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{currentLanguage === 'hi' ? '← सभी योजनाएं' : currentLanguage === 'mr' ? '← सर्व योजना' : currentLanguage === 'kok' ? '← सगळ्यो येवजण्यो' : 'Back to Services'}</span>
      </button>

      {/* Service Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {localized.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {localized.department}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {localized.title}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          {localized.short_description || service.full_description}
        </p>

        {localized.benefit_amount && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                {t.services.benefit}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-950 font-mono">
                {localized.benefit_amount}
              </span>
            </div>
            <div className="text-right text-xs text-emerald-700 font-medium">
              <span>Estimated Filing Time:</span>
              <strong className="block font-bold">{service.estimated_prep_time}</strong>
            </div>
          </div>
        )}
      </div>

      {/* STEP 1: ELIGIBILITY CHECKLIST */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Step 1 of 3
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Check Your Eligibility
            </h2>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              allEligible
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {allEligible ? '✓ You Appear Eligible' : 'Action Required'}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          GovConnect has pre-screened these criteria using your verified profile. You can check/uncheck to verify.
        </p>

        {/* Criteria Cards */}
        <div className="space-y-3">
          {service.eligibility_criteria.map((crit) => {
            const isChecked = !!criteriaState[crit.criterion_id];

            return (
              <div
                key={crit.criterion_id}
                onClick={() => toggleCriterion(crit.criterion_id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="space-y-0.5 flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {crit.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {crit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 2: REQUIRED DOCUMENTS READINESS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Step 2 of 3
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Required Supporting Documents
            </h2>
          </div>
          <button
            onClick={() => onOpenUploadModal()}
            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>+ {currentLanguage === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {service.required_documents.map((doc, idx) => {
            const matchedDoc = documents.find(
              (d) =>
                d.document_name.toLowerCase().includes(doc.document_name.toLowerCase()) ||
                doc.document_name.toLowerCase().includes(d.document_name.toLowerCase()) ||
                (doc.category && d.category === doc.category)
            );
            const hasDocument = !!matchedDoc;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  hasDocument
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : doc.is_mandatory
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {hasDocument ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {doc.document_name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {doc.is_mandatory ? (currentLanguage === 'hi' ? 'अनिवार्य' : 'Mandatory') : 'Optional'}
                      {hasDocument && ` • Linked: ${matchedDoc.document_name}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                      hasDocument
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {hasDocument ? '✓ Ready in Vault' : 'Needs Upload'}
                  </span>

                  {!hasDocument && (
                    <button
                      onClick={() => onOpenUploadModal()}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 3 / BOTTOM ACTION CTA */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
            Step 3 of 3: Instant 1-Click Form Pre-fill
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Ready to apply for {service.title}?
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            GovConnect will map all required fields from your verified vault in 5 seconds.
          </p>
        </div>

        <button
          onClick={() => onContinueToAutoFill(service)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto-Fill Application Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ServiceDetailView;
