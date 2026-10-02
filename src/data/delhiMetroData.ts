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
  nearbyBusStops: { name: string; distanceM: number; walkingMin: number }[];
  connectingBusNumbers: string[];
  facilities: string[];
}

export const DELHI_METRO_LINES: MetroLine[] = [
  {
    id: 'red',
    name: 'Red Line (Line 1)',
    nameHindi: 'रेड लाइन (लाइन 1)',
    color: '#DC2626',
    textColor: '#FFFFFF',
    bgColor: 'bg-red-600',
    terminals: 'Rithala ⇄ Shaheed Sthal (New Bus Adda)',
    lengthKm: 34.7,
    totalStations: 29
  },
  {
    id: 'yellow',
    name: 'Yellow Line (Line 2)',
    nameHindi: 'येलो लाइन (लाइन 2)',
    color: '#EAB308',
    textColor: '#000000',
    bgColor: 'bg-yellow-500',
    terminals: 'Samaypur Badli ⇄ Millennium City Centre Gurugram',
    lengthKm: 49.3,
    totalStations: 37
  },
  {
    id: 'blue',
    name: 'Blue Line (Line 3 & 4)',
    nameHindi: 'ब्लू लाइन (लाइन 3 और 4)',
    color: '#2563EB',
    textColor: '#FFFFFF',
    bgColor: 'bg-blue-600',
    terminals: 'Dwarka Sector 21 ⇄ Noida Electronic City / Vaishali',
    lengthKm: 65.4,
    totalStations: 58
  },
  {
    id: 'green',
    name: 'Green Line (Line 5)',
    nameHindi: 'ग्रीन लाइन (लाइन 5)',
    color: '#16A34A',
    textColor: '#FFFFFF',
    bgColor: 'bg-green-600',
    terminals: 'Inderlok / Kirti Nagar ⇄ Brigadier Hoshiar Singh (Bahadurgarh)',
    lengthKm: 29.6,
    totalStations: 24
  },
  {
    id: 'violet',
    name: 'Violet Line (Line 6)',
    nameHindi: 'वायलेट लाइन (लाइन 6)',
    color: '#7C3AED',
    textColor: '#FFFFFF',
    bgColor: 'bg-purple-600',
    terminals: 'Kashmere Gate ⇄ Raja Nahar Singh (Ballabhgarh)',
    lengthKm: 46.6,
    totalStations: 34
  },
  {
    id: 'pink',
    name: 'Pink Line (Line 7)',
    nameHindi: 'पिंक लाइन (लाइन 7)',
    color: '#EC4899',
    textColor: '#FFFFFF',
    bgColor: 'bg-pink-500',
    terminals: 'Majlis Park ⇄ Shiv Vihar (Ring Road Orbital)',
    lengthKm: 59.0,
    totalStations: 38
  },
  {
    id: 'magenta',
    name: 'Magenta Line (Line 8)',
    nameHindi: 'मजेंटा लाइन (लाइन 8)',
    color: '#D946EF',
    textColor: '#FFFFFF',
    bgColor: 'bg-fuchsia-600',
    terminals: 'Janakpuri West ⇄ Botanical Garden (Via IGI T1)',
    lengthKm: 37.5,
    totalStations: 25
  },
  {
    id: 'airport',
    name: 'Airport Express (Orange Line)',
    nameHindi: 'एयरपोर्ट एक्सप्रेस (ऑरेंज लाइन)',
    color: '#EA580C',
    textColor: '#FFFFFF',
    bgColor: 'bg-orange-600',
    terminals: 'New Delhi Railway Station ⇄ Yashobhoomi Dwarka Sector 25',
    lengthKm: 22.7,
    totalStations: 7
  },
  {
    id: 'grey',
    name: 'Grey Line (Line 9)',
    nameHindi: 'ग्रे लाइन (लाइन 9)',
    color: '#64748B',
    textColor: '#FFFFFF',
    bgColor: 'bg-slate-500',
    terminals: 'Dwarka ⇄ Dhansa Bus Stand',
    lengthKm: 5.2,
    totalStations: 4
  }
];

export const DELHI_METRO_STATIONS: MetroStation[] = [
  {
    id: 'kashmere-gate',
    name: 'Kashmere Gate ISBT',
    nameHindi: 'कश्मीरी गेट आईएसबीटी',
    lineIds: ['red', 'yellow', 'violet'],
    lines: ['Red Line', 'Yellow Line', 'Violet Line'],
    isInterchange: true,
    interchangeLines: ['Red Line', 'Yellow Line', 'Violet Line'],
    lat: 28.6675,
    lng: 77.2285,
    firstTrain: '05:30 AM',
    lastTrain: '11:45 PM',
    nearbyBusStops: [
      { name: 'Kashmere Gate ISBT Terminal', distanceM: 80, walkingMin: 1 },
      { name: 'Mori Gate Terminal', distanceM: 250, walkingMin: 3 },
      { name: 'Guru Govind Singh University', distanceM: 350, walkingMin: 4 }
    ],
    connectingBusNumbers: ['108', '473', '901', 'TMS', '100', '104', '118', '125', '131'],
    facilities: ['Interchange', 'Elevator', 'Escalator', 'Parking', 'Feeding Room', 'Toilets', 'DTC ISBT Counter']
  },
  {
    id: 'rajiv-chowk',
    name: 'Rajiv Chowk (Connaught Place)',
    nameHindi: 'राजीव चौक (कनॉट प्लेस)',
    lineIds: ['blue', 'yellow'],
    lines: ['Blue Line', 'Yellow Line'],
    isInterchange: true,
    interchangeLines: ['Blue Line', 'Yellow Line'],
    lat: 28.6328,
    lng: 77.2197,
    firstTrain: '05:40 AM',
    lastTrain: '11:40 PM',
    nearbyBusStops: [
      { name: 'Shivaji Stadium Terminal', distanceM: 300, walkingMin: 4 },
      { name: 'Regal Cinema / CP Outer Circle', distanceM: 120, walkingMin: 2 },
      { name: 'Super Bazar / Scindia House', distanceM: 180, walkingMin: 2 }
    ],
    connectingBusNumbers: ['502', '620', '740', '990', '440', '522', '894', 'RL-77'],
    facilities: ['Interchange', 'Elevator', 'Escalator', 'ATM', 'Food Court', 'Wheelchair Access']
  },
  {
    id: 'anand-vihar',
    name: 'Anand Vihar ISBT',
    nameHindi: 'आनंद विहार आईएसबीटी',
    lineIds: ['blue', 'pink'],
    lines: ['Blue Line', 'Pink Line'],
    isInterchange: true,
    interchangeLines: ['Blue Line', 'Pink Line'],
    lat: 28.6468,
    lng: 77.3161,
    firstTrain: '05:45 AM',
    lastTrain: '11:30 PM',
    nearbyBusStops: [
      { name: 'Anand Vihar ISBT Terminal Bay', distanceM: 50, walkingMin: 1 },
      { name: 'Anand Vihar ISBT Main Road', distanceM: 150, walkingMin: 2 },
      { name: 'Maharajpur Check Post', distanceM: 400, walkingMin: 5 }
    ],
    connectingBusNumbers: ['740', '721', '543', '212', '623', '624', '165', '243', 'GL-22'],
    facilities: ['Interchange', 'Railway Station Walkway', 'ISBT Bus Hub', 'Elevator', 'Cloakroom']
  },
  {
    id: 'dhaula-kuan',
    name: 'Dhaula Kuan & South Campus',
    nameHindi: 'धौला कुआँ एवं साउथ कैंपस',
    lineIds: ['airport', 'pink'],
    lines: ['Airport Express', 'Pink Line (Durgabai Deshmukh)'],
    isInterchange: true,
    interchangeLines: ['Airport Express', 'Pink Line via Travelator'],
    lat: 28.5929,
    lng: 77.1628,
    firstTrain: '05:15 AM',
    lastTrain: '11:45 PM',
    nearbyBusStops: [
      { name: 'Dhaula Kuan Flyover Stop', distanceM: 90, walkingMin: 1 },
      { name: 'South Campus Metro Gate', distanceM: 120, walkingMin: 2 },
      { name: 'Satya Niketan Entrance', distanceM: 300, walkingMin: 4 }
    ],
    connectingBusNumbers: ['502', '529', '588A', '711', 'TMS', '724', '729', '764', '888'],
    facilities: ['Skywalk Travelator', 'Luggage Check-in', 'Elevator', 'Multi-Modal Hub']
  },
  {
    id: 'hauz-khas',
    name: 'Hauz Khas Junction',
    nameHindi: 'हौज खास जंक्शन',
    lineIds: ['yellow', 'magenta'],
    lines: ['Yellow Line', 'Magenta Line'],
    isInterchange: true,
    interchangeLines: ['Yellow Line', 'Magenta Line'],
    lat: 28.5432,
    lng: 77.2065,
    firstTrain: '05:35 AM',
    lastTrain: '11:35 PM',
    nearbyBusStops: [
      { name: 'Padmini Enclave / Hauz Khas', distanceM: 100, walkingMin: 1 },
      { name: 'IIT Gate Outer Ring Road', distanceM: 350, walkingMin: 4 }
    ],
    connectingBusNumbers: ['502', '511', '520', '448', '505', '507', '548'],
    facilities: ['Interchange', 'Deep Underground Station', 'Escalators', 'ATM']
  },
  {
    id: 'central-secretariat',
    name: 'Central Secretariat',
    nameHindi: 'केंद्रीय सचिवालय',
    lineIds: ['yellow', 'violet'],
    lines: ['Yellow Line', 'Violet Line'],
    isInterchange: true,
    interchangeLines: ['Yellow Line', 'Violet Line'],
    lat: 28.6144,
    lng: 77.2119,
    firstTrain: '05:40 AM',
    lastTrain: '11:40 PM',
    nearbyBusStops: [
      { name: 'Krishi Bhawan', distanceM: 150, walkingMin: 2 },
      { name: 'Rail Bhawan / Red Cross Road', distanceM: 200, walkingMin: 3 }
    ],
    connectingBusNumbers: ['522', '540', '620', '505', '548', '725', '990A'],
    facilities: ['Interchange', 'Government Offices Access', 'Elevators', 'Ramp']
  },
  {
    id: 'sarai-kale-khan',
    name: 'Sarai Kale Khan - Nizamuddin',
    nameHindi: 'सराय काले खां - निजामुद्दीन',
    lineIds: ['pink'],
    lines: ['Pink Line'],
    isInterchange: false,
    lat: 28.5888,
    lng: 77.2541,
    firstTrain: '05:50 AM',
    lastTrain: '11:20 PM',
    nearbyBusStops: [
      { name: 'Sarai Kale Khan ISBT Main Bay', distanceM: 60, walkingMin: 1 },
      { name: 'Hazrat Nizamuddin Railway Station Stop', distanceM: 220, walkingMin: 3 }
    ],
    connectingBusNumbers: ['405', '418', '543', 'TMS', '274', '311', '413', '429', '469'],
    facilities: ['ISBT Bus Terminal', 'RRTS / Namo Bharat Hub', 'Indian Railways Access']
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden Noida',
    nameHindi: 'बॉटनिकल गार्डन नोएडा',
    lineIds: ['blue', 'magenta'],
    lines: ['Blue Line', 'Magenta Line'],
    isInterchange: true,
    interchangeLines: ['Blue Line', 'Magenta Line'],
    lat: 28.5641,
    lng: 77.3341,
    firstTrain: '05:30 AM',
    lastTrain: '11:30 PM',
    nearbyBusStops: [
      { name: 'Botanical Garden Metro Bus Bay', distanceM: 50, walkingMin: 1 },
      { name: 'Noida Sector 37 Bus Stop', distanceM: 200, walkingMin: 3 }
    ],
    connectingBusNumbers: ['347', '392', '319', '323', '355', 'DTC Feeder'],
    facilities: ['Interchange', 'Large Bus Bay', 'Surface Parking', 'Food Outlets']
  },
  {
    id: 'janakpuri-west',
    name: 'Janakpuri West',
    nameHindi: 'जनकपुरी पश्चिम',
    lineIds: ['blue', 'magenta'],
    lines: ['Blue Line', 'Magenta Line'],
    isInterchange: true,
    interchangeLines: ['Blue Line', 'Magenta Line'],
    lat: 28.6293,
    lng: 77.0778,
    firstTrain: '05:40 AM',
    lastTrain: '11:40 PM',
    nearbyBusStops: [
      { name: 'Janakpuri District Centre', distanceM: 100, walkingMin: 1 },
      { name: 'Janakpuri A-1 Gate', distanceM: 200, walkingMin: 2 }
    ],
    connectingBusNumbers: ['728', '740', '810', '813', '817', '879', '883'],
    facilities: ['Longest Escalator', 'Interchange', 'District Centre Mall Walkway']
  },
  {
    id: 'lajpat-nagar',
    name: 'Lajpat Nagar',
    nameHindi: 'लाजपत नगर',
    lineIds: ['pink', 'violet'],
    lines: ['Pink Line', 'Violet Line'],
    isInterchange: true,
    interchangeLines: ['Pink Line', 'Violet Line'],
    lat: 28.5707,
    lng: 77.2374,
    firstTrain: '05:45 AM',
    lastTrain: '11:35 PM',
    nearbyBusStops: [
      { name: 'Lajpat Nagar Central Market Ring Road', distanceM: 80, walkingMin: 1 },
      { name: 'Gupta Market Bus Stop', distanceM: 250, walkingMin: 3 }
    ],
    connectingBusNumbers: ['419', '423', '543', '479', '507', '548', 'TMS'],
    facilities: ['Central Market Access', 'Interchange', 'Elevators']
  },
  {
    id: 'new-delhi',
    name: 'New Delhi Railway Station',
    nameHindi: 'नई दिल्ली रेलवे स्टेशन',
    lineIds: ['yellow', 'airport'],
    lines: ['Yellow Line', 'Airport Express'],
    isInterchange: true,
    interchangeLines: ['Yellow Line', 'Airport Express'],
    lat: 28.6431,
    lng: 77.2223,
    firstTrain: '05:00 AM',
    lastTrain: '11:55 PM',
    nearbyBusStops: [
      { name: 'Ajmeri Gate Terminal', distanceM: 100, walkingMin: 1 },
      { name: 'Pahar Ganj Police Station', distanceM: 350, walkingMin: 4 }
    ],
    connectingBusNumbers: ['120B', '205', '753', '901', 'RL-77', '181'],
    facilities: ['Direct Railway Concourse Skywalk', 'Airport Check-in Counter', '24/7 Security']
  },
  {
    id: 'ina-delhi-haat',
    name: 'Dilli Haat - INA',
    nameHindi: 'दिल्ली हाट - आईएनए',
    lineIds: ['yellow', 'pink'],
    lines: ['Yellow Line', 'Pink Line'],
    isInterchange: true,
    interchangeLines: ['Yellow Line', 'Pink Line'],
    lat: 28.5744,
    lng: 77.2100,
    firstTrain: '05:40 AM',
    lastTrain: '11:35 PM',
    nearbyBusStops: [
      { name: 'Dilli Haat INA Main Gate', distanceM: 70, walkingMin: 1 },
      { name: 'AIIMS Metro / Aurobindo Marg', distanceM: 300, walkingMin: 4 }
    ],
    connectingBusNumbers: ['502', '511', '543', '505', '544', '548'],
    facilities: ['Handicrafts Market Direct Entry', 'Interchange', 'Elevator']
  },
  {
    id: 'mandi-house',
    name: 'Mandi House',
    nameHindi: 'मंडी हाउस',
    lineIds: ['blue', 'violet'],
    lines: ['Blue Line', 'Violet Line'],
    isInterchange: true,
    interchangeLines: ['Blue Line', 'Violet Line'],
    lat: 28.6258,
    lng: 77.2344,
    firstTrain: '05:45 AM',
    lastTrain: '11:40 PM',
    nearbyBusStops: [
      { name: 'Mandi House Roundabout', distanceM: 80, walkingMin: 1 },
      { name: 'National School of Drama (NSD)', distanceM: 150, walkingMin: 2 }
    ],
    connectingBusNumbers: ['425', '433', '440', '501', '944', 'TMS'],
    facilities: ['Cultural Hub Access', 'Interchange', 'Elevator']
  },
  {
    id: 'uttam-nagar-west',
    name: 'Uttam Nagar West',
    nameHindi: 'उत्तम नगर पश्चिम',
    lineIds: ['blue'],
    lines: ['Blue Line'],
    isInterchange: false,
    lat: 28.6212,
    lng: 77.0563,
    firstTrain: '05:35 AM',
    lastTrain: '11:25 PM',
    nearbyBusStops: [
      { name: 'Uttam Nagar Terminal', distanceM: 120, walkingMin: 2 },
      { name: 'Uttam Nagar West Metro Pillar 680', distanceM: 50, walkingMin: 1 }
    ],
    connectingBusNumbers: ['740', '817', '828', '838', '840', '843', '859'],
    facilities: ['Terminal Bus Interchange', 'Elevator', 'Toilets']
  },
  {
    id: 'kalkaji-mandir',
    name: 'Kalkaji Mandir',
    nameHindi: 'कालकाजी मंदिर',
    lineIds: ['violet', 'magenta'],
    lines: ['Violet Line', 'Magenta Line'],
    isInterchange: true,
    interchangeLines: ['Violet Line', 'Magenta Line'],
    lat: 28.5499,
    lng: 77.2588,
    firstTrain: '05:40 AM',
    lastTrain: '11:35 PM',
    nearbyBusStops: [
      { name: 'Kalkaji Mandir Outer Ring Road', distanceM: 90, walkingMin: 1 },
      { name: 'Nehru Place Bus Terminal', distanceM: 400, walkingMin: 5 }
    ],
    connectingBusNumbers: ['425', '429', '511', '543', '724', '774'],
    facilities: ['Temple Access', 'Interchange', 'Elevators']
  },
  {
    id: 'netaji-subhash-place',
    name: 'Netaji Subhash Place (Pitampura)',
    nameHindi: 'नेताजी सुभाष प्लेस (पीतमपुरा)',
    lineIds: ['red', 'pink'],
    lines: ['Red Line', 'Pink Line'],
    isInterchange: true,
    interchangeLines: ['Red Line', 'Pink Line'],
    lat: 28.6946,
    lng: 77.1517,
    firstTrain: '05:35 AM',
    lastTrain: '11:40 PM',
    nearbyBusStops: [
      { name: 'Netaji Subhash Place Commercial Complex', distanceM: 80, walkingMin: 1 },
      { name: 'Wazirpur Depot', distanceM: 450, walkingMin: 6 }
    ],
    connectingBusNumbers: ['901', '971', '970', '883', '891', 'TMS'],
    facilities: ['Maxus Cinema / Food Hub Access', 'Interchange', 'Elevator']
  }
];
