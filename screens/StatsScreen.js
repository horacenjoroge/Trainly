// screens/StatsScreen.js - Enhanced Analytics Dashboard
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutAPI } from '../services/workoutAPI';
import { log, logError, logWarn } from '../utils/logger';
import StatCard from '../components/stats/StatCard';
import { formatDuration, formatDistance } from '../utils/formatUtils';
import WorkoutTypeChart from '../components/stats/WorkoutTypeChart';
import ActivityTrendChart from '../components/stats/ActivityTrendChart';
import CaloriesChart from '../components/stats/CaloriesChart';


const StatsScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'all', label: 'All Time' },
  ];

  // Enhanced loadStats with better API handling and debugging
  // Fixed loadStats function - Replace your existing loadStats function with this

const loadStats = async () => {
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
        
        // FIXED: Better handling of API response
        const apiStats = {
          summary: response.data.summary || {
            totalWorkouts: 0,
            totalDuration: 0,
            totalDistance: 0,
            totalCalories: 0
          },
          stats: response.data.stats || [], // These should now have data
          trends: response.data.trends || [], // These should now have data
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
        
        // CRITICAL FIX: Set loading to false here
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
        const calculatedStats = calculateStatsFromWorkouts(workouts, selectedPeriod);
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
    // CRITICAL FIX: Always set loading to false in finally block
    setLoading(false);
    log('=== LOADING STATS DEBUG END ===');
  }
};

  // Load stats from AsyncStorage and API
  useEffect(() => {
    loadStats();
    loadWorkoutHistory();
    loadAchievements();
  }, [selectedPeriod]);

  // Add focus listener to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      log('Stats screen focused - refreshing data');
      loadStats();
      loadWorkoutHistory();
      loadAchievements();
    });
    return unsubscribe;
  }, [navigation, selectedPeriod]);

  const loadWorkoutHistory = async () => {
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
  };

  const loadAchievements = async () => {
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
  };

  // Enhanced calculateStatsFromWorkouts with debugging
  const calculateStatsFromWorkouts = (workouts, period) => {
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

    const stats = Object.entries(typeStats).map(([type, count]) => ({
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
      stats,
      trends,
      personalBests,
      recentAchievements: achievements.slice(0, 3)
    };

    log('Final calculated stats:', result);
    return result;
  };


  // Prepare chart data
  const prepareWorkoutTypeData = () => {
    if (!stats?.stats || stats.stats.length === 0) return [];
    
    const workoutColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
    ];

    return stats.stats.map((stat, index) => ({
      name: stat._id,
      population: stat.count,
      color: workoutColors[index % workoutColors.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const prepareTrendsData = () => {
    if (!stats?.trends || stats.trends.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [0],
          color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
          strokeWidth: 2,
        }]
      };
    }

    const labels = stats.trends.map(trend => {
      const date = new Date(trend._id);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    return {
      labels,
      datasets: [
        {
          data: stats.trends.map(trend => trend.count),
          color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
          strokeWidth: 2,
        }
      ]
    };
  };

  const prepareCaloriesData = () => {
    if (!stats?.trends || stats.trends.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [0],
        }]
      };
    }

    return {
      labels: stats.trends.map(trend => {
        const date = new Date(trend._id);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{
        data: stats.trends.map(trend => trend.totalCalories || 0),
      }]
    };
  };

  // Debug component for development
  const DebugSection = () => {
    if (!__DEV__) return null;
    
    return (
      <View style={[styles.debugContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.debugTitle, { color: colors.text }]}>🐛 Debug Info</Text>
        <Text style={[styles.debugText, { color: colors.textSecondary }]}>
          Status: {debugInfo}
        </Text>
        <Text style={[styles.debugText, { color: colors.textSecondary }]}>
          Workouts in history: {workoutHistory.length}
        </Text>
        <Text style={[styles.debugText, { color: colors.textSecondary }]}>
          Stats loaded: {stats ? 'Yes' : 'No'}
        </Text>
        <Text style={[styles.debugText, { color: colors.textSecondary }]}>
          Total workouts in stats: {stats?.summary?.totalWorkouts || 0}
        </Text>
        {stats?.stats?.length > 0 && (
          <Text style={[styles.debugText, { color: colors.textSecondary }]}>
            Types found: {stats.stats.map(s => `${s._id}(${s.count})`).join(', ')}
          </Text>
        )}
        {stats?.trends?.length > 0 && (
          <Text style={[styles.debugText, { color: colors.textSecondary }]}>
            Trends: {stats.trends.filter(t => t.count > 0).length} active days
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading stats...</Text>
          {debugInfo && (
            <Text style={[styles.debugText, { color: colors.textSecondary }]}>
              Debug: {debugInfo}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.primary
    }
  };

  log('Current stats state:', stats);
  log('Current workout history length:', workoutHistory.length);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Workout Stats</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutHistory')}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* DEBUG INFO - Remove in production */}
      <DebugSection />

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {periods.map(period => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              {
                backgroundColor: selectedPeriod === period.key ? colors.primary : colors.surface,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text style={[
              styles.periodButtonText,
              { color: selectedPeriod === period.key ? '#FFFFFF' : colors.text }
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <StatCard
            icon="fitness-outline"
            value={stats?.summary?.totalWorkouts || 0}
            label="Workouts"
            onPress={() => navigation.navigate('WorkoutHistory')}
          />
          <StatCard
            icon="time-outline"
            value={formatDuration(stats?.summary?.totalDuration || 0)}
            label="Total Time"
          />
          <StatCard
            icon="location-outline"
            value={formatDistance(stats?.summary?.totalDistance || 0)}
            label="Distance"
          />
          <StatCard
            icon="flame-outline"
            value={stats?.summary?.totalCalories || 0}
            label="Calories"
          />
        </View>

        {/* No Data Message */}
        {(!stats?.summary?.totalWorkouts || stats.summary.totalWorkouts === 0) && (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Ionicons name="bar-chart-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              No workout data yet
            </Text>
            <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
              Complete your first workout to see statistics here
            </Text>
            <TouchableOpacity 
              style={[styles.startWorkoutButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('TrainingStack')}
            >
              <Text style={styles.startWorkoutButtonText}>Start First Workout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Workout Types Chart */}
        {stats?.stats && stats.stats.length > 0 && (
          <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Workout Types
            </Text>
            <PieChart
              data={prepareWorkoutTypeData()}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Activity Trends */}
        {stats?.trends && stats.trends.length > 0 && stats.trends.some(t => t.count > 0) && (
          <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Daily Activity (Last 7 Days)
            </Text>
            <LineChart
              data={prepareTrendsData()}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Calories Burned */}
        {stats?.trends && stats.trends.length > 0 && stats.trends.some(t => t.totalCalories > 0) && (
          <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Calories Burned (Last 7 Days)
            </Text>
            <BarChart
              data={prepareCaloriesData()}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>
        )}

        {/* Personal Bests */}
        {stats?.personalBests && Object.keys(stats.personalBests).length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Personal Bests
            </Text>
            
            {Object.entries(stats.personalBests).map(([activity, bests]) => (
              <View key={activity} style={styles.personalBestSection}>
                <Text style={[styles.personalBestActivity, { color: colors.primary }]}>
                  {activity}
                </Text>
                
                {Object.entries(bests).map(([metric, value]) => (
                  value > 0 && (
                    <View key={metric} style={styles.personalBestItem}>
                      <Text style={[styles.personalBestMetric, { color: colors.textSecondary }]}>
                        {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </Text>
                      <Text style={[styles.personalBestValue, { color: colors.text }]}>
                        {typeof value === 'number' && metric.includes('Duration') 
                          ? formatDuration(value)
                          : typeof value === 'number' && metric.includes('Distance')
                          ? formatDistance(value)
                          : value
                        }
                      </Text>
                    </View>
                  )
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Recent Achievements */}
        {achievements && achievements.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Achievements
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {achievements.slice(0, 3).map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>{achievement.emoji || '🏆'}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: colors.text }]}>
                    {achievement.title || achievement.name}
                  </Text>
                  <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                    {achievement.description}
                  </Text>
                </View>
                <View style={[styles.achievementPoints, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.achievementPointsText, { color: colors.primary }]}>
                    +{achievement.points || 10}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Weekly Goals */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            This Week's Progress
          </Text>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Workouts</Text>
              <Text style={[styles.goalProgress, { color: colors.primary }]}>
                {stats?.summary?.totalWorkouts || 0}/5
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${Math.min((stats?.summary?.totalWorkouts || 0) / 5 * 100, 100)}%`
                  }
                ]} 
              />
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Active Hours</Text>
              <Text style={[styles.goalProgress, { color: colors.primary }]}>
                {Math.round((stats?.summary?.totalDuration || 0) / 3600)}/10h
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${Math.min((stats?.summary?.totalDuration || 0) / 36000 * 100, 100)}%`
                  }
                ]} 
              />
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Calories</Text>
              <Text style={[styles.goalProgress, { color: colors.primary }]}>
                {stats?.summary?.totalCalories || 0}/2000
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${Math.min((stats?.summary?.totalCalories || 0) / 2000 * 100, 100)}%`
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('WorkoutHistory')}
            >
              <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.quickActionText}>View History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('TrainingStack')}
            >
              <Ionicons name="add-outline" size={20} color="#FFFFFF" />
              <Text style={styles.quickActionText}>New Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  debugContainer: {
    padding: 12,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  emptyState: {
    margin: 16,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  startWorkoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startWorkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  personalBestSection: {
    marginBottom: 16,
  },
  personalBestActivity: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  personalBestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  personalBestMetric: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  personalBestValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  achievementPoints: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementPointsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StatsScreen;