import React, { useState, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { LiveMapSection } from '../Map/LiveMapSection';
import { GtfsRoute } from '../../types/transit';
import { gtfsApi } from '../../services/gtfsApi';
import { Search, Bus, Key, AlertCircle, ArrowRight } from 'lucide-react';

export const LiveBusesView: React.FC = () => {
  const {
    realtimeStatus,
    setApiKeyModalOpen,
    otdApiKey,
    selectRouteById,
    selectedRoute,
  } = useTransit();

  const [search, setSearch] = useState('');
  const [routes, setRoutes] = useState<GtfsRoute[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    gtfsApi
      .getRoutes({ search: search.trim() || undefined, limit: 12 })
      .then((res) => {
        setRoutes(res.routes);
      })
      .catch((err) => console.error('Failed to load routes in Live View:', err))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
            Live Delhi Buses & Map
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time fleet tracking and official GTFS route monitoring across Delhi
          </p>
        </div>

        <button
          onClick={() => setApiKeyModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#0756A8] bg-white hover:bg-[#F6F8FB] border border-[#E5EAF0] rounded-lg shadow-xs transition w-fit min-h-[38px]"
        >
          <Key className="w-3.5 h-3.5 text-[#F47B20]" />
          <span>{otdApiKey ? 'OTD API Key Connected' : 'Configure OTD API Key'}</span>
        </button>
      </div>

      {/* Centerpiece: Live Map Section (70% Map / 30% Bus Panel) */}
      <LiveMapSection />

      {/* Select Route to Track Line */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#172033]">
              Select Route to Trace on Map
            </h2>
            <p className="text-xs text-[#64748B]">
              Draw complete route lines and inspect all intermediate stops in sequence
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#0756A8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search route number (e.g. 740, 721)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5EAF0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0756A8] font-medium"
            />
          </div>
        </div>

        {/* Route Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5EAF0] p-4 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {routes.map((route) => {
              const isSelected = selectedRoute?.route_id === route.route_id;
              return (
                <div
                  key={route.route_id}
                  onClick={() => selectRouteById(route.route_id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFF1E6]/40 border-[#F47B20] ring-1 ring-[#F47B20] shadow-xs'
                      : 'bg-white border-[#E5EAF0] hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#0756A8] text-white font-black text-xs rounded-md tabular-nums">
                        {route.route_short_name}
                      </span>
                      <span className="text-xs font-bold text-[#172033]">
                        {route.direction_id === 1 ? 'DOWN' : 'UP'} Direction
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] font-semibold">
                      {route.stop_count || '42'} Stops
                    </span>
                  </div>

                  <div className="text-xs text-[#172033] flex items-center gap-1.5 truncate py-1">
                    <span className="truncate">{route.origin_stop_name || 'Terminal'}</span>
                    <span className="text-[#64748B]">→</span>
                    <span className="truncate font-bold text-[#0756A8]">{route.dest_stop_name || 'Terminal'}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E5EAF0] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#64748B]">
                      {route.total_trips || 'Regular'} Daily Trips
                    </span>
                    <span className="text-[#F47B20] font-bold flex items-center gap-1">
                      <span>{isSelected ? 'Viewing on Map' : 'Track Route'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
