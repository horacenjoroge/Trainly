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
import { log } from '../utils/logger';
import StatCard from '../components/stats/StatCard';
import { formatDuration, formatDistance } from '../utils/formatUtils';
import WorkoutTypeChart from '../components/stats/WorkoutTypeChart';
import ActivityTrendChart from '../components/stats/ActivityTrendChart';
import CaloriesChart from '../components/stats/CaloriesChart';
import { useStatsScreen } from '../hooks/useStatsScreen';


const StatsScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Period selection state
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'all', label: 'All Time' },
  ];

  // Use custom hook for stats logic
  const {
    stats,
    loading,
    workoutHistory,
    achievements,
    debugInfo,
  } = useStatsScreen(navigation, selectedPeriod);




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

        {/* Charts */}
        <WorkoutTypeChart stats={stats?.stats} />
        <ActivityTrendChart trends={stats?.trends} />
        <CaloriesChart trends={stats?.trends} />

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