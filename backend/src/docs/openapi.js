const config = require('../core/config');

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Trainly Backend API',
    version: '2.0.0',
    description: 'Production-oriented API documentation for the Trainly Express backend. Use the `x-auth-token` header for authenticated endpoints.',
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}`,
      description: 'Local development server',
    },
    {
      url: '/',
      description: 'Relative server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and session lifecycle' },
    { name: 'Users', description: 'User profile and directory endpoints' },
    { name: 'Workouts', description: 'Workout tracking, stats, and feed' },
    { name: 'Posts', description: 'Social posts and comments' },
    { name: 'Follows', description: 'Following and followers' },
    { name: 'Achievements', description: 'Achievement history and leaderboard' },
    { name: 'Uploads', description: 'Avatar and post image uploads' },
    { name: 'Contacts', description: 'Emergency contact management' },
    { name: 'SOS', description: 'Emergency alert dispatch' },
    { name: 'System', description: 'Operational endpoints' },
  ],
  components: {
    securitySchemes: {
      XAuthToken: {
        type: 'apiKey',
        in: 'header',
        name: 'x-auth-token',
        description: 'JWT access token returned by the auth endpoints.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          code: { type: 'string', example: 'VALIDATION_ERROR' },
          message: { type: 'string', example: 'Validation failed' },
          meta: {
            type: 'object',
            properties: {
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string', example: 'email' },
                    message: { type: 'string', example: 'Invalid email format' },
                  },
                },
              },
            },
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          currentPage: { type: 'integer', example: 1 },
          totalPages: { type: 'integer', example: 3 },
          totalAchievements: { type: 'integer', example: 42 },
          hasNextPage: { type: 'boolean', example: true },
        },
      },
      UserSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665ddc5f8d2c6fd51f0ec001' },
          name: { type: 'string', example: 'Horace Njoroge' },
          email: { type: 'string', example: 'horace@example.com' },
          avatar: { type: 'string', example: '/uploads/avatars/avatars-1234.jpg' },
        },
      },
      UserStats: {
        type: 'object',
        properties: {
          workouts: { type: 'integer', example: 24 },
          hours: { type: 'number', example: 17.5 },
          calories: { type: 'number', example: 9520 },
          totalDistance: { type: 'number', example: 68400 },
          totalDuration: { type: 'number', example: 63000 },
          currentStreak: { type: 'integer', example: 6 },
          longestStreak: { type: 'integer', example: 12 },
          followers: { type: 'integer', example: 14 },
          following: { type: 'integer', example: 9 },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665ddc5f8d2c6fd51f0ec001' },
          name: { type: 'string', example: 'Horace Njoroge' },
          email: { type: 'string', example: 'horace@example.com' },
          avatar: { type: 'string', example: '/uploads/avatars/avatars-1234.jpg' },
          stats: { $ref: '#/components/schemas/UserStats' },
          profile: {
            type: 'object',
            properties: {
              bio: { type: 'string', example: 'Runner, cyclist, and backend engineer.' },
            },
          },
          preferences: {
            type: 'object',
            properties: {
              units: { type: 'string', example: 'metric' },
              privacy: { type: 'string', example: 'friends' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      AuthResponse: {
        allOf: [
          { $ref: '#/components/schemas/AuthTokens' },
          {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/UserSummary' },
            },
          },
        ],
      },
      Workout: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665ef94b8d2c6fd51f0ec111' },
          userId: {
            oneOf: [
              { type: 'string', example: '665ddc5f8d2c6fd51f0ec001' },
              {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string', example: 'Horace Njoroge' },
                  avatar: { type: 'string', example: '/uploads/avatars/avatars-1234.jpg' },
                },
              },
            ],
          },
          sessionId: { type: 'string', example: 'running_1717493000000' },
          type: { type: 'string', example: 'Running' },
          name: { type: 'string', example: 'Morning Tempo Run' },
          duration: { type: 'number', example: 3600 },
          calories: { type: 'number', example: 640 },
          privacy: { type: 'string', example: 'public' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          notes: { type: 'string', example: 'Felt strong on the last 2km.' },
          likes: {
            type: 'array',
            items: { type: 'string' },
          },
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  oneOf: [
                    { type: 'string' },
                    {
                      type: 'object',
                      properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        avatar: { type: 'string' },
                      },
                    },
                  ],
                },
                text: { type: 'string', example: 'Great effort!' },
                date: { type: 'string', format: 'date-time' },
              },
            },
          },
          running: {
            type: 'object',
            properties: {
              distance: { type: 'number', example: 10000 },
              pace: {
                type: 'object',
                properties: {
                  average: { type: 'number', example: 5.1 },
                },
              },
            },
          },
        },
      },
      WorkoutCreateRequest: {
        type: 'object',
        required: ['type', 'duration'],
        properties: {
          sessionId: { type: 'string', example: 'running_1717493000000' },
          type: { type: 'string', enum: ['Running', 'Cycling', 'Swimming', 'Gym', 'Walking', 'Hiking'] },
          name: { type: 'string', example: 'Morning Tempo Run' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          duration: { type: 'number', example: 3600 },
          calories: { type: 'number', example: 640 },
          distance: { type: 'number', example: 10000 },
          notes: { type: 'string', example: 'Felt strong on the last 2km.' },
          privacy: { type: 'string', enum: ['public', 'friends', 'private'], example: 'public' },
          running: {
            type: 'object',
            properties: {
              distance: { type: 'number', example: 10000 },
              route: {
                type: 'object',
                properties: {
                  gpsPoints: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        latitude: { type: 'number', example: -1.286389 },
                        longitude: { type: 'number', example: 36.817223 },
                        timestamp: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      WorkoutListResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Workout' },
          },
        },
      },
      WorkoutMutationResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: { $ref: '#/components/schemas/Workout' },
        },
      },
      WorkoutStatsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: {
            type: 'object',
            properties: {
              totalWorkouts: { type: 'integer', example: 24 },
              totalDuration: { type: 'number', example: 63000 },
              totalDistance: { type: 'number', example: 68400 },
              totalCalories: { type: 'number', example: 9520 },
            },
          },
          trends: { type: 'array', items: { type: 'object' } },
          stats: { type: 'array', items: { type: 'object' } },
        },
      },
      PostComment: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665ef94b8d2c6fd51f0ec777' },
          userId: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              id: { type: 'string' },
              name: { type: 'string', example: 'Jane Doe' },
              avatar: { type: 'string', example: '/uploads/avatars/avatars-2222.jpg' },
            },
          },
          text: { type: 'string', example: 'Strong session!' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665ef94b8d2c6fd51f0ec888' },
          userId: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              id: { type: 'string' },
              name: { type: 'string', example: 'Horace Njoroge' },
              avatar: { type: 'string', example: '/uploads/avatars/avatars-1234.jpg' },
            },
          },
          content: { type: 'string', example: 'Wrapped up a long run before sunrise.' },
          image: { type: 'string', nullable: true, example: '/uploads/posts/posts-1234.jpg' },
          privacy: { type: 'string', example: 'public' },
          workoutDetails: {
            type: 'object',
            nullable: true,
            properties: {
              type: { type: 'string', example: 'Running' },
              duration: { type: 'number', example: 3600 },
              calories: { type: 'number', example: 640 },
            },
          },
          likes: { type: 'array', items: { type: 'string' } },
          comments: { type: 'array', items: { $ref: '#/components/schemas/PostComment' } },
          createdAt: { type: 'string', format: 'date-time' },
          isLiked: { type: 'boolean', example: false },
        },
      },
      PostCreateRequest: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', example: 'Wrapped up a long run before sunrise.' },
          image: { type: 'string', nullable: true, example: '/uploads/posts/posts-1234.jpg' },
          privacy: { type: 'string', enum: ['public', 'friends', 'private'], example: 'public' },
          workoutDetails: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'Running' },
              duration: { type: 'number', example: 3600 },
              calories: { type: 'number', example: 640 },
            },
          },
        },
      },
      Achievement: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665ef94b8d2c6fd51f0ec999' },
          title: { type: 'string', example: 'First Steps' },
          emoji: { type: 'string', example: '🎯' },
          type: { type: 'string', example: 'first_workout' },
          category: { type: 'string', example: 'milestone' },
          description: { type: 'string', example: 'Completed your very first workout!' },
          rarity: { type: 'string', example: 'common' },
          points: { type: 'number', example: 50 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AchievementListResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          achievements: {
            type: 'array',
            items: { $ref: '#/components/schemas/Achievement' },
          },
          pagination: { $ref: '#/components/schemas/Pagination' },
          stats: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 12 },
              points: { type: 'integer', example: 560 },
            },
          },
        },
      },
      Contact: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665ef94b8d2c6fd51f0eca10' },
          name: { type: 'string', example: 'Grace Njoroge' },
          phoneNumber: { type: 'string', example: '+254712345678' },
          relationship: { type: 'string', example: 'Sister' },
          userId: { type: 'string', example: '665ddc5f8d2c6fd51f0ec001' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ContactRequest: {
        type: 'object',
        required: ['name', 'phoneNumber'],
        properties: {
          name: { type: 'string', example: 'Grace Njoroge' },
          phoneNumber: { type: 'string', example: '+254712345678' },
          relationship: { type: 'string', example: 'Sister' },
        },
      },
      SOSRequest: {
        type: 'object',
        properties: {
          location: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: -1.286389 },
              longitude: { type: 'number', example: 36.817223 },
            },
          },
          message: { type: 'string', example: 'I need assistance near Uhuru Park.' },
        },
      },
      SOSResponse: {
        type: 'object',
        properties: {
          sent: { type: 'boolean', example: true },
          contacts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                contact: { type: 'string', example: 'Grace Njoroge' },
                status: { type: 'string', example: 'queued' },
                error: { type: 'string', nullable: true, example: null },
              },
            },
          },
        },
      },
      UploadResponse: {
        type: 'object',
        properties: {
          url: { type: 'string', example: '/uploads/avatars/avatars-fb87b2d8.jpg' },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User followed successfully' },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          time: { type: 'string', format: 'date-time' },
          environment: { type: 'string', example: 'development' },
          version: { type: 'string', example: '2.0.0' },
          uptimeSeconds: { type: 'integer', example: 128 },
          database: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'connected' },
              readyState: { type: 'integer', example: 1 },
            },
          },
          redis: {
            type: 'object',
            properties: {
              enabled: { type: 'boolean', example: false },
              connected: { type: 'boolean', example: false },
            },
          },
          storage: {
            type: 'object',
            properties: {
              configuredType: { type: 'string', example: 'local' },
              activeMode: { type: 'string', example: 'local' },
              publicBasePath: { type: 'string', example: '/uploads' },
            },
          },
          observability: {
            type: 'object',
            properties: {
              traceHeader: { type: 'string', example: 'x-trace-id' },
              metricsEndpoint: { type: 'string', example: '/metrics' },
              docsEndpoint: { type: 'string', example: '/docs' },
            },
          },
          metrics: {
            type: 'object',
            properties: {
              requestsTotal: { type: 'integer', example: 42 },
              errorsTotal: { type: 'integer', example: 2 },
              averageRequestDurationMs: { type: 'number', example: 18.45 },
              uploadsSuccessTotal: { type: 'integer', example: 4 },
              uploadsFailureTotal: { type: 'integer', example: 1 },
              cacheHitsTotal: { type: 'integer', example: 10 },
              cacheMissesTotal: { type: 'integer', example: 7 },
              cacheErrorsTotal: { type: 'integer', example: 0 },
              cacheSkipsTotal: { type: 'integer', example: 12 },
            },
          },
          memory: {
            type: 'object',
            properties: {
              rss: { type: 'integer', example: 73400320 },
              heapTotal: { type: 'integer', example: 33554432 },
              heapUsed: { type: 'integer', example: 21495808 },
              external: { type: 'integer', example: 1827341 },
            },
          },
          host: {
            type: 'object',
            properties: {
              platform: { type: 'string', example: 'darwin' },
              nodeVersion: { type: 'string', example: 'v18.20.4' },
              hostname: { type: 'string', example: 'trainly-dev' },
            },
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad request or validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      Unauthorized: {
        description: 'Missing or invalid auth token',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Backend health status',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/metrics': {
      get: {
        tags: ['System'],
        summary: 'Prometheus-style metrics endpoint',
        responses: {
          200: {
            description: 'Plaintext metrics output',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: '# HELP trainly_requests_total Total HTTP requests processed\n# TYPE trainly_requests_total counter\ntrainly_requests_total 42',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Horace Njoroge' },
                  email: { type: 'string', format: 'email', example: 'horace@example.com' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'horace@example.com' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rotate access and refresh tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Fresh token pair',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokens' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/user': {
      get: {
        tags: ['Auth'],
        summary: 'Get the currently authenticated user',
        security: [{ XAuthToken: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and optionally blacklist a token JTI',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tokenJti: { type: 'string', example: '9d5bbd7d-227e-40c9-b27e-6b2d02c3fdab' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Logout success',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessageResponse' },
              },
            },
          },
        },
      },
    },
    '/api/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get the authenticated user profile',
        security: [{ XAuthToken: [] }],
        responses: {
          200: {
            description: 'Profile',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } },
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update basic profile fields',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Horace Njoroge' },
                  bio: { type: 'string', example: 'Runner, cyclist, and backend engineer.' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated profile',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/users/stats': {
      put: {
        tags: ['Users'],
        summary: 'Replace user stats object',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserStats' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated stats',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserStats' } } },
          },
        },
      },
    },
    '/api/users/fullprofile': {
      get: {
        tags: ['Users'],
        summary: 'Get profile with achievements and social counts',
        security: [{ XAuthToken: [] }],
        responses: {
          200: {
            description: 'Expanded profile',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } },
          },
        },
      },
    },
    '/api/users/search': {
      get: {
        tags: ['Users'],
        summary: 'Search users by query string',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' }, example: 'horace' },
        ],
        responses: {
          200: {
            description: 'Matching users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/UserSummary' },
                },
              },
            },
          },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by id',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'User record',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/users/followers': {
      get: {
        tags: ['Users'],
        summary: 'List followers for the current user or another user',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'userId', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Follower list',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/UserSummary' } },
              },
            },
          },
        },
      },
    },
    '/api/users/following': {
      get: {
        tags: ['Users'],
        summary: 'List accounts a user is following',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'userId', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Following list',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/UserSummary' } },
              },
            },
          },
        },
      },
    },
    '/api/users/achievements': {
      get: {
        tags: ['Users', 'Achievements'],
        summary: 'List achievements through the user profile surface',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'category', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Achievement list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AchievementListResponse' } } },
          },
        },
      },
    },
    '/api/workouts': {
      get: {
        tags: ['Workouts'],
        summary: 'List workouts for the authenticated user',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'type', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', required: false, schema: { type: 'string', format: 'date-time' } },
          { name: 'sortBy', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'sortOrder', in: 'query', required: false, schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: {
          200: {
            description: 'Workout list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutListResponse' } } },
          },
        },
      },
      post: {
        tags: ['Workouts'],
        summary: 'Create a workout',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkoutCreateRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Workout created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutMutationResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/workouts/public/feed': {
      get: {
        tags: ['Workouts'],
        summary: 'List public workouts for the social feed',
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Public workout feed',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutListResponse' } } },
          },
        },
      },
    },
    '/api/workouts/stats/summary': {
      get: {
        tags: ['Workouts'],
        summary: 'Get aggregate workout stats',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'period', in: 'query', required: false, schema: { type: 'string', enum: ['week', 'month', 'year', 'all'] } },
        ],
        responses: {
          200: {
            description: 'Stats summary',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutStatsResponse' } } },
          },
        },
      },
    },
    '/api/workouts/{id}': {
      get: {
        tags: ['Workouts'],
        summary: 'Get a workout by id',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Workout record',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutMutationResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Workouts'],
        summary: 'Update a workout',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkoutCreateRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated workout',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutMutationResponse' } } },
          },
        },
      },
      delete: {
        tags: ['Workouts'],
        summary: 'Delete a workout',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Deletion response',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
        },
      },
    },
    '/api/workouts/{id}/like': {
      post: {
        tags: ['Workouts'],
        summary: 'Toggle like on a workout',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Updated workout',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutMutationResponse' } } },
          },
        },
      },
    },
    '/api/workouts/{id}/comments': {
      post: {
        tags: ['Workouts'],
        summary: 'Add a comment to a workout',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: { type: 'string', example: 'Great pacing all the way through.' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated workout',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutMutationResponse' } } },
          },
        },
      },
    },
    '/api/posts': {
      get: {
        tags: ['Posts'],
        summary: 'List posts for the feed',
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Feed posts',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Create a social post',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostCreateRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created post',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
          },
        },
      },
    },
    '/api/posts/{id}/like': {
      put: {
        tags: ['Posts'],
        summary: 'Toggle like on a post',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Updated post',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
          },
        },
      },
    },
    '/api/posts/{id}/comments': {
      get: {
        tags: ['Posts'],
        summary: 'List comments for a post',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Post comments',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/PostComment' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Add a comment to a post',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: { type: 'string', example: 'That sunrise run looks amazing.' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Created comment',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PostComment' } } },
          },
        },
      },
    },
    '/api/follow/{userId}': {
      post: {
        tags: ['Follows'],
        summary: 'Follow a user',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Followed',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
        },
      },
      delete: {
        tags: ['Follows'],
        summary: 'Unfollow a user',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Unfollowed',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
        },
      },
    },
    '/api/follow/followers': {
      get: {
        tags: ['Follows'],
        summary: 'List followers',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'userId', in: 'query', required: false, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Followers',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserSummary' } } } },
          },
        },
      },
    },
    '/api/follow/following': {
      get: {
        tags: ['Follows'],
        summary: 'List following',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'userId', in: 'query', required: false, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Following',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserSummary' } } } },
          },
        },
      },
    },
    '/api/achievements': {
      get: {
        tags: ['Achievements'],
        summary: 'List achievements for the current user',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'category', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'sortBy', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'sortOrder', in: 'query', required: false, schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: {
          200: {
            description: 'Achievement history',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AchievementListResponse' } } },
          },
        },
      },
    },
    '/api/achievements/progress': {
      get: {
        tags: ['Achievements'],
        summary: 'Get achievement progress payload',
        security: [{ XAuthToken: [] }],
        responses: {
          200: {
            description: 'Achievement progress',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AchievementListResponse' } } },
          },
        },
      },
    },
    '/api/achievements/leaderboard': {
      get: {
        tags: ['Achievements'],
        summary: 'Get the achievement leaderboard',
        security: [{ XAuthToken: [] }],
        parameters: [
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Leaderboard',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string' },
                          totalPoints: { type: 'number', example: 1200 },
                          achievements: { type: 'integer', example: 18 },
                          user: { $ref: '#/components/schemas/UserSummary' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/uploads/avatar': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload an avatar image',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Uploaded avatar URL',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UploadResponse' } } },
          },
        },
      },
    },
    '/api/uploads/post': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload a post image',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Uploaded post image URL',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UploadResponse' } } },
          },
        },
      },
    },
    '/api/contacts': {
      get: {
        tags: ['Contacts'],
        summary: 'List emergency contacts',
        security: [{ XAuthToken: [] }],
        responses: {
          200: {
            description: 'Contact list',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Contact' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Contacts'],
        summary: 'Create an emergency contact',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created contact',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } },
          },
        },
      },
    },
    '/api/contacts/{id}': {
      put: {
        tags: ['Contacts'],
        summary: 'Update an emergency contact',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated contact',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } },
          },
        },
      },
      delete: {
        tags: ['Contacts'],
        summary: 'Delete an emergency contact',
        security: [{ XAuthToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Deletion response',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
        },
      },
    },
    '/api/contacts/send-sos': {
      post: {
        tags: ['SOS'],
        summary: 'Send an SOS alert to emergency contacts',
        security: [{ XAuthToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SOSRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'SOS delivery result',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SOSResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
};

module.exports = openApiDocument;
