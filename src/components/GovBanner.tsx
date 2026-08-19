import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const GovBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <section
      aria-label="Official Government of India Website"
      className="bg-[#f1f5f9] border-b border-slate-200 text-xs text-slate-700 no-print font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          
          {/* Left: Indian Tricolour Flag & Official Declaration */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-base" role="img" aria-label="Flag of India">
              🇮🇳
            </span>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-slate-900">
                {t.banner.govOfIndia}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-600 hidden sm:inline">
                {t.banner.portalName}
              </span>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="text-[#135ca2] hover:text-[#0b3c6d] hover:underline font-semibold inline-flex items-center gap-1 ml-1.5 focus:outline-none cursor-pointer"
                aria-expanded={isDetailsOpen}
              >
                <span>{t.banner.howYouKnow}</span>
                {isDetailsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#135ca2]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#135ca2]" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Digital India & Help */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.banner.digitalIndia}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="font-mono text-slate-500 text-[11px] hidden sm:inline">
              {t.banner.nicHosted}
            </span>
          </div>

        </div>

        {/* Expandable Explanation Panel for Indian Government Websites */}
        {isDetailsOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200 pb-2 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-in fade-in duration-150">
            <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-slate-200">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-base">
                🏛️
              </div>
              <div className="space-y-1">
                <strong className="font-bold text-slate-900 block text-sm">
                  {t.banner.govDomainTitle}
                </strong>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {t.banner.govDomainDesc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-slate-200">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <strong className="font-bold text-slate-900 block text-sm">
                  {t.banner.httpsTitle}
                </strong>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {t.banner.httpsDesc}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
