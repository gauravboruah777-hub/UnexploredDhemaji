import React from 'react';
import { UserProfile } from '../../types/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSignOut: () => void;
  onOpenSettings?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
  onOpenSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F2] border border-stone-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-forest-900 text-white p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-300 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold border-2 border-white flex items-center justify-center text-forest-900 font-serif font-black text-2xl shadow-md overflow-hidden shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <span>{user.displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold block">
                Google Verified Traveler
              </span>
              <h3 className="font-serif text-2xl font-bold text-white leading-tight truncate">
                {user.displayName}
              </h3>
              <p className="text-xs text-stone-300 mt-0.5 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="p-6 sm:p-8 space-y-5 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAF8F2] border border-stone-200 p-3.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Explorer Status
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-forest-900">Active Explorer</span>
              </div>
            </div>

            <div className="bg-[#FAF8F2] border border-stone-200 p-3.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Sign-In Method
              </span>
              <span className="px-2 py-0.5 mt-1 inline-block bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200">
                Google Account
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F2] border border-stone-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
              Firebase Explorer UID
            </span>
            <code className="text-xs font-mono text-stone-700 mt-0.5 block break-all select-all">
              {user.uid}
            </code>
          </div>

          <div className="border border-gold/30 bg-gold/5 p-4 rounded-xl text-xs text-forest-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-gold-dark">
              <span>✦</span> Dhemaji Sustainable Travel Pledge
            </span>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              As a registered traveler, you help protect Upper Assam’s fragile wetlands, support indigenous Mishing artisans, and preserve century-old royal heritage.
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-stone-300 hover:bg-stone-100 text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="text-xs font-bold text-forest-900 hover:text-gold-dark underline cursor-pointer"
              >
                Account Settings
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
