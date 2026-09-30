import React, { useState, useRef } from 'react';
import { Place, PlaceCategory } from '../../types/place';
import { useAuth } from '../../context/AuthContext';
import { usePlaces } from '../../context/PlacesContext';
import { InteractiveDhemajiMap } from './InteractiveDhemajiMap';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  MapPin,
  Navigation,
  ArrowLeft,
  CheckCircle,
  Eye,
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AddPlacePageProps {
  onBackToSelection: () => void;
  onSuccessDone: () => void;
  onViewCreatedPlace: (place: Place) => void;
}

const CATEGORY_OPTIONS: PlaceCategory[] = [
  'Nature',
  'River & Wetland',
  'Heritage',
  'Religious',
  'Cultural',
  'Photography',
  'Other'
];

const QUICK_ACTIVITIES = [
  'Photography',
  'Sightseeing',
  'Nature walk',
  'Bird watching',
  'River boating',
  'Camping',
  'Heritage study',
  'Local Mishing cuisine'
];

export const AddPlacePage: React.FC<AddPlacePageProps> = ({
  onBackToSelection,
  onSuccessDone,
  onViewCreatedPlace
}) => {
  const { user } = useAuth();
  const { addPlace } = usePlaces();

  // Form State
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('Nature');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('October – April');
  const [address, setAddress] = useState('Dhemaji District, Assam');
  const [thingsToDo, setThingsToDo] = useState<string[]>(['Photography', 'Sightseeing']);
  const [customActivity, setCustomActivity] = useState('');

  // Location State
  const [latitude, setLatitude] = useState<number>(27.483);
  const [longitude, setLongitude] = useState<number>(94.581);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState<boolean>(true);

  // Images State
  const [images, setImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [createdPlace, setCreatedPlace] = useState<Place | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // File Upload Handlers
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage('');

    const newImages: string[] = [...images];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    Array.from(files).forEach((file) => {
      if (newImages.length >= 5) {
        setErrorMessage('Maximum 5 images allowed per place.');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Supported formats are JPG, JPEG, PNG, and WEBP.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 10 MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => {
            if (prev.length >= 5) return prev;
            return [...prev, e.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (coverImageIndex === index) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > index) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  const handleSetCover = (index: number) => {
    setCoverImageIndex(index);
  };

  const toggleActivity = (activity: string) => {
    if (thingsToDo.includes(activity)) {
      setThingsToDo(thingsToDo.filter(a => a !== activity));
    } else {
      setThingsToDo([...thingsToDo, activity]);
    }
  };

  const handleAddCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActivity.trim()) return;
    if (!thingsToDo.includes(customActivity.trim())) {
      setThingsToDo([...thingsToDo, customActivity.trim()]);
    }
    setCustomActivity('');
  };

  // Location Handlers
  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          setLatitude(lat);
          setLongitude(lng);
          setIsLocationConfirmed(true);
          setAddress(prev => prev || `GPS Location (${lat}° N, ${lng}° E), Dhemaji`);
        },
        () => {
          setErrorMessage('Unable to retrieve your current location. Please select on the map.');
        }
      );
    }
  };

  const handleLocationPickedOnMap = (lat: number, lng: number, suggested?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setIsLocationConfirmed(true);
    if (suggested) {
      setAddress(suggested);
    }
  };

  // Validation
  const validateForm = (): boolean => {
    setErrorMessage('');
    if (images.length === 0) {
      setErrorMessage('Please upload at least one photo.');
      return false;
    }
    if (!placeName.trim()) {
      setErrorMessage('Please enter the name of the place.');
      return false;
    }
    if (!description.trim() || description.trim().length < 20) {
      setErrorMessage('Please provide a descriptive explanation (at least 20 characters).');
      return false;
    }
    if (!category) {
      setErrorMessage('Please choose a category.');
      return false;
    }
    if (!latitude || !longitude) {
      setErrorMessage('Please select the location of this place on the map.');
      return false;
    }
    return true;
  };

  // Submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const coverImage = images[coverImageIndex] || images[0];

    const contributorId = user?.uid || ('guest_' + Math.random().toString(36).substring(2, 9));
    const contributorName = user?.displayName || 'Traveler Contributor';
    const contributorEmail = user?.email || '';

    const result = await addPlace({
      placeName: placeName.trim(),
      description: description.trim(),
      category,
      images,
      coverImage,
      latitude,
      longitude,
      address: address.trim() || 'Dhemaji, Assam',
      bestTimeToVisit: bestTimeToVisit.trim() || 'October – April',
      thingsToDo,
      contributorId,
      contributorName,
      contributorEmail
    });

    setIsSubmitting(false);

    if (result.success) {
      const createdObj: Place = {
        id: result.id || 'new_place',
        placeName: placeName.trim(),
        description: description.trim(),
        category,
        images,
        coverImage,
        latitude,
        longitude,
        address: address.trim() || 'Dhemaji, Assam',
        bestTimeToVisit,
        thingsToDo,
        contributorId,
        contributorName,
        contributorEmail,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      setCreatedPlace(createdObj);
      setIsPreviewOpen(false);
      setIsSubmittedSuccess(true);
    } else {
      setErrorMessage(result.error || 'Failed to submit place. Please try again.');
    }
  };

  // SUCCESS SCREEN
  if (isSubmittedSuccess && createdPlace) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fadeIn text-center">
        <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-12 shadow-deep-card border border-stone-200/90 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-600/30 flex items-center justify-center text-4xl mb-6 shadow-md animate-bounce">
            ✓
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-800 mb-2 block">
            Pending Moderation Review
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
            PLACE SUBMITTED!
          </h1>

          <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-4 font-normal">
            Thank you for helping us discover more of Dhemaji.
          </p>

          <p className="text-sm text-charcoal-muted max-w-lg mb-8 leading-relaxed font-light">
            Your place <strong>"{createdPlace.placeName}"</strong> has been submitted successfully with <strong>{createdPlace.images.length} photo(s)</strong>. Our community review team will verify the details and coordinates before publishing it live on the district exploration map.
          </p>

          {/* Place Summary Snapshot */}
          <div className="w-full max-w-md bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-8 text-left flex gap-4">
            <img
              src={createdPlace.coverImage}
              alt={createdPlace.placeName}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-gold-dark block">
                {createdPlace.category}
              </span>
              <h4 className="font-serif font-bold text-forest-900 text-sm truncate">
                {createdPlace.placeName}
              </h4>
              <p className="text-xs text-stone-500 truncate">{createdPlace.address}</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Status: Pending Review</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full">
            <button
              type="button"
              onClick={() => onViewCreatedPlace(createdPlace)}
              className="px-6 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-gold font-bold text-xs uppercase tracking-wider border border-gold/40 shadow-md cursor-pointer transition-all transform hover:scale-105"
            >
              VIEW MY SUBMISSION
            </button>

            <button
              type="button"
              onClick={onSuccessDone}
              className="px-6 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs uppercase tracking-wider shadow-gold-glow cursor-pointer transition-all transform hover:scale-105"
            >
              BACK TO EXPLORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToSelection}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-gold-dark transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Tourism Gateways</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-gold-dark font-serif text-xs font-bold tracking-[0.25em] uppercase block mb-2">
          COMMUNITY CARTOGRAPHY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
          ADD A PLACE TO UNEXPLORED DHEMAJI
        </h1>
        <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-3 font-normal">
          Help others discover the places you love.
        </p>
        <div className="jaapi-glow-line h-0.5 w-28 mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-xl mx-auto font-light">
          Share a place, landmark, natural attraction or hidden destination in Dhemaji with the community.
        </p>
      </div>

      {/* Contributor Verification Card */}
      {user && (
        <div className="mb-8 p-4 rounded-2xl bg-forest-900/5 border border-forest-900/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-900 text-gold flex items-center justify-center font-bold text-xs">
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                Verified Contributor Profile
              </span>
              <p className="text-xs sm:text-sm font-serif font-bold text-forest-900">
                {user.displayName} ({user.email})
              </p>
            </div>
          </div>
          <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
            UID: {user.uid.slice(0, 12)}...
          </span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-10 shadow-deep-card border border-stone-200/90 space-y-10">
        {/* SECTION 1: UPLOAD PLACE IMAGES */}
        <div>
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 01
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Upload Photos
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Drag and drop your images here or browse from your device. Supported: JPG, PNG, WEBP (Max 5 images, up to 10 MB each).
            </p>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-stone-300 hover:border-gold rounded-3xl p-8 sm:p-12 text-center bg-white/70 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <div className="w-16 h-16 rounded-full bg-forest-900/5 group-hover:bg-forest-900/10 text-forest-900 flex items-center justify-center mx-auto mb-4 transition-colors">
              <Upload className="w-7 h-7 text-forest-900 group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="font-serif font-bold text-forest-900 text-base mb-1">
              Drag &amp; drop photos here, or browse
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              Upload high resolution photographs of scenic views, cultural elements, or surroundings
            </p>
            <button
              type="button"
              className="px-6 py-2.5 rounded-full bg-forest-900 text-gold hover:bg-forest-800 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              CHOOSE IMAGES
            </button>
          </div>

          {/* Image Previews List */}
          {images.length > 0 && (
            <div className="mt-6">
              <span className="text-xs font-bold text-forest-900 block mb-3 uppercase tracking-wider">
                Uploaded Photos ({images.length}/5)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group/thumb rounded-2xl overflow-hidden border-2 transition-all shadow-xs bg-black/10 aspect-square"
                    style={{ borderColor: coverImageIndex === idx ? '#D99B26' : '#E2E8F0' }}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

                    {/* Cover badge */}
                    {coverImageIndex === idx && (
                      <span className="absolute top-2 left-2 bg-gold text-forest-900 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md">
                        Cover
                      </span>
                    )}

                    {/* Actions overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {coverImageIndex !== idx && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetCover(idx);
                          }}
                          className="w-full py-1 bg-white/90 hover:bg-white text-forest-900 text-[10px] font-bold uppercase rounded-md cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Star className="w-3 h-3 text-gold-dark fill-gold" />
                          <span>Set Cover</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PLACE INFORMATION */}
        <div className="pt-6 border-t border-stone-200">
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 02
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Place Information
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Enter key details about this destination for travelers and researchers.
            </p>
          </div>

          <div className="space-y-4">
            {/* Place Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Place Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={placeName}
                onChange={e => setPlaceName(e.target.value)}
                placeholder="Enter the name of the place (e.g. Gerukamukh)"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Tell visitors about this place... Describe its natural beauty, historical folklore, seasonal changes, or how to get there."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 resize-y"
              />
            </div>

            {/* Category & Best Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as PlaceCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                  Best Time to Visit
                </label>
                <input
                  type="text"
                  value={bestTimeToVisit}
                  onChange={e => setBestTimeToVisit(e.target.value)}
                  placeholder="e.g. October – April"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>
            </div>

            {/* Things to Do */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Things to Do &amp; Activities
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {QUICK_ACTIVITIES.map(act => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => toggleActivity(act)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      thingsToDo.includes(act)
                        ? 'bg-forest-900 text-gold border border-gold/40 shadow-xs'
                        : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {thingsToDo.includes(act) ? '✓ ' : '+ '}
                    {act}
                  </button>
                ))}
              </div>

              {/* Add Custom Activity */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customActivity}
                  onChange={e => setCustomActivity(e.target.value)}
                  placeholder="Add another activity..."
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
                <button
                  type="button"
                  onClick={handleAddCustomActivity}
                  className="px-4 py-2 rounded-xl bg-forest-900 text-white hover:bg-forest-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 & 4: LOCATION & ADDRESS */}
        <div className="pt-6 border-t border-stone-200">
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 03
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              LOCATION
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Click anywhere on the map or use your device geolocation to pin this destination.
            </p>
          </div>

          {/* Interactive Location Map Picker */}
          <div className="space-y-4">
            <InteractiveDhemajiMap
              isPickerMode={true}
              initialLat={latitude}
              initialLng={longitude}
              onLocationPicked={handleLocationPickedOnMap}
            />

            {/* Address field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Location / Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Village / Town / Area, Dhemaji, Assam"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: ACTION BUTTONS */}
        <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (validateForm()) {
                setIsPreviewOpen(true);
              }
            }}
            className="px-6 py-3.5 rounded-full border-2 border-forest-900 hover:bg-forest-900 hover:text-gold text-forest-900 font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>PREVIEW PLACE</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-8 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-extrabold text-xs uppercase tracking-widest shadow-gold-glow transition-all transform hover:scale-105 cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>SUBMIT PLACE</span>
          </button>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF8F2] border border-stone-200 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="p-6 bg-forest-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                  Submission Preview
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  Visitor Preview: {placeName || 'Untitled Place'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-stone-300 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Media preview */}
              <div className="relative h-60 rounded-2xl overflow-hidden">
                <img
                  src={images[coverImageIndex] || images[0]}
                  alt={placeName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-forest-900 text-gold text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-gold/40">
                  {category}
                </span>
              </div>

              {/* Gallery thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Thumbnail"
                      className="w-16 h-16 rounded-xl object-cover border border-stone-300 shrink-0"
                    />
                  ))}
                </div>
              )}

              <div>
                <h2 className="font-serif text-2xl font-bold text-forest-900 mb-1">
                  {placeName}
                </h2>
                <p className="text-xs text-emerald-800 font-semibold mb-3">
                  📍 {address}
                </p>
                <p className="text-sm text-charcoal leading-relaxed font-light">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <span className="font-bold text-stone-500 uppercase text-[10px] block">Best Time</span>
                  <span className="font-semibold text-forest-900">{bestTimeToVisit}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <span className="font-bold text-stone-500 uppercase text-[10px] block">Coordinates</span>
                  <span className="font-mono text-forest-900">{latitude}° N, {longitude}° E</span>
                </div>
              </div>

              {thingsToDo.length > 0 && (
                <div>
                  <span className="font-bold text-stone-500 uppercase text-[10px] block mb-2">Activities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {thingsToDo.map((act, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-forest-900/5 text-forest-900 text-xs font-medium">
                        ✓ {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-forest-900/5 text-xs text-charcoal-muted flex items-center justify-between">
                <span>Submitted by: <strong>{user?.displayName}</strong></span>
                <span>Status: <em>Pending Review</em></span>
              </div>
            </div>

            <div className="p-4 sm:px-8 bg-white border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-6 py-2.5 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                EDIT
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 text-xs font-extrabold uppercase tracking-wider shadow-gold-glow cursor-pointer"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT PLACE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
