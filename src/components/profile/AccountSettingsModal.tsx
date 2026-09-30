import React from 'react';
import { UserProfile } from '../../types/auth';
import { Shield, CheckCircle, Database } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F2] border border-stone-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Top Header */}
        <div className="bg-forest-900 text-white p-6 sm:p-7 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-300 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/40">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold block">
                Security &amp; Linked Credentials
              </span>
              <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                Account Settings
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Linked Authentication Providers */}
          <div>
            <h4 className="font-serif font-bold text-forest-900 text-sm mb-3">
              Authentication Provider
            </h4>
            <div className="space-y-3">
              {/* Google Provider Status */}
              <div className="p-3.5 rounded-2xl border border-stone-200 bg-[#FAF8F2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
                  <div>
                    <span className="text-xs font-bold text-forest-900 block">Google Account</span>
                    <span className="text-[11px] text-charcoal-muted">{user.email}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Connected
                </span>
              </div>
            </div>
          </div>

          {/* Account Unique ID info */}
          <div className="p-4 rounded-2xl bg-forest-900/5 border border-forest-900/10 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-900 block">
              Firebase Explorer UID
            </span>
            <code className="text-xs font-mono text-stone-700 block select-all break-all">
              {user.uid}
            </code>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 pt-1">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Synced with Firebase Firestore (`smooth-lead-5xfhk`)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
