import React from 'react';
import { ArrowLeft, Sparkles, Feather, PlusCircle } from 'lucide-react';

interface CultureLandingPageProps {
  onSelectExploreCulture: () => void;
  onSelectCreateCulture: () => void;
  onBackToHome: () => void;
}

export const CultureLandingPage: React.FC<CultureLandingPageProps> = ({
  onSelectExploreCulture,
  onSelectCreateCulture,
  onBackToHome
}) => {
  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Breadcrumb & Return to Home */}
      <div className="mb-8">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-gold-dark transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Home</span>
        </button>
      </div>

      {/* Main Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold font-serif">
            LIVING TRADITIONS &amp; HERITAGE
          </span>
          <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-900 mb-4 tracking-tight">
          DISCOVER THE CULTURE OF DHEMAJI
        </h1>

        <p className="font-editorial italic text-xl sm:text-2xl text-gold-dark mb-4 font-normal">
          Traditions, stories, art and living heritage.
        </p>

        <div className="jaapi-glow-line h-0.5 w-32 mx-auto mb-5" />

        <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
          Explore the traditions and cultural heritage of Dhemaji, or share a tradition, story, craft or cultural experience from your community.
        </p>
      </div>

      {/* Two Large Interactive Visual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
        {/* CARD 01 — EXPLORE CULTURE */}
        <article
          onClick={onSelectExploreCulture}
          className="group bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/80 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
        >
          <div>
            {/* Visual Media Container with Image Zoom */}
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                alt="Traditional Mising dancer and weaver with loom and Jaapi in Dhemaji"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XLaDatDG3wv1luoXRyFOLj9cd0n_0Z-GNiV0kCa952geoptPnIA8EhoxE6wI88o5Txnrd7PP1lZ_BZDBU8-GJZZXe0Dv4QC2r0qv5Ye1Dg_Q5JWC8I9D60KA8guQfGuXtMmkml9sRcXrMjt5mGhPWi0ZKfdCmEIG3wsMPgV9Y7frqG0bAkZX6r6LbPnH1FbUmIoRfbhEiyf-JY_YEq1uLLlsRIgu0qekZVGxOYUJU1GiSXl4Jzezjby8E"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent" />

              {/* Number Badge */}
              <span className="absolute top-5 left-5 bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-gold" />
                <span>01</span>
              </span>

              {/* Category Pill */}
              <span className="absolute top-5 right-5 bg-gold/90 text-forest-900 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                DISCOVER
              </span>

              {/* Bottom text inside image banner */}
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-[11px] font-bold tracking-widest text-[#F3CF7A] uppercase block mb-1">
                  Living Archive
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  EXPLORE CULTURE
                </h2>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8">
              <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
                Discover the traditions, festivals, crafts, food, music, communities and stories that make Dhemaji culturally unique.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-stone-600 mb-6">
                <span className="px-3 py-1 rounded-full bg-forest-900/5 border border-forest-900/10">🎭 Folk Dance &amp; Gumrag</span>
                <span className="px-3 py-1 rounded-full bg-forest-900/5 border border-forest-900/10">🧵 Gero &amp; Loom Weaving</span>
                <span className="px-3 py-1 rounded-full bg-forest-900/5 border border-forest-900/10">🎉 Ali Aye Ligang</span>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-0">
            <button
              type="button"
              className="w-full py-4 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-extrabold text-xs uppercase tracking-widest transition-all duration-300 transform group-hover:scale-[1.01] shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE CULTURE →</span>
            </button>
          </div>
        </article>

        {/* CARD 02 — CREATE CULTURE */}
        <article
          onClick={onSelectCreateCulture}
          className="group bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/80 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
        >
          <div>
            {/* Visual Media Container with Image Zoom */}
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                alt="Person documenting Assamese traditions, musical instruments, and cultural practices"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent" />

              {/* Number Badge */}
              <span className="absolute top-5 left-5 bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-gold" />
                <span>02</span>
              </span>

              {/* Category Pill */}
              <span className="absolute top-5 right-5 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                COMMUNITY CONTRIBUTION
              </span>

              {/* Bottom text inside image banner */}
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-[11px] font-bold tracking-widest text-[#F3CF7A] uppercase block mb-1">
                  Cultural Preservation
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  CREATE CULTURE
                </h2>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8">
              <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
                Know a tradition, festival, craft, story or cultural practice that deserves to be shared? Add it to Unexplored Dhemaji.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-stone-600 mb-6">
                <span className="px-3 py-1 rounded-full bg-forest-900/5 border border-forest-900/10">📖 Folklore &amp; Oral Histories</span>
                <span className="px-3 py-1 rounded-full bg-forest-900/5 border border-forest-900/10">🍛 Indigenous Foodways</span>
                <span className="px-3 py-1 rounded-full bg-forest-900/5 border border-forest-900/10">🏘️ Community Knowledge</span>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-0">
            <button
              type="button"
              className="w-full py-4 rounded-full bg-forest-900 hover:bg-forest-800 text-gold font-extrabold text-xs uppercase tracking-widest border border-gold/40 transition-all duration-300 transform group-hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CREATE CULTURE →</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};
