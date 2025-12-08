/**
 * Geolocation utilities for distance calculation and delivery fee
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First location
 * @param point2 Second location
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate delivery fee based on distance
 * Pricing structure:
 * - 0-1 km: GHC 5 (base fee)
 * - 1-3 km: GHC 7
 * - 3-5 km: GHC 10
 * - 5+ km: GHC 10 + GHC 2 per additional km
 *
 * @param distanceInKm Distance in kilometers
 * @returns Delivery fee in GHC
 */
export function calculateDeliveryFee(distanceInKm: number): number {
  if (distanceInKm <= 1) {
    return 5;
  } else if (distanceInKm <= 3) {
    return 7;
  } else if (distanceInKm <= 5) {
    return 10;
  } else {
    // GHC 10 base + GHC 2 per additional km
    const additionalKm = distanceInKm - 5;
    return 10 + Math.ceil(additionalKm) * 2;
  }
}

/**
 * Convert GeoJSON Point to Location format
 */
export function geoJSONToLocation(geoJSON: GeoJSONPoint): Location {
  return {
    longitude: geoJSON.coordinates[0],
    latitude: geoJSON.coordinates[1],
  };
}

/**
 * Convert Location to GeoJSON Point format
 */
export function locationToGeoJSON(location: Location): GeoJSONPoint {
  return {
    type: 'Point',
    coordinates: [location.longitude, location.latitude],
  };
}

/**
 * Check if a location is within a radius of another location
 * @param center Center point
 * @param point Point to check
 * @param radiusKm Radius in kilometers
 * @returns True if point is within radius
 */
export function isWithinRadius(
  center: Location,
  point: Location,
  radiusKm: number,
): boolean {
  const distance = calculateDistance(center, point);
  return distance <= radiusKm;
}

/**
 * Find nearest location from a list of locations
 * @param origin Origin point
 * @param locations List of locations with IDs
 * @returns Nearest location with distance
 */
export function findNearest<T extends { location: Location; id: string }>(
  origin: Location,
  locations: T[],
): (T & { distance: number }) | null {
  if (locations.length === 0) return null;

  let nearest = locations[0];
  let minDistance = calculateDistance(origin, locations[0].location);

  for (let i = 1; i < locations.length; i++) {
    const distance = calculateDistance(origin, locations[i].location);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = locations[i];
    }
  }

  return { ...nearest, distance: minDistance };
}

/**
 * Sort locations by distance from origin
 * @param origin Origin point
 * @param locations List of locations
 * @returns Sorted locations with distances
 */
export function sortByDistance<T extends { location: Location }>(
  origin: Location,
  locations: T[],
): (T & { distance: number })[] {
  return locations
    .map((loc) => ({
      ...loc,
      distance: calculateDistance(origin, loc.location),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get Ghana campus coordinates (example: Ashesi University)
 * You can expand this with more campuses
 */
export const GHANA_CAMPUSES = {
  ASHESI: {
    name: 'Ashesi University',
    location: { latitude: 5.7597, longitude: -0.2270 },
  },
  LEGON: {
    name: 'University of Ghana, Legon',
    location: { latitude: 5.6515, longitude: -0.1870 },
  },
  KNUST: {
    name: 'KNUST',
    location: { latitude: 6.6745, longitude: -1.5716 },
  },
  UCC: {
    name: 'University of Cape Coast',
    location: { latitude: 5.1154, longitude: -1.2881 },
  },
  // Add more campuses as needed
};
