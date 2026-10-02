import React, { useState, useEffect, useCallback } from 'react';
import { useTransit } from '../../context/TransitContext';
import { GtfsStop } from '../../types/transit';
import { gtfsApi } from '../../services/gtfsApi';
import { Search, MapPin, ChevronRight, Crosshair } from 'lucide-react';

export const StopsView: React.FC = () => {
  const { selectStopById, userLocation, requestUserLocation } = useTransit();

  const [stops, setStops] = useState<GtfsStop[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortByNearby, setSortByNearby] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 30;

  const fetchStops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gtfsApi.getStops({
        search: search.trim() || undefined,
        lat: sortByNearby && userLocation ? userLocation.lat : undefined,
        lon: sortByNearby && userLocation ? userLocation.lng : undefined,
        limit: pageSize,
        offset: page * pageSize,
      });
      setStops(res.stops || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to load stops:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortByNearby, userLocation, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStops();
    }, 180);
    return () => clearTimeout(timer);
  }, [fetchStops]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-[640px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Bus Stops
        </h1>
        <p className="text-xs text-gray-500">
          Locate 6,340+ verified bus stops across Delhi
        </p>
      </div>

      {/* Search Input & Nearby Action */}
      <div className="space-y-2 mb-5">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search stop name or locality..."
            className="w-full pl-11 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50/70 focus:bg-white border border-gray-200/90 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[46px] transition-all"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (!userLocation) requestUserLocation();
              setSortByNearby(!sortByNearby);
              setPage(0);
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
              sortByNearby
                ? 'bg-orange-50 border-orange-500 text-orange-600'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-orange-600" />
            <span>{sortByNearby ? 'Nearest to Me (Active)' : 'Sort Nearest to Me'}</span>
          </button>

          <span className="text-xs text-gray-400">
            {total} Stops
          </span>
        </div>
      </div>

      {/* Stop List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading stops...</div>
      ) : stops.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          No stops found matching "{search}".
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
          {stops.map((s) => (
            <div
              key={s.stop_id}
              onClick={() => selectStopById(s.stop_id)}
              className="py-3.5 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{s.stop_name}</div>
                  <div className="text-[11px] text-gray-400">
                    Stop ID: {s.stop_id}
                    {s.distanceKm !== undefined && (
                      <span className="text-orange-600 font-medium ml-2">
                        • {s.distanceKm < 1 ? `${Math.round(s.distanceKm * 1000)}m away` : `${s.distanceKm} km away`}
                      </span>
                    )}
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
