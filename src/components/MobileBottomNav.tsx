import React from 'react';
import { useTransit } from '../context/TransitContext';
import { Home, Compass, MapPin, Star } from 'lucide-react';

interface MobileBottomNavProps {
  onMoreClick?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = () => {
  const {
    activeTab,
    setActiveTab,
    setFavoritesOpen,
    setLocationModalOpen
  } = useTransit();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg safe-bottom">
      <div className="grid grid-cols-4 h-16 items-center px-1 max-w-md mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] rounded-xl transition-colors cursor-pointer select-none ${
            activeTab === 'home'
              ? 'text-orange-600 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Home"
        >
          <div className="relative">
            <Home className="w-5 h-5 stroke-[2.2]" />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-600 rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1 font-medium tracking-tight">Home</span>
        </button>

        {/* 2. Routes */}
        <button
          type="button"
          onClick={() => setActiveTab('routes')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] rounded-xl transition-colors cursor-pointer select-none ${
            activeTab === 'routes'
              ? 'text-orange-600 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Routes"
        >
          <div className="relative">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
            </svg>
            {activeTab === 'routes' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-600 rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1 font-medium tracking-tight">Routes</span>
        </button>

        {/* 3. Nearby */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('stops');
            setLocationModalOpen(true);
          }}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] rounded-xl transition-colors cursor-pointer select-none ${
            activeTab === 'stops'
              ? 'text-orange-600 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Nearby"
        >
          <div className="relative">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
            {activeTab === 'stops' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-600 rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1 font-medium tracking-tight">Nearby</span>
        </button>

        {/* 4. Saved */}
        <button
          type="button"
          onClick={() => setFavoritesOpen(true)}
          className="flex flex-col items-center justify-center h-full min-h-[48px] rounded-xl text-gray-500 hover:text-orange-600 transition-colors cursor-pointer select-none"
          aria-label="Saved"
        >
          <div className="relative">
            <Star className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] mt-1 font-medium tracking-tight">Saved</span>
        </button>
      </div>
    </nav>
  );
};
