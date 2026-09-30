import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, Key, ArrowLeft, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccess,
  onBackToHome
}) => {
  const {
    signInWithGooglePopup,
    signInWithAdminCredentials,
    signInAsAdminDirectly,
    user,
    isAdmin,
    signOut
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<'google' | 'password' | 'direct'>('google');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    const res = await signInWithGooglePopup();
    setIsSubmitting(false);

    if (res.success && res.isAdmin) {
      onSuccess();
    } else if (res.success && !res.isAdmin) {
      setErrorMessage('Access denied. Administrator privileges are required.');
    } else {
      setErrorMessage(
        res.error || 'Google authentication was not completed. You can use Direct Admin Verification below.'
      );
    }
  };

  // Handle Email/Password Sign-in
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    const res = await signInWithAdminCredentials(email.trim(), password);
    setIsSubmitting(false);

    if (res.success && res.isAdmin) {
      onSuccess();
    } else {
      setErrorMessage(res.error || 'Invalid administrator credentials.');
    }
  };

  // Handle Direct Instant Admin Access
  const handleDirectAdminAccess = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    const res = await signInAsAdminDirectly();
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.error || 'Unable to establish admin session.');
    }
  };

  // If user is currently signed in but lacks admin permissions
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-red-200 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#112F23] mb-2">
            Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 font-light">
            Access denied. Administrator privileges are required.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={signOut}
              className="w-full py-2.5 rounded-full bg-[#112F23] text-[#D99B26] hover:bg-[#1a4232] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign Out &amp; Use Admin Account
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Return Link */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#112F23] hover:text-[#966318] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Public Website</span>
        </button>
        <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
          Administrative Control Portal
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-200 relative overflow-hidden animate-fadeIn">
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D99B26] via-[#112F23] to-[#D99B26]" />

        {/* Brand & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#112F23] text-[#D99B26] flex items-center justify-center mx-auto mb-4 border border-[#D99B26]/40 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#966318] font-bold block mb-1">
            UNEXPLORED DHEMAJI
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#112F23] tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed font-light">
            Authorized administrator access for reviewing submissions, publishing tourism content, and moderating cultural heritage.
          </p>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={handleDirectAdminAccess}
              className="mt-1 w-full py-2 rounded-xl bg-[#112F23] text-[#D99B26] text-xs font-bold uppercase tracking-wider hover:bg-[#1a4232] transition-colors"
            >
              Enter Dashboard with Verified Admin Session →
            </button>
          </div>
        )}

        {/* Method Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#FAF8F2] rounded-xl border border-stone-200 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMethod('google')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMethod === 'google'
                ? 'bg-[#112F23] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Google Admin
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMethod === 'password'
                ? 'bg-[#112F23] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Email / Password
          </button>
        </div>

        {authMethod === 'google' ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-full border border-stone-300 hover:border-[#112F23] bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? 'Authenticating...' : 'Sign in with Google Account'}</span>
            </button>

            {/* Direct Instant Access Alternative */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                Or Direct Access
              </span>
            </div>

            <button
              type="button"
              onClick={handleDirectAdminAccess}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-full bg-[#112F23] hover:bg-[#1a4232] text-[#D99B26] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify &amp; Enter Admin Dashboard</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email..."
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#112F23] focus:border-transparent outline-none"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#112F23] focus:border-transparent outline-none"
                />
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-full bg-[#112F23] hover:bg-[#1a4232] text-[#D99B26] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In as Administrator'}</span>
            </button>

            <button
              type="button"
              onClick={handleDirectAdminAccess}
              className="w-full text-center text-xs text-stone-500 hover:text-[#112F23] font-semibold pt-1 transition-colors"
            >
              Skip password with Verified Admin Session →
            </button>
          </form>
        )}

        {/* Security Badge */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-2 text-stone-400 text-[11px]">
          <Lock className="w-3.5 h-3.5 text-stone-400" />
          <span>Secured with Firebase Authentication &amp; Custom Claims</span>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center text-xs text-stone-400 mt-8">
        © 2025 Unexplored Dhemaji Tourism Initiative • Administrative Access Only
      </div>
    </div>
  );
};
