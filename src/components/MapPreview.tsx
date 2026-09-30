import React, { useState } from 'react';

const DHEMAJI_MAP_SRC = '/src/assets/images/dhemaji_district_map_1790770473279.jpg';

export const MapPreview: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  const landmarks = [
    { name: 'Dhemaji (District HQ)', role: 'Administrative center, Maa Manipuri Than, Gerukamukh access', tag: 'HQ' },
    { name: 'Silapathar', role: 'Commercial hub & transit route to Along/Arunachal Pradesh', tag: 'Town' },
    { name: 'Jonai', role: 'Sub-divisional town, gateway to Pasighat & Poba Reserve Forest', tag: 'Gateway' },
    { name: 'Likabali / Malinithan', role: 'Ancient 13th-century archaeological ruins at foothill border', tag: 'Heritage' },
    { name: 'Simen Chapori', role: 'Vibrant riverside chapori ecosystem & Mising ethnic settlements', tag: 'Nature' },
    { name: 'NH-52 & NH-52B', role: 'Major lifeline highways linking Dhemaji, Bogibeel Bridge & Dibrugarh', tag: 'Highway' }
  ];

  return (
    <section
      className="py-20 bg-[#FAF8F2]"
      data-purpose="interactive-map-showcase"
      id="map-preview"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-10">
          <span className="text-[#966318] font-serif text-xs font-bold tracking-[0.25em] uppercase block mb-2">
            Cartographic Explorer
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#112F23] mb-4">
            Dhemaji District Geography &amp; Key Landmarks
          </h2>
          <p className="text-[#4E5D53] text-sm sm:text-base leading-relaxed">
            Bordered by the Himalayan foothills of Arunachal Pradesh in the north and the mighty Brahmaputra river to the south. Discover connecting highways, sub-divisions, and riverside corridors.
          </p>
        </div>

        {/* Illustrated Map Display with Interactive Container */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white p-3">
          <div
            className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              alt="Official Map of Dhemaji District Assam with key towns, highways, and borders"
              className={`w-full h-auto rounded-2xl object-cover transition-transform duration-500 ${
                isZoomed ? 'scale-125' : 'scale-100'
              }`}
              src={DHEMAJI_MAP_SRC}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span>{isZoomed ? 'Click to reset zoom' : 'Click map to zoom'}</span>
            </div>
          </div>

          {/* Key Geographic Highlights */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-2 text-left">
            {landmarks.map((loc) => (
              <div
                key={loc.name}
                className="bg-[#FAF8F2] border border-stone-200/90 rounded-xl p-2.5 hover:border-[#D99B26]/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h5 className="font-serif font-bold text-xs text-[#112F23] truncate">
                    {loc.name}
                  </h5>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#112F23]/10 text-[#112F23]">
                    {loc.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#4E5D53] line-clamp-2 leading-tight">
                  {loc.role}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-5 pt-3 pb-1 px-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-left">
            <div>
              <h4 className="font-serif font-bold text-[#112F23] text-sm">
                Dhemaji District Cartography
              </h4>
              <p className="text-xs text-[#4E5D53]">
                Flanked by Arunachal Pradesh, Lakhimpur, Dibrugarh &amp; Sivasagar across the Brahmaputra
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="px-4 py-2 rounded-full border border-stone-300 hover:border-forest-700 text-[#112F23] text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                {isZoomed ? 'Reset View' : 'Zoom In'}
              </button>
              <a
                className="px-5 py-2 rounded-full bg-[#112F23] hover:bg-[#1a4232] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
                href={DHEMAJI_MAP_SRC}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Open Full Map</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
