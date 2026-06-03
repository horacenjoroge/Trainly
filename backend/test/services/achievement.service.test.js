const test = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trainly-test';

const achievementService = require('../../src/services/achievement.service');
const achievementRepository = require('../../src/repositories/achievements/achievement.repository');
const userRepository = require('../../src/repositories/users/user.repository');
const { stubMethods } = require('../../test-support/stub');

test('checkAndCreateAchievements awards the first workout milestone once', async () => {
  const createdAchievements = [];

  const restoreAchievements = stubMethods(achievementRepository, {
    getTemplates: () => ({
      first_workout: {
        title: 'First Workout',
        emoji: '🔥',
        description: 'Completed your first workout',
        category: 'milestone',
        rarity: 'common',
        points: 25,
      },
    }),
    countByUser: async () => 0,
    findEarned: async () => null,
    create: async (data) => {
      createdAchievements.push(data);
      return data;
    },
  });
  const restoreUsers = stubMethods(userRepository, {
    findById: async () => ({ id: 'user-1', name: 'Horace Demo' }),
  });

  try {
    const result = await achievementService.checkAndCreateAchievements('user-1', {
      _id: 'workout-1',
      type: 'Running',
      toObject() {
        return { _id: 'workout-1', type: 'Running' };
      },
    });

    assert.equal(result.length, 1);
    assert.equal(createdAchievements[0].type, 'first_workout');
    assert.equal(createdAchievements[0].workoutType, 'Running');
  } finally {
    restoreUsers();
    restoreAchievements();
  }
});

test('getUserAchievements returns pagination and point totals', async () => {
  const restoreAchievements = stubMethods(achievementRepository, {
    findByUser: async () => [
      { _id: 'a1', points: 25 },
      { _id: 'a2', points: 75 },
    ],
    countByUser: async () => 2,
  });

  try {
    const result = await achievementService.getUserAchievements('user-1', { page: 1, limit: 10 });

    assert.equal(result.achievements.length, 2);
    assert.equal(result.stats.total, 2);
    assert.equal(result.stats.points, 100);
    assert.equal(result.pagination.totalAchievements, 2);
  } finally {
    restoreAchievements();
  }
});
