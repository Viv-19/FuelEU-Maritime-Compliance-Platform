export interface Route {
  routeId: string;
  shipId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface RouteComparison {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
  isBaseline: boolean;
}
