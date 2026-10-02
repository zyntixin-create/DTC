// Official Delhi Metro Network Data and Route Planner
export interface MetroLine {
  id: string;
  name: string;
  nameHindi: string;
  color: string;
  textColor: string;
  bgColor: string;
  terminals: string;
  lengthKm: number;
  totalStations: number;
}

export interface MetroStation {
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
  nearbyBusStops?: { name: string; distanceM: number; walkingMin: number }[];
}

export interface MetroRouteLeg {
  lineId: string;
  lineName: string;
  lineColor: string;
  boardingStation: MetroStation;
  destinationStation: MetroStation;
  direction: string;
  stations: MetroStation[];
  stationsCount: number;
  changeover?: {
    atStation: MetroStation;
    fromLine: string;
    toLine: string;
    walkingTimeMin: number;
    platformNotice: string;
  };
}

export interface MetroRoutePlan {
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
}

export const DELHI_METRO_LINES: MetroLine[] = [
  {
    "id": "red",
    "name": "Red Line (Line 1)",
    "nameHindi": "\u0930\u0947\u0921 \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 1)",
    "color": "#DC2626",
    "textColor": "#FFFFFF",
    "bgColor": "bg-red-600",
    "terminals": "Rithala \u21c4 Shaheed Sthal (New Bus Adda)",
    "lengthKm": 34.7,
    "totalStations": 29
  },
  {
    "id": "yellow",
    "name": "Yellow Line (Line 2)",
    "nameHindi": "\u092f\u0947\u0932\u094b \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 2)",
    "color": "#EAB308",
    "textColor": "#000000",
    "bgColor": "bg-yellow-500",
    "terminals": "Samaypur Badli \u21c4 Millennium City Centre Gurugram",
    "lengthKm": 49.3,
    "totalStations": 37
  },
  {
    "id": "blue",
    "name": "Blue Line (Line 3 & 4)",
    "nameHindi": "\u092c\u094d\u0932\u0942 \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 3 \u0914\u0930 4)",
    "color": "#2563EB",
    "textColor": "#FFFFFF",
    "bgColor": "bg-blue-600",
    "terminals": "Dwarka Sector 21 \u21c4 Noida Electronic City / Vaishali",
    "lengthKm": 65.4,
    "totalStations": 59
  },
  {
    "id": "green",
    "name": "Green Line (Line 5)",
    "nameHindi": "\u0917\u094d\u0930\u0940\u0928 \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 5)",
    "color": "#16A34A",
    "textColor": "#FFFFFF",
    "bgColor": "bg-green-600",
    "terminals": "Inderlok / Kirti Nagar \u21c4 Brigadier Hoshiar Singh",
    "lengthKm": 29.6,
    "totalStations": 21
  },
  {
    "id": "violet",
    "name": "Violet Line (Line 6)",
    "nameHindi": "\u0935\u093e\u092f\u0932\u0947\u091f \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 6)",
    "color": "#7C3AED",
    "textColor": "#FFFFFF",
    "bgColor": "bg-purple-600",
    "terminals": "Kashmere Gate \u21c4 Raja Nahar Singh (Ballabhgarh)",
    "lengthKm": 46.6,
    "totalStations": 34
  },
  {
    "id": "pink",
    "name": "Pink Line (Line 7)",
    "nameHindi": "\u092a\u093f\u0902\u0915 \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 7)",
    "color": "#EC4899",
    "textColor": "#FFFFFF",
    "bgColor": "bg-pink-500",
    "terminals": "Majlis Park \u21c4 Shiv Vihar (Ring Road Orbital)",
    "lengthKm": 59.0,
    "totalStations": 38
  },
  {
    "id": "magenta",
    "name": "Magenta Line (Line 8)",
    "nameHindi": "\u092e\u091c\u0947\u0902\u091f\u093e \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 8)",
    "color": "#D946EF",
    "textColor": "#FFFFFF",
    "bgColor": "bg-fuchsia-600",
    "terminals": "Janakpuri West \u21c4 Botanical Garden (Via IGI T1)",
    "lengthKm": 37.5,
    "totalStations": 25
  },
  {
    "id": "airport",
    "name": "Airport Express (Orange Line)",
    "nameHindi": "\u090f\u092f\u0930\u092a\u094b\u0930\u094d\u091f \u090f\u0915\u094d\u0938\u092a\u094d\u0930\u0947\u0938 (\u0911\u0930\u0947\u0902\u091c \u0932\u093e\u0907\u0928)",
    "color": "#EA580C",
    "textColor": "#FFFFFF",
    "bgColor": "bg-orange-600",
    "terminals": "New Delhi Railway Station \u21c4 Yashobhoomi Dwarka Sector 25",
    "lengthKm": 22.7,
    "totalStations": 7
  },
  {
    "id": "grey",
    "name": "Grey Line (Line 9)",
    "nameHindi": "\u0917\u094d\u0930\u0947 \u0932\u093e\u0907\u0928 (\u0932\u093e\u0907\u0928 9)",
    "color": "#64748B",
    "textColor": "#FFFFFF",
    "bgColor": "bg-slate-500",
    "terminals": "Dwarka \u21c4 Dhansa Bus Stand",
    "lengthKm": 5.2,
    "totalStations": 4
  },
  {
    "id": "rapid_metro",
    "name": "Rapid Metro Gurgaon",
    "nameHindi": "\u0930\u0948\u092a\u093f\u0921 \u092e\u0947\u091f\u094d\u0930\u094b \u0917\u0941\u0921\u093c\u0917\u093e\u0902\u0935",
    "color": "#06B6D4",
    "textColor": "#FFFFFF",
    "bgColor": "bg-cyan-600",
    "terminals": "Sector 55-56 \u21c4 Phase 3 (Cyber City)",
    "lengthKm": 12.1,
    "totalStations": 11
  }
];

export const DELHI_METRO_STATIONS: MetroStation[] = [
  {
    "id": "rithala",
    "name": "Rithala",
    "nameHindi": "\u0930\u093f\u0920\u093e\u0932\u093e",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7208,
    "lng": 77.1072,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rohini-west",
    "name": "Rohini West",
    "nameHindi": "\u0930\u094b\u0939\u093f\u0923\u0940 \u092a\u0936\u094d\u091a\u093f\u092e",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7153,
    "lng": 77.1147,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rohini-east",
    "name": "Rohini East",
    "nameHindi": "\u0930\u094b\u0939\u093f\u0923\u0940 \u092a\u0942\u0930\u094d\u0935",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7107,
    "lng": 77.1264,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "pitampura",
    "name": "Pitampura",
    "nameHindi": "\u092a\u0940\u0924\u092e\u092a\u0941\u0930\u093e",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7032,
    "lng": 77.1352,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kohat-enclave",
    "name": "Kohat Enclave",
    "nameHindi": "\u0915\u094b\u0939\u093e\u091f \u090f\u0928\u094d\u0915\u094d\u0932\u0947\u0935",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6978,
    "lng": 77.1423,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "netaji-subhash-place",
    "name": "Netaji Subhash Place",
    "nameHindi": "\u0928\u0947\u0924\u093e\u091c\u0940 \u0938\u0941\u092d\u093e\u0937 \u092a\u094d\u0932\u0947\u0938",
    "lineIds": [
      "red",
      "pink"
    ],
    "lines": [
      "Red Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Red Line",
      "Pink Line"
    ],
    "lat": 28.6946,
    "lng": 77.1517,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "keshav-puram",
    "name": "Keshav Puram",
    "nameHindi": "\u0915\u0947\u0936\u0935 \u092a\u0941\u0930\u092e",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6904,
    "lng": 77.1612,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kanhaiya-nagar",
    "name": "Kanhaiya Nagar",
    "nameHindi": "\u0915\u0928\u094d\u0939\u0948\u092f\u093e \u0928\u0917\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6831,
    "lng": 77.1654,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "inderlok",
    "name": "Inderlok",
    "nameHindi": "\u0907\u0902\u0926\u0930\u0932\u094b\u0915",
    "lineIds": [
      "red",
      "green"
    ],
    "lines": [
      "Red Line",
      "Green Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Red Line",
      "Green Line"
    ],
    "lat": 28.6734,
    "lng": 77.1697,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shastri-nagar",
    "name": "Shastri Nagar",
    "nameHindi": "\u0936\u093e\u0938\u094d\u0924\u094d\u0930\u0940 \u0928\u0917\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6698,
    "lng": 77.1812,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "pratap-nagar",
    "name": "Pratap Nagar",
    "nameHindi": "\u092a\u094d\u0930\u0924\u093e\u092a \u0928\u0917\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6668,
    "lng": 77.1956,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "pul-bangash",
    "name": "Pul Bangash",
    "nameHindi": "\u092a\u0941\u0932 \u092c\u0902\u0917\u0936",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6664,
    "lng": 77.2064,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "tis-hazari",
    "name": "Tis Hazari",
    "nameHindi": "\u0924\u0940\u0938 \u0939\u091c\u093e\u0930\u0940",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6672,
    "lng": 77.2173,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kashmere-gate",
    "name": "Kashmere Gate",
    "nameHindi": "\u0915\u0936\u094d\u092e\u0940\u0930\u0940 \u0917\u0947\u091f",
    "lineIds": [
      "red",
      "yellow",
      "violet"
    ],
    "lines": [
      "Red Line",
      "Yellow Line",
      "Violet Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Red Line",
      "Yellow Line",
      "Violet Line"
    ],
    "lat": 28.6675,
    "lng": 77.2285,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shastri-park",
    "name": "Shastri Park",
    "nameHindi": "\u0936\u093e\u0938\u094d\u0924\u094d\u0930\u0940 \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6705,
    "lng": 77.2505,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "seelampur",
    "name": "Seelampur",
    "nameHindi": "\u0938\u0940\u0932\u092e\u092a\u0941\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6698,
    "lng": 77.2654,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "welcome",
    "name": "Welcome",
    "nameHindi": "\u0935\u0947\u0932\u0915\u092e",
    "lineIds": [
      "red",
      "pink"
    ],
    "lines": [
      "Red Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Red Line",
      "Pink Line"
    ],
    "lat": 28.6719,
    "lng": 77.2778,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shahdara",
    "name": "Shahdara",
    "nameHindi": "\u0936\u093e\u0939\u0926\u0930\u093e",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6734,
    "lng": 77.2894,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mansarovar-park",
    "name": "Mansarovar Park",
    "nameHindi": "\u092e\u093e\u0928\u0938\u0930\u094b\u0935\u0930 \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6765,
    "lng": 77.3005,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jhilmil",
    "name": "Jhilmil",
    "nameHindi": "\u091d\u093f\u0932\u092e\u093f\u0932",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6784,
    "lng": 77.3123,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dilshad-garden",
    "name": "Dilshad Garden",
    "nameHindi": "\u0926\u093f\u0932\u0936\u093e\u0926 \u0917\u093e\u0930\u094d\u0921\u0928",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6808,
    "lng": 77.3198,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shahid-nagar",
    "name": "Shahid Nagar",
    "nameHindi": "\u0936\u093e\u0939\u093f\u0926 \u0928\u0917\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6841,
    "lng": 77.3302,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "raj-bagh",
    "name": "Raj Bagh",
    "nameHindi": "\u0930\u093e\u091c \u092c\u093e\u0917",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6865,
    "lng": 77.3412,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "major-mohit-sharma",
    "name": "Major Mohit Sharma Rajendra Nagar",
    "nameHindi": "\u092e\u0947\u091c\u0930 \u092e\u094b\u0939\u093f\u0924 \u0936\u0930\u094d\u092e\u093e \u0930\u093e\u091c\u0947\u0902\u0926\u094d\u0930 \u0928\u0917\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6892,
    "lng": 77.3524,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shyam-park",
    "name": "Shyam Park",
    "nameHindi": "\u0936\u094d\u092f\u093e\u092e \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6923,
    "lng": 77.3621,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mohan-nagar",
    "name": "Mohan Nagar",
    "nameHindi": "\u092e\u094b\u0939\u0928 \u0928\u0917\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6954,
    "lng": 77.3732,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "arthala",
    "name": "Arthala",
    "nameHindi": "\u0905\u0930\u094d\u0925\u0932\u093e",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6985,
    "lng": 77.3845,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "hindon-river",
    "name": "Hindon River",
    "nameHindi": "\u0939\u093f\u0902\u0921\u0928 \u0930\u093f\u0935\u0930",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7012,
    "lng": 77.3956,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shaheed-sthal",
    "name": "Shaheed Sthal (New Bus Adda)",
    "nameHindi": "\u0936\u0939\u0940\u0926 \u0938\u094d\u0925\u0932 (\u0928\u092f\u093e \u092c\u0938 \u0905\u0921\u094d\u0921\u093e)",
    "lineIds": [
      "red"
    ],
    "lines": [
      "Red Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7042,
    "lng": 77.4068,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "samaypur-badli",
    "name": "Samaypur Badli",
    "nameHindi": "\u0938\u092e\u092f\u092a\u0941\u0930 \u092c\u093e\u0926\u0932\u0940",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7456,
    "lng": 77.1354,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rohini-sec-18-19",
    "name": "Rohini Sector 18-19",
    "nameHindi": "\u0930\u094b\u0939\u093f\u0923\u0940 \u0938\u0947\u0915\u094d\u091f\u0930 18-19",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7382,
    "lng": 77.1423,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "haiderpur-badli-mor",
    "name": "Haiderpur Badli Mor",
    "nameHindi": "\u0939\u0948\u0926\u0930\u092a\u0941\u0930 \u092c\u093e\u0926\u0932\u0940 \u092e\u094b\u0921\u093c",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7302,
    "lng": 77.1512,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jahangirpuri",
    "name": "Jahangirpuri",
    "nameHindi": "\u091c\u0939\u093e\u0901\u0917\u0940\u0930\u092a\u0941\u0930\u0940",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7245,
    "lng": 77.1601,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "adarsh-nagar",
    "name": "Adarsh Nagar",
    "nameHindi": "\u0906\u0926\u0930\u094d\u0936 \u0928\u0917\u0930",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7154,
    "lng": 77.1702,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "azadpur",
    "name": "Azadpur",
    "nameHindi": "\u0906\u091c\u093e\u0926\u092a\u0941\u0930",
    "lineIds": [
      "yellow",
      "pink"
    ],
    "lines": [
      "Yellow Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Yellow Line",
      "Pink Line"
    ],
    "lat": 28.7065,
    "lng": 77.1802,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "model-town",
    "name": "Model Town",
    "nameHindi": "\u092e\u0949\u0921\u0932 \u091f\u093e\u0909\u0928",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6982,
    "lng": 77.1912,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "gtb-nagar",
    "name": "Guru Tegh Bahadur Nagar",
    "nameHindi": "\u0917\u0941\u0930\u0941 \u0924\u0947\u0917 \u092c\u0939\u093e\u0926\u0941\u0930 \u0928\u0917\u0930",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6923,
    "lng": 77.2054,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "vishwavidyalaya",
    "name": "Vishwavidyalaya",
    "nameHindi": "\u0935\u093f\u0936\u094d\u0935\u0935\u093f\u0926\u094d\u092f\u093e\u0932\u092f",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6872,
    "lng": 77.2142,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "vidhan-sabha",
    "name": "Vidhan Sabha",
    "nameHindi": "\u0935\u093f\u0927\u093e\u0928 \u0938\u092d\u093e",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6792,
    "lng": 77.2215,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "civil-lines",
    "name": "Civil Lines",
    "nameHindi": "\u0938\u093f\u0935\u093f\u0932 \u0932\u093e\u0907\u0928\u094d\u0938",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6741,
    "lng": 77.2254,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "chandni-chowk",
    "name": "Chandni Chowk",
    "nameHindi": "\u091a\u093e\u0901\u0926\u0928\u0940 \u091a\u094c\u0915",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6582,
    "lng": 77.2301,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "chawri-bazar",
    "name": "Chawri Bazar",
    "nameHindi": "\u091a\u093e\u0935\u0921\u093c\u0940 \u092c\u093e\u091c\u093e\u0930",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6502,
    "lng": 77.2272,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "new-delhi",
    "name": "New Delhi Railway Station",
    "nameHindi": "\u0928\u0908 \u0926\u093f\u0932\u094d\u0932\u0940",
    "lineIds": [
      "yellow",
      "airport"
    ],
    "lines": [
      "Yellow Line",
      "Airport Express"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Yellow Line",
      "Airport Express"
    ],
    "lat": 28.6431,
    "lng": 77.2223,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rajiv-chowk",
    "name": "Rajiv Chowk (Connaught Place)",
    "nameHindi": "\u0930\u093e\u091c\u0940\u0935 \u091a\u094c\u0915",
    "lineIds": [
      "yellow",
      "blue"
    ],
    "lines": [
      "Yellow Line",
      "Blue Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Yellow Line",
      "Blue Line"
    ],
    "lat": 28.6328,
    "lng": 77.2197,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "patel-chowk",
    "name": "Patel Chowk",
    "nameHindi": "\u092a\u091f\u0947\u0932 \u091a\u094c\u0915",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6231,
    "lng": 77.2142,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "central-secretariat",
    "name": "Central Secretariat",
    "nameHindi": "\u0915\u0947\u0902\u0926\u094d\u0930\u0940\u092f \u0938\u091a\u093f\u0935\u093e\u0932\u092f",
    "lineIds": [
      "yellow",
      "violet"
    ],
    "lines": [
      "Yellow Line",
      "Violet Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Yellow Line",
      "Violet Line"
    ],
    "lat": 28.6144,
    "lng": 77.2119,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "udyog-bhawan",
    "name": "Udyog Bhawan",
    "nameHindi": "\u0909\u0926\u094d\u092f\u094b\u0917 \u092d\u0935\u0928",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6105,
    "lng": 77.2125,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "lok-kalyan-marg",
    "name": "Lok Kalyan Marg",
    "nameHindi": "\u0932\u094b\u0915 \u0915\u0932\u094d\u092f\u093e\u0923 \u092e\u093e\u0930\u094d\u0917",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6012,
    "lng": 77.2085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jor-bagh",
    "name": "Jor Bagh",
    "nameHindi": "\u091c\u094b\u0930 \u092c\u093e\u0917",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5892,
    "lng": 77.2125,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dilli-haat-ina",
    "name": "Dilli Haat - INA",
    "nameHindi": "\u0926\u093f\u0932\u094d\u0932\u0940 \u0939\u093e\u091f - \u0906\u0908\u090f\u0928\u090f",
    "lineIds": [
      "yellow",
      "pink"
    ],
    "lines": [
      "Yellow Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Yellow Line",
      "Pink Line"
    ],
    "lat": 28.5744,
    "lng": 77.21,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "aiims",
    "name": "AIIMS",
    "nameHindi": "\u090f\u092e\u094d\u0938",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5684,
    "lng": 77.2085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "green-park",
    "name": "Green Park",
    "nameHindi": "\u0917\u094d\u0930\u0940\u0928 \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5582,
    "lng": 77.2054,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "hauz-khas",
    "name": "Hauz Khas",
    "nameHindi": "\u0939\u094c\u091c \u0916\u093e\u0938",
    "lineIds": [
      "yellow",
      "magenta"
    ],
    "lines": [
      "Yellow Line",
      "Magenta Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Yellow Line",
      "Magenta Line"
    ],
    "lat": 28.5432,
    "lng": 77.2065,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "malviya-nagar",
    "name": "Malviya Nagar",
    "nameHindi": "\u092e\u093e\u0932\u0935\u0940\u092f \u0928\u0917\u0930",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5321,
    "lng": 77.2062,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "saket",
    "name": "Saket",
    "nameHindi": "\u0938\u093e\u0915\u0947\u0924",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5205,
    "lng": 77.2024,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "qutab-minar",
    "name": "Qutab Minar",
    "nameHindi": "\u0915\u0941\u0924\u0941\u092c \u092e\u0940\u0928\u093e\u0930",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5132,
    "lng": 77.1856,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "chhatarpur",
    "name": "Chhatarpur",
    "nameHindi": "\u091b\u0924\u0930\u092a\u0941\u0930",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5054,
    "lng": 77.1742,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sultanpur",
    "name": "Sultanpur",
    "nameHindi": "\u0938\u0941\u0932\u094d\u0924\u093e\u0928\u092a\u0941\u0930",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4982,
    "lng": 77.1623,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "ghitorni",
    "name": "Ghitorni",
    "nameHindi": "\u0918\u093f\u091f\u094b\u0930\u0928\u0940",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4921,
    "lng": 77.1485,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "arjan-garh",
    "name": "Arjan Garh",
    "nameHindi": "\u0905\u0930\u094d\u091c\u0928 \u0917\u0922\u093c",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4812,
    "lng": 77.1264,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "guru-dronacharya",
    "name": "Guru Dronacharya",
    "nameHindi": "\u0917\u0941\u0930\u0941 \u0926\u094d\u0930\u094b\u0923\u093e\u091a\u093e\u0930\u094d\u092f",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4824,
    "lng": 77.1023,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sikanderpur",
    "name": "Sikanderpur",
    "nameHindi": "\u0938\u093f\u0915\u0902\u0926\u0930\u092a\u0941\u0930",
    "lineIds": [
      "yellow",
      "rapid_metro"
    ],
    "lines": [
      "Yellow Line",
      "Rapid Metro"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Yellow Line",
      "Rapid Metro"
    ],
    "lat": 28.4815,
    "lng": 77.0924,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mg-road",
    "name": "MG Road Gurgaon",
    "nameHindi": "\u090f\u092e \u091c\u0940 \u0930\u094b\u0921",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4795,
    "lng": 77.0805,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "iffco-chowk",
    "name": "IFFCO Chowk",
    "nameHindi": "\u0907\u092b\u0915\u094b \u091a\u094c\u0915",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4723,
    "lng": 77.0712,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "millennium-city-centre",
    "name": "Millennium City Centre Gurugram",
    "nameHindi": "\u092e\u093f\u0932\u0947\u0928\u093f\u092f\u092e \u0938\u093f\u091f\u0940 \u0938\u0947\u0902\u091f\u0930 \u0917\u0941\u0930\u0941\u0917\u094d\u0930\u093e\u092e",
    "lineIds": [
      "yellow"
    ],
    "lines": [
      "Yellow Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4592,
    "lng": 77.0725,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-21",
    "name": "Dwarka Sector 21",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 21",
    "lineIds": [
      "blue",
      "airport"
    ],
    "lines": [
      "Blue Line",
      "Airport Express"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Airport Express"
    ],
    "lat": 28.5523,
    "lng": 77.0584,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-8",
    "name": "Dwarka Sector 8",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 8",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5654,
    "lng": 77.0672,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-9",
    "name": "Dwarka Sector 9",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 9",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5742,
    "lng": 77.0645,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-10",
    "name": "Dwarka Sector 10",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 10",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5812,
    "lng": 77.0582,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-11",
    "name": "Dwarka Sector 11",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 11",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5884,
    "lng": 77.0505,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-12",
    "name": "Dwarka Sector 12",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 12",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5925,
    "lng": 77.0402,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-13",
    "name": "Dwarka Sector 13",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 13",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6012,
    "lng": 77.0345,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-sec-14",
    "name": "Dwarka Sector 14",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 14",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6085,
    "lng": 77.0282,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka",
    "name": "Dwarka",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e",
    "lineIds": [
      "blue",
      "grey"
    ],
    "lines": [
      "Blue Line",
      "Grey Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Grey Line"
    ],
    "lat": 28.6145,
    "lng": 77.0225,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dwarka-mor",
    "name": "Dwarka Mor",
    "nameHindi": "\u0926\u094d\u0935\u093e\u0930\u0915\u093e \u092e\u094b\u0921\u093c",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6192,
    "lng": 77.0325,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nawada",
    "name": "Nawada",
    "nameHindi": "\u0928\u0935\u093e\u0926\u093e",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6205,
    "lng": 77.0442,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "uttam-nagar-west",
    "name": "Uttam Nagar West",
    "nameHindi": "\u0909\u0924\u094d\u0924\u092e \u0928\u0917\u0930 \u092a\u0936\u094d\u091a\u093f\u092e",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6212,
    "lng": 77.0563,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "uttam-nagar-east",
    "name": "Uttam Nagar East",
    "nameHindi": "\u0909\u0924\u094d\u0924\u092e \u0928\u0917\u0930 \u092a\u0942\u0930\u094d\u0935",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6225,
    "lng": 77.0664,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "janakpuri-west",
    "name": "Janakpuri West",
    "nameHindi": "\u091c\u0928\u0915\u092a\u0941\u0930\u0940 \u092a\u0936\u094d\u091a\u093f\u092e",
    "lineIds": [
      "blue",
      "magenta"
    ],
    "lines": [
      "Blue Line",
      "Magenta Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Magenta Line"
    ],
    "lat": 28.6293,
    "lng": 77.0778,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "janakpuri-east",
    "name": "Janakpuri East",
    "nameHindi": "\u091c\u0928\u0915\u092a\u0941\u0930\u0940 \u092a\u0942\u0930\u094d\u0935",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6321,
    "lng": 77.0874,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "tilak-nagar",
    "name": "Tilak Nagar",
    "nameHindi": "\u0924\u093f\u0932\u0915 \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6364,
    "lng": 77.0965,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "subhash-nagar",
    "name": "Subhash Nagar",
    "nameHindi": "\u0938\u0941\u092d\u093e\u0937 \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6402,
    "lng": 77.1054,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "tagore-garden",
    "name": "Tagore Garden",
    "nameHindi": "\u091f\u0948\u0917\u094b\u0930 \u0917\u093e\u0930\u094d\u0921\u0928",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6442,
    "lng": 77.1142,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rajouri-garden",
    "name": "Rajouri Garden",
    "nameHindi": "\u0930\u093e\u091c\u094c\u0930\u0940 \u0917\u093e\u0930\u094d\u0921\u0928",
    "lineIds": [
      "blue",
      "pink"
    ],
    "lines": [
      "Blue Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Pink Line"
    ],
    "lat": 28.6492,
    "lng": 77.1235,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "ramesh-nagar",
    "name": "Ramesh Nagar",
    "nameHindi": "\u0930\u092e\u0947\u0936 \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6534,
    "lng": 77.1324,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "moti-nagar",
    "name": "Moti Nagar",
    "nameHindi": "\u092e\u094b\u0924\u0940 \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6582,
    "lng": 77.1425,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kirti-nagar",
    "name": "Kirti Nagar",
    "nameHindi": "\u0915\u0940\u0930\u094d\u0924\u093f \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "blue",
      "green"
    ],
    "lat": 28.6554,
    "lng": 77.1524,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shadipur",
    "name": "Shadipur",
    "nameHindi": "\u0936\u093e\u0926\u0940\u092a\u0941\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6512,
    "lng": 77.1605,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "patel-nagar",
    "name": "Patel Nagar",
    "nameHindi": "\u092a\u091f\u0947\u0932 \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6482,
    "lng": 77.1702,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rajendra-place",
    "name": "Rajendra Place",
    "nameHindi": "\u0930\u093e\u091c\u0947\u0902\u0926\u094d\u0930 \u092a\u094d\u0932\u0947\u0938",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6445,
    "lng": 77.1805,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "karol-bagh",
    "name": "Karol Bagh",
    "nameHindi": "\u0915\u0930\u094b\u0932 \u092c\u093e\u0917",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6432,
    "lng": 77.1912,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jhandewalan",
    "name": "Jhandewalan",
    "nameHindi": "\u091d\u0902\u0921\u0947\u0935\u093e\u0932\u093e\u0928",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6441,
    "lng": 77.2012,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rk-ashram-marg",
    "name": "RK Ashram Marg",
    "nameHindi": "\u0906\u0930\u0915\u0947 \u0906\u0936\u094d\u0930\u092e \u092e\u093e\u0930\u094d\u0917",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6392,
    "lng": 77.2098,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "barakhamba-road",
    "name": "Barakhamba Road",
    "nameHindi": "\u092c\u093e\u0930\u093e\u0916\u0902\u092d\u093e \u0930\u094b\u0921",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6312,
    "lng": 77.2272,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mandi-house",
    "name": "Mandi House",
    "nameHindi": "\u092e\u0902\u0921\u0940 \u0939\u093e\u0909\u0938",
    "lineIds": [
      "blue",
      "violet"
    ],
    "lines": [
      "Blue Line",
      "Violet Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Violet Line"
    ],
    "lat": 28.6258,
    "lng": 77.2344,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "supreme-court",
    "name": "Supreme Court (Pragati Maidan)",
    "nameHindi": "\u0938\u0941\u092a\u094d\u0930\u0940\u092e \u0915\u094b\u0930\u094d\u091f",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6212,
    "lng": 77.2435,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "indraprastha",
    "name": "Indraprastha",
    "nameHindi": "\u0907\u0902\u0926\u094d\u0930\u092a\u094d\u0930\u0938\u094d\u0925",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6205,
    "lng": 77.2512,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "yamuna-bank",
    "name": "Yamuna Bank",
    "nameHindi": "\u092f\u092e\u0941\u0928\u093e \u092c\u0948\u0902\u0915",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "blue"
    ],
    "lat": 28.6225,
    "lng": 77.2654,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "akshardham",
    "name": "Akshardham",
    "nameHindi": "\u0905\u0915\u094d\u0937\u0930\u0927\u093e\u092e",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6184,
    "lng": 77.2795,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mayur-vihar-1",
    "name": "Mayur Vihar-I",
    "nameHindi": "\u092e\u092f\u0942\u0930 \u0935\u093f\u0939\u093e\u0930-1",
    "lineIds": [
      "blue",
      "pink"
    ],
    "lines": [
      "Blue Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Pink Line"
    ],
    "lat": 28.6052,
    "lng": 77.2912,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mayur-vihar-pocket-1",
    "name": "Mayur Vihar Pocket-1",
    "nameHindi": "\u092e\u092f\u0942\u0930 \u0935\u093f\u0939\u093e\u0930 \u092a\u0949\u0915\u0947\u091f-1",
    "lineIds": [
      "blue",
      "pink"
    ],
    "lines": [
      "Blue Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Pink Line"
    ],
    "lat": 28.5995,
    "lng": 77.2985,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mayur-vihar-phase-1-ext",
    "name": "Mayur Vihar Phase-1 Ext",
    "nameHindi": "\u092e\u092f\u0942\u0930 \u0935\u093f\u0939\u093e\u0930 \u092b\u0947\u091c-1 \u090f\u0915\u094d\u0938\u091f\u0947\u0902\u0936\u0928",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5952,
    "lng": 77.3065,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "new-ashok-nagar",
    "name": "New Ashok Nagar",
    "nameHindi": "\u0928\u094d\u092f\u0942 \u0905\u0936\u094b\u0915 \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5892,
    "lng": 77.3125,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-15",
    "name": "Noida Sector 15",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 15",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5842,
    "lng": 77.3185,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-16",
    "name": "Noida Sector 16",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 16",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5785,
    "lng": 77.3235,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-18",
    "name": "Noida Sector 18",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 18",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5712,
    "lng": 77.3275,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "botanical-garden",
    "name": "Botanical Garden Noida",
    "nameHindi": "\u092c\u0949\u091f\u0928\u093f\u0915\u0932 \u0917\u093e\u0930\u094d\u0921\u0928",
    "lineIds": [
      "blue",
      "magenta"
    ],
    "lines": [
      "Blue Line",
      "Magenta Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Magenta Line"
    ],
    "lat": 28.5641,
    "lng": 77.3341,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "golf-course",
    "name": "Golf Course Noida",
    "nameHindi": "\u0917\u094b\u0932\u094d\u092b \u0915\u094b\u0930\u094d\u0938",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5672,
    "lng": 77.3452,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-city-centre",
    "name": "Noida City Centre",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u093f\u091f\u0940 \u0938\u0947\u0902\u091f\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5742,
    "lng": 77.3565,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-34",
    "name": "Noida Sector 34",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 34",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5805,
    "lng": 77.3685,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-52",
    "name": "Noida Sector 52",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 52",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5892,
    "lng": 77.3795,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-61",
    "name": "Noida Sector 61",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 61",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5985,
    "lng": 77.3885,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-59",
    "name": "Noida Sector 59",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 59",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6075,
    "lng": 77.3985,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-sec-62",
    "name": "Noida Sector 62",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0938\u0947\u0915\u094d\u091f\u0930 62",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6185,
    "lng": 77.4085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "noida-electronic-city",
    "name": "Noida Electronic City",
    "nameHindi": "\u0928\u094b\u090f\u0921\u093e \u0907\u0932\u0947\u0915\u094d\u091f\u094d\u0930\u0949\u0928\u093f\u0915 \u0938\u093f\u091f\u0940",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6275,
    "lng": 77.4185,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "laxmi-nagar",
    "name": "Laxmi Nagar",
    "nameHindi": "\u0932\u0915\u094d\u0937\u094d\u092e\u0940 \u0928\u0917\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6305,
    "lng": 77.2775,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nirman-vihar",
    "name": "Nirman Vihar",
    "nameHindi": "\u0928\u093f\u0930\u094d\u092e\u093e\u0923 \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6365,
    "lng": 77.2865,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "preet-vihar",
    "name": "Preet Vihar",
    "nameHindi": "\u092a\u094d\u0930\u0940\u0924 \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6415,
    "lng": 77.2965,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "karkarduma",
    "name": "Karkarduma",
    "nameHindi": "\u0915\u0921\u093c\u0915\u0921\u093c\u0921\u0942\u092e\u093e",
    "lineIds": [
      "blue",
      "pink"
    ],
    "lines": [
      "Blue Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Pink Line"
    ],
    "lat": 28.6485,
    "lng": 77.3065,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "anand-vihar",
    "name": "Anand Vihar ISBT",
    "nameHindi": "\u0906\u0928\u0902\u0926 \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "blue",
      "pink"
    ],
    "lines": [
      "Blue Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Blue Line",
      "Pink Line"
    ],
    "lat": 28.6468,
    "lng": 77.3161,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kaushambi",
    "name": "Kaushambi",
    "nameHindi": "\u0915\u094c\u0936\u093e\u092e\u094d\u092c\u0940",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6455,
    "lng": 77.3245,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "vaishali",
    "name": "Vaishali",
    "nameHindi": "\u0935\u0948\u0936\u093e\u0932\u0940",
    "lineIds": [
      "blue"
    ],
    "lines": [
      "Blue Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6445,
    "lng": 77.3395,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "brigadier-hoshiar-singh",
    "name": "Brigadier Hoshiar Singh (Bahadurgarh)",
    "nameHindi": "\u092c\u094d\u0930\u093f\u0917\u0947\u0921\u093f\u092f\u0930 \u0939\u094b\u0936\u093f\u092f\u093e\u0930 \u0938\u093f\u0902\u0939",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6915,
    "lng": 76.9215,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "bahadurgarh-city",
    "name": "Bahadurgarh City",
    "nameHindi": "\u092c\u0939\u093e\u0926\u0941\u0930\u0917\u0922\u093c \u0938\u093f\u091f\u0940",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6885,
    "lng": 76.9385,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "pandit-shree-ram",
    "name": "Pandit Shree Ram Sharma",
    "nameHindi": "\u092a\u0902\u0921\u093f\u0924 \u0936\u094d\u0930\u0940 \u0930\u093e\u092e \u0936\u0930\u094d\u092e\u093e",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6845,
    "lng": 76.9555,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "tikri-border",
    "name": "Tikri Border",
    "nameHindi": "\u091f\u0940\u0915\u0930\u0940 \u092c\u0949\u0930\u094d\u0921\u0930",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6815,
    "lng": 76.9745,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "tikri-kalan",
    "name": "Tikri Kalan",
    "nameHindi": "\u091f\u0940\u0915\u0930\u0940 \u0915\u0932\u093e\u0902",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6795,
    "lng": 76.9895,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "ghevra",
    "name": "Ghevra Metro Station",
    "nameHindi": "\u0918\u0947\u0935\u0930\u093e",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0095,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mundka-industrial-area",
    "name": "Mundka Industrial Area",
    "nameHindi": "\u092e\u0941\u0902\u0921\u0915\u093e \u0907\u0902\u0921\u0938\u094d\u091f\u094d\u0930\u093f\u092f\u0932 \u090f\u0930\u093f\u092f\u093e",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0255,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mundka",
    "name": "Mundka",
    "nameHindi": "\u092e\u0941\u0902\u0921\u0915\u093e",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0395,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rajdhani-park",
    "name": "Rajdhani Park",
    "nameHindi": "\u0930\u093e\u091c\u0927\u093e\u0928\u0940 \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0545,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nangloi-rly-station",
    "name": "Nangloi Railway Station",
    "nameHindi": "\u0928\u093e\u0902\u0917\u0932\u094b\u0908 \u0930\u0947\u0932\u0935\u0947 \u0938\u094d\u091f\u0947\u0936\u0928",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0655,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nangloi",
    "name": "Nangloi",
    "nameHindi": "\u0928\u093e\u0902\u0917\u0932\u094b\u0908",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0755,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "surajmal-stadium",
    "name": "Surajmal Stadium",
    "nameHindi": "\u0938\u0942\u0930\u091c\u092e\u0932 \u0938\u094d\u091f\u0947\u0921\u093f\u092f\u092e",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0855,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "udyog-nagar",
    "name": "Udyog Nagar",
    "nameHindi": "\u0909\u0926\u094d\u092f\u094b\u0917 \u0928\u0917\u0930",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.0955,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "peera-garhi",
    "name": "Peera Garhi",
    "nameHindi": "\u092a\u0940\u0930\u093e \u0917\u0922\u093c\u0940",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6785,
    "lng": 77.1085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "paschim-vihar-west",
    "name": "Paschim Vihar West",
    "nameHindi": "\u092a\u0936\u094d\u091a\u093f\u092e \u0935\u093f\u0939\u093e\u0930 \u092a\u0936\u094d\u091a\u093f\u092e",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6775,
    "lng": 77.1185,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "paschim-vihar-east",
    "name": "Paschim Vihar East",
    "nameHindi": "\u092a\u0936\u094d\u091a\u093f\u092e \u0935\u093f\u0939\u093e\u0930 \u092a\u0942\u0930\u094d\u0935",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6765,
    "lng": 77.1275,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "madipur",
    "name": "Madipur",
    "nameHindi": "\u092e\u093e\u0926\u0940\u092a\u0941\u0930",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6745,
    "lng": 77.1355,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shivaji-park",
    "name": "Shivaji Park",
    "nameHindi": "\u0936\u093f\u0935\u093e\u091c\u0940 \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6725,
    "lng": 77.1425,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "punjabi-bagh",
    "name": "Punjabi Bagh",
    "nameHindi": "\u092a\u0902\u091c\u093e\u092c\u0940 \u092c\u093e\u0917",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6715,
    "lng": 77.1515,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "ashok-park-main",
    "name": "Ashok Park Main",
    "nameHindi": "\u0905\u0936\u094b\u0915 \u092a\u093e\u0930\u094d\u0915 \u092e\u0947\u0928",
    "lineIds": [
      "green"
    ],
    "lines": [
      "Green Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6725,
    "lng": 77.1615,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "lal-quila",
    "name": "Lal Quila",
    "nameHindi": "\u0932\u093e\u0932 \u0915\u093f\u0932\u093e",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6575,
    "lng": 77.2372,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jama-masjid",
    "name": "Jama Masjid",
    "nameHindi": "\u091c\u093e\u092e\u093e \u092e\u0938\u094d\u091c\u093f\u0926",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6505,
    "lng": 77.2375,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "delhi-gate",
    "name": "Delhi Gate",
    "nameHindi": "\u0926\u093f\u0932\u094d\u0932\u0940 \u0917\u0947\u091f",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6412,
    "lng": 77.2405,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "ito",
    "name": "ITO",
    "nameHindi": "\u0906\u0908\u091f\u0940\u0913",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6305,
    "lng": 77.2405,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "janpath",
    "name": "Janpath",
    "nameHindi": "\u091c\u0928\u092a\u0925",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6245,
    "lng": 77.2185,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "khan-market",
    "name": "Khan Market",
    "nameHindi": "\u0916\u093e\u0928 \u092e\u093e\u0930\u094d\u0915\u0947\u091f",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6015,
    "lng": 77.2275,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jln-stadium",
    "name": "Jawaharlal Nehru Stadium",
    "nameHindi": "\u091c\u0935\u093e\u0939\u0930\u0932\u093e\u0932 \u0928\u0947\u0939\u0930\u0942 \u0938\u094d\u091f\u0947\u0921\u093f\u092f\u092e",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5895,
    "lng": 77.2355,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jangpura",
    "name": "Jangpura",
    "nameHindi": "\u091c\u0902\u0917\u092a\u0941\u0930\u093e",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5815,
    "lng": 77.2415,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "lajpat-nagar",
    "name": "Lajpat Nagar",
    "nameHindi": "\u0932\u093e\u091c\u092a\u0924 \u0928\u0917\u0930",
    "lineIds": [
      "violet",
      "pink"
    ],
    "lines": [
      "Violet Line",
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Violet Line",
      "Pink Line"
    ],
    "lat": 28.5707,
    "lng": 77.2374,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "moolchand",
    "name": "Moolchand",
    "nameHindi": "\u092e\u0942\u0932\u091a\u0902\u0926",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5645,
    "lng": 77.2355,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kailash-colony",
    "name": "Kailash Colony",
    "nameHindi": "\u0915\u0948\u0932\u093e\u0936 \u0915\u0949\u0932\u094b\u0928\u0940",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5555,
    "lng": 77.2415,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nehru-place",
    "name": "Nehru Place",
    "nameHindi": "\u0928\u0947\u0939\u0930\u0942 \u092a\u094d\u0932\u0947\u0938",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5495,
    "lng": 77.2515,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kalkaji-mandir",
    "name": "Kalkaji Mandir",
    "nameHindi": "\u0915\u093e\u0932\u0915\u093e\u091c\u0940 \u092e\u0902\u0926\u093f\u0930",
    "lineIds": [
      "violet",
      "magenta"
    ],
    "lines": [
      "Violet Line",
      "Magenta Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "Violet Line",
      "Magenta Line"
    ],
    "lat": 28.5499,
    "lng": 77.2588,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "govind-puri",
    "name": "Govind Puri",
    "nameHindi": "\u0917\u094b\u0935\u093f\u0902\u0926 \u092a\u0941\u0930\u0940",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5395,
    "lng": 77.2645,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "harkesh-nagar-okhla",
    "name": "Harkesh Nagar Okhla",
    "nameHindi": "\u0939\u0930\u0915\u0947\u0936 \u0928\u0917\u0930 \u0913\u0916\u0932\u093e",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5315,
    "lng": 77.2725,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jasola-apollo",
    "name": "Jasola Apollo",
    "nameHindi": "\u091c\u0938\u094b\u0932\u093e \u0905\u092a\u094b\u0932\u094b",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5285,
    "lng": 77.2845,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sarita-vihar",
    "name": "Sarita Vihar",
    "nameHindi": "\u0938\u0930\u093f\u0924\u093e \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5185,
    "lng": 77.2925,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mohan-estate",
    "name": "Mohan Estate",
    "nameHindi": "\u092e\u094b\u0939\u0928 \u090f\u0938\u094d\u091f\u0947\u091f",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5085,
    "lng": 77.3015,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "tughlakabad",
    "name": "Tughlakabad Station",
    "nameHindi": "\u0924\u0941\u0917\u0932\u0915\u093e\u092c\u093e\u0926 \u0938\u094d\u091f\u0947\u0936\u0928",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5005,
    "lng": 77.3085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "badarpur-border",
    "name": "Badarpur Border",
    "nameHindi": "\u092c\u0926\u0930\u092a\u0941\u0930 \u092c\u0949\u0930\u094d\u0921\u0930",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4915,
    "lng": 77.3095,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sarai",
    "name": "Sarai",
    "nameHindi": "\u0938\u0930\u093e\u092f",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4795,
    "lng": 77.3115,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nhpc-chowk",
    "name": "NHPC Chowk",
    "nameHindi": "\u090f\u0928\u090f\u091a\u092a\u0940\u0938\u0940 \u091a\u094c\u0915",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4685,
    "lng": 77.3135,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mewala-maharajpur",
    "name": "Mewala Maharajpur",
    "nameHindi": "\u092e\u0947\u0935\u0932\u093e \u092e\u0939\u093e\u0930\u093e\u091c\u092a\u0941\u0930",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4555,
    "lng": 77.3155,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sector-28-faridabad",
    "name": "Sector 28 Faridabad",
    "nameHindi": "\u0938\u0947\u0915\u094d\u091f\u0930 28",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4415,
    "lng": 77.3165,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "badkal-mor",
    "name": "Badkal Mor",
    "nameHindi": "\u092c\u0921\u093c\u0915\u0932 \u092e\u094b\u0921\u093c",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4285,
    "lng": 77.3175,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "old-faridabad",
    "name": "Old Faridabad",
    "nameHindi": "\u0913\u0932\u094d\u0921 \u092b\u0930\u0940\u0926\u093e\u092c\u093e\u0926",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4135,
    "lng": 77.3175,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "neelam-chowk-ajronda",
    "name": "Neelam Chowk Ajronda",
    "nameHindi": "\u0928\u0940\u0932\u092e \u091a\u094c\u0915 \u0905\u091c\u0930\u094c\u0902\u0926\u093e",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.3985,
    "lng": 77.3165,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "bata-chowk",
    "name": "Bata Chowk",
    "nameHindi": "\u092c\u093e\u091f\u093e \u091a\u094c\u0915",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.3845,
    "lng": 77.3155,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "escorts-mujesar",
    "name": "Escorts Mujesar",
    "nameHindi": "\u090f\u0938\u094d\u0915\u0949\u0930\u094d\u091f\u094d\u0938 \u092e\u0941\u091c\u0947\u0938\u0930",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.3715,
    "lng": 77.3145,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sant-surdas-sihi",
    "name": "Sant Surdas (Sihi)",
    "nameHindi": "\u0938\u0902\u0924 \u0938\u0942\u0930\u0926\u093e\u0938 (\u0938\u0940\u0939\u0940)",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.3585,
    "lng": 77.3205,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "raja-nahar-singh",
    "name": "Raja Nahar Singh (Ballabhgarh)",
    "nameHindi": "\u0930\u093e\u091c\u093e \u0928\u093e\u0939\u0930 \u0938\u093f\u0902\u0939",
    "lineIds": [
      "violet"
    ],
    "lines": [
      "Violet Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.3425,
    "lng": 77.3255,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "majlis-park",
    "name": "Majlis Park",
    "nameHindi": "\u092e\u091c\u0932\u093f\u0938 \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7185,
    "lng": 77.1775,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shalimar-bagh",
    "name": "Shalimar Bagh",
    "nameHindi": "\u0936\u093e\u0932\u0940\u092e\u093e\u0930 \u092c\u093e\u0917",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7015,
    "lng": 77.1685,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shakurpur",
    "name": "Shakurpur",
    "nameHindi": "\u0936\u0915\u0942\u0930\u092a\u0941\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6875,
    "lng": 77.1425,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "punjabi-bagh-west",
    "name": "Punjabi Bagh West",
    "nameHindi": "\u092a\u0902\u091c\u093e\u092c\u0940 \u092c\u093e\u0917 \u092a\u0936\u094d\u091a\u093f\u092e",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "pink",
      "green"
    ],
    "lat": 28.6715,
    "lng": 77.1355,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "esi-basaidarapur",
    "name": "ESI-Basaidarapur",
    "nameHindi": "\u0908\u090f\u0938\u0906\u0908 \u092c\u0938\u0908\u0926\u093e\u0930\u093e\u092a\u0941\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6605,
    "lng": 77.1275,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "maya-puri",
    "name": "Maya Puri",
    "nameHindi": "\u092e\u093e\u092f\u093e \u092a\u0941\u0930\u0940",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6365,
    "lng": 77.1275,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "naraina-vihar",
    "name": "Naraina Vihar",
    "nameHindi": "\u0928\u093e\u0930\u093e\u092f\u0923\u093e \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6255,
    "lng": 77.1365,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "delhi-cantt",
    "name": "Delhi Cantt",
    "nameHindi": "\u0926\u093f\u0932\u094d\u0932\u0940 \u0915\u0948\u0902\u091f",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6015,
    "lng": 77.1495,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "durgabai-deshmukh",
    "name": "Durgabai Deshmukh South Campus",
    "nameHindi": "\u0926\u0941\u0930\u094d\u0917\u093e\u092c\u093e\u0908 \u0926\u0947\u0936\u092e\u0941\u0916 \u0938\u093e\u0909\u0925 \u0915\u0948\u0902\u092a\u0938",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "pink",
      "airport"
    ],
    "lat": 28.5915,
    "lng": 77.1615,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sir-m-vishweshwaraiah",
    "name": "Sir M. Vishweshwaraiah Moti Bagh",
    "nameHindi": "\u092e\u094b\u0924\u0940 \u092c\u093e\u0917",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5845,
    "lng": 77.1715,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "bhikaji-cama-place",
    "name": "Bhikaji Cama Place",
    "nameHindi": "\u092d\u0940\u0915\u093e\u091c\u0940 \u0915\u093e\u092e\u093e \u092a\u094d\u0932\u0947\u0938",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5715,
    "lng": 77.1855,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sarojini-nagar",
    "name": "Sarojini Nagar",
    "nameHindi": "\u0938\u0930\u094b\u091c\u093f\u0928\u0940 \u0928\u0917\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5745,
    "lng": 77.1985,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "south-extension",
    "name": "South Extension",
    "nameHindi": "\u0938\u093e\u0909\u0925 \u090f\u0915\u094d\u0938\u091f\u0947\u0902\u0936\u0928",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5695,
    "lng": 77.2215,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "vinobapuri",
    "name": "Vinobapuri",
    "nameHindi": "\u0935\u093f\u0928\u094b\u092c\u093e\u092a\u0941\u0930\u0940",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5715,
    "lng": 77.2485,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "ashram",
    "name": "Ashram",
    "nameHindi": "\u0906\u0936\u094d\u0930\u092e",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5715,
    "lng": 77.2595,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sarai-kale-khan",
    "name": "Sarai Kale Khan - Nizamuddin",
    "nameHindi": "\u0938\u0930\u093e\u092f \u0915\u093e\u0932\u0947 \u0916\u093e\u0902",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5888,
    "lng": 77.2541,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "trilokpuri-sanjay-lake",
    "name": "Trilokpuri-Sanjay Lake",
    "nameHindi": "\u0924\u094d\u0930\u093f\u0932\u094b\u0915\u092a\u0941\u0930\u0940-\u0938\u0902\u091c\u092f \u091d\u0940\u0932",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6115,
    "lng": 77.3055,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "east-vinod-nagar",
    "name": "East Vinod Nagar-Mayur Vihar-II",
    "nameHindi": "\u0908\u0938\u094d\u091f \u0935\u093f\u0928\u094b\u0926 \u0928\u0917\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6215,
    "lng": 77.3085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "mandawali",
    "name": "Mandawali-West Vinod Nagar",
    "nameHindi": "\u092e\u0902\u0921\u093e\u0935\u0932\u0940",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6295,
    "lng": 77.3095,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "ip-extension",
    "name": "IP Extension",
    "nameHindi": "\u0906\u0908\u092a\u0940 \u090f\u0915\u094d\u0938\u091f\u0947\u0902\u0936\u0928",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6385,
    "lng": 77.3115,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "karkarduma-court",
    "name": "Karkarduma Court",
    "nameHindi": "\u0915\u0921\u093c\u0915\u0921\u093c\u0921\u0942\u092e\u093e \u0915\u094b\u0930\u094d\u091f",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6545,
    "lng": 77.2995,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "krishna-nagar",
    "name": "Krishna Nagar",
    "nameHindi": "\u0915\u0943\u0937\u094d\u0923\u093e \u0928\u0917\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6595,
    "lng": 77.2915,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "east-azad-nagar",
    "name": "East Azad Nagar",
    "nameHindi": "\u0908\u0938\u094d\u091f \u0906\u091c\u093e\u0926 \u0928\u0917\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6655,
    "lng": 77.2845,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jafrabad",
    "name": "Jafrabad",
    "nameHindi": "\u091c\u093e\u092b\u0930\u093e\u092c\u093e\u0926",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6815,
    "lng": 77.2735,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "maujpur-babarpur",
    "name": "Maujpur-Babarpur",
    "nameHindi": "\u092e\u094c\u091c\u092a\u0941\u0930-\u092c\u093e\u092c\u0930\u092a\u0941\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6895,
    "lng": 77.2705,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "gokulpuri",
    "name": "Gokulpuri",
    "nameHindi": "\u0917\u094b\u0915\u0932\u092a\u0941\u0930\u0940",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6985,
    "lng": 77.2685,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "johri-enclave",
    "name": "Johri Enclave",
    "nameHindi": "\u091c\u094c\u0939\u0930\u0940 \u090f\u0928\u094d\u0915\u094d\u0932\u0947\u0935",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7085,
    "lng": 77.2665,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shiv-vihar",
    "name": "Shiv Vihar",
    "nameHindi": "\u0936\u093f\u0935 \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "pink"
    ],
    "lines": [
      "Pink Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.7185,
    "lng": 77.2655,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dabri-mor",
    "name": "Dabri Mor - South Delhi",
    "nameHindi": "\u0921\u093e\u092c\u0930\u0940 \u092e\u094b\u0921\u093c",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6185,
    "lng": 77.0855,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dashrath-puri",
    "name": "Dashrath Puri",
    "nameHindi": "\u0926\u0936\u0930\u0925 \u092a\u0941\u0930\u0940",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6085,
    "lng": 77.0895,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "palam",
    "name": "Palam",
    "nameHindi": "\u092a\u093e\u0932\u092e",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5915,
    "lng": 77.0845,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sadar-bazar-cantt",
    "name": "Sadar Bazar Cantonment",
    "nameHindi": "\u0938\u0926\u0930 \u092c\u093e\u091c\u093e\u0930 \u0915\u0948\u0902\u091f",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5815,
    "lng": 77.1085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "igi-t1",
    "name": "Terminal 1 IGI Airport",
    "nameHindi": "\u091f\u0930\u094d\u092e\u093f\u0928\u0932 1 \u0906\u0908\u091c\u0940\u0906\u0908 \u090f\u092f\u0930\u092a\u094b\u0930\u094d\u091f",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5635,
    "lng": 77.1195,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shankar-vihar",
    "name": "Shankar Vihar",
    "nameHindi": "\u0936\u0902\u0915\u0930 \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5585,
    "lng": 77.1355,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "vasant-vihar",
    "name": "Vasant Vihar",
    "nameHindi": "\u0935\u0938\u0902\u0924 \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5615,
    "lng": 77.1575,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "munirka",
    "name": "Munirka",
    "nameHindi": "\u092e\u0941\u0928\u0940\u0930\u0915\u093e",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5585,
    "lng": 77.1735,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "rk-puram",
    "name": "RK Puram",
    "nameHindi": "\u0906\u0930\u0915\u0947 \u092a\u0941\u0930\u092e",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5545,
    "lng": 77.1855,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "iit-delhi",
    "name": "IIT Delhi",
    "nameHindi": "\u0906\u0908\u0906\u0908\u091f\u0940 \u0926\u093f\u0932\u094d\u0932\u0940",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5475,
    "lng": 77.1955,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "panchsheel-park",
    "name": "Panchsheel Park",
    "nameHindi": "\u092a\u0902\u091a\u0936\u0940\u0932 \u092a\u093e\u0930\u094d\u0915",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5425,
    "lng": 77.2185,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "chirag-delhi",
    "name": "Chirag Delhi",
    "nameHindi": "\u091a\u093f\u0930\u093e\u0917 \u0926\u093f\u0932\u094d\u0932\u0940",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5415,
    "lng": 77.2285,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "greater-kailash",
    "name": "Greater Kailash",
    "nameHindi": "\u0917\u094d\u0930\u0947\u091f\u0930 \u0915\u0948\u0932\u093e\u0936",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5425,
    "lng": 77.2395,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nehru-enclave",
    "name": "Nehru Enclave",
    "nameHindi": "\u0928\u0947\u0939\u0930\u0942 \u090f\u0928\u094d\u0915\u094d\u0932\u0947\u0935",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5465,
    "lng": 77.2485,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "okhla-nsic",
    "name": "Okhla NSIC",
    "nameHindi": "\u0913\u0916\u0932\u093e \u090f\u0928\u090f\u0938\u0906\u0908\u0938\u0940",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5515,
    "lng": 77.2685,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sukhdev-vihar",
    "name": "Sukhdev Vihar",
    "nameHindi": "\u0938\u0941\u0916\u0926\u0947\u0935 \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5575,
    "lng": 77.2795,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jamia-millia-islamia",
    "name": "Jamia Millia Islamia",
    "nameHindi": "\u091c\u093e\u092e\u093f\u092f\u093e \u092e\u093f\u0932\u094d\u0932\u093f\u092f\u093e \u0907\u0938\u094d\u0932\u093e\u092e\u093f\u092f\u093e",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5615,
    "lng": 77.2885,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "okhla-vihar",
    "name": "Okhla Vihar",
    "nameHindi": "\u0913\u0916\u0932\u093e \u0935\u093f\u0939\u093e\u0930",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5585,
    "lng": 77.2975,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "jasola-vihar",
    "name": "Jasola Vihar Shaheen Bagh",
    "nameHindi": "\u091c\u0938\u094b\u0932\u093e \u0935\u093f\u0939\u093e\u0930 \u0936\u093e\u0939\u0940\u0928 \u092c\u093e\u0917",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5515,
    "lng": 77.3055,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "kalindi-kunj",
    "name": "Kalindi Kunj",
    "nameHindi": "\u0915\u093e\u0932\u093f\u0902\u0926\u0940 \u0915\u0941\u0902\u091c",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5475,
    "lng": 77.3145,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "okhla-bird-sanctuary",
    "name": "Okhla Bird Sanctuary",
    "nameHindi": "\u0913\u0916\u0932\u093e \u092c\u0930\u094d\u0921 \u0938\u0947\u0902\u091a\u0941\u0930\u0940",
    "lineIds": [
      "magenta"
    ],
    "lines": [
      "Magenta Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5515,
    "lng": 77.3245,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "shivaji-stadium",
    "name": "Shivaji Stadium (CP)",
    "nameHindi": "\u0936\u093f\u0935\u093e\u091c\u0940 \u0938\u094d\u091f\u0947\u0921\u093f\u092f\u092e",
    "lineIds": [
      "airport"
    ],
    "lines": [
      "Airport Express"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6295,
    "lng": 77.2115,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dhaula-kuan",
    "name": "Dhaula Kuan",
    "nameHindi": "\u0927\u094c\u0932\u093e \u0915\u0941\u0906\u0901",
    "lineIds": [
      "airport"
    ],
    "lines": [
      "Airport Express"
    ],
    "isInterchange": true,
    "interchangeLines": [
      "airport",
      "pink"
    ],
    "lat": 28.5929,
    "lng": 77.1628,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "delhi-aerocity",
    "name": "Delhi Aerocity",
    "nameHindi": "\u0926\u093f\u0932\u094d\u0932\u0940 \u090f\u0930\u094b\u0938\u093f\u091f\u0940",
    "lineIds": [
      "airport"
    ],
    "lines": [
      "Airport Express"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5555,
    "lng": 77.1215,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "igi-t3",
    "name": "IGI Airport Terminal 3",
    "nameHindi": "\u0906\u0908\u091c\u0940\u0906\u0908 \u090f\u092f\u0930\u092a\u094b\u0930\u094d\u091f \u091f\u0930\u094d\u092e\u093f\u0928\u0932 3",
    "lineIds": [
      "airport"
    ],
    "lines": [
      "Airport Express"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5565,
    "lng": 77.0855,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "yashobhoomi-sec-25",
    "name": "Yashobhoomi Dwarka Sector 25",
    "nameHindi": "\u092f\u0936\u094b\u092d\u0942\u092e\u093f \u0926\u094d\u0935\u093e\u0930\u0915\u093e \u0938\u0947\u0915\u094d\u091f\u0930 25",
    "lineIds": [
      "airport"
    ],
    "lines": [
      "Airport Express"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5445,
    "lng": 77.0425,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "nangli",
    "name": "Nangli",
    "nameHindi": "\u0928\u093e\u0902\u0917\u0932\u0940",
    "lineIds": [
      "grey"
    ],
    "lines": [
      "Grey Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6165,
    "lng": 77.0055,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "najafgarh",
    "name": "Najafgarh",
    "nameHindi": "\u0928\u091c\u092b\u0917\u0922\u093c",
    "lineIds": [
      "grey"
    ],
    "lines": [
      "Grey Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6125,
    "lng": 76.9855,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "dhansa-bus-stand",
    "name": "Dhansa Bus Stand",
    "nameHindi": "\u0922\u093e\u0902\u0938\u093e \u092c\u0938 \u0938\u094d\u091f\u0948\u0902\u0921",
    "lineIds": [
      "grey"
    ],
    "lines": [
      "Grey Line"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.6045,
    "lng": 76.9695,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sector-55-56",
    "name": "Sector 55-56 Gurgaon",
    "nameHindi": "\u0938\u0947\u0915\u094d\u091f\u0930 55-56",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4235,
    "lng": 77.1085,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sector-54-chowk",
    "name": "Sector 54 Chowk",
    "nameHindi": "\u0938\u0947\u0915\u094d\u091f\u0930 54 \u091a\u094c\u0915",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4355,
    "lng": 77.1055,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sector-53-54",
    "name": "Sector 53-54",
    "nameHindi": "\u0938\u0947\u0915\u094d\u091f\u0930 53-54",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4485,
    "lng": 77.1025,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "sector-42-43",
    "name": "Sector 42-43",
    "nameHindi": "\u0938\u0947\u0915\u094d\u091f\u0930 42-43",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4595,
    "lng": 77.0985,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "phase-1",
    "name": "Phase 1 DLF",
    "nameHindi": "\u092b\u0947\u091c 1",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4715,
    "lng": 77.0955,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "phase-2",
    "name": "Phase 2 DLF",
    "nameHindi": "\u092b\u0947\u091c 2",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4905,
    "lng": 77.0915,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "belvedere-towers",
    "name": "Belvedere Towers",
    "nameHindi": "\u092c\u0947\u0932\u0935\u0947\u0921\u093f\u092f\u0930 \u091f\u093e\u0935\u0930\u094d\u0938",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4985,
    "lng": 77.0925,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "cyber-city",
    "name": "Cyber City",
    "nameHindi": "\u0938\u093e\u0907\u092c\u0930 \u0938\u093f\u091f\u0940",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5025,
    "lng": 77.0895,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "moulsari-avenue",
    "name": "Moulsari Avenue",
    "nameHindi": "\u092e\u094c\u0932\u0938\u093e\u0930\u0940 \u090f\u0935\u0947\u0928\u094d\u092f\u0942",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.5035,
    "lng": 77.0825,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  },
  {
    "id": "phase-3",
    "name": "Phase 3 DLF",
    "nameHindi": "\u092b\u0947\u091c 3",
    "lineIds": [
      "rapid_metro"
    ],
    "lines": [
      "Rapid Metro"
    ],
    "isInterchange": false,
    "interchangeLines": [],
    "lat": 28.4975,
    "lng": 77.0855,
    "firstTrain": "05:30 AM",
    "lastTrain": "11:30 PM",
    "facilities": [
      "Elevator",
      "Escalator",
      "Smart Card Gates",
      "CCTV",
      "Toilets"
    ]
  }
];

export const METRO_STATION_MAP: Record<string, MetroStation> = {};
DELHI_METRO_STATIONS.forEach((s) => {
  METRO_STATION_MAP[s.id] = s;
});

export const LINE_SEQUENCES: Record<string, string[]> = {
  "red": [
    "rithala",
    "rohini-west",
    "rohini-east",
    "pitampura",
    "kohat-enclave",
    "netaji-subhash-place",
    "keshav-puram",
    "kanhaiya-nagar",
    "inderlok",
    "shastri-nagar",
    "pratap-nagar",
    "pul-bangash",
    "tis-hazari",
    "kashmere-gate",
    "shastri-park",
    "seelampur",
    "welcome",
    "shahdara",
    "mansarovar-park",
    "jhilmil",
    "dilshad-garden",
    "shahid-nagar",
    "raj-bagh",
    "major-mohit-sharma",
    "shyam-park",
    "mohan-nagar",
    "arthala",
    "hindon-river",
    "shaheed-sthal"
  ],
  "yellow": [
    "samaypur-badli",
    "rohini-sec-18-19",
    "haiderpur-badli-mor",
    "jahangirpuri",
    "adarsh-nagar",
    "azadpur",
    "model-town",
    "gtb-nagar",
    "vishwavidyalaya",
    "vidhan-sabha",
    "civil-lines",
    "kashmere-gate",
    "chandni-chowk",
    "chawri-bazar",
    "new-delhi",
    "rajiv-chowk",
    "patel-chowk",
    "central-secretariat",
    "udyog-bhawan",
    "lok-kalyan-marg",
    "jor-bagh",
    "dilli-haat-ina",
    "aiims",
    "green-park",
    "hauz-khas",
    "malviya-nagar",
    "saket",
    "qutab-minar",
    "chhatarpur",
    "sultanpur",
    "ghitorni",
    "arjan-garh",
    "guru-dronacharya",
    "sikanderpur",
    "mg-road",
    "iffco-chowk",
    "millennium-city-centre"
  ],
  "blue": [
    "dwarka-sec-21",
    "dwarka-sec-8",
    "dwarka-sec-9",
    "dwarka-sec-10",
    "dwarka-sec-11",
    "dwarka-sec-12",
    "dwarka-sec-13",
    "dwarka-sec-14",
    "dwarka",
    "dwarka-mor",
    "nawada",
    "uttam-nagar-west",
    "uttam-nagar-east",
    "janakpuri-west",
    "janakpuri-east",
    "tilak-nagar",
    "subhash-nagar",
    "tagore-garden",
    "rajouri-garden",
    "ramesh-nagar",
    "moti-nagar",
    "kirti-nagar",
    "shadipur",
    "patel-nagar",
    "rajendra-place",
    "karol-bagh",
    "jhandewalan",
    "rk-ashram-marg",
    "rajiv-chowk",
    "barakhamba-road",
    "mandi-house",
    "supreme-court",
    "indraprastha",
    "yamuna-bank",
    "akshardham",
    "mayur-vihar-1",
    "mayur-vihar-pocket-1",
    "mayur-vihar-phase-1-ext",
    "new-ashok-nagar",
    "noida-sec-15",
    "noida-sec-16",
    "noida-sec-18",
    "botanical-garden",
    "golf-course",
    "noida-city-centre",
    "noida-sec-34",
    "noida-sec-52",
    "noida-sec-61",
    "noida-sec-59",
    "noida-sec-62",
    "noida-electronic-city"
  ],
  "blue_vaishali": [
    "yamuna-bank",
    "laxmi-nagar",
    "nirman-vihar",
    "preet-vihar",
    "karkarduma",
    "anand-vihar",
    "kaushambi",
    "vaishali"
  ],
  "green": [
    "brigadier-hoshiar-singh",
    "bahadurgarh-city",
    "pandit-shree-ram",
    "tikri-border",
    "tikri-kalan",
    "ghevra",
    "mundka-industrial-area",
    "mundka",
    "rajdhani-park",
    "nangloi-rly-station",
    "nangloi",
    "surajmal-stadium",
    "udyog-nagar",
    "peera-garhi",
    "paschim-vihar-west",
    "paschim-vihar-east",
    "madipur",
    "shivaji-park",
    "punjabi-bagh",
    "ashok-park-main",
    "inderlok"
  ],
  "violet": [
    "kashmere-gate",
    "lal-quila",
    "jama-masjid",
    "delhi-gate",
    "ito",
    "mandi-house",
    "janpath",
    "central-secretariat",
    "khan-market",
    "jln-stadium",
    "jangpura",
    "lajpat-nagar",
    "moolchand",
    "kailash-colony",
    "nehru-place",
    "kalkaji-mandir",
    "govind-puri",
    "harkesh-nagar-okhla",
    "jasola-apollo",
    "sarita-vihar",
    "mohan-estate",
    "tughlakabad",
    "badarpur-border",
    "sarai",
    "nhpc-chowk",
    "mewala-maharajpur",
    "sector-28-faridabad",
    "badkal-mor",
    "old-faridabad",
    "neelam-chowk-ajronda",
    "bata-chowk",
    "escorts-mujesar",
    "sant-surdas-sihi",
    "raja-nahar-singh"
  ],
  "pink": [
    "majlis-park",
    "azadpur",
    "shalimar-bagh",
    "netaji-subhash-place",
    "shakurpur",
    "punjabi-bagh-west",
    "esi-basaidarapur",
    "rajouri-garden",
    "maya-puri",
    "naraina-vihar",
    "delhi-cantt",
    "durgabai-deshmukh",
    "sir-m-vishweshwaraiah",
    "bhikaji-cama-place",
    "sarojini-nagar",
    "dilli-haat-ina",
    "south-extension",
    "lajpat-nagar",
    "vinobapuri",
    "ashram",
    "sarai-kale-khan",
    "mayur-vihar-1",
    "mayur-vihar-pocket-1",
    "trilokpuri-sanjay-lake",
    "east-vinod-nagar",
    "mandawali",
    "ip-extension",
    "anand-vihar",
    "karkarduma",
    "karkarduma-court",
    "krishna-nagar",
    "east-azad-nagar",
    "welcome",
    "jafrabad",
    "maujpur-babarpur",
    "gokulpuri",
    "johri-enclave",
    "shiv-vihar"
  ],
  "magenta": [
    "janakpuri-west",
    "dabri-mor",
    "dashrath-puri",
    "palam",
    "sadar-bazar-cantt",
    "igi-t1",
    "shankar-vihar",
    "vasant-vihar",
    "munirka",
    "rk-puram",
    "iit-delhi",
    "hauz-khas",
    "panchsheel-park",
    "chirag-delhi",
    "greater-kailash",
    "nehru-enclave",
    "kalkaji-mandir",
    "okhla-nsic",
    "sukhdev-vihar",
    "jamia-millia-islamia",
    "okhla-vihar",
    "jasola-vihar",
    "kalindi-kunj",
    "okhla-bird-sanctuary",
    "botanical-garden"
  ],
  "airport": [
    "new-delhi",
    "shivaji-stadium",
    "dhaula-kuan",
    "delhi-aerocity",
    "igi-t3",
    "dwarka-sec-21",
    "yashobhoomi-sec-25"
  ],
  "grey": [
    "dwarka",
    "nangli",
    "najafgarh",
    "dhansa-bus-stand"
  ],
  "rapid_metro": [
    "sector-55-56",
    "sector-54-chowk",
    "sector-53-54",
    "sector-42-43",
    "phase-1",
    "sikanderpur",
    "phase-2",
    "belvedere-towers",
    "cyber-city",
    "moulsari-avenue",
    "phase-3"
  ]
};

export const POPULAR_METRO_STATIONS = [
  { id: 'rajiv-chowk', name: 'Rajiv Chowk (Connaught Place)', lineText: 'Blue & Yellow Line', isInterchange: true },
  { id: 'dwarka-sec-21', name: 'Dwarka Sector 21', lineText: 'Blue Line & Airport Express', isInterchange: true },
  { id: 'new-delhi', name: 'New Delhi Railway Station', lineText: 'Yellow Line & Airport Express', isInterchange: true },
  { id: 'kashmere-gate', name: 'Kashmere Gate ISBT', lineText: 'Red, Yellow & Violet Line', isInterchange: true },
  { id: 'hauz-khas', name: 'Hauz Khas Junction', lineText: 'Yellow & Magenta Line', isInterchange: true },
  { id: 'anand-vihar', name: 'Anand Vihar ISBT', lineText: 'Blue & Pink Line', isInterchange: true },
  { id: 'central-secretariat', name: 'Central Secretariat', lineText: 'Yellow & Violet Line', isInterchange: true },
  { id: 'botanical-garden', name: 'Botanical Garden Noida', lineText: 'Blue & Magenta Line', isInterchange: true },
  { id: 'janakpuri-west', name: 'Janakpuri West', lineText: 'Blue & Magenta Line', isInterchange: true },
  { id: 'millennium-city-centre', name: 'Millennium City Centre (HUDA)', lineText: 'Yellow Line (Gurugram)', isInterchange: false },
  { id: 'noida-electronic-city', name: 'Noida Electronic City', lineText: 'Blue Line', isInterchange: false },
  { id: 'chandni-chowk', name: 'Chandni Chowk', lineText: 'Yellow Line (Old Delhi)', isInterchange: false }
];

export const METRO_LANDMARK_ALIASES: Record<string, string> = {
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
};

export function getMetroStation(query: string): MetroStation | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  if (METRO_LANDMARK_ALIASES[q] && METRO_STATION_MAP[METRO_LANDMARK_ALIASES[q]]) {
    return METRO_STATION_MAP[METRO_LANDMARK_ALIASES[q]];
  }
  if (METRO_STATION_MAP[q]) return METRO_STATION_MAP[q];
  const direct = DELHI_METRO_STATIONS.find((s) => s.id === q || s.name.toLowerCase() === q);
  if (direct) return direct;
  return DELHI_METRO_STATIONS.find((s) => s.name.toLowerCase().includes(q) || s.nameHindi.includes(q)) || null;
}

export function searchMetroStations(query: string, limit = 8): MetroStation[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const aliasTarget = METRO_LANDMARK_ALIASES[q];
  const results: MetroStation[] = [];
  if (aliasTarget && METRO_STATION_MAP[aliasTarget]) {
    results.push(METRO_STATION_MAP[aliasTarget]);
  }
  for (const s of DELHI_METRO_STATIONS) {
    if (results.some((r) => r.id === s.id)) continue;
    if (s.name.toLowerCase().startsWith(q) || s.id.startsWith(q)) {
      results.push(s);
    }
  }
  for (const s of DELHI_METRO_STATIONS) {
    if (results.length >= limit) break;
    if (results.some((r) => r.id === s.id)) continue;
    if (s.name.toLowerCase().includes(q) || s.nameHindi.includes(q) || s.lines.some((l) => l.toLowerCase().includes(q))) {
      results.push(s);
    }
  }
  return results.slice(0, limit);
}

// Helper: Calculate metro fare according to official DMRC fare slabs
export function calculateMetroFare(stationsCount: number, distanceKm: number): number {
  if (distanceKm <= 2 || stationsCount <= 2) return 10;
  if (distanceKm <= 5 || stationsCount <= 5) return 20;
  if (distanceKm <= 12 || stationsCount <= 10) return 30;
  if (distanceKm <= 21 || stationsCount <= 18) return 40;
  if (distanceKm <= 32 || stationsCount <= 26) return 50;
  return 60;
}

// Single route getter
export function calculateMetroRoute(fromIdOrName: string, toIdOrName: string): MetroRoutePlan | null {
  const routes = calculateAllMetroRoutes(fromIdOrName, toIdOrName);
  return routes.length > 0 ? routes[0] : null;
}

// Multi-path router: returns Direct, 1-interchange, and alternative routes
export function calculateAllMetroRoutes(fromIdOrName: string, toIdOrName: string): MetroRoutePlan[] {
  if (!fromIdOrName || !toIdOrName) return [];
  const fromStation = getMetroStation(fromIdOrName);
  const toStation = getMetroStation(toIdOrName);

  if (!fromStation || !toStation) return [];
  if (fromStation.id === toStation.id) {
    return [{
      id: `metro-${fromStation.id}-${toStation.id}`,
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
    }];
  }

  const plans: MetroRoutePlan[] = [];

  const origin = fromStation;
  const destination = toStation;

  function buildPlan(idSuffix: string, title: string, tag: string, legs: MetroRouteLeg[]): MetroRoutePlan {
    const allStations: MetroStation[] = [];
    legs.forEach((leg, lIdx) => {
      leg.stations.forEach((st, sIdx) => {
        if (lIdx > 0 && sIdx === 0) return;
        allStations.push(st);
      });
    });
    const totalStations = allStations.length;
    const distanceKm = parseFloat((totalStations * 1.25).toFixed(1));
    const durationMin = Math.round(totalStations * 2.1 + (legs.length - 1) * 4);
    const fareRupees = calculateMetroFare(totalStations, distanceKm);
    const coords: [number, number][] = allStations.map((s) => [s.lat, s.lng]);

    return {
      id: `metro-${origin.id}-${destination.id}-${idSuffix}`,
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
    };
  }

  // 1. Direct Lines
  for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {
    const i1 = seq.indexOf(fromStation.id);
    const i2 = seq.indexOf(toStation.id);
    if (i1 !== -1 && i2 !== -1) {
      const lineId = seqKey.split('_')[0];
      const lineObj = DELHI_METRO_LINES.find((l) => l.id === lineId) || DELHI_METRO_LINES[0];
      const stationIds = i1 < i2 ? seq.slice(i1, i2 + 1) : seq.slice(i2, i1 + 1).reverse();
      const stations = stationIds.map((id) => METRO_STATION_MAP[id]).filter(Boolean);

      const leg: MetroRouteLeg = {
        lineId: lineObj.id,
        lineName: lineObj.name,
        lineColor: lineObj.color,
        boardingStation: fromStation,
        destinationStation: toStation,
        direction: `Towards ${toStation.name}`,
        stations,
        stationsCount: stations.length
      };

      plans.push(buildPlan(`direct-${lineId}`, `${lineObj.name} Direct`, 'Direct Metro', [leg]));
    }
  }

  // 2. 1-Interchange Lines
  const lineKeys = Object.keys(LINE_SEQUENCES);
  for (const l1 of lineKeys) {
    const seq1 = LINE_SEQUENCES[l1];
    const i1 = seq1.indexOf(fromStation.id);
    if (i1 === -1) continue;

    for (const l2 of lineKeys) {
      if (l1 === l2) continue;
      const seq2 = LINE_SEQUENCES[l2];
      const i2 = seq2.indexOf(toStation.id);
      if (i2 === -1) continue;

      const transfers = seq1.filter((sId) => seq2.includes(sId));
      for (const xferId of transfers) {
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

        const leg1: MetroRouteLeg = {
          lineId: lineObj1.id,
          lineName: lineObj1.name,
          lineColor: lineObj1.color,
          boardingStation: fromStation,
          destinationStation: xferStation,
          direction: `Towards ${xferStation.name}`,
          stations: st1,
          stationsCount: st1.length,
          changeover: {
            atStation: xferStation,
            fromLine: lineObj1.name,
            toLine: lineObj2.name,
            walkingTimeMin: 4,
            platformNotice: `Change from ${lineObj1.name} to ${lineObj2.name} at ${xferStation.name}`
          }
        };

        const leg2: MetroRouteLeg = {
          lineId: lineObj2.id,
          lineName: lineObj2.name,
          lineColor: lineObj2.color,
          boardingStation: xferStation,
          destinationStation: toStation,
          direction: `Towards ${toStation.name}`,
          stations: st2,
          stationsCount: st2.length
        };

        const shortName1 = lineObj1.name.split(' ')[0];
        const shortName2 = lineObj2.name.split(' ')[0];
        plans.push(buildPlan(
          `xfer-${xferId}-${l1}-${l2}`,
          `Via ${xferStation.name} (${shortName1} ➔ ${shortName2})`,
          '1 Interchange',
          [leg1, leg2]
        ));
      }
    }
  }

  // 3. Fallback BFS for 2-interchanges if nothing found
  if (plans.length === 0) {
    interface QueueItem {
      stationId: string;
      lineId: string;
      path: { stationId: string; lineId: string }[];
      transfers: number;
    }

    const queue: QueueItem[] = [];
    const visited = new Map<string, number>();

    for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {
      if (seq.includes(fromStation.id)) {
        const lineId = seqKey.split('_')[0];
        queue.push({
          stationId: fromStation.id,
          lineId,
          path: [{ stationId: fromStation.id, lineId }],
          transfers: 0
        });
        visited.set(`${fromStation.id}_${lineId}`, 0);
      }
    }

    let bestPath: { stationId: string; lineId: string }[] | null = null;
    let minTransfersFound = 99;
    let minStopsFound = 999;

    while (queue.length > 0) {
      const { stationId, lineId, path, transfers } = queue.shift()!;
      if (transfers > minTransfersFound) continue;

      if (stationId === toStation.id) {
        if (transfers < minTransfersFound || (transfers === minTransfersFound && path.length < minStopsFound)) {
          minTransfersFound = transfers;
          minStopsFound = path.length;
          bestPath = path;
        }
        continue;
      }

      for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {
        if (seqKey.startsWith(lineId)) {
          const idx = seq.indexOf(stationId);
          if (idx !== -1) {
            for (const nIdx of [idx - 1, idx + 1]) {
              if (nIdx >= 0 && nIdx < seq.length) {
                const nxtId = seq[nIdx];
                const stateKey = `${nxtId}_${lineId}`;
                const prevTransfers = visited.get(stateKey);
                if (prevTransfers === undefined || transfers < prevTransfers) {
                  visited.set(stateKey, transfers);
                  queue.push({
                    stationId: nxtId,
                    lineId,
                    path: [...path, { stationId: nxtId, lineId }],
                    transfers
                  });
                }
              }
            }
          }
        }
      }

      const stObj = METRO_STATION_MAP[stationId];
      if (stObj && stObj.lineIds.length > 1) {
        for (const otherLineId of stObj.lineIds) {
          if (otherLineId !== lineId) {
            const nextTransfers = transfers + 1;
            const stateKey = `${stationId}_${otherLineId}`;
            const prevTransfers = visited.get(stateKey);
            if (prevTransfers === undefined || nextTransfers < prevTransfers) {
              visited.set(stateKey, nextTransfers);
              queue.push({
                stationId,
                lineId: otherLineId,
                path: [...path, { stationId, lineId: otherLineId }],
                transfers: nextTransfers
              });
            }
          }
        }
      }
    }

    if (bestPath) {
      const bfsLegs: MetroRouteLeg[] = [];
      let currentLegStations: MetroStation[] = [];
      let currentLegLine = bestPath[0].lineId;

      for (let i = 0; i < bestPath.length; i++) {
        const item = bestPath[i];
        const station = METRO_STATION_MAP[item.stationId];
        if (!station) continue;

        if (item.lineId !== currentLegLine && currentLegStations.length > 0) {
          const lineObj = DELHI_METRO_LINES.find((l) => l.id === currentLegLine) || DELHI_METRO_LINES[0];
          const nextLineObj = DELHI_METRO_LINES.find((l) => l.id === item.lineId) || DELHI_METRO_LINES[0];
          const transferStation = currentLegStations[currentLegStations.length - 1];

          bfsLegs.push({
            lineId: lineObj.id,
            lineName: lineObj.name,
            lineColor: lineObj.color,
            boardingStation: currentLegStations[0],
            destinationStation: transferStation,
            direction: `Towards ${transferStation.name}`,
            stations: [...currentLegStations],
            stationsCount: currentLegStations.length,
            changeover: {
              atStation: transferStation,
              fromLine: lineObj.name,
              toLine: nextLineObj.name,
              walkingTimeMin: 4,
              platformNotice: `Change from ${lineObj.name} to ${nextLineObj.name} at ${transferStation.name}`
            }
          });

          currentLegStations = [transferStation];
          currentLegLine = item.lineId;
        }

        if (currentLegStations.length === 0 || currentLegStations[currentLegStations.length - 1].id !== station.id) {
          currentLegStations.push(station);
        }
      }

      if (currentLegStations.length > 0) {
        const lineObj = DELHI_METRO_LINES.find((l) => l.id === currentLegLine) || DELHI_METRO_LINES[0];
        bfsLegs.push({
          lineId: lineObj.id,
          lineName: lineObj.name,
          lineColor: lineObj.color,
          boardingStation: currentLegStations[0],
          destinationStation: currentLegStations[currentLegStations.length - 1],
          direction: `Towards ${currentLegStations[currentLegStations.length - 1].name}`,
          stations: [...currentLegStations],
          stationsCount: currentLegStations.length
        });
      }

      plans.push(buildPlan('bfs', 'Optimal Metro Route', `${bfsLegs.length - 1} Interchanges`, bfsLegs));
    }
  }

  // Sort: fewer interchanges first, then shorter travel time
  plans.sort((a, b) => {
    if (a.interchangesCount !== b.interchangesCount) {
      return a.interchangesCount - b.interchangesCount;
    }
    return a.durationMin - b.durationMin;
  });

  // Keep up to 3 distinct routes (different transfer points or lines)
  const uniquePlans: MetroRoutePlan[] = [];
  const seenSignatures = new Set<string>();

  for (const p of plans) {
    const sig = p.legs.map((l) => `${l.lineId}_${l.boardingStation.id}_${l.destinationStation.id}`).join('|');
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      uniquePlans.push(p);
      if (uniquePlans.length >= 3) break;
    }
  }

  if (uniquePlans.length > 0) {
    uniquePlans[0].isFastest = true;
    if (uniquePlans[0].interchangesCount === 0) {
      uniquePlans[0].isDirect = true;
    }
  }

  return uniquePlans;
}
