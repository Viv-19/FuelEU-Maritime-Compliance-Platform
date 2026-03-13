import request from 'supertest';
import express from 'express';
import { bankingRouter } from '../banking.router';

const app = express();
app.use(express.json());
app.use('/banking', bankingRouter);

describe('Banking API', () => {
  it('POST /banking/bank should successfully bank positive surplus', async () => {
    const res = await request(app)
      .post('/banking/bank')
      .send({
        shipId: 'SHIP123',
        year: 2024,
        amount: 5000
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shipId).toBe('SHIP123');
    expect(res.body.data.bankedAmount).toBe(5000);
  });

  it('POST /banking/bank should reject negative banking amounts via application layer', async () => {
    const res = await request(app)
      .post('/banking/bank')
      .send({
        shipId: 'SHIP123',
        year: 2024,
        amount: -500 // Assuming this triggers application error "Only positive..."
      });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Only positive Compliance Balance (surplus) can be banked');
  });

  it('POST /banking/apply should correctly apply banked properties', async () => {
    const res = await request(app)
      .post('/banking/apply')
      .send({
        shipId: 'SHIP123',
        year: 2024,
        amount: -2000 // deficit
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.applied).toBe(2000); // from applyBanked limit
    expect(res.body.data.remainingBank).toBe(3000); // 5000 (mock) - 2000
  });

  it('POST /banking/apply should return 400 for invalid body schema', async () => {
    const res = await request(app)
      .post('/banking/apply')
      .send({
        year: '2024 invalid type string',
      });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
