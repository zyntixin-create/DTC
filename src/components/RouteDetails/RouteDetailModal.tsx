import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { RouteStopTimeline } from './RouteStopTimeline';
import { DelhiMap } from '../Map/DelhiMap';
import { DtcBusGraphic } from '../Common/DtcBusGraphic';
import { ArrowLeft, Star, Share2, Map as MapIcon, ChevronRight, RotateCw, X } from 'lucide-react';
import { ShareModal, ShareData } from '../Share/ShareModal';

export const RouteDetailModal: React.FC = () => {
  const {
    selectedRoute,
    returnRoute,
    switchToReturnRoute,
    selectedRouteStops,
    loadingRouteStops,
    clearSelectedRoute,
    routeModalOpen,
    isFavoriteRoute,
    toggleFavoriteRoute,
  } = useTransit();

  const [showMap, setShowMap] = useState(false);
  const [shareData, setShareData] = useState<ShareData | null>(null);

  if (!routeModalOpen || !selectedRoute) return null;

  const isFav = isFavoriteRoute(selectedRoute.route_id);
  const approxDurationMin = Math.round((selectedRoute.stop_count || 40) * 2.6);
  const hours = Math.floor(approxDurationMin / 60);
  const mins = approxDurationMin % 60;
  const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const handleShare = () => {
    const url = `${window.location.origin}/#/bus/${selectedRoute.route_short_name}`;
    setShareData({
      title: `Bus ${selectedRoute.route_short_name}`,
      text: `Delhi Route ${selectedRoute.route_short_name}: ${selectedRoute.origin_stop_name || 'Terminal'} → ${selectedRoute.dest_stop_name || 'Terminal'} (${selectedRoute.stop_count || 40} stops)`,
      url
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="bg-white min-h-screen sm:min-h-0 sm:rounded-xl shadow-xl max-w-xl w-full flex flex-col border border-gray-200 overflow-hidden my-0 sm:my-6">
          {/* Top Bar: ← Back + Actions */}
          <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
            <button
              onClick={clearSelectedRoute}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-600 cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                className="p-2 text-gray-500 hover:text-orange-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Share Route"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => toggleFavoriteRoute(selectedRoute.route_id)}
                className="p-2 text-gray-500 hover:text-orange-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Save Favourite"
              >
                <Star className={`w-5 h-5 ${isFav ? 'fill-orange-600 text-orange-600' : ''}`} />
              </button>
              <button
                onClick={clearSelectedRoute}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Route Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3.5 mb-2">
              <DtcBusGraphic
                routeNumber={selectedRoute.route_short_name}
                variant={selectedRoute.route_short_name.endsWith('E') ? 'green' : 'orange'}
                size="md"
                className="shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
                    Bus {selectedRoute.route_short_name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 px-2 py-0.5 rounded bg-gray-100">
                    {selectedRoute.route_short_name.endsWith('STL') ? 'Cluster' : 'DTC Low-Floor'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selectedRoute.stop_count || selectedRouteStops.length || 40} stops • Approx {durationText}
                </div>
              </div>
            </div>

            <div className="text-sm sm:text-base font-semibold text-gray-900 mt-2 flex items-center gap-1.5 flex-wrap">
              <span>{selectedRoute.origin_stop_name || 'Terminal'}</span>
              <span className="text-gray-400">→</span>
              <span>{selectedRoute.dest_stop_name || 'Terminal'}</span>
            </div>

            {/* Action buttons row: [ View Map ] & [ View Return Journey ] */}
            <div className="flex items-center gap-2.5 mt-4 flex-wrap">
              <button
                onClick={() => setShowMap(!showMap)}
                className="px-4 py-2 bg-white border border-orange-600 text-orange-600 hover:bg-orange-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                <MapIcon className="w-4 h-4" />
                <span>{showMap ? 'Hide Map' : 'View Map'}</span>
              </button>

              {returnRoute && (
                <button
                  onClick={switchToReturnRoute}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>View Return Journey</span>
                </button>
              )}
            </div>
          </div>

          {/* Optional Toggleable Map */}
          {showMap && (
            <div className="border-b border-gray-200 h-[280px] w-full relative bg-gray-100">
              <DelhiMap heightClass="h-full w-full" />
            </div>
          )}

          {/* Route Stops Sequence */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-white">
            {loadingRouteStops ? (
              <div className="p-8 text-center text-xs text-gray-400">Loading stops...</div>
            ) : (
              <RouteStopTimeline
                stops={selectedRouteStops}
                routeNumber={selectedRoute.route_short_name}
                routeName={selectedRoute.route_long_name}
              />
            )}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={Boolean(shareData)}
        onClose={() => setShareData(null)}
        data={shareData}
      />
    </>
  );
};
