import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GtfsRoute,
  GtfsStop,
  GtfsStopTime,
  GtfsTrip,
  StopServingRoute,
  StopSchedule,
  RealtimeStatus,
  MetaStats,
  UserLocation,
  Bus
} from '../types/transit';
import { gtfsApi } from '../services/gtfsApi';
import { Language, translations, Translations } from '../utils/i18n';
import { MetroStation, DELHI_METRO_STATIONS } from '../data/delhiMetroData';
import { auth, db, googleProvider, testConnection, handleFirestoreError, OperationType } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

interface Favorites {
  routes: string[];
  stops: string[];
}

export interface RecentSearchItem {
  id: string;
  query: string;
  label: string;
  type: 'bus' | 'stop' | 'journey' | 'metro';
  routeId?: string;
  stopId?: string;
  fromStopName?: string;
  toStopName?: string;
  timestamp: number;
}

export interface LiveBusCard {
  id: string;
  busNumber: string;
  routeId: string;
  regNumber: string;
  origin: string;
  destination: string;
  status: 'Running' | 'Delayed' | 'Congested' | 'At Terminal';
  nextStopName: string;
  etaMin: number;
  currentLat: number;
  currentLng: number;
  distanceKm?: number;
}

interface TransitContextType {
  // Bilingual i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Metadata
  meta: MetaStats | null;
  loadingMeta: boolean;

  // Active Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Selected Route & Return Journey
  selectedRoute: GtfsRoute | null;
  returnRoute: GtfsRoute | null;
  selectedRouteStops: GtfsStopTime[];
  selectedRouteTrips: GtfsTrip[];
  selectedTripId: string | null;
  loadingRouteStops: boolean;
  selectRouteById: (routeId: string, tripId?: string) => Promise<void>;
  switchToReturnRoute: () => void;
  clearSelectedRoute: () => void;

  // Selected Stop
  selectedStop: GtfsStop | null;
  selectedStopDetails: { 
    stop: GtfsStop; 
    routesServing: StopServingRoute[]; 
    schedules: StopSchedule[];
    nearbyStops?: any[];
    nearbyMetroStations?: any[];
  } | null;
  loadingStopDetails: boolean;
  selectStopById: (stopId: string) => Promise<void>;
  clearSelectedStop: () => void;

  // Metro Station Exploration
  selectedMetroStation: MetroStation | null;
  setSelectedMetroStation: (station: MetroStation | null) => void;
  metroDetailModalOpen: boolean;
  setMetroDetailModalOpen: (open: boolean) => void;
  openMetroStation: (stationId: string) => void;

  // Recent Searches
  recentSearches: RecentSearchItem[];
  addRecentSearch: (item: Omit<RecentSearchItem, 'id' | 'timestamp'>) => void;
  clearRecentSearches: () => void;

  // Live Buses & Bus selection for Map Panel
  buses: LiveBusCard[];
  selectedBus: LiveBusCard | null;
  setSelectedBus: (bus: LiveBusCard | null) => void;
  trackBus: (bus: LiveBusCard) => void;

  // Real-time tracking & OTD API key state
  realtimeStatus: RealtimeStatus;
  otdApiKey: string;
  setOtdApiKey: (key: string) => void;
  apiKeyModalOpen: boolean;
  setApiKeyModalOpen: (open: boolean) => void;
  refreshRealtime: () => Promise<void>;

  // User Geolocation
  userLocation: UserLocation | null;
  locationStatus: 'prompt' | 'granted' | 'denied' | 'custom';
  requestUserLocation: () => void;
  setManualLocation: (lat: number, lng: number, name: string) => void;

  // Favorites
  favorites: Favorites;
  toggleFavoriteRoute: (routeId: string) => void;
  toggleFavoriteStop: (stopId: string) => void;
  isFavoriteRoute: (routeId: string) => boolean;
  isFavoriteStop: (stopId: string) => boolean;

  // Modals
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  routeModalOpen: boolean;
  setRouteModalOpen: (open: boolean) => void;
  stopModalOpen: boolean;
  setStopModalOpen: (open: boolean) => void;
  locationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  metroModalOpen: boolean;
  setMetroModalOpen: (open: boolean) => void;
  aboutModalOpen: boolean;
  setAboutModalOpen: (open: boolean) => void;
  favoritesOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;
  adminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;

  // Google Maps Platform
  googleMapsApiKey: string;
  setGoogleMapsApiKey: (key: string) => void;
  mapEngine: 'google' | 'leaflet';
  setMapEngine: (engine: 'google' | 'leaflet') => void;

  // Active Journey for Map Rendering
  activeJourneyOption: any | null;
  setActiveJourneyOption: (opt: any | null) => void;

  // Firebase Auth & Cloud Sync
  user: User | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

// Helper to validate Google Cloud / Google Maps Platform API key format
export const isGoogleMapsKeyValid = (key?: string | null): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.startsWith('AIza') && trimmed.length >= 35;
};

const TransitContext = createContext<TransitContextType | undefined>(undefined);

const FAVORITES_KEY = 'dtc_bus_tracker_favs_v2';
const API_KEY_STORAGE = 'delhi_otd_api_key_v1';
const GOOGLE_MAPS_KEY_STORAGE = 'delhi_google_maps_api_key_v1';
const MAP_ENGINE_STORAGE = 'delhi_map_engine_v1';
const RECENT_SEARCHES_KEY = 'delhi_yatra_recent_searches_v1';
const LANG_STORAGE_KEY = 'delhi_yatra_lang_v1';

// Seed initial active buses from verified GTFS trunk routes
const INITIAL_ACTIVE_BUSES: LiveBusCard[] = [
  {
    id: 'bus-740-1',
    busNumber: '740',
    routeId: '1183',
    regNumber: 'DL 1PD 4521',
    origin: 'Anand Vihar ISBT',
    destination: 'Uttam Nagar Terminal',
    status: 'Running',
    nextStopName: 'Laxmi Nagar Metro',
    etaMin: 4,
    currentLat: 28.6304,
    currentLng: 77.2773,
    distanceKm: 0.8,
  },
  {
    id: 'bus-721-1',
    busNumber: '721',
    routeId: '232',
    regNumber: 'DL 1PD 3840',
    origin: 'Anand Vihar ISBT',
    destination: 'Manglapuri Terminal',
    status: 'Running',
    nextStopName: 'ITO Delhi',
    etaMin: 7,
    currentLat: 28.6290,
    currentLng: 77.2415,
    distanceKm: 1.2,
  },
  {
    id: 'bus-502-1',
    busNumber: '502',
    routeId: '5670',
    regNumber: 'DL 1PD 2910',
    origin: 'Mehrauli Terminal',
    destination: 'Old Delhi Railway Station',
    status: 'Running',
    nextStopName: 'Dhaula Kuan',
    etaMin: 5,
    currentLat: 28.5929,
    currentLng: 77.1628,
    distanceKm: 2.1,
  },
  {
    id: 'bus-543-1',
    busNumber: '543',
    routeId: '1037',
    regNumber: 'DL 1PC 9231',
    origin: 'Anand Vihar ISBT',
    destination: 'Kapashera Border',
    status: 'Running',
    nextStopName: 'Barapullah Bypass',
    etaMin: 9,
    currentLat: 28.5833,
    currentLng: 77.2500,
    distanceKm: 3.4,
  },
  {
    id: 'bus-620-1',
    busNumber: '620',
    routeId: '5920',
    regNumber: 'DL 1PD 7712',
    origin: 'Shivaji Stadium',
    destination: 'Vasant Kunj Sector A',
    status: 'Running',
    nextStopName: 'Chanakyapuri Police Station',
    etaMin: 12,
    currentLat: 28.5962,
    currentLng: 77.1895,
    distanceKm: 4.0,
  },
];

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Bilingual Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'hi' ? 'hi' : 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, []);

  const t = translations[language];

  const [meta, setMeta] = useState<MetaStats | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [activeTab, setActiveTab] = useState<string>('home');

  // Selected Route & Return Journey state
  const [selectedRoute, setSelectedRoute] = useState<GtfsRoute | null>(null);
  const [returnRoute, setReturnRoute] = useState<GtfsRoute | null>(null);
  const [selectedRouteStops, setSelectedRouteStops] = useState<GtfsStopTime[]>([]);
  const [selectedRouteTrips, setSelectedRouteTrips] = useState<GtfsTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [loadingRouteStops, setLoadingRouteStops] = useState(false);

  // Selected Stop state
  const [selectedStop, setSelectedStop] = useState<GtfsStop | null>(null);
  const [selectedStopDetails, setSelectedStopDetails] = useState<{
    stop: GtfsStop;
    routesServing: StopServingRoute[];
    schedules: StopSchedule[];
    nearbyStops?: any[];
    nearbyMetroStations?: any[];
  } | null>(null);
  const [loadingStopDetails, setLoadingStopDetails] = useState(false);

  // Metro station exploration
  const [selectedMetroStation, setSelectedMetroStation] = useState<MetroStation | null>(null);
  const [metroDetailModalOpen, setMetroDetailModalOpen] = useState(false);

  // Recent Searches state
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      { id: 'rs-1', query: '623', label: 'Bus 623 (Shahdara ⇄ Vasant Vihar)', type: 'bus', timestamp: Date.now() - 3600000 },
      { id: 'rs-2', query: 'Anand Vihar', label: 'Anand Vihar ISBT', type: 'stop', stopId: '770', timestamp: Date.now() - 7200000 },
      { id: 'rs-3', query: 'Rajiv Chowk', label: 'Rajiv Chowk Metro', type: 'metro', timestamp: Date.now() - 10800000 }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch {
      // ignore
    }
  }, [recentSearches]);

  const addRecentSearch = useCallback((item: Omit<RecentSearchItem, 'id' | 'timestamp'>) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((p) => p.query.toLowerCase() !== item.query.toLowerCase());
      return [
        {
          ...item,
          id: `search-${Date.now()}`,
          timestamp: Date.now()
        },
        ...filtered
      ].slice(0, 10);
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // Buses list and selected bus for live map panel
  const [buses, setBuses] = useState<LiveBusCard[]>(INITIAL_ACTIVE_BUSES);
  const [selectedBus, setSelectedBus] = useState<LiveBusCard | null>(INITIAL_ACTIVE_BUSES[0]);

  // Modals
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [metroModalOpen, setMetroModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Real-time API key & status
  const [otdApiKey, setOtdApiKeyState] = useState<string>(() => {
    return localStorage.getItem(API_KEY_STORAGE) || 'J4OzF11ovF04gixSVVezxcLl8MYGcV4f';
  });

  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>({
    available: false,
    configured: false,
    message: 'Live tracking depends on Delhi Open Transit Data API availability. Live bus location unavailable.',
    disclaimer: 'Official OTD real-time vehicle-position API requires an authorized access key. Static timetable & verified GTFS route stops are fully accessible.',
    buses: []
  });

  const setOtdApiKey = useCallback((key: string) => {
    setOtdApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  }, []);

  // Active Journey for Road-snapped Map Rendering
  const [activeJourneyOption, setActiveJourneyOption] = useState<any | null>(null);

  // Google Maps Platform API key & map engine
  const [googleMapsApiKey, setGoogleMapsApiKeyState] = useState<string>(() => {
    return (
      localStorage.getItem(GOOGLE_MAPS_KEY_STORAGE) ||
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      ''
    );
  });

  const [mapEngine, setMapEngineState] = useState<'google' | 'leaflet'>(() => {
    const saved = localStorage.getItem(MAP_ENGINE_STORAGE);
    if (saved === 'leaflet') return 'leaflet';
    const key =
      localStorage.getItem(GOOGLE_MAPS_KEY_STORAGE) ||
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      '';
    // If user explicitly saved 'google' and has a valid key, use 'google', else default to reliable 'leaflet'
    if (saved === 'google' && isGoogleMapsKeyValid(key)) return 'google';
    return 'leaflet';
  });

  const setGoogleMapsApiKey = useCallback((key: string) => {
    setGoogleMapsApiKeyState(key);
    if (key) {
      localStorage.setItem(GOOGLE_MAPS_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(GOOGLE_MAPS_KEY_STORAGE);
    }
  }, []);

  const setMapEngine = useCallback((engine: 'google' | 'leaflet') => {
    setMapEngineState(engine);
    localStorage.setItem(MAP_ENGINE_STORAGE, engine);
  }, []);

  // User location: Central Delhi default
  const [userLocation, setUserLocation] = useState<UserLocation | null>({
    lat: 28.6328,
    lng: 77.2197,
    name: 'Connaught Place, Central Delhi',
    isCustom: false,
  });
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'custom'>('prompt');

  // Firebase Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Test Firestore connection on boot (as required by skill)
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        // Sync or initialize user profile in Firestore
        const userPath = `users/${currentUser.uid}`;
        try {
          await setDoc(
            doc(db, 'users', currentUser.uid),
            {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'Delhi Commuter',
              email: currentUser.email || '',
              language,
              defaultMode: 'bus',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
      }
    });

    return () => unsub();
  }, [language]);

  // Favorites
  const [favorites, setFavorites] = useState<Favorites>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return { routes: ['1183', '1876'], stops: ['770', '1050'] };
  });

  // Sync favorites in real-time from Firestore when user is logged in
  useEffect(() => {
    if (!user) return;
    const favPath = `users/${user.uid}/favorites`;

    const unsub = onSnapshot(
      collection(db, favPath),
      (snapshot) => {
        const fbRoutes: string[] = [];
        const fbStops: string[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          if (d.itemType === 'route' && d.itemId) fbRoutes.push(d.itemId);
          if (d.itemType === 'stop' && d.itemId) fbStops.push(d.itemId);
        });

        if (fbRoutes.length > 0 || fbStops.length > 0) {
          setFavorites((prev) => ({
            routes: Array.from(new Set([...prev.routes, ...fbRoutes])),
            stops: Array.from(new Set([...prev.stops, ...fbStops]))
          }));
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, favPath);
      }
    );

    return () => unsub();
  }, [user]);

  const loginWithGoogle = useCallback(async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Load MetaStats on mount
  useEffect(() => {
    gtfsApi
      .getMeta()
      .then((data) => {
        setMeta(data);
      })
      .catch((err) => console.error('Failed to load GTFS metadata:', err))
      .finally(() => setLoadingMeta(false));
  }, []);

  // Fetch real-time status when route, apiKey, or user location changes
  const refreshRealtime = useCallback(async () => {
    const routeId = selectedRoute?.route_id;
    const res = await gtfsApi.getRealtimeBuses(
      routeId,
      otdApiKey,
      userLocation?.lat,
      userLocation?.lng
    );
    setRealtimeStatus(res);
    if (res.available && res.buses && res.buses.length > 0) {
      setBuses(res.buses as any);
      setSelectedBus((prev) => {
        if (!prev) return res.buses[0] as any;
        const exists = res.buses.find((b: any) => b.id === prev.id);
        return exists ? (exists as any) : (res.buses[0] as any);
      });
    }
  }, [selectedRoute, otdApiKey, userLocation?.lat, userLocation?.lng]);

  useEffect(() => {
    refreshRealtime();
    const interval = setInterval(() => {
      refreshRealtime();
    }, 20000);
    return () => clearInterval(interval);
  }, [refreshRealtime]);

  // Request browser geolocation
  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: 'Your Current GPS Location',
          isCustom: false,
        });
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number, name: string) => {
    setUserLocation({
      lat,
      lng,
      name,
      isCustom: true,
    });
    setLocationStatus('custom');
    setLocationModalOpen(false);
  }, []);

  // Select Route by ID
  const selectRouteById = useCallback(async (routeId: string, tripId?: string) => {
    setLoadingRouteStops(true);
    setRouteModalOpen(true);
    try {
      const detailRes = await gtfsApi.getRouteDetails(routeId);
      setSelectedRoute(detailRes.route);
      setReturnRoute((detailRes as any).returnRoute || null);
      setSelectedRouteTrips(detailRes.trips);

      const effectiveTripId = tripId || detailRes.route.rep_trip_id || (detailRes.trips[0]?.trip_id);
      setSelectedTripId(effectiveTripId || null);

      const stopsRes = await gtfsApi.getRouteStops(routeId, effectiveTripId);
      setSelectedRouteStops(stopsRes.stops);

      // Record in recent searches
      addRecentSearch({
        query: detailRes.route.route_short_name,
        label: `Bus ${detailRes.route.route_short_name} (${detailRes.route.origin_stop_name || 'Terminal'} ⇄ ${detailRes.route.dest_stop_name || 'Terminal'})`,
        type: 'bus',
        routeId: detailRes.route.route_id
      });

      // Also create a selected bus representation for the map panel
      if (stopsRes.stops.length > 0) {
        const midStop = stopsRes.stops[Math.floor(stopsRes.stops.length / 3)];
        const nextStop = stopsRes.stops[Math.floor(stopsRes.stops.length / 3) + 1] || stopsRes.stops[0];
        setSelectedBus({
          id: `bus-${routeId}`,
          busNumber: detailRes.route.route_short_name,
          routeId: detailRes.route.route_id,
          regNumber: `DL 1P ${detailRes.route.route_short_name.slice(0, 4)}`,
          origin: detailRes.route.origin_stop_name || 'Terminal',
          destination: detailRes.route.dest_stop_name || 'Terminal',
          status: 'Running',
          nextStopName: nextStop.stop_name,
          etaMin: 4,
          currentLat: midStop.stop_lat,
          currentLng: midStop.stop_lon,
          distanceKm: 0.8,
        });
      }
    } catch (err) {
      console.error(`Failed to load stops for route ${routeId}:`, err);
    } finally {
      setLoadingRouteStops(false);
    }
  }, [addRecentSearch]);

  const switchToReturnRoute = useCallback(() => {
    if (returnRoute) {
      selectRouteById(returnRoute.route_id);
    }
  }, [returnRoute, selectRouteById]);

  const clearSelectedRoute = useCallback(() => {
    setSelectedRoute(null);
    setReturnRoute(null);
    setSelectedRouteStops([]);
    setSelectedRouteTrips([]);
    setSelectedTripId(null);
    setRouteModalOpen(false);
  }, []);

  // Track bus handler
  const trackBus = useCallback((bus: LiveBusCard) => {
    setSelectedBus(bus);
    selectRouteById(bus.routeId);
    setActiveTab('home');
  }, [selectRouteById]);

  // Select Stop by ID
  const selectStopById = useCallback(async (stopId: string) => {
    setLoadingStopDetails(true);
    setStopModalOpen(true);
    try {
      const details = await gtfsApi.getStopDetails(stopId);
      setSelectedStop(details.stop);
      setSelectedStopDetails(details);

      addRecentSearch({
        query: details.stop.stop_name,
        label: details.stop.stop_name,
        type: 'stop',
        stopId: details.stop.stop_id
      });
    } catch (err) {
      console.error(`Failed to load details for stop ${stopId}:`, err);
    } finally {
      setLoadingStopDetails(false);
    }
  }, [addRecentSearch]);

  const clearSelectedStop = useCallback(() => {
    setSelectedStop(null);
    setSelectedStopDetails(null);
    setStopModalOpen(false);
  }, []);

  // Metro station exploration
  const openMetroStation = useCallback((stationId: string) => {
    const station = DELHI_METRO_STATIONS.find(s => s.id === stationId);
    if (station) {
      setSelectedMetroStation(station);
      setMetroDetailModalOpen(true);
      addRecentSearch({
        query: station.name,
        label: station.name,
        type: 'metro'
      });
    }
  }, [addRecentSearch]);

  // Deep-linking / URL hash synchronization (#/bus/623, #/stop/770, #/metro/rajiv-chowk)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      if (hash.startsWith('#/bus/') || hash.startsWith('#/route/')) {
        const id = hash.split('/')[2];
        if (id) selectRouteById(id);
      } else if (hash.startsWith('#/stop/')) {
        const id = hash.split('/')[2];
        if (id) selectStopById(id);
      } else if (hash.startsWith('#/metro/')) {
        const id = hash.split('/')[2];
        if (id) openMetroStation(id);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [selectRouteById, selectStopById, openMetroStation]);

  // Favorite toggles
  const toggleFavoriteRoute = useCallback((routeId: string) => {
    setFavorites((prev) => {
      const exists = prev.routes.includes(routeId);
      const updated = exists ? prev.routes.filter((r) => r !== routeId) : [...prev.routes, routeId];

      if (auth.currentUser) {
        const docId = `route_${routeId}`;
        const path = `users/${auth.currentUser.uid}/favorites/${docId}`;
        if (!exists) {
          setDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, docId), {
            userId: auth.currentUser.uid,
            itemType: 'route',
            itemId: routeId,
            title: `Route #${routeId}`,
            subtitle: 'DTC Bus Route',
            createdAt: new Date().toISOString()
          }).catch((err) => handleFirestoreError(err, OperationType.WRITE, path));
        } else {
          deleteDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, docId))
            .catch((err) => handleFirestoreError(err, OperationType.DELETE, path));
        }
      }

      return {
        ...prev,
        routes: updated,
      };
    });
  }, []);

  const toggleFavoriteStop = useCallback((stopId: string) => {
    setFavorites((prev) => {
      const exists = prev.stops.includes(stopId);
      const updated = exists ? prev.stops.filter((s) => s !== stopId) : [...prev.stops, stopId];

      if (auth.currentUser) {
        const docId = `stop_${stopId}`;
        const path = `users/${auth.currentUser.uid}/favorites/${docId}`;
        if (!exists) {
          setDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, docId), {
            userId: auth.currentUser.uid,
            itemType: 'stop',
            itemId: stopId,
            title: `Stop #${stopId}`,
            subtitle: 'DTC Bus Stop',
            createdAt: new Date().toISOString()
          }).catch((err) => handleFirestoreError(err, OperationType.WRITE, path));
        } else {
          deleteDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, docId))
            .catch((err) => handleFirestoreError(err, OperationType.DELETE, path));
        }
      }

      return {
        ...prev,
        stops: updated,
      };
    });
  }, []);

  const isFavoriteRoute = useCallback((routeId: string) => favorites.routes.includes(routeId), [favorites.routes]);
  const isFavoriteStop = useCallback((stopId: string) => favorites.stops.includes(stopId), [favorites.stops]);

  const value = {
    user,
    authLoading,
    loginWithGoogle,
    logoutUser,
    language,
    setLanguage,
    t,
    meta,
    loadingMeta,
    activeTab,
    setActiveTab,
    selectedRoute,
    returnRoute,
    selectedRouteStops,
    selectedRouteTrips,
    selectedTripId,
    loadingRouteStops,
    selectRouteById,
    switchToReturnRoute,
    clearSelectedRoute,
    selectedStop,
    selectedStopDetails,
    loadingStopDetails,
    selectStopById,
    clearSelectedStop,
    selectedMetroStation,
    setSelectedMetroStation,
    metroDetailModalOpen,
    setMetroDetailModalOpen,
    openMetroStation,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    buses,
    selectedBus,
    setSelectedBus,
    trackBus,
    realtimeStatus,
    otdApiKey,
    setOtdApiKey,
    apiKeyModalOpen,
    setApiKeyModalOpen,
    refreshRealtime,
    userLocation,
    locationStatus,
    requestUserLocation,
    setManualLocation,
    favorites,
    toggleFavoriteRoute,
    toggleFavoriteStop,
    isFavoriteRoute,
    isFavoriteStop,
    searchModalOpen,
    setSearchModalOpen,
    routeModalOpen,
    setRouteModalOpen,
    stopModalOpen,
    setStopModalOpen,
    locationModalOpen,
    setLocationModalOpen,
    metroModalOpen,
    setMetroModalOpen,
    aboutModalOpen,
    setAboutModalOpen,
    favoritesOpen,
    setFavoritesOpen,
    adminModalOpen,
    setAdminModalOpen,
    googleMapsApiKey,
    setGoogleMapsApiKey,
    mapEngine,
    setMapEngine,
    activeJourneyOption,
    setActiveJourneyOption,
  };

  return <TransitContext.Provider value={value}>{children}</TransitContext.Provider>;
};

export const useTransit = (): TransitContextType => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
