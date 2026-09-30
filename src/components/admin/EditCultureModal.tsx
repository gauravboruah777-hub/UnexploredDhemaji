import React, { useState } from 'react';
import { CultureItem, CultureCategory } from '../../types/culture';
import { useCulture } from '../../context/CultureContext';
import { useAuth } from '../../context/AuthContext';
import { InteractiveDhemajiMap } from '../tourism/InteractiveDhemajiMap';
import {
  X,
  Trash2,
  Star,
  Upload,
  Check,
  AlertCircle,
  Save,
  Video
} from 'lucide-react';

interface EditCultureModalProps {
  item: CultureItem;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CULTURE_CATEGORIES: CultureCategory[] = [
  'Folk Dance & Music',
  'Festivals & Celebrations',
  'Traditional Weaving & Textiles',
  'Handicrafts & Art',
  'Traditional Food',
  'Traditional Lifestyle',
  'Traditional Dress',
  'Folklore & Stories',
  'Traditional Knowledge',
  'Communities & Heritage',
  'Other'
];

export const EditCultureModal: React.FC<EditCultureModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaved
}) => {
  const { updateCultureItem } = useCulture();
  const { user, logAdminAction } = useAuth();

  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState<CultureCategory>(item.category);
  const [description, setDescription] = useState(item.description);
  const [community, setCommunity] = useState(item.community);
  const [villageOrArea, setVillageOrArea] = useState(item.villageOrArea);
  const [language, setLanguage] = useState(item.language || '');
  const [history, setHistory] = useState(item.history || '');
  const [significance, setSignificance] = useState(item.significance || '');
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '');
  const [latitude, setLatitude] = useState(item.latitude);
  const [longitude, setLongitude] = useState(item.longitude);
  const [images, setImages] = useState<string[]>(item.images || []);
  const [coverImage, setCoverImage] = useState<string>(item.coverImage || item.images?.[0] || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRemoveImage = (index: number) => {
    const removedImg = images[index];
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (coverImage === removedImg) {
      setCoverImage(newImages[0] || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80');
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
        setErrorMsg('Maximum 8 photos allowed.');
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
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Title and description are required.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('At least one photograph is required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    const success = await updateCultureItem(item.id, {
      title: title.trim(),
      category,
      description: description.trim(),
      community: community.trim(),
      villageOrArea: villageOrArea.trim(),
      language: language.trim() || undefined,
      history: history.trim() || undefined,
      significance: significance.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      latitude,
      longitude,
      images,
      coverImage: coverImage || images[0]
    });

    setIsSaving(false);

    if (success) {
      setSuccessMsg('Cultural tradition updated successfully.');
      if (user) {
        await logAdminAction({
          adminUid: user.uid,
          adminEmail: user.email,
          action: 'EDIT_CULTURE',
          contentType: 'culture',
          contentId: item.id,
          contentTitle: title.trim(),
          notes: `Updated community to ${community}`
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
              Admin Cultural Moderation
            </span>
            <h3 className="font-serif font-bold text-xl text-white">
              Edit Culture: {item.title}
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

        {/* Form Body */}
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

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Culture / Tradition Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Cultural Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CultureCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700 cursor-pointer"
              >
                {CULTURE_CATEGORIES.map(cat => (
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

          {/* Photos Management */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-900 block">
                  Cultural Photographs ({images.length})
                </span>
                <span className="text-[11px] text-stone-500">
                  Select cover photo or delete inaccurate media.
                </span>
              </div>
              <label className="px-3.5 py-1.5 rounded-xl bg-forest-900 text-gold text-xs font-bold uppercase cursor-pointer hover:bg-forest-800 transition-colors inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Add Photo</span>
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
                    <img src={img} alt="Culture" className="w-full h-full object-cover" />
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

          {/* Community, Village, Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Community / Group
              </label>
              <input
                type="text"
                value={community}
                onChange={e => setCommunity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Village / Area
              </label>
              <input
                type="text"
                value={villageOrArea}
                onChange={e => setVillageOrArea(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Language
              </label>
              <input
                type="text"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
              Demonstration Video Link (YouTube / Vimeo)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700"
            />
          </div>

          {/* History & Significance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                History &amp; Origin
              </label>
              <textarea
                rows={3}
                value={history}
                onChange={e => setHistory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Cultural Significance
              </label>
              <textarea
                rows={3}
                value={significance}
                onChange={e => setSignificance(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:ring-2 focus:ring-forest-700 resize-y"
              />
            </div>
          </div>

          {/* Map Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
              Location Pin ({latitude}° N, {longitude}° E)
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
