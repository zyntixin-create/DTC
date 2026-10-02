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
    user,
    authLoading,
    loginWithGoogle,
    logoutUser,
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
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Firebase Cloud Sync Banner */}
          {user ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-emerald-300 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span>☁️ Firebase Cloud Sync Active</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={logoutUser}
                className="text-[11px] font-bold text-gray-600 hover:text-red-600 bg-white border border-gray-200 px-2.5 py-1 rounded-lg transition cursor-pointer shrink-0 ml-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3 text-xs">
              <div className="font-bold text-gray-900 mb-0.5">Sync saved transit across devices</div>
              <div className="text-[11px] text-gray-600 mb-2">
                Sign in to back up your favorite DTC bus routes and stops to Firebase.
              </div>
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={authLoading}
                className="w-full py-2 px-3 bg-white hover:bg-gray-50 active:scale-98 border border-gray-300 shadow-2xs rounded-lg font-bold text-gray-800 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{authLoading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            </div>
          )}
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
