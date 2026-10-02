import React, { useState, useEffect, useRef } from 'react';
import { useTransit } from '../../context/TransitContext';
import { gtfsApi } from '../../services/gtfsApi';
import { DELHI_METRO_STATIONS } from '../../data/delhiMetroData';
import {
  Search,
  ArrowUpDown,
  MapPin,
  Clock,
  ArrowRight,
  Crosshair,
  Sparkles,
  Train
} from 'lucide-react';

interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchSubmit }) => {
  const {
    requestUserLocation,
    userLocation,
    recentSearches,
    selectRouteById,
    selectStopById,
    openMetroStation,
    setActiveTab,
    language
  } = useTransit();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [routeSuggestions, setRouteSuggestions] = useState<any[]>([]);
  const [stopSuggestions, setStopSuggestions] = useState<any[]>([]);
  const [metroSuggestions, setMetroSuggestions] = useState<any[]>([]);

  // From / To Planner state (Default to Bijwasan -> Bamnoli example)
  const [fromQuery, setFromQuery] = useState('Bijwasan');
  const [toQuery, setToQuery] = useState('Bamnoli');
  const [fromStop, setFromStop] = useState<any | null>(null);
  const [toStop, setToStop] = useState<any | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const fromBoxRef = useRef<HTMLDivElement>(null);
  const toBoxRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (fromBoxRef.current && !fromBoxRef.current.contains(e.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toBoxRef.current && !toBoxRef.current.contains(e.target as Node)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Main global search debounce
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setRouteSuggestions([]);
      setStopSuggestions([]);
      setMetroSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const res = await gtfsApi.search(q);
        setRouteSuggestions(res.routes.slice(0, 4));
        setStopSuggestions(res.stops.slice(0, 5));

        const matchedMetro = DELHI_METRO_STATIONS.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.nameHindi.includes(q) ||
            m.lines.some((l) => l.toLowerCase().includes(q))
        ).slice(0, 3);
        setMetroSuggestions(matchedMetro);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search suggestion error:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // From query suggestions
  useEffect(() => {
    const q = fromQuery.trim();
    if (!q || fromStop?.stop_name === q) {
      setFromSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await gtfsApi.search(q);
        setFromSuggestions(res.stops.slice(0, 6));
        setShowFromDropdown(true);
      } catch (err) {
        setFromSuggestions([]);
      }
    }, 160);

    return () => clearTimeout(timer);
  }, [fromQuery, fromStop]);

  // To query suggestions
  useEffect(() => {
    const q = toQuery.trim();
    if (!q || toStop?.stop_name === q) {
      setToSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await gtfsApi.search(q);
        setToSuggestions(res.stops.slice(0, 6));
        setShowToDropdown(true);
      } catch (err) {
        setToSuggestions([]);
      }
    }, 160);

    return () => clearTimeout(timer);
  }, [toQuery, toStop]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSearchSubmit(searchQuery.trim());
    setShowSuggestions(false);
  };

  const handleSwapFromTo = () => {
    const tempQ = fromQuery;
    const tempStop = fromStop;
    setFromQuery(toQuery);
    setFromStop(toStop);
    setToQuery(tempQ);
    setToStop(tempStop);
  };

  const handleFindRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let currentFrom = fromStop;
    let currentTo = toStop;

    if (!currentFrom && fromQuery.trim()) {
      try {
        const res = await gtfsApi.search(fromQuery.trim());
        if (res.stops.length > 0) currentFrom = res.stops[0];
      } catch (err) {}
    }
    if (!currentTo && toQuery.trim()) {
      try {
        const res = await gtfsApi.search(toQuery.trim());
        if (res.stops.length > 0) currentTo = res.stops[0];
      } catch (err) {}
    }

    if (currentFrom && currentTo) {
      sessionStorage.setItem('jp_from', JSON.stringify(currentFrom));
      sessionStorage.setItem('jp_to', JSON.stringify(currentTo));
    } else if (fromQuery.trim() && toQuery.trim()) {
      sessionStorage.setItem('jp_from_text', fromQuery.trim());
      sessionStorage.setItem('jp_to_text', toQuery.trim());
    }
    setActiveTab('journey');
  };

  const handleQuickSelect = (from: string, to: string) => {
    setFromQuery(from);
    setToQuery(to);
    sessionStorage.setItem('jp_from_text', from);
    sessionStorage.setItem('jp_to_text', to);
    setActiveTab('journey');
  };

  return (
    <section className="pt-2 pb-5 max-w-[640px] mx-auto">
      {/* 1. App Header Greeting */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Delhi Transit Live
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {language === 'hi' ? 'कहाँ जाना है?' : 'Where are you going?'}
          </h1>
        </div>

        {/* Use My Location Quick Button */}
        <button
          type="button"
          onClick={() => requestUserLocation()}
          className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="Detect nearest bus stop"
        >
          <Crosshair className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Near Me</span>
        </button>
      </div>

      {/* 2. Top Premium Compact Search Card (Requirement 3) */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm space-y-3 relative">
        {/* FROM Input Box */}
        <div ref={fromBoxRef} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              FROM
            </span>
            {userLocation && (
              <button
                type="button"
                onClick={() => {
                  setFromQuery(userLocation.name);
                }}
                className="text-[11px] text-orange-600 hover:underline font-medium"
              >
                Use My Location
              </button>
            )}
          </div>

          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none shrink-0" />
            <input
              type="text"
              value={fromQuery}
              onChange={(e) => {
                setFromQuery(e.target.value);
                setFromStop(null);
              }}
              onFocus={() => {
                if (fromSuggestions.length > 0) setShowFromDropdown(true);
              }}
              placeholder="Starting stop (e.g. Bijwasan)"
              className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-medium min-h-[44px] transition-all"
            />
          </div>

          {/* From dropdown */}
          {showFromDropdown && fromSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
              {fromSuggestions.map((s) => (
                <div
                  key={`from-${s.stop_id}`}
                  onClick={() => {
                    setFromStop(s);
                    setFromQuery(s.stop_name);
                    setShowFromDropdown(false);
                  }}
                  className="p-3 hover:bg-orange-50/50 cursor-pointer text-xs font-semibold text-gray-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s.stop_name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">#{s.stop_id}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap button positioned between From & To */}
        <div className="relative flex justify-center -my-1 z-10">
          <button
            type="button"
            onClick={handleSwapFromTo}
            className="p-1.5 text-gray-600 hover:text-orange-600 bg-white border border-gray-200 hover:border-orange-500 rounded-full cursor-pointer transition-transform active:rotate-180 duration-200 shadow-xs"
            title="Swap Origin and Destination"
            aria-label="Swap From and To"
          >
            <ArrowUpDown className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* TO Input Box */}
        <div ref={toBoxRef} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              TO
            </span>
          </div>

          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-red-600 absolute left-3 pointer-events-none shrink-0" />
            <input
              type="text"
              value={toQuery}
              onChange={(e) => {
                setToQuery(e.target.value);
                setToStop(null);
              }}
              onFocus={() => {
                if (toSuggestions.length > 0) setShowToDropdown(true);
              }}
              placeholder="Destination stop (e.g. Bamnoli)"
              className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-medium min-h-[44px] transition-all"
            />
          </div>

          {/* To dropdown */}
          {showToDropdown && toSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
              {toSuggestions.map((s) => (
                <div
                  key={`to-${s.stop_id}`}
                  onClick={() => {
                    setToStop(s);
                    setToQuery(s.stop_name);
                    setShowToDropdown(false);
                  }}
                  className="p-3 hover:bg-orange-50/50 cursor-pointer text-xs font-semibold text-gray-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{s.stop_name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">#{s.stop_id}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary [ Find Buses ] Button: Vibrant DTC Orange */}
        <button
          type="button"
          onClick={() => handleFindRoute()}
          className="w-full mt-1 py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] shadow-sm hover:shadow-md"
        >
          <span>Find Buses</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 3. Quick Suggestions / Recent Searches Pills (Requirement 3) */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-semibold text-gray-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Popular Routes
          </span>
          <span className="text-[11px] text-gray-400">Tap to plan</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => handleQuickSelect('Bijwasan', 'Bamnoli')}
            className="shrink-0 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Bijwasan</span>
            <span className="text-orange-400">→</span>
            <span>Bamnoli</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect('Anand Vihar ISBT', 'Uttam Nagar')}
            className="shrink-0 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Anand Vihar</span>
            <span className="text-gray-400">→</span>
            <span>Uttam Nagar</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect('Saket', 'AIIMS')}
            className="shrink-0 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Saket</span>
            <span className="text-gray-400">→</span>
            <span>AIIMS</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect('Connaught Place', 'Nehru Place')}
            className="shrink-0 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>CP</span>
            <span className="text-gray-400">→</span>
            <span>Nehru Place</span>
          </button>
        </div>
      </div>

      {/* 4. Quick Bus Number / Stop Global Search Bar */}
      <div ref={searchBoxRef} className="relative mt-3 px-1">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSuggestions(true);
              }}
              placeholder="Or search bus number (e.g. 740, 578) / stop..."
              className="w-full pl-9 pr-14 py-2 text-xs sm:text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 min-h-[40px] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-1.5 px-2.5 py-1 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                Go
              </button>
            )}
          </div>
        </form>

        {/* Autocomplete suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute left-1 right-1 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-72 overflow-y-auto divide-y divide-gray-100">
            {loadingSuggestions && (
              <div className="p-3 text-xs text-gray-500 text-center">Searching transport database...</div>
            )}

            {/* Bus Routes */}
            {routeSuggestions.map((r) => (
              <div
                key={`route-${r.route_id}`}
                onClick={() => {
                  selectRouteById(r.route_id);
                  setShowSuggestions(false);
                }}
                className="p-2.5 hover:bg-orange-50/50 cursor-pointer flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-orange-600 text-sm tabular-nums">
                    Bus {r.route_short_name}
                  </span>
                  <span className="text-gray-600 text-xs truncate max-w-[200px]">
                    {r.origin_stop_name || 'Terminal'} → {r.dest_stop_name || 'Terminal'}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>
            ))}

            {/* Bus Stops */}
            {stopSuggestions.map((s) => (
              <div
                key={`stop-${s.stop_id}`}
                onClick={() => {
                  selectStopById(s.stop_id);
                  setShowSuggestions(false);
                }}
                className="p-2.5 hover:bg-orange-50/50 cursor-pointer flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-900 text-xs">{s.stop_name}</span>
                </div>
                <span className="text-[10px] text-gray-400">Stop #{s.stop_id}</span>
              </div>
            ))}

            {/* Metro Stations */}
            {metroSuggestions.map((m) => (
              <div
                key={`metro-${m.id}`}
                onClick={() => {
                  openMetroStation(m.id);
                  setShowSuggestions(false);
                }}
                className="p-2.5 hover:bg-orange-50/50 cursor-pointer flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <Train className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="font-medium text-gray-900 text-xs">{m.name}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">Metro</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
