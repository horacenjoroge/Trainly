// screens/StatsScreen.js - Analytics dashboard
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/api';

const { width } = Dimensions.get('window');

const StatsScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [trends, setTrends] = useState([]);

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'all', label: 'All Time' },
  ];

  // Load stats
  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/workouts/stats/summary?period=${selectedPeriod}`);
      
      if (response.data.status === 'success') {
        setStats(response.data.data);
        setTrends(response.data.data.trends || []);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format distance
  const formatDistance = (distance) => {
    if (!distance) return '0 km';
    
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  // Prepare chart data
  const prepareWorkoutTypeData = () => {
    if (!stats?.stats) return [];
    
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
    if (!trends || trends.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [0],
          color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
          strokeWidth: 2,
        }]
      };
    }

    const labels = trends.slice(-7).map(trend => {
      const date = new Date(trend._id);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    return {
      labels,
      datasets: [
        {
          data: trends.slice(-7).map(trend => trend.count),
          color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
          strokeWidth: 2,
        }
      ]
    };
  };

  const prepareCaloriesData = () => {
    if (!trends || trends.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [0],
        }]
      };
    }

    return {
      labels: trends.slice(-7).map(trend => {
        const date = new Date(trend._id);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{
        data: trends.slice(-7).map(trend => trend.totalCalories || 0),
      }]
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading stats...</Text>
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Workout Stats</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

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
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="fitness-outline" size={24} color={colors.primary} />
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {stats?.summary?.totalWorkouts || 0}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Workouts
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatDuration(stats?.summary?.totalDuration || 0)}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Total Time
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="location-outline" size={24} color={colors.primary} />
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatDistance(stats?.summary?.totalDistance || 0)}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Distance
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="flame-outline" size={24} color={colors.primary} />
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {stats?.summary?.totalCalories || 0}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Calories
            </Text>
          </View>
        </View>

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
        {trends && trends.length > 0 && (
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
        {trends && trends.length > 0 && (
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
        {stats?.personalBests && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Personal Bests
            </Text>
            
            {Object.entries(stats.personalBests).map(([activity, bests]) => (
              <View key={activity} style={styles.personalBestSection}>
                <Text style={[styles.personalBestActivity, { color: colors.primary }]}>
                  {activity.charAt(0).toUpperCase() + activity.slice(1)}
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
        {stats?.recentAchievements && stats.recentAchievements.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Achievements
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {stats.recentAchievements.slice(0, 3).map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: colors.text }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                    {achievement.description}
                  </Text>
                </View>
                <View style={[styles.achievementPoints, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.achievementPointsText, { color: colors.primary }]}>
                    +{achievement.points}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
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
    fontSize: 12,
    fontWeight: '500',
  },
  achievementPoints: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementPointsText: {
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '700',
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
});

export default StatsScreen;