/// <reference types="google.maps" />
// Source: Google Maps Platform Code Assist
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { useTransit, isGoogleMapsKeyValid } from '../../context/TransitContext';
import { LiveBusCard } from '../../types/transit';
import {
  Navigation,
  Plus,
  Minus,
  RotateCw,
  Layers,
  Key,
  AlertCircle,
  Check,
  MapPin,
  Bus as BusIcon,
  Compass,
  Globe,
} from 'lucide-react';

interface GoogleDelhiMapProps {
  heightClass?: string;
  onBusClick?: (bus: LiveBusCard) => void;
}

// Subcomponent to draw route polyline and fit map bounds
const RoutePolylineAndBounds: React.FC = () => {
  const map = useMap();
  const { selectedRouteStops } = useTransit();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!selectedRouteStops || selectedRouteStops.length === 0) {
      if (polyline) {
        polyline.setMap(null);
        setPolyline(null);
      }
      return;
    }

    const path = selectedRouteStops
      .filter((s) => s.stop_lat && s.stop_lon)
      .map((s) => ({ lat: s.stop_lat, lng: s.stop_lon }));

    if (path.length === 0) return;

    // Remove previous polyline
    if (polyline) {
      polyline.setMap(null);
    }

    // Create modern high-visibility brand blue polyline
    const line = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#0756A8',
      strokeOpacity: 0.9,
      strokeWeight: 5,
    });
    line.setMap(map);
    setPolyline(line);

    // Fit map bounds smoothly
    const bounds = new google.maps.LatLngBounds();
    path.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

    return () => {
      line.setMap(null);
    };
  }, [map, selectedRouteStops]);

  return null;
};

// Subcomponent for custom floating camera controls
const MapControls: React.FC<{
  mapType: string;
  setMapType: (type: string) => void;
}> = ({ mapType, setMapType }) => {
  const map = useMap();
  const {
    requestUserLocation,
    userLocation,
    refreshRealtime,
    mapEngine,
    setMapEngine,
  } = useTransit();
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);

  const handleZoomIn = () => {
    if (!map) return;
    map.setZoom((map.getZoom() || 12) + 1);
  };

  const handleZoomOut = () => {
    if (!map) return;
    map.setZoom((map.getZoom() || 12) - 1);
  };

  const handleLocateMe = () => {
    requestUserLocation();
    if (userLocation && map) {
      map.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      map.setZoom(15);
    }
  };

  return (
    <div className="absolute right-3 bottom-4 z-20 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="flex flex-col bg-white rounded-lg shadow-sm border border-[#E5EAF0] overflow-hidden">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 hover:bg-[#F6F8FB] text-[#172033] flex items-center justify-center border-b border-[#E5EAF0] transition active:scale-95 cursor-pointer font-bold text-base"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 hover:bg-[#F6F8FB] text-[#172033] flex items-center justify-center transition active:scale-95 cursor-pointer font-bold text-base"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Locate Me */}
      <button
        onClick={handleLocateMe}
        title="Locate Me"
        className="w-9 h-9 bg-white hover:bg-[#F6F8FB] text-[#0756A8] rounded-lg shadow-sm border border-[#E5EAF0] flex items-center justify-center transition active:scale-95 cursor-pointer"
      >
        <Navigation className="w-4 h-4 text-[#0756A8]" />
      </button>

      {/* Refresh Transit */}
      <button
        onClick={() => refreshRealtime()}
        title="Refresh Transit Telemetry"
        className="w-9 h-9 bg-white hover:bg-[#F6F8FB] text-[#0756A8] rounded-lg shadow-sm border border-[#E5EAF0] flex items-center justify-center transition active:scale-95 cursor-pointer"
      >
        <RotateCw className="w-4 h-4 text-[#0756A8]" />
      </button>

      {/* Map Layers & Style Selector */}
      <div className="relative">
        <button
          onClick={() => setLayersMenuOpen(!layersMenuOpen)}
          title="Map Layers"
          className={`w-9 h-9 rounded-lg shadow-sm border border-[#E5EAF0] flex items-center justify-center transition active:scale-95 cursor-pointer ${
            layersMenuOpen
              ? 'bg-[#0756A8] text-white'
              : 'bg-white hover:bg-[#F6F8FB] text-[#0756A8]'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {layersMenuOpen && (
          <div className="absolute right-full bottom-0 mr-2 w-52 bg-white rounded-xl shadow-lg border border-[#E5EAF0] py-2 z-30 animate-in fade-in duration-150">
            <div className="px-3 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E5EAF0]">
              Google Maps Style
            </div>

            <button
              onClick={() => {
                setMapType('roadmap');
                if (map) map.setMapTypeId('roadmap');
                setLayersMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                mapType === 'roadmap'
                  ? 'bg-[#FFF1E6] text-[#F47B20] font-bold'
                  : 'text-[#172033] hover:bg-[#F6F8FB]'
              }`}
            >
              <span>Default Roadmap</span>
              {mapType === 'roadmap' && <Check className="w-3.5 h-3.5 text-[#F47B20]" />}
            </button>

            <button
              onClick={() => {
                setMapType('hybrid');
                if (map) map.setMapTypeId('hybrid');
                setLayersMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                mapType === 'hybrid'
                  ? 'bg-[#FFF1E6] text-[#F47B20] font-bold'
                  : 'text-[#172033] hover:bg-[#F6F8FB]'
              }`}
            >
              <span>Satellite & Hybrid</span>
              {mapType === 'hybrid' && <Check className="w-3.5 h-3.5 text-[#F47B20]" />}
            </button>

            <button
              onClick={() => {
                setMapType('terrain');
                if (map) map.setMapTypeId('terrain');
                setLayersMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                mapType === 'terrain'
                  ? 'bg-[#FFF1E6] text-[#F47B20] font-bold'
                  : 'text-[#172033] hover:bg-[#F6F8FB]'
              }`}
            >
              <span>Terrain View</span>
              {mapType === 'terrain' && <Check className="w-3.5 h-3.5 text-[#F47B20]" />}
            </button>

            <div className="my-1 border-t border-[#E5EAF0]"></div>

            <div className="px-3 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Transit Alternative
            </div>
            <button
              onClick={() => {
                setMapEngine('leaflet');
                setLayersMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-[#0756A8] hover:bg-[#F6F8FB] font-medium flex items-center justify-between cursor-pointer"
            >
              <span>Switch to OSM Transit</span>
              <Compass className="w-3.5 h-3.5 text-[#0756A8]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const GoogleDelhiMap: React.FC<GoogleDelhiMapProps> = ({
  heightClass = 'h-[500px] lg:h-[580px]',
  onBusClick,
}) => {
  const {
    googleMapsApiKey,
    buses,
    selectedBus,
    setSelectedBus,
    selectedRouteStops,
    selectedStop,
    selectStopById,
    userLocation,
    realtimeStatus,
    setApiKeyModalOpen,
    setMapEngine,
  } = useTransit();

  const [mapType, setMapType] = useState('roadmap');
  const [activeBusInfo, setActiveBusInfo] = useState<LiveBusCard | null>(null);
  const [authError, setAuthError] = useState(false);

  // Validate Google Maps key format
  const isKeyValid = isGoogleMapsKeyValid(googleMapsApiKey);

  // Delhi center coordinates (Connaught Place)
  const defaultCenter = useMemo(() => ({ lat: 28.625, lng: 77.215 }), []);

  // Listen for Google Maps authentication failures and runtime key error events
  useEffect(() => {
    const handleAuthFailure = () => {
      console.warn('Google Maps authentication failed with current key');
      setAuthError(true);
    };

    const handleKeyError = (e: Event) => {
      console.warn('Google Maps reported key/quota issue:', (e as CustomEvent)?.detail);
      setAuthError(true);
    };

    window.addEventListener('gmp-auth-failure', handleAuthFailure);
    window.addEventListener('gmp-key-error', handleKeyError);

    return () => {
      window.removeEventListener('gmp-auth-failure', handleAuthFailure);
      window.removeEventListener('gmp-key-error', handleKeyError);
    };
  }, []);

  if (!isKeyValid || authError) {
    return (
      <div className={`relative w-full ${heightClass} rounded-xl border border-[#E5EAF0] shadow-xs bg-[#F6F8FB] flex flex-col items-center justify-center p-6 text-center`}>
        <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0756A8] flex items-center justify-center mb-3">
          <Globe className="w-6 h-6 text-[#0756A8]" />
        </div>
        <h3 className="text-base font-bold text-[#172033] mb-1">
          Google Maps Key Setup
        </h3>
        <p className="text-xs text-[#64748B] max-w-md mb-4 leading-relaxed">
          {authError
            ? 'The provided Google Maps API key returned an authentication error (InvalidKeyMapError). Please check your key in settings or switch to Open Transit Map.'
            : 'A valid Google Cloud API key (starting with AIza...) is required to render Google Maps Platform tiles. You can enter your key in settings or continue using Open Transit Map.'}
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="px-4 py-2 bg-[#0756A8] hover:bg-[#063B73] text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            Configure Google Maps Key
          </button>
          <button
            onClick={() => setMapEngine('leaflet')}
            className="px-4 py-2 bg-white border border-[#E5EAF0] hover:bg-[#F6F8FB] text-[#172033] text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#0756A8]" />
            Switch to Open Transit Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-[#E5EAF0] shadow-xs bg-[#EBF1F7]`}>
      {/* Real-time Status Overlay Notification */}
      <div className="absolute top-3 left-3 z-20 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-xs border border-[#E5EAF0] rounded-xl shadow-sm p-3 text-xs pointer-events-auto">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded-md bg-[#FFF1E6] text-[#F47B20] shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="font-bold text-[#172033] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Google Maps Platform Active</span>
              </span>
              <button
                onClick={() => setApiKeyModalOpen(true)}
                className="text-[#0756A8] hover:underline font-semibold inline-flex items-center gap-1 text-[11px] ml-2 cursor-pointer"
              >
                <Key className="w-3 h-3" /> API Key
              </button>
            </div>
            <p className="text-[#64748B] text-[11px] leading-tight">
              {realtimeStatus.available
                ? 'Rendering live Delhi transit fleet GPS positions with Google Maps vector styling.'
                : 'Live tracking active on Google Maps. Real-time telemetry paired with verified GTFS timetables.'}
            </p>
          </div>
        </div>
      </div>

      {/* Google Maps API Provider */}
      <APIProvider apiKey={googleMapsApiKey}>
        <div className="w-full h-full">
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={defaultCenter}
            defaultZoom={12}
            gestureHandling="greedy"
            disableDefaultUI={true}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Selected Route Polyline & Bounds Auto-fitter */}
            <RoutePolylineAndBounds />

            {/* User Location Marker */}
            {userLocation && (
              <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }} title={`📍 ${userLocation.name}`}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-[#0756A8]/25 animate-ping" />
                  <div className="w-4 h-4 rounded-full bg-[#0756A8] border-2 border-white shadow-md z-10" />
                </div>
              </AdvancedMarker>
            )}

            {/* Selected Route Stop Markers */}
            {selectedRouteStops &&
              selectedRouteStops
                .filter((s) => s.stop_lat && s.stop_lon)
                .map((stop, index) => {
                  const isOrigin = index === 0;
                  const isDest = index === selectedRouteStops.length - 1;

                  let badgeColor = 'bg-white text-[#172033] border-[#E5EAF0]';
                  if (isOrigin) badgeColor = 'bg-[#0756A8] text-white border-white shadow-md';
                  else if (isDest) badgeColor = 'bg-[#F47B20] text-white border-white shadow-md';

                  return (
                    <AdvancedMarker
                      key={`stop-${stop.stop_id}-${index}`}
                      position={{ lat: stop.stop_lat, lng: stop.stop_lon }}
                      title={`${index + 1}. ${stop.stop_name}`}
                      onClick={() => selectStopById(stop.stop_id)}
                    >
                      <div className="group cursor-pointer">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${badgeColor} shadow-xs transition-transform transform group-hover:scale-125`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

            {/* Single Selected Stop Marker */}
            {selectedStop &&
              selectedStop.stop_lat &&
              selectedStop.stop_lon &&
              (!selectedRouteStops || selectedRouteStops.length === 0) && (
                <AdvancedMarker
                  position={{ lat: selectedStop.stop_lat, lng: selectedStop.stop_lon }}
                  title={selectedStop.stop_name}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0756A8] border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                </AdvancedMarker>
              )}

            {/* Live Bus Markers */}
            {buses &&
              buses.map((bus) => {
                const isSelected = selectedBus?.id === bus.id || selectedBus?.busNumber === bus.busNumber;
                const markerColor = isSelected ? '#F47B20' : '#0756A8';
                const pulseClass = isSelected ? 'animate-pulse' : '';

                return (
                  <AdvancedMarker
                    key={bus.id}
                    position={{ lat: bus.currentLat, lng: bus.currentLng }}
                    title={`Bus ${bus.busNumber}: ${bus.origin} → ${bus.destination}`}
                    onClick={() => {
                      setSelectedBus(bus);
                      setActiveBusInfo(bus);
                      if (onBusClick) onBusClick(bus);
                    }}
                  >
                    <div className="relative flex flex-col items-center cursor-pointer group">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md border-2 border-white transition-all transform group-hover:scale-110 ${pulseClass}`}
                        style={{ backgroundColor: markerColor }}
                      >
                        <BusIcon className="w-5 h-5 text-white" />
                      </div>
                      <div
                        className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs whitespace-nowrap"
                        style={{ backgroundColor: markerColor }}
                      >
                        {bus.busNumber}
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* InfoWindow for Clicked Bus */}
            {activeBusInfo && (
              <InfoWindow
                position={{ lat: activeBusInfo.currentLat, lng: activeBusInfo.currentLng }}
                onCloseClick={() => setActiveBusInfo(null)}
              >
                <div className="p-1 min-w-[190px] text-[#172033]">
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5 mb-1.5">
                    <span className="px-2 py-0.5 bg-[#0756A8] text-white text-xs font-black rounded">
                      Bus {activeBusInfo.busNumber}
                    </span>
                    <span className="text-xs font-extrabold text-[#F47B20]">
                      {activeBusInfo.etaMin} min ETA
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#0756A8] truncate mb-1">
                    {activeBusInfo.origin} → {activeBusInfo.destination}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Approaching: <strong className="text-[#172033]">{activeBusInfo.nextStopName}</strong>
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-1 pt-1 border-t border-gray-100 flex justify-between">
                    <span>{activeBusInfo.regNumber}</span>
                    <span className="font-semibold text-emerald-600">{activeBusInfo.status}</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Floating Map Controls */}
            <MapControls mapType={mapType} setMapType={setMapType} />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};
