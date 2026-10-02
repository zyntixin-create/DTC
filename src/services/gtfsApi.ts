/**
 * Client for Delhi Open Transit Data (OTD) GTFS API
 * Official Source: https://otd.delhi.gov.in/data/static/
 */

import { GtfsRoute, GtfsStop, GtfsStopTime, GtfsTrip, StopServingRoute, StopSchedule, RealtimeStatus, MetaStats } from '../types/transit';

export const gtfsApi = {
  // 1. Fetch metadata and dataset info
  async getMeta(): Promise<MetaStats> {
    const res = await fetch('/api/meta');
    if (!res.ok) throw new Error('Failed to fetch transit metadata');
    return res.json();
  },

  // 2. Fetch routes with search, filters and pagination
  async getRoutes(params: {
    search?: string;
    origin?: string;
    destination?: string;
    direction?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ total: number; routes: GtfsRoute[]; limit: number; offset: number }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.origin) query.set('origin', params.origin);
    if (params.destination) query.set('destination', params.destination);
    if (params.direction !== undefined) query.set('direction', params.direction);
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.offset) query.set('offset', params.offset.toString());

    const res = await fetch(`/api/routes?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch routes');
    return res.json();
  },

  // 3. Fetch single route details and trips
  async getRouteDetails(routeId: string): Promise<{ route: GtfsRoute; trips: GtfsTrip[] }> {
    const res = await fetch(`/api/routes/${encodeURIComponent(routeId)}`);
    if (!res.ok) throw new Error('Route not found');
    return res.json();
  },

  // 4. Fetch complete ordered stop list for route
  async getRouteStops(routeId: string, tripId?: string): Promise<{ trip: any; stopCount: number; stops: GtfsStopTime[] }> {
    const query = tripId ? `?tripId=${encodeURIComponent(tripId)}` : '';
    const res = await fetch(`/api/routes/${encodeURIComponent(routeId)}/stops${query}`);
    if (!res.ok) throw new Error('Failed to fetch route stops');
    return res.json();
  },

  // 5. Fetch stops directory & nearby search
  async getStops(params: {
    search?: string;
    lat?: number;
    lon?: number;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ total: number; stops: GtfsStop[]; limit: number; offset: number }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.lat !== undefined && params.lat !== null) query.set('lat', params.lat.toString());
    if (params.lon !== undefined && params.lon !== null) query.set('lon', params.lon.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.offset) query.set('offset', params.offset.toString());

    const res = await fetch(`/api/stops?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch stops');
    return res.json();
  },

  // 6. Fetch stop details & all routes serving it
  async getStopDetails(stopId: string): Promise<{ stop: GtfsStop; routesServing: StopServingRoute[]; schedules: StopSchedule[] }> {
    const res = await fetch(`/api/stops/${encodeURIComponent(stopId)}`);
    if (!res.ok) throw new Error('Stop not found');
    return res.json();
  },

  // 7. Global Search (bus number, route name, stop name, origin, destination)
  async search(q: string): Promise<{ routes: GtfsRoute[]; stops: GtfsStop[] }> {
    if (!q || !q.trim()) return { routes: [], stops: [] };
    const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
    if (!res.ok) return { routes: [], stops: [] };
    return res.json();
  },

  // 8. Real-time Live Buses Endpoint
  async getRealtimeBuses(
    routeId?: string,
    apiKey?: string,
    lat?: number,
    lon?: number,
    search?: string
  ): Promise<RealtimeStatus> {
    const query = new URLSearchParams();
    if (routeId) query.set('routeId', routeId);
    if (apiKey) query.set('apiKey', apiKey);
    if (lat !== undefined && lat !== null) query.set('lat', lat.toString());
    if (lon !== undefined && lon !== null) query.set('lon', lon.toString());
    if (search) query.set('search', search);

    try {
      const res = await fetch(`/api/realtime/buses?${query.toString()}`);
      if (!res.ok) {
        return {
          available: false,
          configured: false,
          message: 'Live tracking depends on Delhi Open Transit Data API availability. Live bus location unavailable.',
          buses: []
        };
      }
      return res.json();
    } catch {
      return {
        available: false,
        configured: false,
        message: 'Live bus location unavailable. Live tracking depends on Delhi Open Transit Data API availability.',
        buses: []
      };
    }
  },

  // 9. Journey Planner
  async planJourney(fromStopId: string, toStopId: string) {
    const res = await fetch(`/api/journey?from=${encodeURIComponent(fromStopId)}&to=${encodeURIComponent(toStopId)}`);
    if (!res.ok) throw new Error('Failed to plan journey');
    return res.json();
  },

  // 10. Popular Data
  async getPopular(): Promise<{ routes: GtfsRoute[]; stops: any[]; trips: any[]; metroStations: any[] }> {
    const res = await fetch('/api/popular');
    if (!res.ok) throw new Error('Failed to fetch popular transit data');
    return res.json();
  },

  // 11. Service Alerts
  async getAlerts(): Promise<{ success: boolean; alerts: any[] }> {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async createAlert(alertData: any): Promise<{ success: boolean; alert: any }> {
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res.json();
  },

  async deleteAlert(alertId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/alerts/${encodeURIComponent(alertId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete alert');
    return res.json();
  },

  // 12. Delhi Metro
  async getMetro(): Promise<{ success: boolean; lines: any[]; stations: any[] }> {
    const res = await fetch('/api/metro');
    if (!res.ok) throw new Error('Failed to fetch metro data');
    return res.json();
  },

  async getMetroStation(stationId: string): Promise<{ success: boolean; station: any }> {
    const res = await fetch(`/api/metro/${encodeURIComponent(stationId)}`);
    if (!res.ok) throw new Error('Failed to fetch metro station');
    return res.json();
  },

  // 13. Admin Diagnostics
  async getAdminStats(): Promise<any> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  }
};
