// services/workoutAPI.js - Complete Workout API Service (FIXED)
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api'; // Your existing API client
import { log, logError } from '../utils/logger';

export const workoutAPI = {
  // Create a new workout
  createWorkout: async (workoutData) => {
    try {
      log('Creating workout with data:', workoutData);
      const response = await apiClient.post('/api/workouts', workoutData);
      log('Workout created successfully:', response.data);
      return response.data;
    } catch (error) {
      logError('Error creating workout:', error);
      
      // ADD THIS - Log the full error response
      if (error.response) {
        logError('API Error Details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
      
      throw error;
    }
  },

  // Get user's workouts with optional filters
  getWorkouts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/api/workouts${queryString ? `?${queryString}` : ''}`);
      log('Workouts fetched:', response.data);
      return response.data;
    } catch (error) {
      logError('Error fetching workouts:', error);
      throw error;
    }
  },

  // Get single workout by ID
  getWorkout: async (id) => {
    try {
      const response = await apiClient.get(`/api/workouts/${id}`);
      return response.data;
    } catch (error) {
      logError('Error fetching workout:', error);
      throw error;
    }
  },

  // Update workout (name, notes, privacy)
  updateWorkout: async (id, updateData) => {
    try {
      const response = await apiClient.patch(`/api/workouts/${id}`, updateData);
      log('Workout updated:', response.data);
      return response.data;
    } catch (error) {
      logError('Error updating workout:', error);
      throw error;
    }
  },

  // Delete workout
  deleteWorkout: async (id) => {
    try {
      const response = await apiClient.delete(`/api/workouts/${id}`);
      log('Workout deleted:', response.data);
      return response.data;
    } catch (error) {
      logError('Error deleting workout:', error);
      throw error;
    }
  },

  // Get workout statistics
  getWorkoutStats: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/api/workouts/stats/summary?period=${period}`);
      log('Workout stats:', response.data);
      return response.data;
    } catch (error) {
      logError('Error fetching workout stats:', error);
      throw error;
    }
  },

  // Get public workouts feed (social feature)
  getPublicWorkouts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/api/workouts/public/feed${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      logError('Error fetching public workouts:', error);
      throw error;
    }
  },

  // Like/unlike workout
  toggleLike: async (id) => {
    try {
      const response = await apiClient.post(`/api/workouts/${id}/like`);
      log('Workout like toggled:', response.data);
      return response.data;
    } catch (error) {
      logError('Error toggling workout like:', error);
      throw error;
    }
  },

  // Add comment to workout
  addComment: async (id, text) => {
    try {
      const response = await apiClient.post(`/api/workouts/${id}/comments`, { text });
      log('Comment added:', response.data);
      return response.data;
    } catch (error) {
      logError('Error adding comment:', error);
      throw error;
    }
  },

  // Get user's achievements (integrated with workouts)
  getAchievements: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/api/achievements${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  // Get recent achievements
  getRecentAchievements: async (days = 7) => {
    try {
      const response = await apiClient.get(`/api/achievements/recent?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent achievements:', error);
      throw error;
    }
  },

  // Get achievement progress
  getAchievementProgress: async () => {
    try {
      const response = await apiClient.get('/api/achievements/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievement progress:', error);
      throw error;
    }
  },

  // Share achievement
  shareAchievement: async (achievementId) => {
    try {
      const response = await apiClient.post(`/api/achievements/${achievementId}/share`);
      return response.data;
    } catch (error) {
      console.error('Error sharing achievement:', error);
      throw error;
    }
  },

  // Get achievement leaderboard
  getLeaderboard: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/api/achievements/leaderboard${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Helper method to get current user ID from AsyncStorage
  getCurrentUserId: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user._id || user.id || user.userId;
      }
      return null;
    } catch (error) {
      logError('Error getting current user ID:', error);
      return null;
    }
  },

  // FIXED: Helper method to format workout data for different activity types
  formatWorkoutData: (activityType, trackerData, userPreferences = {}) => {
    log('formatWorkoutData input:', { activityType, trackerData });
    
    // CRITICAL FIX: Extract and preserve sessionId and userId
    const sessionId = trackerData.sessionId;
    const userId = trackerData.userId;
    
    if (!sessionId) {
      logError('WARNING: sessionId is missing from trackerData');
    }
    
    if (!userId) {
      logError('WARNING: userId is missing from trackerData');
    }
    
    // Check if trackerData already has the correct structure (from RunningTracker.prepareWorkoutData)
    if (trackerData.running || trackerData.cycling || trackerData.swimming || trackerData.gym) {
      log('Data already formatted by tracker, using as-is');
      return {
        ...trackerData,
        // CRITICAL FIX: Ensure sessionId and userId are preserved
        sessionId: sessionId,
        userId: userId,
        // Only override privacy if not already set
        privacy: trackerData.privacy || userPreferences.privacy || 'public',
      };
    }

    // Legacy format support - convert flat structure to nested
    log('Converting legacy flat structure to nested format');
    
    const baseWorkout = {
      type: activityType,
      name: trackerData.name || `${activityType} Session`,
      startTime: trackerData.startTime || new Date(Date.now() - (trackerData.duration * 1000)),
      endTime: trackerData.endTime || new Date(),
      duration: Math.floor(trackerData.duration || 0),
      calories: Math.round(trackerData.calories || workoutAPI.estimateCalories(activityType, trackerData.duration || 0)),
      notes: trackerData.notes || '',
      privacy: userPreferences.privacy || 'public',
      location: trackerData.location || null,
      // CRITICAL FIX: Always preserve sessionId and userId at root level
      sessionId: sessionId,
      userId: userId,
    };

    // Add activity-specific data for legacy flat structure
    switch (activityType) {
      case 'Running':
        return {
          ...baseWorkout,
          running: {
            distance: trackerData.distance || 0,
            pace: {
              average: trackerData.averagePace || 0,
              best: trackerData.bestPace || 0,
              current: trackerData.currentPace || 0,
            },
            speed: {
              average: trackerData.averageSpeed || 0,
              max: trackerData.maxSpeed || 0,
              current: trackerData.currentSpeed || 0,
            },
            elevation: trackerData.elevation || { gain: 0, loss: 0, current: 0 },
            splits: trackerData.splits || [],
            route: {
              gpsPoints: trackerData.gpsPoints || [],
              totalPoints: (trackerData.gpsPoints || []).length,
              polyline: trackerData.polyline || '',
              boundingBox: trackerData.boundingBox || null,
            },
            heartRate: trackerData.heartRate || {},
            performance: {
              averageMovingSpeed: trackerData.averageMovingSpeed || trackerData.averageSpeed || 0,
              movingTime: trackerData.movingTime || trackerData.duration || 0,
              stoppedTime: trackerData.stoppedTime || 0,
              maxPace: trackerData.maxPace || 0,
              minPace: trackerData.minPace || 0,
            },
          },
        };

      case 'Cycling':
        return {
          ...baseWorkout,
          cycling: {
            distance: trackerData.distance || 0,
            speed: {
              average: trackerData.avgSpeed || 0,
              max: trackerData.maxSpeed || 0,
              current: trackerData.currentSpeed || 0,
            },
            elevation: trackerData.elevation || { gain: 0, loss: 0, current: 0 },
            segments: trackerData.segments || [],
            intervals: trackerData.intervals || [],
            route: {
              gpsPoints: trackerData.route || trackerData.gpsPoints || [],
              totalPoints: (trackerData.route || trackerData.gpsPoints || []).length,
              polyline: trackerData.polyline || '',
              boundingBox: trackerData.boundingBox || null,
            },
            performance: {
              averageMovingSpeed: trackerData.averageMovingSpeed || trackerData.avgSpeed || 0,
              movingTime: trackerData.movingTime || trackerData.duration || 0,
              stoppedTime: trackerData.stoppedTime || 0,
            },
          },
        };

      case 'Swimming':
        return {
          ...baseWorkout,
          swimming: {
            poolLength: trackerData.poolLength || 25,
            distance: trackerData.totalDistance || 0,
            strokeType: trackerData.strokeType || 'Freestyle',
            laps: trackerData.laps || [],
            intervals: trackerData.intervals || [],
            technique: {
              averageStrokeRate: trackerData.avgStrokeRate || 0,
              averageSwolf: trackerData.avgSwolf || 0,
              efficiency: trackerData.efficiency || 0,
            },
            restPeriods: trackerData.restPeriods || [],
          },
        };

      case 'Gym':
        return {
          ...baseWorkout,
          gym: {
            exercises: trackerData.exercises || [],
            stats: {
              totalSets: trackerData.totalSets || 0,
              totalReps: trackerData.totalReps || 0,
              totalWeight: trackerData.totalWeight || 0,
              exerciseCount: (trackerData.exercises || []).length,
              muscleGroups: trackerData.muscleGroups || [],
              averageRestTime: trackerData.averageRestTime || 60,
            },
          },
        };

      default:
        return baseWorkout;
    }
  },

  // Helper to calculate estimated calories (backup if tracker doesn't provide)
  estimateCalories: (activityType, duration, weight = 70) => {
    const caloriesPerMinute = {
      'Running': 12,
      'Cycling': 8,
      'Swimming': 11,
      'Gym': 6,
      'Walking': 4,
      'Hiking': 7,
    };

    const minutes = duration / 60;
    const baseCalories = (caloriesPerMinute[activityType] || 5) * minutes;
    
    // Adjust for weight (70kg baseline)
    return Math.round(baseCalories * (weight / 70));
  },

  // FIXED: Helper to save workout with proper user authentication
  saveWorkout: async (activityType, trackerData, userPreferences = {}) => {
    try {
      log('saveWorkout called with:', { activityType, trackerData });
      
      // CRITICAL: Validate required fields before processing
      if (!trackerData.sessionId) {
        throw new Error('sessionId is required for workout creation');
      }
      
      // Check if data already has userId (from tracker)
      if (!trackerData.userId) {
        // Get current user ID only if not provided by tracker
        const userId = await workoutAPI.getCurrentUserId();
        if (!userId) {
          throw new Error('User not authenticated. Please login again.');
        }
        trackerData.userId = userId;
      }

      // Format workout data (this now preserves existing structure including sessionId)
      const workoutData = workoutAPI.formatWorkoutData(activityType, trackerData, userPreferences);
      
      // CRITICAL FIX: Double-check that sessionId and userId are preserved
      if (!workoutData.sessionId) {
        logError('CRITICAL ERROR: sessionId was lost during formatting!');
        workoutData.sessionId = trackerData.sessionId;
      }
      
      if (!workoutData.userId) {
        logError('CRITICAL ERROR: userId was lost during formatting!');
        workoutData.userId = trackerData.userId;
      }
      
      log('Final formatted workout data:', workoutData);

      // Add location if available
      if (trackerData.currentLocation) {
        workoutData.location = {
          coordinates: {
            latitude: trackerData.currentLocation.latitude,
            longitude: trackerData.currentLocation.longitude,
          },
        };
      }

      // Save to backend
      const response = await workoutAPI.createWorkout(workoutData);

      if (response.status === 'success') {
        return {
          success: true,
          workout: response.data.workout,
          achievements: response.data.achievementsEarned || [],
          message: `${activityType} session saved successfully!`
        };
      } else {
        throw new Error(response.message || 'Failed to save workout');
      }
    } catch (error) {
      logError('Error saving workout:', error);
      
      // ENHANCED ERROR HANDLING: Provide more specific error messages
      if (error.response?.data) {
        logError('API Error Details:', error.response.data);
        return {
          success: false,
          error: error.response.data.message || error.message
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to save workout'
      };
    }
  },
};