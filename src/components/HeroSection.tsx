import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden"
      data-purpose="hero-banner"
      id="hero"
    >
      {/* Background Aerial Sunrise Brahmaputra Photo */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Cinematic aerial view of Dhemaji Brahmaputra river and sunrise"
          className="w-full h-full object-cover object-center scale-105 filter brightness-95"
          src="https://lh3.googleusercontent.com/aida/AEtjO1Ukrh3UMtbY9OATEYT7K1RS3kMy0zazlhy1cjBAS-S8uJemtLmgl9iLPMp9U3AmP_AcG5X1HpgW-SgefjPb4kvfED6YQ1y7YBzF5rO0k_rm089zlgc6EVr528Q05UopM0bEebgpyhg23LoIJk4xE6cHKEJQP5BK9umxOoDv7LDja2-NY31jODGK-Ywto3lrKa1OJ79asASh3oJAyd-Y1DBnEaKRzE4rrbgXulvYKvHrhrzcfzjKJTaKi3M"
        />
        {/* Dual Rich Dark Forest Gradient Overlays for High-End Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/60 to-forest-800/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/80 via-transparent to-forest-900/70" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Eyebrow Tag */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-900/60 border border-gold/50 backdrop-blur-md mb-6 shadow-md"
          data-purpose="eyebrow-badge"
        >
          <span className="text-gold text-xs">◆</span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-stone-200">
            PRISTINE NORTHEAST INDIA • ASSAM
          </span>
          <span className="text-gold text-xs">◆</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg leading-tight sm:leading-none">
          UNEXPLORED <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-hover">
            DHEMAJI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-editorial italic text-xl sm:text-2xl md:text-3xl text-stone-200 font-normal mb-5 drop-shadow">
          Discover the hidden beauty of Assam
        </p>

        {/* Description Paragraph */}
        <p className="max-w-2xl text-stone-300 text-sm sm:text-base md:text-lg font-light leading-relaxed mb-10 px-2">
          Explore the untouched riverine landscapes, vibrant indigenous culture, ancient royal ruins, and untamed natural sanctuaries that make Dhemaji Assam's most captivating frontier.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-extrabold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-gold-glow flex items-center justify-center gap-2"
            href="#explore-gateways"
          >
            <span>EXPLORE DHEMAJI</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </a>
          <a
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
            href="#map-preview"
          >
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>VIEW MAP</span>
          </a>
        </div>

        {/* Scroll Indicator Floating Below Hero */}
        <div className="mt-14 sm:mt-16 animate-float flex flex-col items-center">
          <a
            className="text-stone-300 hover:text-gold flex flex-col items-center gap-2 transition-colors"
            href="#explore-gateways"
          >
            <span className="text-[10px] tracking-[0.3em] font-semibold uppercase text-gold/90">
              SCROLL TO EXPLORE
            </span>
            <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center backdrop-blur-sm bg-forest-900/30">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
