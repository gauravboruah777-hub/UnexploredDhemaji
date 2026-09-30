import React, { useState, useRef, useEffect } from 'react';
import { Place } from '../../types/place';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Check, ExternalLink } from 'lucide-react';

interface InteractiveDhemajiMapProps {
  places?: Place[];
  selectedPlaceId?: string;
  onSelectPlace?: (place: Place) => void;
  // For location picking in Add Place
  isPickerMode?: boolean;
  initialLat?: number;
  initialLng?: number;
  onLocationPicked?: (lat: number, lng: number, suggestedAddress?: string) => void;
}

// Bounding box for Dhemaji District, Assam
// Latitude: ~27.10 to ~27.90
// Longitude: ~94.10 to ~95.30
const MIN_LAT = 27.15;
const MAX_LAT = 27.95;
const MIN_LNG = 94.15;
const MAX_LNG = 95.35;

export const InteractiveDhemajiMap: React.FC<InteractiveDhemajiMapProps> = ({
  places = [],
  selectedPlaceId,
  onSelectPlace,
  isPickerMode = false,
  initialLat = 27.483,
  initialLng = 94.581,
  onLocationPicked
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // For picker mode
  const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [activePopupPlace, setActivePopupPlace] = useState<Place | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial coordinates if changed
  useEffect(() => {
    if (initialLat && initialLng) {
      setPinLocation({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  // Coordinate to SVG (1000 x 600 viewport)
  const coordsToSvg = (lat: number, lng: number) => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 900 + 50;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 500 + 50;
    return { x, y };
  };

  // SVG to Coordinate
  const svgToCoords = (x: number, y: number) => {
    const lng = MIN_LNG + ((x - 50) / 900) * (MAX_LNG - MIN_LNG);
    const lat = MAX_LAT - ((y - 50) / 500) * (MAX_LAT - MIN_LAT);
    return {
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4))
    };
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPickerMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    // Convert SVG view coords (scaled to 1000x600 viewBox)
    const scaleX = 1000 / rect.width;
    const scaleY = 600 / rect.height;

    const svgX = clickX * scaleX;
    const svgY = clickY * scaleY;

    const coords = svgToCoords(svgX, svgY);
    setPinLocation(coords);

    if (onLocationPicked) {
      onLocationPicked(coords.lat, coords.lng);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.3, 2.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.3, 0.8));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          setPinLocation({ lat, lng });
          if (onLocationPicked) {
            onLocationPicked(lat, lng, 'Current Device Geolocation, Dhemaji');
          }
        },
        (error) => {
          alert('Could not access current location. Please tap/click on the map to pin.');
        }
      );
    }
  };

  const pickerPinSvg = coordsToSvg(pinLocation.lat, pinLocation.lng);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[540px] bg-[#0E2419] rounded-3xl overflow-hidden border border-stone-200/40 shadow-2xl select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Map HUD Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-forest-900/90 backdrop-blur-md border border-gold/30 rounded-2xl p-1.5 flex flex-col gap-1 shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="w-8 h-8 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold flex items-center justify-center transition-colors cursor-pointer"
            title="Reset Map"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {isPickerMode && (
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Use My Location</span>
          </button>
        )}
      </div>

      {/* Top Right District Info HUD */}
      <div className="absolute top-4 right-4 z-20 bg-forest-900/90 backdrop-blur-md border border-gold/30 rounded-2xl px-4 py-2.5 text-right shadow-lg">
        <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block">
          Upper Assam Cartography
        </span>
        <h4 className="text-sm font-serif font-black text-white">
          Dhemaji District Interactive Map
        </h4>
        <p className="text-[10px] text-stone-300">
          Subansiri Valley • Jonai • Brahmaputra Riverlands
        </p>
      </div>

      {/* SVG Canvas Map */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full"
          onClick={handleMapClick}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#123B2A" />
              <stop offset="50%" stopColor="#0E2D20" />
              <stop offset="100%" stopColor="#092016" />
            </linearGradient>

            <linearGradient id="riverBrahmaputra" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E5E7A" />
              <stop offset="50%" stopColor="#2980B9" />
              <stop offset="100%" stopColor="#1B4F72" />
            </linearGradient>

            <linearGradient id="riverSubansiri" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E86C1" />
              <stop offset="100%" stopColor="#1F618D" />
            </linearGradient>

            {/* Pulse beacon filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Terrain */}
          <rect width="1000" height="600" fill="url(#terrainGrad)" />

          {/* Grid coordinates subtle lines */}
          <g opacity="0.08" stroke="#F3CF7A" strokeWidth="0.75" strokeDasharray="4 4">
            <line x1="100" y1="0" x2="100" y2="600" />
            <line x1="250" y1="0" x2="250" y2="600" />
            <line x1="400" y1="0" x2="400" y2="600" />
            <line x1="550" y1="0" x2="550" y2="600" />
            <line x1="700" y1="0" x2="700" y2="600" />
            <line x1="850" y1="0" x2="850" y2="600" />
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="200" x2="1000" y2="200" />
            <line x1="0" y1="300" x2="1000" y2="300" />
            <line x1="0" y1="400" x2="1000" y2="400" />
            <line x1="0" y1="500" x2="1000" y2="500" />
          </g>

          {/* Dhemaji District Realistic Poly Boundary */}
          <path
            d="M 120 180 Q 200 120 320 100 T 520 80 Q 720 90 850 140 Q 940 220 920 360 Q 820 480 680 520 Q 500 550 340 540 Q 200 520 100 420 Q 70 300 120 180 Z"
            fill="#164A35"
            stroke="#D99B26"
            strokeWidth="2"
            opacity="0.75"
          />

          {/* Himalayan Foothills (Northern Border) */}
          <g opacity="0.3" fill="none" stroke="#E5AC39" strokeWidth="1.5">
            <path d="M 100 150 Q 220 110 380 90 T 700 80 T 950 120" />
            <path d="M 120 130 Q 240 90 400 70 T 720 60 T 960 100" strokeDasharray="3 3" />
            <text x="500" y="55" fill="#F3CF7A" fontSize="11" letterSpacing="4" textAnchor="middle" fontWeight="bold">
              ARUNACHAL PRADESH HIMALAYAN FOOTHILLS
            </text>
          </g>

          {/* Subansiri River (West boundary flowing down) */}
          <path
            d="M 140 100 Q 150 180 180 260 T 210 380 Q 230 460 250 540"
            fill="none"
            stroke="url(#riverSubansiri)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.85"
          />
          <text x="210" y="320" fill="#A2D9CE" fontSize="9" fontWeight="bold" letterSpacing="1.5" transform="rotate(70 210 320)">
            SUBANSIRI RIVER
          </text>

          {/* Brahmaputra River (Sprawling southern boundary) */}
          <path
            d="M 120 540 Q 350 510 520 500 T 800 470 Q 920 440 980 420"
            fill="none"
            stroke="url(#riverBrahmaputra)"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.9"
          />
          <text x="520" y="515" fill="#E8F8F5" fontSize="11" fontWeight="bold" letterSpacing="3" textAnchor="middle">
            BRAHMAPUTRA RIVER
          </text>

          {/* Jiadhal River (Meandering river system) */}
          <path
            d="M 360 120 Q 380 220 370 310 T 350 420 T 320 520"
            fill="none"
            stroke="#2980B9"
            strokeWidth="5"
            strokeDasharray="1 1"
            opacity="0.8"
          />
          <text x="380" y="270" fill="#A2D9CE" fontSize="8" letterSpacing="1">
            Jiadhal River
          </text>

          {/* Sisi / Gainadi River */}
          <path
            d="M 520 140 Q 560 250 580 360 T 570 480"
            fill="none"
            stroke="#2980B9"
            strokeWidth="4"
            opacity="0.75"
          />

          {/* Key Towns & Landmarks Nodes */}
          {[
            { name: 'Dhemaji (HQ)', x: 420, y: 340, isHub: true },
            { name: 'Jonai', x: 860, y: 220, isHub: true },
            { name: 'Silapathar', x: 620, y: 310, isHub: true },
            { name: 'Gogamukh', x: 260, y: 400, isHub: false },
            { name: 'Bordoloni', x: 340, y: 450, isHub: false },
            { name: 'Gerukamukh', x: 160, y: 170, isHub: false },
            { name: 'Simen Chapori', x: 740, y: 380, isHub: false },
            { name: 'Machkhowa', x: 490, y: 440, isHub: false }
          ].map((town) => (
            <g key={town.name} transform={`translate(${town.x}, ${town.y})`}>
              <circle
                r={town.isHub ? 5 : 3.5}
                fill={town.isHub ? '#D99B26' : '#FAF8F2'}
                stroke="#071811"
                strokeWidth="1.5"
              />
              <text
                x="8"
                y="4"
                fill={town.isHub ? '#F3CF7A' : '#E0E7E3'}
                fontSize={town.isHub ? '11' : '9.5'}
                fontWeight={town.isHub ? 'bold' : 'normal'}
                letterSpacing="0.5"
              >
                {town.name}
              </text>
            </g>
          ))}

          {/* Places Markers (in Explore / View mode) */}
          {!isPickerMode &&
            places.map((place) => {
              const { x, y } = coordsToSvg(place.latitude, place.longitude);
              const isSelected = selectedPlaceId === place.id;

              return (
                <g
                  key={place.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopupPlace(place);
                    if (onSelectPlace) onSelectPlace(place);
                  }}
                >
                  {/* Outer pulse */}
                  <circle
                    r={isSelected ? '14' : '9'}
                    fill="#D99B26"
                    opacity={isSelected ? '0.45' : '0.25'}
                    className="animate-ping"
                  />
                  {/* Pin Circle */}
                  <circle
                    r={isSelected ? '9' : '7'}
                    fill={isSelected ? '#F3CF7A' : '#D99B26'}
                    stroke="#071811"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  {/* Icon or dot */}
                  <circle r="2.5" fill="#071811" />

                  {/* Label pill on hover or select */}
                  <g
                    transform="translate(12, -8)"
                    className={`${isSelected ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'} transition-opacity`}
                  >
                    <rect
                      x="0"
                      y="-12"
                      width={place.placeName.length * 6.5 + 16}
                      height="20"
                      rx="10"
                      fill="#071811"
                      stroke="#D99B26"
                      strokeWidth="1"
                    />
                    <text x="8" y="2" fill="#FAF8F2" fontSize="9.5" fontWeight="bold">
                      {place.placeName}
                    </text>
                  </g>
                </g>
              );
            })}

          {/* Picker Mode Pin Marker */}
          {isPickerMode && (
            <g transform={`translate(${pickerPinSvg.x}, ${pickerPinSvg.y})`}>
              <circle r="20" fill="#E5AC39" opacity="0.3" className="animate-ping" />
              <path
                d="M 0 0 C -10 -20 -10 -35 0 -40 C 10 -35 10 -20 0 0 Z"
                fill="#C4161C"
                stroke="#FAF8F2"
                strokeWidth="2"
              />
              <circle cx="0" cy="-28" r="5" fill="#FAF8F2" />
              <g transform="translate(14, -34)">
                <rect x="0" y="-10" width="130" height="22" rx="11" fill="#071811" stroke="#D99B26" strokeWidth="1" />
                <text x="8" y="5" fill="#FAF8F2" fontSize="9.5" fontWeight="bold">
                  📍 Click map to set pin
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Selected Location Pill for Picker Mode */}
      {isPickerMode && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-forest-900/95 backdrop-blur-md border border-gold/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-white shadow-2xl animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-bold text-gold tracking-wider block">
              Selected Location Coordinates
            </span>
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono mt-0.5">
              <span><strong>Lat:</strong> {pinLocation.lat}° N</span>
              <span><strong>Lng:</strong> {pinLocation.lng}° E</span>
            </div>
            <p className="text-[11px] text-stone-300 mt-0.5">
              Click anywhere on the Dhemaji map above to position your place pin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onLocationPicked) {
                onLocationPicked(pinLocation.lat, pinLocation.lng);
              }
            }}
            className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-extrabold text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-1.5 cursor-pointer transition-all transform hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>CONFIRM LOCATION</span>
          </button>
        </div>
      )}

      {/* Place Detail Popup on Marker Click (Explore Mode) */}
      {!isPickerMode && activePopupPlace && (
        <div className="absolute bottom-4 left-4 sm:left-auto sm:right-4 z-30 w-full sm:w-80 bg-white rounded-2xl p-3.5 shadow-2xl border border-stone-200 animate-fadeIn text-stone-900">
          <button
            type="button"
            onClick={() => setActivePopupPlace(null)}
            className="absolute top-2 right-2 text-stone-400 hover:text-stone-700 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>

          <div className="flex gap-3">
            <img
              src={activePopupPlace.coverImage}
              alt={activePopupPlace.placeName}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block truncate">
                {activePopupPlace.category}
              </span>
              <h5 className="font-serif font-bold text-forest-900 text-sm leading-tight truncate">
                {activePopupPlace.placeName}
              </h5>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                {activePopupPlace.description}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-mono">
              {activePopupPlace.latitude}° N, {activePopupPlace.longitude}° E
            </span>
            <button
              type="button"
              onClick={() => {
                if (onSelectPlace) onSelectPlace(activePopupPlace);
              }}
              className="text-xs font-bold text-forest-900 hover:text-gold-dark flex items-center gap-1 cursor-pointer"
            >
              <span>View Details</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
