#!/usr/bin/env python3
"""
Official Delhi Open Transit Data (OTD) GTFS Importer
Imports routes.txt, stops.txt, trips.txt, stop_times.txt into a normalized SQLite database.
Source: https://otd.delhi.gov.in/data/static/
"""

import os
import csv
import sqlite3
import time

def build_database(gtfs_dir='data/gtfs', db_path='data/delhi_transit.db'):
    t0 = time.time()
    print(f"Building transit database from {gtfs_dir} -> {db_path}")

    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute('PRAGMA synchronous = OFF;')
    cur.execute('PRAGMA journal_mode = MEMORY;')
    cur.execute('PRAGMA cache_size = 100000;')

    # 1. Normalized tables
    cur.execute('''
    CREATE TABLE routes (
        route_id TEXT PRIMARY KEY,
        route_short_name TEXT,
        route_long_name TEXT,
        route_type INTEGER,
        agency_id TEXT
    );
    ''')

    cur.execute('''
    CREATE TABLE stops (
        stop_id TEXT PRIMARY KEY,
        stop_code TEXT,
        stop_name TEXT,
        stop_lat REAL,
        stop_lon REAL,
        zone_id TEXT
    );
    ''')

    cur.execute('''
    CREATE TABLE trips (
        trip_id TEXT,
        route_id TEXT,
        service_id TEXT,
        trip_headsign TEXT,
        direction_id INTEGER
    );
    ''')

    cur.execute('''
    CREATE TABLE stop_times (
        trip_id TEXT,
        arrival_time TEXT,
        departure_time TEXT,
        stop_id TEXT,
        stop_sequence INTEGER
    );
    ''')

    # Import routes
    routes_file = os.path.join(gtfs_dir, 'routes.txt')
    if os.path.exists(routes_file):
        with open(routes_file, mode='r', encoding='utf-8', errors='ignore') as f:
            reader = csv.DictReader(f)
            route_rows = []
            for r in reader:
                r_id = r.get('route_id')
                long_name = r.get('route_long_name', '')
                short_name = r.get('route_short_name', '')
                if not short_name:
                    clean = long_name.replace('UP', '').replace('DOWN', '').replace('SPLDN', '').replace('SPLUP', '').replace('STLDOWN', '').replace('STLUP', '')
                    short_name = clean if clean else long_name
                r_type = int(r.get('route_type', 3) or 3)
                agency = r.get('agency_id', 'DTC')
                route_rows.append((r_id, short_name, long_name, r_type, agency))
            cur.executemany('INSERT OR IGNORE INTO routes VALUES (?, ?, ?, ?, ?)', route_rows)
        print(f"Imported {len(route_rows)} routes.")

    # Import stops
    stops_file = os.path.join(gtfs_dir, 'stops.txt')
    if os.path.exists(stops_file):
        with open(stops_file, mode='r', encoding='utf-8', errors='ignore') as f:
            reader = csv.DictReader(f)
            stop_rows = []
            for r in reader:
                s_id = r.get('stop_id')
                s_code = r.get('stop_code', '')
                s_name = r.get('stop_name', '').strip()
                try:
                    lat = float(r.get('stop_lat', 0.0))
                    lon = float(r.get('stop_lon', 0.0))
                except:
                    lat, lon = 0.0, 0.0
                zone = r.get('zone_id', '')
                stop_rows.append((s_id, s_code, s_name, lat, lon, zone))
            cur.executemany('INSERT OR IGNORE INTO stops VALUES (?, ?, ?, ?, ?, ?)', stop_rows)
        print(f"Imported {len(stop_rows)} stops.")

    # Import trips
    trips_file = os.path.join(gtfs_dir, 'trips.txt')
    if os.path.exists(trips_file):
        with open(trips_file, mode='r', encoding='utf-8', errors='ignore') as f:
            reader = csv.DictReader(f)
            trip_rows = []
            for r in reader:
                t_id = r.get('trip_id')
                r_id = r.get('route_id')
                s_id = r.get('service_id', '1')
                headsign = r.get('trip_headsign', '')
                dir_id = 0
                if 'DOWN' in str(t_id) or 'DN' in str(t_id):
                    dir_id = 1
                trip_rows.append((t_id, r_id, s_id, headsign, dir_id))
            cur.executemany('INSERT OR IGNORE INTO trips VALUES (?, ?, ?, ?, ?)', trip_rows)
        print(f"Imported {len(trip_rows)} trips.")

    # Import stop_times
    stop_times_file = os.path.join(gtfs_dir, 'stop_times.txt')
    if os.path.exists(stop_times_file):
        with open(stop_times_file, mode='r', encoding='utf-8', errors='ignore') as f:
            reader = csv.DictReader(f)
            batch = []
            count = 0
            for r in reader:
                t_id = r.get('trip_id')
                arr = r.get('arrival_time', '')
                dep = r.get('departure_time', '')
                s_id = r.get('stop_id')
                seq = int(r.get('stop_sequence', 0))
                batch.append((t_id, arr, dep, s_id, seq))
                count += 1
                if len(batch) >= 100000:
                    cur.executemany('INSERT INTO stop_times VALUES (?, ?, ?, ?, ?)', batch)
                    batch.clear()
            if batch:
                cur.executemany('INSERT INTO stop_times VALUES (?, ?, ?, ?, ?)', batch)
        print(f"Imported {count} stop times.")

    print("Building indexes...")
    cur.execute('CREATE INDEX idx_stop_times_trip ON stop_times (trip_id, stop_sequence);')
    cur.execute('CREATE INDEX idx_stop_times_stop ON stop_times (stop_id);')
    cur.execute('CREATE INDEX idx_trips_route ON trips (route_id);')
    cur.execute('CREATE INDEX idx_trips_id ON trips (trip_id);')
    cur.execute('CREATE INDEX idx_routes_short ON routes (route_short_name);')
    cur.execute('CREATE INDEX idx_routes_long ON routes (route_long_name);')
    cur.execute('CREATE INDEX idx_stops_name ON stops (stop_name COLLATE NOCASE);')

    print("Building route_summaries acceleration table...")
    cur.execute('''
    CREATE TABLE route_summaries (
        route_id TEXT PRIMARY KEY,
        route_short_name TEXT,
        route_long_name TEXT,
        agency_id TEXT,
        direction_id INTEGER,
        rep_trip_id TEXT,
        origin_stop_id TEXT,
        origin_stop_name TEXT,
        dest_stop_id TEXT,
        dest_stop_name TEXT,
        stop_count INTEGER,
        first_departure TEXT,
        last_departure TEXT,
        total_trips INTEGER
    );
    ''')

    cur.execute('''
    INSERT OR REPLACE INTO route_summaries
    SELECT 
        r.route_id,
        r.route_short_name,
        r.route_long_name,
        r.agency_id,
        t.direction_id,
        t.trip_id,
        first_st.stop_id,
        s_first.stop_name,
        last_st.stop_id,
        s_last.stop_name,
        trip_counts.cnt,
        st_range.min_dep,
        st_range.max_dep,
        t_stats.total_trips
    FROM routes r
    JOIN (
        SELECT route_id, COUNT(*) as total_trips, MIN(trip_id) as rep_trip_id
        FROM trips
        GROUP BY route_id
    ) t_stats ON r.route_id = t_stats.route_id
    JOIN trips t ON t.trip_id = t_stats.rep_trip_id
    JOIN (
        SELECT trip_id, COUNT(*) as cnt, MIN(stop_sequence) as min_seq, MAX(stop_sequence) as max_seq
        FROM stop_times
        GROUP BY trip_id
    ) trip_counts ON trip_counts.trip_id = t.trip_id
    JOIN stop_times first_st ON first_st.trip_id = t.trip_id AND first_st.stop_sequence = trip_counts.min_seq
    JOIN stop_times last_st ON last_st.trip_id = t.trip_id AND last_st.stop_sequence = trip_counts.max_seq
    JOIN stops s_first ON s_first.stop_id = first_st.stop_id
    JOIN stops s_last ON s_last.stop_id = last_st.stop_id
    LEFT JOIN (
        SELECT t2.route_id, MIN(st.departure_time) as min_dep, MAX(st.departure_time) as max_dep
        FROM trips t2
        JOIN stop_times st ON st.trip_id = t2.trip_id AND st.stop_sequence = 0
        GROUP BY t2.route_id
    ) st_range ON st_range.route_id = r.route_id;
    ''')

    cur.execute('CREATE INDEX idx_rs_short ON route_summaries(route_short_name);')
    cur.execute('CREATE INDEX idx_rs_long ON route_summaries(route_long_name);')
    cur.execute('CREATE INDEX idx_rs_origin ON route_summaries(origin_stop_name COLLATE NOCASE);')
    cur.execute('CREATE INDEX idx_rs_dest ON route_summaries(dest_stop_name COLLATE NOCASE);')

    print("Building stop_routes acceleration table...")
    cur.execute('''
    CREATE TABLE stop_routes (
        stop_id TEXT,
        route_id TEXT,
        min_stop_sequence INTEGER,
        PRIMARY KEY (stop_id, route_id)
    );
    ''')

    cur.execute('''
    INSERT OR REPLACE INTO stop_routes
    SELECT st.stop_id, t.route_id, MIN(st.stop_sequence)
    FROM stop_times st
    JOIN trips t ON t.trip_id = st.trip_id
    GROUP BY st.stop_id, t.route_id;
    ''')

    cur.execute('CREATE INDEX idx_sr_route ON stop_routes(route_id);')
    cur.execute('CREATE INDEX idx_sr_stop ON stop_routes(stop_id);')

    conn.commit()
    conn.close()
    print(f"Transit database successfully built in {time.time() - t0:.2f} seconds!")

if __name__ == '__main__':
    build_database()
