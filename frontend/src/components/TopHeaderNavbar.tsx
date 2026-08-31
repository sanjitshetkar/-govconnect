import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  FolderLock,
  Bell,
  Sparkles,
  User,
  ChevronDown,
  Users,
  UserPlus,
  ShieldCheck,
  Globe,
  Check,
  LogOut,
} from 'lucide-react';
import { NavTab, UserProfile, LanguageCode } from '../types';
import { useTranslation } from '../translations';
import LanguageSelector from './LanguageSelector';

export type TopHeaderNavbarProps = {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  existingUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onOpenAccountModal: () => void;
  unreadAlertsCount: number;
  applicationsCount: number;
  documentsCount: number;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onLogout: () => void;
};

export const TopHeaderNavbar: React.FC<TopHeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  existingUsers,
  onSwitchUser,
  onOpenAccountModal,
  unreadAlertsCount,
  applicationsCount,
  documentsCount,
  currentLanguage,
  onLanguageChange,
  onLogout,
}) => {
  const { t } = useTranslation(currentLanguage);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    {
      id: 'dashboard' as NavTab,
      label: t.sidebar.dashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'services' as NavTab,
      label: t.sidebar.services,
      icon: Compass,
    },
    {
      id: 'applications' as NavTab,
      label: t.sidebar.tracking,
      icon: FileCheck2,
      badge: applicationsCount > 0 ? `${applicationsCount}` : undefined,
    },
    {
      id: 'documents' as NavTab,
      label: t.sidebar.documents,
      icon: FolderLock,
      badge: documentsCount > 0 ? `${documentsCount}` : undefined,
    },
    {
      id: 'alerts' as NavTab,
      label: t.sidebar.alerts,
      icon: Bell,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs w-full">
      {/* Tricolor Subtle Top Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white via-indigo-600 to-emerald-600"></div>

      {/* Main Full-Width Header Bar */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  GovConnect
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 leading-none">
                  जनसेवा AI
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5 hidden sm:block">
                National Single-Window Citizen Gateway
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Horizontal Menu) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'services' && (activeTab === 'service_detail' || activeTab === 'autofill')) ||
                (item.id === 'applications' && activeTab === 'tracking');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: AI Assistant, Language, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Quick Launcher */}
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              activeTab === 'assistant'
                ? 'bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-indigo-600/30'
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">
              Gov AI
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>

          {/* User Account Switcher Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                {userProfile.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>

              <div className="text-left hidden lg:block">
                <span className="font-bold text-xs text-slate-900 block leading-tight truncate max-w-[130px]">
                  {userProfile.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block leading-none">
                  {userProfile.aadhaar_masked || 'UIDAI Verified'}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                {/* Active Profile Info */}
                <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {userProfile.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {userProfile.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {userProfile.occupation || 'Citizen'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-indigo-100/80 flex items-center justify-between text-[10px] text-slate-600">
                    <span>Aadhaar: <strong className="font-mono">{userProfile.aadhaar_masked}</strong></span>
                    <span className="text-emerald-700 font-bold">✓ Verified</span>
                  </div>
                </div>

                {/* View Profile */}
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{t.sidebar.profile} &amp; Settings</span>
                </button>

                {/* Switch Accounts List */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                    Switch Citizen Account ({existingUsers.length})
                  </span>

                  <div className="space-y-1 max-h-44 overflow-y-auto">
                    {existingUsers.map((u) => {
                      const isCurrent =
                        (u.user_id && u.user_id === userProfile.user_id) ||
                        u.name === userProfile.name;

                      return (
                        <button
                          key={u.user_id || u.name}
                          onClick={() => {
                            onSwitchUser(u);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                            isCurrent
                              ? 'bg-indigo-50 text-indigo-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            <span className="truncate">{u.name}</span>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Register New Account */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onOpenAccountModal();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Register New Citizen Profile</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Tab Scrollbar */}
      <div className="flex md:hidden items-center gap-2 px-4 py-2 border-t border-slate-100 overflow-x-auto scrollbar-none bg-slate-50">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'services' && (activeTab === 'service_detail' || activeTab === 'autofill')) ||
            (item.id === 'applications' && activeTab === 'tracking');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold px-1 rounded-full bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default TopHeaderNavbar;
