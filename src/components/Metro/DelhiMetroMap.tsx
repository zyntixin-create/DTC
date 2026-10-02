import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MetroRoutePlan,
  MetroStation,
  DELHI_METRO_LINES,
  DELHI_METRO_STATIONS,
  METRO_STATION_MAP,
  LINE_SEQUENCES
} from '../../data/delhiMetroData';
import { Navigation, Plus, Minus, RotateCw, Layers } from 'lucide-react';

interface DelhiMetroMapProps {
  selectedRoute?: MetroRoutePlan | null;
  onStationSelect?: (station: MetroStation, asTarget: 'from' | 'to') => void;
  onStationClick?: (station: MetroStation) => void;
  heightClass?: string;
}

export const DelhiMetroMap: React.FC<DelhiMetroMapProps> = ({
  selectedRoute,
  onStationSelect,
  onStationClick,
  heightClass = 'h-full w-full'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseLinesLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [currentZoom, setCurrentZoom] = useState<number>(11);
  const [showAllLines, setShowAllLines] = useState<boolean>(true);
  const [locatingUser, setLocatingUser] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around Connaught Place / Central Delhi
    const map = L.map(mapContainerRef.current, {
      center: [28.625, 77.215],
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Clean, high-performance transit basemap
    L.tileLayer('https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Layer groups for clean management
    baseLinesLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    stationsLayerRef.current = L.layerGroup().addTo(map);

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Network Lines & Stations
  useEffect(() => {
    const map = mapInstanceRef.current;
    const baseLinesGroup = baseLinesLayerRef.current;
    const stationsGroup = stationsLayerRef.current;
    if (!map || !baseLinesGroup || !stationsGroup) return;

    baseLinesGroup.clearLayers();
    stationsGroup.clearLayers();

    const isRouteActive = !!selectedRoute && selectedRoute.legs.length > 0;
    const routeStationIds = new Set(selectedRoute?.allStations?.map((s) => s.id) || []);

    // 1. Draw all metro lines
    if (showAllLines) {
      for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {
        const lineId = seqKey.split('_')[0];
        const lineMeta = DELHI_METRO_LINES.find((l) => l.id === lineId);
        const lineColor = lineMeta ? lineMeta.color : '#334155';

        const latLngs: [number, number][] = seq
          .map((id) => METRO_STATION_MAP[id])
          .filter(Boolean)
          .map((s) => [s.lat, s.lng]);

        if (latLngs.length > 1) {
          // Dim line if a specific route is active
          const opacity = isRouteActive ? 0.22 : 0.8;
          const weight = isRouteActive ? 2.5 : 4.5;

          const polyline = L.polyline(latLngs, {
            color: lineColor,
            weight,
            opacity,
            lineCap: 'round',
            lineJoin: 'round'
          });

          baseLinesGroup.addLayer(polyline);
        }
      }
    }

    // 2. Draw all station nodes
    const zoom = map.getZoom();
    const showAllDots = zoom >= 12;

    DELHI_METRO_STATIONS.forEach((station) => {
      const isPartOfRoute = routeStationIds.has(station.id);
      if (isRouteActive && !isPartOfRoute && !station.isInterchange && zoom < 13) {
        return; // Reduce visual clutter when route is active
      }

      // Interchange marker vs regular station dot
      let marker: L.CircleMarker;
      const primaryLineId = station.lineIds[0];
      const lineMeta = DELHI_METRO_LINES.find((l) => l.id === primaryLineId);
      const strokeColor = lineMeta ? lineMeta.color : '#2563EB';

      if (station.isInterchange) {
        // Distinctive interchange dual ring
        marker = L.circleMarker([station.lat, station.lng], {
          radius: isPartOfRoute ? 7 : 6,
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          color: isPartOfRoute ? '#EA580C' : '#0F172A',
          weight: isPartOfRoute ? 3 : 2.5
        });
      } else {
        if (!showAllDots && !isPartOfRoute) return;
        marker = L.circleMarker([station.lat, station.lng], {
          radius: isPartOfRoute ? 5 : 4,
          fillColor: '#FFFFFF',
          fillOpacity: 0.9,
          color: strokeColor,
          weight: 2
        });
      }

      // Rich interactive station popup
      const linesBadges = station.lines
        .map((l) => `<span style="display:inline-block;padding:2px 6px;margin:2px 2px 0 0;font-size:10px;font-weight:700;border-radius:4px;background:#F1F5F9;color:#334155;">${l}</span>`)
        .join('');

      const popupHtml = `
        <div style="font-family:system-ui,-apple-system,sans-serif;min-width:180px;padding:2px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span style="font-size:16px;">🚇</span>
            <div>
              <div style="font-size:13px;font-weight:800;color:#0F172A;line-height:1.2;">${station.name}</div>
              <div style="font-size:11px;color:#64748B;line-height:1.2;">${station.nameHindi}</div>
            </div>
          </div>
          <div style="margin:6px 0;">${linesBadges}</div>
          ${station.isInterchange ? '<div style="font-size:11px;font-weight:700;color:#EA580C;margin-bottom:6px;">🔄 Major Interchange Station</div>' : ''}
          <div style="display:flex;gap:6px;margin-top:8px;">
            <button id="btn-from-${station.id}" style="flex:1;padding:5px 8px;font-size:11px;font-weight:700;background:#059669;color:#FFFFFF;border:none;border-radius:6px;cursor:pointer;">
              📍 From
            </button>
            <button id="btn-to-${station.id}" style="flex:1;padding:5px 8px;font-size:11px;font-weight:700;background:#DC2626;color:#FFFFFF;border:none;border-radius:6px;cursor:pointer;">
              🏁 To
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'metro-station-popup'
      });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btnFrom = document.getElementById(`btn-from-${station.id}`);
          const btnTo = document.getElementById(`btn-to-${station.id}`);
          if (btnFrom) {
            btnFrom.onclick = (e) => {
              e.stopPropagation();
              onStationSelect?.(station, 'from');
              map.closePopup();
            };
          }
          if (btnTo) {
            btnTo.onclick = (e) => {
              e.stopPropagation();
              onStationSelect?.(station, 'to');
              map.closePopup();
            };
          }
        }, 50);
      });

      marker.on('click', () => {
        onStationClick?.(station);
      });

      stationsGroup.addLayer(marker);
    });
  }, [showAllLines, selectedRoute, onStationSelect, onStationClick]);

  // Render Selected Route & Auto-fit bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeGroup = routeLayerRef.current;
    if (!map || !routeGroup) return;

    routeGroup.clearLayers();

    if (!selectedRoute || !selectedRoute.legs || selectedRoute.legs.length === 0) {
      return;
    }

    const allRouteCoords: [number, number][] = [];

    // Draw active route legs with vibrant line colors and casing
    selectedRoute.legs.forEach((leg, legIdx) => {
      const lineMeta = DELHI_METRO_LINES.find((l) => l.id === leg.lineId);
      const legColor = lineMeta ? lineMeta.color : '#EA580C';

      const legCoords: [number, number][] = leg.stations.map((s) => [s.lat, s.lng]);
      allRouteCoords.push(...legCoords);

      // Outer casing for contrast
      const outerCasing = L.polyline(legCoords, {
        color: '#FFFFFF',
        weight: 9,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Core colored metro line
      const innerLine = L.polyline(legCoords, {
        color: legColor,
        weight: 6,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round'
      });

      routeGroup.addLayer(outerCasing);
      routeGroup.addLayer(innerLine);

      // Add sequence numbers / stop dots along the leg
      leg.stations.forEach((st, idx) => {
        const isLegStart = idx === 0;
        const isLegEnd = idx === leg.stations.length - 1;
        const isGlobalOrigin = legIdx === 0 && isLegStart;
        const isGlobalDest = legIdx === selectedRoute.legs.length - 1 && isLegEnd;

        // Skip origin and dest dots here as they get special custom markers below
        if (isGlobalOrigin || isGlobalDest) return;

        // Interchange transfer station
        if (leg.changeover && isLegEnd) {
          const changeIcon = L.divIcon({
            className: 'custom-metro-change-icon',
            html: `
              <div style="background:#7C3AED;color:#FFFFFF;border:2px solid #FFFFFF;border-radius:999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);font-size:13px;font-weight:900;">
                🔄
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const changeMarker = L.marker([st.lat, st.lng], {
            icon: changeIcon,
            zIndexOffset: 1000
          });

          changeMarker.bindPopup(`
            <div style="font-family:system-ui;padding:2px;">
              <div style="font-size:11px;font-weight:800;color:#7C3AED;">🔄 INTERCHANGE STATION</div>
              <div style="font-size:13px;font-weight:800;color:#0F172A;margin-top:2px;">${st.name}</div>
              <div style="font-size:11px;color:#475569;margin-top:4px;background:#F8FAFC;padding:4px 6px;border-radius:4px;border:1px solid #E2E8F0;">
                ${leg.changeover.platformNotice}
              </div>
            </div>
          `);

          routeGroup.addLayer(changeMarker);
          return;
        }

        // Intermediate stop dot
        const intermediateDot = L.circleMarker([st.lat, st.lng], {
          radius: 4.5,
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          color: legColor,
          weight: 2.5
        });

        intermediateDot.bindPopup(`
          <div style="font-family:system-ui;padding:2px;">
            <div style="font-size:11px;font-weight:700;color:${legColor};">${leg.lineName}</div>
            <div style="font-size:13px;font-weight:800;color:#0F172A;">${st.name}</div>
            <div style="font-size:11px;color:#64748B;">${st.nameHindi}</div>
          </div>
        `);

        routeGroup.addLayer(intermediateDot);
      });
    });

    // Add prominent Origin (Green) and Destination (Red) markers
    if (selectedRoute.fromStation) {
      const fromSt = selectedRoute.fromStation;
      const fromIcon = L.divIcon({
        className: 'custom-metro-from-icon',
        html: `
          <div style="background:#059669;color:#FFFFFF;border:2.5px solid #FFFFFF;border-radius:999px;padding:3px 8px;display:flex;align-items:center;gap:4px;box-shadow:0 3px 10px rgba(0,0,0,0.35);font-size:11px;font-weight:800;white-space:nowrap;">
            <span>📍</span> From: ${fromSt.name.split(' ')[0]}
          </div>
        `,
        iconSize: [80, 26],
        iconAnchor: [40, 13]
      });

      const fromMarker = L.marker([fromSt.lat, fromSt.lng], {
        icon: fromIcon,
        zIndexOffset: 1200
      });
      routeGroup.addLayer(fromMarker);
    }

    if (selectedRoute.toStation) {
      const toSt = selectedRoute.toStation;
      const toIcon = L.divIcon({
        className: 'custom-metro-to-icon',
        html: `
          <div style="background:#DC2626;color:#FFFFFF;border:2.5px solid #FFFFFF;border-radius:999px;padding:3px 8px;display:flex;align-items:center;gap:4px;box-shadow:0 3px 10px rgba(0,0,0,0.35);font-size:11px;font-weight:800;white-space:nowrap;">
            <span>🏁</span> To: ${toSt.name.split(' ')[0]}
          </div>
        `,
        iconSize: [80, 26],
        iconAnchor: [40, 13]
      });

      const toMarker = L.marker([toSt.lat, toSt.lng], {
        icon: toIcon,
        zIndexOffset: 1200
      });
      routeGroup.addLayer(toMarker);
    }

    // Smoothly zoom & frame the route on mobile with bottom padding for sheet
    if (allRouteCoords.length > 0) {
      const bounds = L.latLngBounds(allRouteCoords);
      map.fitBounds(bounds, {
        paddingTopLeft: [40, 40],
        paddingBottomRight: [40, 240], // extra bottom padding so sheet doesn't obstruct route
        maxZoom: 14
      });
    }
  }, [selectedRoute]);

  // Recenter map
  const handleRecenter = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([28.625, 77.215], 11, { duration: 0.8 });
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut();
  }, []);

  // Locate User
  const handleLocateUser = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !navigator.geolocation) return;

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        const { latitude, longitude } = pos.coords;

        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          const userIcon = L.divIcon({
            className: 'custom-user-dot',
            html: `
              <div style="position:relative;width:20px;height:20px;">
                <div style="position:absolute;inset:0;background:#2563EB;border-radius:999px;opacity:0.3;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                <div style="position:absolute;inset:3px;background:#2563EB;border:2px solid #FFFFFF;border-radius:999px;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          userLocationMarkerRef.current = L.marker([latitude, longitude], {
            icon: userIcon,
            zIndexOffset: 2000
          }).addTo(map);
        }

        map.flyTo([latitude, longitude], 13, { duration: 0.8 });
      },
      (err) => {
        setLocatingUser(false);
        console.warn('Location error:', err);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className={`relative ${heightClass} overflow-hidden bg-slate-100 select-none`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls (Small Clean Circular Buttons) */}
      <div className="absolute right-3 top-20 z-20 flex flex-col items-center gap-2">
        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md text-gray-700 hover:text-gray-900 active:scale-95 flex items-center justify-center transition cursor-pointer"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md text-gray-700 hover:text-gray-900 active:scale-95 flex items-center justify-center transition cursor-pointer"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Recenter Delhi */}
        <button
          type="button"
          onClick={handleRecenter}
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md text-gray-700 hover:text-gray-900 active:scale-95 flex items-center justify-center transition cursor-pointer"
          title="Recenter Delhi Metro Map"
          aria-label="Recenter map"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Toggle Network Lines */}
        <button
          type="button"
          onClick={() => setShowAllLines((prev) => !prev)}
          className={`w-9 h-9 rounded-full backdrop-blur-md border shadow-md flex items-center justify-center transition cursor-pointer active:scale-95 ${
            showAllLines
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white/95 text-gray-700 border-gray-200'
          }`}
          title={showAllLines ? 'Hide Background Lines' : 'Show All Metro Lines'}
          aria-label="Toggle network lines"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Locate Me */}
        <button
          type="button"
          onClick={handleLocateUser}
          disabled={locatingUser}
          className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200/80 shadow-md text-blue-600 flex items-center justify-center transition cursor-pointer active:scale-95"
          title="My Location"
          aria-label="My Location"
        >
          <Navigation className={`w-4 h-4 ${locatingUser ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Metro Lines Legend Floating Badge */}
      <div className="absolute left-3 top-20 z-10 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md py-1 px-2.5 rounded-full border border-gray-200 shadow-xs text-[11px] font-bold text-gray-700 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
        <span className="text-[10px] text-gray-500 ml-1">DMRC Network</span>
      </div>
    </div>
  );
};
