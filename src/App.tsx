import React, { useState } from 'react';
import {
  AppTab,
  UserProfile,
  ApplicationRecord,
  UploadedDocument,
  ChatMessage,
} from './types';
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_APPLICATIONS,
  DEFAULT_DOCUMENTS,
  INITIAL_CHAT_MESSAGES,
  DEMO_CITIZEN_PROFILES,
} from './mockData';
import { GovBanner } from './components/GovBanner';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ChatWindow } from './components/ChatWindow';
import { DocumentVault } from './components/DocumentVault';
import { AutoFillPreview } from './components/AutoFillPreview';
import { OAuthModal } from './components/OAuthModal';
import { AuthModal } from './components/AuthModal';
import { NewApplicationModal } from './components/NewApplicationModal';
import { Footer } from './components/Footer';
import {
  ShieldCheck,
  Fingerprint,
  LogIn,
  UserPlus,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const App: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [applications, setApplications] = useState<ApplicationRecord[]>(DEFAULT_APPLICATIONS);
  const [documents, setDocuments] = useState<UploadedDocument[]>(DEFAULT_DOCUMENTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [activeApplicationId, setActiveApplicationId] = useState<string>(
    DEFAULT_APPLICATIONS[0]?.id || ''
  );

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  const activeApplication =
    applications.find((app) => app.id === activeApplicationId) || applications[0] || null;

  const handleSetActiveApplication = (app: ApplicationRecord) => {
    setActiveApplicationId(app.id);
  };

  const handleApplicationCreated = (newApp: ApplicationRecord) => {
    setApplications((prev) => [newApp, ...prev]);
    setActiveApplicationId(newApp.id);
    setActiveTab('autofill');
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (activeApplicationId === id) {
      const remaining = applications.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        setActiveApplicationId(remaining[0].id);
      }
    }
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleRegistrationComplete = (
    newProfile: UserProfile,
    newDocs?: UploadedDocument[]
  ) => {
    setUserProfile(newProfile);
    setIsAuthenticated(true);
    if (newDocs && newDocs.length > 0) {
      setDocuments((prev) => [...newDocs, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#135ca2] selection:text-white">
      {/* Official Government of India Top Banner */}
      <GovBanner />

      {/* Primary Government Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        isAuthenticated={isAuthenticated}
        onOpenLoginModal={handleOpenLogin}
        onOpenSignupModal={handleOpenSignup}
        onLogout={handleLogout}
        applications={applications}
        documents={documents}
        onOpenOAuthModal={() => setIsOAuthModalOpen(true)}
        onOpenNewAppModal={() => {
          if (!isAuthenticated) {
            handleOpenLogin();
          } else {
            setIsNewAppModalOpen(true);
          }
        }}
        activeApplication={activeApplication}
      />

      {/* Main Tab Routing Area */}
      <main className="flex-1 w-full pb-12">
        
        {/* Unauthenticated Gateway Screen for Protected Views */}
        {!isAuthenticated && activeTab !== 'chat' ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-white rounded-xl border-2 border-slate-300 shadow-xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-[#0c2340] text-white p-6 border-b-2 border-[#135ca2] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-white/10 flex flex-col items-center justify-center text-amber-400 font-serif border border-white/20 shrink-0">
                    <span className="text-2xl leading-none">🏛️</span>
                    <span className="text-[9px] font-bold text-amber-300 uppercase tracking-tighter mt-1 font-sans">
                      {t.nav.emblemSlogan}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-widest block">
                      {t.gateway.slogan}
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      {t.gateway.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {t.gateway.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-900/80 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {language === 'HI' ? 'आईटी अधिनियम 2000 अनुपालित' : 'IT Act 2000 Compliant'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Option A: Citizen Login */}
                  <div className="bg-[#f0f7ff] border-2 border-[#135ca2]/40 rounded-xl p-6 flex flex-col justify-between hover:border-[#135ca2] transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#135ca2] text-white flex items-center justify-center mb-3">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#0c2340]">
                        {t.gateway.loginCardTitle}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {t.gateway.loginCardDesc}
                      </p>
                    </div>

                    <button
                      id="btn-gateway-login"
                      onClick={handleOpenLogin}
                      className="mt-5 w-full py-2.5 bg-[#135ca2] hover:bg-[#0b3c6d] text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{t.gateway.loginBtn}</span>
                    </button>
                  </div>

                  {/* Option B: New Citizen Registration */}
                  <div className="bg-[#f0fdf4] border-2 border-emerald-500/40 rounded-xl p-6 flex flex-col justify-between hover:border-emerald-600 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center mb-3">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-emerald-950">
                        {t.gateway.signupCardTitle}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {t.gateway.signupCardDesc}
                      </p>
                    </div>

                    <button
                      id="btn-gateway-signup"
                      onClick={handleOpenSignup}
                      className="mt-5 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>{t.gateway.signupBtn}</span>
                    </button>
                  </div>

                </div>

                {/* Quick Demo Citizen 1-Click Access */}
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {t.gateway.quickAccessTitle}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {t.gateway.quickAccessSubtitle}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {DEMO_CITIZEN_PROFILES.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          setUserProfile(profile);
                          setIsAuthenticated(true);
                        }}
                        className="p-3 bg-white border border-slate-300 hover:border-[#135ca2] hover:bg-[#f0f7ff] rounded-lg text-left transition-all group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300 group-hover:ring-[#135ca2]"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs text-slate-900 block truncate group-hover:text-[#135ca2]">
                              {language === 'HI' && profile.hindiName ? profile.hindiName : profile.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {profile.stateOrUT}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-600 font-medium truncate">
                            {profile.occupation?.split('(')[0] || (language === 'HI' ? 'नागरिक' : 'Citizen')}
                          </span>
                          <span className="text-[#135ca2] font-bold">{t.gateway.signInArrow}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Banner */}
              <div className="bg-[#f8fafc] border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'HI' ? 'UIDAI आधार 2.0 एवं राष्ट्रीय सूचना विज्ञान केंद्र (NIC) द्वारा सुरक्षित' : 'UIDAI Aadhaar 2.0 & National Informatics Centre (NIC) Secured'}</span>
                </span>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="text-[#135ca2] font-bold hover:underline"
                >
                  {t.gateway.guestChatLink}
                </button>
              </div>

            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                applications={applications}
                documents={documents}
                activeApplication={activeApplication}
                setActiveApplication={handleSetActiveApplication}
                setActiveTab={setActiveTab}
                onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
                onDeleteApplication={handleDeleteApplication}
              />
            )}

            {activeTab === 'chat' && (
              <ChatWindow
                messages={messages}
                setMessages={setMessages}
                userProfile={userProfile}
                documents={documents}
                applications={applications}
                activeApplication={activeApplication}
                setActiveApplication={handleSetActiveApplication}
                setActiveTab={setActiveTab}
                onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
              />
            )}

            {activeTab === 'vault' && (
              <DocumentVault
                documents={documents}
                setDocuments={setDocuments}
                userProfile={userProfile}
                setActiveTab={setActiveTab}
                onOpenOAuthModal={() => setIsOAuthModalOpen(true)}
              />
            )}

            {activeTab === 'autofill' && (
              <AutoFillPreview
                activeApplication={activeApplication}
                setActiveApplication={handleSetActiveApplication}
                applications={applications}
                setApplications={setApplications}
                documents={documents}
                userProfile={userProfile}
              />
            )}
          </>
        )}
      </main>

      {/* Official Government of India Footer */}
      <Footer />

      {/* Primary Citizen Auth Modal (Login & Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        onRegistrationComplete={handleRegistrationComplete}
      />

      {/* DigiLocker & MeriPehchaan IAM Settings Modal */}
      <OAuthModal
        isOpen={isOAuthModalOpen}
        onClose={() => setIsOAuthModalOpen(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />

      {/* New Statutory Application Filing Modal */}
      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        userProfile={userProfile}
        documents={documents}
        onApplicationCreated={handleApplicationCreated}
      />
    </div>
  );
};

export default App;
