import request from 'supertest';
import express from 'express';
import { routesRouter } from '../routes.router';

const app = express();
app.use(express.json());
app.use('/routes', routesRouter);

describe('Routes API', () => {
  it('GET /routes should return a list of 5 routes', async () => {
    const res = await request(app).get('/routes');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
    expect(res.body.data[0]).toHaveProperty('routeId');
    expect(res.body.data[0]).toHaveProperty('vesselType');
    expect(res.body.data[0]).toHaveProperty('fuelType');
  });

  it('POST /routes/:id/baseline should return the updated routes array', async () => {
    const res = await request(app).post('/routes/R002/baseline');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const baseline = res.body.data.find((r: any) => r.isBaseline);
    expect(baseline.routeId).toBe('R002');
  });

  it('GET /routes/comparison should return route data for frontend comparison', async () => {
    const res = await request(app).get('/routes/comparison');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('routeId');
    expect(res.body.data[0]).toHaveProperty('ghgIntensity');
  });
});
