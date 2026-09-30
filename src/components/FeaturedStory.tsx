import React from 'react';

export const FeaturedStory: React.FC = () => {
  return (
    <section className="py-20 bg-forest text-white relative overflow-hidden" data-purpose="featured-story">
      {/* Decorative background Assamese weave pattern accents */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none assamese-motif-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Column (Panoramic countryside & Mishing village) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/30 group">
              <img
                alt="Panoramic landscape of Dhemaji Assam with Mishing stilt houses Chang Ghar and lush green fields"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XV_IF3DVVGohMtTCgVj7cLWv62mq8E6ooX0SJtAj9VKLDwBb3H3cIbEXmRxgnNQIAaRRdf68fYXEusk8r5BmuG_B_NUdFwS0X9sZLaeWcuW3wh6lgwYjA67DS7dpUkf0LPTZQ33fTB8NBheP5lF8mB28rOUd7IAd2jic4qK_ai8Ca6JYLgV0P-WaWenGhjtfQpKPTYQ1lkN6xehnmOtqCLSJ1C4IjGGoArugdmTH6TrF9GE-PVzTIzlE8"
              />
              {/* Subtle Floating Tag */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-forest-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-stone-200 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>
                  Traditional <em>Chang Ghar</em> (Mishing Stilt Village) along the waterways
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Narrative Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-gold text-sm">✦</span>
              <span className="text-gold font-serif text-xs font-bold tracking-[0.25em] uppercase">
                Ethereal Upper Assam
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              A District Waiting <br />
              <span className="text-gold-light italic font-editorial">to Be Discovered</span>
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Nestled between the mighty Brahmaputra River and the verdant Himalayan foothills of Arunachal Pradesh, Dhemaji remains one of Assam’s best-kept secrets. A sanctuary of sprawling wetlands, indigenous Mishing tribal culture, ancient Ahom monuments, and untamed riverways.
            </p>

            {/* Quick Highlight Pills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8" data-purpose="highlight-pills">
              <div className="flex items-center gap-2.5 bg-forest-700/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-stone-200">
                <span className="text-base">🌱</span>
                <span>Serene Eco-Tourism</span>
              </div>
              <div className="flex items-center gap-2.5 bg-forest-700/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-stone-200">
                <span className="text-base">🛶</span>
                <span>Brahmaputra Riverlands</span>
              </div>
              <div className="flex items-center gap-2.5 bg-forest-700/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-stone-200">
                <span className="text-base">🏛️</span>
                <span>Chutia &amp; Ahom Legacies</span>
              </div>
              <div className="flex items-center gap-2.5 bg-forest-700/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-stone-200">
                <span className="text-base">🧵</span>
                <span>Handwoven Textiles</span>
              </div>
            </div>

            {/* Prominent Journey CTA */}
            <a
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-extrabold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-gold-glow"
              href="#explore-gateways"
            >
              <span>START YOUR JOURNEY</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
