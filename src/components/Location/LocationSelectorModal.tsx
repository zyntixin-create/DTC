import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { MapPin, Navigation, X, Check, Search, Crosshair } from 'lucide-react';

interface LandmarkLocation {
  name: string;
  area: string;
  lat: number;
  lng: number;
}

const DELHI_LANDMARKS: LandmarkLocation[] = [
  { name: 'Connaught Place / Rajiv Chowk', area: 'Central Delhi', lat: 28.6328, lng: 77.2197 },
  { name: 'Dhaula Kuan Interchange', area: 'South-West Delhi', lat: 28.5921, lng: 77.1563 },
  { name: 'Kashmere Gate ISBT', area: 'North Delhi', lat: 28.6672, lng: 77.2285 },
  { name: 'Anand Vihar ISBT', area: 'East Delhi', lat: 28.6475, lng: 77.3150 },
  { name: 'AIIMS / Safdarjung', area: 'South Delhi', lat: 28.5672, lng: 77.2100 },
  { name: 'Nehru Place Terminal', area: 'South Delhi', lat: 28.5494, lng: 77.2528 },
  { name: 'Uttam Nagar Terminal', area: 'West Delhi', lat: 28.6220, lng: 77.0655 },
  { name: 'Karol Bagh / Pusa Road', area: 'Central-West Delhi', lat: 28.6440, lng: 77.1900 },
  { name: 'Lajpat Nagar Ring Road', area: 'South Delhi', lat: 28.5700, lng: 77.2400 },
  { name: 'Sarai Kale Khan ISBT', area: 'South-East Delhi', lat: 28.5880, lng: 77.2560 },
  { name: 'Azadpur Terminal', area: 'North Delhi', lat: 28.7060, lng: 77.1810 },
  { name: 'IGI Airport Terminal 3', area: 'South-West Delhi', lat: 28.5562, lng: 77.1000 },
  { name: 'Badarpur Border', area: 'South Delhi Border', lat: 28.4912, lng: 77.3015 },
  { name: 'Rohini Sector 14 / East', area: 'North-West Delhi', lat: 28.7120, lng: 77.1280 },
];

export const LocationSelectorModal: React.FC = () => {
  const {
    locationModalOpen,
    setLocationModalOpen,
    userLocation,
    setManualLocation,
    requestUserLocation,
    locationStatus,
  } = useTransit();

  const [query, setQuery] = useState('');

  if (!locationModalOpen) return null;

  const filtered = DELHI_LANDMARKS.filter(
    (l) => l.name.toLowerCase().includes(query.toLowerCase()) || l.area.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-gray-900">Your Delhi Location</h3>
          </div>
          <button
            onClick={() => setLocationModalOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Location Button */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <button
            onClick={() => {
              requestUserLocation();
              setLocationModalOpen(false);
            }}
            className="w-full py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Crosshair className="w-4 h-4" />
            <span>{locationStatus === 'granted' ? 'GPS Location Active' : 'Use Current GPS Location'}</span>
          </button>
        </div>

        {/* Filter input */}
        <div className="p-3 border-b border-gray-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search major Delhi landmark or hub..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Landmarks list */}
        <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white">
          {filtered.map((lm) => {
            const isSelected = userLocation && userLocation.name === lm.name;
            return (
              <div
                key={lm.name}
                onClick={() => {
                  setManualLocation(lm.lat, lm.lng, lm.name);
                  setLocationModalOpen(false);
                }}
                className="p-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer min-h-[44px] transition-colors"
              >
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">{lm.name}</div>
                  <div className="text-[11px] text-gray-500">{lm.area}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
