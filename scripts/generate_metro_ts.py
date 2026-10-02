import json, sys
import build_delhi_metro as bdm

lines_meta = bdm.lines_meta
stations = list(bdm.station_dict.values())
line_sequences = bdm.line_sequences

ts_code = f"""// Official Delhi Metro Network Data and Route Planner
export interface MetroLine {{
  id: string;
  name: string;
  nameHindi: string;
  color: string;
  textColor: string;
  bgColor: string;
  terminals: string;
  lengthKm: number;
  totalStations: number;
}}

export interface MetroStation {{
  id: string;
  name: string;
  nameHindi: string;
  lineIds: string[];
  lines: string[];
  isInterchange: boolean;
  interchangeLines?: string[];
  lat: number;
  lng: number;
  firstTrain: string;
  lastTrain: string;
  facilities: string[];
  connectingBusNumbers?: string[];
  nearbyBusStops?: {{ name: string; distanceM: number; walkingMin: number }}[];
}}

export interface MetroRouteLeg {{
  lineId: string;
  lineName: string;
  lineColor: string;
  boardingStation: MetroStation;
  destinationStation: MetroStation;
  direction: string;
  stations: MetroStation[];
  stationsCount: number;
  changeover?: {{
    atStation: MetroStation;
    fromLine: string;
    toLine: string;
    walkingTimeMin: number;
    platformNotice: string;
  }};
}}

export interface MetroRoutePlan {{
  id: string;
  title: string;
  tag: string;
  isFastest?: boolean;
  isDirect?: boolean;
  fromStation: MetroStation;
  toStation: MetroStation;
  totalStations: number;
  interchangesCount: number;
  durationMin: number;
  fareRupees: number;
  distanceKm: number;
  legs: MetroRouteLeg[];
  allStations: MetroStation[];
  coordinates: [number, number][];
}}

export const DELHI_METRO_LINES: MetroLine[] = {json.dumps(lines_meta, indent=2)};

export const DELHI_METRO_STATIONS: MetroStation[] = {json.dumps(stations, indent=2)};

export const METRO_STATION_MAP: Record<string, MetroStation> = {{}};
DELHI_METRO_STATIONS.forEach((s) => {{
  METRO_STATION_MAP[s.id] = s;
}});

export const LINE_SEQUENCES: Record<string, string[]> = {json.dumps(line_sequences, indent=2)};

export const POPULAR_METRO_STATIONS = [
  {{ id: 'rajiv-chowk', name: 'Rajiv Chowk (Connaught Place)', lineText: 'Blue & Yellow Line', isInterchange: true }},
  {{ id: 'dwarka-sec-21', name: 'Dwarka Sector 21', lineText: 'Blue Line & Airport Express', isInterchange: true }},
  {{ id: 'new-delhi', name: 'New Delhi Railway Station', lineText: 'Yellow Line & Airport Express', isInterchange: true }},
  {{ id: 'kashmere-gate', name: 'Kashmere Gate ISBT', lineText: 'Red, Yellow & Violet Line', isInterchange: true }},
  {{ id: 'hauz-khas', name: 'Hauz Khas Junction', lineText: 'Yellow & Magenta Line', isInterchange: true }},
  {{ id: 'anand-vihar', name: 'Anand Vihar ISBT', lineText: 'Blue & Pink Line', isInterchange: true }},
  {{ id: 'central-secretariat', name: 'Central Secretariat', lineText: 'Yellow & Violet Line', isInterchange: true }},
  {{ id: 'botanical-garden', name: 'Botanical Garden Noida', lineText: 'Blue & Magenta Line', isInterchange: true }},
  {{ id: 'janakpuri-west', name: 'Janakpuri West', lineText: 'Blue & Magenta Line', isInterchange: true }},
  {{ id: 'millennium-city-centre', name: 'Millennium City Centre (HUDA)', lineText: 'Yellow Line (Gurugram)', isInterchange: false }},
  {{ id: 'noida-electronic-city', name: 'Noida Electronic City', lineText: 'Blue Line', isInterchange: false }},
  {{ id: 'chandni-chowk', name: 'Chandni Chowk', lineText: 'Yellow Line (Old Delhi)', isInterchange: false }}
];

export const METRO_LANDMARK_ALIASES: Record<string, string> = {{
  'cp': 'rajiv-chowk',
  'connaught place': 'rajiv-chowk',
  'rajiv chowk': 'rajiv-chowk',
  'huda': 'millennium-city-centre',
  'huda city centre': 'millennium-city-centre',
  'gurgaon': 'millennium-city-centre',
  'gurugram': 'millennium-city-centre',
  'millennium city': 'millennium-city-centre',
  't3': 'igi-airport',
  'terminal 3': 'igi-airport',
  't1': 'terminal-1-igi-airport',
  'terminal 1': 'terminal-1-igi-airport',
  'airport': 'igi-airport',
  'aerocity': 'delhi-aerocity',
  'ndls': 'new-delhi',
  'new delhi railway station': 'new-delhi',
  'new delhi station': 'new-delhi',
  'new delhi': 'new-delhi',
  'old delhi': 'chandni-chowk',
  'old delhi railway station': 'chandni-chowk',
  'dwarka 21': 'dwarka-sec-21',
  'dwarka sector 21': 'dwarka-sec-21',
  'dwarka sec 21': 'dwarka-sec-21',
  'noida city centre': 'noida-city-centre',
  'noida electronic city': 'noida-electronic-city',
  'anand vihar': 'anand-vihar',
  'anand vihar isbt': 'anand-vihar',
  'kashmere gate': 'kashmere-gate',
  'kashmiri gate': 'kashmere-gate',
  'isbt': 'kashmere-gate',
  'saket': 'saket',
  'hauz khas': 'hauz-khas',
  'aiims': 'aiims',
  'sarai kale khan': 'sarai-kale-khan',
  'nizamuddin': 'sarai-kale-khan',
  'dhaula kuan': 'dhaula-kuan',
  'south campus': 'durgabai-deshmukh-south-campus'
}};

export function getMetroStation(query: string): MetroStation | null {{
  if (!query) return null;
  const q = query.trim().toLowerCase();
  if (METRO_LANDMARK_ALIASES[q] && METRO_STATION_MAP[METRO_LANDMARK_ALIASES[q]]) {{
    return METRO_STATION_MAP[METRO_LANDMARK_ALIASES[q]];
  }}
  if (METRO_STATION_MAP[q]) return METRO_STATION_MAP[q];
  const direct = DELHI_METRO_STATIONS.find((s) => s.id === q || s.name.toLowerCase() === q);
  if (direct) return direct;
  return DELHI_METRO_STATIONS.find((s) => s.name.toLowerCase().includes(q) || s.nameHindi.includes(q)) || null;
}}

export function searchMetroStations(query: string, limit = 8): MetroStation[] {{
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const aliasTarget = METRO_LANDMARK_ALIASES[q];
  const results: MetroStation[] = [];
  if (aliasTarget && METRO_STATION_MAP[aliasTarget]) {{
    results.push(METRO_STATION_MAP[aliasTarget]);
  }}
  for (const s of DELHI_METRO_STATIONS) {{
    if (results.some((r) => r.id === s.id)) continue;
    if (s.name.toLowerCase().startsWith(q) || s.id.startsWith(q)) {{
      results.push(s);
    }}
  }}
  for (const s of DELHI_METRO_STATIONS) {{
    if (results.length >= limit) break;
    if (results.some((r) => r.id === s.id)) continue;
    if (s.name.toLowerCase().includes(q) || s.nameHindi.includes(q) || s.lines.some((l) => l.toLowerCase().includes(q))) {{
      results.push(s);
    }}
  }}
  return results.slice(0, limit);
}}

// Helper: Calculate metro fare according to official DMRC fare slabs
export function calculateMetroFare(stationsCount: number, distanceKm: number): number {{
  if (distanceKm <= 2 || stationsCount <= 2) return 10;
  if (distanceKm <= 5 || stationsCount <= 5) return 20;
  if (distanceKm <= 12 || stationsCount <= 10) return 30;
  if (distanceKm <= 21 || stationsCount <= 18) return 40;
  if (distanceKm <= 32 || stationsCount <= 26) return 50;
  return 60;
}}

// Single route getter
export function calculateMetroRoute(fromIdOrName: string, toIdOrName: string): MetroRoutePlan | null {{
  const routes = calculateAllMetroRoutes(fromIdOrName, toIdOrName);
  return routes.length > 0 ? routes[0] : null;
}}

// Multi-path router: returns Direct, 1-interchange, and alternative routes
export function calculateAllMetroRoutes(fromIdOrName: string, toIdOrName: string): MetroRoutePlan[] {{
  if (!fromIdOrName || !toIdOrName) return [];
  const fromStation = getMetroStation(fromIdOrName);
  const toStation = getMetroStation(toIdOrName);

  if (!fromStation || !toStation) return [];
  if (fromStation.id === toStation.id) {{
    return [{{
      id: `metro-${{fromStation.id}}-${{toStation.id}}`,
      title: 'Same Station',
      tag: 'Origin & Destination are same',
      fromStation,
      toStation,
      totalStations: 1,
      interchangesCount: 0,
      durationMin: 0,
      fareRupees: 0,
      distanceKm: 0,
      legs: [],
      allStations: [fromStation],
      coordinates: [[fromStation.lat, fromStation.lng]]
    }}];
  }}

  const plans: MetroRoutePlan[] = [];

  const origin = fromStation;
  const destination = toStation;

  function buildPlan(idSuffix: string, title: string, tag: string, legs: MetroRouteLeg[]): MetroRoutePlan {{
    const allStations: MetroStation[] = [];
    legs.forEach((leg, lIdx) => {{
      leg.stations.forEach((st, sIdx) => {{
        if (lIdx > 0 && sIdx === 0) return;
        allStations.push(st);
      }});
    }});
    const totalStations = allStations.length;
    const distanceKm = parseFloat((totalStations * 1.25).toFixed(1));
    const durationMin = Math.round(totalStations * 2.1 + (legs.length - 1) * 4);
    const fareRupees = calculateMetroFare(totalStations, distanceKm);
    const coords: [number, number][] = allStations.map((s) => [s.lat, s.lng]);

    return {{
      id: `metro-${{origin.id}}-${{destination.id}}-${{idSuffix}}`,
      title,
      tag,
      fromStation: origin,
      toStation: destination,
      totalStations,
      interchangesCount: Math.max(0, legs.length - 1),
      durationMin,
      fareRupees,
      distanceKm,
      legs,
      allStations,
      coordinates: coords
    }};
  }}

  // 1. Direct Lines
  for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {{
    const i1 = seq.indexOf(fromStation.id);
    const i2 = seq.indexOf(toStation.id);
    if (i1 !== -1 && i2 !== -1) {{
      const lineId = seqKey.split('_')[0];
      const lineObj = DELHI_METRO_LINES.find((l) => l.id === lineId) || DELHI_METRO_LINES[0];
      const stationIds = i1 < i2 ? seq.slice(i1, i2 + 1) : seq.slice(i2, i1 + 1).reverse();
      const stations = stationIds.map((id) => METRO_STATION_MAP[id]).filter(Boolean);

      const leg: MetroRouteLeg = {{
        lineId: lineObj.id,
        lineName: lineObj.name,
        lineColor: lineObj.color,
        boardingStation: fromStation,
        destinationStation: toStation,
        direction: `Towards ${{toStation.name}}`,
        stations,
        stationsCount: stations.length
      }};

      plans.push(buildPlan(`direct-${{lineId}}`, `${{lineObj.name}} Direct`, 'Direct Metro', [leg]));
    }}
  }}

  // 2. 1-Interchange Lines
  const lineKeys = Object.keys(LINE_SEQUENCES);
  for (const l1 of lineKeys) {{
    const seq1 = LINE_SEQUENCES[l1];
    const i1 = seq1.indexOf(fromStation.id);
    if (i1 === -1) continue;

    for (const l2 of lineKeys) {{
      if (l1 === l2) continue;
      const seq2 = LINE_SEQUENCES[l2];
      const i2 = seq2.indexOf(toStation.id);
      if (i2 === -1) continue;

      const transfers = seq1.filter((sId) => seq2.includes(sId));
      for (const xferId of transfers) {{
        if (xferId === fromStation.id || xferId === toStation.id) continue;
        const x1 = seq1.indexOf(xferId);
        const x2 = seq2.indexOf(xferId);
        const leg1Ids = i1 < x1 ? seq1.slice(i1, x1 + 1) : seq1.slice(x1, i1 + 1).reverse();
        const leg2Ids = x2 < i2 ? seq2.slice(x2, i2 + 1) : seq2.slice(i2, x2 + 1).reverse();

        const st1 = leg1Ids.map((id) => METRO_STATION_MAP[id]).filter(Boolean);
        const st2 = leg2Ids.map((id) => METRO_STATION_MAP[id]).filter(Boolean);
        const xferStation = METRO_STATION_MAP[xferId];
        if (!xferStation || st1.length === 0 || st2.length === 0) continue;

        const lineObj1 = DELHI_METRO_LINES.find((l) => l.id === l1.split('_')[0]) || DELHI_METRO_LINES[0];
        const lineObj2 = DELHI_METRO_LINES.find((l) => l.id === l2.split('_')[0]) || DELHI_METRO_LINES[0];

        const leg1: MetroRouteLeg = {{
          lineId: lineObj1.id,
          lineName: lineObj1.name,
          lineColor: lineObj1.color,
          boardingStation: fromStation,
          destinationStation: xferStation,
          direction: `Towards ${{xferStation.name}}`,
          stations: st1,
          stationsCount: st1.length,
          changeover: {{
            atStation: xferStation,
            fromLine: lineObj1.name,
            toLine: lineObj2.name,
            walkingTimeMin: 4,
            platformNotice: `Change from ${{lineObj1.name}} to ${{lineObj2.name}} at ${{xferStation.name}}`
          }}
        }};

        const leg2: MetroRouteLeg = {{
          lineId: lineObj2.id,
          lineName: lineObj2.name,
          lineColor: lineObj2.color,
          boardingStation: xferStation,
          destinationStation: toStation,
          direction: `Towards ${{toStation.name}}`,
          stations: st2,
          stationsCount: st2.length
        }};

        const shortName1 = lineObj1.name.split(' ')[0];
        const shortName2 = lineObj2.name.split(' ')[0];
        plans.push(buildPlan(
          `xfer-${{xferId}}-${{l1}}-${{l2}}`,
          `Via ${{xferStation.name}} (${{shortName1}} ➔ ${{shortName2}})`,
          '1 Interchange',
          [leg1, leg2]
        ));
      }}
    }}
  }}

  // 3. Fallback BFS for 2-interchanges if nothing found
  if (plans.length === 0) {{
    interface QueueItem {{
      stationId: string;
      lineId: string;
      path: {{ stationId: string; lineId: string }}[];
      transfers: number;
    }}

    const queue: QueueItem[] = [];
    const visited = new Map<string, number>();

    for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {{
      if (seq.includes(fromStation.id)) {{
        const lineId = seqKey.split('_')[0];
        queue.push({{
          stationId: fromStation.id,
          lineId,
          path: [{{ stationId: fromStation.id, lineId }}],
          transfers: 0
        }});
        visited.set(`${{fromStation.id}}_${{lineId}}`, 0);
      }}
    }}

    let bestPath: {{ stationId: string; lineId: string }}[] | null = null;
    let minTransfersFound = 99;
    let minStopsFound = 999;

    while (queue.length > 0) {{
      const {{ stationId, lineId, path, transfers }} = queue.shift()!;
      if (transfers > minTransfersFound) continue;

      if (stationId === toStation.id) {{
        if (transfers < minTransfersFound || (transfers === minTransfersFound && path.length < minStopsFound)) {{
          minTransfersFound = transfers;
          minStopsFound = path.length;
          bestPath = path;
        }}
        continue;
      }}

      for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {{
        if (seqKey.startsWith(lineId)) {{
          const idx = seq.indexOf(stationId);
          if (idx !== -1) {{
            for (const nIdx of [idx - 1, idx + 1]) {{
              if (nIdx >= 0 && nIdx < seq.length) {{
                const nxtId = seq[nIdx];
                const stateKey = `${{nxtId}}_${{lineId}}`;
                const prevTransfers = visited.get(stateKey);
                if (prevTransfers === undefined || transfers < prevTransfers) {{
                  visited.set(stateKey, transfers);
                  queue.push({{
                    stationId: nxtId,
                    lineId,
                    path: [...path, {{ stationId: nxtId, lineId }}],
                    transfers
                  }});
                }}
              }}
            }}
          }}
        }}
      }}

      const stObj = METRO_STATION_MAP[stationId];
      if (stObj && stObj.lineIds.length > 1) {{
        for (const otherLineId of stObj.lineIds) {{
          if (otherLineId !== lineId) {{
            const nextTransfers = transfers + 1;
            const stateKey = `${{stationId}}_${{otherLineId}}`;
            const prevTransfers = visited.get(stateKey);
            if (prevTransfers === undefined || nextTransfers < prevTransfers) {{
              visited.set(stateKey, nextTransfers);
              queue.push({{
                stationId,
                lineId: otherLineId,
                path: [...path, {{ stationId, lineId: otherLineId }}],
                transfers: nextTransfers
              }});
            }}
          }}
        }}
      }}
    }}

    if (bestPath) {{
      const bfsLegs: MetroRouteLeg[] = [];
      let currentLegStations: MetroStation[] = [];
      let currentLegLine = bestPath[0].lineId;

      for (let i = 0; i < bestPath.length; i++) {{
        const item = bestPath[i];
        const station = METRO_STATION_MAP[item.stationId];
        if (!station) continue;

        if (item.lineId !== currentLegLine && currentLegStations.length > 0) {{
          const lineObj = DELHI_METRO_LINES.find((l) => l.id === currentLegLine) || DELHI_METRO_LINES[0];
          const nextLineObj = DELHI_METRO_LINES.find((l) => l.id === item.lineId) || DELHI_METRO_LINES[0];
          const transferStation = currentLegStations[currentLegStations.length - 1];

          bfsLegs.push({{
            lineId: lineObj.id,
            lineName: lineObj.name,
            lineColor: lineObj.color,
            boardingStation: currentLegStations[0],
            destinationStation: transferStation,
            direction: `Towards ${{transferStation.name}}`,
            stations: [...currentLegStations],
            stationsCount: currentLegStations.length,
            changeover: {{
              atStation: transferStation,
              fromLine: lineObj.name,
              toLine: nextLineObj.name,
              walkingTimeMin: 4,
              platformNotice: `Change from ${{lineObj.name}} to ${{nextLineObj.name}} at ${{transferStation.name}}`
            }}
          }});

          currentLegStations = [transferStation];
          currentLegLine = item.lineId;
        }}

        if (currentLegStations.length === 0 || currentLegStations[currentLegStations.length - 1].id !== station.id) {{
          currentLegStations.push(station);
        }}
      }}

      if (currentLegStations.length > 0) {{
        const lineObj = DELHI_METRO_LINES.find((l) => l.id === currentLegLine) || DELHI_METRO_LINES[0];
        bfsLegs.push({{
          lineId: lineObj.id,
          lineName: lineObj.name,
          lineColor: lineObj.color,
          boardingStation: currentLegStations[0],
          destinationStation: currentLegStations[currentLegStations.length - 1],
          direction: `Towards ${{currentLegStations[currentLegStations.length - 1].name}}`,
          stations: [...currentLegStations],
          stationsCount: currentLegStations.length
        }});
      }}

      plans.push(buildPlan('bfs', 'Optimal Metro Route', `${{bfsLegs.length - 1}} Interchanges`, bfsLegs));
    }}
  }}

  // Sort: fewer interchanges first, then shorter travel time
  plans.sort((a, b) => {{
    if (a.interchangesCount !== b.interchangesCount) {{
      return a.interchangesCount - b.interchangesCount;
    }}
    return a.durationMin - b.durationMin;
  }});

  // Keep up to 3 distinct routes (different transfer points or lines)
  const uniquePlans: MetroRoutePlan[] = [];
  const seenSignatures = new Set<string>();

  for (const p of plans) {{
    const sig = p.legs.map((l) => `${{l.lineId}}_${{l.boardingStation.id}}_${{l.destinationStation.id}}`).join('|');
    if (!seenSignatures.has(sig)) {{
      seenSignatures.add(sig);
      uniquePlans.push(p);
      if (uniquePlans.length >= 3) break;
    }}
  }}

  if (uniquePlans.length > 0) {{
    uniquePlans[0].isFastest = true;
    if (uniquePlans[0].interchangesCount === 0) {{
      uniquePlans[0].isDirect = true;
    }}
  }}

  return uniquePlans;
}}
"""

with open("src/data/delhiMetroData.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("Generated src/data/delhiMetroData.ts successfully!")
