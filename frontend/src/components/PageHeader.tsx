import React from 'react';

export type PageHeaderProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div>
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200/60">
            {badge}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
