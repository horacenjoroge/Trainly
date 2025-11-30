// hooks/useStatsScreen.js
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutAPI } from '../services/workoutAPI';
import { log, logError, logWarn } from '../utils/logger';

/**
 * Custom hook for managing stats screen state and data fetching.
 * 
 * @param {Object} navigation - React Navigation navigation object
 * @param {string} selectedPeriod - Selected time period ('week', 'month', 'year', 'all')
 * @returns {Object} Stats screen state and functions
 */
export const useStatsScreen = (navigation, selectedPeriod) => {
  // State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  /**
   * Calculates statistics from workout data.
   * 
   * @param {Array} workouts - Array of workout objects
   * @param {string} period - Time period filter
   * @param {Array} achievements - Current achievements array
   * @returns {Object} Calculated stats object
   */
  const calculateStatsFromWorkouts = useCallback((workouts, period, achievements = []) => {
    log('calculateStatsFromWorkouts called with:', {
      workoutCount: workouts?.length || 0,
      period,
      sampleWorkout: workouts?.[0]
    });

    if (!workouts || workouts.length === 0) {
      log('No workouts to calculate stats from');
      return {
        summary: { totalWorkouts: 0, totalDuration: 0, totalDistance: 0, totalCalories: 0 },
        stats: [],
        trends: [],
        personalBests: {},
        recentAchievements: []
      };
    }

    // Filter workouts by period
    const now = new Date();
    const filteredWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date || workout.startTime || workout.endTime);
      
      if (isNaN(workoutDate.getTime())) {
        logWarn('Invalid workout date found:', workout);
        return false;
      }

      switch (period) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return workoutDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return workoutDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return workoutDate >= yearAgo;
        default:
          return true;
      }
    });

    log('Filtered workouts:', {
      originalCount: workouts.length,
      filteredCount: filteredWorkouts.length,
      period
    });

    // Calculate summary
    const summary = {
      totalWorkouts: filteredWorkouts.length,
      totalDuration: filteredWorkouts.reduce((sum, w) => {
        const duration = w.duration || 0;
        return sum + duration;
      }, 0),
      totalDistance: filteredWorkouts.reduce((sum, w) => {
        // Check multiple possible distance fields
        const distance = w.totalDistance || w.distance || 
                        (w.running?.distance) || 
                        (w.cycling?.distance) || 
                        (w.swimming?.distance) || 0;
        return sum + distance;
      }, 0),
      totalCalories: filteredWorkouts.reduce((sum, w) => {
        const calories = w.calories || 0;
        return sum + calories;
      }, 0)
    };

    log('Calculated summary:', summary);

    // Calculate workout type distribution
    const typeStats = {};
    filteredWorkouts.forEach(workout => {
      const type = workout.type || 'Unknown';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });

    log('Type stats:', typeStats);

    const statsArray = Object.entries(typeStats).map(([type, count]) => ({
      _id: type,
      count
    }));

    // Calculate trends (last 7 days)
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date || w.startTime || w.endTime);
        return workoutDate.toDateString() === date.toDateString();
      });
      
      trends.push({
        _id: date.toISOString(),
        count: dayWorkouts.length,
        totalCalories: dayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0)
      });
    }

    log('Calculated trends:', trends);

    // Calculate personal bests
    const personalBests = {};
    ['Swimming', 'Running', 'Cycling', 'Gym'].forEach(type => {
      const typeWorkouts = workouts.filter(w => w.type === type);
      if (typeWorkouts.length > 0) {
        personalBests[type] = {
          longestDuration: Math.max(...typeWorkouts.map(w => w.duration || 0)),
          longestDistance: Math.max(...typeWorkouts.map(w => {
            return w.totalDistance || w.distance || 
                   (w[type.toLowerCase()]?.distance) || 0;
          })),
          mostCalories: Math.max(...typeWorkouts.map(w => w.calories || 0))
        };
      }
    });

    log('Personal bests:', personalBests);

    const result = {
      summary,
      stats: statsArray,
      trends,
      personalBests,
      recentAchievements: achievements.slice(0, 3)
    };

    log('Final calculated stats:', result);
    return result;
  }, []);

  /**
   * Loads workout history from AsyncStorage.
   */
  const loadWorkoutHistory = useCallback(async () => {
    try {
      log('Loading workout history from AsyncStorage...');
      const historyData = await AsyncStorage.getItem('workoutHistory');
      
      if (historyData) {
        const workouts = JSON.parse(historyData);
        log('Loaded workout history:', {
          count: workouts.length,
          types: [...new Set(workouts.map(w => w.type))],
          recentWorkout: workouts[workouts.length - 1]
        });
        setWorkoutHistory(workouts);
      } else {
        log('No workout history found in AsyncStorage');
        setWorkoutHistory([]);
      }
    } catch (error) {
      logError('Error loading workout history:', error);
      setWorkoutHistory([]);
    }
  }, []);

  /**
   * Loads achievements from API or AsyncStorage.
   */
  const loadAchievements = useCallback(async () => {
    try {
      // Try to load from API first
      const achievementsData = await workoutAPI.getRecentAchievements(30);
      if (achievementsData && achievementsData.length > 0) {
        setAchievements(achievementsData);
      } else {
        // Fallback to local achievements
        const localAchievements = await AsyncStorage.getItem('achievements');
        if (localAchievements) {
          setAchievements(JSON.parse(localAchievements));
        }
      }
    } catch (error) {
      logError('Error loading achievements:', error);
      // Load from AsyncStorage as fallback
      try {
        const localAchievements = await AsyncStorage.getItem('achievements');
        if (localAchievements) {
          setAchievements(JSON.parse(localAchievements));
        }
      } catch (localError) {
        logError('Error loading local achievements:', localError);
      }
    }
  }, []);

  /**
   * Loads stats from API or calculates from local data.
   */
  const loadStats = useCallback(async () => {
    log('=== LOADING STATS DEBUG START ===');
    setLoading(true);
    
    try {
      // Try to load from API first
      log('Attempting to load stats from API for period:', selectedPeriod);
      
      try {
        const response = await workoutAPI.getWorkoutStats(selectedPeriod);
        log('API Response:', response);
        
        if (response.status === 'success' && response.data) {
          log('Successfully loaded stats from API');
          
          // Better handling of API response
          const apiStats = {
            summary: response.data.summary || {
              totalWorkouts: 0,
              totalDuration: 0,
              totalDistance: 0,
              totalCalories: 0
            },
            stats: response.data.stats || [],
            trends: response.data.trends || [],
            personalBests: response.data.personalBests || {},
            recentAchievements: response.data.recentAchievements || []
          };
          
          log('Formatted API stats:', {
            summaryValid: !!apiStats.summary,
            statsCount: apiStats.stats.length,
            trendsCount: apiStats.trends.length,
            personalBestsKeys: Object.keys(apiStats.personalBests),
            achievementsCount: apiStats.recentAchievements.length
          });
          
          setStats(apiStats);
          setDebugInfo(`API: ${apiStats.stats.length} types, ${apiStats.trends.length} trends`);
          
          setLoading(false);
          log('=== LOADING STATS DEBUG END (API SUCCESS) ===');
          return; // Exit early on success
        } else {
          log('API response was not successful:', response);
          setDebugInfo('API response failed');
        }
      } catch (apiError) {
        log('API error, falling back to local data:', apiError.message);
        setDebugInfo(`API Error: ${apiError.message}`);
      }

      // Fallback to local calculation
      try {
        const historyData = await AsyncStorage.getItem('workoutHistory');
        if (historyData) {
          const workouts = JSON.parse(historyData);
          log('Calculating stats from local data:', workouts.length, 'workouts');
          const calculatedStats = calculateStatsFromWorkouts(workouts, selectedPeriod, achievements);
          setStats(calculatedStats);
          setDebugInfo(`Local: ${workouts.length} workouts`);
        } else {
          // No data available
          setStats({
            summary: { totalWorkouts: 0, totalDuration: 0, totalDistance: 0, totalCalories: 0 },
            stats: [],
            trends: [],
            personalBests: {},
            recentAchievements: []
          });
          setDebugInfo('No data found');
        }
      } catch (error) {
        logError('Error loading stats:', error);
        setDebugInfo(`Error: ${error.message}`);
        // Set empty stats on error
        setStats({
          summary: { totalWorkouts: 0, totalDuration: 0, totalDistance: 0, totalCalories: 0 },
          stats: [],
          trends: [],
          personalBests: {},
          recentAchievements: []
        });
      }
    } catch (error) {
      logError('Unexpected error in loadStats:', error);
      setDebugInfo(`Unexpected error: ${error.message}`);
      // Set empty stats on error
      setStats({
        summary: { totalWorkouts: 0, totalDuration: 0, totalDistance: 0, totalCalories: 0 },
        stats: [],
        trends: [],
        personalBests: {},
        recentAchievements: []
      });
    } finally {
      // Always set loading to false in finally block
      setLoading(false);
      log('=== LOADING STATS DEBUG END ===');
    }
  }, [selectedPeriod, calculateStatsFromWorkouts, achievements]);

  // Load stats when period changes
  useEffect(() => {
    loadStats();
    loadWorkoutHistory();
    loadAchievements();
  }, [selectedPeriod, loadStats, loadWorkoutHistory, loadAchievements]);

  // Add focus listener to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      log('Stats screen focused - refreshing data');
      loadStats();
      loadWorkoutHistory();
      loadAchievements();
    });
    return unsubscribe;
  }, [navigation, selectedPeriod, loadStats, loadWorkoutHistory, loadAchievements]);

  return {
    stats,
    loading,
    workoutHistory,
    achievements,
    debugInfo,
    loadStats,
    loadWorkoutHistory,
    loadAchievements,
  };
};

