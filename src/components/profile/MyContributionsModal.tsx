import React, { useState } from 'react';
import { usePlaces } from '../../context/PlacesContext';
import { useCulture } from '../../context/CultureContext';
import { useAuth } from '../../context/AuthContext';
import { Place } from '../../types/place';
import { CultureItem } from '../../types/culture';
import {
  Compass,
  Feather,
  Clock,
  CheckCircle,
  XCircle,
  X,
  ExternalLink,
  MapPin,
  Calendar
} from 'lucide-react';

interface MyContributionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
  onSelectCulture: (item: CultureItem) => void;
}

export const MyContributionsModal: React.FC<MyContributionsModalProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
  onSelectCulture
}) => {
  const { user } = useAuth();
  const { places } = usePlaces();
  const { cultureItems } = useCulture();
  const [activeTab, setActiveTab] = useState<'places' | 'culture'>('places');

  if (!isOpen || !user) return null;

  // Filter contributions by current user
  const userPlaces = places.filter(p => p.contributorId === user.uid);
  const userCulture = cultureItems.filter(c => c.contributorId === user.uid);

  const renderStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Approved (Public)</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/80 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Needs Revisions</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F2] border border-stone-200 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-forest-900 text-white p-6 sm:p-7 relative flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold block">
              Explorer Contributions
            </span>
            <h3 className="font-serif text-2xl font-bold text-white leading-tight">
              My Submissions
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Review verification status and community impact of your submissions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-300 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="bg-white border-b border-stone-200 px-6 pt-3 flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('places')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'places'
                ? 'border-forest-900 text-forest-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Tourism Places ({userPlaces.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('culture')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'culture'
                ? 'border-forest-900 text-forest-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>Culture &amp; Heritage ({userCulture.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          {activeTab === 'places' && (
            <>
              {userPlaces.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs">
                  <Compass className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                  <p>You haven't submitted any tourism destinations yet.</p>
                </div>
              ) : (
                userPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-gold/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={place.coverImage}
                        alt={place.placeName}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-gold-dark block">
                          {place.category}
                        </span>
                        <h4 className="font-serif font-bold text-forest-900 text-sm truncate">
                          {place.placeName}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{place.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      {renderStatusBadge(place.status)}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectPlace(place);
                        }}
                        className="text-xs font-bold text-forest-900 hover:text-gold-dark flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'culture' && (
            <>
              {userCulture.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs">
                  <Feather className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                  <p>You haven't submitted any cultural traditions or stories yet.</p>
                </div>
              ) : (
                userCulture.map((culture) => (
                  <div
                    key={culture.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-gold/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={culture.coverImage}
                        alt={culture.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-gold-dark block">
                          {culture.category}
                        </span>
                        <h4 className="font-serif font-bold text-forest-900 text-sm truncate">
                          {culture.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5 truncate">
                          <span>{culture.community} • {culture.villageOrArea}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      {renderStatusBadge(culture.status)}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectCulture(culture);
                        }}
                        className="text-xs font-bold text-forest-900 hover:text-gold-dark flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
