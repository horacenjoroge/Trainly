require('dotenv').config();

const mongoose = require('mongoose');

const User = require('../../models/user');
const Workout = require('../../models/workout');
const Post = require('../../models/post');
const Achievement = require('../../models/Achievement');
const Contact = require('../../models/contact');
const Follower = require('../../models/Follower');
const SosEvent = require('../../models/sosEvent');

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Password123';

const userSeeds = [
  {
    name: 'Horace Njoroge',
    email: 'horace.demo@trainly.dev',
    profile: {
      firstName: 'Horace',
      lastName: 'Njoroge',
      bio: 'Backend engineer, sunrise runner, and consistent mileage builder.',
      fitnessLevel: 'advanced',
    },
  },
  {
    name: 'Amina Wanjiru',
    email: 'amina.demo@trainly.dev',
    profile: {
      firstName: 'Amina',
      lastName: 'Wanjiru',
      bio: 'Cyclist and strength athlete training for long weekend rides.',
      fitnessLevel: 'intermediate',
    },
  },
  {
    name: 'David Mwangi',
    email: 'david.demo@trainly.dev',
    profile: {
      firstName: 'David',
      lastName: 'Mwangi',
      bio: 'Swimmer and gym regular using Trainly to track cross-training.',
      fitnessLevel: 'intermediate',
    },
  },
  {
    name: 'Grace Atieno',
    email: 'grace.demo@trainly.dev',
    profile: {
      firstName: 'Grace',
      lastName: 'Atieno',
      bio: 'Walking, hiking, and health-first routines with social accountability.',
      fitnessLevel: 'beginner',
    },
  },
];

function iso(dateString) {
  return new Date(dateString);
}

function sessionId(prefix, suffix) {
  return `${prefix}_${suffix}`;
}

function workoutSeedsByEmail(usersByEmail) {
  return [
    {
      userId: usersByEmail['horace.demo@trainly.dev']._id,
      sessionId: sessionId('running', 'horace_tuesday_threshold'),
      type: 'Running',
      name: 'Tuesday Threshold',
      startTime: iso('2026-05-26T04:45:00.000Z'),
      endTime: iso('2026-05-26T05:42:00.000Z'),
      duration: 3420,
      calories: 610,
      privacy: 'public',
      notes: 'Controlled threshold effort before work.',
      location: { city: 'Nairobi', country: 'Kenya' },
      running: {
        distance: 9800,
        pace: { average: 5.05, best: 4.42 },
        route: {
          gpsPoints: [
            { latitude: -1.286389, longitude: 36.817223, timestamp: iso('2026-05-26T04:45:00.000Z') },
            { latitude: -1.283102, longitude: 36.821908, timestamp: iso('2026-05-26T04:56:00.000Z') },
            { latitude: -1.279441, longitude: 36.826014, timestamp: iso('2026-05-26T05:10:00.000Z') },
          ],
        },
      },
    },
    {
      userId: usersByEmail['horace.demo@trainly.dev']._id,
      sessionId: sessionId('running', 'horace_long_run'),
      type: 'Running',
      name: 'Saturday Long Run',
      startTime: iso('2026-05-31T03:50:00.000Z'),
      endTime: iso('2026-05-31T05:25:00.000Z'),
      duration: 5700,
      calories: 980,
      privacy: 'public',
      notes: 'Longest aerobic run of the month.',
      location: { city: 'Nairobi', country: 'Kenya' },
      running: {
        distance: 16500,
        pace: { average: 5.45, best: 4.58 },
        route: {
          gpsPoints: [
            { latitude: -1.286389, longitude: 36.817223, timestamp: iso('2026-05-31T03:50:00.000Z') },
            { latitude: -1.282215, longitude: 36.824513, timestamp: iso('2026-05-31T04:20:00.000Z') },
            { latitude: -1.277011, longitude: 36.830317, timestamp: iso('2026-05-31T04:52:00.000Z') },
          ],
        },
      },
    },
    {
      userId: usersByEmail['amina.demo@trainly.dev']._id,
      sessionId: sessionId('cycling', 'amina_commute_build'),
      type: 'Cycling',
      name: 'Commuter Base Ride',
      startTime: iso('2026-05-28T05:20:00.000Z'),
      endTime: iso('2026-05-28T06:12:00.000Z'),
      duration: 3120,
      calories: 520,
      privacy: 'public',
      notes: 'Steady cadence and smooth rolling hills.',
      cycling: {
        distance: 21400,
        speed: { average: 24.7, max: 41.2 },
        elevation: { gain: 320, loss: 318 },
      },
    },
    {
      userId: usersByEmail['amina.demo@trainly.dev']._id,
      sessionId: sessionId('gym', 'amina_strength_day'),
      type: 'Gym',
      name: 'Lower Body Strength',
      startTime: iso('2026-05-29T16:10:00.000Z'),
      endTime: iso('2026-05-29T17:05:00.000Z'),
      duration: 3300,
      calories: 410,
      privacy: 'friends',
      notes: 'Heavy squats and lunges.',
      gym: {
        exercises: [
          {
            name: 'Back Squat',
            category: 'legs',
            sets: [
              { setNumber: 1, actualReps: 5, weight: 70, completed: true },
              { setNumber: 2, actualReps: 5, weight: 75, completed: true },
            ],
          },
          {
            name: 'Walking Lunges',
            category: 'legs',
            sets: [
              { setNumber: 1, actualReps: 12, weight: 20, completed: true },
            ],
          },
        ],
        stats: { totalSets: 3, totalReps: 22, totalWeight: 610, exerciseCount: 2 },
      },
    },
    {
      userId: usersByEmail['david.demo@trainly.dev']._id,
      sessionId: sessionId('swimming', 'david_pool_threshold'),
      type: 'Swimming',
      name: 'Pool Threshold Set',
      startTime: iso('2026-05-27T17:35:00.000Z'),
      endTime: iso('2026-05-27T18:20:00.000Z'),
      duration: 2700,
      calories: 360,
      privacy: 'public',
      notes: 'Focused on technique under fatigue.',
      swimming: {
        poolLength: 25,
        distance: 2000,
        strokeType: 'Freestyle',
        laps: [
          { lapNumber: 1, time: 32, distance: 25 },
          { lapNumber: 2, time: 33, distance: 25 },
        ],
      },
    },
    {
      userId: usersByEmail['david.demo@trainly.dev']._id,
      sessionId: sessionId('gym', 'david_upper_body'),
      type: 'Gym',
      name: 'Upper Body Circuit',
      startTime: iso('2026-05-30T14:00:00.000Z'),
      endTime: iso('2026-05-30T14:50:00.000Z'),
      duration: 3000,
      calories: 300,
      privacy: 'friends',
      notes: 'Pull and push circuit after the pool.',
      gym: {
        exercises: [
          {
            name: 'Bench Press',
            category: 'chest',
            sets: [{ setNumber: 1, actualReps: 8, weight: 50, completed: true }],
          },
          {
            name: 'Bent Over Row',
            category: 'back',
            sets: [{ setNumber: 1, actualReps: 10, weight: 40, completed: true }],
          },
        ],
        stats: { totalSets: 2, totalReps: 18, totalWeight: 800, exerciseCount: 2 },
      },
    },
    {
      userId: usersByEmail['grace.demo@trainly.dev']._id,
      sessionId: sessionId('walking', 'grace_evening_walk'),
      type: 'Walking',
      name: 'Evening Recovery Walk',
      startTime: iso('2026-05-30T16:40:00.000Z'),
      endTime: iso('2026-05-30T17:18:00.000Z'),
      duration: 2280,
      calories: 170,
      privacy: 'public',
      notes: 'Neighborhood walk to close the day.',
      location: { city: 'Kisumu', country: 'Kenya' },
    },
  ];
}

function postSeedsByEmail(usersByEmail, workoutsBySessionId) {
  return [
    {
      user: usersByEmail['horace.demo@trainly.dev']._id,
      content: 'Wrapped up a strong long run before sunrise. Legs held up better than expected.',
      privacy: 'public',
      workoutDetails: { type: 'Running', duration: 5700, calories: 980 },
      image: '/uploads/posts/demo-long-run.jpg',
      likes: [usersByEmail['amina.demo@trainly.dev']._id, usersByEmail['grace.demo@trainly.dev']._id],
      comments: [
        { user: usersByEmail['amina.demo@trainly.dev']._id, text: 'That consistency is showing.', date: iso('2026-05-31T06:15:00.000Z') },
      ],
      createdAt: workoutsBySessionId[sessionId('running', 'horace_long_run')].endTime,
    },
    {
      user: usersByEmail['amina.demo@trainly.dev']._id,
      content: 'Strength day after a big cycling week. Keeping the legs honest.',
      privacy: 'friends',
      workoutDetails: { type: 'Gym', duration: 3300, calories: 410 },
      likes: [usersByEmail['horace.demo@trainly.dev']._id],
      comments: [
        { user: usersByEmail['david.demo@trainly.dev']._id, text: 'Strong session.', date: iso('2026-05-29T17:22:00.000Z') },
      ],
      createdAt: iso('2026-05-29T17:10:00.000Z'),
    },
    {
      user: usersByEmail['david.demo@trainly.dev']._id,
      content: 'Pool session was all about form. The final set finally clicked.',
      privacy: 'public',
      workoutDetails: { type: 'Swimming', duration: 2700, calories: 360 },
      likes: [usersByEmail['horace.demo@trainly.dev']._id, usersByEmail['amina.demo@trainly.dev']._id],
      comments: [],
      createdAt: iso('2026-05-27T18:25:00.000Z'),
    },
  ];
}

function followerSeedsByEmail(usersByEmail) {
  return [
    { follower: usersByEmail['amina.demo@trainly.dev']._id, following: usersByEmail['horace.demo@trainly.dev']._id },
    { follower: usersByEmail['david.demo@trainly.dev']._id, following: usersByEmail['horace.demo@trainly.dev']._id },
    { follower: usersByEmail['grace.demo@trainly.dev']._id, following: usersByEmail['amina.demo@trainly.dev']._id },
    { follower: usersByEmail['horace.demo@trainly.dev']._id, following: usersByEmail['david.demo@trainly.dev']._id },
  ];
}

function contactSeedsByEmail(usersByEmail) {
  return [
    { userId: usersByEmail['horace.demo@trainly.dev']._id, name: 'Grace Wanjiku', phoneNumber: '+254712345678', relationship: 'Sister' },
    { userId: usersByEmail['horace.demo@trainly.dev']._id, name: 'Brian Mutiso', phoneNumber: '+254722345679', relationship: 'Coach' },
    { userId: usersByEmail['amina.demo@trainly.dev']._id, name: 'Milly Achieng', phoneNumber: '+254732345680', relationship: 'Partner' },
    { userId: usersByEmail['david.demo@trainly.dev']._id, name: 'Peter Kimani', phoneNumber: '+254742345681', relationship: 'Brother' },
  ];
}

function buildAchievement(userId, workoutId, workoutType, type, current, target) {
  const templates = Achievement.getAchievementTemplates();
  const template = templates[type];
  if (!template) throw new Error(`Missing achievement template: ${type}`);

  return {
    user: userId,
    title: template.title,
    emoji: template.emoji,
    type,
    description: template.description,
    category: template.category,
    rarity: template.rarity,
    points: template.points,
    progress: {
      current,
      target,
      percentage: 100,
    },
    workoutId,
    workoutType,
    isUnlocked: true,
    isVisible: true,
  };
}

async function resetExistingDemoData(demoEmails) {
  const existingUsers = await User.find({ email: { $in: demoEmails } }).select('_id');
  const userIds = existingUsers.map((user) => user._id);

  if (userIds.length === 0) return;

  await Promise.all([
    Achievement.deleteMany({ user: { $in: userIds } }),
    Workout.deleteMany({ userId: { $in: userIds } }),
    Post.deleteMany({ user: { $in: userIds } }),
    Contact.deleteMany({ userId: { $in: userIds } }),
    SosEvent.deleteMany({ userId: { $in: userIds } }),
    Follower.deleteMany({
      $or: [
        { follower: { $in: userIds } },
        { following: { $in: userIds } },
      ],
    }),
  ]);

  await User.deleteMany({ _id: { $in: userIds } });
}

async function createUsers() {
  const users = [];

  for (const seed of userSeeds) {
    const user = await User.create({
      ...seed,
      password: DEMO_PASSWORD,
      preferences: {
        units: 'metric',
        privacy: 'friends',
      },
    });
    users.push(user);
  }

  return users;
}

async function applyWorkoutStats(users, workouts) {
  const byUser = new Map(users.map((user) => [String(user._id), user]));
  const workoutsByUser = new Map();

  for (const workout of workouts) {
    const key = String(workout.userId);
    if (!workoutsByUser.has(key)) workoutsByUser.set(key, []);
    workoutsByUser.get(key).push(workout);
  }

  for (const [userId, userWorkouts] of workoutsByUser.entries()) {
    const user = byUser.get(userId);
    userWorkouts
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .forEach((workout) => user.updateWorkoutStats(workout));
    await user.save();
  }
}

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required to run the seed script.');
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

  const demoEmails = userSeeds.map((user) => user.email);
  await resetExistingDemoData(demoEmails);

  const users = await createUsers();
  const usersByEmail = Object.fromEntries(users.map((user) => [user.email, user]));

  const workoutSeeds = workoutSeedsByEmail(usersByEmail);
  const workouts = await Workout.insertMany(workoutSeeds);
  const workoutsBySessionId = Object.fromEntries(workouts.map((workout) => [workout.sessionId, workout]));

  await applyWorkoutStats(users, workouts);

  await Follower.insertMany(followerSeedsByEmail(usersByEmail));
  await Contact.insertMany(contactSeedsByEmail(usersByEmail));
  await Post.insertMany(postSeedsByEmail(usersByEmail, workoutsBySessionId));

  const achievements = [
    buildAchievement(
      usersByEmail['horace.demo@trainly.dev']._id,
      workoutsBySessionId[sessionId('running', 'horace_long_run')]._id,
      'Running',
      'first_workout',
      1,
      1
    ),
    buildAchievement(
      usersByEmail['horace.demo@trainly.dev']._id,
      workoutsBySessionId[sessionId('running', 'horace_long_run')]._id,
      'Running',
      'distance_10k',
      16500,
      10000
    ),
    buildAchievement(
      usersByEmail['amina.demo@trainly.dev']._id,
      workoutsBySessionId[sessionId('cycling', 'amina_commute_build')]._id,
      'Cycling',
      'first_workout',
      1,
      1
    ),
    buildAchievement(
      usersByEmail['david.demo@trainly.dev']._id,
      workoutsBySessionId[sessionId('swimming', 'david_pool_threshold')]._id,
      'Swimming',
      'first_workout',
      1,
      1
    ),
    buildAchievement(
      usersByEmail['grace.demo@trainly.dev']._id,
      workoutsBySessionId[sessionId('walking', 'grace_evening_walk')]._id,
      'Walking',
      'first_workout',
      1,
      1
    ),
  ];
  await Achievement.insertMany(achievements);

  await SosEvent.create({
    userId: usersByEmail['horace.demo@trainly.dev']._id,
    location: { latitude: -1.286389, longitude: 36.817223 },
    message: 'Demo SOS event created for reviewer walkthroughs.',
    contacts: ['+254712345678', '+254722345679'],
    results: [
      { contact: 'Grace Wanjiku', status: 'simulated' },
      { contact: 'Brian Mutiso', status: 'simulated' },
    ],
    createdAt: iso('2026-06-01T06:10:00.000Z'),
  });

  console.log('');
  console.log('Trainly demo data seeded successfully.');
  console.log('');
  console.log('Demo accounts');
  console.log(`- horace.demo@trainly.dev / ${DEMO_PASSWORD}`);
  console.log(`- amina.demo@trainly.dev / ${DEMO_PASSWORD}`);
  console.log(`- david.demo@trainly.dev / ${DEMO_PASSWORD}`);
  console.log(`- grace.demo@trainly.dev / ${DEMO_PASSWORD}`);
  console.log('');
  console.log('Created records');
  console.log(`- Users: ${users.length}`);
  console.log(`- Workouts: ${workouts.length}`);
  console.log(`- Posts: 3`);
  console.log(`- Followers: 4`);
  console.log(`- Achievements: ${achievements.length}`);
  console.log(`- Contacts: 4`);
  console.log('- SOS events: 1');
  console.log('');
  console.log('Next steps');
  console.log('- Start the API with `npm run dev`');
  console.log('- Open `/docs` for Swagger');
  console.log('- Use `src/scripts/demo-requests.http` or `docs/backend/demo.md` to exercise flows');
}

run()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close().catch(() => {});
  });
