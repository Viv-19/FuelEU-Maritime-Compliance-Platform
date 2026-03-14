import request from 'supertest';
import express from 'express';
import { complianceRouter } from '../compliance.router';

const app = express();
app.use(express.json());
app.use('/compliance', complianceRouter);

describe('Compliance API', () => {
  it('GET /compliance/cb should return computed CB for known ship', async () => {
    const res = await request(app).get('/compliance/cb?shipId=SHIP001&year=2024');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shipId).toBe('SHIP001');
    expect(res.body.data.year).toBe(2024);
    expect(res.body.data).toHaveProperty('complianceBalance');
  });

  it('GET /compliance/cb should return 400 for invalid query missing year', async () => {
    const res = await request(app).get('/compliance/cb?shipId=SHIP001');
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /compliance/cb should return default CB for unknown ship', async () => {
    const res = await request(app).get('/compliance/cb?shipId=UNKNOWN&year=2024');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('complianceBalance');
  });

  it('GET /compliance/adjusted-cb should return array of ships with cb_before', async () => {
    const res = await request(app).get('/compliance/adjusted-cb?year=2024');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('shipId');
    expect(res.body.data[0]).toHaveProperty('cb_before');
  });
});
