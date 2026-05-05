export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  hint?: string;
}

export const LOCATIONS: Location[] = [
  { id: '1', name: 'Eiffel Tower, Paris', lat: 48.8584, lng: 2.2945 },
  { id: '2', name: 'Statue of Liberty, NYC', lat: 40.6892, lng: -74.0445 },
  { id: '3', name: 'Colosseum, Rome', lat: 41.8902, lng: 12.4922 },
  { id: '4', name: 'Machu Picchu, Peru', lat: -13.1631, lng: -72.5450 },
  { id: '5', name: 'Taj Mahal, India', lat: 27.1751, lng: 78.0421 },
  { id: '6', name: 'Great Wall of China', lat: 40.4319, lng: 116.5704 },
  { id: '7', name: 'Christ the Redeemer, Brazil', lat: -22.9519, lng: -43.2105 },
  { id: '8', name: 'Pyramids of Giza, Egypt', lat: 29.9792, lng: 31.1342 },
  { id: '9', name: 'Sydney Opera House, Australia', lat: -33.8568, lng: 151.2153 },
  { id: '10', name: 'Santorini, Greece', lat: 36.4618, lng: 25.3753 },
  { id: '11', name: 'Times Square, NYC', lat: 40.7580, lng: -73.9855 },
  { id: '12', name: 'Golden Gate Bridge, SF', lat: 37.8199, lng: -122.4783 },
  { id: '13', name: 'Big Ben, London', lat: 51.5007, lng: -0.1246 },
  { id: '14', name: 'Burj Khalifa, Dubai', lat: 25.1972, lng: 55.2744 },
  { id: '15', name: 'Red Square, Moscow', lat: 55.7539, lng: 37.6208 },
  { id: '16', name: 'Grand Canyon, USA', lat: 36.0544, lng: -112.1401 },
  { id: '17', name: 'Mount Everest Base Camp', lat: 28.0026, lng: 86.8528 },
  { id: '18', name: 'Kyoto Fushimi Inari, Japan', lat: 34.9671, lng: 135.7727 },
  { id: '19', name: 'Brandenburg Gate, Berlin', lat: 52.5163, lng: 13.3777 },
  { id: '20', name: 'Table Mountain, Cape Town', lat: -33.9628, lng: 18.4098 },
];

export function getRandomLocation(): Location {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function calculateScore(distance: number): number {
  // Max score 5000 inside 0.5km, drops to 0 at 20000km
  if (distance < 0.1) return 5000;
  return Math.max(0, Math.round(5000 * Math.exp(-distance / 2000)));
}
