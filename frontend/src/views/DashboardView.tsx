import React, { useState } from 'react';
import {
  Search,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle,
  FileCheck2,
  Compass,
  FolderLock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  UserProfile,
  Application,
  GovernmentService,
  NotificationItem,
  UserImpactMetrics,
  NavTab,
  LanguageCode,
} from '../types';
import { useTranslation } from '../translations';
import ApplicationCard from '../components/ApplicationCard';
import RecommendationCard from '../components/RecommendationCard';
import ImpactStats from '../components/ImpactStats';

export type DashboardViewProps = {
  userProfile: UserProfile;
  applications: Application[];
  services: GovernmentService[];
  notifications: NotificationItem[];
  impactMetrics: UserImpactMetrics;
  currentLanguage?: LanguageCode;
  onNavigate: (tab: NavTab) => void;
  onSelectService: (service: GovernmentService) => void;
  onTrackApplication: (app: Application) => void;
  onStartAssistantWithPrompt: (prompt: string) => void;
  onOpenUploadModal: () => void;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  applications,
  services,
  notifications,
  impactMetrics,
  currentLanguage = 'en',
  onNavigate,
  onSelectService,
  onTrackApplication,
  onStartAssistantWithPrompt,
  onOpenUploadModal,
}) => {
  const { t } = useTranslation(currentLanguage);
  const [searchInput, setSearchInput] = useState('');

  const hour = new Date().getHours();
  const greetingText =
    hour < 12
      ? t.dashboard.greetingMorning
      : hour < 17
      ? t.dashboard.greetingAfternoon
      : t.dashboard.greetingEvening;

  const suggestedPrompts =
    currentLanguage === 'hi'
      ? [
          'मुझे छात्रवृत्ति चाहिए',
          'आय प्रमाणपत्र कैसे बनवाएं?',
          'ड्राइविंग लाइसेंस नवीनीकरण',
          'मेरी पात्र योजनाएं दिखाएं',
        ]
      : currentLanguage === 'mr'
      ? [
          'मला शिष्यवृत्ती हवी आहे',
          'उत्पन्न दाखला कसा मिळवावा?',
          'ड्रायव्हिंग लायसन्स नूतनीकरण',
          'माझ्यासाठी शासकीय योजना दाखवा',
        ]
      : currentLanguage === 'kok'
      ? [
          'म्हाका स्कॉलरशिप जाय',
          'उत्पन्नाचो दाखलो कसो काडचो?',
          'लायसन्स रिन्यू करात',
          'सरकारी येवजण्यो दाखयात',
        ]
      : [
          'I want to apply for a scholarship',
          'How do I get an income certificate?',
          'What documents do I need?',
          'Show me schemes I may qualify for',
        ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onStartAssistantWithPrompt(searchInput.trim());
    }
  };

  // Recommended services (filtered to top match scores)
  const recommendedServices = services
    .filter((s) => s.match_score && s.match_score >= 85)
    .slice(0, 3);

  // Upcoming deadline alerts
  const deadlineAlerts = notifications.filter(
    (n) => n.type === 'action_required' || n.days_remaining !== undefined
  );

  return (
    <div className="space-y-10 pb-12">
      {/* 1. GREETING & PRIMARY AI SEARCH HERO */}
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greetingText}, {userProfile.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.dashboard.heroSubtitle}
          </p>
        </div>

        {/* Primary AI Input Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-indigo-300 transition-all">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.dashboard.searchPlaceholder}
                className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={onOpenUploadModal}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Attach or upload document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onStartAssistantWithPrompt(suggestedPrompts[0])}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                  title="Voice assistance"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Suggested Prompts Pills */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                {currentLanguage === 'hi' ? 'सुझाव:' : currentLanguage === 'mr' ? 'सुझाव:' : currentLanguage === 'kok' ? 'सुचोवण्यो:' : 'Suggestions:'}
              </span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onStartAssistantWithPrompt(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs font-medium border border-slate-200/80 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* 2. UPCOMING DEADLINES / ACTION REQUIRED NOTICES */}
      {deadlineAlerts.length > 0 && (
        <section className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-amber-950 uppercase tracking-wider">
                {t.dashboard.deadlinesTitle}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              {t.dashboard.viewAllDeadlines} ({notifications.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deadlineAlerts.map((alert) => (
              <div
                key={alert.notification_id}
                className="bg-white rounded-2xl p-4 border border-amber-200 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {alert.days_remaining ? `${t.documents.expiresIn} ${alert.days_remaining} ${t.alerts.daysLeft}` : 'Action Required'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {alert.description}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('alerts')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
                >
                  {alert.action_label || 'Act Now'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. MY APPLICATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>{t.sidebar.tracking}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {applications.length} {t.sidebar.badgeVerified}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.tracking.subtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('applications')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{t.dashboard.viewAllServices}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app.application_id}
                application={app}
                currentLanguage={currentLanguage}
                onTrack={onTrackApplication}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
            <p className="text-xs text-slate-500 font-medium">
              {currentLanguage === 'hi'
                ? 'आपके डेटाबेस में अभी कोई सक्रिय आवेदन नहीं है। नीचे दी गई योजनाओं में से 1-क्लिक में आवेदन करें।'
                : currentLanguage === 'mr'
                ? 'डेटाबेसमध्ये सध्या कोणताही सक्रिय अर्ज नाही. खालील योजनांमधून 1-क्लिकमध्ये अर्ज करा.'
                : currentLanguage === 'kok'
                ? 'सध्या कसलोच चालू अर्ज ना. सकयल दिल्ल्या येवजण्यांतल्यान अर्ज करात.'
                : 'No active applications in database yet. Select a recommended scheme below to auto-fill in 1 click.'}
            </p>
            <button
              onClick={() => onNavigate('services')}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <span>{t.sidebar.services}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* 4. RECOMMENDED FOR YOU */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>{t.dashboard.recommendedTitle}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                AI Matched
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.dashboard.recommendedSubtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{t.dashboard.viewAllServices}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {recommendedServices.map((service) => (
            <RecommendationCard
              key={service.service_id}
              service={service}
              currentLanguage={currentLanguage}
              onApply={onSelectService}
            />
          ))}
        </div>
      </section>

      {/* 5. IMPACT DASHBOARD */}
      <section className="pt-2">
        <ImpactStats metrics={impactMetrics} />
      </section>
    </div>
  );
};

export default DashboardView;
