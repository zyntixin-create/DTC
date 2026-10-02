import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useTransit } from '../../context/TransitContext';
import { GtfsStopTime, LiveBusCard } from '../../types/transit';
import { GoogleDelhiMap } from './GoogleDelhiMap';
import { getTileCacheStats, preloadDelhiTiles, clearTileCache, TileCacheStats } from '../../utils/serviceWorker';
import {
  Navigation,
  Plus,
  Minus,
  RotateCw,
  Layers,
  Key,
  AlertCircle,
  Check,
  Globe,
  WifiOff,
  HardDrive,
  DownloadCloud,
  Trash2,
  X
} from 'lucide-react';

interface DelhiMapProps {
  heightClass?: string;
  onBusClick?: (bus: LiveBusCard) => void;
  journeyOption?: any;
  minimalControls?: boolean;
}

const TILE_LAYERS = {
  standard: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
  },
  light: {
    name: 'Transit Light',
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
  },
  voyager: {
    name: 'Detailed Transit',
    url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
  },
};

export const DelhiMap: React.FC<DelhiMapProps> = ({
  heightClass = 'h-[500px] lg:h-[580px]',
  onBusClick,
  journeyOption,
  minimalControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routePolyline2Ref = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<'standard' | 'light' | 'voyager'>('standard');
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [cacheStats, setCacheStats] = useState<TileCacheStats | null>(null);
  const [cacheModalOpen, setCacheModalOpen] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);

  const {
    selectedRoute,
    selectedRouteStops,
    selectedStop,
    buses,
    selectedBus,
    setSelectedBus,
    userLocation,
    selectStopById,
    realtimeStatus,
    refreshRealtime,
    setApiKeyModalOpen,
    requestUserLocation,
    mapEngine,
    setMapEngine,
    googleMapsApiKey,
    activeJourneyOption,
  } = useTransit();

  const currentJourney = journeyOption !== undefined ? journeyOption : activeJourneyOption;

  // If Google Maps is selected and an API key is available, render Google Delhi Map
  if (mapEngine === 'google' && googleMapsApiKey) {
    return <GoogleDelhiMap heightClass={heightClass} onBusClick={onBusClick} />;
  }

  // Initialize Leaflet Map with OpenStreetMap centered on Delhi [28.6139, 77.2090]
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Delhi (default location: [28.6139, 77.2090], zoom: 11)
    const map = L.map(mapContainerRef.current, {
      center: [28.6139, 77.2090],
      zoom: 11,
      zoomControl: false,
      maxBounds: [
        [28.10, 76.60],
        [29.10, 77.70],
      ],
      minZoom: 9,
      maxZoom: 18,
    });

    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    currentTileLayerRef.current = tileLayer;

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Invalidate size to guarantee no partial or gray tiles
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 500);

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer switching
  const handleSwitchLayer = (layerKey: 'standard' | 'light' | 'voyager') => {
    setActiveLayer(layerKey);
    setLayersMenuOpen(false);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const cfg = TILE_LAYERS[layerKey];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 19,
    }).addTo(map);
    currentTileLayerRef.current = newLayer;
  };

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-[#0756A8]/20 animate-ping"></div>
        <div class="w-4 h-4 rounded-full bg-[#0756A8] border-2 border-white shadow-md z-10"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-location-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindTooltip(`📍 ${userLocation.name}`, { direction: 'top', offset: [0, -10] });

    userMarkerRef.current = marker;
  }, [userLocation]);

  // Render Route line, Ordered Stops, Journey Paths, and Bus Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (routePolyline2Ref.current) {
      routePolyline2Ref.current.remove();
      routePolyline2Ref.current = null;
    }

    // 1. Draw Active From -> To Journey (Direct or Connecting with real road turns)
    if (currentJourney) {
      const bounds = L.latLngBounds([]);

      if (currentJourney.type === 'DIRECT') {
        const roadCoords: [number, number][] = currentJourney.roadGeometry ||
          currentJourney.intermediateStops?.map((s: any) => [s.stop_lat, s.stop_lon]) || [];

        if (roadCoords.length > 0) {
          const polyline = L.polyline(roadCoords, {
            color: '#EA580C', // Vivid Transit Orange
            weight: 6,
            opacity: 0.95,
            lineJoin: 'round',
            lineCap: 'round',
          }).addTo(map);
          routePolylineRef.current = polyline;
          bounds.extend(polyline.getBounds());
        }

        // Optional walking path to boarding stop if walking from origin
        if (currentJourney.walkToBoardingM > 50 && currentJourney.anchorFrom?.stop_lat && currentJourney.anchorFrom?.stop_lon) {
          const aStop = currentJourney.anchorFrom;
          const aHtml = `
            <div class="px-2 py-0.5 bg-gray-800 text-white text-[10px] font-bold rounded-md shadow-md border border-white whitespace-nowrap flex items-center gap-1">
              <span>🚶 Start: ${aStop.stop_name}</span>
            </div>
          `;
          const aIcon = L.divIcon({ html: aHtml, className: 'custom-walk-start-pin', iconSize: [95, 24], iconAnchor: [47, 12] });
          L.marker([aStop.stop_lat, aStop.stop_lon], { icon: aIcon })
            .bindTooltip(`<b>Origin:</b> ${aStop.stop_name}<br/>Walk ${currentJourney.walkToBoardingM}m to boarding stop`, { direction: 'top' })
            .addTo(layer);
          bounds.extend([aStop.stop_lat, aStop.stop_lon]);

          // Dashed walking polyline to boarding stop
          const walkLine = L.polyline([[aStop.stop_lat, aStop.stop_lon], [currentJourney.boardingStop.stop_lat, currentJourney.boardingStop.stop_lon]], {
            dashArray: '5, 8',
            color: '#D97706',
            weight: 3.5,
            opacity: 0.9
          }).addTo(layer);
          bounds.extend(walkLine.getBounds());
        }

        // Add Boarding Stop pin
        if (currentJourney.boardingStop?.stop_lat && currentJourney.boardingStop?.stop_lon) {
          const bStop = currentJourney.boardingStop;
          const bHtml = `
            <div class="flex items-center justify-center">
              <div class="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-lg shadow-md border-2 border-white whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
                <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>📍 Board Bus ${currentJourney.routeNumber}</span>
              </div>
            </div>
          `;
          const bIcon = L.divIcon({ html: bHtml, className: 'custom-boarding-pin', iconSize: [120, 30], iconAnchor: [60, 15] });
          const bPopup = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 180px;">
              <div style="display: inline-block; background: #059669; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
                🚌 Bus ${currentJourney.routeNumber} • Origin
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #111827; line-height: 1.25;">${bStop.stop_name}</div>
              <div style="font-size: 11px; font-weight: 700; color: #059669; margin-top: 3px;">📍 Stop 1 of ${(currentJourney.intermediateStops || []).length || currentJourney.totalStops} (Boarding Stop)</div>
            </div>
          `;
          L.marker([bStop.stop_lat, bStop.stop_lon], { icon: bIcon })
            .bindTooltip(`<b>📍 Board Bus ${currentJourney.routeNumber}</b><br/>${bStop.stop_name}`, { direction: 'top' })
            .bindPopup(bPopup)
            .addTo(layer);
          bounds.extend([bStop.stop_lat, bStop.stop_lon]);
        }

        // Add Destination Stop pin
        if (currentJourney.destinationStop?.stop_lat && currentJourney.destinationStop?.stop_lon) {
          const dStop = currentJourney.destinationStop;
          const totalSeq = (currentJourney.intermediateStops || []).length || currentJourney.totalStops;
          const dHtml = `
            <div class="flex items-center justify-center">
              <div class="px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-lg shadow-md border-2 border-white whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
                <span>🏁 Final Stop</span>
              </div>
            </div>
          `;
          const dIcon = L.divIcon({ html: dHtml, className: 'custom-dest-pin', iconSize: [100, 30], iconAnchor: [50, 15] });
          const dPopup = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 180px;">
              <div style="display: inline-block; background: #dc2626; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
                🏁 Bus ${currentJourney.routeNumber} • Destination
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #111827; line-height: 1.25;">${dStop.stop_name}</div>
              <div style="font-size: 11px; font-weight: 700; color: #dc2626; margin-top: 3px;">📍 Stop ${totalSeq} of ${totalSeq} (Alight Here)</div>
            </div>
          `;
          L.marker([dStop.stop_lat, dStop.stop_lon], { icon: dIcon })
            .bindTooltip(`<b>🏁 Drop-off Stop</b><br/>${dStop.stop_name}`, { direction: 'top' })
            .bindPopup(dPopup)
            .addTo(layer);
          bounds.extend([dStop.stop_lat, dStop.stop_lon]);
        }

        // Optional walking path from dropoff to final destination
        if (currentJourney.walkFromDropoffM > 50 && currentJourney.anchorTo?.stop_lat && currentJourney.anchorTo?.stop_lon) {
          const tStop = currentJourney.anchorTo;
          const tHtml = `
            <div class="px-2 py-0.5 bg-gray-800 text-white text-[10px] font-bold rounded-md shadow-md border border-white whitespace-nowrap flex items-center gap-1">
              <span>🎯 ${tStop.stop_name}</span>
            </div>
          `;
          const tIcon = L.divIcon({ html: tHtml, className: 'custom-walk-end-pin', iconSize: [95, 24], iconAnchor: [47, 12] });
          L.marker([tStop.stop_lat, tStop.stop_lon], { icon: tIcon })
            .bindTooltip(`<b>Final Destination:</b> ${tStop.stop_name}`, { direction: 'top' })
            .addTo(layer);
          bounds.extend([tStop.stop_lat, tStop.stop_lon]);

          // Dashed walking polyline
          const walkLine2 = L.polyline([[currentJourney.destinationStop.stop_lat, currentJourney.destinationStop.stop_lon], [tStop.stop_lat, tStop.stop_lon]], {
            dashArray: '5, 8',
            color: '#4B5563',
            weight: 3.5,
            opacity: 0.9
          }).addTo(layer);
          bounds.extend(walkLine2.getBounds());
        }

        // Add intermediate stop markers with Stop Name + Bus Number + Stop Sequence
        const stopsList = currentJourney.intermediateStops || [];
        stopsList.forEach((st: any, idx: number) => {
          if (!st.stop_lat || !st.stop_lon) return;
          if (idx === 0 || idx === stopsList.length - 1) return; // already marked as boarding/dest

          const stopHtml = `
            <div class="w-6 h-6 rounded-full bg-white text-gray-900 border-2 border-orange-500 shadow-md flex items-center justify-center text-[10px] font-black hover:scale-125 transition-transform cursor-pointer">
              ${idx + 1}
            </div>
          `;
          const sIcon = L.divIcon({ html: stopHtml, className: 'intermediate-stop-pin', iconSize: [24, 24], iconAnchor: [12, 12] });
          const stopPopup = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 175px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
                <span style="background: #ea580c; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">🚌 Bus ${currentJourney.routeNumber}</span>
                <span style="font-size: 10px; font-weight: 700; color: #ea580c; background: #fff7ed; padding: 2px 6px; border-radius: 4px; border: 1px solid #fed7aa;">Direct</span>
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #111827; line-height: 1.25;">${st.stop_name}</div>
              <div style="font-size: 11px; font-weight: 700; color: #4b5563; margin-top: 3px;">📍 Stop Sequence: <b>${idx + 1} of ${stopsList.length}</b></div>
              ${st.distanceKmFromStart !== undefined ? `<div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Distance: ~${st.distanceKmFromStart} km from origin</div>` : ''}
            </div>
          `;

          L.marker([st.stop_lat, st.stop_lon], { icon: sIcon })
            .bindTooltip(`<b>Stop ${idx + 1}: ${st.stop_name}</b><br/><span style="color:#ea580c;font-weight:bold;">Bus ${currentJourney.routeNumber}</span>`, { direction: 'top' })
            .bindPopup(stopPopup)
            .on('click', () => selectStopById(st.stop_id))
            .addTo(layer);
        });
      } else if (currentJourney.type === 'CONNECTING') {
        // Leg 1 Polyline (Orange)
        const leg1Coords: [number, number][] = currentJourney.route1?.roadGeometry ||
          currentJourney.route1?.intermediateStops?.map((s: any) => [s.stop_lat, s.stop_lon]) || [];

        if (leg1Coords.length > 0) {
          const polyline1 = L.polyline(leg1Coords, {
            color: '#EA580C', // Orange for Bus 1
            weight: 6,
            opacity: 0.95,
            lineJoin: 'round',
          }).addTo(map);
          routePolylineRef.current = polyline1;
          bounds.extend(polyline1.getBounds());
        }

        // Leg 2 Polyline (Blue)
        const leg2Coords: [number, number][] = currentJourney.route2?.roadGeometry ||
          currentJourney.route2?.intermediateStops?.map((s: any) => [s.stop_lat, s.stop_lon]) || [];

        if (leg2Coords.length > 0) {
          const polyline2 = L.polyline(leg2Coords, {
            color: '#0756A8', // Blue for Bus 2
            weight: 6,
            opacity: 0.95,
            lineJoin: 'round',
          }).addTo(map);
          routePolyline2Ref.current = polyline2;
          bounds.extend(polyline2.getBounds());
        }

        // Boarding pin (Leg 1)
        if (currentJourney.route1?.boardingStop) {
          const bStop = currentJourney.route1.boardingStop;
          const leg1StopsCount = currentJourney.route1.intermediateStops?.length || currentJourney.route1.stopsCount + 1;
          const bHtml = `<div class="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-lg shadow-md border-2 border-white whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>📍 Board Bus ${currentJourney.route1.routeNumber}</span>
          </div>`;
          const bIcon = L.divIcon({ html: bHtml, className: 'custom-boarding-pin', iconSize: [120, 30], iconAnchor: [60, 15] });
          const bPopup = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 180px;">
              <div style="display: inline-block; background: #ea580c; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
                PART 1 — Bus ${currentJourney.route1.routeNumber}
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #111827; line-height: 1.25;">${bStop.stop_name}</div>
              <div style="font-size: 11px; font-weight: 700; color: #059669; margin-top: 3px;">📍 Stop 1 of ${leg1StopsCount} (Board Bus 1)</div>
            </div>
          `;
          L.marker([bStop.stop_lat, bStop.stop_lon], { icon: bIcon })
            .bindTooltip(`<b>Start Trip:</b> ${bStop.stop_name}<br/>Bus ${currentJourney.route1.routeNumber}`, { direction: 'top' })
            .bindPopup(bPopup)
            .addTo(layer);
          bounds.extend([bStop.stop_lat, bStop.stop_lon]);
        }

        // Transfer / Changeover pin
        if (currentJourney.changeover) {
          const xStop = currentJourney.changeover;
          const xHtml = `
            <div class="px-2.5 py-1.5 bg-amber-500 text-white text-[11px] font-black rounded-lg shadow-lg border-2 border-white whitespace-nowrap flex items-center gap-1.5 cursor-pointer animate-bounce duration-1000">
              <span>🔄 Change to Bus ${currentJourney.route2.routeNumber}</span>
            </div>
          `;
          const xIcon = L.divIcon({ html: xHtml, className: 'custom-xfer-pin', iconSize: [140, 32], iconAnchor: [70, 16] });
          const xPopup = `
            <div style="font-family: system-ui, sans-serif; padding: 3px; min-width: 210px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px;">
                <span style="background: #f59e0b; color: white; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 4px;">🔄 CHANGE BUS</span>
                <span style="font-size: 10px; font-weight: 800; color: #92400e; background: #fef3c7; padding: 2px 6px; border-radius: 4px;">Transfer Point</span>
              </div>
              <div style="font-size: 14px; font-weight: 900; color: #111827; line-height: 1.25;">${xStop.stopName}</div>
              <div style="margin-top: 6px; padding: 6px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; font-size: 11px; line-height: 1.4;">
                <div><b>Get down from:</b> Bus ${currentJourney.route1.routeNumber}</div>
                <div><b>Board next:</b> Bus ${currentJourney.route2.routeNumber}</div>
                <div style="color: #6b7280; font-size: 10px; margin-top: 2px;">🚶 Walk ~${xStop.walkingDistanceM}m · ⏱ Wait ~${xStop.estimatedWaitMin} min</div>
              </div>
            </div>
          `;
          L.marker([xStop.lat, xStop.lon], { icon: xIcon })
            .bindTooltip(`<b>🔄 Change Bus at ${xStop.stopName}</b><br/>Bus ${currentJourney.route1.routeNumber} → Bus ${currentJourney.route2.routeNumber}`, { direction: 'top' })
            .bindPopup(xPopup)
            .addTo(layer);
          bounds.extend([xStop.lat, xStop.lon]);
        }

        // Destination pin
        if (currentJourney.route2?.destinationStop) {
          const dStop = currentJourney.route2.destinationStop;
          const leg2StopsCount = currentJourney.route2.intermediateStops?.length || currentJourney.route2.stopsCount + 1;
          const dHtml = `<div class="px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-lg shadow-md border-2 border-white whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
            <span>🏁 Final Destination</span>
          </div>`;
          const dIcon = L.divIcon({ html: dHtml, className: 'custom-dest-pin', iconSize: [115, 30], iconAnchor: [57, 15] });
          const dPopup = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 180px;">
              <div style="display: inline-block; background: #0756A8; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
                PART 2 — Bus ${currentJourney.route2.routeNumber}
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #111827; line-height: 1.25;">${dStop.stop_name}</div>
              <div style="font-size: 11px; font-weight: 700; color: #dc2626; margin-top: 3px;">📍 Stop ${leg2StopsCount} of ${leg2StopsCount} (Final Alight)</div>
            </div>
          `;
          L.marker([dStop.stop_lat, dStop.stop_lon], { icon: dIcon })
            .bindTooltip(`<b>🏁 Final Destination:</b> ${dStop.stop_name}`, { direction: 'top' })
            .bindPopup(dPopup)
            .addTo(layer);
          bounds.extend([dStop.stop_lat, dStop.stop_lon]);
        }

        // Leg 1 Intermediate Stops
        const leg1Stops = currentJourney.route1?.intermediateStops || [];
        leg1Stops.forEach((st: any, idx: number) => {
          if (!st.stop_lat || !st.stop_lon) return;
          if (idx === 0 || idx === leg1Stops.length - 1) return;

          const stopHtml = `
            <div class="w-6 h-6 rounded-full bg-white text-orange-600 border-2 border-orange-500 shadow-sm flex items-center justify-center text-[10px] font-black hover:scale-125 transition-transform cursor-pointer">
              ${idx + 1}
            </div>
          `;
          const sIcon = L.divIcon({ html: stopHtml, className: 'intermediate-stop-pin-leg1', iconSize: [24, 24], iconAnchor: [12, 12] });
          const leg1Popup = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 175px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
                <span style="background: #ea580c; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">🚌 Bus ${currentJourney.route1.routeNumber}</span>
                <span style="font-size: 10px; font-weight: 700; color: #ea580c;">PART 1</span>
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #111827; line-height: 1.25;">${st.stop_name}</div>
              <div style="font-size: 11px; font-weight: 700; color: #4b5563; margin-top: 3px;">📍 Stop Sequence: <b>${idx + 1} of ${leg1Stops.length}</b></div>
              ${st.distanceKmFromStart !== undefined ? `<div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Distance: ~${st.distanceKmFromStart} km</div>` : ''}
            </div>
          `;

          L.marker([st.stop_lat, st.stop_lon], { icon: sIcon })
            .bindTooltip(`<b>Stop ${idx + 1}: ${st.stop_name}</b><br/>Bus ${currentJourney.route1.routeNumber} (Part 1)`, { direction: 'top' })
            .bindPopup(leg1Popup)
            .on('click', () => selectStopById(st.stop_id))
            .addTo(layer);
        });

        // Leg 2 Intermediate Stops
        const leg2Stops = currentJourney.route2?.intermediateStops || [];
        leg2Stops.forEach((st: any, idx: number) => {
          if (!st.stop_lat || !st.stop_lon) return;
          if (idx === 0 || idx === leg2Stops.length - 1) return;

          const stopHtml = `
            <div class="w-6 h-6 rounded-full bg-white text-[#0756A8] border-2 border-blue-600 shadow-sm flex items-center justify-center text-[10px] font-black hover:scale-125 transition-transform cursor-pointer">
              ${idx + 1}
            </div>
          `;
          const sIcon = L.divIcon({ html: stopHtml, className: 'intermediate-stop-pin-leg2', iconSize: [24, 24], iconAnchor: [12, 12] });
          const leg2Popup = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 175px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
                <span style="background: #0756A8; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">🚌 Bus ${currentJourney.route2.routeNumber}</span>
                <span style="font-size: 10px; font-weight: 700; color: #0756A8;">PART 2</span>
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #111827; line-height: 1.25;">${st.stop_name}</div>
              <div style="font-size: 11px; font-weight: 700; color: #4b5563; margin-top: 3px;">📍 Stop Sequence: <b>${idx + 1} of ${leg2Stops.length}</b></div>
              ${st.distanceKmFromStart !== undefined ? `<div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Distance: ~${st.distanceKmFromStart} km</div>` : ''}
            </div>
          `;

          L.marker([st.stop_lat, st.stop_lon], { icon: sIcon })
            .bindTooltip(`<b>Stop ${idx + 1}: ${st.stop_name}</b><br/>Bus ${currentJourney.route2.routeNumber} (Part 2)`, { direction: 'top' })
            .bindPopup(leg2Popup)
            .on('click', () => selectStopById(st.stop_id))
            .addTo(layer);
        });
      }

      if (bounds.isValid()) {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      return;
    }

    // 2. Draw Selected Route Polyline & Stops (Single Route Mode)
    if (selectedRouteStops && selectedRouteStops.length > 0) {
      const roadCoords: [number, number][] = (selectedRoute as any)?.roadGeometry ||
        selectedRouteStops.filter((s) => s.stop_lat && s.stop_lon).map((s) => [s.stop_lat, s.stop_lon]);

      if (roadCoords.length > 0) {
        const polyline = L.polyline(roadCoords, {
          color: '#EA580C', // Orange transit polyline
          weight: 5,
          opacity: 0.95,
          lineJoin: 'round',
        }).addTo(map);
        routePolylineRef.current = polyline;

        // Add stop sequence markers
        selectedRouteStops.forEach((stop, index) => {
          const isOrigin = index === 0;
          const isDest = index === selectedRouteStops.length - 1;

          let badgeClass = 'bg-white text-[#172033] border border-gray-300';
          if (isOrigin) badgeClass = 'bg-emerald-600 text-white font-bold border-2 border-white shadow-md';
          else if (isDest) badgeClass = 'bg-orange-600 text-white font-bold border-2 border-white shadow-md';

          const stopHtml = `
            <div class="relative group cursor-pointer">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${badgeClass} shadow-xs transition transform hover:scale-125">
                ${index + 1}
              </div>
            </div>
          `;

          const stopIcon = L.divIcon({
            html: stopHtml,
            className: 'stop-marker-container',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const stopMarker = L.marker([stop.stop_lat, stop.stop_lon], { icon: stopIcon });

          stopMarker.bindTooltip(
            `<div class="font-bold text-xs text-[#172033]">${index + 1}. ${stop.stop_name}</div>
             <div class="text-[10px] text-[#64748B]">Scheduled: ${stop.arrival_time?.slice(0, 5) || 'Regular'}</div>`,
            { direction: 'top', offset: [0, -10] }
          );

          stopMarker.on('click', () => {
            selectStopById(stop.stop_id);
          });

          stopMarker.addTo(layer);
        });

        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      }
      return;
    }

    // 3. Draw Live Bus Markers
    if (buses && buses.length > 0) {
      buses.forEach((bus) => {
        const isSelected = selectedBus?.id === bus.id || selectedBus?.busNumber === bus.busNumber;
        const markerColor = isSelected ? '#EA580C' : '#0756A8';
        const pulseClass = isSelected ? 'bus-selected-pulse' : '';

        const busSvg = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-md border-2 border-white transition-all transform group-hover:scale-110 ${pulseClass}" style="background-color: ${markerColor}">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 6v6" />
                <path d="M15 6v6" />
                <path d="M2 12h19.6" />
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.7 19.1 6 18 6H4C2.9 6 1.9 6.7 1.6 7.8L.2 12.8c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3" />
                <circle cx="7" cy="18" r="2" />
                <path d="M9 18h5" />
                <circle cx="16" cy="18" r="2" />
              </svg>
            </div>
            <div class="absolute -bottom-5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs whitespace-nowrap" style="background-color: ${markerColor}">
              ${bus.busNumber}
            </div>
          </div>
        `;

        const busIcon = L.divIcon({
          html: busSvg,
          className: 'bus-marker-container',
          iconSize: [36, 46],
          iconAnchor: [18, 23],
        });

        const marker = L.marker([bus.currentLat, bus.currentLng], { icon: busIcon });

        marker.bindTooltip(
          `<div class="font-bold text-xs text-[#172033]">Bus ${bus.busNumber}</div>
           <div class="text-[11px] text-[#64748B]">${bus.origin} → ${bus.destination}</div>
           <div class="text-[11px] font-bold text-[#EA580C] mt-0.5">ETA: ${bus.etaMin} min</div>`,
          { direction: 'top', offset: [0, -18] }
        );

        marker.on('click', () => {
          setSelectedBus(bus);
          if (onBusClick) onBusClick(bus);
        });

        marker.addTo(layer);
      });
    }

    // 4. Highlight single selected stop if any
    if (selectedStop && selectedStop.stop_lat && selectedStop.stop_lon && (!selectedRouteStops || selectedRouteStops.length === 0)) {
      const stopHtml = `
        <div class="w-8 h-8 rounded-full bg-[#EA580C] border-2 border-white shadow-lg flex items-center justify-center text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
        </div>
      `;

      const stopIcon = L.divIcon({
        html: stopHtml,
        className: 'stop-marker-container',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([selectedStop.stop_lat, selectedStop.stop_lon], { icon: stopIcon })
        .addTo(layer)
        .bindTooltip(`<b>${selectedStop.stop_name}</b>`, { permanent: true, direction: 'top' });

      map.setView([selectedStop.stop_lat, selectedStop.stop_lon], 15);
    }
  }, [currentJourney, selectedRoute, selectedRouteStops, selectedStop, buses, selectedBus, setSelectedBus, selectStopById, onBusClick]);

  // Controls
  const handleZoomIn = useCallback(() => mapInstanceRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapInstanceRef.current?.zoomOut(), []);
  const handleLocateMe = useCallback(() => {
    requestUserLocation();
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
    }
  }, [requestUserLocation, userLocation]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-[#E5EAF0] shadow-xs bg-[#EBF1F7]">
      {/* Real-time Status Overlay Notification (Hidden when viewing a route journey to keep map clean) */}
      {!currentJourney && (
        <div className="hidden sm:block absolute top-3 left-3 z-[1000] max-w-xs bg-white/95 backdrop-blur-xs border border-[#E5EAF0] rounded-xl shadow-sm p-2.5 text-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-gray-800 text-[11px]">
              {realtimeStatus.available ? 'Live Fleet GPS Active' : 'Delhi Transit Network Active'}
            </span>
          </div>
        </div>
      )}

      {/* Map DOM Element */}
      <div ref={mapContainerRef} className={`w-full ${heightClass}`} />

      {/* Clean Floating Circular Map Controls */}
      <div className="absolute right-3.5 top-20 z-[1000] flex flex-col gap-2">
        {/* Locate Me (Current Location) */}
        <button
          onClick={handleLocateMe}
          title="Current Location"
          aria-label="Current Location"
          className="w-9 h-9 rounded-full bg-white hover:bg-orange-50 active:bg-orange-100 text-orange-600 shadow-md border border-gray-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-orange-600 fill-orange-600/20" />
        </button>

        {/* Zoom Controls (Small circular buttons) */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 shadow-md border border-gray-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer font-bold text-base"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 shadow-md border border-gray-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer font-bold text-base"
        >
          <Minus className="w-4 h-4" />
        </button>

        {!minimalControls && (
          <>
            {/* Refresh */}
            <button
              onClick={() => refreshRealtime()}
              title="Refresh Transit Data"
              className="w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-md border border-gray-200/90 flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Offline Map Tile Cache Manager */}
            <button
              onClick={async () => {
                const stats = await getTileCacheStats();
                if (stats) setCacheStats(stats);
                setCacheModalOpen(true);
              }}
              title={cacheStats ? `Offline Tile Cache: ${cacheStats.count} tiles saved` : 'Offline Map Tile Cache'}
              className="w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-md border border-gray-200/90 flex items-center justify-center transition active:scale-95 cursor-pointer relative"
            >
              <HardDrive className="w-4 h-4" />
              {cacheStats && cacheStats.count > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Offline Tile Cache Modal */}
      {cacheModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4 border border-gray-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Offline Map Tile Cache</h3>
                  <p className="text-[11px] text-gray-500">Service Worker static map tile storage</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCacheModalOpen(false);
                  setCacheMessage(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Storage indicator */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-gray-800">
                <span>Cached Map Tiles:</span>
                <span className="text-orange-600 font-bold tabular-nums">
                  {cacheStats ? `${cacheStats.count} / ${cacheStats.maxEntries} tiles` : 'Loading...'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">
                Tiles from OpenStreetMap & CARTO are automatically cached in your browser so you can continue viewing Delhi transit maps even with an unstable or lost internet connection.
              </p>
            </div>

            {cacheMessage && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-medium">
                {cacheMessage}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                disabled={isPreloading}
                onClick={async () => {
                  setIsPreloading(true);
                  setCacheMessage('Downloading baseline Delhi NCR map tiles...');
                  try {
                    const result = await preloadDelhiTiles();
                    const stats = await getTileCacheStats();
                    if (stats) setCacheStats(stats);
                    setCacheMessage(
                      result
                        ? `Pre-downloaded ${result.added} Delhi NCR tiles successfully! (Total cached: ${result.total})`
                        : 'Pre-download completed.'
                    );
                  } catch (e) {
                    setCacheMessage('Pre-download completed.');
                  } finally {
                    setIsPreloading(false);
                  }
                }}
                className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>{isPreloading ? 'Pre-downloading Delhi NCR...' : 'Pre-download Delhi NCR Tiles'}</span>
              </button>

              <button
                onClick={async () => {
                  await clearTileCache();
                  const stats = await getTileCacheStats();
                  setCacheStats(stats || { count: 0, maxEntries: 2500, cacheName: 'delhi-yatra-map-tiles-v1' });
                  setCacheMessage('Tile cache cleared.');
                }}
                className="w-full py-2 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[36px]"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                <span>Clear Tile Cache</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
