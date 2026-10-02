import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  Menu,
  X,
  Search,
  Globe,
  MapPin,
  Star,
  Shield,
  Info,
} from 'lucide-react';
import delhiYatraLogo from '../assets/delhi-yatra-logo.png';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSearchModalOpen,
    setLocationModalOpen,
    setAboutModalOpen,
    setFavoritesOpen,
    setAdminModalOpen,
    userLocation,
    requestUserLocation,
    language,
    setLanguage,
    t
  } = useTransit();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'routes', label: t.navRoutes },
    { id: 'stops', label: t.navStops },
    { id: 'alerts', label: t.navAlerts },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
        <div className="max-w-[1240px] mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-3">
          {/* Mobile Top-Left: Menu & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 rounded-xl focus:outline-none min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 focus:outline-none cursor-pointer py-1 text-left"
              aria-label="DTC Yatra Home"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs tracking-tight shadow-xs shrink-0 select-none">
                DTC
              </div>
              <div className="min-w-0">
                <div className="text-base font-black text-gray-900 tracking-tight leading-none">
                  DTC Yatra
                </div>
                <div className="text-[11px] text-gray-500 font-medium leading-none mt-1">
                  Delhi Bus Tracker
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap min-h-[38px] ${
                    isActive
                      ? 'text-orange-600 font-bold bg-orange-50/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: 📍 Current Location */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={requestUserLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-orange-50 active:bg-orange-100 text-gray-700 hover:text-orange-600 border border-gray-200/90 hover:border-orange-300 text-xs font-semibold transition cursor-pointer min-h-[42px] shadow-2xs"
              title="Locate my current position in Delhi"
              aria-label="Current Location"
            >
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="font-semibold">Current Location</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 bg-white hover:bg-gray-50 border border-gray-200/90 rounded-xl min-h-[42px] items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="Toggle Hindi / English"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="text-[11px]">{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Clean, white background with exact logo in drawer header) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-xl flex flex-col z-10 border-r border-gray-200">
            {/* Drawer Header with exact logo */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <img
                src={delhiYatraLogo}
                alt="Delhi Yatra"
                className="h-8 w-auto max-w-[160px] object-contain object-left"
              />
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-white">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer min-h-[44px] transition-colors ${
                      isActive
                        ? 'text-orange-600 font-bold bg-orange-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 my-2 border-t border-gray-100" />

              <button
                onClick={() => {
                  setFavoritesOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 min-h-[44px] cursor-pointer"
              >
                <Star className="w-4 h-4 text-orange-600" />
                <span>{t.navFavorites}</span>
              </button>

              <button
                onClick={() => {
                  setLocationModalOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 min-h-[44px] cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Location: {userLocation ? userLocation.name.split(',')[0] : 'Delhi'}</span>
              </button>

              <button
                onClick={() => {
                  setAdminModalOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 min-h-[44px] cursor-pointer"
              >
                <Shield className="w-4 h-4 text-gray-500" />
                <span>Admin & Diagnostics</span>
              </button>

              <button
                onClick={() => {
                  setAboutModalOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 min-h-[44px] cursor-pointer"
              >
                <Info className="w-4 h-4 text-gray-500" />
                <span>About Delhi Yatra</span>
              </button>
            </div>

            {/* Language toggle at bottom of drawer */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={toggleLanguage}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-800 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Globe className="w-4 h-4 text-orange-600" />
                <span>Language: {language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
