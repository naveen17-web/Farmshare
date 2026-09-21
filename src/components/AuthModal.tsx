import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Tractor, User, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register-farmer' | 'register-owner';
  initialMode?: 'login' | 'register-farmer' | 'register-owner';
  onLoginSuccess?: (role: UserRole) => void;
  onSuccess?: (role?: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  initialMode,
  onLoginSuccess,
  onSuccess,
}) => {
  const { login, registerFarmer, registerOwner, switchUser } = useApp();
  const effectiveInitial = initialMode || initialTab || 'login';
  const [tab, setTab] = useState<'login' | 'register-choice' | 'register-farmer' | 'register-owner'>(
    effectiveInitial === 'login' ? 'login' : effectiveInitial
  );

  useEffect(() => {
    const currentInitial = initialMode || initialTab;
    if (currentInitial) {
      setTab(currentInitial === 'login' ? 'login' : currentInitial);
    }
  }, [initialMode, initialTab, isOpen]);

  const handleSuccess = (role: UserRole) => {
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(role);
    }
    if (typeof onSuccess === 'function') {
      onSuccess(role);
    }
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Farmer form state
  const [farmerForm, setFarmerForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    village: '',
    district: '',
    state: '',
  });

  // Owner form state
  const [ownerForm, setOwnerForm] = useState({
    fullName: '',
    businessName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    village: '',
    district: '',
    state: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const res = login(loginEmail);
    if (res.success && res.user) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        handleSuccess(res.user!.role);
        onClose();
      }, 500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleFarmerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (farmerForm.password !== farmerForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (farmerForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const res = registerFarmer({
      fullName: farmerForm.fullName,
      mobile: farmerForm.mobile,
      email: farmerForm.email,
      village: farmerForm.village,
      district: farmerForm.district,
      state: farmerForm.state,
    });

    if (res.success && res.user) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        handleSuccess('FARMER');
        onClose();
      }, 800);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleOwnerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (ownerForm.password !== ownerForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (ownerForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const res = registerOwner({
      fullName: ownerForm.fullName,
      businessName: ownerForm.businessName || ownerForm.fullName,
      mobile: ownerForm.mobile,
      email: ownerForm.email,
      address: ownerForm.address,
      village: ownerForm.village,
      district: ownerForm.district,
      state: ownerForm.state,
    });

    if (res.success && res.user) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        handleSuccess('OWNER');
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.message);
    }
  };

  const fillQuickDemo = (userId: number, role: UserRole) => {
    switchUser(userId);
    handleSuccess(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {tab === 'login'
                  ? 'Sign in to FarmShare'
                  : tab === 'register-choice'
                  ? 'Join FarmShare'
                  : tab === 'register-farmer'
                  ? 'Farmer Registration'
                  : 'Equipment Owner Registration'}
              </h3>
              <p className="text-xs text-emerald-200">Agricultural Equipment Rental Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {tab === 'login' && (
            <div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="farmer.ramesh@farmshare.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[11px] text-stone-400">Demo test password: any</span>
                  </div>
                  <input
                    id="input-login-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition cursor-pointer"
                >
                  Sign In to Portal
                </button>
              </form>

              {/* 1-Click Demo Accounts */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider text-center mb-3">
                  Or 1-Click Sign In As:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo(2, 'FARMER')}
                    className="p-2.5 border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 rounded-xl text-left transition cursor-pointer"
                  >
                    <span className="text-base">🌾</span>
                    <p className="text-xs font-bold text-emerald-900 leading-tight mt-1">Farmer</p>
                    <p className="text-[10px] text-stone-500">Ramesh Patel</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickDemo(4, 'OWNER')}
                    className="p-2.5 border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 rounded-xl text-left transition cursor-pointer"
                  >
                    <span className="text-base">🚜</span>
                    <p className="text-xs font-bold text-amber-900 leading-tight mt-1">Owner</p>
                    <p className="text-[10px] text-stone-500">Balwinder</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickDemo(1, 'ADMIN')}
                    className="p-2.5 border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 rounded-xl text-left transition cursor-pointer"
                  >
                    <span className="text-base">🛡️</span>
                    <p className="text-xs font-bold text-purple-900 leading-tight mt-1">Admin</p>
                    <p className="text-[10px] text-stone-500">Rajesh Verma</p>
                  </button>
                </div>
              </div>

              <div className="mt-5 text-center text-xs text-stone-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register-choice')}
                  className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Join FarmShare
                </button>
              </div>
            </div>
          )}

          {tab === 'register-choice' && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-stone-600 text-center mb-4">
                Choose how you want to use the FarmShare platform:
              </p>

              <button
                type="button"
                onClick={() => setTab('register-farmer')}
                className="w-full p-4 border-2 border-emerald-200 bg-emerald-50/40 hover:border-emerald-600 hover:bg-emerald-50 rounded-2xl flex items-center gap-4 text-left transition group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">Join as Farmer</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Rent tractors, harvesters, rotavators, and implements at hourly/daily rates.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTab('register-owner')}
                className="w-full p-4 border-2 border-amber-200 bg-amber-50/40 hover:border-amber-600 hover:bg-amber-50 rounded-2xl flex items-center gap-4 text-left transition group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                  <Tractor className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">Join as Equipment Owner</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    List your agricultural machinery, set rates, accept bookings, and earn extra income.
                  </p>
                </div>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}

          {tab === 'register-farmer' && (
            <form onSubmit={handleFarmerRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={farmerForm.fullName}
                  onChange={(e) => setFarmerForm({ ...farmerForm, fullName: e.target.value })}
                  placeholder="e.g. Jasbir Singh"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={farmerForm.mobile}
                    onChange={(e) => setFarmerForm({ ...farmerForm, mobile: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={farmerForm.email}
                    onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                    placeholder="jasbir@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    value={farmerForm.village}
                    onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                    placeholder="Raikot"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={farmerForm.district}
                    onChange={(e) => setFarmerForm({ ...farmerForm, district: e.target.value })}
                    placeholder="Ludhiana"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={farmerForm.state}
                    onChange={(e) => setFarmerForm({ ...farmerForm, state: e.target.value })}
                    placeholder="Punjab"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={farmerForm.password}
                    onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={farmerForm.confirmPassword}
                    onChange={(e) => setFarmerForm({ ...farmerForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition cursor-pointer"
                >
                  Create Farmer Account
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          {tab === 'register-owner' && (
            <form onSubmit={handleOwnerRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
                ℹ️ <strong>Notice:</strong> Equipment Owner accounts require administrative verification. Once registered, your status will be <strong>PENDING</strong> until reviewed by FarmShare admin.
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name / Business Name *</label>
                <input
                  type="text"
                  required
                  value={ownerForm.fullName}
                  onChange={(e) => setOwnerForm({ ...ownerForm, fullName: e.target.value })}
                  placeholder="e.g. Gurmail Agrotech Services"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={ownerForm.mobile}
                    onChange={(e) => setOwnerForm({ ...ownerForm, mobile: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={ownerForm.email}
                    onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                    placeholder="owner@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Shop / Yard Address *</label>
                <input
                  type="text"
                  required
                  value={ownerForm.address}
                  onChange={(e) => setOwnerForm({ ...ownerForm, address: e.target.value })}
                  placeholder="Main Mandi Road, Near Grain Silo"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    value={ownerForm.village}
                    onChange={(e) => setOwnerForm({ ...ownerForm, village: e.target.value })}
                    placeholder="Khanna"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={ownerForm.district}
                    onChange={(e) => setOwnerForm({ ...ownerForm, district: e.target.value })}
                    placeholder="Ludhiana"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={ownerForm.state}
                    onChange={(e) => setOwnerForm({ ...ownerForm, state: e.target.value })}
                    placeholder="Punjab"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={ownerForm.password}
                    onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={ownerForm.confirmPassword}
                    onChange={(e) => setOwnerForm({ ...ownerForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition cursor-pointer"
                >
                  Submit Owner Application
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
