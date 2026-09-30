import React from 'react';

interface GatewayCardsProps {
  onOpenTourismPlaces?: () => void;
  onOpenCulture?: () => void;
  onOpenMap?: () => void;
}

export const GatewayCards: React.FC<GatewayCardsProps> = ({
  onOpenTourismPlaces,
  onOpenCulture,
  onOpenMap
}) => {
  return (
    <section
      className="relative z-20 -mt-8 pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      data-purpose="gateways-grid"
      id="explore-gateways"
    >
      {/* Section Header with Assamese Textile Motifs */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold font-serif">
            DISCOVER DHEMAJI
          </span>
          <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-gold" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
          GATEWAYS TO DHEMAJI
        </h2>
        <div className="jaapi-glow-line h-0.5 w-32 mx-auto mb-4" />
        <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed font-light">
          Embark on four curated paths connecting you directly to the landscapes, living heritage, storied ancient past, and geographical wonders of this northeastern treasure.
        </p>
      </div>

      {/* 4 Main Pillar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {/* Card 01: TOURISM PLACES - Opens dedicated Tourism Places Selection */}
        <article
          onClick={() => {
            if (onOpenTourismPlaces) onOpenTourismPlaces();
          }}
          className="group bg-ivory-card rounded-2xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
          data-purpose="gateway-card"
          id="places"
        >
          <div>
            <div className="relative h-64 overflow-hidden">
              <img
                alt="Serene Gerukamukh Subansiri river valley in Dhemaji Assam"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Xe3YyPyCV7_ROxLhtESRxmNV9i8fdsFQmo2AtH_jLaIDbCP-S2fz6iAO_Sv84FSz7XMHMZJIQWjriqERRzUc_bVlzode8Pg4cDjJQ3cxSCM6ChmciJbVPG4vofxZIlU5NpH0m1tJEkqaAXke1EppVIheF4vbj6lAzGPZYVOhcT7EuX_TpX0MoW3McQ8pF4pHd4O995FjNEYzoCW15K_4GMvd_YRTLa0QcQ0nL5rdBlbclv90DZ-C3yVxA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-md">
                01
              </span>
            </div>
            <div className="p-6">
              <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase block mb-1">
                Scenic &amp; Ecotourism
              </span>
              <h3 className="font-serif text-xl font-bold text-forest-900 mb-2 group-hover:text-gold-dark transition-colors">
                TOURISM PLACES
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed mb-6 font-light">
                Discover pristine river valleys, tranquil wetlands, tea garden vistas, and hidden destinations including Gerukamukh and Simen Chapori.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 pt-0">
            <button
              type="button"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-forest-800 group-hover:text-gold-dark transition-colors cursor-pointer"
            >
              <span>Explore &amp; Add Places</span>
              <span className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </button>
          </div>
        </article>

        {/* Card 02: CULTURE - Opens dedicated Culture Selection (Explore Culture vs Create Culture) */}
        <article
          onClick={() => {
            if (onOpenCulture) onOpenCulture();
          }}
          className="group bg-ivory-card rounded-2xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
          data-purpose="gateway-card"
          id="culture"
        >
          <div>
            <div className="relative h-64 overflow-hidden">
              <img
                alt="Traditional Assamese and Mishing weaver with loom and Jaapi in Dhemaji"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XLaDatDG3wv1luoXRyFOLj9cd0n_0Z-GNiV0kCa952geoptPnIA8EhoxE6wI88o5Txnrd7PP1lZ_BZDBU8-GJZZXe0Dv4QC2r0qv5Ye1Dg_Q5JWC8I9D60KA8guQfGuXtMmkml9sRcXrMjt5mGhPWi0ZKfdCmEIG3wsMPgV9Y7frqG0bAkZX6r6LbPnH1FbUmIoRfbhEiyf-JY_YEq1uLLlsRIgu0qekZVGxOYUJU1GiSXl4Jzezjby8E"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-md">
                02
              </span>
            </div>
            <div className="p-6">
              <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase block mb-1">
                Indigenous Living Heritage
              </span>
              <h3 className="font-serif text-xl font-bold text-forest-900 mb-2 group-hover:text-gold-dark transition-colors">
                CULTURE
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed mb-6 font-light">
                Immerse yourself in vibrant Mishing tribal traditions, Ali Aye Ligang festivities, Chang Ghar architecture, and legendary silk weaving.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 pt-0">
            <button
              type="button"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-forest-800 group-hover:text-gold-dark transition-colors cursor-pointer"
            >
              <span>Explore &amp; Create Culture</span>
              <span className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </button>
          </div>
        </article>

        {/* Card 03: HISTORY */}
        <article
          className="group bg-ivory-card rounded-2xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
          data-purpose="gateway-card"
          id="history"
        >
          <div>
            <div className="relative h-64 overflow-hidden">
              <img
                alt="Ancient Chutia and Ahom historic stone and brick relics in Dhemaji Assam"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                src="https://images.unsplash.com/photo-1590059390046-60914041e17e?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-md">
                03
              </span>
            </div>
            <div className="p-6">
              <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase block mb-1">
                Centuries-Old Legacy
              </span>
              <h3 className="font-serif text-xl font-bold text-forest-900 mb-2 group-hover:text-gold-dark transition-colors">
                HISTORY
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed mb-6 font-light">
                Uncover chronicles of the powerful Chutia Kingdom, Habung Ahom royal capitals, historic ramparts, and sacred ancient shrines.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 pt-0">
            <a
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-forest-800 group-hover:text-gold-dark transition-colors"
              href="#history"
            >
              <span>Explore History</span>
              <span className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </a>
          </div>
        </article>

        {/* Card 04: MAP */}
        <article
          onClick={() => {
            if (onOpenMap) onOpenMap();
          }}
          className="group bg-ivory-card rounded-2xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
          data-purpose="gateway-card"
          id="map"
        >
          <div>
            <div className="relative h-64 overflow-hidden">
              <img
                alt="Illustrated Map of Dhemaji district with landmarks and rivers"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                src="/src/assets/images/dhemaji_district_map_1790770473279.jpg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-md">
                04
              </span>
            </div>
            <div className="p-6">
              <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase block mb-1">
                District Geography
              </span>
              <h3 className="font-serif text-xl font-bold text-forest-900 mb-2 group-hover:text-gold-dark transition-colors">
                MAP
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed mb-6 font-light">
                Trace roads, river ferries, foothill trails, and key landmarks from Jonai to Gogamukh with interactive cartography.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 pt-0">
            <button
              type="button"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-forest-800 group-hover:text-gold-dark transition-colors cursor-pointer"
            >
              <span>Explore Map</span>
              <span className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};
