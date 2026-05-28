/**
 * Basic smoke tests — verify the app loads and health endpoint works.
 * No database connection required.
 */
const request = require('supertest');

// Mock pg module so tests run without a real database
jest.mock('pg', () => {
  const mockClient = { query: jest.fn(), release: jest.fn() };
  const Pool = jest.fn(() => ({
    query: jest.fn(),
    connect: jest.fn().mockResolvedValue(mockClient),
    on: jest.fn(),
  }));
  return { Pool };
});

const app = require('../src/app');

describe('Health check', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth — login validation', () => {
  it('returns 422 when body is empty', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('errors');
  });

  it('returns 422 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: 'pass123' });
    expect(res.statusCode).toBe(422);
  });
});

describe('Auth — profile (unauthenticated)', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/auth/profile');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Students — unauthenticated access', () => {
  it('GET /api/v1/students returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/students');
    expect(res.statusCode).toBe(401);
  });
});

describe('Attendance — bulk validation', () => {
  it('POST /api/v1/attendance/bulk returns 401 without token', async () => {
    const res = await request(app).post('/api/v1/attendance/bulk').send({});
    expect(res.statusCode).toBe(401);
  });
});
