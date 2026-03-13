import request from 'supertest';
import express from 'express';
import { routesRouter } from '../routes.router';

const app = express();
app.use(express.json());
app.use('/routes', routesRouter);

describe('Routes API', () => {
  it('GET /routes should return a list of routes', async () => {
    const res = await request(app).get('/routes');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('routeId');
  });

  it('POST /routes/:id/baseline should update baseline', async () => {
    const res = await request(app).post('/routes/R001/baseline');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe('Baseline route updated');
    expect(res.body.data.routeId).toBe('R001');
  });

  it('GET /routes/comparison should return comparison results', async () => {
    const res = await request(app).get('/routes/comparison');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Based on the mock routes, R002 has 88 as compared to 91.0
    expect(res.body.data[0]).toHaveProperty('routeId', 'R002');
    expect(res.body.data[0]).toHaveProperty('percentDiff');
    expect(res.body.data[0]).toHaveProperty('compliant', true); // 88 <= 89.3368
  });
});
