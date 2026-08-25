import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  User,
  Users,
} from 'lucide-react';
import { UserProfile } from '../types';
import Modal from './Modal';

export type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: UserProfile) => void;
  existingUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  currentUser: UserProfile;
};

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
  existingUsers,
  onSwitchUser,
  currentUser,
}) => {
  const [mode, setMode] = useState<'create' | 'switch'>('create');
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    mobile: '',
    email: '',
    aadhaar_number: '',
    pan_number: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
    occupation: 'Undergraduate Student / Citizen',
    annual_income: '₹ 2,00,000',
    language_preference: 'en' as const,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert('Please provide your Full Name and Mobile number');
      return;
    }

    setIsSubmitting(true);
    const maskedAadhaar = formData.aadhaar_number
      ? `•••• •••• ${formData.aadhaar_number.slice(-4)}`
      : '•••• •••• ' + Math.floor(1000 + Math.random() * 9000);

    const newUser: UserProfile = {
      user_id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      date_of_birth: formData.date_of_birth || '14 May 2003',
      mobile: formData.mobile.startsWith('+91') ? formData.mobile : `+91 ${formData.mobile}`,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: formData.address || 'H.No 12, Main Street',
      district: formData.district || 'South Goa',
      state: formData.state || 'Goa',
      pincode: formData.pincode || '403601',
      aadhaar_masked: maskedAadhaar,
      pan_number: formData.pan_number || 'ABCDE1234F',
      occupation: formData.occupation,
      annual_income: formData.annual_income,
      language_preference: formData.language_preference,
      voice_assistance_enabled: true,
      notifications_enabled: true,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onUserCreated(newUser);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Citizen Account' : 'Switch Citizen Account'}
      subtitle={
        mode === 'create'
          ? 'Register a new profile with instant DigiLocker & scheme eligibility engine'
          : 'Switch between registered citizen accounts in the local database'
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Toggle Mode Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'create'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Citizen Account</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'switch'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Switch Account ({existingUsers.length})</span>
          </button>
        </div>

        {/* MODE 1: CREATE ACCOUNT */}
        {mode === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Name (as per Aadhaar) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98221 12345"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 May 2003"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. priya.sharma@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Aadhaar Number (12 Digits)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="e.g. 5521 8892 8492"
                  value={formData.aadhaar_number}
                  onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Annual Household Income
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 1,80,000"
                  value={formData.annual_income}
                  onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  District / Taluka
                </label>
                <input
                  type="text"
                  placeholder="e.g. South Goa / Pune / Bangalore"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  State / UT
                </label>
                <input
                  type="text"
                  placeholder="e.g. Goa / Maharashtra / Karnataka"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Your account is saved directly to the persistent GovConnect database with 256-bit encryption.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating Account...' : 'Create Citizen Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: SWITCH ACCOUNTS */}
        {mode === 'switch' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Registered Citizens in Local Database:
            </span>

            <div className="space-y-2">
              {existingUsers.map((user) => {
                const isCurrent = (user.user_id || user.id) === (currentUser.user_id || currentUser.id);

                return (
                  <div
                    key={user.user_id || user.id}
                    onClick={() => {
                      onSwitchUser(user);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">
                            {user.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {user.mobile} • {user.district || 'South Goa'}, {user.state || 'Goa'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {isCurrent ? 'Current' : 'Switch'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RegisterModal;
