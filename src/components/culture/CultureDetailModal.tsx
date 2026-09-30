import React, { useState } from 'react';
import { CultureItem } from '../../types/culture';
import { InteractiveDhemajiMap } from '../tourism/InteractiveDhemajiMap';
import {
  MapPin,
  Users,
  Feather,
  Clock,
  Sparkles,
  Video,
  Share2,
  BookOpen,
  Calendar,
  Compass
} from 'lucide-react';

interface CultureDetailModalProps {
  item: CultureItem | null;
  onClose: () => void;
  onOpenMapFull?: () => void;
}

export const CultureDetailModal: React.FC<CultureDetailModalProps> = ({
  item,
  onClose
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!item) return null;

  const currentImage = item.images?.[activeImageIndex] || item.coverImage;

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
              alt={item.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-transparent to-black/30" />

            {/* Badges on Hero */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-forest-900/90 text-gold border border-gold/40 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                {item.category}
              </span>
              {item.status === 'pending' && (
                <span className="bg-amber-500 text-forest-900 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
                  Pending Review
                </span>
              )}
            </div>

            {/* Title on Image */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {item.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>{item.villageOrArea}</span>
              </div>
            </div>
          </div>

          {/* Image Thumbnail Selector (if multiple images) */}
          {item.images && item.images.length > 1 && (
            <div className="bg-stone-900 px-6 py-2.5 flex items-center gap-3 overflow-x-auto">
              {item.images.map((img, idx) => (
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

          {/* Cultural Body Information */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Community & Language Badge Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1">
                  Associated Community
                </span>
                <div className="flex items-center gap-2 text-sm font-semibold text-forest-900">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>{item.community}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-1">
                  Language &amp; Region
                </span>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-900">
                  <Feather className="w-4 h-4 text-gold-dark" />
                  <span>{item.language || 'Indigenous Upper Assamese'}</span>
                </div>
              </div>
            </div>

            {/* About / Description */}
            <div>
              <h3 className="font-serif font-bold text-forest-900 text-sm uppercase tracking-wider mb-2">
                About this Cultural Tradition
              </h3>
              <p className="text-charcoal text-sm sm:text-base leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            {/* How It Is Practiced */}
            {item.howPracticed && (
              <div>
                <h3 className="font-serif font-bold text-forest-900 text-sm uppercase tracking-wider mb-2">
                  How It Is Practiced &amp; Performed
                </h3>
                <p className="text-charcoal text-xs sm:text-sm leading-relaxed font-light bg-white p-4 rounded-2xl border border-stone-200">
                  {item.howPracticed}
                </p>
              </div>
            )}

            {/* History & Origin */}
            {item.history && (
              <div>
                <h3 className="font-serif font-bold text-forest-900 text-sm uppercase tracking-wider mb-2">
                  History &amp; Origin
                </h3>
                <p className="text-charcoal text-xs sm:text-sm leading-relaxed font-light">
                  {item.history}
                </p>
              </div>
            )}

            {/* Cultural Significance */}
            {item.significance && (
              <div className="bg-gold/10 border border-gold/30 p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider block mb-1">
                  Cultural Significance &amp; Preservation
                </span>
                <p className="text-xs sm:text-sm text-forest-900 font-light leading-relaxed">
                  {item.significance}
                </p>
              </div>
            )}

            {/* Related Festivals */}
            {item.relatedFestivals && item.relatedFestivals.length > 0 && (
              <div>
                <h3 className="font-serif font-bold text-forest-900 text-sm uppercase tracking-wider mb-2">
                  Related Celebrations &amp; Ceremonies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.relatedFestivals.map((fest, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-forest-900/5 border border-forest-900/10 text-forest-900 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                      <span>{fest}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video preview if provided */}
            {item.videoUrl && (
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block mb-2 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  <span>Cultural Performance Demonstration</span>
                </span>
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-forest-900 hover:text-gold-dark underline flex items-center gap-1"
                >
                  <span>Watch Video Recording on External Portal →</span>
                </a>
              </div>
            )}

            {/* Interactive Location Map */}
            <div>
              <h3 className="font-serif font-bold text-forest-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-gold-dark" />
                <span>Documented Geographical Origin</span>
              </h3>
              <div className="rounded-2xl overflow-hidden border border-stone-200">
                <InteractiveDhemajiMap
                  initialLat={item.latitude}
                  initialLng={item.longitude}
                  places={[]}
                  isPickerMode={false}
                />
              </div>
            </div>

            {/* Contributor Profile Tag */}
            <div className="bg-forest-900/5 p-4 rounded-2xl border border-forest-900/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-bold block">
                  Cultural Contributor
                </span>
                <span className="font-serif font-bold text-forest-900">
                  {item.contributorName || 'Dhemaji Heritage Explorer'}
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 sm:px-8 border-t border-stone-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
