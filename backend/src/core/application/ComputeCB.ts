import { TARGET_INTENSITY, ENERGY_PER_TON_FUEL } from './constants';

/**
 * Computes the Compliance Balance (CB) for a given actual GHG intensity and fuel consumption.
 * 
 * Formula: ComplianceBalance = (Target - Actual) × Energy
 * Where: Energy = fuelConsumption × ENERGY_PER_TON_FUEL
 * 
 * @param ghgIntensity - The actual GHG intensity in gCO2e/MJ
 * @param fuelConsumption - The fuel consumption in tonnes
 * @returns The Compliance Balance (positive implies surplus, negative implies deficit)
 */
export function computeComplianceBalance(
  ghgIntensity: number,
  fuelConsumption: number
): number {
  const energy = fuelConsumption * ENERGY_PER_TON_FUEL;
  const cb = (TARGET_INTENSITY - ghgIntensity) * energy;
  return cb;
}
