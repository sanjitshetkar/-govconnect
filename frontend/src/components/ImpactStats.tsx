import React from 'react';
import { Clock, Sparkles, ShieldCheck, Layers, TrendingUp, Award } from 'lucide-react';
import { UserImpactMetrics } from '../types';

export type ImpactStatsProps = {
  metrics: UserImpactMetrics;
};

export const ImpactStats: React.FC<ImpactStatsProps> = ({ metrics }) => {
  const userStats = [
    {
      label: 'Time Saved',
      value: `${metrics.time_saved_minutes} min`,
      subtext: 'vs. traditional form typing',
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Fields Auto-Filled',
      value: `${metrics.fields_autofilled}`,
      subtext: 'mapped instantly from docs',
      icon: Sparkles,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Documents Verified',
      value: `${metrics.documents_verified}`,
      subtext: 'with 100% cryptographic trust',
      icon: ShieldCheck,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      label: 'Applications Managed',
      value: `${metrics.applications_managed}`,
      subtext: 'in one unified tracking hub',
      icon: Layers,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Citizen Personal Impact */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Your GovConnect Impact</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Personalized
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Efficiency gains achieved through your digital identity &amp; document vault
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nationwide Platform Scale Impact (Hackathon Highlight) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1 border border-indigo-500/30">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Platform-Wide Metric Benchmark</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              GovConnect National Impact
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Powered by Automated e-Filing &amp; DigiLocker OCR
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono block">
              {metrics.global_stats.applications_completed}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Applications Completed
            </span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono block">
              {metrics.global_stats.hours_saved}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Citizen Hours Saved
            </span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-mono block">
              {metrics.global_stats.documents_processed}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Documents Verified
            </span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono block">
              {metrics.global_stats.forms_autofilled}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Zero-Typing Accuracy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStats;
