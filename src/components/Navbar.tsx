import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquareText,
  FolderLock,
  FileCheck,
  PlusCircle,
  ShieldCheck,
  Globe,
  Menu,
  X,
  Lock,
  CheckCircle2,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { AppTab, UserProfile, ApplicationRecord, UploadedDocument } from '../types';
import { DEMO_CITIZEN_PROFILES } from '../mockData';
import { useLanguage } from '../LanguageContext';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  onOpenLoginModal: () => void;
  onOpenSignupModal: () => void;
  onLogout: () => void;
  applications: ApplicationRecord[];
  documents: UploadedDocument[];
  onOpenOAuthModal: () => void;
  onOpenNewAppModal: () => void;
  activeApplication: ApplicationRecord | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  setUserProfile,
  isAuthenticated,
  onOpenLoginModal,
  onOpenSignupModal,
  onLogout,
  applications,
  documents,
  onOpenOAuthModal,
  onOpenNewAppModal,
  activeApplication,
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingAppsCount = applications.filter(
    (a) => a.status === 'In Review' || a.status === 'Drafting'
  ).length;

  const navItems = [
    {
      id: 'dashboard' as AppTab,
      label: t.nav.tabDashboard,
      icon: LayoutDashboard,
      badge: pendingAppsCount > 0 ? `${pendingAppsCount}` : undefined,
    },
    {
      id: 'chat' as AppTab,
      label: t.nav.tabChat,
      icon: MessageSquareText,
      badge: undefined,
    },
    {
      id: 'vault' as AppTab,
      label: t.nav.tabVault,
      icon: FolderLock,
      badge: documents.length > 0 ? `${documents.length}` : undefined,
    },
    {
      id: 'autofill' as AppTab,
      label: t.nav.tabAutofill,
      icon: FileCheck,
      badge: undefined,
    },
  ];

  return (
    <header className="bg-[#0c2340] text-white border-b-2 border-[#135ca2] shadow-md font-sans sticky top-0 z-40 no-print">
      
      {/* Top Ministry & State Emblem Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4.5">
        <div className="flex items-center justify-between gap-6">
          
          {/* Official Emblem of India & Portal Title */}
          <div className="flex items-center gap-4">
            {/* Ashoka Stambh / State Emblem Icon */}
            <div className="w-13 h-13 rounded-xl bg-white/10 flex flex-col items-center justify-center text-amber-400 font-serif border border-white/20 shrink-0 p-1.5 shadow-sm">
              <span className="text-2xl leading-none">🏛️</span>
              <span className="text-[8.5px] font-bold text-amber-300 uppercase tracking-tight mt-1 font-sans">
                {t.nav.emblemSlogan}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-0.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">
                  {t.nav.govOfIndiaUpper}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#135ca2] text-white border border-[#93c5fd]/30">
                  {t.nav.digitalIndiaBadge}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{t.nav.portalTitle}</span>
                <span className="text-[#38bdf8] font-semibold text-base">{t.nav.portalExt}</span>
                <span className="text-xs text-slate-300 font-normal hidden md:inline ml-3 pl-3 border-l border-slate-600">
                  {t.nav.portalSubtitle}
                </span>
              </h1>
            </div>
          </div>

          {/* Right Header Controls: Language Switcher, New Filing, Login/Register / Profile */}
          <div className="hidden md:flex items-center gap-3.5">
            
            {/* Language Switcher Button (English / हिन्दी) */}
            <button
              id="btn-language-switcher"
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-[#061528] hover:bg-[#135ca2] border border-[#1e3a5f] hover:border-[#38bdf8] rounded-lg px-3.5 py-2 text-xs text-slate-200 hover:text-white transition-all cursor-pointer font-bold shadow-xs"
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="w-4 h-4 text-[#38bdf8]" />
              <span>{language === 'EN' ? 'हिन्दी (HI)' : 'English (EN)'}</span>
            </button>

            {/* Start New Application */}
            <button
              id="btn-nav-new-application"
              onClick={onOpenNewAppModal}
              className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold rounded-lg text-xs transition-all shadow-xs flex items-center gap-2 border border-amber-400 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.nav.applyScheme}</span>
            </button>

            {/* AUTHENTICATION CONTROLS */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <button
                  id="btn-nav-login"
                  onClick={onOpenLoginModal}
                  className="px-4 py-2 bg-[#135ca2] hover:bg-[#0b3c6d] text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center gap-2 border border-[#38bdf8]/40 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-sky-200" />
                  <span>{t.nav.login}</span>
                </button>

                <button
                  id="btn-nav-signup"
                  onClick={onOpenSignupModal}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center gap-2 border border-emerald-500 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-emerald-200" />
                  <span>{t.nav.register}</span>
                </button>
              </div>
            ) : (
              /* Logged In Citizen Profile Dropdown */
              <div className="relative" ref={profileMenuRef}>
                <button
                  id="btn-nav-user-dropdown"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-3 bg-[#061528] hover:bg-[#0f2744] border border-[#1e3a5f] rounded-lg px-3.5 py-2 transition-all text-left group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#38bdf8]/60"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#061528]"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-white leading-tight">
                        {language === 'HI' && userProfile.hindiName ? userProfile.hindiName : userProfile.name}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    </div>
                    <span className="text-[10px] text-[#38bdf8] block leading-tight font-mono mt-0.5">
                      {t.nav.aadhaarKycBadge}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white ml-1" />
                </button>

                {/* Profile Popover Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border-2 border-slate-200 py-3 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 rounded-t-lg">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        {t.nav.authenticatedIdentity}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#0c2340]">
                          {language === 'HI' && userProfile.hindiName ? userProfile.hindiName : userProfile.name}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                          UIDAI e-KYC
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 truncate block mt-1">
                        {userProfile.email}
                      </span>
                      <div className="text-xs font-mono text-slate-600 mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span>Aadhaar: <strong>{userProfile.aadhaarMasked}</strong></span>
                        <span>PAN: <strong>{userProfile.panNumber}</strong></span>
                      </div>
                    </div>

                    {/* Quick Switch Citizen Accounts */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                        {t.nav.switchProfile}
                      </span>
                      <div className="space-y-1.5">
                        {DEMO_CITIZEN_PROFILES.map((p) => {
                          const isCurrent = p.id === userProfile.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                setUserProfile(p);
                                setIsProfileMenuOpen(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 text-xs transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#f0f7ff] text-[#135ca2] font-bold border border-[#135ca2]/30'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <img
                                src={p.avatarUrl}
                                alt={p.name}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <div className="flex-1 truncate">
                                <span className="block truncate font-semibold">
                                  {language === 'HI' && p.hindiName ? p.hindiName : p.name}
                                </span>
                              </div>
                              {isCurrent && (
                                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">{t.nav.active}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          onOpenOAuthModal();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#135ca2]" />
                        <span>{t.nav.digiLockerCredentials}</span>
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>{t.nav.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 bg-[#061528] text-white border border-[#1e3a5f] rounded-lg text-xs font-bold"
            >
              {language === 'EN' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={onOpenNewAppModal}
              className="p-2.5 bg-[#f59e0b] text-slate-950 rounded-lg text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-300 hover:text-white rounded-lg bg-[#061528]"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#061528] border-t border-[#1e3a5f] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none">
          
          <nav className="flex items-center space-x-2 sm:space-x-4 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-t-lg text-xs sm:text-sm font-semibold transition-all relative border-b-3 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#0c2340] text-white border-[#f59e0b] font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-[#0c2340]/70 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f59e0b]' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1.5 ${
                        isActive
                          ? 'bg-[#135ca2] text-white'
                          : 'bg-[#1e3a5f] text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Application Docket Reference */}
          {activeApplication && (
            <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-300 font-mono py-2 pl-5 border-l border-[#1e3a5f]">
              <span className="text-[#38bdf8] font-bold">{t.nav.docketNo}</span>
              <span className="bg-[#0c2340] px-2.5 py-1 rounded-md border border-[#1e3a5f] text-slate-200 font-semibold">
                {activeApplication.applicationNumber}
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#061528] border-t border-[#1e3a5f] p-4 space-y-3">
          {isAuthenticated ? (
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]">
              <div className="flex items-center gap-2">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'HI' && userProfile.hindiName ? userProfile.hindiName : userProfile.name}
                  </span>
                  <span className="text-[10px] text-[#38bdf8]">{t.nav.aadhaarKycBadge}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-red-400 underline font-bold"
              >
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#1e3a5f]">
              <button
                onClick={() => {
                  onOpenLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 bg-[#135ca2] text-white rounded text-xs font-bold text-center"
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => {
                  onOpenSignupModal();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 bg-emerald-700 text-white rounded text-xs font-bold text-center"
              >
                {t.nav.register}
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md text-xs ${
                    isActive ? 'bg-[#135ca2] text-white font-bold' : 'text-slate-300 hover:bg-[#0c2340]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
};
