import React, { useEffect } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/Home/HeroSection';
import { QuickActions } from './components/Home/QuickActions';
import { LiveMapSection } from './components/Map/LiveMapSection';
import { NearbyBuses } from './components/Home/NearbyBuses';
import { ServiceAlertsSection } from './components/Home/ServiceAlertsSection';
import { PopularRoutes } from './components/Home/PopularRoutes';
import { LiveBusesView } from './components/LiveBuses/LiveBusesView';
import { RoutesView } from './components/Routes/RoutesView';
import { StopsView } from './components/Stops/StopsView';
import { JourneyPlannerView } from './components/JourneyPlanner/JourneyPlannerView';
import { AlertsView } from './components/Alerts/AlertsView';
import { MetroView } from './components/Metro/MetroView';
import { GlobalSearchModal } from './components/Search/GlobalSearchModal';
import { RouteDetailModal } from './components/RouteDetails/RouteDetailModal';
import { StopDetailModal } from './components/Stops/StopDetailModal';
import { ApiKeyModal } from './components/Settings/ApiKeyModal';
import { LocationSelectorModal } from './components/Location/LocationSelectorModal';
import { FavoritesModal } from './components/Favorites/FavoritesModal';
import { MetroInfoModal } from './components/Metro/MetroInfoModal';
import { MetroStationDetailModal } from './components/Metro/MetroStationDetailModal';
import { AdminModal } from './components/Admin/AdminModal';
import { AboutModal } from './components/About/AboutModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { gtfsApi } from './services/gtfsApi';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchModalOpen,
    setSearchModalOpen,
    selectRouteById,
    selectStopById,
  } = useTransit();

  // Global keyboard shortcut '/' or 'Ctrl+K' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !searchModalOpen) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          setSearchModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  // When a search query is submitted directly from the Hero search box
  const handleHeroSearchSubmit = async (query: string) => {
    const q = query.trim();
    if (!q) return;

    try {
      const res = await gtfsApi.search(q);
      if (res.routes.length > 0) {
        selectRouteById(res.routes[0].route_id);
        return;
      }
      if (res.stops.length > 0) {
        selectStopById(res.stops[0].stop_id);
        return;
      }
    } catch (err) {
      console.error('Hero search failed:', err);
    }

    setSearchModalOpen(true);
  };

  const isMapTab = activeTab === 'home' || activeTab === 'journey';

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-white text-gray-900 overflow-hidden font-sans select-none">
      {!isMapTab && <Navbar />}

      <main className={`flex-1 w-full ${isMapTab ? 'h-full p-0 overflow-hidden relative' : 'overflow-y-auto px-3 sm:px-4 py-3 pb-20 max-w-lg mx-auto'}`}>
        {isMapTab && <JourneyPlannerView />}
        {activeTab === 'live' && <LiveBusesView />}
        {activeTab === 'routes' && <RoutesView />}
        {activeTab === 'stops' && <StopsView />}
        {activeTab === 'alerts' && <AlertsView />}
      </main>

      {/* Fixed Mobile Bottom Navigation */}
      <MobileBottomNav onMoreClick={() => setActiveTab('home')} />

      {/* Global Modals */}
      <GlobalSearchModal />
      <RouteDetailModal />
      <StopDetailModal />
      <ApiKeyModal />
      <LocationSelectorModal />
      <FavoritesModal />
      <AdminModal />
      <AboutModal />
    </div>
  );
};

export default function App() {
  return (
    <TransitProvider>
      <MainContent />
    </TransitProvider>
  );
}
