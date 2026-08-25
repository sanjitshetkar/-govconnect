import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, AlertTriangle, Sparkles, Clock } from 'lucide-react';
import { NotificationItem, NavTab, LanguageCode } from '../types';
import { useTranslation } from '../translations';
import NotificationCard from '../components/NotificationCard';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

export type AlertsViewProps = {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  currentLanguage?: LanguageCode;
  onNavigate: (tab: NavTab) => void;
  onOpenAssistant: (prompt: string) => void;
};

export const AlertsView: React.FC<AlertsViewProps> = ({
  notifications,
  setNotifications,
  currentLanguage = 'en',
  onNavigate,
  onOpenAssistant,
}) => {
  const { t } = useTranslation(currentLanguage);
  const [filter, setFilter] = useState<'all' | 'action_required' | 'update' | 'reminder'>('all');

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleAction = (item: NotificationItem) => {
    if (item.related_application_id) {
      onNavigate('applications');
    } else if (item.related_service_id) {
      onNavigate('services');
    } else {
      onOpenAssistant(item.title);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-8 pb-12 font-sans">
      <PageHeader
        badge={currentLanguage === 'hi' ? 'नागरिक अलर्ट व समयसीमा' : currentLanguage === 'mr' ? 'नागरिक सूचना व मुदती' : currentLanguage === 'kok' ? 'नागरीक सुचोवण्यो' : 'Citizen Alerts & Timelines'}
        title={t.alerts.title}
        subtitle={t.alerts.subtitle}
        action={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-slate-500" />
              <span>{t.alerts.markAllRead}</span>
            </button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: `${t.alerts.allTab} (${notifications.length})` },
          { key: 'action_required', label: t.alerts.actionRequiredTab },
          { key: 'update', label: currentLanguage === 'hi' ? 'आवेदन अपडेट' : currentLanguage === 'mr' ? 'अर्ज अपडेट्स' : currentLanguage === 'kok' ? 'अर्ज अपडेट्स' : 'Application Updates' },
          { key: 'reminder', label: currentLanguage === 'hi' ? 'अनुस्मारक व समाप्ति' : currentLanguage === 'mr' ? 'स्मरणपत्रे व मुदत' : currentLanguage === 'kok' ? 'शिटकावण्यो' : 'Reminders & Expiry' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <NotificationCard
              key={item.notification_id}
              notification={item}
              onAction={handleAction}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No alerts in this category"
          description="You are completely up to date with your statutory requirements and application tracking."
        />
      )}
    </div>
  );
};

export default AlertsView;
