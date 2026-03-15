import { RouteRepository } from '../../../core/ports/RouteRepository';
import { Route } from '../../../core/domain/Route';
import { query } from '../../../infrastructure/db/postgres';

export class SqlRouteRepository implements RouteRepository {
  async save(route: Route): Promise<Route> {
    const result = await query(
      `INSERT INTO routes (
        route_id,
        ship_id,
        vessel_type,
        fuel_type,
        year,
        ghg_intensity,
        fuel_consumption,
        distance,
        total_emissions,
        is_baseline
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        route.routeId,
        route.shipId,
        route.vesselType,
        route.fuelType,
        route.year,
        route.ghgIntensity,
        route.fuelConsumption,
        route.distance,
        route.totalEmissions,
        route.isBaseline ? true : false,
      ]
    );
    return this.mapToDomain(result.rows[0]);
  }

  async findAll(): Promise<Route[]> {
    const result = await query(`SELECT * FROM routes ORDER BY route_id ASC`);
    return result.rows.map(this.mapToDomain);
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await query(`SELECT * FROM routes WHERE route_id = $1`, [routeId]);
    if (result.rowCount === 0) return null;
    return this.mapToDomain(result.rows[0]);
  }

  async setBaseline(routeId: string): Promise<void> {
    await query(`UPDATE routes SET is_baseline = FALSE`);
    await query(`UPDATE routes SET is_baseline = TRUE WHERE route_id = $1`, [routeId]);
  }

  async getBaseline(): Promise<Route | null> {
    const result = await query(`SELECT * FROM routes WHERE is_baseline = TRUE LIMIT 1`);
    if (result.rowCount === 0) return null;
    return this.mapToDomain(result.rows[0]);
  }

  private mapToDomain(row: any): Route {
    return new Route(
      row.route_id,
      row.ship_id,
      row.vessel_type,
      row.fuel_type,
      Number(row.year),
      Number(row.ghg_intensity),
      Number(row.fuel_consumption),
      Number(row.distance),
      Number(row.total_emissions),
      row.is_baseline
    );
  }
}
