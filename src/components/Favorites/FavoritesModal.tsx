import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { Star, X, MapPin, ChevronRight, Trash2 } from 'lucide-react';

export const FavoritesModal: React.FC = () => {
  const {
    favoritesOpen,
    setFavoritesOpen,
    favorites,
    toggleFavoriteRoute,
    toggleFavoriteStop,
    selectRouteById,
    selectStopById,
  } = useTransit();

  if (!favoritesOpen) return null;

  const totalFavs = (favorites.routes?.length || 0) + (favorites.stops?.length || 0);

  const handleRouteClick = (routeId: string) => {
    setFavoritesOpen(false);
    selectRouteById(routeId);
  };

  const handleStopClick = (stopId: string) => {
    setFavoritesOpen(false);
    selectStopById(stopId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-orange-600 text-orange-600" />
            <h3 className="font-bold text-base text-gray-900">Saved Favourites ({totalFavs})</h3>
          </div>
          <button
            onClick={() => setFavoritesOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {totalFavs === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">No favourites saved yet</p>
              <p className="mt-1 text-gray-400">Tap the star icon on any bus route or stop to save it here.</p>
            </div>
          ) : (
            <>
              {/* Routes */}
              {favorites.routes.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Favourite Routes
                  </div>
                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                    {favorites.routes.map((routeId) => (
                      <div
                        key={routeId}
                        className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px]"
                      >
                        <div
                          onClick={() => handleRouteClick(routeId)}
                          className="flex-1 flex items-center gap-2"
                        >
                          <span className="font-bold text-orange-600 text-base">Route #{routeId}</span>
                        </div>
                        <button
                          onClick={() => toggleFavoriteRoute(routeId)}
                          className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stops */}
              {favorites.stops.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Favourite Stops
                  </div>
                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                    {favorites.stops.map((stopId) => (
                      <div
                        key={stopId}
                        className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px]"
                      >
                        <div
                          onClick={() => handleStopClick(stopId)}
                          className="flex-1 flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-gray-800 text-sm">Stop #{stopId}</span>
                        </div>
                        <button
                          onClick={() => toggleFavoriteStop(stopId)}
                          className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
  );
};
