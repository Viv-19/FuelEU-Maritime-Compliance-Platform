import request from 'supertest';
import express from 'express';
import { poolsRouter } from '../pools.router';

const app = express();
app.use(express.json());
app.use('/pools', poolsRouter);

describe('Pools API', () => {
  it('POST /pools should successfully allocate valid pool', async () => {
    const res = await request(app)
      .post('/pools')
      .send({
        year: 2024,
        members: [
          { shipId: 'A', cb: 6000 },
          { shipId: 'B', cb: -4000 },
          { shipId: 'C', cb: -1000 }
        ]
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(3);

    // Verify application rule logic flowed through the payload back out
    const shipA = res.body.data.find((s: any) => s.shipId === 'A');
    expect(shipA.cb_before).toBe(6000);
    expect(shipA.cb_after).toBe(1000);

    const shipB = res.body.data.find((s: any) => s.shipId === 'B');
    expect(shipB.cb_before).toBe(-4000);
    expect(shipB.cb_after).toBe(0);
  });

  it('POST /pools should reject invalid pool where total < 0', async () => {
    const res = await request(app)
      .post('/pools')
      .send({
        year: 2024,
        members: [
          { shipId: 'A', cb: 2000 },
          { shipId: 'B', cb: -4000 }
        ]
      });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Total pooling compliance balance must be >= 0');
  });

  it('POST /pools should return 400 for empty pool members array', async () => {
    const res = await request(app)
      .post('/pools')
      .send({
        year: 2024,
        members: []
      });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
