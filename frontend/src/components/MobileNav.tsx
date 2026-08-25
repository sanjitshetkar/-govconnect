import React, { useState } from 'react';
import {
  LayoutDashboard,
  MessageSquareText,
  Compass,
  FolderLock,
  FileCheck2,
  Bell,
  User,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { NavTab, UserProfile } from '../types';
import LanguageSelector, { LanguageCode } from './LanguageSelector';

export type MobileNavProps = {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  unreadAlertsCount?: number;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
};

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  unreadAlertsCount = 2,
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const bottomNavItems = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'assistant' as NavTab, label: 'Assistant', icon: MessageSquareText },
    { id: 'services' as NavTab, label: 'Explore', icon: Compass },
    { id: 'documents' as NavTab, label: 'Docs', icon: FolderLock },
    { id: 'applications' as NavTab, label: 'Apps', icon: FileCheck2 },
  ];

  const drawerItems = [
    { id: 'dashboard' as NavTab, label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'assistant' as NavTab, label: 'AI Navigator Assistant', icon: MessageSquareText },
    { id: 'services' as NavTab, label: 'Explore All Government Services', icon: Compass },
    { id: 'documents' as NavTab, label: 'My Document Vault', icon: FolderLock },
    { id: 'applications' as NavTab, label: 'My Applications', icon: FileCheck2 },
    { id: 'alerts' as NavTab, label: 'Alerts & Deadlines', icon: Bell, badgeCount: unreadAlertsCount },
    { id: 'profile' as NavTab, label: 'Citizen Profile & Preferences', icon: User },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            Gov<span className="text-indigo-600">Connect</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Drawer Overlay Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-t-3xl border-t border-slate-200 p-6 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {userProfile.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 block">
                    {userProfile.name}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    KYC Verified
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badgeCount && item.badgeCount > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                        {item.badgeCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar for Quick Mobile Access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'applications' && (activeTab === 'tracking' || activeTab === 'autofill')) ||
            (item.id === 'services' && activeTab === 'service_detail');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default MobileNav;
