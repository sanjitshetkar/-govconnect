import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { GovernmentService, LanguageCode } from '../types';
import { useTranslation, localizeService } from '../translations';

export type RecommendationCardProps = {
  service: GovernmentService;
  currentLanguage?: LanguageCode;
  onApply: (service: GovernmentService) => void;
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  service,
  currentLanguage = 'en',
  onApply,
}) => {
  const { t } = useTranslation(currentLanguage);
  const localized = localizeService(service, currentLanguage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all group">
      <div>
        {/* Header: Match Score + Prep Time */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            {localized.match_score || 95}% {currentLanguage === 'hi' ? 'सटीक मिलान' : currentLanguage === 'mr' ? 'अचूक जुळणी' : currentLanguage === 'kok' ? 'खात्रीशीर' : 'Match for you'}
          </span>
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            {localized.estimated_prep_time}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {localized.title}
        </h3>

        {/* Reason pill */}
        {localized.match_reasons && localized.match_reasons.length > 0 && (
          <p className="text-xs text-indigo-700 font-medium mt-1.5 flex items-start gap-1">
            <span className="text-indigo-500 font-bold">•</span>
            <span>{localized.match_reasons[0]}</span>
          </p>
        )}

        {/* Short Description */}
        <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
          {localized.short_description}
        </p>

        {/* Benefit Box */}
        {localized.benefit_amount && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t.services.benefit}
            </span>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              {localized.benefit_amount}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => onApply(service)}
        className="mt-4 w-full py-2.5 px-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
      >
        <span>{t.dashboard.checkEligibility}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default RecommendationCard;
