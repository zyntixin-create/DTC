import React, { useState, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { GtfsStop } from '../../types/transit';
import { gtfsApi } from '../../services/gtfsApi';
import { MapPin, ChevronRight, Crosshair } from 'lucide-react';

export const NearbyBuses: React.FC = () => {
  const {
    userLocation,
    requestUserLocation,
    selectStopById,
  } = useTransit();

  const [nearbyStops, setNearbyStops] = useState<GtfsStop[]>([]);
  const [loadingStops, setLoadingStops] = useState(false);

  useEffect(() => {
    if (!userLocation) return;
    setLoadingStops(true);
    gtfsApi
      .getStops({
        lat: userLocation.lat,
        lon: userLocation.lng,
        limit: 4,
      })
      .then((res) => {
        setNearbyStops(res.stops || []);
      })
      .catch((err) => console.error('Failed to load nearby stops:', err))
      .finally(() => setLoadingStops(false));
  }, [userLocation]);

  if (!userLocation && nearbyStops.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[640px] mx-auto mb-8">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Nearby Stops ({userLocation ? userLocation.name.split(',')[0] : 'Delhi'})
          </h2>
        </div>
        <button
          onClick={requestUserLocation}
          className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loadingStops ? (
        <div className="py-6 text-center text-xs text-gray-400">Finding nearby stops...</div>
      ) : (
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
          {nearbyStops.map((s) => (
            <div
              key={s.stop_id}
              onClick={() => selectStopById(s.stop_id)}
              className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{s.stop_name}</div>
                  <div className="text-[11px] text-gray-400">
                    {s.distanceKm !== undefined
                      ? `${Math.round(s.distanceKm * 1000)}m away`
                      : `Stop ID: ${s.stop_id}`}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
