// screens/WorkoutHistoryScreen.js - List all workouts
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/api';

const WorkoutHistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // State
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const workoutTypes = ['All', 'Running', 'Cycling', 'Swimming', 'Gym', 'Walking', 'Hiking'];

  // Load workouts
  const loadWorkouts = useCallback(async (page = 1, type = filterType, isRefresh = false) => {
    if (loading && !isRefresh) return;
    
    setLoading(true);
    
    try {
      const params = {
        page,
        limit: 20,
        sortBy: 'startTime',
        sortOrder: 'desc',
      };

      if (type !== 'All') {
        params.type = type;
      }

      const response = await apiClient.get('/workouts', { params });
      
      if (response.data.status === 'success') {
        const newWorkouts = response.data.data.workouts;
        
        if (page === 1 || isRefresh) {
          setWorkouts(newWorkouts);
        } else {
          setWorkouts(prev => [...prev, ...newWorkouts]);
        }
        
        setHasMoreData(response.data.data.pagination.hasNextPage);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Failed to load workouts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterType, loading]);

  // Initial load
  useEffect(() => {
    loadWorkouts(1, filterType, true);
  }, [filterType]);

  // Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    loadWorkouts(1, filterType, true);
  }, [filterType, loadWorkouts]);

  // Load more
  const loadMore = useCallback(() => {
    if (hasMoreData && !loading) {
      loadWorkouts(currentPage + 1, filterType);
    }
  }, [currentPage, filterType, hasMoreData, loading, loadWorkouts]);

  // Filter workouts based on search
  const filteredWorkouts = workouts.filter(workout =>
    workout.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  const formatDistance = (distance, type) => {
    if (!distance) return '0 km';
    
    if (type === 'Swimming') {
      return `${distance}m`;
    }
    
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  // Get workout icon
  const getWorkoutIcon = (type) => {
    const icons = {
      Running: 'walk-outline',
      Cycling: 'bicycle-outline',
      Swimming: 'water-outline',
      Gym: 'barbell-outline',
      Walking: 'walk-outline',
      Hiking: 'trail-sign-outline',
    };
    return icons[type] || 'fitness-outline';
  };

  // Get workout distance
  const getWorkoutDistance = (workout) => {
    switch (workout.type) {
      case 'Running':
        return workout.running?.distance || 0;
      case 'Cycling':
        return workout.cycling?.distance || 0;
      case 'Swimming':
        return workout.swimming?.distance || 0;
      default:
        return 0;
    }
  };

  // Render workout item
  const renderWorkoutItem = ({ item }) => {
    const distance = getWorkoutDistance(item);
    const workoutDate = new Date(item.startTime);

    return (
      <TouchableOpacity
        style={[styles.workoutItem, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item._id })}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutTitleRow}>
            <Ionicons 
              name={getWorkoutIcon(item.type)} 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.workoutTitleInfo}>
              <Text style={[styles.workoutTitle, { color: colors.text }]}>
                {item.name || `${item.type} Session`}
              </Text>
              <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
                {workoutDate.toLocaleDateString()} • {workoutDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
          
          {item.privacy === 'private' && (
            <Ionicons name="lock-closed" size={16} color={colors.textSecondary} />
          )}
        </View>

        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {formatDuration(item.duration)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Duration
            </Text>
          </View>

          {distance > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {formatDistance(distance, item.type)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Distance
              </Text>
            </View>
          )}

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {item.calories || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Calories
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {item.likes?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Likes
            </Text>
          </View>
        </View>

        {item.notes && (
          <Text style={[styles.workoutNotes, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Render filter button
  const renderFilterButton = (type) => (
    <TouchableOpacity
      key={type}
      style={[
        styles.filterButton,
        {
          backgroundColor: filterType === type ? colors.primary : colors.surface,
          borderColor: colors.border,
        }
      ]}
      onPress={() => setFilterType(type)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: filterType === type ? '#FFFFFF' : colors.text }
      ]}>
        {type}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Workout History</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
          <Ionicons name="stats-chart" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search workouts..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={workoutTypes}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Workouts List */}
      <FlatList
        data={filteredWorkouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No workouts found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Start your fitness journey by recording your first workout!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  workoutItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutTitleInfo: {
    marginLeft: 12,
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  workoutDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  workoutNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default WorkoutHistoryScreen;