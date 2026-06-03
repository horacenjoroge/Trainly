const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'fatal';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'test-refresh-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trainly-test';

const app = require('../../src/app');
const authService = require('../../src/services/auth.service');
const { workoutService } = require('../../src/services/workout.service');
const gpsService = require('../../src/services/gps.service');
const postService = require('../../src/services/post.service');
const followService = require('../../src/services/follow.service');
const achievementService = require('../../src/services/achievement.service');
const contactService = require('../../src/services/contact.service');
const sosService = require('../../src/services/sos.service');
const cache = require('../../src/infrastructure/cache');
const metrics = require('../../src/observability/metrics');
const { AuthError } = require('../../src/core/errors/AppError');
const { request } = require('../../test-support/http');
const { stubMethods } = require('../../test-support/stub');

function authHeader(userId = 'user-1') {
  return {
    'content-type': 'application/json',
    'x-auth-token': jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET),
  };
}

function jsonHeaders(extra = {}) {
  return {
    'content-type': 'application/json',
    ...extra,
  };
}

test('backend API integration flows', async (t) => {
  await t.test('auth endpoints handle registration success and login failure', async () => {
      const restoreAuth = stubMethods(authService, {
        register: async (payload) => ({
          user: { id: 'user-10', name: payload.name, email: payload.email },
          token: 'access-token',
          refreshToken: 'refresh-token',
        }),
        login: async () => {
          throw new AuthError('Invalid credentials');
        },
      });

      try {
        const registerResponse = await request(app, '/api/auth/register', {
          method: 'POST',
          headers: jsonHeaders(),
          body: JSON.stringify({
            name: 'Horace Demo',
            email: 'horace.demo@trainly.dev',
            password: 'Password123',
          }),
        });

        assert.equal(registerResponse.status, 201);
        assert.equal(registerResponse.body.user.email, 'horace.demo@trainly.dev');

        const loginResponse = await request(app, '/api/auth/login', {
          method: 'POST',
          headers: jsonHeaders(),
          body: JSON.stringify({
            email: 'horace.demo@trainly.dev',
            password: 'wrong-password',
          }),
        });

        assert.equal(loginResponse.status, 401);
        assert.equal(loginResponse.body.code, 'AUTH_ERROR');
      } finally {
        restoreAuth();
      }
    });

  await t.test('auth validation rejects weak registration payloads', async () => {
      const response = await request(app, '/api/auth/register', {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({
          name: 'Horace Demo',
          email: 'not-an-email',
          password: 'short',
        }),
      });

      assert.equal(response.status, 400);
      assert.equal(response.body.code, 'VALIDATION_ERROR');
      assert.ok(response.body.meta.errors.some((item) => item.field === 'email'));
    });

  await t.test('workout endpoints create, list, read, and summarize stats', async () => {
      const workoutRecord = {
        _id: 'workout-1',
        type: 'Running',
        duration: 1800,
        running: { distance: 5000 },
        likes: [],
        comments: [],
      };

      const restoreWorkouts = stubMethods(workoutService, {
        create: async (_userId, payload) => ({
          ...workoutRecord,
          ...payload,
        }),
        getWorkouts: async () => [workoutRecord],
        getWorkout: async () => workoutRecord,
        getStats: async () => ({
          summary: {
            totalWorkouts: 3,
            totalDuration: 5400,
            totalDistance: 12000,
            totalCalories: 900,
          },
          totalWorkouts: 3,
        }),
      });

      try {
        const createResponse = await request(app, '/api/workouts', {
          method: 'POST',
          headers: authHeader(),
          body: JSON.stringify({
            type: 'Running',
            duration: 1800,
            calories: 300,
            distance: 5000,
            privacy: 'public',
          }),
        });

        assert.equal(createResponse.status, 201);
        assert.equal(createResponse.body.data.workout.type, 'Running');

        const listResponse = await request(app, '/api/workouts?limit=5', {
          headers: authHeader(),
        });
        assert.equal(listResponse.status, 200);
        assert.equal(listResponse.body.data.length, 1);

        const getResponse = await request(app, '/api/workouts/workout-1', {
          headers: authHeader(),
        });
        assert.equal(getResponse.status, 200);
        assert.equal(getResponse.body.data._id, 'workout-1');

        const statsResponse = await request(app, '/api/workouts/stats/summary?period=month', {
          headers: authHeader(),
        });
        assert.equal(statsResponse.status, 200);
        assert.equal(statsResponse.body.data.totalWorkouts, 3);
        assert.equal(statsResponse.body.data.totalDistance, 12000);
      } finally {
        restoreWorkouts();
      }
    });

  await t.test('workout creation rejects invalid GPS route data', async () => {
      const restoreGps = stubMethods(gpsService, {
        validateRoute: () => ({
          valid: false,
          message: 'GPS route contains invalid coordinates',
        }),
      });

      try {
        const response = await request(app, '/api/workouts', {
          method: 'POST',
          headers: authHeader(),
          body: JSON.stringify({
            type: 'Running',
            duration: 1800,
            running: {
              route: {
                gpsPoints: [{ latitude: 1.2 }],
              },
            },
          }),
        });

        assert.equal(response.status, 400);
        assert.equal(response.body.code, 'VALIDATION_ERROR');
      } finally {
        restoreGps();
      }
    });

  await t.test('post endpoints create, list, and like posts', async () => {
      const basePost = {
        _id: 'post-1',
        user: { _id: 'user-1', name: 'Horace Demo', avatar: '/uploads/horace.png' },
        content: 'Morning long run complete.',
        image: null,
        privacy: 'public',
        workoutDetails: null,
        likes: ['user-1'],
        comments: [],
        createdAt: '2026-06-03T09:00:00.000Z',
      };

      const restorePosts = stubMethods(postService, {
        listPosts: async () => [basePost],
        createPost: async () => basePost,
        toggleLike: async () => basePost,
      });

      try {
        const createResponse = await request(app, '/api/posts', {
          method: 'POST',
          headers: authHeader(),
          body: JSON.stringify({
            content: 'Morning long run complete.',
            privacy: 'public',
          }),
        });

        assert.equal(createResponse.status, 201);
        assert.equal(createResponse.body.content, 'Morning long run complete.');
        assert.equal(createResponse.body.isLiked, true);

        const listResponse = await request(app, '/api/posts?limit=10', {
          headers: authHeader(),
        });
        assert.equal(listResponse.status, 200);
        assert.equal(listResponse.body.length, 1);

        const likeResponse = await request(app, '/api/posts/post-1/like', {
          method: 'PUT',
          headers: authHeader(),
        });
        assert.equal(likeResponse.status, 200);
        assert.equal(likeResponse.body.likes.length, 1);
      } finally {
        restorePosts();
      }
    });

  await t.test('follow endpoints handle follow and follower listing', async () => {
      const restoreFollow = stubMethods(followService, {
        followUser: async () => ({ message: 'User followed successfully' }),
        getFollowers: async () => [
          { _id: 'user-2', name: 'Amina Demo' },
        ],
        unfollowUser: async () => ({ message: 'User unfollowed successfully' }),
      });

      try {
        const followResponse = await request(app, '/api/follow/user-2', {
          method: 'POST',
          headers: authHeader(),
        });
        assert.equal(followResponse.status, 200);
        assert.equal(followResponse.body.message, 'User followed successfully');

        const followersResponse = await request(app, '/api/follow/followers', {
          headers: authHeader(),
        });
        assert.equal(followersResponse.status, 200);
        assert.equal(followersResponse.body[0].name, 'Amina Demo');

        const unfollowResponse = await request(app, '/api/follow/user-2', {
          method: 'DELETE',
          headers: authHeader(),
        });
        assert.equal(unfollowResponse.status, 200);
        assert.equal(unfollowResponse.body.message, 'User unfollowed successfully');
      } finally {
        restoreFollow();
      }
    });

  await t.test('achievement endpoints return achievement listings and leaderboard data', async () => {
      const restoreAchievements = stubMethods(achievementService, {
        getUserAchievements: async () => ({
          achievements: [{ _id: 'achievement-1', title: 'First Workout', points: 25 }],
          pagination: { currentPage: 1, totalPages: 1, totalAchievements: 1, hasNextPage: false },
          stats: { total: 1, points: 25 },
        }),
        getLeaderboard: async () => [
          { user: { _id: 'user-1', name: 'Horace Demo' }, points: 125 },
        ],
      });

      try {
        const listResponse = await request(app, '/api/achievements', {
          headers: authHeader(),
        });
        assert.equal(listResponse.status, 200);
        assert.equal(listResponse.body.achievements.length, 1);

        const progressResponse = await request(app, '/api/achievements/progress', {
          headers: authHeader(),
        });
        assert.equal(progressResponse.status, 200);
        assert.equal(progressResponse.body.data.stats.points, 25);

        const leaderboardResponse = await request(app, '/api/achievements/leaderboard?limit=5', {
          headers: authHeader(),
        });
        assert.equal(leaderboardResponse.status, 200);
        assert.equal(leaderboardResponse.body.data[0].points, 125);
      } finally {
        restoreAchievements();
      }
    });

  await t.test('contact and SOS endpoints cover list, create, and emergency send flow', async () => {
      const restoreContacts = stubMethods(contactService, {
        listContacts: async () => [{ _id: 'contact-1', name: 'Coach Sam', phoneNumber: '+155555501' }],
        createContact: async (_userId, payload) => ({ _id: 'contact-2', ...payload }),
      });
      const restoreSos = stubMethods(sosService, {
        sendSOS: async () => ({
          sent: true,
          contacts: [{ contact: 'Coach Sam', status: 'queued' }],
        }),
      });

      try {
        const listResponse = await request(app, '/api/contacts', {
          headers: authHeader(),
        });
        assert.equal(listResponse.status, 200);
        assert.equal(listResponse.body.length, 1);

        const createResponse = await request(app, '/api/contacts', {
          method: 'POST',
          headers: authHeader(),
          body: JSON.stringify({
            name: 'Coach Sam',
            phoneNumber: '+155555501',
            relationship: 'Coach',
          }),
        });
        assert.equal(createResponse.status, 201);
        assert.equal(createResponse.body.name, 'Coach Sam');

        const sosResponse = await request(app, '/api/contacts/send-sos', {
          method: 'POST',
          headers: authHeader(),
          body: JSON.stringify({
            location: {
              latitude: -1.286389,
              longitude: 36.817223,
            },
            message: 'Need assistance after a fall.',
          }),
        });
        assert.equal(sosResponse.status, 200);
        assert.equal(sosResponse.body.sent, true);
        assert.equal(sosResponse.body.contacts[0].status, 'queued');
      } finally {
        restoreSos();
        restoreContacts();
      }
    });

  await t.test('health and metrics endpoints expose operational state', async () => {
      const originalReadyState = mongoose.connection.readyState;
      const restoreCache = stubMethods(cache, {
        getStatus: () => ({
          enabled: false,
          connected: false,
          mode: 'disabled',
        }),
      });

      mongoose.connection.readyState = 1;

      try {
        const healthResponse = await request(app, '/api/health');
        assert.equal(healthResponse.status, 200);
        assert.equal(healthResponse.body.status, 'ok');
        assert.equal(healthResponse.body.database.status, 'connected');
        assert.equal(typeof healthResponse.body.metrics.requestsTotal, 'number');

        const metricsResponse = await request(app, '/metrics');
        assert.equal(metricsResponse.status, 200);
        assert.match(metricsResponse.body, /trainly_requests_total/);
        assert.match(metricsResponse.body, /trainly_redis_enabled 0/);

        const snapshot = metrics.getSnapshot();
        assert.ok(snapshot.requestsTotal >= 2);
      } finally {
        mongoose.connection.readyState = originalReadyState;
        restoreCache();
      }
    });

  await t.test('protected endpoints reject missing auth headers', async () => {
      const response = await request(app, '/api/workouts');

      assert.equal(response.status, 401);
      assert.equal(response.body.code, 'AUTH_ERROR');
    });

  await t.test('contact validation rejects incomplete payloads', async () => {
      const response = await request(app, '/api/contacts', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
          name: 'Coach Sam',
        }),
      });

      assert.equal(response.status, 400);
      assert.equal(response.body.code, 'VALIDATION_ERROR');
      assert.ok(response.body.meta.errors.some((item) => item.field === 'phoneNumber'));
    });
});
