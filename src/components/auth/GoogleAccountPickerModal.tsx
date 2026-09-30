import React, { useState } from 'react';
import { GoogleAccountOption } from '../../types/auth';
import { UserPlus, ArrowLeft, Shield } from 'lucide-react';

interface GoogleAccountPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccountOption) => void;
}

export const GoogleAccountPickerModal: React.FC<GoogleAccountPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount
}) => {
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState('');

  if (!isOpen) return null;

  // Pre-configured available Google accounts (including active user email)
  const availableAccounts: GoogleAccountOption[] = [
    {
      name: 'Boruah Borajen',
      email: 'boruahborajen2019@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    },
    {
      name: 'Assam Eco Explorer',
      email: 'assam.ecotourism@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');
    if (!customEmail.trim() || !customName.trim()) {
      setCustomError('Please enter both name and Google email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(customEmail.trim())) {
      setCustomError('Please enter a valid Google email address');
      return;
    }
    onSelectAccount({
      name: customName.trim(),
      email: customEmail.trim().toLowerCase(),
      avatarUrl: undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      {/* Google Account Chooser Box styled like Google Identity Services */}
      <div className="bg-white rounded-3xl w-full max-w-[420px] shadow-2xl border border-stone-200 overflow-hidden relative font-sans text-stone-800">
        {/* Top Cancel/Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          title="Cancel Google sign-in"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8">
          {/* Google Logo */}
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-sm font-semibold text-stone-600">Sign in with Google</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-medium text-stone-900 mb-1">
            Choose an account
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-6">
            to continue to <strong className="text-forest-900 font-serif">Unexplored Dhemaji</strong>
          </p>

          {!showAddAccountForm ? (
            <div className="space-y-2">
              {/* Account list */}
              {availableAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => onSelectAccount(account)}
                  className="w-full text-left p-3 rounded-2xl hover:bg-stone-50 active:bg-stone-100 border border-stone-200/80 transition-all flex items-center gap-3.5 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 border border-stone-300 shrink-0 flex items-center justify-center font-bold text-stone-700">
                    {account.avatarUrl ? (
                      <img src={account.avatarUrl} alt={account.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{account.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate group-hover:text-blue-600">
                      {account.name}
                    </p>
                    <p className="text-xs text-stone-500 truncate">{account.email}</p>
                  </div>
                </button>
              ))}

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setShowAddAccountForm(true)}
                className="w-full text-left p-3 rounded-2xl hover:bg-stone-50 border border-dashed border-stone-300 transition-all flex items-center gap-3.5 cursor-pointer mt-2"
              >
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-stone-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">Use another account</p>
                  <p className="text-xs text-stone-400">Sign in with any other Google account</p>
                </div>
              </button>
            </div>
          ) : (
            /* Custom Google Account Entry Form */
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setShowAddAccountForm(false)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to account list
              </button>

              {customError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs">
                  {customError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="e.g. Kaushik Baruah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountForm(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer shadow-xs"
                >
                  Select &amp; Authenticate
                </button>
              </div>
            </form>
          )}

          {/* Privacy Disclaimer */}
          <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-stone-400" /> Secure Google OAuth
            </span>
            <span>Unexplored Dhemaji App</span>
          </div>
        </div>
      </div>
    </div>
  );
};
