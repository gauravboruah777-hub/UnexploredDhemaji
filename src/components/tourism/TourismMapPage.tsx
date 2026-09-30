import React, { useState } from 'react';
import { Place } from '../../types/place';
import { usePlaces } from '../../context/PlacesContext';
import { InteractiveDhemajiMap } from './InteractiveDhemajiMap';
import { ArrowLeft, PlusCircle, Compass, MapPin } from 'lucide-react';

interface TourismMapPageProps {
  onBack: () => void;
  onSelectPlaceDetails: (place: Place) => void;
  onOpenAddPlace: () => void;
  focusedPlaceId?: string;
}

export const TourismMapPage: React.FC<TourismMapPageProps> = ({
  onBack,
  onSelectPlaceDetails,
  onOpenAddPlace,
  focusedPlaceId
}) => {
  const { approvedPlaces } = usePlaces();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(focusedPlaceId);

  return (
    <section className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-gold-dark transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Places</span>
        </button>

        <button
          type="button"
          onClick={onOpenAddPlace}
          className="px-4 py-2 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-gold-glow cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>ADD A PLACE</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-gold-dark font-serif text-xs font-bold tracking-[0.25em] uppercase block mb-2">
          GEOGRAPHIC EXPLORATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
          DHEMAJI TOURISM MAP
        </h1>
        <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-3 font-normal">
          Interactive cartography of Upper Assam's most captivating frontier.
        </p>
        <div className="jaapi-glow-line h-0.5 w-28 mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
          Click any pin on the map to inspect destinations, read travel highlights, and view route coordinates.
        </p>
      </div>

      {/* Main Map Component */}
      <div className="mb-10">
        <InteractiveDhemajiMap
          places={approvedPlaces}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={(place) => {
            setSelectedPlaceId(place.id);
            onSelectPlaceDetails(place);
          }}
        />
      </div>

      {/* Places Directory Quick Strip */}
      <div>
        <h3 className="font-serif font-bold text-forest-900 text-lg mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-gold-dark" />
          <span>All Plotted Destinations ({approvedPlaces.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => {
                setSelectedPlaceId(place.id);
                onSelectPlaceDetails(place);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-gold transition-all cursor-pointer flex items-center gap-3.5 group shadow-xs"
            >
              <img
                src={place.coverImage}
                alt={place.placeName}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] uppercase font-bold text-emerald-800 block">
                  {place.category}
                </span>
                <h4 className="font-serif font-bold text-forest-900 text-xs sm:text-sm truncate group-hover:text-gold-dark transition-colors">
                  {place.placeName}
                </h4>
                <p className="text-[10px] text-stone-400 font-mono truncate">
                  {place.latitude}° N, {place.longitude}° E
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
