import { pool } from '../postgres';

describe('Database Integration Tests', () => {
  afterAll(async () => {
    // Close the connection pool after tests
    await pool.end();
  });

  it('should verify that tables exist and routes table contains 5 seeded records', async () => {
    try {
      const result = await pool.query('SELECT * FROM routes;');
      
      // Verify tables exist implicitly because query doesn't throw
      expect(result).toBeDefined();
      
      // Verify seed data is inserted
      expect(result.rowCount).toBe(5);
      expect(result.rows).toHaveLength(5);
      
      // Verify specific route baseline flag
      const routeR001 = result.rows.find((row) => row.route_id === 'R001');
      expect(routeR001).toBeDefined();
      expect(routeR001.is_baseline).toBe(true);

    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.warn('Skipping integration test: PostgreSQL is not running locally.');
        return; // Skip test gracefully if DB is not available
      }
      if (error.code === '42P01') {
        throw new Error('Relation "routes" does not exist. Did you run db:migrate?');
      }
      throw error;
    }
  });
});
