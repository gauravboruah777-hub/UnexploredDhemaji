import React from 'react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer
      className="bg-forest-900 text-stone-300 pt-16 pb-12 border-t border-gold/20"
      data-purpose="site-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Row: Brand, Tagline, & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 items-center">
          {/* Brand Info */}
          <div className="md:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-forest-800 p-1.5 border border-gold/40 flex items-center justify-center shrink-0">
              <img
                alt="Unexplored Dhemaji Logo"
                className="h-10 w-10 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_LOaj7yQtp4sRiP_VFew3G3pVPr_KK8XKUiWFjg9WwAwbB8oFZi9Oq1_W25nX2uikNO9JhzkecGJ5RWe3yTUftaJVOPTA3Hieu9tk2TqZShqermn1TS6ufA8v1Hngl_FLFdcuRrnqubRum0Yu6z7fVrhUbX4dzjt3EfOMS84TdJ7vdup6ktIcTDOhz6bAGoh8AKnOWlE9JnPsXVSQRiNG2S4ioHuyKFG-6qQ-HfhDg5Rt8xUpDHvV0a5uC7ghJBRQfQ"
              />
            </div>
            <div>
              <span className="font-serif tracking-[0.2em] text-xl font-black text-white block">
                UNEXPLORED DHEMAJI
              </span>
              <p className="text-gold font-editorial italic text-sm mt-0.5">
                Discover. Experience. Remember.
              </p>
            </div>
          </div>

          {/* Navigation Links in Footer */}
          <div className="md:col-span-6 flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-sm font-medium">
            <a className="hover:text-gold transition-colors" href="#places">
              Tourism Places
            </a>
            <a className="hover:text-gold transition-colors" href="#culture">
              Culture
            </a>
            <a className="hover:text-gold transition-colors" href="#history">
              History
            </a>
            <a className="hover:text-gold transition-colors" href="#map-preview">
              Map
            </a>
            <button
              type="button"
              className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-semibold cursor-pointer"
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.history.pushState(null, '', '/admin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
            >
              <span>🔒 Admin Portal</span>
            </button>
            <a className="text-gold hover:underline transition-all" href="#hero">
              Back to Top ↑
            </a>
          </div>
        </div>

        {/* Bottom Footer Row: Copyright & Location Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Dhemaji District, Assam, 787057, Northeast India</span>
          </div>
          <div className="text-center sm:text-right">
            <p>© 2025 Unexplored Dhemaji Tourism Initiative. Dedicated to sustainable Assam travel &amp; preservation.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
