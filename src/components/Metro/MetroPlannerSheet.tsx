import React, { useState, useEffect, useRef } from 'react';
import {
  MetroRoutePlan,
  MetroStation,
  POPULAR_METRO_STATIONS,
  getMetroStation,
  searchMetroStations,
  calculateAllMetroRoutes
} from '../../data/delhiMetroData';
import {
  ArrowUpDown,
  Search,
  Train,
  Clock,
  Navigation,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MetroPlannerSheetProps {
  onRouteSelect: (route: MetroRoutePlan | null) => void;
  selectedRoute: MetroRoutePlan | null;
  onStationClick?: (station: MetroStation) => void;
  initialFrom?: string;
  initialTo?: string;
}

export const MetroPlannerSheet: React.FC<MetroPlannerSheetProps> = ({
  onRouteSelect,
  selectedRoute,
  onStationClick,
  initialFrom = 'Dwarka Sector 21',
  initialTo = 'New Delhi'
}) => {
  // Search Form State
  const [fromQuery, setFromQuery] = useState(initialFrom);
  const [toQuery, setToQuery] = useState(initialTo);
  const [fromStation, setFromStation] = useState<MetroStation | null>(null);
  const [toStation, setToStation] = useState<MetroStation | null>(null);

  const [fromSuggestions, setFromSuggestions] = useState<MetroStation[]>([]);
  const [toSuggestions, setToSuggestions] = useState<MetroStation[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Results State
  const [routePlans, setRoutePlans] = useState<MetroRoutePlan[]>([]);
  const [activePlanIndex, setActivePlanIndex] = useState<number>(0);
  const [sheetMode, setSheetMode] = useState<'search' | 'results'>('results');
  const [expandedStopsLegs, setExpandedStopsLegs] = useState<Record<string, boolean>>({});
  const [showAllTimeline, setShowAllTimeline] = useState<boolean>(true);

  // Bottom Sheet Mobile Drag/Height State
  const [sheetHeight, setSheetHeight] = useState<'collapsed' | 'auto' | 'expanded'>('auto');
  const [isMinimized, setIsMinimized] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const fromBoxRef = useRef<HTMLDivElement>(null);
  const toBoxRef = useRef<HTMLDivElement>(null);

  // Pre-populate initial route: Dwarka Sector 21 -> New Delhi (user's explicit test case!)
  useEffect(() => {
    const fSt = getMetroStation(initialFrom);
    const tSt = getMetroStation(initialTo);
    if (fSt) setFromStation(fSt);
    if (tSt) setToStation(tSt);

    if (fSt && tSt) {
      const plans = calculateAllMetroRoutes(fSt.id, tSt.id);
      setRoutePlans(plans);
      if (plans.length > 0) {
        setActivePlanIndex(0);
        onRouteSelect(plans[0]);
        setSheetMode('results');
      }
    }
  }, []);

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

  // Suggestions for From
  useEffect(() => {
    if (!fromQuery.trim() || fromStation?.name === fromQuery) {
      setFromSuggestions([]);
      return;
    }
    const results = searchMetroStations(fromQuery, 6);
    setFromSuggestions(results);
    setShowFromDropdown(true);
  }, [fromQuery, fromStation]);

  // Suggestions for To
  useEffect(() => {
    if (!toQuery.trim() || toStation?.name === toQuery) {
      setToSuggestions([]);
      return;
    }
    const results = searchMetroStations(toQuery, 6);
    setToSuggestions(results);
    setShowToDropdown(true);
  }, [toQuery, toStation]);

  // Search Action
  const handleFindMetroRoute = (overrideFrom?: string, overrideTo?: string) => {
    const queryFrom = overrideFrom || fromQuery.trim();
    const queryTo = overrideTo || toQuery.trim();

    if (!queryFrom || !queryTo) return;

    const f = getMetroStation(queryFrom);
    const t = getMetroStation(queryTo);

    if (f) setFromStation(f);
    if (t) setToStation(t);

    const plans = calculateAllMetroRoutes(queryFrom, queryTo);
    setRoutePlans(plans);

    if (plans.length > 0) {
      setActivePlanIndex(0);
      onRouteSelect(plans[0]);
      setSheetMode('results');
      setIsMinimized(false);
      setShowFromDropdown(false);
      setShowToDropdown(false);
    }
  };

  // Swap From and To
  const handleSwap = () => {
    const tempQuery = fromQuery;
    const tempStation = fromStation;
    setFromQuery(toQuery);
    setFromStation(toStation);
    setToQuery(tempQuery);
    setToStation(tempStation);

    if (toQuery && tempQuery) {
      handleFindMetroRoute(toQuery, tempQuery);
    }
  };

  // Select a plan
  const handleSelectPlan = (index: number) => {
    setActivePlanIndex(index);
    onRouteSelect(routePlans[index]);
  };

  // Toggle stop sequence for a leg
  const toggleLegStops = (legKey: string) => {
    setExpandedStopsLegs((prev) => ({
      ...prev,
      [legKey]: !prev[legKey]
    }));
  };

  // Touch handlers for mobile bottom sheet swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;

    if (diff > 50) {
      // Swiped down
      if (sheetHeight === 'expanded') {
        setSheetHeight('auto');
      } else if (!isMinimized) {
        setIsMinimized(true);
      }
    } else if (diff < -50) {
      // Swiped up
      if (isMinimized) {
        setIsMinimized(false);
      } else if (sheetHeight !== 'expanded') {
        setSheetHeight('expanded');
      }
    }
  };

  const currentPlan = routePlans[activePlanIndex] || null;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`absolute left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200/90 flex flex-col transition-all duration-300 ease-out max-w-lg mx-auto ${
        isMinimized
          ? 'bottom-16 max-h-[86px]'
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

      {/* Main Sheet Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1 space-y-3 no-scrollbar">
        {/* =================================================================== */}
        {/* 1. SEARCH MODE: SELECT METRO STATIONS                               */}
        {/* =================================================================== */}
        {sheetMode === 'search' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-gray-900 tracking-tight">
                  Where are you going?
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">
                  Delhi Metro Route & Interchange Navigator
                </p>
              </div>
              {routePlans.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSheetMode('results')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View Route
                </button>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFindMetroRoute();
              }}
              className="space-y-2"
            >
              {/* FROM Input */}
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
                      setFromStation(null);
                    }}
                    onFocus={() => {
                      if (fromSuggestions.length > 0) setShowFromDropdown(true);
                    }}
                    placeholder="From (e.g. Dwarka Sector 21)"
                    className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 min-h-[46px] transition-all"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-44 overflow-y-auto divide-y divide-gray-100">
                    {fromSuggestions.map((st) => (
                      <div
                        key={`from-${st.id}`}
                        onClick={() => {
                          setFromStation(st);
                          setFromQuery(st.name);
                          setShowFromDropdown(false);
                        }}
                        className="p-2.5 hover:bg-blue-50/60 cursor-pointer text-xs font-semibold text-gray-800 flex items-center justify-between"
                      >
                        <div className="truncate">
                          <div>{st.name}</div>
                          <div className="text-[10px] text-gray-400 font-normal">
                            {st.lines.join(' · ')}
                          </div>
                        </div>
                        {st.isInterchange && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded shrink-0 ml-2">
                            🔄 Transfer
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-1 relative z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 hover:border-blue-600 text-gray-500 hover:text-blue-600 shadow-2xs flex items-center justify-center transition active:rotate-180 duration-200 cursor-pointer"
                  title="Swap stations"
                  aria-label="Swap From and To"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* TO Input */}
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
                      setToStation(null);
                    }}
                    onFocus={() => {
                      if (toSuggestions.length > 0) setShowToDropdown(true);
                    }}
                    placeholder="To (e.g. New Delhi)"
                    className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 min-h-[46px] transition-all"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showToDropdown && toSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-44 overflow-y-auto divide-y divide-gray-100">
                    {toSuggestions.map((st) => (
                      <div
                        key={`to-${st.id}`}
                        onClick={() => {
                          setToStation(st);
                          setToQuery(st.name);
                          setShowToDropdown(false);
                        }}
                        className="p-2.5 hover:bg-blue-50/60 cursor-pointer text-xs font-semibold text-gray-800 flex items-center justify-between"
                      >
                        <div className="truncate">
                          <div>{st.name}</div>
                          <div className="text-[10px] text-gray-400 font-normal">
                            {st.lines.join(' · ')}
                          </div>
                        </div>
                        {st.isInterchange && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded shrink-0 ml-2">
                            🔄 Transfer
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Find Metro Route Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[46px]"
              >
                <Train className="w-4 h-4 stroke-[2.5]" />
                Find Metro Route
              </button>
            </form>

            {/* Quick Popular Stations */}
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Popular Stations
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_METRO_STATIONS.slice(0, 6).map((pop) => (
                  <button
                    key={pop.id}
                    type="button"
                    onClick={() => {
                      if (!fromQuery || fromQuery === pop.name) {
                        setToQuery(pop.name);
                        setToStation(getMetroStation(pop.id));
                      } else {
                        setFromQuery(pop.name);
                        setFromStation(getMetroStation(pop.id));
                      }
                    }}
                    className="text-[11px] font-medium bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200/80 cursor-pointer transition active:scale-95"
                  >
                    {pop.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. RESULTS MODE: DETAILED METRO ROUTE & INTERCHANGES                */}
        {/* =================================================================== */}
        {sheetMode === 'results' && (
          <div className="space-y-3">
            {/* Header: Destination & Route Count */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <h2 className="text-base font-black text-gray-900 leading-tight">
                  Metro to {toStation ? toStation.name.split('(')[0].trim() : toQuery}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">
                    {routePlans.length} {routePlans.length === 1 ? 'route' : 'routes'} found
                  </span>
                  {currentPlan && currentPlan.interchangesCount > 0 ? (
                    <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      🔄 {currentPlan.interchangesCount} Interchange
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      ⚡ Direct Line
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Search Button */}
              <button
                type="button"
                onClick={() => setSheetMode('search')}
                className="text-xs font-bold text-gray-700 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-200 transition cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Multiple Route Option Tabs if > 1 option available */}
            {routePlans.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {routePlans.map((plan, idx) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handleSelectPlan(idx)}
                    className={`flex-1 min-w-[140px] p-2 rounded-xl border text-left cursor-pointer transition select-none ${
                      activePlanIndex === idx
                        ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-bold ${activePlanIndex === idx ? 'text-blue-700' : 'text-gray-900'}`}>
                        Option {idx + 1}
                      </span>
                      <span className="font-extrabold text-gray-900">
                        {plan.durationMin} min
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">
                      {plan.tag} · ₹{plan.fareRupees}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Current Active Plan Details */}
            {currentPlan && (
              <div className="space-y-3">
                {/* Route Header Card */}
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-blue-700">
                          {currentPlan.tag}
                        </div>
                        <div className="text-sm font-black text-gray-900 leading-tight">
                          {currentPlan.fromStation.name.split(' ')[0]} → {currentPlan.toStation.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-gray-900">
                        ⏱ {currentPlan.durationMin} min
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700">
                        Fare: ₹{currentPlan.fareRupees}
                      </div>
                    </div>
                  </div>

                  {/* Quick stats strip */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/70 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Total Stations</span>
                      <span className="font-extrabold text-gray-900">{currentPlan.totalStations}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Interchanges</span>
                      <span className="font-extrabold text-orange-600">{currentPlan.interchangesCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Approx Distance</span>
                      <span className="font-extrabold text-gray-900">{currentPlan.distanceKm} km</span>
                    </div>
                  </div>
                </div>

                {/* ======================================================= */}
                {/* DETAILED LEGS & STOP-BY-STOP INTERCHANGE TIMELINE       */}
                {/* ======================================================= */}
                <div className="space-y-3">
                  {currentPlan.legs.map((leg, lIdx) => {
                    const legKey = `leg-${lIdx}`;
                    const isStopsExpanded = expandedStopsLegs[legKey] !== false; // expanded by default
                    const isLastLeg = lIdx === currentPlan.legs.length - 1;

                    return (
                      <div
                        key={legKey}
                        className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden"
                      >
                        {/* Leg Header Banner */}
                        <div
                          style={{ borderLeftColor: leg.lineColor }}
                          className="p-3 border-l-4 bg-gray-50/60 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              style={{ backgroundColor: leg.lineColor }}
                              className="w-3 h-3 rounded-full shrink-0"
                            />
                            <div>
                              <div className="text-xs font-black text-gray-900">
                                {currentPlan.legs.length > 1 ? `PART ${lIdx + 1} — ` : ''}{leg.lineName}
                              </div>
                              <div className="text-[11px] text-gray-500 font-medium">
                                {leg.stationsCount} stations · {leg.direction}
                              </div>
                            </div>
                          </div>

                          {/* Toggle stops button */}
                          <button
                            type="button"
                            onClick={() => toggleLegStops(legKey)}
                            className="text-[11px] font-bold text-gray-600 hover:text-blue-600 px-2 py-1 bg-white border border-gray-200 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isStopsExpanded ? 'Hide' : 'Show'} Stops</span>
                            {isStopsExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Leg Stops Timeline */}
                        {isStopsExpanded && (
                          <div className="p-3 pt-2">
                            <div className="relative pl-6 space-y-2.5">
                              {/* Colored Vertical Connecting Line */}
                              <div
                                style={{ backgroundColor: leg.lineColor }}
                                className="absolute left-2.5 top-2 bottom-2 w-0.5 rounded-full"
                              />

                              {leg.stations.map((st, sIdx) => {
                                const isFirst = sIdx === 0;
                                const isLast = sIdx === leg.stations.length - 1;

                                return (
                                  <div
                                    key={st.id}
                                    onClick={() => onStationClick?.(st)}
                                    className="relative flex items-center justify-between text-xs cursor-pointer group"
                                  >
                                    {/* Timeline Dot */}
                                    <div
                                      style={{
                                        borderColor: leg.lineColor,
                                        backgroundColor: isFirst || isLast ? leg.lineColor : '#FFFFFF'
                                      }}
                                      className={`absolute -left-6 w-3 h-3 rounded-full border-2 transition-transform ${
                                        isFirst || isLast ? 'scale-110 shadow-xs' : 'group-hover:scale-125'
                                      }`}
                                    />

                                    {/* Station Name & Hindi */}
                                    <div className="min-w-0 pr-2">
                                      <div
                                        className={`truncate ${
                                          isFirst || isLast
                                            ? 'font-black text-gray-900 text-[13px]'
                                            : 'font-semibold text-gray-700'
                                        }`}
                                      >
                                        {isFirst && lIdx === 0 && (
                                          <span className="text-emerald-700 font-bold mr-1">
                                            📍 Board:
                                          </span>
                                        )}
                                        {isFirst && lIdx > 0 && (
                                          <span className="text-blue-700 font-bold mr-1">
                                            📍 Board:
                                          </span>
                                        )}
                                        {isLast && isLastLeg && (
                                          <span className="text-red-600 font-bold mr-1">
                                            🏁 Destination:
                                          </span>
                                        )}
                                        {st.name}
                                      </div>
                                      <div className="text-[10px] text-gray-400">
                                        {st.nameHindi}
                                      </div>
                                    </div>

                                    {/* Sequence Badge / Interchange info */}
                                    <div className="shrink-0 flex items-center gap-1.5">
                                      {st.isInterchange && (
                                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1 py-0.5 rounded">
                                          Interchange
                                        </span>
                                      )}
                                      <span className="text-[10px] text-gray-400 font-mono">
                                        #{sIdx + 1}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* INTERCHANGE CHANGE POINT DETAIL */}
                        {leg.changeover && (
                          <div className="p-3 bg-orange-50/90 border-t-2 border-dashed border-orange-200 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-orange-800">
                              <span className="text-base">🔄</span>
                              <div className="font-black text-xs">
                                Change Line at {leg.changeover.atStation.name}
                              </div>
                            </div>

                            <div className="bg-white rounded-xl p-2.5 border border-orange-200/80 shadow-2xs space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-medium">Get down from:</span>
                                <span className="font-bold text-gray-900">{leg.changeover.fromLine}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-medium">Board next:</span>
                                <span className="font-bold text-blue-700">{leg.changeover.toLine}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                                <span className="text-gray-500 font-medium">Walking Transfer:</span>
                                <span className="font-extrabold text-orange-700">
                                  ~{leg.changeover.walkingTimeMin} min transfer
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Complete Station List Summary */}
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-black text-gray-900">
                      All Stations ({currentPlan.allStations.length})
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllTimeline((prev) => !prev)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {showAllTimeline ? 'Hide Stations' : 'Show All Stations'}
                    </button>
                  </div>

                  {showAllTimeline && (
                    <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                      {currentPlan.allStations.map((st, idx) => {
                        const isOrigin = idx === 0;
                        const isDest = idx === currentPlan.allStations.length - 1;
                        const isXfer = currentPlan.legs.some(
                          (l) => l.changeover && l.changeover.atStation.id === st.id
                        );

                        return (
                          <div
                            key={`all-${st.id}-${idx}`}
                            onClick={() => onStationClick?.(st)}
                            className="py-1.5 flex items-center justify-between text-xs hover:bg-white/60 px-1 rounded cursor-pointer"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="text-[10px] text-gray-400 font-mono w-5 shrink-0">
                                {idx + 1}.
                              </span>
                              <span
                                className={`truncate ${
                                  isOrigin
                                    ? 'text-emerald-700 font-black'
                                    : isDest
                                    ? 'text-red-600 font-black'
                                    : isXfer
                                    ? 'text-orange-700 font-extrabold'
                                    : 'text-gray-700 font-medium'
                                }`}
                              >
                                {st.name}
                              </span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1">
                              {isOrigin && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  Board
                                </span>
                              )}
                              {isDest && (
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                                  Exit
                                </span>
                              )}
                              {isXfer && (
                                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                                  🔄 Change
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
