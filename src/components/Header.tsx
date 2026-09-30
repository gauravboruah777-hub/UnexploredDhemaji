import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut, ChevronDown, ShieldCheck, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRoute?: string;
  onRouteChange?: (route: string) => void;
  onOpenProfile: () => void;
  onOpenSettings?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenMyContributions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute = '/home',
  onRouteChange,
  onOpenProfile,
  onOpenSettings,
  onOpenAdminDashboard,
  onOpenMyContributions
}) => {
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (sectionId: string, route: string) => {
    if (onRouteChange) {
      onRouteChange(route);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    signOut();
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FCFAF6] shadow-md transition-all duration-300 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo Container */}
        <a
          className="flex items-center gap-3 group cursor-pointer"
          data-purpose="site-logo"
          onClick={() => handleNavClick('hero', '/home')}
        >
          <img
            alt="Unexplored Dhemaji Logo"
            className="h-12 w-12 object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm rounded-full bg-white p-0.5 border border-stone-200/90"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpQ8qJuwUHu8zhPVmPLKDt4mYV-DWv8YleVmrNA-voRYUXkwy3MpmV9H83lRYB3vLLSrf9Hpm-vdVroUf_zJs2Gh5wPTN52tHdNREKdVmvnCWBGta1CyQyMPJQlQyZ_UvEqxZDJtdeoRIZHpMdOUVS32TnwXIc8PQP-NdIKnBTuznyfXc1svCt3nlY92V8NhOe4MebxskiXG9nQ6pjjLKjFIsFITAoh1auVY_Yjc8Rr1SrKC6FduFAt-9yP5CcvUL8JQ"
          />
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-[11px] uppercase text-[#C4161C] font-bold leading-tight">
              Unexplored
            </span>
            <span className="font-serif tracking-[0.22em] text-lg sm:text-xl font-extrabold text-forest-900 leading-tight">
              DHEMAJI
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium tracking-wide" data-purpose="desktop-nav">
          <button
            type="button"
            onClick={() => handleNavClick('hero', '/home')}
            className={`${
              currentRoute === '/home'
                ? 'text-[#C4161C] font-bold border-b-2 border-[#C4161C] pb-0.5'
                : 'text-forest-900 hover:text-[#C4161C]'
            } transition-colors duration-200 font-semibold cursor-pointer`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('places', '/tourism-places')}
            className={`${
              currentRoute.startsWith('/tourism-places') || currentRoute === '/explore-places' || currentRoute === '/add-place'
                ? 'text-[#C4161C] font-bold border-b-2 border-[#C4161C] pb-0.5'
                : 'text-forest-900 hover:text-[#C4161C]'
            } transition-colors duration-200 font-semibold cursor-pointer`}
          >
            Tourism Places
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('culture', '/culture')}
            className={`${
              currentRoute.startsWith('/culture') || currentRoute === '/explore-culture' || currentRoute === '/create-culture'
                ? 'text-[#C4161C] font-bold border-b-2 border-[#C4161C] pb-0.5'
                : 'text-forest-900 hover:text-[#C4161C]'
            } transition-colors duration-200 font-semibold cursor-pointer`}
          >
            Culture
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('history', '/history')}
            className={`${
              currentRoute === '/history'
                ? 'text-[#C4161C] font-bold border-b-2 border-[#C4161C] pb-0.5'
                : 'text-forest-900 hover:text-[#C4161C]'
            } transition-colors duration-200 font-semibold cursor-pointer`}
          >
            History
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('map-preview', '/map')}
            className={`${
              currentRoute === '/map'
                ? 'text-[#C4161C] font-bold border-b-2 border-[#C4161C] pb-0.5'
                : 'text-forest-900 hover:text-[#C4161C]'
            } transition-colors duration-200 font-semibold cursor-pointer`}
          >
            Map
          </button>
        </nav>

        {/* CTA and User Profile Container */}
        <div className="hidden lg:flex items-center space-x-4">
          <a
            className="px-5 py-2.5 rounded-full border border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-white transition-all duration-300 text-xs font-bold tracking-wider uppercase shadow-xs cursor-pointer"
            href="#explore-gateways"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('explore-gateways', '/home');
            }}
          >
            Explore Dhemaji
          </a>

          {/* Quick Admin Portal Button for easy access */}
          {onOpenAdminDashboard && (
            <button
              type="button"
              onClick={() => onOpenAdminDashboard()}
              className="px-4 py-2 rounded-full border border-stone-300 hover:border-forest-900 bg-white hover:bg-[#FAF8F2] text-forest-900 text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Administrator Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D99B26]" />
              <span>Admin Portal</span>
            </button>
          )}

          {/* User Profile Menu with Avatar & Dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-stone-300 hover:border-gold bg-white hover:bg-[#FAF8F2] transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-forest-700"
                aria-expanded={userDropdownOpen}
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-forest-900 text-gold flex items-center justify-center font-serif font-bold text-xs shadow-xs overflow-hidden border border-gold/40">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-forest-900 max-w-[100px] truncate">
                  {user.displayName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2.5 z-50 animate-fadeIn">
                  {/* User info banner */}
                  <div className="px-4 py-2.5 border-b border-stone-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-forest-900 text-gold flex items-center justify-center font-serif font-bold text-xs shrink-0 overflow-hidden border border-gold/40">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-forest-900 text-sm truncate">
                          {user.displayName}
                        </h4>
                        {isAdmin && (
                          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[9px] font-black uppercase rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-muted truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    {/* ADMIN DASHBOARD - ONLY VISIBLE TO ADMINISTRATORS */}
                    {isAdmin && onOpenAdminDashboard && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAdminDashboard();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-amber-950 bg-amber-50 hover:bg-amber-100 font-bold flex items-center gap-2.5 transition-colors cursor-pointer border-b border-amber-200/70"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>ADMIN DASHBOARD</span>
                      </button>
                    )}

                    {/* My Contributions (For all authenticated users) */}
                    {onOpenMyContributions && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMyContributions();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-forest-900 hover:bg-[#FAF8F2] hover:text-gold-dark font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-stone-400" />
                        <span>My Contributions</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-forest-900 hover:bg-[#FAF8F2] hover:text-gold-dark font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      <span>My Profile</span>
                    </button>

                    {onOpenSettings && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenSettings();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-forest-900 hover:bg-[#FAF8F2] hover:text-gold-dark font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-stone-400" />
                        <span>Account Settings</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-forest-900 text-gold flex items-center justify-center font-serif font-bold text-xs border border-gold/40"
              title="My Profile"
            >
              {userInitial}
            </button>
          )}
          <button
            aria-label="Toggle navigation menu"
            className="text-forest-900 hover:text-[#C4161C] p-2 focus:outline-none cursor-pointer"
            data-purpose="mobile-menu-toggle"
            id="mobile-menu-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-forest-900/95 border-b border-gold/20 px-6 py-6 transition-all duration-300" id="mobile-menu">
          {user && (
            <div className="pb-4 mb-4 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold text-forest-900 flex items-center justify-center font-bold text-xs overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <div>
                  <span className="text-xs text-gold font-bold block">{user.displayName}</span>
                  <span className="text-[11px] text-stone-300 block">{user.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="px-2.5 py-1 rounded bg-forest-800 text-gold text-xs font-semibold border border-gold/30"
                >
                  Profile
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4 text-base font-medium text-stone-200">
            {/* Mobile Admin Link */}
            {onOpenAdminDashboard && (
              <button
                type="button"
                className="text-left text-amber-300 font-bold py-1.5 border-b border-amber-500/20 flex items-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminDashboard();
                }}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* Mobile My Contributions */}
            {onOpenMyContributions && (
              <button
                type="button"
                className="text-left hover:text-gold py-1 border-b border-white/5 flex items-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyContributions();
                }}
              >
                <Compass className="w-4 h-4 text-gold" />
                <span>My Contributions</span>
              </button>
            )}

            <button
              type="button"
              className="text-left text-gold py-1 border-b border-white/5"
              onClick={() => handleNavClick('hero', '/home')}
            >
              Home
            </button>
            <button
              type="button"
              className="text-left hover:text-gold py-1 border-b border-white/5"
              onClick={() => handleNavClick('places', '/tourism-places')}
            >
              Tourism Places
            </button>
            <button
              type="button"
              className="text-left hover:text-gold py-1 border-b border-white/5"
              onClick={() => handleNavClick('culture', '/culture')}
            >
              Culture
            </button>
            <button
              type="button"
              className="text-left hover:text-gold py-1 border-b border-white/5"
              onClick={() => handleNavClick('history', '/history')}
            >
              History
            </button>
            <button
              type="button"
              className="text-left hover:text-gold py-1 border-b border-white/5"
              onClick={() => handleNavClick('map-preview', '/map')}
            >
              Map
            </button>

            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-center py-2.5 rounded-full border border-red-400 text-red-300 hover:bg-red-900/40 text-xs font-bold uppercase tracking-wider mt-2"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}

      {/* Assamese Motif Ribbon */}
      <div
        aria-hidden="true"
        className="w-full h-4 bg-repeat-x border-t border-[#C4161C]/20 shadow-sm relative z-10"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida/AEtjO1Ws2pGIVvvcAQSrunQ5Y1FotZZwd0_hXQ6LZV7sSWzVItsFySXpt1eWM9hOEuCKOFp_qP9Ldb2rLdYUfRaHoaRqwgm_JIQmoT90STm2Vgj0sKDet8QhWpyI62qqZlwBrGhvvrrGeniqU1Yi4pHciOOucTU9Myz5trlr2UzuWuW1ucEk7RGOIokFRo-3odo3pbOocCt6wv-hNU2mWOfMTEv5vNHrt95vEAdRuM7WByNc6EnPJLvG0ZdGAhQ')",
          backgroundSize: 'auto 16px',
          backgroundRepeat: 'repeat-x'
        }}
      />
    </header>
  );
};
