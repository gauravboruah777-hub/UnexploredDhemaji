import React, { useState } from 'react';
import { Place } from '../../types/place';
import { MapPin, Calendar, Check, Map, Compass, User, Clock, ShieldCheck } from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  onViewOnMap: (place: Place) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  onViewOnMap
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!place) return null;

  const currentImage = place.images?.[activeImageIndex] || place.coverImage;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F2] border border-stone-200 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white hover:text-gold w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors shadow-md"
        >
          ✕
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Main Hero Media & Gallery */}
          <div className="relative h-64 sm:h-80 w-full bg-forest-900 overflow-hidden">
            <img
              src={currentImage}
              alt={place.placeName}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-transparent to-black/30" />

            {/* Badges on Hero */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                {place.category}
              </span>
              {place.status === 'pending' && (
                <span className="bg-amber-500 text-forest-900 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
                  Pending Review
                </span>
              )}
            </div>

            {/* Title on Image */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {place.placeName}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>{place.address}</span>
              </div>
            </div>
          </div>

          {/* Image Thumbnail Selector (if multiple images) */}
          {place.images && place.images.length > 1 && (
            <div className="bg-stone-900 px-6 py-2.5 flex items-center gap-3 overflow-x-auto">
              {place.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-gold scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Place Body Information */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-serif font-bold text-forest-900 text-sm uppercase tracking-wider mb-2">
                About this Destination
              </h3>
              <p className="text-charcoal text-sm sm:text-base leading-relaxed font-light">
                {place.description}
              </p>
            </div>

            {/* Quick Travel Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1">
                  Best Season to Visit
                </span>
                <div className="flex items-center gap-2 text-sm font-semibold text-forest-900">
                  <Calendar className="w-4 h-4 text-gold-dark" />
                  <span>{place.bestTimeToVisit}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1">
                  GPS Coordinates
                </span>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-forest-900">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>{place.latitude}° N, {place.longitude}° E</span>
                </div>
              </div>
            </div>

            {/* Things to Do Chips */}
            {place.thingsToDo && place.thingsToDo.length > 0 && (
              <div>
                <h3 className="font-serif font-bold text-forest-900 text-sm uppercase tracking-wider mb-2.5">
                  Recommended Activities &amp; Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {place.thingsToDo.map((activity, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-forest-900/5 border border-forest-900/10 text-forest-900 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-gold-dark" />
                      <span>{activity}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contributor Credential Tag */}
            <div className="bg-forest-900/5 p-4 rounded-2xl border border-forest-900/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-forest-900 text-gold flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-bold block">
                    Place Contributor
                  </span>
                  <span className="font-serif font-bold text-forest-900">
                    {place.contributorName || 'Dhemaji Explorer'}
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-stone-500 font-mono">
                {new Date(place.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 sm:px-8 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onViewOnMap(place);
            }}
            className="px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-gold font-bold text-xs uppercase tracking-wider border border-gold/40 shadow-md flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105"
          >
            <Map className="w-4 h-4 text-gold" />
            <span>View on Dhemaji Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
