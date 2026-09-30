import React, { useState, useMemo } from 'react';
import { CultureItem, CultureCategory } from '../../types/culture';
import { useCulture } from '../../context/CultureContext';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, ArrowLeft, PlusCircle, Sparkles, Feather, Users } from 'lucide-react';

interface ExploreCulturePageProps {
  onBackToSelection: () => void;
  onOpenCreateCulture: () => void;
  onSelectCultureDetails: (item: CultureItem) => void;
}

const CULTURE_CATEGORIES: { label: string; value: CultureCategory | 'All'; icon: string }[] = [
  { label: 'All Heritage', value: 'All', icon: '✦' },
  { label: 'Folk Dance & Music', value: 'Folk Dance & Music', icon: '🎭' },
  { label: 'Festivals & Celebrations', value: 'Festivals & Celebrations', icon: '🎉' },
  { label: 'Traditional Weaving & Textiles', value: 'Traditional Weaving & Textiles', icon: '🧵' },
  { label: 'Handicrafts & Art', value: 'Handicrafts & Art', icon: '🏺' },
  { label: 'Traditional Food', value: 'Traditional Food', icon: '🍛' },
  { label: 'Traditional Lifestyle', value: 'Traditional Lifestyle', icon: '🏡' },
  { label: 'Traditional Dress', value: 'Traditional Dress', icon: '👗' },
  { label: 'Folklore & Stories', value: 'Folklore & Stories', icon: '📖' },
  { label: 'Traditional Knowledge', value: 'Traditional Knowledge', icon: '🌿' },
  { label: 'Communities & Heritage', value: 'Communities & Heritage', icon: '🏘️' }
];

export const ExploreCulturePage: React.FC<ExploreCulturePageProps> = ({
  onBackToSelection,
  onOpenCreateCulture,
  onSelectCultureDetails
}) => {
  const { cultureItems } = useCulture();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CultureCategory | 'All'>('All');

  // Filtered items
  const filteredCulture = useMemo(() => {
    return cultureItems.filter(item => {
      // Public website rule: only display approved culture entries
      const isVisible = item.status === 'approved';

      if (!isVisible) return false;

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.community.toLowerCase().includes(q) ||
        item.villageOrArea.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [cultureItems, selectedCategory, searchQuery, user]);

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
          <span>← Back to Culture Gateways</span>
        </button>

        <button
          type="button"
          onClick={onOpenCreateCulture}
          className="px-4 py-2 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-gold-glow cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>CREATE CULTURE</span>
        </button>
      </div>

      {/* Main Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-gold-dark font-serif text-xs font-bold tracking-[0.25em] uppercase block mb-2">
          INDIGENOUS ARCHIVE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
          EXPLORE THE CULTURE
        </h1>
        <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-3 font-normal">
          Discover the living heritage of Dhemaji.
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
            placeholder="Search culture, traditions, festivals..."
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

        {/* Category Filter Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CULTURE_CATEGORIES.map(cat => (
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

      {/* Culture Cards Grid */}
      {filteredCulture.length === 0 ? (
        <div className="text-center py-16 bg-[#FCFAF6] rounded-3xl border border-dashed border-stone-300 max-w-xl mx-auto p-8">
          <div className="w-12 h-12 rounded-full bg-forest-900/10 text-forest-900 flex items-center justify-center mx-auto mb-3">
            <Feather className="w-5 h-5 text-forest-900" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest-900 mb-1">
            No Cultural Entries Found
          </h3>
          <p className="text-xs text-charcoal-muted mb-5">
            No cultural practices or stories matched your criteria. Contribute a tradition from your community!
          </p>
          <button
            type="button"
            onClick={onOpenCreateCulture}
            className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-gold-glow"
          >
            Create Cultural Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredCulture.map(item => (
            <article
              key={item.id}
              className="group bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-deep-card border border-stone-200/90 hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image Container */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    alt={item.title}
                    src={item.coverImage}
                    className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-forest-900/90 text-gold border border-gold/40 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                    {item.category}
                  </span>

                  {/* Status Badge */}
                  {item.status === 'pending' && (
                    <span className="absolute top-4 right-4 bg-amber-500 text-forest-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                      Pending Review
                    </span>
                  )}

                  {/* Community tag overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-semibold text-[#F3CF7A] flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{item.community}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-forest-900 mb-2 group-hover:text-gold-dark transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span className="truncate">{item.villageOrArea}</span>
                  </div>

                  <p className="text-charcoal-muted text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-light">
                    {item.description}
                  </p>

                  {/* Language & Significance Preview */}
                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      {item.language ? `Lang: ${item.language}` : 'Oral Tradition'}
                    </span>
                    <span className="font-mono text-[10px]">
                      {item.images.length} Photo{item.images.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectCultureDetails(item)}
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
