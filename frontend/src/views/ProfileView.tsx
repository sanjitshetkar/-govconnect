import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  MapPin,
  Settings,
  Globe,
  Mic,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Wand2,
  Sparkles,
} from 'lucide-react';
import { UserProfile, DocumentItem } from '../types';
import PageHeader from '../components/PageHeader';
import { LanguageCode } from '../components/LanguageSelector';

export type ProfileViewProps = {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  documents?: DocumentItem[];
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  setUserProfile,
  currentLanguage,
  onLanguageChange,
  documents = [],
}) => {
  const [profileData, setProfileData] = useState<UserProfile>({ ...userProfile });
  const [isSaved, setIsSaved] = useState(false);
  const [autoFillBanner, setAutoFillBanner] = useState<string | null>(null);

  // Auto-fill profile fields from uploaded document extracted_fields
  const handleAutoFillFromDocs = () => {
    const docsWithFields = documents.filter((d) => d.extracted_fields && Object.keys(d.extracted_fields).length > 0);
    if (docsWithFields.length === 0) {
      setAutoFillBanner('No extracted fields found in your uploaded documents. Upload an Aadhaar or Income Certificate first.');
      setTimeout(() => setAutoFillBanner(null), 4000);
      return;
    }

    // Merge all extracted fields from all docs
    const merged: Record<string, string> = {};
    docsWithFields.forEach((d) => {
      if (d.extracted_fields) Object.assign(merged, d.extracted_fields);
    });

    const updates: Partial<UserProfile> = {};
    if (merged['Full Name'] && !profileData.name) updates.name = merged['Full Name'];
    if (merged['Date of Birth'] && !profileData.date_of_birth) updates.date_of_birth = merged['Date of Birth'];
    if (merged['Address'] && !profileData.address) updates.address = merged['Address'];
    if (merged['Income'] && !profileData.annual_income) updates.annual_income = merged['Income'];
    if (merged['PIN Code'] && !profileData.pincode) updates.pincode = merged['PIN Code'];
    if (merged['Issuing Authority']) {
      // Try to extract state from issuing authority
      const authorityLower = merged['Issuing Authority'].toLowerCase();
      if (authorityLower.includes('goa')) updates.state = 'Goa';
      else if (authorityLower.includes('maharashtra')) updates.state = 'Maharashtra';
      else if (authorityLower.includes('karnataka')) updates.state = 'Karnataka';
    }

    const filledCount = Object.keys(updates).length;
    if (filledCount > 0) {
      setProfileData((prev) => ({ ...prev, ...updates }));
      setAutoFillBanner(`✓ Auto-filled ${filledCount} field${filledCount > 1 ? 's' : ''} from your uploaded documents!`);
    } else {
      setAutoFillBanner('All matching fields are already filled in.');
    }
    setTimeout(() => setAutoFillBanner(null), 4000);
  };

  const handleChange = (key: keyof UserProfile, val: any) => {
    setProfileData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(profileData);
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
    } catch (err) {
      console.warn('Local save only:', err);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      <PageHeader
        badge="Citizen Identity"
        title="Citizen Profile &amp; Preferences"
        subtitle="Manage your personal information, address, and accessibility preferences. Auto-synced across all scheme filings."
      />

      {/* Auto-fill banner */}
      {autoFillBanner && (
        <div className={`px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 ${
          autoFillBanner.startsWith('✓')
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border border-amber-200 text-amber-800'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0" />
          {autoFillBanner}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-500/20">
              {profileData.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {profileData.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  UIDAI Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {profileData.occupation} • {profileData.district}, {profileData.state}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-mono text-slate-600 space-y-1">
              <div>Aadhaar: <strong>{profileData.aadhaar_masked}</strong></div>
              <div>PAN: <strong>{profileData.pan_number}</strong></div>
            </div>
            {documents.length > 0 && (
              <button
                type="button"
                onClick={handleAutoFillFromDocs}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Auto-fill from Documents ({documents.length})
              </button>
            )}
          </div>
        </div>

        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Full Name (as on Aadhaar)
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Date of Birth
              </label>
              <input
                type="text"
                value={profileData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Mobile Number
              </label>
              <input
                type="text"
                value={profileData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Occupation / Student Status
              </label>
              <input
                type="text"
                value={profileData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Declared Annual Family Income
              </label>
              <input
                type="text"
                value={profileData.annual_income}
                onChange={(e) => handleChange('annual_income', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50 font-mono font-semibold text-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PERMANENT ADDRESS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Residential &amp; Domicile Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1.5">
                House / Street Address
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                District / Taluka
              </label>
              <input
                type="text"
                value={profileData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                State / UT
              </label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: ACCESSIBILITY & PREFERENCES */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            App Preferences &amp; Accessibility
          </h3>

          <div className="space-y-4 text-xs">
            {/* Language Preference */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    Preferred Language
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Supports English, Hindi, Marathi, and Konkani
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'kok', label: 'कोंकणी' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      handleChange('language_preference', l.code);
                      onLanguageChange(l.code as any);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      currentLanguage === l.code
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Assistance */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    Voice Assistance &amp; Read Aloud
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Enable Web Speech API for voice dictation and screen audio readout
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={profileData.voice_assistance_enabled}
                onChange={(e) =>
                  handleChange('voice_assistance_enabled', e.target.checked)
                }
                className="w-5 h-5 text-indigo-600 rounded-md cursor-pointer"
              />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    Statutory Expiry Alerts &amp; Status Updates
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Receive gentle reminders 30 days before document and certificate renewal deadlines
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={profileData.notifications_enabled}
                onChange={(e) =>
                  handleChange('notifications_enabled', e.target.checked)
                }
                className="w-5 h-5 text-indigo-600 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? '✓ Profile Saved Successfully' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileView;
