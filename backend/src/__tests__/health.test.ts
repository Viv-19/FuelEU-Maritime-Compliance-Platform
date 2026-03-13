import request from 'supertest';
import { app } from '../infrastructure/server/app';

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'FuelEU Backend',
    });
  });

  it('should return JSON content type', async () => {
    const response = await request(app).get('/health');

    expect(response.headers['content-type']).toMatch(/json/);
  });
});
