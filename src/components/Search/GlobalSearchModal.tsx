import React, { useState, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { GtfsRoute, GtfsStop } from '../../types/transit';
import { gtfsApi } from '../../services/gtfsApi';
import { Search, X, MapPin, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    selectRouteById,
    selectStopById,
  } = useTransit();

  const [query, setQuery] = useState('');
  const [routes, setRoutes] = useState<GtfsRoute[]>([]);
  const [stops, setStops] = useState<GtfsStop[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setRoutes([]);
      setStops([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      gtfsApi
        .search(q)
        .then((res) => {
          setRoutes(res.routes || []);
          setStops(res.stops || []);
        })
        .catch((err) => console.error('Search failed:', err))
        .finally(() => setLoading(false));
    }, 160);

    return () => clearTimeout(timer);
  }, [query]);

  if (!searchModalOpen) return null;

  const handleRouteClick = (routeId: string) => {
    setSearchModalOpen(false);
    selectRouteById(routeId);
  };

  const handleStopClick = (stopId: string) => {
    setSearchModalOpen(false);
    selectStopById(stopId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden my-4 sm:my-10 border border-gray-200">
        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bus number, stop or area..."
            autoFocus
            className="w-full text-base bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 min-h-[40px]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 px-2 py-1 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="p-6 text-center text-xs text-gray-400">
              Searching routes & stops...
            </div>
          )}

          {!loading && query && routes.length === 0 && stops.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500">
              <p className="font-semibold text-gray-700">No buses or stops found</p>
              <p className="text-xs text-gray-400 mt-1">Try another bus number (e.g. 623, 534) or stop name.</p>
            </div>
          )}

          {/* BUS ROUTES - Simple List Items with thin divider */}
          {routes.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Bus Routes ({routes.length})
              </div>
              <div className="divide-y divide-gray-100">
                {routes.map((r) => {
                  const estDuration = Math.round((r.stop_count || 40) * 2.6);
                  return (
                    <div
                      key={r.route_id}
                      className="p-3.5 hover:bg-gray-50 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <div className="text-base font-extrabold text-orange-600 tabular-nums">
                          {r.route_short_name}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900 mt-0.5">
                          {r.origin_stop_name || 'Terminal'} → {r.dest_stop_name || 'Terminal'}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {r.stop_count || 40} stops • ~{estDuration}m
                        </div>
                      </div>

                      <button
                        onClick={() => handleRouteClick(r.route_id)}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer min-h-[36px]"
                      >
                        View Route
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BUS STOPS - Simple List Items */}
          {stops.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Bus Stops ({stops.length})
              </div>
              <div className="divide-y divide-gray-100">
                {stops.map((s) => (
                  <div
                    key={s.stop_id}
                    onClick={() => handleStopClick(s.stop_id)}
                    className="p-3.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-sm transition-colors min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 text-xs sm:text-sm">{s.stop_name}</div>
                        <div className="text-[11px] text-gray-400">Stop ID: {s.stop_id}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
