import { Route } from '../../core/domain/Route';
import { ShipAggregate } from '../../core/domain/ShipAggregate';

const TARGET_INTENSITY = 89.3368;

/**
 * Aggregates routes into ship-level compliance data.
 * Groups routes by shipId and computes per-ship totals.
 *
 * @param routes - Array of Route objects
 * @returns Array of ShipAggregate objects sorted by totalCB descending
 */
export function aggregateShips(routes: Route[]): ShipAggregate[] {
  const shipMap = new Map<
    string,
    { totalCB: number; routesCount: number; totalIntensity: number }
  >();

  for (const route of routes) {
    const energyInScope = route.fuelConsumption * 41000;
    const cb = (TARGET_INTENSITY - route.ghgIntensity) * energyInScope;

    const existing = shipMap.get(route.shipId);
    if (existing) {
      existing.totalCB += cb;
      existing.routesCount += 1;
      existing.totalIntensity += route.ghgIntensity;
    } else {
      shipMap.set(route.shipId, {
        totalCB: cb,
        routesCount: 1,
        totalIntensity: route.ghgIntensity,
      });
    }
  }

  const aggregates: ShipAggregate[] = [];

  shipMap.forEach((data, shipId) => {
    const avgIntensity = data.totalIntensity / data.routesCount;
    let status: ShipAggregate['status'] = 'Neutral';
    if (data.totalCB > 0) status = 'Surplus';
    else if (data.totalCB < 0) status = 'Deficit';

    aggregates.push({
      shipId,
      totalCB: data.totalCB,
      routesCount: data.routesCount,
      avgIntensity,
      status,
    });
  });

  return aggregates.sort((a, b) => b.totalCB - a.totalCB);
}
