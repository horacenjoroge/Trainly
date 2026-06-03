const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trainly-test';

const { normalizeWorkoutData } = require('../../src/services/workout.service');

test('normalizeWorkoutData infers times and maps running distance', () => {
  const endTime = '2026-06-02T12:00:00.000Z';
  const result = normalizeWorkoutData('user-1', {
    type: 'Running',
    duration: 600,
    calories: 120,
    distance: 2500,
    endTime,
    sessionId: 'run_1',
  });

  assert.equal(result.userId, 'user-1');
  assert.equal(result.running.distance, 2500);
  assert.equal(result.sessionId, 'run_1');
  assert.equal(result.endTime.toISOString(), endTime);
  assert.equal(result.startTime.toISOString(), '2026-06-02T11:50:00.000Z');
});

test('normalizeWorkoutData creates a fallback session id when missing', () => {
  const result = normalizeWorkoutData('user-2', {
    type: 'Cycling',
    duration: 60,
    distance: 500,
  });

  assert.equal(result.cycling.distance, 500);
  assert.match(result.sessionId, /^cycling_/);
});
