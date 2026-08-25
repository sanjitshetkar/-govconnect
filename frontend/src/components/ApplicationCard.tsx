import React from 'react';
import { ArrowRight, Clock, Building2, Sparkles, AlertTriangle } from 'lucide-react';
import { Application, LanguageCode } from '../types';
import StatusBadge from './StatusBadge';
import { useTranslation, localizeApplication } from '../translations';

export type ApplicationCardProps = {
  application: Application;
  currentLanguage?: LanguageCode;
  onTrack: (app: Application) => void;
  onContinue?: (app: Application) => void;
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  currentLanguage = 'en',
  onTrack,
  onContinue,
}) => {
  const { t } = useTranslation(currentLanguage);
  const localized = localizeApplication(application, currentLanguage);

  const progressPercent = Math.min(
    100,
    Math.round((localized.progress_step / localized.total_steps) * 100)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 transition-all hover:shadow-md hover:border-indigo-200 group flex flex-col justify-between">
      <div>
        {/* Header: ID + Status + Last Updated */}
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {localized.application_id}
            </span>
            <StatusBadge status={localized.status} size="sm" />
          </div>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {currentLanguage === 'hi' ? 'अद्यतन: ' : currentLanguage === 'mr' ? 'अपडेट: ' : currentLanguage === 'kok' ? 'ताजेपण: ' : 'Updated '} {localized.last_updated}
          </span>
        </div>

        {/* Service Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {localized.service_name}
        </h3>

        {/* Department */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{localized.department}</span>
        </div>

        {/* Progress Bar & Current Step */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 text-xs truncate max-w-[200px] sm:max-w-xs">
              {localized.current_step_name}
            </span>
            <span className="font-bold text-indigo-600 shrink-0">
              {currentLanguage === 'hi' ? 'चरण' : currentLanguage === 'mr' ? 'टप्पा' : currentLanguage === 'kok' ? 'टप्पो' : 'Step'} {localized.progress_step} / {localized.total_steps}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                localized.status === 'approved'
                  ? 'bg-emerald-500'
                  : localized.status === 'action_required'
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Next Action Pill */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            {t.tracking.nextActionTitle}
          </span>
          <p className="text-slate-700 font-medium line-clamp-2">
            {localized.next_action}
          </p>
        </div>

        {/* Warning Callout if present */}
        {localized.warnings && localized.warnings.length > 0 && (
          <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{localized.warnings[0]}</span>
          </div>
        )}
      </div>

      {/* Footer CTA buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={() => onTrack(application)}
          className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>{currentLanguage === 'hi' ? 'स्थिति ट्रैक करें' : currentLanguage === 'mr' ? 'स्थिती ट्रॅक करा' : currentLanguage === 'kok' ? 'स्थिती पळयात' : 'Track Application'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {localized.status === 'draft' || localized.status === 'action_required' ? (
          <button
            onClick={() => (onContinue ? onContinue(application) : onTrack(application))}
            className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{localized.status === 'draft' ? (currentLanguage === 'hi' ? 'जारी रखें' : 'Resume') : (currentLanguage === 'hi' ? 'समाधान करें' : 'Resolve')}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ApplicationCard;
