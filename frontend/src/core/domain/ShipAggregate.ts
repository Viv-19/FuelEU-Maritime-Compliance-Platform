export interface ShipAggregate {
  shipId: string;
  totalCB: number;
  routesCount: number;
  avgIntensity: number;
  status: 'Surplus' | 'Deficit' | 'Neutral';
}
