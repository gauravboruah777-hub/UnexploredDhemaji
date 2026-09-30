import React, { useEffect } from 'react';

interface SuccessCardProps {
  userName?: string;
  onRedirect: () => void;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({ userName, onRedirect }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 1600);
    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-10 shadow-deep-card border border-stone-200/90 text-center animate-fadeIn flex flex-col items-center justify-center min-h-[420px]">
      {/* Decorative Cultural Badge */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-600/30 flex items-center justify-center text-3xl mb-6 shadow-md animate-bounce">
        ✓
      </div>

      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-dark mb-2 block">
        Account Setup Complete
      </span>

      <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-forest-900 mb-3 tracking-tight">
        Welcome to Unexplored Dhemaji!
      </h2>

      <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-8 font-normal">
        Your account is ready.
      </p>

      {userName && (
        <div className="bg-forest-900/5 px-4 py-2 rounded-full border border-forest-900/10 text-xs font-semibold text-forest-900 mb-8">
          Authenticated as <strong>{userName}</strong>
        </div>
      )}

      {/* Progress redirect indicator */}
      <div className="w-full max-w-xs space-y-2">
        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold to-emerald-600 rounded-full animate-pulse transition-all duration-1000 w-full" />
        </div>
        <p className="text-[11px] text-charcoal-muted uppercase tracking-wider">
          Redirecting to Homepage...
        </p>
      </div>
    </div>
  );
};
