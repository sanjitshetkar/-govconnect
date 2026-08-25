import React from 'react';
import { CheckCircle2, Clock, Circle, Building2 } from 'lucide-react';
import { ApplicationTimelineItem } from '../types';

export type ProgressTimelineProps = {
  timeline: ApplicationTimelineItem[];
};

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ timeline }) => {
  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {timeline.map((item, idx) => {
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';
        const isUpcoming = item.status === 'upcoming';

        return (
          <div key={idx} className="relative group">
            {/* Step Icon Indicator */}
            <div
              className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : isCurrent
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 animate-pulse'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isCurrent ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>

            {/* Step Body */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-xs'
                  : isCompleted
                  ? 'bg-white border-slate-200/90'
                  : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <h4
                  className={`text-sm font-bold ${
                    isCurrent
                      ? 'text-indigo-950'
                      : isCompleted
                      ? 'text-slate-900'
                      : 'text-slate-500'
                  }`}
                >
                  {item.title}
                </h4>

                {item.timestamp && (
                  <span className="text-[11px] font-medium text-slate-400 font-mono">
                    {item.timestamp}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {item.department && (
                <div className="mt-2.5 pt-2 border-t border-indigo-100 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Assigned: {item.department}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTimeline;
