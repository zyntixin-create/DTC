import React, { useState } from 'react';
import { ArrowLeft, Share2, X, Train, ChevronRight, MapPin } from 'lucide-react';
import { useTransit } from '../../context/TransitContext';
import { ShareModal, ShareData } from '../Share/ShareModal';

export const MetroStationDetailModal: React.FC = () => {
  const {
    selectedMetroStation,
    metroDetailModalOpen,
    setMetroDetailModalOpen,
    selectRouteById,
    language
  } = useTransit();

  const [shareData, setShareData] = useState<ShareData | null>(null);

  if (!metroDetailModalOpen || !selectedMetroStation) return null;

  const handleShareClick = () => {
    const url = `${window.location.origin}/#/metro/${selectedMetroStation.id}`;
    setShareData({
      title: `${selectedMetroStation.name} - Delhi Metro`,
      text: `Metro station with interchange lines: ${selectedMetroStation.lines.join(', ')}. Connects with DTC buses: ${selectedMetroStation.connectingBusNumbers.slice(0, 6).join(', ')}`,
      url
    });
  };

  const displayName = language === 'hi' ? selectedMetroStation.nameHindi : selectedMetroStation.name;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="bg-white min-h-screen sm:min-h-0 sm:rounded-xl shadow-xl max-w-xl w-full flex flex-col border border-gray-200 overflow-hidden my-0 sm:my-6">
          {/* Top Bar */}
          <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
            <button
              onClick={() => setMetroDetailModalOpen(false)}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-600 cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handleShareClick}
                className="p-2 text-gray-500 hover:text-orange-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Share Station"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMetroDetailModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Station Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-white">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {displayName}
            </h1>
            <div className="text-xs text-gray-500 mt-1">
              Lines: {selectedMetroStation.lines.join(' · ')}
              {selectedMetroStation.isInterchange && (
                <span className="text-orange-600 font-semibold ml-2">• Interchange</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              First train: {selectedMetroStation.firstTrain} • Last train: {selectedMetroStation.lastTrain}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-4 sm:p-5 space-y-6 overflow-y-auto flex-1 bg-white">
            {/* Connecting Bus Numbers */}
            {selectedMetroStation.connectingBusNumbers.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Connecting DTC Bus Numbers ({selectedMetroStation.connectingBusNumbers.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMetroStation.connectingBusNumbers.map((busNum, idx) => (
                    <button
                      key={idx}
                      onClick={async () => {
                        setMetroDetailModalOpen(false);
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:border-orange-500 rounded-lg text-xs font-bold text-orange-600 cursor-pointer min-h-[36px]"
                    >
                      Bus {busNum}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Bus Stops */}
            {selectedMetroStation.nearbyBusStops.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Nearby Bus Stops
                </div>
                <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                  {selectedMetroStation.nearbyBusStops.map((st, idx) => (
                    <div
                      key={idx}
                      className="py-3 px-1 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                        <span className="font-medium text-gray-900">{st.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        ~{st.distanceM}m ({st.walkingMin} min walk)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
