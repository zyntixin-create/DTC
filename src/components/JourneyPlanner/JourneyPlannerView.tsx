import React, { useState, useEffect, useRef } from 'react';
import { useTransit } from '../../context/TransitContext';
import { GtfsStop } from '../../types/transit';
import { gtfsApi } from '../../services/gtfsApi';
import { DelhiMap } from '../Map/DelhiMap';
import { DtcBusGraphic } from '../Common/DtcBusGraphic';
import {
  ArrowUpDown,
  ArrowRight,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCw,
  Bus as BusIcon,
  Navigation,
  X,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const JourneyPlannerView: React.FC = () => {
  const {
    activeJourneyOption,
    setActiveJourneyOption,
    requestUserLocation,
    userLocation,
    selectStopById
  } = useTransit();

  // Search input state
  const [fromQuery, setFromQuery] = useState('Bijwasan');
  const [toQuery, setToQuery] = useState('Bamnoli');
  const [fromStop, setFromStop] = useState<GtfsStop | null>(null);
  const [toStop, setToStop] = useState<GtfsStop | null>(null);

  // Suggestions state
  const [fromSuggestions, setFromSuggestions] = useState<GtfsStop[]>([]);
  const [toSuggestions, setToSuggestions] = useState<GtfsStop[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Journey calculation state
  const [journeyData, setJourneyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Selection & Route detail state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>(null);

  // Bottom Sheet UI state: 'search' | 'results' | 'minimized'
  // When results are available, 'results' is active
  const [sheetMode, setSheetMode] = useState<'search' | 'results'>('results');
  const [isMinimized, setIsMinimized] = useState(false);
  const [sheetHeight, setSheetHeight] = useState<'auto' | 'expanded'>('auto');

  const fromBoxRef = useRef<HTMLDivElement>(null);
  const toBoxRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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

  // Pre-fill from session storage or run default test: Bijwasan -> Bamnoli
  useEffect(() => {
    const rawFrom = sessionStorage.getItem('jp_from');
    const rawTo = sessionStorage.getItem('jp_to');
    if (rawFrom && rawTo) {
      try {
        const f = JSON.parse(rawFrom);
        const t = JSON.parse(rawTo);
        setFromStop(f);
        setFromQuery(f.stop_name);
        setToStop(t);
        setToQuery(t.stop_name);
        sessionStorage.removeItem('jp_from');
        sessionStorage.removeItem('jp_to');
        planJourney(f.stop_id, t.stop_id);
        return;
      } catch (e) {}
    }

    const textFrom = sessionStorage.getItem('jp_from_text');
    const textTo = sessionStorage.getItem('jp_to_text');
    if (textFrom && textTo) {
      sessionStorage.removeItem('jp_from_text');
      sessionStorage.removeItem('jp_to_text');
      setFromQuery(textFrom);
      setToQuery(textTo);
      planJourney(textFrom, textTo);
      return;
    }

    // Default initialization: Bijwasan -> Bamnoli
    planJourney('Bijwasan', 'Bamnoli');
  }, []);

  // Auto-suggestions for From
  useEffect(() => {
    const q = fromQuery.trim();
    if (!q || fromStop?.stop_name === q) {
      setFromSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await gtfsApi.search(q);
        setFromSuggestions(res.stops.slice(0, 5));
        setShowFromDropdown(true);
      } catch (e) {}
    }, 150);
    return () => clearTimeout(timer);
  }, [fromQuery, fromStop]);

  // Auto-suggestions for To
  useEffect(() => {
    const q = toQuery.trim();
    if (!q || toStop?.stop_name === q) {
      setToSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await gtfsApi.search(q);
        setToSuggestions(res.stops.slice(0, 5));
        setShowToDropdown(true);
      } catch (e) {}
    }, 150);
    return () => clearTimeout(timer);
  }, [toQuery, toStop]);

  const planJourney = async (fromIdOrName: string, toIdOrName: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await gtfsApi.planJourney(fromIdOrName, toIdOrName);
      setJourneyData(res);
      setSheetMode('results');
      setIsMinimized(false);

      if (res.directOptions && res.directOptions.length > 0) {
        setSelectedOptionId(res.directOptions[0].id);
        setActiveJourneyOption(res.directOptions[0]);
      } else if (res.connectingOptions && res.connectingOptions.length > 0) {
        setSelectedOptionId(res.connectingOptions[0].id);
        setActiveJourneyOption(res.connectingOptions[0]);
      } else {
        setSelectedOptionId(null);
        setActiveJourneyOption(null);
      }
    } catch (e) {
      console.error('Journey planning error:', e);
      setJourneyData(null);
      setSelectedOptionId(null);
      setActiveJourneyOption(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let curFrom = fromStop;
    let curTo = toStop;

    if (!curFrom && fromQuery.trim()) {
      const res = await gtfsApi.search(fromQuery.trim());
      if (res.stops.length > 0) curFrom = res.stops[0];
    }
    if (!curTo && toQuery.trim()) {
      const res = await gtfsApi.search(toQuery.trim());
      if (res.stops.length > 0) curTo = res.stops[0];
    }

    if (curFrom && curTo) {
      setFromStop(curFrom);
      setToStop(curTo);
      planJourney(curFrom.stop_id, curTo.stop_id);
    } else if (fromQuery.trim() && toQuery.trim()) {
      planJourney(fromQuery.trim(), toQuery.trim());
    }
  };

  const handleSwap = () => {
    const tempQ = fromQuery;
    const tempS = fromStop;
    setFromQuery(toQuery);
    setFromStop(toStop);
    setToQuery(tempQ);
    setToStop(tempS);
  };

  const handleQuickRouteSelect = (from: string, to: string) => {
    setFromQuery(from);
    setToQuery(to);
    setFromStop(null);
    setToStop(null);
    planJourney(from, to);
  };

  const handleTryNearbyStops = () => {
    if (journeyData?.nearbyBoardingStops?.length > 0 && journeyData?.nearbyDropoffStops?.length > 0) {
      const b = journeyData.nearbyBoardingStops[0];
      const d = journeyData.nearbyDropoffStops[0];
      setFromQuery(b.stop_name);
      setToQuery(d.stop_name);
      setFromStop(b);
      setToStop(d);
      planJourney(b.stop_id, d.stop_id);
    } else {
      handleQuickRouteSelect('Bijwasan Railway Station', 'Bamnoli Crossing');
    }
  };

  // Sort direct routes first
  const directList: any[] = (journeyData?.directOptions || []).slice().sort((a: any, b: any) => {
    const walkA = (a.walkToBoardingM || 0) + (a.walkFromDropoffM || 0);
    const walkB = (b.walkToBoardingM || 0) + (b.walkFromDropoffM || 0);
    if (Math.abs(walkA - walkB) > 100) return walkA - walkB;
    if (a.stopsCount !== b.stopsCount) return a.stopsCount - b.stopsCount;
    return (a.durationMin || 0) - (b.durationMin || 0);
  });

  const connectingList: any[] = (journeyData?.connectingOptions || []).slice().sort((a: any, b: any) => {
    if (a.busChanges !== b.busChanges) return a.busChanges - b.busChanges;
    if (a.totalStops !== b.totalStops) return a.totalStops - b.totalStops;
    return a.distanceKm - b.distanceKm;
  });

  const allOptions = [...directList, ...connectingList];

  const currentActiveOption = allOptions.find((o) => o.id === selectedOptionId) ||
    (allOptions.length > 0 ? allOptions[0] : null);

  const selectBusCard = (opt: any) => {
    setSelectedOptionId(opt.id);
    setActiveJourneyOption(opt);
  };

  const toggleRouteDetails = (optId: string) => {
    if (expandedOptionId === optId) {
      setExpandedOptionId(null);
    } else {
      setExpandedOptionId(optId);
      // Auto expand sheet height if minimized
      setIsMinimized(false);
      setSheetHeight('expanded');
    }
  };

  // Touch handlers for bottom sheet drag
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    touchStartY.current = null;

    if (diff > 45) {
      // Swiped UP -> expand sheet
      setIsMinimized(false);
      setSheetHeight('expanded');
    } else if (diff < -45) {
      // Swiped DOWN
      if (sheetHeight === 'expanded') {
        setSheetHeight('auto');
      } else {
        setIsMinimized(true);
      }
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-100 font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. FULL SCREEN LEAFLET MAP IN BACKGROUND                                  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <DelhiMap
          journeyOption={currentActiveOption}
          heightClass="h-full w-full"
          minimalControls={true}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING COMPACT TOP HEADER                                            */}
      {/* ========================================================================= */}
      <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 z-20 pointer-events-none">
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-gray-200/80 pointer-events-auto max-w-md mx-auto">
          {/* Left Brand: DTC Yatra / Delhi Bus Tracker */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs tracking-tight shadow-xs shrink-0 select-none">
              DTC
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-gray-900 tracking-tight leading-none">
                DTC Yatra
              </h1>
              <p className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">
                Delhi Bus Tracker
              </p>
            </div>
          </div>

          {/* Right: 📍 Location Icon Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={requestUserLocation}
              className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 active:bg-orange-200 text-orange-600 flex items-center justify-center transition cursor-pointer border border-orange-200/60 shadow-2xs"
              title="Locate my position in Delhi"
              aria-label="Current Location"
            >
              <Navigation className="w-4 h-4 fill-orange-600/20" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ROUNDED WHITE BOTTOM SHEET                                             */}
      {/* ========================================================================= */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`absolute left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200/80 flex flex-col transition-all duration-300 ease-out max-w-lg mx-auto ${
          isMinimized
            ? 'bottom-16 max-h-[85px]'
            : sheetHeight === 'expanded'
            ? 'bottom-16 top-16'
            : 'bottom-16 max-h-[78vh]'
        }`}
      >
        {/* Drag Handle Bar */}
        <div
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false);
            } else if (sheetHeight === 'expanded') {
              setSheetHeight('auto');
            } else {
              setSheetHeight('expanded');
            }
          }}
          className="w-full pt-2.5 pb-1 px-4 cursor-pointer select-none flex flex-col items-center shrink-0"
        >
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* ======================================================================= */}
        {/* SHEET CONTENT: SEARCH MODE OR RESULTS MODE                              */}
        {/* ======================================================================= */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1 space-y-3 no-scrollbar">
          {/* ------------------------------------------------------------------- */}
          {/* MODE A: BOTTOM SEARCH PANEL ("Where are you going?")                 */}
          {/* ------------------------------------------------------------------- */}
          {sheetMode === 'search' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-gray-900 tracking-tight">
                  Where are you going?
                </h2>
                {hasSearched && (
                  <button
                    type="button"
                    onClick={() => setSheetMode('results')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    View Results
                  </button>
                )}
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-2">
                {/* FROM Field */}
                <div ref={fromBoxRef} className="relative">
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-emerald-600 font-bold text-sm pointer-events-none">
                      📍
                    </span>
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
                      placeholder="From (e.g. Bijwasan)"
                      className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[46px] transition-all"
                    />
                  </div>

                  {/* Suggestions dropdown */}
                  {showFromDropdown && fromSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-44 overflow-y-auto divide-y divide-gray-100">
                      {fromSuggestions.map((s) => (
                        <div
                          key={`from-${s.stop_id}`}
                          onClick={() => {
                            setFromStop(s);
                            setFromQuery(s.stop_name);
                            setShowFromDropdown(false);
                          }}
                          className="p-2.5 hover:bg-orange-50/60 cursor-pointer text-xs font-semibold text-gray-800 flex items-center justify-between"
                        >
                          <span className="truncate">{s.stop_name}</span>
                          <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-2">#{s.stop_id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Small circular swap icon */}
                <div className="flex justify-center -my-1 relative z-10">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 hover:border-orange-500 text-gray-500 hover:text-orange-600 shadow-2xs flex items-center justify-center transition active:rotate-180 duration-200 cursor-pointer"
                    title="Swap locations"
                    aria-label="Swap From and To"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* TO Field */}
                <div ref={toBoxRef} className="relative">
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-red-600 font-bold text-sm pointer-events-none">
                      📍
                    </span>
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
                      placeholder="To (e.g. Bamnoli)"
                      className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[46px] transition-all"
                    />
                  </div>

                  {/* Suggestions dropdown */}
                  {showToDropdown && toSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-44 overflow-y-auto divide-y divide-gray-100">
                      {toSuggestions.map((s) => (
                        <div
                          key={`to-${s.stop_id}`}
                          onClick={() => {
                            setToStop(s);
                            setToQuery(s.stop_name);
                            setShowToDropdown(false);
                          }}
                          className="p-2.5 hover:bg-orange-50/60 cursor-pointer text-xs font-semibold text-gray-800 flex items-center justify-between"
                        >
                          <span className="truncate">{s.stop_name}</span>
                          <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-2">#{s.stop_id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Find Buses Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer min-h-[46px] mt-1"
                >
                  <span>Find Buses</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              {/* Quick suggestions pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs no-scrollbar">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Quick:</span>
                <button
                  type="button"
                  onClick={() => handleQuickRouteSelect('Bijwasan', 'Bamnoli')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 font-bold text-[11px] cursor-pointer"
                >
                  Bijwasan → Bamnoli
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRouteSelect('Anand Vihar', 'Uttam Nagar')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-medium cursor-pointer"
                >
                  Anand Vihar → Uttam Nagar
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRouteSelect('Saket', 'AIIMS')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-medium cursor-pointer"
                >
                  Saket → AIIMS
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODE B: AFTER SEARCH - ROUTE RESULTS                                */}
          {/* ------------------------------------------------------------------- */}
          {sheetMode === 'results' && (
            <div className="space-y-3">
              {/* Results Top Header */}
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-black text-gray-900 tracking-tight leading-tight">
                    Buses to {toQuery}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-semibold">
                    {loading
                      ? 'Searching buses...'
                      : `${allOptions.length} buses found (${directList.length} direct)`}
                  </p>
                </div>

                {/* Edit Search Button */}
                <button
                  type="button"
                  onClick={() => setSheetMode('search')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 cursor-pointer min-h-[34px]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="py-8 text-center space-y-2.5">
                  <div className="w-7 h-7 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs font-bold text-gray-800">
                    Finding verified DTC routes...
                  </div>
                </div>
              )}

              {/* Empty State (User requirement) */}
              {!loading && allOptions.length === 0 && (
                <div className="py-6 text-center space-y-3 bg-gray-50/80 rounded-2xl p-4 border border-gray-200/80">
                  <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
                    🚌
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">
                      No direct bus found
                    </div>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto mt-0.5">
                      No direct DTC bus matches between exact locations. Try nearby official bus stops.
                    </p>
                  </div>

                  {/* Try Nearby Stops → Button */}
                  <button
                    type="button"
                    onClick={handleTryNearbyStops}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer min-h-[42px]"
                  >
                    <span>Try Nearby Stops →</span>
                  </button>
                </div>
              )}

              {/* SWIPEABLE ROUTE CARDS (User requirement) */}
              {!loading && allOptions.length > 0 && (
                <div
                  ref={cardsContainerRef}
                  className="space-y-3"
                >
                  {allOptions.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isExpanded = expandedOptionId === opt.id;
                    const isDirect = opt.type === 'DIRECT';

                    return (
                      <div
                        key={`route-card-${opt.id}`}
                        onClick={() => selectBusCard(opt)}
                        className={`bg-white rounded-2xl border transition-all p-3.5 space-y-2.5 cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-sm bg-orange-50/20'
                            : 'border-gray-200/90 hover:border-gray-300 shadow-2xs'
                        }`}
                      >
                        {/* CARD TOP ROW: Left (Bus Graphic), Center (Bus Number & Direct), Right (Travel Time) */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Left + Center */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <DtcBusGraphic
                              routeNumber={isDirect ? opt.routeNumber : opt.route1.routeNumber}
                              size="sm"
                              variant={isDirect ? 'orange' : 'blue'}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-gray-900 tracking-tight leading-none tabular-nums">
                                  {isDirect ? opt.routeNumber : `${opt.route1.routeNumber} → ${opt.route2.routeNumber}`}
                                </span>
                              </div>
                              <div
                                className={`text-[11px] font-bold mt-1 ${
                                  isDirect ? 'text-emerald-700' : 'text-amber-800'
                                }`}
                              >
                                {isDirect ? 'Direct Bus' : '1 Change'}
                              </div>
                            </div>
                          </div>

                          {/* Right: 25 min */}
                          <div className="text-right shrink-0">
                            <div className="text-base font-black text-gray-900 leading-none">
                              {opt.durationMin} min
                            </div>
                            <div className="text-[10px] text-gray-500 font-semibold mt-1">
                              {opt.distanceKm} km · ₹{opt.fareRupees}
                            </div>
                          </div>
                        </div>

                        {/* CARD MIDDLE ROW: Clean Flow Preview */}
                        {isDirect ? (
                          /* Direct Bus: Board at Bijwasan -> Bamnoli */
                          <div className="bg-gray-50/90 rounded-xl p-3 border border-gray-200/70 space-y-1.5">
                            {opt.walkToBoardingM > 50 && (
                              <div className="text-[11px] text-amber-900 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 font-semibold mb-1 flex items-center gap-1.5">
                                <span>🚶</span>
                                <span>Walk {opt.walkToBoardingM}m ({opt.walkToBoardingMin} min) to boarding stop</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                              <span className="text-gray-500 font-medium shrink-0">Board:</span>
                              <span className="truncate">{opt.boardingStop.stop_name}</span>
                            </div>
                            <div className="pl-3 text-orange-400 font-black text-xs leading-none py-0.5">
                              ↓
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                              <span className="text-gray-500 font-medium shrink-0">Alight:</span>
                              <span className="truncate">{opt.destinationStop.stop_name}</span>
                            </div>
                          </div>
                        ) : (
                          /* Connecting Route: Part 1 -> Changeover -> Part 2 */
                          <div className="bg-gray-50/90 rounded-xl p-3 border border-gray-200/70 space-y-2 text-xs">
                            {/* Leg 1 Board */}
                            <div className="flex items-center justify-between font-bold text-gray-900">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                                <span className="text-gray-500 font-medium">Board Part 1:</span>
                                <span className="truncate max-w-[150px]">{opt.route1.boardingStop.stop_name}</span>
                              </span>
                              <span className="text-[10px] bg-orange-100 text-orange-800 font-black px-1.5 py-0.5 rounded">
                                Bus {opt.route1.routeNumber}
                              </span>
                            </div>

                            {/* Transfer point preview */}
                            <div className="flex items-center justify-between py-1 px-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-bold text-[11px]">
                              <span className="flex items-center gap-1">
                                <span>🔄</span>
                                <span>Change at {opt.changeover.stopName}</span>
                              </span>
                              <span className="text-[10px] text-amber-800 font-medium">
                                ~{opt.changeover.walkingDistanceM}m walk
                              </span>
                            </div>

                            {/* Leg 2 Alight */}
                            <div className="flex items-center justify-between font-bold text-gray-900">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                                <span className="text-gray-500 font-medium">Destination:</span>
                                <span className="truncate max-w-[150px]">{opt.route2.destinationStop.stop_name}</span>
                              </span>
                              <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded">
                                Bus {opt.route2.routeNumber}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* CARD ACTION: [Show All Stops (X) / Hide Stops] button */}
                        <div className="pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectBusCard(opt);
                              toggleRouteDetails(opt.id);
                            }}
                            className="w-full py-2.5 px-3 bg-white hover:bg-orange-50 active:bg-orange-100 text-gray-800 hover:text-orange-600 border border-gray-200 hover:border-orange-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] shadow-2xs"
                          >
                            <span>
                              {isExpanded ? 'Hide Stops' : `Show All Stops (${opt.totalStops})`}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-orange-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-orange-600" />
                            )}
                          </button>
                        </div>

                        {/* ========================================================= */}
                        {/* EXPANDED DETAILED STOP-BY-STOP NAVIGATION                 */}
                        {/* ========================================================= */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-gray-150 space-y-3 animate-in fade-in duration-200">
                            {/* Title bar */}
                            <div className="flex items-center justify-between px-1">
                              <div className="text-xs font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                                <span>All Stops ({opt.totalStops})</span>
                              </div>
                              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                                {opt.distanceKm} km total
                              </span>
                            </div>

                            {/* 1. DIRECT BUS STOP-BY-STOP LIST */}
                            {isDirect && opt.intermediateStops && (
                              <div className="space-y-1.5 bg-gray-50/80 rounded-xl p-3 border border-gray-200/80">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-900">
                                      🚌 Bus {opt.routeNumber}
                                    </span>
                                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                      Direct Route
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-semibold">
                                    {opt.totalStops} Official Stops
                                  </div>
                                </div>

                                <div className="relative pl-6 space-y-3 pt-2">
                                  {/* Timeline line */}
                                  <div className="absolute left-[9px] top-3 bottom-4 w-0.5 bg-orange-300" />

                                  {opt.intermediateStops.map((st: any, idx: number) => {
                                    const isFirst = idx === 0;
                                    const isLast = idx === opt.intermediateStops.length - 1;

                                    return (
                                      <div
                                        key={`stop-${st.stop_id}-${idx}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectStopById(st.stop_id);
                                        }}
                                        className={`relative flex items-start gap-2.5 cursor-pointer rounded-lg p-1.5 -ml-1 transition-colors ${
                                          isFirst
                                            ? 'bg-emerald-50/80 border border-emerald-200/80'
                                            : isLast
                                            ? 'bg-red-50/80 border border-red-200/80'
                                            : 'hover:bg-white/80'
                                        }`}
                                      >
                                        {/* Circle icon */}
                                        {isFirst ? (
                                          <div className="w-5 h-5 -ml-5 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-[9px] font-black shrink-0 shadow-xs z-10">
                                            1
                                          </div>
                                        ) : isLast ? (
                                          <div className="w-5 h-5 -ml-5 rounded-full bg-red-600 border-2 border-white text-white flex items-center justify-center text-[9px] font-black shrink-0 shadow-xs z-10">
                                            {idx + 1}
                                          </div>
                                        ) : (
                                          <div className="w-4 h-4 -ml-4.5 rounded-full bg-white border-2 border-orange-500 text-orange-700 flex items-center justify-center text-[8px] font-black shrink-0 shadow-2xs z-10 mt-0.5">
                                            {idx + 1}
                                          </div>
                                        )}

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center justify-between gap-2">
                                            <div className={`text-xs font-bold leading-snug ${
                                              isFirst ? 'text-emerald-950 font-black' : isLast ? 'text-red-950 font-black' : 'text-gray-800'
                                            }`}>
                                              {st.stop_name}
                                            </div>
                                            {isFirst && (
                                              <span className="text-[10px] font-black text-emerald-800 shrink-0 bg-emerald-200/70 px-1.5 py-0.5 rounded">
                                                Board Here
                                              </span>
                                            )}
                                            {isLast && (
                                              <span className="text-[10px] font-black text-red-800 shrink-0 bg-red-200/70 px-1.5 py-0.5 rounded">
                                                Alight Here
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5 font-medium">
                                            <span>Stop #{idx + 1}</span>
                                            {st.distanceKmFromStart !== undefined && (
                                              <>
                                                <span>•</span>
                                                <span>{st.distanceKmFromStart} km</span>
                                              </>
                                            )}
                                            {st.departure_time && (
                                              <>
                                                <span>•</span>
                                                <span className="text-emerald-700 font-semibold">{st.departure_time}</span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 2. BUS CHANGE ROUTE: TWO CLEAR SECTIONS */}
                            {!isDirect && (
                              <div className="space-y-3">
                                {/* PART 1 — Bus 1 */}
                                <div className="bg-orange-50/40 rounded-xl p-3 border border-orange-200 space-y-2">
                                  <div className="flex items-center justify-between pb-1.5 border-b border-orange-200">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black text-orange-950">
                                        PART 1 — Bus {opt.route1.routeNumber}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                                      {opt.route1.intermediateStops?.length || opt.route1.stopsCount + 1} stops
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                                    <span className="text-emerald-600 font-black">📍 Board:</span>
                                    <span className="text-gray-900 font-black">{opt.route1.boardingStop.stop_name}</span>
                                  </div>

                                  {/* Part 1 Stops List */}
                                  <div className="relative pl-6 space-y-2 pt-1 text-xs">
                                    <div className="absolute left-[9px] top-2 bottom-3 w-0.5 bg-orange-300" />

                                    {(opt.route1.intermediateStops || []).map((st: any, idx: number) => {
                                      const isFirst = idx === 0;
                                      const isLast = idx === (opt.route1.intermediateStops.length - 1);

                                      return (
                                        <div
                                          key={`leg1-stop-${st.stop_id}-${idx}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            selectStopById(st.stop_id);
                                          }}
                                          className={`relative flex items-start gap-2 cursor-pointer p-1 rounded-md -ml-1 ${
                                            isFirst ? 'bg-emerald-50' : isLast ? 'bg-amber-100/70 border border-amber-300' : 'hover:bg-white'
                                          }`}
                                        >
                                          <div className={`w-4 h-4 -ml-4.5 rounded-full text-[8px] font-black flex items-center justify-center shrink-0 border-2 mt-0.5 ${
                                            isFirst
                                              ? 'bg-emerald-600 text-white border-white'
                                              : isLast
                                              ? 'bg-amber-500 text-white border-white'
                                              : 'bg-white text-orange-700 border-orange-500'
                                          }`}>
                                            {idx + 1}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                              <span className={`font-bold ${isFirst ? 'text-emerald-950 font-black' : isLast ? 'text-amber-950 font-black' : 'text-gray-800'}`}>
                                                {st.stop_name}
                                              </span>
                                              {isLast && (
                                                <span className="text-[9px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                                                  Change Here
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                              Stop #{idx + 1} · {st.distanceKmFromStart || 0} km
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* 🔄 CHANGE BUS POINT DETAIL */}
                                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 space-y-2 shadow-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base">🔄</span>
                                    <div className="font-black text-xs text-amber-950">
                                      Change Bus at {opt.changeover.stopName}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-lg border border-amber-200/80">
                                    <div>
                                      <div className="text-[10px] text-gray-500 font-semibold">Get down from:</div>
                                      <div className="font-black text-gray-900 flex items-center gap-1 mt-0.5">
                                        <span>🚌 Bus {opt.route1.routeNumber}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-gray-500 font-semibold">Board next:</div>
                                      <div className="font-black text-blue-700 flex items-center gap-1 mt-0.5">
                                        <span>🚌 Bus {opt.route2.routeNumber}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-[11px] text-amber-900 font-semibold pt-0.5 px-1">
                                    <span>🚶 Walking distance: ~{opt.changeover.walkingDistanceM}m</span>
                                    <span>⏱ Transfer time: ~{opt.changeover.estimatedWaitMin} min</span>
                                  </div>
                                </div>

                                {/* PART 2 — Bus 2 */}
                                <div className="bg-blue-50/40 rounded-xl p-3 border border-blue-200 space-y-2">
                                  <div className="flex items-center justify-between pb-1.5 border-b border-blue-200">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black text-blue-950">
                                        PART 2 — Bus {opt.route2.routeNumber}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                                      {opt.route2.intermediateStops?.length || opt.route2.stopsCount + 1} stops
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                                    <span className="text-blue-600 font-black">📍 Board:</span>
                                    <span className="text-gray-900 font-black">{opt.changeover.stopName}</span>
                                  </div>

                                  {/* Part 2 Stops List */}
                                  <div className="relative pl-6 space-y-2 pt-1 text-xs">
                                    <div className="absolute left-[9px] top-2 bottom-3 w-0.5 bg-blue-300" />

                                    {(opt.route2.intermediateStops || []).map((st: any, idx: number) => {
                                      const isFirst = idx === 0;
                                      const isLast = idx === (opt.route2.intermediateStops.length - 1);

                                      return (
                                        <div
                                          key={`leg2-stop-${st.stop_id}-${idx}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            selectStopById(st.stop_id);
                                          }}
                                          className={`relative flex items-start gap-2 cursor-pointer p-1 rounded-md -ml-1 ${
                                            isFirst ? 'bg-amber-50' : isLast ? 'bg-red-50 border border-red-300' : 'hover:bg-white'
                                          }`}
                                        >
                                          <div className={`w-4 h-4 -ml-4.5 rounded-full text-[8px] font-black flex items-center justify-center shrink-0 border-2 mt-0.5 ${
                                            isFirst
                                              ? 'bg-amber-500 text-white border-white'
                                              : isLast
                                              ? 'bg-red-600 text-white border-white'
                                              : 'bg-white text-blue-700 border-blue-600'
                                          }`}>
                                            {idx + 1}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                              <span className={`font-bold ${isFirst ? 'text-amber-950 font-black' : isLast ? 'text-red-950 font-black' : 'text-gray-800'}`}>
                                                {st.stop_name}
                                              </span>
                                              {isLast && (
                                                <span className="text-[9px] font-black bg-red-200 text-red-900 px-1.5 py-0.5 rounded">
                                                  Final Destination
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                              Stop #{idx + 1} · {st.distanceKmFromStart || 0} km
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
