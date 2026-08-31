import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type AuthPageProps = {
  onAuthSuccess: (email: string, password: string, mode: 'login' | 'signup', name?: string, mobile?: string) => Promise<void>;
  authError: string | null;
  authLoading: boolean;
};

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, authError, authLoading }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const updateField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!form.email.trim() || !form.password.trim()) {
      setLocalError('Email and password are required.');
      return;
    }

    if (mode === 'signup') {
      if (!form.name.trim()) {
        setLocalError('Full name is required.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      if (form.password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
    }

    await onAuthSuccess(form.email.trim(), form.password, mode, form.name.trim() || undefined, form.mobile.trim() || undefined);
  };

  const displayError = localError || authError;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e1b4b 100%)',
      }}
    >
      {/* Animated background orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }}
      />

      {/* India flag tricolor top strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-50" style={{
        background: 'linear-gradient(90deg, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%)',
      }} />

      {/* Main Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '28px',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          padding: '40px',
        }}
      >
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
            }}
          >
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <span className="text-2xl font-extrabold text-white tracking-tight">GovConnect</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(99, 102, 241, 0.3)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)' }}
              >
                जनसेवा AI
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: 'rgba(165, 180, 252, 0.7)' }}>
              National Single-Window Citizen Gateway
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex rounded-2xl p-1 mb-8"
          style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {(['login', 'signup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setLocalError(''); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
              style={
                mode === tab
                  ? {
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    }
                  : { color: 'rgba(165, 180, 252, 0.6)', background: 'transparent' }
              }
            >
              {tab === 'login' ? '🔐 Sign In' : '✨ Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(99, 102, 241, 0.7)' }} />
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="Sanjit Shetkar"
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white placeholder-indigo-300/40 outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.8)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(99, 102, 241, 0.7)' }} />
              <input
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder="citizen@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white placeholder-indigo-300/40 outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.8)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(99, 102, 241, 0.7)' }} />
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={updateField('mobile')}
                  placeholder="+91 98221 XXXXX"
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white placeholder-indigo-300/40 outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.8)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(99, 102, 241, 0.7)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={updateField('password')}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full pl-10 pr-12 py-3 rounded-2xl text-sm text-white placeholder-indigo-300/40 outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.8)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'rgba(99, 102, 241, 0.6)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(99, 102, 241, 0.7)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white placeholder-indigo-300/40 outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: form.confirmPassword && form.password !== form.confirmPassword
                      ? '1px solid rgba(239, 68, 68, 0.6)'
                      : form.confirmPassword && form.password === form.confirmPassword
                      ? '1px solid rgba(34, 197, 94, 0.6)'
                      : '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(99, 102, 241, 0.8)')}
                  onBlur={(e) => {
                    if (form.confirmPassword && form.password !== form.confirmPassword) {
                      e.target.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                    } else if (form.confirmPassword && form.password === form.confirmPassword) {
                      e.target.style.borderColor = 'rgba(34, 197, 94, 0.6)';
                    } else {
                      e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                    }
                  }}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                )}
              </div>
            </div>
          )}

          {/* Error message */}
          {displayError && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-2xl text-xs"
              style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{displayError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mt-2"
            style={{
              background: authLoading
                ? 'rgba(99, 102, 241, 0.5)'
                : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: authLoading ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.4)',
              transform: authLoading ? 'none' : undefined,
            }}
            onMouseEnter={(e) => {
              if (!authLoading) (e.currentTarget.style.transform = 'translateY(-1px)');
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.transform = 'none');
            }}
          >
            {authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <>
                <span>Sign In to GovConnect</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create My Citizen Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px]" style={{ color: 'rgba(165, 180, 252, 0.4)' }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secured by Supabase Auth · Government-grade encryption</span>
        </div>

        {/* Feature Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {['1-Click Scheme Filing', 'DigiLocker Vault', 'AI Eligibility Check', 'Zero Paperwork'].map((feat) => (
            <span
              key={feat}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'rgba(165, 180, 252, 0.7)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              {feat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
