const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trainly-test';

const gpsService = require('../../src/services/gps.service');

test('gps validation accepts points at zero latitude and longitude', () => {
  const result = gpsService.validateRoute([
    { latitude: 0, longitude: 0, timestamp: '2026-06-02T10:00:00.000Z' },
  ]);

  assert.equal(result.valid, true);
  assert.equal(result.totalPoints, 1);
});

test('gps validation rejects points with missing coordinates', () => {
  const result = gpsService.validateRoute([
    { latitude: 1.2, timestamp: '2026-06-02T10:00:00.000Z' },
  ]);

  assert.equal(result.valid, false);
});
