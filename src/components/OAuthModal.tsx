import React, { useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  X,
  Building2,
  Fingerprint,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../LanguageContext';

interface OAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const OAuthModal: React.FC<OAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const { language, t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateSync = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSyncing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg border-2 border-slate-300 max-w-lg w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#0c2340] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#135ca2] flex items-center justify-center text-amber-400 font-bold border border-white/20">
              🏛️
            </div>
            <div>
              <h3 className="text-sm font-bold">{t.oauth.title}</h3>
              <p className="text-[11px] text-[#38bdf8]">
                {t.oauth.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Active Citizen Identity Profile */}
          <div className="bg-[#f0f7ff] border-2 border-[#135ca2]/20 rounded-lg p-4 flex items-start gap-3">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#135ca2]"
            />
            <div className="flex-1 truncate">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#0c2340]">
                  {language === 'HI' && userProfile.nameHindi ? userProfile.nameHindi : userProfile.name}
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                  {language === 'HI' ? 'सत्यापित' : 'Verified'}
                </span>
              </div>
              <span className="text-slate-600 block mt-0.5">{userProfile.email}</span>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
                <span>{language === 'HI' ? 'आधार:' : 'Aadhaar:'} <strong>{userProfile.aadhaarMasked}</strong></span>
                <span>{language === 'HI' ? 'पैन:' : 'PAN:'} <strong>{userProfile.panNumber}</strong></span>
              </div>
            </div>
          </div>

          {/* National Identity Authentication Authorities */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {t.oauth.connectedProviders}
            </span>

            <div className="p-3 bg-white border border-slate-200 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t.oauth.provider1Title}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {t.oauth.provider1Desc}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                {language === 'HI' ? 'सक्रिय सत्र' : 'Active Session'}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#135ca2]" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t.oauth.provider2Title}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {t.oauth.provider2Desc}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#135ca2] bg-sky-50 border border-sky-300 px-2 py-0.5 rounded">
                {language === 'HI' ? '4 प्रमाणपत्र सिंक' : '4 Certificates Synced'}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t.oauth.provider3Title}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {t.oauth.provider3Desc}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-300 px-2 py-0.5 rounded">
                {language === 'HI' ? 'कर वर्ष 2025-26 सत्यापित' : 'AY 2025-26 Validated'}
              </span>
            </div>
          </div>

          {/* Cryptographic Session Fingerprint */}
          <div className="p-3 bg-[#f8fafc] border border-slate-200 rounded text-[11px] font-mono text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span>{t.oauth.sessionTokenLabel}</span>
              <span className="text-emerald-700 font-bold">256-bit AES-GCM</span>
            </div>
            <div className="truncate text-[10px] text-slate-500 select-all">
              {userProfile.sessionTokenHash}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              onClick={handleSimulateSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#135ca2]' : ''}`} />
              <span>{isSyncing ? (language === 'HI' ? 'UIDAI सत्यापन जारी...' : 'Re-verifying UIDAI...') : t.oauth.reverifyBtn}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#0c2340] hover:bg-[#061528] text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              {t.oauth.doneBtn}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
