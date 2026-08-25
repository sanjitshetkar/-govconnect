import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  Globe,
  UploadCloud,
  Loader2,
  FileText,
  Wand2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';

export type OnboardingModalProps = {
  onComplete: (profile: Partial<UserProfile>) => void;
};

// Steps: welcome → basics → aadhaar-upload → address → financial → language → done
type Step = 'welcome' | 'basics' | 'aadhaar' | 'address' | 'financial' | 'language' | 'done';
const STEPS: Step[] = ['welcome', 'basics', 'aadhaar', 'address', 'financial', 'language', 'done'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const OCCUPATIONS = [
  'Undergraduate Student',
  'Postgraduate Student',
  'School Student (Class 10-12)',
  'Salaried Employee (Private)',
  'Salaried Employee (Government)',
  'Self-Employed / Business Owner',
  'Farmer / Agricultural Worker',
  'Daily Wage Labourer',
  'Homemaker',
  'Retired',
  'Unemployed / Job Seeker',
  'Other',
];

type OcrStatus = 'idle' | 'scanning' | 'done' | 'error';

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('welcome');
  const [form, setForm] = useState({
    name: '',
    date_of_birth: '',
    mobile: '',
    email: '',
    // filled by OCR — not typed by user
    aadhaar_masked: '',
    pan_number: '',
    address: '',
    district: '',
    state: 'Goa',
    pincode: '',
    occupation: 'Undergraduate Student',
    annual_income: '',
    language_preference: 'en' as 'en' | 'hi' | 'mr' | 'kok',
  });

  // Aadhaar OCR state
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>('idle');
  const [ocrMessage, setOcrMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const stepIdx = STEPS.indexOf(step);
  const progress = Math.round((stepIdx / (STEPS.length - 1)) * 100);

  // ── OCR: upload Aadhaar and extract fields ──────────────────
  const processAadhaarFile = async (file: File) => {
    setOcrStatus('scanning');
    setOcrMessage('Reading your Aadhaar card…');
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/documents/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: file.name,
          fileType: file.type,
          base64Data,
          docTypeHint: 'identity',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.verificationStatus === 'failed') {
        setOcrStatus('error');
        setOcrMessage(data.error || 'Could not read Aadhaar. Please upload a clear image or PDF.');
        return;
      }

      const ef = data.extractedFields || {};

      // Auto-fill whatever the OCR found — user can still edit later
      const updates: Partial<typeof form> = {};
      if (ef.fullName && !form.name) updates.name = ef.fullName;
      if (ef.dob && !form.date_of_birth) updates.date_of_birth = ef.dob;
      if (ef.address && !form.address) updates.address = ef.address;
      if (ef.customFields?.['PIN Code'] && !form.pincode) updates.pincode = ef.customFields['PIN Code'];
      if (ef.idNumber) {
        // Mask the Aadhaar number — only keep last 4
        const digits = ef.idNumber.replace(/\s/g, '');
        updates.aadhaar_masked = `\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ${digits.slice(-4)}`;
      }
      // Try to detect state from issuing authority
      if (ef.issuingAuthority) {
        const auth = ef.issuingAuthority.toLowerCase();
        if (auth.includes('goa')) updates.state = 'Goa';
        else if (auth.includes('maharashtra')) updates.state = 'Maharashtra';
        else if (auth.includes('karnataka')) updates.state = 'Karnataka';
        else if (auth.includes('delhi')) updates.state = 'Delhi';
        else if (auth.includes('kerala')) updates.state = 'Kerala';
        else if (auth.includes('tamil')) updates.state = 'Tamil Nadu';
        else if (auth.includes('andhra')) updates.state = 'Andhra Pradesh';
        else if (auth.includes('telangana')) updates.state = 'Telangana';
        else if (auth.includes('gujarat')) updates.state = 'Gujarat';
        else if (auth.includes('rajasthan')) updates.state = 'Rajasthan';
        else if (auth.includes('uttar pradesh') || auth.includes('up')) updates.state = 'Uttar Pradesh';
        else if (auth.includes('madhya pradesh') || auth.includes('mp')) updates.state = 'Madhya Pradesh';
        else if (auth.includes('punjab')) updates.state = 'Punjab';
        else if (auth.includes('haryana')) updates.state = 'Haryana';
        else if (auth.includes('bihar')) updates.state = 'Bihar';
        else if (auth.includes('odisha')) updates.state = 'Odisha';
        else if (auth.includes('assam')) updates.state = 'Assam';
      }

      setForm(prev => ({ ...prev, ...updates }));

      const filledCount = Object.keys(updates).length;
      setOcrStatus('done');
      setOcrMessage(
        filledCount > 0
          ? `\u2713 ${filledCount} field${filledCount > 1 ? 's' : ''} extracted from Aadhaar (name, DOB, address, Aadhaar number)`
          : 'Aadhaar scanned — no additional fields found. You can fill them manually below.'
      );
    } catch (err) {
      setOcrStatus('error');
      setOcrMessage('Upload failed. Please try a clearer image or PDF.');
    }
  };

  const handleFilePick = (file: File) => {
    if (!file) return;
    processAadhaarFile(file);
  };

  // ── Navigation ───────────────────────────────────────────────
  const goNext = () => {
    if (step === 'welcome') return setStep('basics');
    if (step === 'basics') return setStep('aadhaar');
    if (step === 'aadhaar') return setStep('address');
    if (step === 'address') return setStep('financial');
    if (step === 'financial') return setStep('language');
    if (step === 'language') return setStep('done');
    if (step === 'done') {
      onComplete({
        name: form.name.trim() || 'Citizen',
        date_of_birth: form.date_of_birth,
        mobile: form.mobile.startsWith('+91') ? form.mobile : `+91 ${form.mobile}`,
        email: form.email || `${(form.name || 'citizen').toLowerCase().replace(/\s+/g, '.')}@example.com`,
        aadhaar_masked: form.aadhaar_masked || '\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ****',
        pan_number: form.pan_number || undefined,
        address: form.address,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        occupation: form.occupation,
        annual_income: form.annual_income
          ? form.annual_income.startsWith('\u20b9') ? form.annual_income : `\u20b9 ${form.annual_income}`
          : '\u20b9 0',
        language_preference: form.language_preference,
        voice_assistance_enabled: true,
        notifications_enabled: true,
      });
    }
  };

  const goBack = () => {
    if (step === 'basics') setStep('welcome');
    else if (step === 'aadhaar') setStep('basics');
    else if (step === 'address') setStep('aadhaar');
    else if (step === 'financial') setStep('address');
    else if (step === 'language') setStep('financial');
    else if (step === 'done') setStep('language');
  };

  // ── Validation ───────────────────────────────────────────────
  const [attempted, setAttempted] = useState<Set<Step>>(new Set());

  const basicsErrors = {
    name: form.name.trim().length < 2 ? 'Full name is required (min 2 characters)' : '',
    mobile: form.mobile.replace(/\D/g, '').length < 10 ? 'Enter a valid 10-digit mobile number' : '',
    date_of_birth: !form.date_of_birth.trim() ? 'Date of birth is required' : '',
  };
  const isBasicsValid = !Object.values(basicsErrors).some(Boolean);

  const addressErrors = {
    address: !form.address.trim() ? 'Street address is required' : '',
    pincode: form.pincode.replace(/\D/g, '').length !== 6 ? 'Enter a valid 6-digit PIN code' : '',
  };
  const isAddressValid = !Object.values(addressErrors).some(Boolean);

  // Show errors only after user tries to continue from that step
  const showBasicsErrors = attempted.has('basics');
  const showAddressErrors = attempted.has('address');

  const tryGoNext = () => {
    if (step === 'basics') {
      setAttempted(prev => new Set([...prev, 'basics']));
      if (!isBasicsValid) return;
    }
    if (step === 'address') {
      setAttempted(prev => new Set([...prev, 'address']));
      if (!isAddressValid) return;
    }
    goNext();
  };

  // ── Step labels for progress indicator ──────────────────────
  const stepLabels: Partial<Record<Step, string>> = {
    basics: 'You',
    aadhaar: 'Aadhaar',
    address: 'Address',
    financial: 'Income',
    language: 'Language',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-indigo-950/90 to-slate-900/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Progress bar + step pills */}
        {step !== 'welcome' && step !== 'done' && (
          <div className="px-6 pt-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 justify-center mb-3">
              {(Object.entries(stepLabels) as [Step, string][]).map(([s, label], i) => {
                const idx = STEPS.indexOf(s);
                const currentIdx = STEPS.indexOf(step);
                const done = idx < currentIdx;
                const active = s === step;
                return (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      active ? 'bg-indigo-600 text-white' :
                      done ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {done && <CheckCircle2 className="w-3 h-3" />}
                      {label}
                    </div>
                    {i < Object.keys(stepLabels).length - 1 && (
                      <div className={`h-px w-4 ${done ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-5">

          {/* ── WELCOME ────────────────────────────────────────── */}
          {step === 'welcome' && (
            <div className="text-center space-y-5 py-2">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome to GovConnect
                </h1>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Set up in <span className="font-bold text-indigo-600">under 2 minutes.</span> Just
                  tell us your name and upload your Aadhaar — we'll read the rest automatically.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-center">
                {[
                  { icon: '📋', label: 'Tell us your basic details' },
                  { icon: '📄', label: 'Upload Aadhaar — auto extracts all info' },
                  { icon: '🚀', label: 'Start applying for schemes instantly' },
                ].map(f => (
                  <div key={f.label} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <p className="text-slate-600 font-medium leading-snug">{f.label}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={goNext}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Let's Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400">
                All details can be updated later in your Profile page.
              </p>
            </div>
          )}

          {/* ── STEP 1: BASIC INFO (no Aadhaar/PAN) ───────────── */}
          {step === 'basics' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Your Basic Details</h2>
                  <p className="text-xs text-slate-500">Name & contact — just 4 fields</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Rahul Mehta"
                    className={`w-full p-3 rounded-xl border focus:ring-2 bg-slate-50/50 font-medium outline-none transition-all ${
                      showBasicsErrors && basicsErrors.name
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-900 placeholder-red-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                  {showBasicsErrors && basicsErrors.name && (
                    <p className="mt-1.5 text-[10px] font-bold text-red-500">{basicsErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className={`px-3 py-3 border border-r-0 rounded-l-xl font-mono text-xs ${
                      showBasicsErrors && basicsErrors.mobile
                        ? 'bg-red-50 border-red-400 text-red-600'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>+91</span>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={e => set('mobile', e.target.value.replace('+91', '').trim())}
                      placeholder="98765 43210"
                      className={`flex-1 p-3 rounded-r-xl border focus:ring-2 bg-slate-50/50 outline-none transition-all font-mono ${
                        showBasicsErrors && basicsErrors.mobile
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-900 placeholder-red-300'
                          : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  {showBasicsErrors && basicsErrors.mobile && (
                    <p className="mt-1.5 text-[10px] font-bold text-red-500">{basicsErrors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.date_of_birth}
                    onChange={e => set('date_of_birth', e.target.value)}
                    placeholder="e.g. 14 May 2003"
                    className={`w-full p-3 rounded-xl border focus:ring-2 bg-slate-50/50 outline-none transition-all ${
                      showBasicsErrors && basicsErrors.date_of_birth
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-900 placeholder-red-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                  {showBasicsErrors && basicsErrors.date_of_birth && (
                    <p className="mt-1.5 text-[10px] font-bold text-red-500">{basicsErrors.date_of_birth}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
                <Wand2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>In the next step, upload your Aadhaar card and we'll automatically read your Aadhaar number, address, and date of birth for you.</span>
              </div>
            </div>
          )}

          {/* ── STEP 2: AADHAAR UPLOAD (OCR) ──────────────────── */}
          {step === 'aadhaar' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Upload Aadhaar Card</h2>
                  <p className="text-xs text-slate-500">We'll auto-read your number, address & DOB</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFilePick(e.target.files[0])}
              />

              {/* Drop zone */}
              {ocrStatus === 'idle' && (
                <div
                  onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    setDragActive(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleFilePick(f);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50/60'
                      : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Drag & drop your Aadhaar here, or <span className="text-indigo-600 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, or PNG — front side of card</p>
                </div>
              )}

              {/* Scanning */}
              {ocrStatus === 'scanning' && (
                <div className="py-8 text-center space-y-3">
                  <div className="relative w-14 h-14 mx-auto">
                    <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center">
                      <FileText className="w-7 h-7 text-orange-500" />
                    </div>
                    <Loader2 className="w-18 h-18 text-indigo-500 animate-spin absolute -top-2 -left-2 w-[4.5rem] h-[4.5rem]" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Scanning Aadhaar…</p>
                  <p className="text-xs text-slate-400">Extracting your name, DOB, address & Aadhaar number</p>
                </div>
              )}

              {/* Done */}
              {ocrStatus === 'done' && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold text-emerald-800">Aadhaar Scanned Successfully</p>
                      <p className="text-emerald-700 mt-0.5">{ocrMessage}</p>
                    </div>
                  </div>

                  {/* Show what was extracted, allow editing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {[
                      { label: 'Name (from Aadhaar)', key: 'name' as const, placeholder: 'Not detected' },
                      { label: 'Date of Birth', key: 'date_of_birth' as const, placeholder: 'e.g. 14 May 2003' },
                      { label: 'Aadhaar (masked)', key: 'aadhaar_masked' as const, placeholder: '•••• •••• ****', readOnly: true },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">{field.label}</label>
                        <input
                          type="text"
                          value={(form[field.key] as string) || ''}
                          onChange={e => !field.readOnly && set(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          readOnly={field.readOnly}
                          className={`w-full p-2.5 rounded-xl border font-medium outline-none transition-all ${
                            field.readOnly
                              ? 'bg-slate-50 border-slate-100 text-slate-500 font-mono cursor-default'
                              : 'bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => { setOcrStatus('idle'); setOcrMessage(''); }}
                    className="text-xs text-slate-500 hover:text-indigo-600 underline cursor-pointer"
                  >
                    Upload a different file
                  </button>
                </div>
              )}

              {/* Error */}
              {ocrStatus === 'error' && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold text-red-800">Could Not Read Aadhaar</p>
                      <p className="text-red-600 mt-0.5">{ocrMessage}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOcrStatus('idle'); setOcrMessage(''); }}
                    className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}

              <p className="text-[11px] text-slate-400 text-center">
                🔒 Your Aadhaar is processed locally — only the last 4 digits are stored. You can skip this step.
              </p>
            </div>
          )}

          {/* ── STEP 3: ADDRESS (pre-filled from OCR) ──────────── */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Residential Address</h2>
                  <p className="text-xs text-slate-500">
                    {form.address ? 'Pre-filled from your Aadhaar — review & confirm' : 'For domicile & location-specific schemes'}
                  </p>
                </div>
              </div>

              {form.address && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-700">
                  <Wand2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Address auto-filled from Aadhaar OCR. Edit if needed.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1.5">
                    House / Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                    placeholder="e.g. H.No 12, Borda, Margao"
                    className={`w-full p-3 rounded-xl border focus:ring-2 bg-slate-50/50 outline-none transition-all ${
                      showAddressErrors && addressErrors.address
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-900 placeholder-red-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                  {showAddressErrors && addressErrors.address && (
                    <p className="mt-1.5 text-[10px] font-bold text-red-500">{addressErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">District / Taluka</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e => set('district', e.target.value)}
                    placeholder="e.g. South Goa"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={form.pincode}
                    onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 403602"
                    className={`w-full p-3 rounded-xl border focus:ring-2 bg-slate-50/50 font-mono outline-none transition-all ${
                      showAddressErrors && addressErrors.pincode
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-900 placeholder-red-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                  {showAddressErrors && addressErrors.pincode && (
                    <p className="mt-1.5 text-[10px] font-bold text-red-500">{addressErrors.pincode}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1.5">State / UT</label>
                  <select
                    value={form.state}
                    onChange={e => set('state', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 outline-none transition-all cursor-pointer"
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: FINANCIAL ──────────────────────────────── */}
          {step === 'financial' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Occupation & Income</h2>
                  <p className="text-xs text-slate-500">Matches you to the right government schemes</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Your Occupation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {OCCUPATIONS.map(occ => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => set('occupation', occ)}
                        className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                          form.occupation === occ
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Annual Household Income
                    <span className="ml-1 text-[10px] font-normal text-slate-400">(for eligibility matching)</span>
                  </label>
                  <div className="flex">
                    <span className="px-3 py-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-600 font-mono text-xs">₹</span>
                    <input
                      type="text"
                      value={form.annual_income}
                      onChange={e => set('annual_income', e.target.value)}
                      placeholder="e.g. 1,80,000"
                      className="flex-1 p-3 rounded-r-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 font-mono outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: LANGUAGE ───────────────────────────────── */}
          {step === 'language' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Preferred Language</h2>
                  <p className="text-xs text-slate-500">The AI will reply in your language</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'en', label: 'English', sub: 'Default', flag: '🇬🇧' },
                  { code: 'hi', label: 'हिन्दी', sub: 'Hindi', flag: '🇮🇳' },
                  { code: 'mr', label: 'मराठी', sub: 'Marathi', flag: '🔶' },
                  { code: 'kok', label: 'कोंकणी', sub: 'Konkani', flag: '🌊' },
                ].map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => set('language_preference', l.code)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      form.language_preference === l.code
                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{l.flag}</div>
                    <div className="font-bold text-slate-900 text-sm">{l.label}</div>
                    <div className="text-[11px] text-slate-500">{l.sub}</div>
                    {form.language_preference === l.code && (
                      <div className="mt-1.5 text-[10px] font-bold text-indigo-600 uppercase">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── DONE ───────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="text-center space-y-5 py-2">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-400/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  You're all set, {form.name.split(' ')[0] || 'Citizen'}! 🎉
                </h2>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  GovConnect knows your details and will auto-fill every government form.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="font-bold text-slate-600 text-[10px] uppercase tracking-wider mb-2">Profile Summary</div>
                {[
                  { label: 'Name', value: form.name || '—' },
                  { label: 'Mobile', value: `+91 ${form.mobile || '—'}` },
                  { label: 'Aadhaar', value: form.aadhaar_masked || 'Not scanned' },
                  { label: 'State', value: form.state },
                  { label: 'Occupation', value: form.occupation },
                  { label: 'Annual Income', value: form.annual_income ? `₹ ${form.annual_income}` : '—', highlight: true },
                  { label: 'Language', value: form.language_preference.toUpperCase() },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center border-b border-slate-100 pb-1.5 last:border-0">
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-bold ${(row as any).highlight ? 'text-emerald-700' : 'text-slate-800'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NAV BUTTONS ────────────────────────────────────── */}
          {step !== 'welcome' && (
            <div className={`flex items-center gap-3 pt-1 ${step === 'done' ? 'justify-center' : 'justify-between'}`}>
              {step !== 'done' && (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

              <div className="flex items-center gap-2">
                {/* Skip Aadhaar option */}
                {step === 'aadhaar' && ocrStatus === 'idle' && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer transition-all"
                  >
                    Skip for now
                  </button>
                )}

                <button
                  type="button"
                  onClick={tryGoNext}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    step === 'done'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 px-10 py-3 text-sm rounded-2xl'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                  }`}
                >
                  <span>
                    {step === 'done' ? '🚀 Enter GovConnect' :
                     step === 'language' ? 'Review Profile' :
                     step === 'aadhaar' && ocrStatus === 'done' ? 'Confirm & Continue' :
                     'Continue'}
                  </span>
                  {step !== 'done' && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
