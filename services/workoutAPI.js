// services/workoutAPI.js - Complete Workout API Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api'; // Your existing API client

export const workoutAPI = {
  // Create a new workout
  createWorkout: async (workoutData) => {
    try {
      console.log('Creating workout with data:', workoutData);
      const response = await apiClient.post('/workouts', workoutData);
      console.log('Workout created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },

  // Get user's workouts with optional filters
  getWorkouts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/workouts${queryString ? `?${queryString}` : ''}`);
      console.log('Workouts fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },

  // Get single workout by ID
  getWorkout: async (id) => {
    try {
      const response = await apiClient.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout:', error);
      throw error;
    }
  },

  // Update workout (name, notes, privacy)
  updateWorkout: async (id, updateData) => {
    try {
      const response = await apiClient.patch(`/workouts/${id}`, updateData);
      console.log('Workout updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },

  // Delete workout
  deleteWorkout: async (id) => {
    try {
      const response = await apiClient.delete(`/workouts/${id}`);
      console.log('Workout deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  // Get workout statistics
  getWorkoutStats: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/workouts/stats/summary?period=${period}`);
      console.log('Workout stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout stats:', error);
      throw error;
    }
  },

  // Get public workouts feed (social feature)
  getPublicWorkouts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/workouts/public/feed${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public workouts:', error);
      throw error;
    }
  },

  // Like/unlike workout
  toggleLike: async (id) => {
    try {
      const response = await apiClient.post(`/workouts/${id}/like`);
      console.log('Workout like toggled:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error toggling workout like:', error);
      throw error;
    }
  },

  // Add comment to workout
  addComment: async (id, text) => {
    try {
      const response = await apiClient.post(`/workouts/${id}/comments`, { text });
      console.log('Comment added:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get user's achievements (integrated with workouts)
  getAchievements: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/achievements${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  // Get recent achievements
  getRecentAchievements: async (days = 7) => {
    try {
      const response = await apiClient.get(`/achievements/recent?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent achievements:', error);
      throw error;
    }
  },

  // Get achievement progress
  getAchievementProgress: async () => {
    try {
      const response = await apiClient.get('/achievements/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievement progress:', error);
      throw error;
    }
  },

  // Share achievement
  shareAchievement: async (achievementId) => {
    try {
      const response = await apiClient.post(`/achievements/${achievementId}/share`);
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
      const response = await apiClient.get(`/achievements/leaderboard${queryString ? `?${queryString}` : ''}`);
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
      console.error('Error getting current user ID:', error);
      return null;
    }
  },

  // Helper method to format workout data for different activity types
  formatWorkoutData: (activityType, trackerData, userPreferences = {}) => {
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
    };

    // Add activity-specific data
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

  // Helper to save workout with proper user authentication
  saveWorkout: async (activityType, trackerData, userPreferences = {}) => {
    try {
      // Get current user ID
      const userId = await workoutAPI.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated. Please login again.');
      }

      // Format workout data
      const workoutData = workoutAPI.formatWorkoutData(activityType, trackerData, userPreferences);

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
      console.error('Error saving workout:', error);
      throw error;
    }
  },
};