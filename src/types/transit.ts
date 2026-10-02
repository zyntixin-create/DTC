export type BusStatus = 'Running' | 'Delayed' | 'Congested' | 'At Terminal';
export type BusType = 'Electric' | 'CNG Low-Floor' | 'AC Low-Floor' | 'Standard';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  nameHindi?: string;
  lat: number;
  lng: number;
  terminal?: boolean;
  metroInterchange?: string; // e.g. "Blue Line / Yellow Line"
  routesServing: string[]; // Bus numbers e.g. ['740', '721']
}

export interface RouteStopDetail {
  stopId: string;
  stopName: string;
  sequence: number;
  lat: number;
  lng: number;
  distanceFromStartKm: number;
  estimatedMinutesFromStart: number;
}

export interface Route {
  id: string;
  busNumber: string;
  name: string;
  origin: string;
  destination: string;
  direction: 'UP' | 'DOWN';
  totalStops: number;
  approxDurationMin: number;
  distanceKm: number;
  frequencyMin: number;
  firstBus: string;
  lastBus: string;
  color: string;
  stops: RouteStopDetail[];
  pathCoordinates: LatLng[];
  activeBusesCount: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  routeId: string;
  regNumber: string; // e.g., "DL 1PC 7421"
  busType: BusType;
  currentLat: number;
  currentLng: number;
  heading: number; // in degrees 0-360
  speedKmh: number;
  destination: string;
  origin: string;
  status: BusStatus;
  currentStopId?: string;
  currentStopName?: string;
  nextStopId: string;
  nextStopName: string;
  etaNextStopMin: number;
  currentStopIndex: number; // position on route stops array
  occupancy: 'Low' | 'Medium' | 'High';
  lastUpdated: string; // e.g. "Just now" or ISO
  isLive: boolean;
}

export interface JourneyStep {
  type: 'WALK' | 'BUS';
  instruction: string;
  fromStop: string;
  toStop: string;
  busNumber?: string;
  stopsCount?: number;
  durationMin: number;
  distanceKm: number;
}

export interface JourneyPlan {
  id: string;
  fromStopName: string;
  toStopName: string;
  totalDurationMin: number;
  totalDistanceKm: number;
  fareRupees: number;
  transfers: number;
  steps: JourneyStep[];
  departureTime: string;
  arrivalTime: string;
}

export interface ServiceAlert {
  id: string;
  title: string;
  category: 'Diversion' | 'Maintenance' | 'Delay' | 'Advisory';
  severity: 'low' | 'medium' | 'high';
  affectedRoutes: string[];
  affectedStops?: string[];
  publishedAt: string;
  description: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  isCustom: boolean;
}

// Official Delhi OTD GTFS Static Types
export interface GtfsRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: number;
  agency_id: string;
  direction_id?: number;
  origin_stop_id?: string;
  origin_stop_name?: string;
  dest_stop_id?: string;
  dest_stop_name?: string;
  stop_count?: number;
  total_trips?: number;
  first_departure?: string;
  last_departure?: string;
  rep_trip_id?: string;
}

export interface GtfsStop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  zone_id?: string;
  routes_count?: number;
  distanceKm?: number;
}

export interface GtfsStopTime {
  stop_sequence: number;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_code?: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  zone_id?: string;
}

export interface GtfsTrip {
  trip_id: string;
  route_id: string;
  service_id: string;
  trip_headsign: string;
  direction_id: number;
  departure_time?: string;
  stop_count?: number;
}

export interface StopServingRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  agency_id: string;
  origin_stop_name: string;
  dest_stop_name: string;
  direction_id: number;
  stop_count: number;
  stop_sequence: number;
}

export interface StopSchedule {
  arrival_time: string;
  departure_time: string;
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  dest_stop_name: string;
}

export interface RealtimeStatus {
  available: boolean;
  configured: boolean;
  message: string;
  disclaimer?: string;
  buses: Bus[];
}

export interface MetaStats {
  routesCount: number;
  stopsCount: number;
  tripsCount: number;
  stopTimesCount: number;
  source: string;
  sourceUrl: string;
  datasetFiles: string[];
  disclaimer: string;
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
