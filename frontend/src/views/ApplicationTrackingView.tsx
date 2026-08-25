import React from 'react';
import {
  ArrowLeft,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  FolderLock,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Application, DocumentItem, LanguageCode } from '../types';
import { useTranslation, localizeApplication } from '../translations';
import StatusBadge from '../components/StatusBadge';
import ProgressTimeline from '../components/ProgressTimeline';

export type ApplicationTrackingViewProps = {
  application: Application;
  documents: DocumentItem[];
  currentLanguage?: LanguageCode;
  onBack: () => void;
  onOpenAssistant: (prompt: string) => void;
};

export const ApplicationTrackingView: React.FC<ApplicationTrackingViewProps> = ({
  application,
  documents,
  currentLanguage = 'en',
  onBack,
  onOpenAssistant,
}) => {
  const { t } = useTranslation(currentLanguage);
  const localizedApp = localizeApplication(application, currentLanguage);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{currentLanguage === 'hi' ? '← वापस आवेदनों पर जाएं' : currentLanguage === 'mr' ? '← अर्जांवर परत जा' : currentLanguage === 'kok' ? '← अर्जांचेर परत वचात' : 'Back to Applications'}</span>
      </button>

      {/* Header Docket Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              {t.tracking.referenceNumber} {application.application_id}
            </span>
            <StatusBadge status={application.status} />
          </div>

          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {currentLanguage === 'hi' ? 'अंतिम अपडेट:' : currentLanguage === 'mr' ? 'शेवटचा अपडेट:' : currentLanguage === 'kok' ? 'निमाणो अपडेट:' : 'Last updated:'} {application.last_updated}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {localizedApp.service_name}
        </h1>

        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentLanguage === 'hi' ? 'संबंधित विभाग:' : currentLanguage === 'mr' ? 'संबंधित विभाग:' : 'Administering Department:'} <strong>{localizedApp.department}</strong></span>
          {application.submitted_date && (
            <span>• Submitted on: <strong>{application.submitted_date}</strong></span>
          )}
        </div>

        {/* Current State Summary Pill */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
            Current Application Status in Plain English:
          </span>
          <p className="text-sm font-semibold text-indigo-950">
            {application.current_step_name}
          </p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {application.next_action}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Progress Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">
              Live Progress Journey
            </h3>
            <span className="text-xs text-indigo-600 font-semibold">
              Step {application.progress_step} of {application.total_steps}
            </span>
          </div>

          <ProgressTimeline timeline={application.timeline} />
        </div>

        {/* Right Column: Attached Evidence & Help */}
        <div className="lg:col-span-5 space-y-6">
          {/* Linked Documents Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Verified Documents in File
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Verified
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {application.attached_documents.map((docId) => {
                const doc = documents.find((d) => d.document_id === docId);
                return (
                  <div
                    key={docId}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">
                        {doc ? doc.document_name : docId}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      AES-256
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Assistance card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-white">
                Need Help with this Application?
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask GovConnect AI about expected committee hearing dates, scholarship disbursement schedules, or how to upload amendments.
            </p>
            <button
              onClick={() =>
                onOpenAssistant(
                  `Tell me the status and expected timeline for my application ${application.application_id}`
                )
              }
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Ask AI About This Case</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackingView;
