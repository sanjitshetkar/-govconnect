import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  Building2,
  Smartphone,
  Fingerprint,
  User,
  Mail,
  Calendar,
  MapPin,
  FileCheck2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Check,
  UserPlus,
  LogIn,
  Layers,
  Landmark,
} from 'lucide-react';
import { UserProfile, CitizenRegistrationData, UploadedDocument } from '../types';
import { DEMO_CITIZEN_PROFILES } from '../mockData';
import { useLanguage } from '../LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  onRegistrationComplete?: (newProfile: UserProfile, newDocs?: UploadedDocument[]) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  userProfile,
  setUserProfile,
  isAuthenticated,
  setIsAuthenticated,
  onRegistrationComplete,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialMode);
  
  // Login State
  const [loginMethod, setLoginMethod] = useState<'aadhaar_otp' | 'digilocker_pin' | 'username_pwd'>('aadhaar_otp');
  const [loginAadhaar, setLoginAadhaar] = useState('8849-2041-8421');
  const [loginMobile, setLoginMobile] = useState('9820155492');
  const [loginPin, setLoginPin] = useState('123456');
  const [loginUsername, setLoginUsername] = useState('khorjuvekarshivang@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);

  // Signup State
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [regData, setRegData] = useState<CitizenRegistrationData>({
    name: '',
    hindiName: '',
    aadhaarNumber: '',
    dob: '1998-05-15',
    gender: 'Male',
    phone: '',
    email: '',
    panNumber: '',
    primaryAddress: '',
    cityOrDistrict: '',
    stateOrUT: 'Maharashtra',
    pincode: '',
    occupation: 'Entrepreneur / Startup Founder',
    mpin: '123456',
    consentAccepted: true,
  });

  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupOtpCountdown, setSignupOtpCountdown] = useState(0);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setLoginSuccessMsg(null);
      setLoginErrorMsg(null);
    }
  }, [isOpen, initialMode]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (signupOtpCountdown > 0) {
      timer = setTimeout(() => setSignupOtpCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [signupOtpCountdown]);

  if (!isOpen) return null;

  // Handles Aadhaar OTP Send
  const handleSendLoginOtp = () => {
    setOtpSent(true);
    setOtpCountdown(30);
    setEnteredOtp('123456'); // Pre-fill for seamless demonstration
  };

  // Handles Login Submission
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setLoginErrorMsg(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Try finding matching demo citizen or use default
    let matchedProfile = DEMO_CITIZEN_PROFILES[0];
    if (loginMethod === 'username_pwd' && loginUsername) {
      const found = DEMO_CITIZEN_PROFILES.find(
        (p) => p.email.toLowerCase() === loginUsername.toLowerCase()
      );
      if (found) matchedProfile = found;
    }

    setUserProfile(matchedProfile);
    setIsAuthenticated(true);
    setIsSubmitting(false);
    setLoginSuccessMsg(
      language === 'HI'
        ? `मेरी पहचान के माध्यम से ${matchedProfile.hindiName || matchedProfile.name} के रूप में सफलतापूर्वक प्रमाणीकृत!`
        : `Authenticated successfully via MeriPehchaan as ${matchedProfile.name}`
    );

    setTimeout(() => {
      onClose();
    }, 900);
  };

  // Quick Demo Account Switch
  const handleQuickDemoLogin = async (profile: UserProfile) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUserProfile(profile);
    setIsAuthenticated(true);
    setIsSubmitting(false);
    setLoginSuccessMsg(
      language === 'HI'
        ? `${profile.hindiName || profile.name} के रूप में साइन इन हुआ`
        : `Logged in as ${profile.name} (${profile.occupation || profile.stateOrUT})`
    );

    setTimeout(() => {
      onClose();
    }, 700);
  };

  // Signup Aadhaar OTP
  const handleSendSignupOtp = () => {
    if (!regData.aadhaarNumber || regData.aadhaarNumber.length < 12) {
      setLoginErrorMsg(
        language === 'HI'
          ? 'कृपया एक मान्य 12-अंकीय आधार संख्या दर्ज करें'
          : 'Please enter a valid 12-digit Aadhaar Number'
      );
      return;
    }
    setSignupOtpSent(true);
    setSignupOtpCountdown(30);
    setSignupOtp('123456'); // Pre-fill for quick testing
    setLoginErrorMsg(null);
  };

  const handleVerifySignupOtp = () => {
    if (signupOtp === '123456' || signupOtp.length === 6) {
      setIsAadhaarVerified(true);
      setSignupStep(2);
    } else {
      setLoginErrorMsg(
        language === 'HI'
          ? 'अमान्य आधार ओटीपी। कृपया नमूना कोड 123456 का उपयोग करें'
          : 'Invalid Aadhaar OTP. Please use sample code 123456'
      );
    }
  };

  // Final Registration Submission
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.phone) {
      setLoginErrorMsg(
        language === 'HI'
          ? 'कृपया सभी अनिवार्य फ़ील्ड भरें।'
          : 'Please complete all mandatory citizen fields.'
      );
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newId = `usr-digilocker-${Date.now().toString().slice(-4)}`;
    const maskedAadhaar = regData.aadhaarNumber.length >= 4 
      ? `XXXX-XXXX-${regData.aadhaarNumber.slice(-4)}`
      : 'XXXX-XXXX-8421';

    const newProfile: UserProfile = {
      id: newId,
      name: regData.name,
      hindiName: regData.hindiName || regData.name,
      email: regData.email,
      aadhaarMasked: maskedAadhaar,
      panNumber: regData.panNumber ? regData.panNumber.toUpperCase() : 'ABCDE1234F',
      phone: regData.phone.startsWith('+91') ? regData.phone : `+91 ${regData.phone}`,
      avatarUrl: `https://images.unsplash.com/photo-${regData.gender === 'Female' ? '1544005313-94ddf0286df2' : '1534528741775-53994a69daeb'}?w=150&auto=format&fit=crop&q=80`,
      assuranceLevel: 'MeriPehchaan (Level 3 - Aadhaar e-KYC)',
      authMethod: 'MeriPehchaan NSSO',
      sessionTokenHash: `sha256:${Math.random().toString(36).substring(2)}${Date.now()}`,
      storageUsedBytes: 1.4 * 1024 * 1024,
      storageQuotaBytes: 1024 * 1024 * 1024,
      provider: 'MeriPehchaan (National SSO)',
      is2FAEnabled: true,
      stateOrUT: regData.stateOrUT,
      cityOrDistrict: regData.cityOrDistrict || 'Pune',
      primaryAddress: regData.primaryAddress || 'Station Road',
      pincode: regData.pincode || '411001',
      dateOfBirth: regData.dob,
      gender: regData.gender,
      occupation: regData.occupation,
      digiLockerDocCount: 2,
    };

    // Auto-create initial Aadhaar document
    const initialAadhaarDoc: UploadedDocument = {
      id: `doc-aadhaar-${Date.now()}`,
      name: `Aadhaar_${newProfile.name.replace(/\s+/g, '_')}_UIDAI.pdf`,
      originalName: `Aadhaar_${newProfile.name.replace(/\s+/g, '_')}_UIDAI.pdf`,
      fileType: 'application/pdf',
      size: 1450000,
      uploadDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      isEncrypted: true,
      encryptionAlgorithm: 'AES-256-GCM',
      sha256Hash: '9f83c14298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      docType: 'Aadhaar Card (UIDAI Verified)',
      confidenceScore: 99.9,
      verificationStatus: 'verified',
      digiLockerIssuer: 'Unique Identification Authority of India (UIDAI)',
      itActSection65BVerified: true,
      summary: `Official DigiLocker-pulled digital Aadhaar for ${newProfile.name}. Level 3 Biometric e-KYC Certified.`,
      extractedFields: {
        fullName: newProfile.name,
        dob: newProfile.dateOfBirth,
        idNumber: newProfile.aadhaarMasked,
        address: `${newProfile.primaryAddress}, ${newProfile.cityOrDistrict}, ${newProfile.stateOrUT} - ${newProfile.pincode}`,
      },
      securityVerification: {
        tamperDetected: false,
        readableQuality: 'High',
        notes: 'DigiLocker PKI e-Sign validated against UIDAI Public Root Certificate.',
      },
    };

    setUserProfile(newProfile);
    setIsAuthenticated(true);
    if (onRegistrationComplete) {
      onRegistrationComplete(newProfile, [initialAadhaarDoc]);
    }

    setIsSubmitting(false);
    setSignupStep(3);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-xl border-2 border-slate-300 max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Government Header */}
        <div className="bg-[#0c2340] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#135ca2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#135ca2] flex flex-col items-center justify-center text-amber-400 font-bold border border-white/20 shadow-xs">
              <span className="text-lg leading-none">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#f59e0b] uppercase">
                  {t.auth.govOfIndiaHeader}
                </span>
                <span className="text-[9px] font-mono bg-emerald-900/80 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40">
                  {t.auth.meriPehchaanSSO}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                {activeTab === 'login' ? t.auth.modalTitleLogin : t.auth.modalTitleSignup}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Login vs Sign Up) */}
        <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            id="tab-btn-citizen-login"
            onClick={() => {
              setActiveTab('login');
              setLoginErrorMsg(null);
            }}
            className={`py-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#0c2340] border-[#135ca2] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <LogIn className="w-4 h-4 text-[#135ca2]" />
            <span>{t.auth.citizenSignInTab}</span>
          </button>

          <button
            id="tab-btn-citizen-signup"
            onClick={() => {
              setActiveTab('signup');
              setLoginErrorMsg(null);
            }}
            className={`py-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-[#0c2340] border-[#135ca2] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-700" />
            <span>{t.auth.citizenSignUpTab}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          
          {/* Notification Messages */}
          {loginSuccessMsg && (
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded-r text-xs text-emerald-950 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-semibold">{loginSuccessMsg}</span>
            </div>
          )}

          {loginErrorMsg && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r text-xs text-red-950 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{loginErrorMsg}</span>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: CITIZEN LOGIN TAB
             ========================================================================= */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              
              {/* Method Selection Chips */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  {t.auth.selectAuthMethod}:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('aadhaar_otp')}
                    className={`p-2.5 rounded-lg border-2 text-center transition-all cursor-pointer ${
                      loginMethod === 'aadhaar_otp'
                        ? 'border-[#135ca2] bg-[#f0f7ff] text-[#0c2340] font-bold ring-1 ring-[#135ca2]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Fingerprint className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                    <span className="block text-[11px] leading-tight">{t.auth.methodAadhaarOtp}</span>
                    <span className="text-[9px] text-slate-500 font-normal">{t.auth.subAadhaarOtp}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('digilocker_pin')}
                    className={`p-2.5 rounded-lg border-2 text-center transition-all cursor-pointer ${
                      loginMethod === 'digilocker_pin'
                        ? 'border-[#135ca2] bg-[#f0f7ff] text-[#0c2340] font-bold ring-1 ring-[#135ca2]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#135ca2]" />
                    <span className="block text-[11px] leading-tight">{t.auth.methodDigiPin}</span>
                    <span className="text-[9px] text-slate-500 font-normal">{t.auth.subDigiPin}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('username_pwd')}
                    className={`p-2.5 rounded-lg border-2 text-center transition-all cursor-pointer ${
                      loginMethod === 'username_pwd'
                        ? 'border-[#135ca2] bg-[#f0f7ff] text-[#0c2340] font-bold ring-1 ring-[#135ca2]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1 text-indigo-700" />
                    <span className="block text-[11px] leading-tight">{t.auth.methodEPramaan}</span>
                    <span className="text-[9px] text-slate-500 font-normal">{t.auth.subEPramaan}</span>
                  </button>
                </div>
              </div>

              {/* Login Form Fields */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-1">
                
                {/* Method 1: Aadhaar OTP */}
                {loginMethod === 'aadhaar_otp' && (
                  <div className="space-y-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          {t.auth.aadhaarNumberLabel}:
                        </label>
                        <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          UIDAI Level 3
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={loginAadhaar}
                          onChange={(e) => setLoginAadhaar(e.target.value)}
                          placeholder="XXXX-XXXX-XXXX"
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md font-mono text-xs text-slate-900 bg-white focus:ring-2 focus:ring-[#135ca2]"
                          required
                        />
                        <Fingerprint className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendLoginOtp}
                        className="w-full py-2.5 bg-[#135ca2] hover:bg-[#0b3c6d] text-white font-bold rounded-md transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{t.auth.getAadhaarOtp}</span>
                      </button>
                    ) : (
                      <div className="space-y-2 pt-1 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">
                            {t.auth.enterOtpLabel}:
                          </label>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {otpCountdown > 0 ? (language === 'HI' ? `${otpCountdown}s में पुनः भेजें` : `Resend in ${otpCountdown}s`) : (language === 'HI' ? 'ओटीपी समाप्त' : 'OTP Expired')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder="123456"
                            className="flex-1 px-3 py-2 border-2 border-[#135ca2] rounded-md font-mono text-sm tracking-widest text-center text-slate-900 font-bold bg-white"
                            required
                          />
                          {otpCountdown === 0 && (
                            <button
                              type="button"
                              onClick={handleSendLoginOtp}
                              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold text-[11px]"
                            >
                              {t.auth.resendOtp}
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-emerald-700 italic">
                          * {t.auth.testOtpNote}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Method 2: DigiLocker PIN */}
                {loginMethod === 'digilocker_pin' && (
                  <div className="space-y-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.registeredMobileLabel}:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value)}
                          placeholder="+91 98201 55492"
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                          required
                        />
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          {t.auth.digiPinLabel}:
                        </label>
                        <span className="text-[10px] text-[#135ca2] hover:underline cursor-pointer">
                          {t.auth.forgotPin}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          maxLength={6}
                          value={loginPin}
                          onChange={(e) => setLoginPin(e.target.value)}
                          placeholder="••••••"
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md font-mono text-xs text-slate-900 bg-white"
                          required
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 3: Username & Password */}
                {loginMethod === 'username_pwd' && (
                  <div className="space-y-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.citizenEmailLabel}:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          placeholder="citizen@gov.in"
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                          required
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.passwordLabel}:
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                          required
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Statutory Consent Box */}
                <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    id="login-consent"
                    defaultChecked
                    className="w-3.5 h-3.5 text-[#135ca2] rounded border-slate-300 mt-0.5"
                  />
                  <label htmlFor="login-consent" className="cursor-pointer">
                    {t.auth.dpdpConsentNote}
                  </label>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || (loginMethod === 'aadhaar_otp' && !otpSent)}
                  className="w-full py-2.5 bg-[#0c2340] hover:bg-[#061528] disabled:opacity-50 text-white font-bold rounded-md transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{isSubmitting ? (language === 'HI' ? 'यूआईडीएआई प्रमाणीकरण जारी...' : 'Authenticating UIDAI...') : t.auth.signInWithMeriPehchaan}</span>
                </button>
              </form>

              {/* Quick Demo Citizen Profiles */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  {t.auth.quickDemoAccounts}:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_CITIZEN_PROFILES.map((p) => {
                    const isCurrent = userProfile.id === p.id && isAuthenticated;
                    const displayName = language === 'HI' && p.hindiName ? p.hindiName : p.name;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(p)}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-white hover:border-[#135ca2] hover:bg-[#f0f7ff]'
                        }`}
                      >
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                        />
                        <div className="flex-1 truncate">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {displayName}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                                {t.auth.activeLabel}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {p.occupation || p.stateOrUT}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 2: NEW CITIZEN SIGN UP / REGISTRATION TAB
             ========================================================================= */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
              
              {/* Stepper Header */}
              <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className={`flex items-center gap-1.5 ${signupStep >= 1 ? 'text-[#135ca2] font-bold' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${signupStep >= 1 ? 'bg-[#135ca2] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    1
                  </span>
                  <span>{t.auth.step1}</span>
                </div>
                <div className="h-0.5 w-6 bg-slate-200" />
                <div className={`flex items-center gap-1.5 ${signupStep >= 2 ? 'text-[#135ca2] font-bold' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${signupStep >= 2 ? 'bg-[#135ca2] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    2
                  </span>
                  <span>{t.auth.step2}</span>
                </div>
                <div className="h-0.5 w-6 bg-slate-200" />
                <div className={`flex items-center gap-1.5 ${signupStep >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${signupStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    3
                  </span>
                  <span>{t.auth.step3}</span>
                </div>
              </div>

              {/* Step 1: Aadhaar Validation */}
              {signupStep === 1 && (
                <div className="space-y-3.5">
                  <div className="bg-[#f0f7ff] border border-[#135ca2]/30 rounded-lg p-3 text-[11px] text-[#0c2340]">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-[#135ca2]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t.auth.uidaiLevel3Verification}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {t.auth.everyCitizenRepositoryNote}
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t.auth.aadhaar12DigitLabel}: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={regData.aadhaarNumber}
                      onChange={(e) => setRegData({ ...regData, aadhaarNumber: e.target.value })}
                      placeholder="e.g. 5421 9840 3128"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-xs text-slate-900 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.fullLegalNameLabel}: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regData.name}
                        onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.nameInHindiLabel}:
                      </label>
                      <input
                        type="text"
                        value={regData.hindiName}
                        onChange={(e) => setRegData({ ...regData, hindiName: e.target.value })}
                        placeholder="उदा. राहुल शर्मा"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.dobLabel}:
                      </label>
                      <input
                        type="date"
                        value={regData.dob}
                        onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.genderLabel}:
                      </label>
                      <select
                        value={regData.gender}
                        onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                      >
                        <option value="Male">{t.auth.genderMale}</option>
                        <option value="Female">{t.auth.genderFemale}</option>
                        <option value="Transgender">{t.auth.genderTrans}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.mobileLabel}: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={regData.phone}
                        onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                        placeholder="98201XXXXX"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Aadhaar OTP Verification Card */}
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-3 space-y-2">
                    {!signupOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSendSignupOtp}
                        className="w-full py-2 bg-[#135ca2] hover:bg-[#0b3c6d] text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{t.auth.sendUidaiOtp}</span>
                      </button>
                    ) : (
                      <div className="space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800">
                            {t.auth.enterAadhaarOtpReceived}:
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {signupOtpCountdown > 0 ? `${signupOtpCountdown}s` : (language === 'HI' ? 'समाप्त' : 'Expired')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={signupOtp}
                            onChange={(e) => setSignupOtp(e.target.value)}
                            placeholder="123456"
                            className="flex-1 px-3 py-1.5 border-2 border-emerald-600 rounded font-mono text-sm tracking-widest text-center text-slate-900 font-bold bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleVerifySignupOtp}
                            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                          >
                            {t.auth.verifyAndNext} →
                          </button>
                        </div>
                        <p className="text-[10px] text-emerald-700 italic">
                          * {t.auth.testOtpNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Domicile, Tax & Security Profile */}
              {signupStep === 2 && (
                <form onSubmit={handleCompleteRegistration} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t.auth.emailOfficialLabel}: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="citizen@domain.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.stateUtDomicileLabel}: <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={regData.stateOrUT}
                        onChange={(e) => setRegData({ ...regData, stateOrUT: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white font-medium"
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.districtCityLabel}:
                      </label>
                      <input
                        type="text"
                        value={regData.cityOrDistrict}
                        onChange={(e) => setRegData({ ...regData, cityOrDistrict: e.target.value })}
                        placeholder="e.g. Pune / New Delhi"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.permanentAddressLabel}:
                      </label>
                      <input
                        type="text"
                        value={regData.primaryAddress}
                        onChange={(e) => setRegData({ ...regData, primaryAddress: e.target.value })}
                        placeholder="House / Street / Locality"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.pinCodeLabel}:
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={regData.pincode}
                        onChange={(e) => setRegData({ ...regData, pincode: e.target.value })}
                        placeholder="411001"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.panCardOptionalLabel}:
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={regData.panNumber}
                        onChange={(e) => setRegData({ ...regData, panNumber: e.target.value.toUpperCase() })}
                        placeholder="ABCDE1234F"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-mono uppercase text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {t.auth.occupationLabel}:
                      </label>
                      <select
                        value={regData.occupation}
                        onChange={(e) => setRegData({ ...regData, occupation: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white"
                      >
                        <option value="Entrepreneur / Startup Founder">{language === 'HI' ? 'उद्यमी / स्टार्टअप संस्थापक' : 'Entrepreneur / Startup Founder'}</option>
                        <option value="MSME Industrialist">{language === 'HI' ? 'एमएसएमई उद्योगपति' : 'MSME Industrialist'}</option>
                        <option value="Academic Researcher / Scientist">{language === 'HI' ? 'शोधकर्ता / वैज्ञानिक' : 'Academic Researcher / Scientist'}</option>
                        <option value="Rural Artisan / SHG Leader">{language === 'HI' ? 'ग्रामीण कारीगर / एसएचजी प्रमुख' : 'Rural Artisan / SHG Leader'}</option>
                        <option value="Farmer / Agriculture Producer">{language === 'HI' ? 'किसान / कृषि उत्पादक' : 'Farmer / Agriculture Producer'}</option>
                        <option value="Salaried Citizen / Professional">{language === 'HI' ? 'वेतनभोगी / पेशेवर नागरिक' : 'Salaried Citizen / Professional'}</option>
                        <option value="Student / Scholar">{language === 'HI' ? 'छात्र / शोधार्थी' : 'Student / Scholar'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Create 6-digit MPIN */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t.auth.createMpinLabel}: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={regData.mpin}
                      onChange={(e) => setRegData({ ...regData, mpin: e.target.value })}
                      placeholder="••••••"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-xs text-slate-900 bg-white"
                      required
                    />
                  </div>

                  {/* Consents */}
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600">
                    <input
                      type="checkbox"
                      id="reg-consent"
                      checked={regData.consentAccepted}
                      onChange={(e) => setRegData({ ...regData, consentAccepted: e.target.checked })}
                      className="w-3.5 h-3.5 text-[#135ca2] rounded border-slate-300 mt-0.5"
                    />
                    <label htmlFor="reg-consent" className="cursor-pointer">
                      {t.auth.regConsentNote}
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-3 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      ← {t.auth.backBtn}
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !regData.consentAccepted}
                      className="px-5 py-2 bg-[#135ca2] hover:bg-[#0b3c6d] disabled:opacity-50 text-white rounded text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                      )}
                      <span>{isSubmitting ? (language === 'HI' ? 'पंजीकरण हो रहा है...' : 'Registering Citizen...') : t.auth.completeEkycBtn}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Confirmation */}
              {signupStep === 3 && (
                <div className="text-center py-6 space-y-3 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {t.auth.vaultInitialized}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    {t.auth.vaultInitializedSub}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Security Note */}
        <div className="bg-[#f8fafc] border-t border-slate-200 px-6 py-2.5 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-700" />
            <span>{t.auth.encryptionFooter}</span>
          </span>
          <span className="font-mono">{t.auth.itActFooter}</span>
        </div>

      </div>
    </div>
  );
};
