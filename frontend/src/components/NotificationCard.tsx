import React from 'react';
import {
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { NotificationItem } from '../types';

export type NotificationCardProps = {
  notification: NotificationItem;
  onAction?: (notification: NotificationItem) => void;
  onMarkRead?: (id: string) => void;
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onAction,
  onMarkRead,
}) => {
  const getTypeConfig = () => {
    switch (notification.type) {
      case 'action_required':
        return {
          label: 'Action Required',
          icon: AlertTriangle,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          iconColor: 'text-amber-600',
        };
      case 'update':
        return {
          label: 'Application Update',
          icon: Sparkles,
          badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          iconColor: 'text-indigo-600',
        };
      case 'reminder':
      default:
        return {
          label: 'Reminder',
          icon: Clock,
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          iconColor: 'text-slate-500',
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all ${
        notification.is_read
          ? 'border-slate-200/80 opacity-80'
          : 'border-slate-300 shadow-xs ring-1 ring-slate-200/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Icon + Content */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${config.badgeClass}`}
              >
                {config.label}
              </span>

              {notification.days_remaining !== undefined && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {notification.days_remaining} days remaining
                </span>
              )}

              <span className="text-xs text-slate-400 font-medium">
                • {notification.time_ago}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {notification.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {notification.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {!notification.is_read && onMarkRead && (
            <button
              onClick={() => onMarkRead(notification.notification_id)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Mark Read
            </button>
          )}

          {notification.action_label && onAction && (
            <button
              onClick={() => onAction(notification)}
              className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{notification.action_label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
