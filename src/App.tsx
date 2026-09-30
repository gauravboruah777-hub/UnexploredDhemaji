import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlacesProvider } from './context/PlacesContext';
import { CultureProvider } from './context/CultureContext';
import { Place, TourismView } from './types/place';
import { CultureItem, CultureView } from './types/culture';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { GatewayCards } from './components/GatewayCards';
import { FeaturedStory } from './components/FeaturedStory';
import { MapPreview } from './components/MapPreview';
import { Footer } from './components/Footer';
import { ProfileModal } from './components/profile/ProfileModal';
import { AccountSettingsModal } from './components/profile/AccountSettingsModal';
import { MyContributionsModal } from './components/profile/MyContributionsModal';

// Tourism Sub-pages & Modals
import { TourismLandingPage } from './components/tourism/TourismLandingPage';
import { ExplorePlacesPage } from './components/tourism/ExplorePlacesPage';
import { AddPlacePage } from './components/tourism/AddPlacePage';
import { TourismMapPage } from './components/tourism/TourismMapPage';
import { PlaceDetailModal } from './components/tourism/PlaceDetailModal';

// Culture Sub-pages & Modals
import { CultureLandingPage } from './components/culture/CultureLandingPage';
import { ExploreCulturePage } from './components/culture/ExploreCulturePage';
import { CreateCulturePage } from './components/culture/CreateCulturePage';
import { CultureDetailModal } from './components/culture/CultureDetailModal';

// Admin System
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { ShieldAlert } from 'lucide-react';

function AuthenticatedApp() {
  const { user, isAuthenticated, isAdmin, isLoading, signOut } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('/home');

  // Active sub-view states
  const [activeTourismView, setActiveTourismView] = useState<TourismView | null>(null);
  const [activeCultureView, setActiveCultureView] = useState<CultureView | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [myContributionsModalOpen, setMyContributionsModalOpen] = useState(false);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<Place | null>(null);
  const [selectedCultureForModal, setSelectedCultureForModal] = useState<CultureItem | null>(null);
  const [focusedMapPlaceId, setFocusedMapPlaceId] = useState<string | undefined>(undefined);

  // Synchronize URL and route state
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const path = window.location.pathname;

      if (path === '/admin') {
        setCurrentRoute('/admin');
        setIsAdminView(true);
        setActiveTourismView(null);
        setActiveCultureView(null);
      } else if (path === '/tourism-places') {
        setCurrentRoute('/tourism-places');
        setIsAdminView(false);
        setActiveTourismView('selection');
        setActiveCultureView(null);
      } else if (path === '/explore-places') {
        setCurrentRoute('/explore-places');
        setIsAdminView(false);
        setActiveTourismView('explore');
        setActiveCultureView(null);
      } else if (path === '/add-place') {
        setCurrentRoute('/add-place');
        setIsAdminView(false);
        setActiveTourismView('add');
        setActiveCultureView(null);
      } else if (path === '/culture') {
        setCurrentRoute('/culture');
        setIsAdminView(false);
        setActiveCultureView('selection');
        setActiveTourismView(null);
      } else if (path === '/explore-culture') {
        setCurrentRoute('/explore-culture');
        setIsAdminView(false);
        setActiveCultureView('explore');
        setActiveTourismView(null);
      } else if (path === '/create-culture') {
        setCurrentRoute('/create-culture');
        setIsAdminView(false);
        setActiveCultureView('create');
        setActiveTourismView(null);
      } else if (path === '/map') {
        setCurrentRoute('/map');
        setIsAdminView(false);
        setActiveTourismView('map');
        setActiveCultureView(null);
      } else if (path === '/history') {
        setCurrentRoute('/history');
        setIsAdminView(false);
        setActiveTourismView(null);
        setActiveCultureView(null);
        setTimeout(() => {
          document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setCurrentRoute('/home');
        setIsAdminView(false);
        setActiveTourismView(null);
        setActiveCultureView(null);
        window.history.replaceState(null, '', '/home');
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, []);

  const handleNavigateTourism = (route: string, view: TourismView | null = null) => {
    setCurrentRoute(route);
    setIsAdminView(false);
    setActiveTourismView(view);
    setActiveCultureView(null);
    window.history.pushState(null, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCulture = (route: string, view: CultureView | null = null) => {
    setCurrentRoute(route);
    setIsAdminView(false);
    setActiveCultureView(view);
    setActiveTourismView(null);
    window.history.pushState(null, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAdmin = () => {
    setCurrentRoute('/admin');
    setIsAdminView(true);
    setActiveTourismView(null);
    setActiveCultureView(null);
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (targetSectionId?: string) => {
    setCurrentRoute('/home');
    setIsAdminView(false);
    setActiveTourismView(null);
    setActiveCultureView(null);
    window.history.pushState(null, '', '/home');
    if (targetSectionId) {
      setTimeout(() => {
        document.getElementById(targetSectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHeaderRouteChange = (route: string) => {
    if (route === '/tourism-places') {
      handleNavigateTourism('/tourism-places', 'selection');
    } else if (route === '/culture') {
      handleNavigateCulture('/culture', 'selection');
    } else if (route === '/map') {
      handleNavigateTourism('/map', 'map');
    } else if (route === '/admin') {
      handleNavigateAdmin();
    } else if (route === '/home') {
      handleNavigateHome('hero');
    } else if (route === '/history') {
      handleNavigateHome('history');
    } else {
      handleNavigateHome();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-gold border-t-transparent animate-spin mb-4" />
        <span className="font-serif tracking-widest text-xs uppercase text-forest-900 font-bold">
          UNEXPLORED DHEMAJI
        </span>
      </div>
    );
  }

  // Admin Route: Authentication required only for /admin
  if (isAdminView || currentRoute === '/admin') {
    if (!user) {
      return (
        <AdminLoginPage
          onSuccess={() => {
            setIsAdminView(true);
          }}
          onBackToHome={() => handleNavigateHome()}
        />
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-red-200 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#112F23] mb-2">
              Access Denied
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 font-light">
              Access denied. Administrator privileges are required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={signOut}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#112F23] text-[#D99B26] hover:bg-[#1a4232] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={() => handleNavigateHome()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminDashboard
        onBackToHome={() => handleNavigateHome()}
        onPreviewPlace={(place) => setSelectedPlaceForModal(place)}
        onPreviewCulture={(culture) => setSelectedCultureForModal(culture)}
        onSignOut={signOut}
      />
    );
  }

  return (
    <div className="bg-[#FAF8F2] text-[#1F2923] font-sans antialiased min-h-screen selection:bg-[#D99B26] selection:text-[#071811] flex flex-col justify-between">
      {/* Fixed Header with Navigation, Admin Badge & User Profile Dropdown */}
      <Header
        currentRoute={currentRoute}
        onRouteChange={handleHeaderRouteChange}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenAdminDashboard={handleNavigateAdmin}
        onOpenMyContributions={() => setMyContributionsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ================= TOURISM PLACES SECTION ================= */}
        {activeTourismView === 'selection' && (
          <TourismLandingPage
            onSelectExplore={() => handleNavigateTourism('/explore-places', 'explore')}
            onSelectAddPlace={() => handleNavigateTourism('/add-place', 'add')}
            onBackToHome={() => handleNavigateHome()}
          />
        )}

        {activeTourismView === 'explore' && (
          <ExplorePlacesPage
            onBackToSelection={() => handleNavigateTourism('/tourism-places', 'selection')}
            onOpenAddPlace={() => handleNavigateTourism('/add-place', 'add')}
            onSelectPlaceDetails={(place) => setSelectedPlaceForModal(place)}
            onOpenMapFull={() => handleNavigateTourism('/map', 'map')}
          />
        )}

        {activeTourismView === 'add' && (
          <AddPlacePage
            onBackToSelection={() => handleNavigateTourism('/tourism-places', 'selection')}
            onSuccessDone={() => handleNavigateTourism('/explore-places', 'explore')}
            onViewCreatedPlace={(place) => {
              setSelectedPlaceForModal(place);
              handleNavigateTourism('/explore-places', 'explore');
            }}
          />
        )}

        {activeTourismView === 'map' && (
          <TourismMapPage
            onBack={() => handleNavigateTourism('/explore-places', 'explore')}
            onSelectPlaceDetails={(place) => setSelectedPlaceForModal(place)}
            onOpenAddPlace={() => handleNavigateTourism('/add-place', 'add')}
            focusedPlaceId={focusedMapPlaceId}
          />
        )}

        {/* ================= CULTURE SECTION ================= */}
        {activeCultureView === 'selection' && (
          <CultureLandingPage
            onSelectExploreCulture={() => handleNavigateCulture('/explore-culture', 'explore')}
            onSelectCreateCulture={() => handleNavigateCulture('/create-culture', 'create')}
            onBackToHome={() => handleNavigateHome()}
          />
        )}

        {activeCultureView === 'explore' && (
          <ExploreCulturePage
            onBackToSelection={() => handleNavigateCulture('/culture', 'selection')}
            onOpenCreateCulture={() => handleNavigateCulture('/create-culture', 'create')}
            onSelectCultureDetails={(item) => setSelectedCultureForModal(item)}
          />
        )}

        {activeCultureView === 'create' && (
          <CreateCulturePage
            onBackToSelection={() => handleNavigateCulture('/culture', 'selection')}
            onSuccessDone={() => handleNavigateCulture('/explore-culture', 'explore')}
            onViewCreatedCulture={(item) => {
              setSelectedCultureForModal(item);
              handleNavigateCulture('/explore-culture', 'explore');
            }}
          />
        )}

        {/* ================= HOMEPAGE (ALL 4 SECTIONS PRESERVED) ================= */}
        {activeTourismView === null && activeCultureView === null && (
          <>
            {/* Hero Section */}
            <HeroSection />

            {/* 4 Pillar Gateways Grid */}
            <GatewayCards
              onOpenTourismPlaces={() => handleNavigateTourism('/tourism-places', 'selection')}
              onOpenCulture={() => handleNavigateCulture('/culture', 'selection')}
              onOpenMap={() => handleNavigateTourism('/map', 'map')}
            />

            {/* Featured Story: Living Upper Assam Heritage */}
            <FeaturedStory />

            {/* Interactive Cartography Showcase */}
            <MapPreview />
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer onOpenAdmin={handleNavigateAdmin} />

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlaceForModal}
        onClose={() => setSelectedPlaceForModal(null)}
        onViewOnMap={(place) => {
          setSelectedPlaceForModal(null);
          setFocusedMapPlaceId(place.id);
          handleNavigateTourism('/map', 'map');
        }}
      />

      {/* Culture Detail Modal */}
      <CultureDetailModal
        item={selectedCultureForModal}
        onClose={() => setSelectedCultureForModal(null)}
      />

      {/* My Contributions Modal */}
      <MyContributionsModal
        isOpen={myContributionsModalOpen}
        onClose={() => setMyContributionsModalOpen(false)}
        onSelectPlace={(place) => setSelectedPlaceForModal(place)}
        onSelectCulture={(culture) => setSelectedCultureForModal(culture)}
      />

      {/* User Profile Modal */}
      {user && (
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onSignOut={signOut}
          onOpenSettings={() => setSettingsModalOpen(true)}
        />
      )}

      {/* Account Settings Modal */}
      {user && (
        <AccountSettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlacesProvider>
        <CultureProvider>
          <AuthenticatedApp />
        </CultureProvider>
      </PlacesProvider>
    </AuthProvider>
  );
}
