import React, { useState, useMemo } from 'react';
import { Place, PlaceCategory } from '../../types/place';
import { usePlaces } from '../../context/PlacesContext';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Map, ArrowLeft, PlusCircle, Calendar, Sparkles, Filter } from 'lucide-react';

interface ExplorePlacesPageProps {
  onBackToSelection: () => void;
  onOpenAddPlace: () => void;
  onSelectPlaceDetails: (place: Place) => void;
  onOpenMapFull: () => void;
}

const CATEGORIES: { label: string; value: PlaceCategory | 'All'; icon: string }[] = [
  { label: 'All Places', value: 'All', icon: '✦' },
  { label: 'Nature', value: 'Nature', icon: '🌿' },
  { label: 'River & Wetland', value: 'River & Wetland', icon: '🌊' },
  { label: 'Heritage', value: 'Heritage', icon: '🏛️' },
  { label: 'Religious', value: 'Religious', icon: '🛕' },
  { label: 'Cultural', value: 'Cultural', icon: '🎭' },
  { label: 'Photography', value: 'Photography', icon: '📸' }
];

export const ExplorePlacesPage: React.FC<ExplorePlacesPageProps> = ({
  onBackToSelection,
  onOpenAddPlace,
  onSelectPlaceDetails,
  onOpenMapFull
}) => {
  const { places } = usePlaces();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'All'>('All');

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      // Public website rule: only display approved places
      const isVisible = place.status === 'approved';

      if (!isVisible) return false;

      const matchesCategory =
        selectedCategory === 'All' || place.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        place.placeName.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [places, selectedCategory, searchQuery, user]);

  return (
    <section className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={onBackToSelection}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-gold-dark transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Tourism Gateways</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMapFull}
            className="px-4 py-2 rounded-full border border-forest-900/30 hover:border-gold bg-white hover:bg-forest-900 hover:text-gold text-forest-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-gold-dark" />
            <span>VIEW ON MAP</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddPlace}
            className="px-4 py-2 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-gold-glow cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ADD PLACE</span>
          </button>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-gold-dark font-serif text-xs font-bold tracking-[0.25em] uppercase block mb-2">
          DESTINATION DISCOVERY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
          PLACES TO EXPLORE
        </h1>
        <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-3 font-normal">
          Find your next destination in Dhemaji.
        </p>
        <div className="jaapi-glow-line h-0.5 w-28 mx-auto" />
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-[#FCFAF6] rounded-3xl p-4 sm:p-6 shadow-md border border-stone-200/90 mb-10 max-w-5xl mx-auto space-y-4">
        {/* Search Input Box */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search places in Dhemaji..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-300 bg-white text-sm text-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-700 shadow-xs transition-all"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.value
                  ? 'bg-forest-900 text-gold shadow-md border border-gold/40'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Places Cards Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-16 bg-[#FCFAF6] rounded-3xl border border-dashed border-stone-300 max-w-xl mx-auto p-8">
          <div className="w-12 h-12 rounded-full bg-forest-900/10 text-forest-900 flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-forest-900" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest-900 mb-1">
            No Destinations Found
          </h3>
          <p className="text-xs text-charcoal-muted mb-5">
            No places matched your search query or filter. Know of one? Add it to the community map!
          </p>
          <button
            type="button"
            onClick={onOpenAddPlace}
            className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-gold-glow"
          >
            Add This Place
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPlaces.map(place => (
            <article
              key={place.id}
              className="group bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                {/* Place Image with category pill */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    alt={place.placeName}
                    src={place.coverImage}
                    className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-forest-900/90 text-gold border border-gold/40 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                    {place.category}
                  </span>

                  {/* Pending Review Badge for community submissions */}
                  {place.status === 'pending' && (
                    <span className="absolute top-4 right-4 bg-amber-500 text-forest-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                      Pending Review
                    </span>
                  )}

                  {/* Contributor pill if user contributed */}
                  {place.contributorName && place.contributorId !== 'official' && (
                    <span className="absolute bottom-3 left-4 text-[10px] text-white/90 font-medium">
                      By {place.contributorName}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-forest-900 mb-2 group-hover:text-gold-dark transition-colors line-clamp-1">
                    {place.placeName}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span className="truncate">{place.address}</span>
                  </div>

                  <p className="text-charcoal-muted text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-light">
                    {place.description}
                  </p>

                  {/* Best Time & Activities preview */}
                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold-dark" />
                      {place.bestTimeToVisit}
                    </span>
                    <span className="font-mono text-[10px]">
                      {place.latitude}° N
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectPlaceDetails(place)}
                  className="w-full py-2.5 rounded-full border border-forest-900/20 group-hover:border-gold group-hover:bg-forest-900 group-hover:text-gold text-forest-900 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>View Details</span>
                  <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
