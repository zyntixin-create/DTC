import React, { useState, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { GtfsRoute } from '../../types/transit';
import { gtfsApi } from '../../services/gtfsApi';
import { DtcBusGraphic } from '../Common/DtcBusGraphic';
import { ArrowRight, ChevronRight, Eye } from 'lucide-react';

export const PopularRoutes: React.FC = () => {
  const { selectRouteById, selectStopById, setActiveTab } = useTransit();
  const [popularRoutes, setPopularRoutes] = useState<GtfsRoute[]>([]);
  const [popularStops, setPopularStops] = useState<any[]>([]);
  const [activeTab, setActiveTabState] = useState<'routes' | 'stops'>('routes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gtfsApi
      .getPopular()
      .then((data) => {
        setPopularRoutes(data.routes || []);
        setPopularStops(data.stops || []);
      })
      .catch((err) => console.error('Failed to load popular items:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-[640px] mx-auto mb-8">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          {activeTab === 'routes' ? 'Popular Routes' : 'Popular Bus Stops'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabState('routes')}
            className={`text-xs font-semibold px-2 py-1 rounded cursor-pointer ${
              activeTab === 'routes'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Routes
          </button>
          <button
            onClick={() => setActiveTabState('stops')}
            className={`text-xs font-semibold px-2 py-1 rounded cursor-pointer ${
              activeTab === 'stops'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Stops
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-gray-400">Loading popular transit routes...</div>
      ) : activeTab === 'routes' ? (
        <div className="divide-y divide-gray-100 bg-white">
          {popularRoutes.slice(0, 7).map((r) => (
            <div
              key={r.route_id}
              onClick={() => selectRouteById(r.route_id)}
              className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
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
                    {r.stop_count || 40} stops along route
                  </div>
                </div>
              </div>

              <div className="text-gray-400 hover:text-orange-600 pl-2">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}

          <div className="pt-3 text-center">
            <button
              onClick={() => setActiveTab('routes')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              View all 2,900+ Bus Routes →
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 bg-white">
          {popularStops.map((s) => (
            <div
              key={s.id}
              onClick={() => selectStopById(s.id)}
              className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-gray-900">{s.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{s.area} · {s.type}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
