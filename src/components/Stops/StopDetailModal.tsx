import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { ArrowLeft, Star, Share2, X, ChevronRight, Train, MapPin } from 'lucide-react';
import { ShareModal, ShareData } from '../Share/ShareModal';

export const StopDetailModal: React.FC = () => {
  const {
    stopModalOpen,
    selectedStop,
    selectedStopDetails,
    loadingStopDetails,
    clearSelectedStop,
    selectRouteById,
    selectStopById,
    openMetroStation,
    isFavoriteStop,
    toggleFavoriteStop,
  } = useTransit();

  const [shareData, setShareData] = useState<ShareData | null>(null);

  if (!stopModalOpen || !selectedStop) return null;

  const isFav = isFavoriteStop(selectedStop.stop_id);
  const routesServing = selectedStopDetails?.routesServing || [];
  const nearbyMetro = selectedStopDetails?.nearbyMetroStations || [];
  const nearbyStops = selectedStopDetails?.nearbyStops || [];

  const handleShare = () => {
    const url = `${window.location.origin}/#/stop/${selectedStop.stop_id}`;
    setShareData({
      title: `${selectedStop.stop_name} - Bus Stop`,
      text: `Delhi bus stop ${selectedStop.stop_name} (ID: ${selectedStop.stop_id}) with ${routesServing.length} bus routes.`,
      url
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="bg-white min-h-screen sm:min-h-0 sm:rounded-xl shadow-xl max-w-xl w-full flex flex-col border border-gray-200 overflow-hidden my-0 sm:my-6">
          {/* Top Bar */}
          <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
            <button
              onClick={clearSelectedStop}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-600 cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                className="p-2 text-gray-500 hover:text-orange-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Share Stop"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => toggleFavoriteStop(selectedStop.stop_id)}
                className="p-2 text-gray-500 hover:text-orange-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Save Favourite"
              >
                <Star className={`w-5 h-5 ${isFav ? 'fill-orange-600 text-orange-600' : ''}`} />
              </button>
              <button
                onClick={clearSelectedStop}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stop Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-white">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {selectedStop.stop_name}
            </h1>
            <div className="text-xs text-gray-500 mt-0.5">
              Bus Stop • ID #{selectedStop.stop_id}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-5 space-y-6 overflow-y-auto flex-1 bg-white">
            {loadingStopDetails ? (
              <div className="p-8 text-center text-xs text-gray-400">Loading stop information...</div>
            ) : (
              <>
                {/* 1. Nearby buses */}
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Nearby buses ({routesServing.length})
                  </div>

                  {routesServing.length === 0 ? (
                    <div className="text-xs text-gray-400 py-3">No routes recorded for this stop.</div>
                  ) : (
                    <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                      {routesServing.map((r: any) => (
                        <div
                          key={r.route_id}
                          onClick={() => {
                            clearSelectedStop();
                            selectRouteById(r.route_id);
                          }}
                          className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-orange-600 text-base tabular-nums min-w-[44px]">
                              {r.route_short_name}
                            </span>
                            <div className="text-xs sm:text-sm font-medium text-gray-800">
                              → {r.dest_stop_name || 'Terminal'}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Nearby Metro */}
                {nearbyMetro.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Nearby Metro
                    </div>

                    <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                      {nearbyMetro.map((m: any) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            clearSelectedStop();
                            openMetroStation(m);
                          }}
                          className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Train className="w-4 h-4 text-orange-600 shrink-0" />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{m.name}</div>
                              <div className="text-[11px] text-gray-400">
                                {m.lines?.join(' · ')} • ~{m.distanceM}m walk
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Nearby Stops */}
                {nearbyStops.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Nearby Stops
                    </div>

                    <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                      {nearbyStops.slice(0, 6).map((ns: any) => (
                        <div
                          key={ns.stop_id}
                          onClick={() => selectStopById(ns.stop_id)}
                          className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{ns.stop_name}</div>
                              <div className="text-[11px] text-gray-400">~{ns.distanceM}m away</div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
