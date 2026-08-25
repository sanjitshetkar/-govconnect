import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FileCheck, ArrowRight } from 'lucide-react';
import {
  NavTab,
  UserProfile,
  Application,
  DocumentItem,
  GovernmentService,
  NotificationItem,
  ChatMessage,
  UserImpactMetrics,
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_SERVICES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_IMPACT_METRICS,
  getAllUsers,
  registerCitizenAccount,
  getCitizenProfile,
  updateCitizenProfile,
  getApplications,
  saveApplicationToDb,
  getDocuments,
  saveDocumentToDb,
  deleteDocumentFromDb,
  getNotifications,
  markNotificationReadInDb,
  getImpactMetrics,
} from './services/mockApi';
import TopHeaderNavbar from './components/TopHeaderNavbar';
import MobileNav from './components/MobileNav';
import FileUploadModal from './components/FileUploadModal';
import RegisterModal from './components/RegisterModal';
import ApplicationCard from './components/ApplicationCard';
import LanguageSelector, { LanguageCode } from './components/LanguageSelector';
import OnboardingModal from './components/OnboardingModal';

// Views
import DashboardView from './views/DashboardView';
import AIAssistantView from './views/AIAssistantView';
import ExploreServicesView from './views/ExploreServicesView';
import ServiceDetailView from './views/ServiceDetailView';
import DocumentCenterView from './views/DocumentCenterView';
import ApplicationAutoFillView from './views/ApplicationAutoFillView';
import ApplicationTrackingView from './views/ApplicationTrackingView';
import AlertsView from './views/AlertsView';
import ProfileView from './views/ProfileView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // First-run onboarding: true until we confirm a real user exists in the DB
  // Starts as false to avoid flash — set to true only after DB confirms no real user
  const [isFirstRun, setIsFirstRun] = useState<boolean>(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState<boolean>(true);

  // Multi-user & Database State
  const [existingUsers, setExistingUsers] = useState<UserProfile[]>([INITIAL_USER_PROFILE]);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [services] = useState<GovernmentService[]>(INITIAL_SERVICES);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [impactMetrics, setImpactMetrics] = useState<UserImpactMetrics>(INITIAL_IMPACT_METRICS);

  // Active Contexts
  const [selectedService, setSelectedService] = useState<GovernmentService | null>(
    INITIAL_SERVICES[0]
  );
  const [trackedApplication, setTrackedApplication] = useState<Application | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDefaultCategory, setUploadDefaultCategory] = useState<DocumentItem['category']>('identity');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Load database on mount — determines first-run from actual DB data
  useEffect(() => {
    async function loadData() {
      try {
        const users = await getAllUsers();
        // A "real" user is one that is not the generic placeholder
        const realUsers = users.filter(
          (u) => u.user_id !== 'usr-default-citizen' && u.name !== 'GovConnect User'
        );

        if (realUsers.length > 0) {
          // Real user exists in DB — skip onboarding, load their data
          setExistingUsers(realUsers);
          const current = realUsers[0];
          setUserProfile(current);
          if (current.language_preference) {
            setCurrentLanguage(current.language_preference as LanguageCode);
          }
          await reloadUserData(current.user_id || 'usr-default-citizen');
          setIsFirstRun(false);
        } else {
          // No real user in DB — show onboarding wizard
          setIsFirstRun(true);
        }
      } catch (err) {
        console.warn('DB load error, showing onboarding:', err);
        setIsFirstRun(true);
      } finally {
        setIsLoadingCheck(false);
      }
    }
    loadData();
  }, []);

  // Reload user data when userProfile changes
  const reloadUserData = async (userId: string) => {
    const [apps, docs, notifs, metrics] = await Promise.all([
      getApplications(userId),
      getDocuments(userId),
      getNotifications(userId),
      getImpactMetrics(userId),
    ]);
    setApplications(apps);
    setDocuments(docs);
    setNotifications(notifs);
    setImpactMetrics(metrics);
    if (apps.length > 0) {
      setTrackedApplication(apps[0]);
    } else {
      setTrackedApplication(null);
    }
  };

  const handleSwitchUser = async (user: UserProfile) => {
    setUserProfile(user);
    const userId = user.user_id || user.id || 'usr-sanjit-2026';
    await reloadUserData(userId);

    // Reset AI Assistant Chat context with personalized greeting for the switched citizen
    const welcomeMsg: ChatMessage = {
      message_id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      content:
        currentLanguage === 'hi'
          ? `नमस्ते ${user.name}! 🙏 मैं आपका Gov AI सहायक हूँ। मैं आपकी सहायता के लिए तैयार हूँ।`
          : currentLanguage === 'mr'
          ? `नमस्कार ${user.name}! 🙏 मी आपला Gov AI सहाय्यक आहे. मी आपल्या मदतीसाठी सज्ज आहे.`
          : currentLanguage === 'kok'
          ? `नमस्कार ${user.name}! 🙏 हांव तुमचो Gov AI सहाय्यक.`
          : `Hello ${user.name}! 👋 I am Gov AI, your personal government assistant.\n\nTell me what scheme or certificate you need help with!`,
      timestamp: 'Just now',
      suggested_actions:
        currentLanguage === 'hi'
          ? ['मुझे छात्रवृत्ति के लिए आवेदन करना है', 'मेरी पात्रता जांचें', 'मेरे सक्रिय आवेदन दिखाएं']
          : currentLanguage === 'mr'
          ? ['मला शिष्यवृत्तीसाठी अर्ज करायचा आहे', 'माझी पात्रता तपासा', 'माझे अर्ज दाखवा']
          : ['I want to apply for a scholarship', 'Check my eligibility for schemes', 'What documents do I need?'],
    };
    setMessages([welcomeMsg]);
  };

  const handleUserCreated = async (newProfileData: Partial<UserProfile>) => {
    const created = await registerCitizenAccount(newProfileData);
    setExistingUsers((prev) => [...prev, created]);
    await handleSwitchUser(created);
    setIsAccountModalOpen(false);
  };

  // Called when the first-run onboarding wizard is completed
  const handleOnboardingComplete = async (profileData: Partial<UserProfile>) => {
    try {
      const created = await registerCitizenAccount(profileData);
      // Replace the generic placeholder with the real user
      setExistingUsers([created]);
      await handleSwitchUser(created);
      if (profileData.language_preference) {
        setCurrentLanguage(profileData.language_preference as LanguageCode);
      }
    } catch (err) {
      console.warn('Onboarding registration error:', err);
    }
    // No localStorage — DB is the source of truth
    setIsFirstRun(false);
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    const saved = await updateCitizenProfile(updated);
    setUserProfile(saved);
    const userId = saved.user_id || saved.id || 'usr-sanjit-2026';
    setExistingUsers((prev) =>
      prev.map((u) => ((u.user_id || u.id) === userId ? { ...u, ...saved } : u))
    );
  };

  const unreadAlertsCount = notifications.filter((n) => !n.is_read).length;

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Handlers
  const handleSelectService = (service: GovernmentService) => {
    setSelectedService(service);
    setActiveTab('service_detail');
  };

  const handleTrackApplication = (app: Application) => {
    setTrackedApplication(app);
    setActiveTab('tracking');
  };

  const handleStartAssistantWithPrompt = (prompt: string) => {
    const userMsg: ChatMessage = {
      message_id: `msg-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setActiveTab('assistant');
  };

  const handleOpenUploadModal = (category: DocumentItem['category'] = 'identity') => {
    setUploadDefaultCategory(category);
    setIsUploadModalOpen(true);
  };

  const handleDocumentAdded = async (newDoc: DocumentItem) => {
    const userId = userProfile.user_id || userProfile.id || 'usr-sanjit-2026';
    const saved = await saveDocumentToDb(userId, newDoc);
    setDocuments((prev) => [saved, ...prev]);
    const metrics = await getImpactMetrics(userId);
    setImpactMetrics(metrics);
  };

  const handleContinueToAutoFill = (service: GovernmentService) => {
    setSelectedService(service);
    setActiveTab('autofill');
  };

  const handleSaveDraft = async (formData: Record<string, any>) => {
    if (!selectedService) return;
    const userId = userProfile.user_id || userProfile.id || 'usr-sanjit-2026';

    const draftApp: Application = {
      application_id: `GC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      service_id: selectedService.service_id,
      service_name: selectedService.title,
      category: selectedService.category,
      status: 'draft',
      progress_step: 3,
      total_steps: 6,
      current_step_name: 'Draft Saved in Database',
      last_updated: 'Just now',
      department: selectedService.department,
      next_action: 'Resume review and e-Sign when ready to submit.',
      form_data: formData,
      attached_documents: documents.map((d) => d.document_id),
      timeline: [
        {
          step_index: 0,
          title: 'Application Started',
          description: 'Auto-filled from verified citizen vault.',
          status: 'completed',
          timestamp: 'Just now',
        },
        {
          step_index: 1,
          title: 'Draft Saved',
          description: 'Ready for final review and citizen submission.',
          status: 'current',
          timestamp: 'Just now',
        },
      ],
    };

    const saved = await saveApplicationToDb(userId, draftApp);
    setApplications((prev) => [saved, ...prev.filter((a) => a.application_id !== saved.application_id)]);
    const metrics = await getImpactMetrics(userId);
    setImpactMetrics(metrics);
  };

  const handleSubmitApplication = async (formData: Record<string, any>) => {
    if (!selectedService) return;
    const userId = userProfile.user_id || userProfile.id || 'usr-sanjit-2026';
    const newAppId = `GC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp: Application = {
      application_id: newAppId,
      service_id: selectedService.service_id,
      service_name: selectedService.title,
      category: selectedService.category,
      status: 'in_review',
      progress_step: 4,
      total_steps: 6,
      current_step_name: 'Transmitted & Queued for Scrutiny Committee',
      last_updated: 'Just now',
      submitted_date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      department: selectedService.department,
      next_action: 'Under initial document scrutiny. You will receive notification on approval.',
      reference_number: `GOI-${selectedService.category.substring(0, 3).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      form_data: formData,
      attached_documents: documents.map((d) => d.document_id),
      timeline: [
        {
          step_index: 0,
          title: 'Application Started',
          description: 'Citizen initiated pre-fill through GovConnect AI.',
          status: 'completed',
          timestamp: 'Just now',
        },
        {
          step_index: 1,
          title: 'Documents Uploaded & Linked',
          description: `${documents.length} verified certificates attached from vault.`,
          status: 'completed',
          timestamp: 'Just now',
        },
        {
          step_index: 2,
          title: 'AI Verification & Cryptographic Seal',
          description: 'Zero discrepancy found with Aadhaar / State Domicile.',
          status: 'completed',
          timestamp: 'Just now',
        },
        {
          step_index: 3,
          title: 'Application Submitted',
          description: 'Aadhaar e-Signed and transmitted directly to state portal gateway.',
          status: 'completed',
          timestamp: 'Just now',
        },
        {
          step_index: 4,
          title: 'Under Review by Scrutiny Cell',
          description: 'Assigned to evaluation desk. Standard turnaround: 5 working days.',
          status: 'current',
          timestamp: 'Just now',
          department: selectedService.department,
        },
        {
          step_index: 5,
          title: 'Approved & Sanction Order Issued',
          description: 'Digital sanction order with unique grant voucher number.',
          status: 'upcoming',
        },
        {
          step_index: 6,
          title: 'Disbursement Completed',
          description: 'Direct Benefit Transfer into registered bank account.',
          status: 'upcoming',
        },
      ],
    };

    const saved = await saveApplicationToDb(userId, newApp);
    setApplications((prev) => [saved, ...prev]);
    const metrics = await getImpactMetrics(userId);
    setImpactMetrics(metrics);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    setTrackedApplication(saved);
    setActiveTab('tracking');
  };

  const handleDeleteDocument = async (id: string) => {
    const userId = userProfile.user_id || userProfile.id || 'usr-sanjit-2026';
    await deleteDocumentFromDb(userId, id);
    setDocuments((prev) => prev.filter((d) => d.document_id !== id));
    const metrics = await getImpactMetrics(userId);
    setImpactMetrics(metrics);
  };

  // Show a minimal splash while we check the DB for existing users
  if (isLoadingCheck) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30 animate-pulse">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading GovConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* First-run onboarding wizard — shown when DB has no real user */}
      {isFirstRun && <OnboardingModal onComplete={handleOnboardingComplete} />}

      {/* Sleek Top Horizontal Navigation Bar */}
      <TopHeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        existingUsers={existingUsers}
        onSwitchUser={handleSwitchUser}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        applicationsCount={applications.length}
        documentsCount={documents.length}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Main Full-Width Expansive Content Area */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            applications={applications}
            services={services}
            notifications={notifications}
            impactMetrics={impactMetrics}
            currentLanguage={currentLanguage}
            onNavigate={setActiveTab}
            onSelectService={handleSelectService}
            onTrackApplication={handleTrackApplication}
            onStartAssistantWithPrompt={handleStartAssistantWithPrompt}
            onOpenUploadModal={() => handleOpenUploadModal('identity')}
          />
        )}

          {activeTab === 'assistant' && (
            <AIAssistantView
              messages={messages}
              setMessages={setMessages}
              userProfile={userProfile}
              documents={documents}
              applications={applications}
              services={services}
              activeService={selectedService}
              setActiveService={setSelectedService}
              onNavigate={setActiveTab}
              onStartAutoFill={handleContinueToAutoFill}
              onOpenUploadModal={() => handleOpenUploadModal('identity')}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'services' && (
            <ExploreServicesView
              services={services}
              currentLanguage={currentLanguage}
              onSelectService={handleSelectService}
            />
          )}

          {activeTab === 'service_detail' && selectedService && (
            <ServiceDetailView
              service={selectedService}
              documents={documents}
              userProfile={userProfile}
              currentLanguage={currentLanguage}
              onBack={() => setActiveTab('services')}
              onContinueToAutoFill={handleContinueToAutoFill}
              onOpenUploadModal={() => handleOpenUploadModal('identity')}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentCenterView
              documents={documents}
              currentLanguage={currentLanguage}
              onOpenUploadModal={handleOpenUploadModal}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6 pb-12">
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {currentLanguage === 'hi' ? 'मेरे सक्रिय आवेदन' : currentLanguage === 'mr' ? 'माझे सक्रिय अर्ज' : currentLanguage === 'kok' ? 'म्हजे चालू अर्ज' : 'My Applications'}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {currentLanguage === 'hi' ? 'सभी वैधानिक फाइलों, समयसीमा और विभागीय निर्णयों की वास्तविक समय स्थिति।' : currentLanguage === 'mr' ? 'सर्व शासकीय अर्ज आणि विभागीय निर्णयांची सद्यस्थिती.' : currentLanguage === 'kok' ? 'सगळ्या सरकारी अर्जांची सद्यस्थिती.' : 'Track all statutory filings, progress timelines, and department actions in one place.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('services')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {currentLanguage === 'hi' ? '+ नया आवेदन करें' : currentLanguage === 'mr' ? '+ नवीन अर्ज करा' : currentLanguage === 'kok' ? '+ नवो अर्ज' : '+ New Application'}
                </button>
              </div>

              {applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map((app) => (
                    <ApplicationCard
                      key={app.application_id}
                      application={app}
                      currentLanguage={currentLanguage}
                      onTrack={handleTrackApplication}
                      onContinue={(a) => {
                        const matchedSrv = services.find((s) => s.service_id === a.service_id) || services[0];
                        setSelectedService(matchedSrv);
                        setActiveTab('autofill');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {currentLanguage === 'hi' ? 'कोई सक्रिय आवेदन नहीं है' : currentLanguage === 'mr' ? 'कोणताही अर्ज नाही' : currentLanguage === 'kok' ? 'कसलोच चालू अर्ज ना' : 'No Applications In Database'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {currentLanguage === 'hi'
                        ? 'आपने अभी तक कोई सरकारी आवेदन जमा नहीं किया है। अपनी पात्रता के आधार पर 1-क्लिक में आवेदन शुरू करें।'
                        : currentLanguage === 'mr'
                        ? 'आपण अद्याप कोणताही शासकीय अर्ज सादर केलेला नाही. 1-क्लिकमध्ये अर्ज सुरू करा.'
                        : currentLanguage === 'kok'
                        ? 'तुमी अजून कसलोच सरकारी अर्ज धाडूंक ना. 1-क्लिकान अर्ज करात.'
                        : 'You haven’t submitted any statutory applications yet. Discover eligible schemes and apply in 1-click.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{currentLanguage === 'hi' ? 'योजनाएं खोजें और आवेदन करें' : currentLanguage === 'mr' ? 'योजना शोधा व अर्ज करा' : 'Explore Schemes & Apply'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'autofill' && selectedService && (
            <ApplicationAutoFillView
              service={selectedService}
              userProfile={userProfile}
              documents={documents}
              currentLanguage={currentLanguage}
              onSaveDraft={handleSaveDraft}
              onSubmitApplication={handleSubmitApplication}
              onOpenUploadModal={handleOpenUploadModal}
              onBack={() => setActiveTab('service_detail')}
            />
          )}

          {activeTab === 'tracking' && trackedApplication && (
            <ApplicationTrackingView
              application={trackedApplication}
              documents={documents}
              currentLanguage={currentLanguage}
              onBack={() => setActiveTab('applications')}
              onOpenAssistant={handleStartAssistantWithPrompt}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              notifications={notifications}
              setNotifications={setNotifications}
              currentLanguage={currentLanguage}
              onNavigate={setActiveTab}
              onOpenAssistant={handleStartAssistantWithPrompt}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              userProfile={userProfile}
              setUserProfile={handleUpdateProfile}
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              documents={documents}
            />
          )}
        </main>

      {/* Global Document Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentAdded={handleDocumentAdded}
        defaultCategory={uploadDefaultCategory}
      />

      {/* Account Switch & Registration Modal */}
      <RegisterModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onUserCreated={handleUserCreated}
        existingUsers={existingUsers}
        onSwitchUser={handleSwitchUser}
        currentUser={userProfile}
      />
    </div>
  );
};

export default App;
