import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlaces } from '../../context/PlacesContext';
import { useCulture } from '../../context/CultureContext';
import { Place } from '../../types/place';
import { CultureItem } from '../../types/culture';
import { EditPlaceModal } from './EditPlaceModal';
import { EditCultureModal } from './EditCultureModal';
import {
  ShieldCheck,
  ShieldAlert,
  Compass,
  Feather,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  History,
  AlertTriangle,
  ExternalLink,
  LogOut,
  LayoutDashboard,
  CheckSquare,
  XOctagon,
  Activity,
  Menu,
  X,
  MapPin
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToHome: () => void;
  onPreviewPlace: (place: Place) => void;
  onPreviewCulture: (culture: CultureItem) => void;
  onSignOut?: () => void;
}

type TabType =
  | 'dashboard'
  | 'places'
  | 'culture'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'activity';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  onPreviewPlace,
  onPreviewCulture,
  onSignOut
}) => {
  const { user, isAdmin, adminAuditLogs, logAdminAction, signOut } = useAuth();
  const { places, updatePlaceStatus, deletePlace } = usePlaces();
  const { cultureItems, updateCultureStatus, deleteCultureItem } = useCulture();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters & Search
  const [placesStatusFilter, setPlacesStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [placesSearch, setPlacesSearch] = useState('');

  const [cultureStatusFilter, setCultureStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [cultureSearch, setCultureSearch] = useState('');

  // Editing Modals State
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [editingCulture, setEditingCulture] = useState<CultureItem | null>(null);

  // Deletion Confirmation Dialog State
  const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
  const [deletingCulture, setDeletingCulture] = useState<CultureItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string>('');

  // Strict check
  if (!isAdmin || !user) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 max-w-xl mx-auto text-center animate-fadeIn">
        <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-10 shadow-deep-card border border-red-200">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#112F23] mb-2">
            Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 font-light">
            Access denied. Administrator privileges are required.
          </p>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-6 py-2.5 rounded-full bg-[#112F23] text-[#D99B26] hover:bg-[#1a4232] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Exact Statistics
  const totalPlacesCount = places.length;
  const pendingPlacesCount = places.filter(p => p.status === 'pending').length;
  const approvedPlacesCount = places.filter(p => p.status === 'approved').length;

  const totalCultureCount = cultureItems.length;
  const pendingCultureCount = cultureItems.filter(c => c.status === 'pending').length;
  const approvedCultureCount = cultureItems.filter(c => c.status === 'approved').length;

  const totalPendingReviews = pendingPlacesCount + pendingCultureCount;

  // Filtered Places
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchStatus = placesStatusFilter === 'all' || place.status === placesStatusFilter;
      const q = placesSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        place.placeName.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q) ||
        (place.contributorName && place.contributorName.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [places, placesStatusFilter, placesSearch]);

  // Filtered Culture
  const filteredCulture = useMemo(() => {
    return cultureItems.filter(item => {
      const matchStatus = cultureStatusFilter === 'all' || item.status === cultureStatusFilter;
      const q = cultureSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.community.toLowerCase().includes(q) ||
        item.villageOrArea.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.contributorName && item.contributorName.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [cultureItems, cultureStatusFilter, cultureSearch]);

  // Combined Pending Streams
  const pendingPlacesList = useMemo(() => places.filter(p => p.status === 'pending'), [places]);
  const pendingCultureList = useMemo(() => cultureItems.filter(c => c.status === 'pending'), [cultureItems]);

  // Combined Approved Streams
  const approvedPlacesList = useMemo(() => places.filter(p => p.status === 'approved'), [places]);
  const approvedCultureList = useMemo(() => cultureItems.filter(c => c.status === 'approved'), [cultureItems]);

  // Combined Rejected Streams
  const rejectedPlacesList = useMemo(() => places.filter(p => p.status === 'rejected'), [places]);
  const rejectedCultureList = useMemo(() => cultureItems.filter(c => c.status === 'rejected'), [cultureItems]);

  // Admin Actions: Places
  const handleApprovePlace = async (place: Place) => {
    await updatePlaceStatus(place.id, 'approved');
    await logAdminAction({
      adminUid: user.uid,
      adminEmail: user.email,
      action: 'APPROVE_PLACE',
      contentType: 'place',
      contentId: place.id,
      contentTitle: place.placeName,
      notes: 'Approved for public listing'
    });
    setActionNotice(`Approved "${place.placeName}" for public discovery.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleRejectPlace = async (place: Place) => {
    await updatePlaceStatus(place.id, 'rejected');
    await logAdminAction({
      adminUid: user.uid,
      adminEmail: user.email,
      action: 'REJECT_PLACE',
      contentType: 'place',
      contentId: place.id,
      contentTitle: place.placeName,
      notes: 'Rejected by admin'
    });
    setActionNotice(`Marked "${place.placeName}" as rejected.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleConfirmDeletePlace = async () => {
    if (!deletingPlace) return;
    setIsDeleting(true);
    await deletePlace(deletingPlace.id);
    await logAdminAction({
      adminUid: user.uid,
      adminEmail: user.email,
      action: 'DELETE_PLACE',
      contentType: 'place',
      contentId: deletingPlace.id,
      contentTitle: deletingPlace.placeName,
      notes: 'Permanently deleted place'
    });
    setIsDeleting(false);
    setActionNotice(`Place "${deletingPlace.placeName}" deleted successfully.`);
    setDeletingPlace(null);
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Admin Actions: Culture
  const handleApproveCulture = async (item: CultureItem) => {
    await updateCultureStatus(item.id, 'approved');
    await logAdminAction({
      adminUid: user.uid,
      adminEmail: user.email,
      action: 'APPROVE_CULTURE',
      contentType: 'culture',
      contentId: item.id,
      contentTitle: item.title,
      notes: 'Approved cultural contribution'
    });
    setActionNotice(`Approved "${item.title}" for living cultural archive.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleRejectCulture = async (item: CultureItem) => {
    await updateCultureStatus(item.id, 'rejected');
    await logAdminAction({
      adminUid: user.uid,
      adminEmail: user.email,
      action: 'REJECT_CULTURE',
      contentType: 'culture',
      contentId: item.id,
      contentTitle: item.title,
      notes: 'Marked cultural story as rejected'
    });
    setActionNotice(`Marked "${item.title}" as rejected.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleConfirmDeleteCulture = async () => {
    if (!deletingCulture) return;
    setIsDeleting(true);
    await deleteCultureItem(deletingCulture.id);
    await logAdminAction({
      adminUid: user.uid,
      adminEmail: user.email,
      action: 'DELETE_CULTURE',
      contentType: 'culture',
      contentId: deletingCulture.id,
      contentTitle: deletingCulture.title,
      notes: 'Permanently deleted cultural entry'
    });
    setIsDeleting(false);
    setActionNotice(`Cultural entry "${deletingCulture.title}" deleted successfully.`);
    setDeletingCulture(null);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleSignOutClick = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      signOut();
    }
    onBackToHome();
  };

  const renderStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'places', label: 'Tourism Places', icon: Compass, count: totalPlacesCount },
    { id: 'culture', label: 'Culture', icon: Feather, count: totalCultureCount },
    { id: 'pending', label: 'Pending Reviews', icon: Clock, count: totalPendingReviews, highlight: totalPendingReviews > 0 },
    { id: 'approved', label: 'Approved Content', icon: CheckSquare },
    { id: 'rejected', label: 'Rejected Content', icon: XOctagon },
    { id: 'activity', label: 'Admin Activity', icon: Activity, count: adminAuditLogs.length },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-20">
      {/* Mobile Top Header for Admin */}
      <div className="lg:hidden bg-[#112F23] text-white px-4 py-3 flex items-center justify-between border-b border-[#D99B26]/30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D99B26]" />
          <span className="font-serif font-bold text-sm tracking-wider">Admin Dashboard</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-[#1a4232] text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* ================= EXACT SPEC SIDEBAR ================= */}
        <aside
          className={`lg:w-64 shrink-0 bg-white rounded-3xl p-5 shadow-xl border border-stone-200 flex flex-col justify-between ${
            mobileSidebarOpen ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div>
            {/* Admin identity badge */}
            <div className="p-3.5 rounded-2xl bg-[#112F23] text-white mb-6 border border-[#D99B26]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D99B26] text-[#112F23] flex items-center justify-center font-serif font-black text-sm shrink-0 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-xs truncate text-[#D99B26]">
                    {user.displayName}
                  </h4>
                  <p className="text-[10px] text-stone-300 uppercase tracking-wider font-semibold">
                    Super Administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#112F23] text-[#D99B26] shadow-sm font-bold'
                        : 'text-stone-700 hover:bg-[#FAF8F2] hover:text-[#112F23]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D99B26]' : 'text-stone-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.highlight
                            ? 'bg-amber-500 text-[#112F23]'
                            : isActive
                            ? 'bg-[#1a4232] text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 mt-6 border-t border-stone-100 space-y-2">
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-stone-400" />
              <span>Back to Website</span>
            </button>
            <button
              type="button"
              onClick={handleSignOutClick}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ================= MAIN DASHBOARD CONTENT ================= */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Action Notification Toast */}
          {actionNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{actionNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionNotice('')}
                className="text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Title */}
              <div>
                <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#966318] font-bold block mb-1">
                  OVERVIEW
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#112F23]">
                  District Moderation Dashboard
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Real-time statistics for submitted travel destinations and indigenous cultural traditions.
                </p>
              </div>

              {/* Exact 6 Dashboard Statistics Required */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* 1. Total Tourism Places */}
                <div
                  onClick={() => { setActiveTab('places'); setPlacesStatusFilter('all'); }}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-[#D99B26] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Tourism</span>
                    <Compass className="w-4 h-4 text-[#112F23]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-black text-[#112F23]">
                    {totalPlacesCount}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">Places cataloged</span>
                </div>

                {/* 2. Pending Tourism */}
                <div
                  onClick={() => { setActiveTab('places'); setPlacesStatusFilter('pending'); }}
                  className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer bg-amber-50/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Tourism</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-black text-amber-900">
                    {pendingPlacesCount}
                  </div>
                  <span className="text-[10px] text-amber-700/80 mt-1 block">Awaiting review</span>
                </div>

                {/* 3. Approved Tourism */}
                <div
                  onClick={() => { setActiveTab('places'); setPlacesStatusFilter('approved'); }}
                  className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer bg-emerald-50/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Approved Tourism</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-900">
                    {approvedPlacesCount}
                  </div>
                  <span className="text-[10px] text-emerald-700/80 mt-1 block">Live on map</span>
                </div>

                {/* 4. Total Culture Entries */}
                <div
                  onClick={() => { setActiveTab('culture'); setCultureStatusFilter('all'); }}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-[#D99B26] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Culture</span>
                    <Feather className="w-4 h-4 text-[#112F23]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-black text-[#112F23]">
                    {totalCultureCount}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">Heritage archives</span>
                </div>

                {/* 5. Pending Culture */}
                <div
                  onClick={() => { setActiveTab('culture'); setCultureStatusFilter('pending'); }}
                  className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer bg-amber-50/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Culture</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-black text-amber-900">
                    {pendingCultureCount}
                  </div>
                  <span className="text-[10px] text-amber-700/80 mt-1 block">Awaiting review</span>
                </div>

                {/* 6. Approved Culture */}
                <div
                  onClick={() => { setActiveTab('culture'); setCultureStatusFilter('approved'); }}
                  className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer bg-emerald-50/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Approved Culture</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-900">
                    {approvedCultureCount}
                  </div>
                  <span className="text-[10px] text-emerald-700/80 mt-1 block">Live on archive</span>
                </div>
              </div>

              {/* Urgent Pending Reviews Widget */}
              {totalPendingReviews > 0 ? (
                <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <h3 className="font-serif font-bold text-[#112F23] text-base">
                        Items Awaiting Moderation ({totalPendingReviews})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('pending')}
                      className="text-xs font-bold text-[#112F23] hover:text-[#D99B26] transition-colors"
                    >
                      View All Reviews →
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {pendingPlacesList.slice(0, 3).map((place) => (
                      <div key={place.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={place.coverImage || place.images[0]}
                            alt={place.placeName}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-xs text-[#112F23] truncate">
                              {place.placeName}
                            </h4>
                            <p className="text-[11px] text-stone-500 truncate">
                              Tourism • {place.category} • By {place.contributorName || 'Contributor'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleApprovePlace(place)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectPlace(place)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}

                    {pendingCultureList.slice(0, 3).map((culture) => (
                      <div key={culture.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={culture.coverImage || culture.images[0]}
                            alt={culture.title}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-xs text-[#112F23] truncate">
                              {culture.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 truncate">
                              Culture • {culture.category} • {culture.community}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleApproveCulture(culture)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectCulture(culture)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-sm text-[#112F23]">All Caught Up!</h4>
                  <p className="text-xs text-stone-500 mt-1">No pending tourism or culture submissions waiting for review.</p>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: TOURISM PLACES ================= */}
          {activeTab === 'places' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#112F23]">
                    Tourism Places ({places.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Approve, edit, delete, and manage photographic assets for destinations across Dhemaji.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 text-xs font-semibold">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPlacesStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                        placesStatusFilter === st
                          ? 'bg-[#112F23] text-white'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={placesSearch}
                  onChange={(e) => setPlacesSearch(e.target.value)}
                  placeholder="Search places by name, category, or address..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#112F23] focus:border-transparent outline-none"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>

              {/* Table / Cards List */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="divide-y divide-stone-100">
                  {filteredPlaces.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-500">
                      No tourism places match the selected filter.
                    </div>
                  ) : (
                    filteredPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F2]/60 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={place.coverImage || place.images[0]}
                            alt={place.placeName}
                            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-serif font-bold text-sm text-[#112F23] truncate">
                                {place.placeName}
                              </h4>
                              {renderStatusBadge(place.status)}
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1">
                              {place.category} • {place.address}
                            </p>
                            <span className="text-[10px] text-stone-400 mt-1 block">
                              Photos: {place.images?.length || 0} • Contributor: {place.contributorName || 'Community'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {place.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleApprovePlace(place)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {place.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleRejectPlace(place)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onPreviewPlace(place)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlace(place)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                            title="Edit details & images"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingPlace(place)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CULTURE ================= */}
          {activeTab === 'culture' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#112F23]">
                    Culture &amp; Heritage ({cultureItems.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Review and curate cultural folklore, traditional dances, weaving, and festivals.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 text-xs font-semibold">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setCultureStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                        cultureStatusFilter === st
                          ? 'bg-[#112F23] text-white'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={cultureSearch}
                  onChange={(e) => setCultureSearch(e.target.value)}
                  placeholder="Search culture by title, tribe, community, or village..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#112F23] focus:border-transparent outline-none"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>

              {/* Culture List */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="divide-y divide-stone-100">
                  {filteredCulture.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-500">
                      No cultural entries match the selected filter.
                    </div>
                  ) : (
                    filteredCulture.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F2]/60 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.coverImage || item.images[0]}
                            alt={item.title}
                            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-serif font-bold text-sm text-[#112F23] truncate">
                                {item.title}
                              </h4>
                              {renderStatusBadge(item.status)}
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1">
                              {item.category} • {item.community} • {item.villageOrArea}
                            </p>
                            <span className="text-[10px] text-stone-400 mt-1 block">
                              Photos: {item.images?.length || 0} • Contributor: {item.contributorName || 'Community'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {item.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleApproveCulture(item)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleRejectCulture(item)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onPreviewCulture(item)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCulture(item)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                            title="Edit details & images"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCulture(item)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: PENDING REVIEWS ================= */}
          {activeTab === 'pending' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#112F23]">
                  Pending Reviews ({totalPendingReviews})
                </h2>
                <p className="text-xs text-stone-500">
                  Submissions awaiting administrator approval before going live to the public.
                </p>
              </div>

              {totalPendingReviews === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-[#112F23]">No Pending Submissions</h3>
                  <p className="text-xs text-stone-500 mt-1">All contributor submissions have been moderated.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPlacesList.map((place) => (
                    <div
                      key={place.id}
                      className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={place.coverImage || place.images[0]}
                          alt={place.placeName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-900 text-gold">
                              Tourism Place
                            </span>
                            <h4 className="font-serif font-bold text-sm text-[#112F23]">{place.placeName}</h4>
                          </div>
                          <p className="text-xs text-stone-600 line-clamp-1">{place.description}</p>
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            Category: {place.category} • Contributor: {place.contributorName} ({place.contributorEmail || 'No email'})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => onPreviewPlace(place)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectPlace(place)}
                          className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprovePlace(place)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}

                  {pendingCultureList.map((culture) => (
                    <div
                      key={culture.id}
                      className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={culture.coverImage || culture.images[0]}
                          alt={culture.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#966318] text-white">
                              Culture &amp; Heritage
                            </span>
                            <h4 className="font-serif font-bold text-sm text-[#112F23]">{culture.title}</h4>
                          </div>
                          <p className="text-xs text-stone-600 line-clamp-1">{culture.description}</p>
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            Community: {culture.community} • Village: {culture.villageOrArea}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => onPreviewCulture(culture)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectCulture(culture)}
                          className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveCulture(culture)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: APPROVED CONTENT ================= */}
          {activeTab === 'approved' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#112F23]">
                  Approved Public Content ({approvedPlacesList.length + approvedCultureList.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Content currently published and discoverable by public visitors on the website.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedPlacesList.map((place) => (
                  <div key={place.id} className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={place.coverImage || place.images[0]} alt={place.placeName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Tourism Place</span>
                        <h4 className="font-serif font-bold text-xs text-[#112F23] truncate">{place.placeName}</h4>
                        <p className="text-[11px] text-stone-400 truncate">{place.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => setEditingPlace(place)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setDeletingPlace(place)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {approvedCultureList.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.coverImage || item.images[0]} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-[#966318] uppercase tracking-wider block">Culture Heritage</span>
                        <h4 className="font-serif font-bold text-xs text-[#112F23] truncate">{item.title}</h4>
                        <p className="text-[11px] text-stone-400 truncate">{item.community}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => setEditingCulture(item)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setDeletingCulture(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 6: REJECTED CONTENT ================= */}
          {activeTab === 'rejected' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#112F23]">
                  Rejected Content ({rejectedPlacesList.length + rejectedCultureList.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Submissions rejected by administrators. You can re-approve or permanently delete them.
                </p>
              </div>

              {rejectedPlacesList.length === 0 && rejectedCultureList.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <CheckCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">No rejected content currently.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rejectedPlacesList.map((place) => (
                    <div key={place.id} className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={place.coverImage || place.images[0]} alt={place.placeName} className="w-14 h-14 rounded-xl object-cover shrink-0 grayscale" />
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-red-700 uppercase tracking-wider block">Rejected Place</span>
                          <h4 className="font-serif font-bold text-xs text-stone-700 truncate">{place.placeName}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApprovePlace(place)}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingPlace(place)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {rejectedCultureList.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={item.coverImage || item.images[0]} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0 grayscale" />
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-red-700 uppercase tracking-wider block">Rejected Culture</span>
                          <h4 className="font-serif font-bold text-xs text-stone-700 truncate">{item.title}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApproveCulture(item)}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCulture(item)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 7: ADMIN ACTIVITY ================= */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#112F23]">
                  Admin Activity ({adminAuditLogs.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Immutable audit trail of administrative moderation actions logged to the <code>adminActions</code> Firestore collection.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF8F2] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Item Title</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Administrator</th>
                        <th className="py-3 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {adminAuditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-stone-400">
                            No administrative actions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        adminAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-[#FAF8F2]/60">
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  log.action.includes('APPROVE')
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : log.action.includes('DELETE')
                                    ? 'bg-red-100 text-red-800'
                                    : log.action.includes('REJECT')
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-serif font-bold text-[#112F23] max-w-xs truncate">
                              {log.contentTitle || log.contentId}
                            </td>
                            <td className="py-3 px-4 uppercase text-[10px] font-bold text-stone-500">
                              {log.contentType}
                            </td>
                            <td className="py-3 px-4 text-stone-600 text-[11px] font-semibold">
                              Verified Admin
                            </td>
                            <td className="py-3 px-4 text-stone-400 text-[11px]">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Place Edit Modal */}
      {editingPlace && (
        <EditPlaceModal
          place={editingPlace}
          isOpen={true}
          onClose={() => setEditingPlace(null)}
          onSaved={() => {
            setEditingPlace(null);
            setActionNotice('Place details updated.');
            setTimeout(() => setActionNotice(''), 4000);
          }}
        />
      )}

      {/* Culture Edit Modal */}
      {editingCulture && (
        <EditCultureModal
          item={editingCulture}
          isOpen={true}
          onClose={() => setEditingCulture(null)}
          onSaved={() => {
            setEditingCulture(null);
            setActionNotice('Cultural entry details updated.');
            setTimeout(() => setActionNotice(''), 4000);
          }}
        />
      )}

      {/* Deletion Dialog for Place */}
      {deletingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-center text-[#112F23] mb-2">
              Delete Place Submission?
            </h3>
            <p className="text-xs text-stone-600 text-center mb-6">
              Are you sure you want to permanently delete <strong>"{deletingPlace.placeName}"</strong>? This will remove all associated details from Firestore.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingPlace(null)}
                className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeletePlace}
                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Place'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Dialog for Culture */}
      {deletingCulture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-center text-[#112F23] mb-2">
              Delete Cultural Story?
            </h3>
            <p className="text-xs text-stone-600 text-center mb-6">
              Are you sure you want to permanently delete <strong>"{deletingCulture.title}"</strong>? This will remove all associated cultural documentation from Firestore.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingCulture(null)}
                className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteCulture}
                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Story'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
