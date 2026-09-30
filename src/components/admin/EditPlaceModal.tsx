import React, { useState } from 'react';
import { Place, PlaceCategory } from '../../types/place';
import { usePlaces } from '../../context/PlacesContext';
import { useAuth } from '../../context/AuthContext';
import { InteractiveDhemajiMap } from '../tourism/InteractiveDhemajiMap';
import {
  X,
  Trash2,
  Star,
  Upload,
  Check,
  AlertCircle,
  MapPin,
  Calendar,
  Save
} from 'lucide-react';

interface EditPlaceModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES: PlaceCategory[] = [
  'Nature',
  'River & Wetland',
  'Heritage',
  'Religious',
  'Cultural',
  'Photography',
  'Other'
];

export const EditPlaceModal: React.FC<EditPlaceModalProps> = ({
  place,
  isOpen,
  onClose,
  onSaved
}) => {
  const { updatePlace } = usePlaces();
  const { user, logAdminAction } = useAuth();

  const [placeName, setPlaceName] = useState(place.placeName);
  const [description, setDescription] = useState(place.description);
  const [category, setCategory] = useState<PlaceCategory>(place.category);
  const [address, setAddress] = useState(place.address);
  const [bestTimeToVisit, setBestTimeToVisit] = useState(place.bestTimeToVisit);
  const [latitude, setLatitude] = useState(place.latitude);
  const [longitude, setLongitude] = useState(place.longitude);
  const [images, setImages] = useState<string[]>(place.images || []);
  const [coverImage, setCoverImage] = useState<string>(place.coverImage || place.images?.[0] || '');
  const [thingsToDoText, setThingsToDoText] = useState((place.thingsToDo || []).join(', '));
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRemoveImage = (index: number) => {
    const removedImg = images[index];
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // If removed image was the cover, select first remaining image
    if (coverImage === removedImg) {
      setCoverImage(newImages[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');
    }
  };

  const handleSetCover = (imgUrl: string) => {
    setCoverImage(imgUrl);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (images.length >= 8) {
        setErrorMsg('Maximum 8 images allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const resultStr = uploadEvent.target.result as string;
          setImages(prev => [...prev, resultStr]);
          if (!coverImage) {
            setCoverImage(resultStr);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    if (!placeName.trim() || !description.trim()) {
      setErrorMsg('Place name and description are required.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('At least one image is required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    const parsedThingsToDo = thingsToDoText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const success = await updatePlace(place.id, {
      placeName: placeName.trim(),
      description: description.trim(),
      category,
      address: address.trim(),
      bestTimeToVisit: bestTimeToVisit.trim(),
      latitude,
      longitude,
      images,
      coverImage: coverImage || images[0],
      thingsToDo: parsedThingsToDo
    });

    setIsSaving(false);

    if (success) {
      setSuccessMsg('Place updated successfully.');
      if (user) {
        await logAdminAction({
          adminUid: user.uid,
          adminEmail: user.email,
          action: 'EDIT_PLACE',
          contentType: 'place',
          contentId: place.id,
          contentTitle: placeName.trim(),
          notes: `Updated category to ${category}, address to ${address}`
        });
      }
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1000);
    } else {
      setErrorMsg('Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F2] border border-stone-200 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-forest-900 text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
              Admin Moderation &amp; Editing
            </span>
            <h3 className="font-serif font-bold text-xl text-white">
              Edit Tourism Place: {place.placeName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-300 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Place Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Place Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={placeName}
                onChange={e => setPlaceName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as PlaceCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700 cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700 resize-y"
            />
          </div>

          {/* Image Management Section */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-900 block">
                  Place Images ({images.length})
                </span>
                <span className="text-[11px] text-stone-500">
                  Click 'Set Cover' to choose the primary thumbnail, or remove outdated photos.
                </span>
              </div>
              <label className="px-3.5 py-1.5 rounded-xl bg-forest-900 text-gold text-xs font-bold uppercase cursor-pointer hover:bg-forest-800 transition-colors inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Add Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleAddImage}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((img, idx) => {
                const isCover = coverImage === img;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-square group ${
                      isCover ? 'border-gold shadow-md' : 'border-stone-200'
                    }`}
                  >
                    <img src={img} alt="Place" className="w-full h-full object-cover" />
                    {isCover && (
                      <span className="absolute top-1.5 left-1.5 bg-gold text-forest-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                        Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md"
                          title="Delete image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(img)}
                          className="w-full py-1 bg-white text-forest-900 text-[9px] font-bold uppercase rounded-md cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Star className="w-2.5 h-2.5 text-gold-dark fill-gold" />
                          <span>Set Cover</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Address & Best Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Address / Location Text
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Best Time to Visit
              </label>
              <input
                type="text"
                value={bestTimeToVisit}
                onChange={e => setBestTimeToVisit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>

          {/* Things to Do */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
              Things to Do (Comma separated)
            </label>
            <input
              type="text"
              value={thingsToDoText}
              onChange={e => setThingsToDoText(e.target.value)}
              placeholder="e.g. Photography, River Boating, Bird Watching"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
            />
          </div>

          {/* Location Interactive Pin Map */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
              Coordinates &amp; Map Pin ({latitude}° N, {longitude}° E)
            </label>
            <InteractiveDhemajiMap
              isPickerMode={true}
              initialLat={latitude}
              initialLng={longitude}
              onLocationPicked={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-8 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-extrabold text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>SAVE CHANGES</span>
          </button>
        </div>
      </div>
    </div>
  );
};
