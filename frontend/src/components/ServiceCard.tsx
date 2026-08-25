import React from 'react';
import { ArrowRight, Clock, FileCheck, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { GovernmentService, LanguageCode } from '../types';
import { useTranslation, localizeService } from '../translations';

export type ServiceCardProps = {
  service: GovernmentService;
  currentLanguage?: LanguageCode;
  onSelect: (service: GovernmentService) => void;
  showMatchScore?: boolean;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  currentLanguage = 'en',
  onSelect,
  showMatchScore = true,
}) => {
  const { t } = useTranslation(currentLanguage);
  const localized = localizeService(service, currentLanguage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all group">
      <div>
        {/* Top Badges: Category + Prep Time + Match Score */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {localized.category}
          </span>

          <div className="flex items-center gap-2">
            {showMatchScore && localized.match_score && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {localized.match_score}% Match
              </span>
            )}
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              {localized.estimated_prep_time}
            </span>
          </div>
        </div>

        {/* Service Title */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {localized.title}
        </h3>

        {/* Department Name */}
        <span className="text-xs text-slate-400 block mt-1">
          {localized.department}
        </span>

        {/* Short Description */}
        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
          {localized.short_description}
        </p>

        {/* Benefit & Requirements Snippet */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          {localized.benefit_amount && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {t.services.benefit}
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {localized.benefit_amount}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              {localized.required_documents.length} {currentLanguage === 'hi' ? 'दस्तावेज़ आवश्यक' : currentLanguage === 'mr' ? 'कागदपत्रे आवश्यक' : currentLanguage === 'kok' ? 'कागदपत्रां लागतात' : 'documents needed'}
            </span>
            {localized.deadline && (
              <span className="text-slate-500 font-medium">
                {localized.deadline}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(service)}
        className="mt-5 w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        <span>{t.dashboard.checkEligibility}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ServiceCard;
