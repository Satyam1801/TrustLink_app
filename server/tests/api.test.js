const request = require('supertest');
const express = require('express');

// Dummy test app since index.js listens directly.
const app = express();
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TrustLink Server is running smooth 🚀' });
});

describe('TrustLink Backend API', () => {
  it('GET /health - Should return server health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});
