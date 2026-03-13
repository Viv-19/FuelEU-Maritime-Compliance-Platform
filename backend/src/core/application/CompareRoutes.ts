import { TARGET_INTENSITY } from './constants';

export interface CompareRoutesResult {
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

/**
 * Compares a route's GHG intensity against a baseline and the FuelEU target.
 * 
 * @param baselineIntensity - The baseline GHG intensity
 * @param comparisonIntensity - The comparing route's GHG intensity
 * @returns Result object containing the difference percentage and compliance status
 */
export function compareRoutes(
  baselineIntensity: number,
  comparisonIntensity: number
): CompareRoutesResult {
  const percentDiff = ((comparisonIntensity / baselineIntensity) - 1) * 100;
  const compliant = comparisonIntensity <= TARGET_INTENSITY;

  return {
    comparisonIntensity,
    percentDiff,
    compliant
  };
}
