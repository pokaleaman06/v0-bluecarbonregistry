import { CARBON_CONSTANTS } from '../constants';
import type { TreeMeasurement, Coordinate } from '../types';

/**
 * Calculate basal area from diameter at breast height (DBH)
 * @param dbh Diameter at breast height in cm
 * @returns Basal area in cm²
 */
export function calculateBasalArea(dbh: number): number {
  const radius = dbh / 2;
  return Math.PI * Math.pow(radius, 2);
}

/**
 * Calculate tree biomass using allometric equation for mangroves
 * @param dbh Diameter at breast height in cm
 * @param height Tree height in meters
 * @returns Above-ground biomass in kg
 */
export function calculateTreeBiomass(dbh: number, height: number): number {
  const { ALLOMETRIC_A, ALLOMETRIC_B, WOOD_DENSITY } = CARBON_CONSTANTS;
  
  // Convert DBH to meters
  const dbhM = dbh / 100;
  
  // Allometric equation: AGB = a * (DBH²H)^b * wood_density
  const biomass = ALLOMETRIC_A * Math.pow(Math.pow(dbhM, 2) * height, ALLOMETRIC_B) * WOOD_DENSITY;
  
  return biomass;
}

/**
 * Calculate carbon content from biomass
 * @param biomass Biomass in kg
 * @returns Carbon content in kg CO2 equivalent
 */
export function calculateCarbonFromBiomass(biomass: number): number {
  const { CARBON_FRACTION, CO2_TO_C_RATIO } = CARBON_CONSTANTS;
  
  // Carbon content = biomass * carbon_fraction * CO2_to_C_ratio
  return biomass * CARBON_FRACTION * CO2_TO_C_RATIO;
}

/**
 * Calculate total carbon sequestration for a set of tree measurements
 * @param measurements Array of tree measurements
 * @returns Total carbon sequestration in kg CO2
 */
export function calculateTotalCarbon(measurements: TreeMeasurement[]): number {
  return measurements.reduce((total, measurement) => {
    const biomass = calculateTreeBiomass(measurement.dbh, measurement.height);
    const carbon = calculateCarbonFromBiomass(biomass);
    return total + carbon;
  }, 0);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate polygon area using Shoelace formula
 * @param coordinates Array of coordinates forming a polygon
 * @returns Area in square meters
 */
export function calculatePolygonArea(coordinates: Coordinate[]): number {
  if (coordinates.length < 3) return 0;

  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i].longitude * coordinates[j].latitude;
    area -= coordinates[j].longitude * coordinates[i].latitude;
  }

  area = Math.abs(area) / 2;

  // Convert from degrees to square meters (approximate)
  const metersPerDegree = 111320; // at equator
  return area * Math.pow(metersPerDegree, 2);
}

/**
 * Convert square meters to hectares
 * @param squareMeters Area in square meters
 * @returns Area in hectares
 */
export function squareMetersToHectares(squareMeters: number): number {
  return squareMeters / 10000;
}

/**
 * Format number with appropriate units
 * @param value Number to format
 * @param unit Unit type
 * @returns Formatted string
 */
export function formatNumber(value: number, unit: 'area' | 'carbon' | 'distance'): string {
  switch (unit) {
    case 'area':
      if (value >= 10000) {
        return `${(value / 10000).toFixed(2)} ha`;
      }
      return `${value.toFixed(0)} m²`;
    
    case 'carbon':
      if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} t CO₂`;
      }
      return `${value.toFixed(2)} kg CO₂`;
    
    case 'distance':
      if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} km`;
      }
      return `${value.toFixed(0)} m`;
    
    default:
      return value.toString();
  }
}

/**
 * Validate GPS accuracy
 * @param accuracy GPS accuracy in meters
 * @returns Validation result
 */
export function validateGPSAccuracy(accuracy: number): {
  isValid: boolean;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  message: string;
} {
  if (accuracy <= 3) {
    return {
      isValid: true,
      level: 'excellent',
      message: 'Excellent GPS accuracy'
    };
  } else if (accuracy <= 5) {
    return {
      isValid: true,
      level: 'good',
      message: 'Good GPS accuracy'
    };
  } else if (accuracy <= 10) {
    return {
      isValid: true,
      level: 'fair',
      message: 'Fair GPS accuracy - consider retaking'
    };
  } else {
    return {
      isValid: false,
      level: 'poor',
      message: 'Poor GPS accuracy - please move to open area'
    };
  }
}

/**
 * Generate unique ID
 * @returns Unique identifier string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Retry function with exponential backoff
 * @param fn Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param baseDelay Base delay in milliseconds
 * @returns Promise that resolves with function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
