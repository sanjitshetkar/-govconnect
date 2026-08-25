import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, FileText, Send } from 'lucide-react';
import { ApplicationStatus } from '../types';

export type StatusBadgeProps = {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          icon: CheckCircle2,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          iconClass: 'text-emerald-600',
        };
      case 'in_review':
        return {
          label: 'Under Review',
          icon: Clock,
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          iconClass: 'text-indigo-600',
        };
      case 'submitted':
        return {
          label: 'Submitted',
          icon: Send,
          classes: 'bg-sky-50 text-sky-700 border-sky-200/80',
          iconClass: 'text-sky-600',
        };
      case 'action_required':
        return {
          label: 'Action Required',
          icon: AlertCircle,
          classes: 'bg-amber-50 text-amber-800 border-amber-200/80',
          iconClass: 'text-amber-600 animate-pulse',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          classes: 'bg-rose-50 text-rose-700 border-rose-200/80',
          iconClass: 'text-rose-600',
        };
      case 'draft':
      default:
        return {
          label: 'Draft',
          icon: FileText,
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
          iconClass: 'text-slate-500',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.classes} ${sizeClasses} transition-all`}
    >
      {showIcon && <Icon className={`${iconSizes} ${config.iconClass} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
