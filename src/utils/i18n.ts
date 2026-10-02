export type Language = 'en' | 'hi';

export interface Translations {
  appName: string;
  appTagline: string;
  heading: string;
  subheading: string;
  
  // Navigation
  navHome: string;
  navRoutes: string;
  navStops: string;
  navMetro: string;
  navJourney: string;
  navAlerts: string;
  navFavorites: string;
  navAdmin: string;
  navMore: string;

  // Search
  searchPlaceholder: string;
  searchBtn: string;
  searchModeAll: string;
  searchModeBus: string;
  searchModeStop: string;
  searchModeMetro: string;
  searchModeJourney: string;
  useMyLocation: string;
  myLocationActive: string;
  recentSearches: string;
  clearHistory: string;
  popularRoutes: string;
  popularStops: string;
  popularTrips: string;
  popularMetro: string;
  trendingBuses: string;
  quickPlanner: string;

  // Bus Details
  busNumber: string;
  operator: string;
  dtcBus: string;
  clusterBus: string;
  routeDirection: string;
  directionUp: string;
  directionDown: string;
  origin: string;
  destination: string;
  totalStops: string;
  estDuration: string;
  stopsList: string;
  startPoint: string;
  intermediateStop: string;
  finalDest: string;
  viewReturnJourney: string;
  timetable: string;
  firstBus: string;
  lastBus: string;
  operatingDays: string;
  allDays: string;
  scheduledTime: string;
  liveEstimated: string;
  metroConnections: string;
  liveStatus: string;
  liveTrackingAvailable: string;
  liveTrackingUnavailable: string;
  liveUpdatedAgo: string;

  // Stop Details
  stopDetails: string;
  stopId: string;
  busesServing: string;
  upcomingArrivals: string;
  nearbyStops: string;
  nearbyMetro: string;
  walkingDistance: string;
  connectedRoutes: string;
  reportIncorrect: string;
  reportSubmitted: string;

  // Journey Planner
  planJourney: string;
  from: string;
  to: string;
  swapStops: string;
  findBuses: string;
  directRoutes: string;
  connectingRoutes: string;
  changeHere: string;
  changeoverStop: string;
  bus1: string;
  bus2: string;
  approxTotalDuration: string;
  approxFare: string;
  transfers: string;
  direct: string;
  oneTransfer: string;

  // Metro
  metroTitle: string;
  metroSubtitle: string;
  metroLines: string;
  metroStations: string;
  interchange: string;
  stationDetails: string;
  viewConnectingBuses: string;
  metroToBus: string;
  busToMetro: string;

  // Filters & Sorting
  filterBy: string;
  allOperators: string;
  sortBy: string;
  fastest: string;
  fewestStops: string;
  directFirst: string;
  routeNumberSort: string;

  // Actions
  favourite: string;
  removeFavourite: string;
  share: string;
  copiedLink: string;
  shareWhatsApp: string;
  viewRoute: string;
  viewStop: string;
  close: string;

  // Errors & Empty
  routeNotFound: string;
  stopNotFound: string;
  noDirectBus: string;
  noConnectingRoute: string;
  emptySearch: string;
  locationDenied: string;
  apiNotice: string;
  noAlerts: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Delhi Yatra',
    appTagline: 'Delhi Bus & Metro Route Finder',
    heading: 'Delhi Bus & Metro Route Finder',
    subheading: 'Official DTC & Cluster bus routes, live GPS tracking, timetables, and Delhi Metro multi-modal planner.',
    
    navHome: 'Home',
    navRoutes: 'Bus Routes',
    navStops: 'Bus Stops',
    navMetro: 'Delhi Metro',
    navJourney: 'Journey Planner',
    navAlerts: 'Service Alerts',
    navFavorites: 'Favourites',
    navAdmin: 'Admin',
    navMore: 'More',

    searchPlaceholder: 'Search bus number (e.g. 623, 534), stop name, or metro station...',
    searchBtn: 'Search',
    searchModeAll: 'All',
    searchModeBus: 'Bus Number',
    searchModeStop: 'Bus Stop',
    searchModeMetro: 'Metro Station',
    searchModeJourney: 'From → To',
    useMyLocation: 'Use My Location',
    myLocationActive: 'Current GPS Location Active',
    recentSearches: 'Recent Searches',
    clearHistory: 'Clear History',
    popularRoutes: 'Popular Bus Routes',
    popularStops: 'Popular Bus Stops',
    popularTrips: 'Popular Trips',
    popularMetro: 'Popular Metro Stations',
    trendingBuses: 'Frequent Delhi Routes',
    quickPlanner: 'Plan Your Trip in Delhi NCR',

    busNumber: 'Bus Number',
    operator: 'Operator',
    dtcBus: 'DTC (Delhi Transport Corp)',
    clusterBus: 'Cluster / DIMTS Orange Fleet',
    routeDirection: 'Direction',
    directionUp: 'Outbound (UP)',
    directionDown: 'Return (DOWN)',
    origin: 'Starting Terminal',
    destination: 'Destination Terminal',
    totalStops: 'Total Stops',
    estDuration: 'Est. Journey Duration',
    stopsList: 'Complete Stop-by-Stop List',
    startPoint: 'Starting Point',
    intermediateStop: 'Intermediate Stop',
    finalDest: 'Final Destination',
    viewReturnJourney: 'View Return Journey',
    timetable: 'Schedule & Timetable',
    firstBus: 'First Bus',
    lastBus: 'Last Bus',
    operatingDays: 'Operating Days',
    allDays: 'All 7 Days (Mon - Sun)',
    scheduledTime: 'Scheduled Departure',
    liveEstimated: 'Live Telemetry ETA',
    metroConnections: 'Nearby Metro Connections',
    liveStatus: 'Live Tracking Status',
    liveTrackingAvailable: 'Live GPS Telemetry Active',
    liveTrackingUnavailable: 'Live tracking unavailable for this route. Scheduled timetable & stops active.',
    liveUpdatedAgo: 'Live data updated',

    stopDetails: 'Bus Stop Details',
    stopId: 'Stop ID',
    busesServing: 'Buses Stopping Here',
    upcomingArrivals: 'Upcoming Scheduled Departures',
    nearbyStops: 'Nearby Bus Stops',
    nearbyMetro: 'Nearby Metro Stations',
    walkingDistance: 'Walking Distance',
    connectedRoutes: 'Connected Bus Routes',
    reportIncorrect: 'Report Incorrect Info',
    reportSubmitted: 'Thank you for reporting. Our transit data team will verify.',

    planJourney: 'From → To Journey Planner',
    from: 'From (Origin Stop / Locality)',
    to: 'To (Destination Stop / Locality)',
    swapStops: 'Swap Origin and Destination',
    findBuses: 'Find Transport Options',
    directRoutes: 'Direct Bus Routes',
    connectingRoutes: 'Connecting Routes (1 Transfer)',
    changeHere: 'CHANGE HERE (Transfer Stop)',
    changeoverStop: 'Transfer Location',
    bus1: 'Bus 1',
    bus2: 'Bus 2',
    approxTotalDuration: 'Approx Total Duration',
    approxFare: 'Approx Fare',
    transfers: 'Transfers',
    direct: 'Direct Bus',
    oneTransfer: '1 Changeover',

    metroTitle: 'Delhi Metro Network & Interchanges',
    metroSubtitle: 'Interchange stations connecting DMRC lines and DTC arterial bus terminals.',
    metroLines: 'Metro Lines',
    metroStations: 'Metro Stations',
    interchange: 'Interchange Station',
    stationDetails: 'Station Details',
    viewConnectingBuses: 'Connecting Buses',
    metroToBus: 'Metro → Bus Connections',
    busToMetro: 'Bus → Metro Connections',

    filterBy: 'Filter By',
    allOperators: 'All Operators (DTC + Cluster)',
    sortBy: 'Sort By',
    fastest: 'Fastest by Duration',
    fewestStops: 'Fewest Stops',
    directFirst: 'Direct Routes First',
    routeNumberSort: 'Route Number (Numeric)',

    favourite: 'Save Favourite',
    removeFavourite: 'Remove Favourite',
    share: 'Share',
    copiedLink: 'Link copied to clipboard!',
    shareWhatsApp: 'Share on WhatsApp',
    viewRoute: 'View Complete Route',
    viewStop: 'View Bus Stop',
    close: 'Close',

    routeNotFound: 'Route not found in official DTC database',
    stopNotFound: 'Bus stop not found',
    noDirectBus: 'No direct bus found between these two stops.',
    noConnectingRoute: 'No single-transfer connecting routes found. Try nearby major terminals like Anand Vihar, Kashmere Gate, or Dhaula Kuan.',
    emptySearch: 'Please enter a bus number, stop name, or locality to search.',
    locationDenied: 'Location permission was denied. You can select your stop manually.',
    apiNotice: 'Delhi Open Transit Data (OTD) GTFS static routes and schedules are verified.',
    noAlerts: 'All DTC routes and Delhi Metro lines are operating normally.'
  },
  hi: {
    appName: 'दिल्ली यात्रा',
    appTagline: 'दिल्ली बस और मेट्रो रूट फाइंडर',
    heading: 'दिल्ली बस और मेट्रो रूट फाइंडर',
    subheading: 'आधिकारिक डीटीसी एवं क्लस्टर बस रूट, लाइव जीपीएस ट्रैकिंग, समय सारिणी और दिल्ली मेट्रो इंटरचेंज प्लानर।',

    navHome: 'होम',
    navRoutes: 'बस रूट्स',
    navStops: 'बस स्टॉप',
    navMetro: 'दिल्ली मेट्रो',
    navJourney: 'यात्रा प्लानर',
    navAlerts: 'सेवा अलर्ट',
    navFavorites: 'पसंदीदा',
    navAdmin: 'एडमिन',
    navMore: 'अधिक',

    searchPlaceholder: 'बस नंबर (जैसे 623, 534), स्टॉप नाम, या मेट्रो स्टेशन खोजें...',
    searchBtn: 'खोजें',
    searchModeAll: 'सभी',
    searchModeBus: 'बस नंबर',
    searchModeStop: 'बस स्टॉप',
    searchModeMetro: 'मेट्रो स्टेशन',
    searchModeJourney: 'यहाँ से → वहाँ तक',
    useMyLocation: 'मेरा स्थान उपयोग करें',
    myLocationActive: 'वर्तमान जीपीएस स्थान सक्रिय',
    recentSearches: 'हाल की खोजें',
    clearHistory: 'इतिहास साफ़ करें',
    popularRoutes: 'लोकप्रिय बस रूट्स',
    popularStops: 'लोकप्रिय बस स्टॉप',
    popularTrips: 'लोकप्रिय यात्राएं',
    popularMetro: 'लोकप्रिय मेट्रो स्टेशन',
    trendingBuses: 'दिल्ली की प्रमुख बसें',
    quickPlanner: 'दिल्ली एनसीआर में अपनी यात्रा प्लान करें',

    busNumber: 'बस नंबर',
    operator: 'ऑपरेटर',
    dtcBus: 'डीटीसी (दिल्ली परिवहन निगम)',
    clusterBus: 'क्लस्टर / डीआईएमटीएस ऑरेंज बस',
    routeDirection: 'दिशा',
    directionUp: 'जावक (UP)',
    directionDown: 'वापसी (DOWN)',
    origin: 'आरंभिक टर्मिनल',
    destination: 'गंतव्य टर्मिनल',
    totalStops: 'कुल स्टॉप्स',
    estDuration: 'अनुमानित यात्रा समय',
    stopsList: 'सभी स्टॉप्स की क्रमबद्ध सूची',
    startPoint: 'प्रारंभिक बिंदु',
    intermediateStop: 'मध्यवर्ती स्टॉप',
    finalDest: 'अंतिम गंतव्य',
    viewReturnJourney: 'वापसी यात्रा देखें',
    timetable: 'समय सारिणी',
    firstBus: 'पहली बस',
    lastBus: 'अंतिम बस',
    operatingDays: 'संचालन के दिन',
    allDays: 'सभी 7 दिन (सोम - रवि)',
    scheduledTime: 'निर्धारित प्रस्थान',
    liveEstimated: 'लाइव अनुमानित समय (ETA)',
    metroConnections: 'नजदीकी मेट्रो कनेक्शन',
    liveStatus: 'लाइव ट्रैकिंग स्थिति',
    liveTrackingAvailable: 'लाइव जीपीएस टेलीमेट्री सक्रिय',
    liveTrackingUnavailable: 'इस रूट पर लाइव ट्रैकिंग अनुपलब्ध है। निर्धारित समय सारिणी उपलब्ध है।',
    liveUpdatedAgo: 'लाइव डेटा अपडेट हुआ',

    stopDetails: 'बस स्टॉप विवरण',
    stopId: 'स्टॉप आईडी',
    busesServing: 'यहाँ रुकने वाली बसें',
    upcomingArrivals: 'आगामी निर्धारित प्रस्थान',
    nearbyStops: 'आस-पास के बस स्टॉप',
    nearbyMetro: 'आस-पास के मेट्रो स्टेशन',
    walkingDistance: 'पैदल दूरी',
    connectedRoutes: 'जुड़े हुए बस रूट्स',
    reportIncorrect: 'गलत जानकारी की रिपोर्ट करें',
    reportSubmitted: 'रिपोर्ट करने के लिए धन्यवाद। हमारी टीम इसकी पुष्टि करेगी।',

    planJourney: 'यहाँ से → वहाँ तक यात्रा प्लानर',
    from: 'कहाँ से (शुरुआती स्टॉप / इलाका)',
    to: 'कहाँ तक (गंतव्य स्टॉप / इलाका)',
    swapStops: 'शुरुआत और गंतव्य बदलें',
    findBuses: 'बस विकल्प खोजें',
    directRoutes: 'सीधी बस रूट्स',
    connectingRoutes: 'कनेक्टिंग रूट्स (1 बदलाव)',
    changeHere: 'यहाँ बस बदलें (ट्रांसफर स्टॉप)',
    changeoverStop: 'बदलाव का स्थान',
    bus1: 'बस 1',
    bus2: 'बस 2',
    approxTotalDuration: 'कुल अनुमानित समय',
    approxFare: 'अनुमानित किराया',
    transfers: 'बदलाव',
    direct: 'सीधी बस',
    oneTransfer: '1 ट्रांसफर',

    metroTitle: 'दिल्ली मेट्रो नेटवर्क और इंटरचेंज',
    metroSubtitle: 'डीएमआरसी मेट्रो लाइनों और डीटीसी बस टर्मिनलों को जोड़ने वाले इंटरचेंज स्टेशन।',
    metroLines: 'मेट्रो लाइनें',
    metroStations: 'मेट्रो स्टेशन',
    interchange: 'इंटरचेंज स्टेशन',
    stationDetails: 'स्टेशन विवरण',
    viewConnectingBuses: 'कनेक्टिंग बसें',
    metroToBus: 'मेट्रो → बस कनेक्शन',
    busToMetro: 'बस → मेट्रो कनेक्शन',

    filterBy: 'फ़िल्टर करें',
    allOperators: 'सभी ऑपरेटर (DTC + Cluster)',
    sortBy: 'क्रमबद्ध करें',
    fastest: 'सबसे तेज़ समय',
    fewestStops: 'न्यूनतम स्टॉप्स',
    directFirst: 'सीधी बसें पहले',
    routeNumberSort: 'बस नंबर अनुसार',

    favourite: 'पसंदीदा में जोड़ें',
    removeFavourite: 'पसंदीदा से हटाएं',
    share: 'शेयर करें',
    copiedLink: 'लिंक कॉपी हो गया!',
    shareWhatsApp: 'व्हाट्सएप पर शेयर करें',
    viewRoute: 'पूरा रूट देखें',
    viewStop: 'बस स्टॉप देखें',
    close: 'बंद करें',

    routeNotFound: 'आधिकारिक डीटीसी डेटाबेस में यह रूट नहीं मिला',
    stopNotFound: 'बस स्टॉप नहीं मिला',
    noDirectBus: 'इन दोनों स्टॉप्स के बीच कोई सीधी बस नहीं मिली।',
    noConnectingRoute: 'कोई सिंगल-ट्रांसफर कनेक्टिंग रूट नहीं मिला। कृपया नजदीकी टर्मिनल जैसे आनंद विहार, कश्मीरी गेट या धौला कुआँ चुनें।',
    emptySearch: 'कृपया खोजने के लिए बस नंबर, स्टॉप नाम या क्षेत्र दर्ज करें।',
    locationDenied: 'स्थान अनुमति अस्वीकार कर दी गई। आप अपना स्टॉप मैन्युअल रूप से चुन सकते हैं।',
    apiNotice: 'दिल्ली ओपन ट्रांजिट डेटा (OTD) GTFS स्टेटिक रूट्स और समय सारिणी सत्यापित हैं।',
    noAlerts: 'सभी डीटीसी बसें एवं मेट्रो लाइनें सामान्य रूप से संचालित हो रही हैं।'
  }
};
