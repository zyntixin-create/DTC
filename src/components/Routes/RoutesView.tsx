import React, { useState, useEffect, useCallback } from 'react';
import { useTransit } from '../../context/TransitContext';
import { GtfsRoute } from '../../types/transit';
import { gtfsApi } from '../../services/gtfsApi';
import { DtcBusGraphic } from '../Common/DtcBusGraphic';
import { Search, ChevronRight } from 'lucide-react';

export const RoutesView: React.FC = () => {
  const { selectRouteById } = useTransit();

  const [routes, setRoutes] = useState<GtfsRoute[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 30;

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gtfsApi.getRoutes({
        search: search.trim() || undefined,
        limit: pageSize,
        offset: page * pageSize,
      });
      setRoutes(res.routes || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to load routes:', err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoutes();
    }, 180);
    return () => clearTimeout(timer);
  }, [fetchRoutes]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-[640px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Bus Routes
        </h1>
        <p className="text-xs text-gray-500">
          Search 2,900+ DTC and Cluster routes across Delhi NCR
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search bus number (e.g. 623, 534) or destination..."
          className="w-full pl-11 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50/70 focus:bg-white border border-gray-200/90 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[46px] transition-all"
        />
      </div>

      {/* Route List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading routes...</div>
      ) : routes.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          No routes found matching "{search}".
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
          {routes.map((r) => (
            <div
              key={r.route_id}
              onClick={() => selectRouteById(r.route_id)}
              className="py-3.5 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
            >
              <div className="flex items-center gap-3">
                <DtcBusGraphic
                  routeNumber={r.route_short_name}
                  variant={r.route_short_name.endsWith('E') ? 'green' : 'orange'}
                  size="sm"
                  className="hidden xs:inline-flex shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-orange-600 text-base sm:text-lg tabular-nums">
                      Bus {r.route_short_name}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900 flex items-center gap-1.5 flex-wrap">
                    <span>{r.origin_stop_name || 'Terminal'}</span>
                    <span className="text-gray-400">→</span>
                    <span>{r.dest_stop_name || 'Terminal'}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {r.stop_count || 40} stops • {r.route_short_name.endsWith('STL') ? 'Cluster' : 'DTC'}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs text-gray-600">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
