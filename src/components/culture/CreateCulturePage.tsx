import React, { useState, useRef } from 'react';
import { CultureItem, CultureCategory } from '../../types/culture';
import { useAuth } from '../../context/AuthContext';
import { useCulture } from '../../context/CultureContext';
import { InteractiveDhemajiMap } from '../tourism/InteractiveDhemajiMap';
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
  AlertCircle,
  Video,
  Feather,
  BookOpen
} from 'lucide-react';

interface CreateCulturePageProps {
  onBackToSelection: () => void;
  onSuccessDone: () => void;
  onViewCreatedCulture: (item: CultureItem) => void;
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

export const CreateCulturePage: React.FC<CreateCulturePageProps> = ({
  onBackToSelection,
  onSuccessDone,
  onViewCreatedCulture
}) => {
  const { user } = useAuth();
  const { addCultureItem } = useCulture();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CultureCategory>('Folk Dance & Music');
  const [description, setDescription] = useState('');
  const [community, setCommunity] = useState('');
  const [villageOrArea, setVillageOrArea] = useState('');
  const [language, setLanguage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [history, setHistory] = useState('');
  const [significance, setSignificance] = useState('');
  const [howPracticed, setHowPracticed] = useState('');

  // Location State
  const [latitude, setLatitude] = useState<number>(27.483);
  const [longitude, setLongitude] = useState<number>(94.581);

  // Photos State (up to 8 images)
  const [images, setImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [createdCulture, setCreatedCulture] = useState<CultureItem | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // File Upload Handlers
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage('');

    const newImages: string[] = [...images];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    Array.from(files).forEach((file) => {
      if (newImages.length >= 8) {
        setErrorMessage('Maximum 8 photos allowed per cultural story.');
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
            if (prev.length >= 8) return prev;
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

  // Location Handlers
  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          setLatitude(lat);
          setLongitude(lng);
          if (!villageOrArea) {
            setVillageOrArea(`Community Coordinate (${lat}° N, ${lng}° E), Dhemaji`);
          }
        },
        () => {
          setErrorMessage('Unable to retrieve current location. Please select on the map.');
        }
      );
    }
  };

  const handleLocationPickedOnMap = (lat: number, lng: number, suggested?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    if (suggested && !villageOrArea) {
      setVillageOrArea(suggested);
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    setErrorMessage('');
    if (!title.trim()) {
      setErrorMessage('Please enter the name of the culture or tradition.');
      return false;
    }
    if (!category) {
      setErrorMessage('Please select a cultural category.');
      return false;
    }
    if (!description.trim() || description.trim().length < 20) {
      setErrorMessage('Please provide a descriptive explanation (at least 20 characters).');
      return false;
    }
    if (images.length === 0) {
      setErrorMessage('Please upload at least one photograph to illustrate this tradition.');
      return false;
    }
    if (!community.trim()) {
      setErrorMessage('Please indicate the community or group associated with this tradition.');
      return false;
    }
    if (!villageOrArea.trim()) {
      setErrorMessage('Please specify the village or area where this tradition is practiced.');
      return false;
    }
    return true;
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const coverImage = images[coverImageIndex] || images[0];

    const contributorId = user?.uid || ('guest_' + Math.random().toString(36).substring(2, 9));
    const contributorName = user?.displayName || 'Traveler Contributor';
    const contributorEmail = user?.email || '';

    const result = await addCultureItem({
      title: title.trim(),
      category,
      description: description.trim(),
      images,
      coverImage,
      community: community.trim(),
      villageOrArea: villageOrArea.trim(),
      language: language.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      latitude,
      longitude,
      history: history.trim() || undefined,
      significance: significance.trim() || undefined,
      howPracticed: howPracticed.trim() || undefined,
      contributorId,
      contributorName,
      contributorEmail
    });

    setIsSubmitting(false);

    if (result.success) {
      const createdObj: CultureItem = {
        id: result.id || 'new_culture',
        title: title.trim(),
        category,
        description: description.trim(),
        images,
        coverImage,
        community: community.trim(),
        villageOrArea: villageOrArea.trim(),
        language: language.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        latitude,
        longitude,
        history: history.trim() || undefined,
        significance: significance.trim() || undefined,
        howPracticed: howPracticed.trim() || undefined,
        contributorId,
        contributorName,
        contributorEmail,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      setCreatedCulture(createdObj);
      setIsPreviewOpen(false);
      setIsSubmittedSuccess(true);
    } else {
      setErrorMessage(result.error || 'Failed to submit cultural story. Please try again.');
    }
  };

  // SUCCESS SCREEN
  if (isSubmittedSuccess && createdCulture) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fadeIn text-center">
        <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-12 shadow-deep-card border border-stone-200/90 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-600/30 flex items-center justify-center text-4xl mb-6 shadow-md animate-bounce">
            ✓
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-800 mb-2 block">
            Cultural Archive Submission Received
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
            CULTURE SHARED SUCCESSFULLY!
          </h1>

          <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-4 font-normal">
            Thank you for helping preserve and share the cultural heritage of Dhemaji.
          </p>

          <p className="text-sm text-charcoal-muted max-w-lg mb-8 leading-relaxed font-light">
            Your cultural story <strong>"{createdCulture.title}"</strong> has been recorded with <strong>{createdCulture.images.length} photograph(s)</strong>. It is now awaiting editorial verification before appearing publicly in the living heritage archive.
          </p>

          {/* Snapshot Card */}
          <div className="w-full max-w-md bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-8 text-left flex gap-4">
            <img
              src={createdCulture.coverImage}
              alt={createdCulture.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-gold-dark block">
                {createdCulture.category}
              </span>
              <h4 className="font-serif font-bold text-forest-900 text-sm truncate">
                {createdCulture.title}
              </h4>
              <p className="text-xs text-stone-500 truncate">{createdCulture.community} • {createdCulture.villageOrArea}</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Status: Pending Review</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full">
            <button
              type="button"
              onClick={() => onViewCreatedCulture(createdCulture)}
              className="px-6 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-gold font-bold text-xs uppercase tracking-wider border border-gold/40 shadow-md cursor-pointer transition-all transform hover:scale-105"
            >
              VIEW MY CONTRIBUTION
            </button>

            <button
              type="button"
              onClick={onSuccessDone}
              className="px-6 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-forest-900 font-bold text-xs uppercase tracking-wider shadow-gold-glow cursor-pointer transition-all transform hover:scale-105"
            >
              EXPLORE CULTURE
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
          <span>← Back to Culture Gateways</span>
        </button>
      </div>

      {/* Main Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-gold-dark font-serif text-xs font-bold tracking-[0.25em] uppercase block mb-2">
          HERITAGE REPOSITORY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 mb-3 tracking-tight">
          CREATE A CULTURAL STORY
        </h1>
        <p className="font-editorial italic text-lg sm:text-xl text-stone-600 mb-3 font-normal">
          Help preserve and share the cultural heritage of Dhemaji.
        </p>
        <div className="jaapi-glow-line h-0.5 w-28 mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-xl mx-auto font-light">
          Share a tradition, festival, craft, story, food, art form or cultural practice from your community.
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
                Verified Cultural Contributor
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
        {/* SECTION 1 & 2: TITLE & CATEGORY */}
        <div>
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 01
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Cultural Title &amp; Category
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Specify what this cultural tradition is called and classify its practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Name of Culture / Tradition <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Gumrag Dance, Gero Loom Weaving, Apong"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Cultural Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CultureCategory)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer"
              >
                {CULTURE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: DESCRIPTION */}
        <div className="pt-6 border-t border-stone-200">
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 02
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Tell Us About This Tradition
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Explain what it is, how it is practiced, who practices it, why it is important, and when it takes place.
            </p>
          </div>

          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tell us about this tradition... Explain its rituals, tools, garments, seasonal timing, and the stories behind it."
            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 resize-y"
          />
        </div>

        {/* SECTION 4: UPLOAD PHOTOS */}
        <div className="pt-6 border-t border-stone-200">
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 03
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Add Photos
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Upload photographs that help tell the story of this tradition (Max 8 photos, up to 10 MB each).
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
              Add photographs of weavers, dancers, ceremonies, artisans, or archival moments
            </p>
            <button
              type="button"
              className="px-6 py-2.5 rounded-full bg-forest-900 text-gold hover:bg-forest-800 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              CHOOSE PHOTOS
            </button>
          </div>

          {/* Photos Preview Grid */}
          {images.length > 0 && (
            <div className="mt-6">
              <span className="text-xs font-bold text-forest-900 block mb-3 uppercase tracking-wider">
                Attached Photos ({images.length}/8)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group/thumb rounded-2xl overflow-hidden border-2 transition-all shadow-xs bg-black/10 aspect-square"
                    style={{ borderColor: coverImageIndex === idx ? '#D99B26' : '#E2E8F0' }}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

                    {coverImageIndex === idx && (
                      <span className="absolute top-2 left-2 bg-gold text-forest-900 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md">
                        Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md"
                          title="Remove photo"
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

        {/* SECTION 5 & 6: COMMUNITY & VIDEO */}
        <div className="pt-6 border-t border-stone-200">
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 04
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Community &amp; Media
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Specify the community lineage, village, and optional video recording.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Community / Group <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={community}
                onChange={e => setCommunity(e.target.value)}
                placeholder="e.g. Mising, Deori, Chutia, Tai-Ahom"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Village / Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={villageOrArea}
                onChange={e => setVillageOrArea(e.target.value)}
                placeholder="e.g. Jonai, Bordoloni, Simen Chapori"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Language (Optional)
              </label>
              <input
                type="text"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                placeholder="e.g. Mising, Assamese"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>

          {/* Video URL */}
          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
              Add a Video (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="Paste video URL (YouTube, Vimeo, etc.)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
              <Video className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>

        {/* SECTION 7: CULTURAL LOCATION MAP */}
        <div className="pt-6 border-t border-stone-200">
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 05
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              WHERE CAN THIS CULTURE BE FOUND?
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Pin the geographic location or village center where this tradition is practiced.
            </p>
          </div>

          <div className="space-y-4">
            <InteractiveDhemajiMap
              isPickerMode={true}
              initialLat={latitude}
              initialLng={longitude}
              onLocationPicked={handleLocationPickedOnMap}
            />
          </div>
        </div>

        {/* SECTION 8 & 9: HISTORY & SIGNIFICANCE */}
        <div className="pt-6 border-t border-stone-200">
          <div className="mb-4">
            <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest block mb-1">
              SECTION 06
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              History &amp; Cultural Significance
            </h2>
            <p className="text-xs text-charcoal-muted font-light mt-0.5">
              Add context on origins, ritual meanings, and why preservation is vital.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                History &amp; Origin
              </label>
              <textarea
                rows={3}
                value={history}
                onChange={e => setHistory(e.target.value)}
                placeholder="Share the history or origin of this tradition... What do community elders recount?"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                Why is it important? (Significance)
              </label>
              <textarea
                rows={3}
                value={significance}
                onChange={e => setSignificance(e.target.value)}
                placeholder="Explain why this tradition is important to the community..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 resize-y"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
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
            <span>PREVIEW</span>
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
            <span>SUBMIT CULTURE</span>
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
                  Cultural Archive Preview
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  {title || 'Untitled Tradition'}
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
              <div className="relative h-60 rounded-2xl overflow-hidden">
                <img
                  src={images[coverImageIndex] || images[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-forest-900 text-gold text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-gold/40">
                  {category}
                </span>
              </div>

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
                  {title}
                </h2>
                <p className="text-xs text-emerald-800 font-semibold mb-3">
                  📍 {community} • {villageOrArea}
                </p>
                <p className="text-sm text-charcoal leading-relaxed font-light">
                  {description}
                </p>
              </div>

              {history && (
                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-500 uppercase text-[10px] block mb-1">History &amp; Origin</span>
                  <p className="text-xs text-charcoal font-light leading-relaxed">{history}</p>
                </div>
              )}

              {significance && (
                <div className="bg-gold/10 p-4 rounded-xl border border-gold/30">
                  <span className="font-bold text-gold-dark uppercase text-[10px] block mb-1">Cultural Significance</span>
                  <p className="text-xs text-forest-900 font-light leading-relaxed">{significance}</p>
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
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
