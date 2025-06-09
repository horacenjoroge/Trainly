// screens/WorkoutHistoryScreen.js - Enhanced workout history with proper API integration
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { workoutAPI } from '../services/workoutAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [sortBy, setSortBy] = useState('startTime');
  const [sortOrder, setSortOrder] = useState('desc');

  const workoutTypes = ['All', 'Running', 'Cycling', 'Swimming', 'Gym', 'Walking', 'Hiking'];

  // Load workouts with proper API integration
  const loadWorkouts = useCallback(async (page = 1, type = filterType, isRefresh = false) => {
    if (loading && !isRefresh) return;
    
    setLoading(true);
    
    try {
      // Prepare API parameters
      const params = {
        page,
        limit: 20,
        sortBy,
        sortOrder,
      };

      // Add type filter if not 'All'
      if (type !== 'All') {
        params.type = type;
      }

      // Add search query if exists
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      console.log('Loading workouts with params:', params);

      // Try API first
      try {
        const response = await workoutAPI.getWorkouts(params);
        
        if (response.status === 'success') {
          const newWorkouts = response.data.workouts || [];
          
          if (page === 1 || isRefresh) {
            setWorkouts(newWorkouts);
          } else {
            setWorkouts(prev => [...prev, ...newWorkouts]);
          }
          
          // Update pagination info
          setHasMoreData(response.data.pagination?.hasNextPage || false);
          setCurrentPage(page);
          
          console.log(`Loaded ${newWorkouts.length} workouts from API`);
          return;
        }
      } catch (apiError) {
        console.log('API not available, falling back to local storage');
      }

      // Fallback to AsyncStorage
      await loadWorkoutsFromStorage(page, type, isRefresh);
      
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Failed to load workouts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterType, loading, searchQuery, sortBy, sortOrder]);

  // Fallback method to load from AsyncStorage
  const loadWorkoutsFromStorage = async (page, type, isRefresh) => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workoutHistory');
      if (storedWorkouts) {
        let allWorkouts = JSON.parse(storedWorkouts);
        
        // Apply filters
        if (type !== 'All') {
          allWorkouts = allWorkouts.filter(w => w.type === type);
        }
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          allWorkouts = allWorkouts.filter(w =>
            w.name?.toLowerCase().includes(query) ||
            w.type.toLowerCase().includes(query) ||
            w.notes?.toLowerCase().includes(query)
          );
        }
        
        // Sort workouts
        allWorkouts.sort((a, b) => {
          const dateA = new Date(a.startTime || a.date);
          const dateB = new Date(b.startTime || b.date);
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        
        // Paginate
        const limit = 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedWorkouts = allWorkouts.slice(startIndex, endIndex);
        
        if (page === 1 || isRefresh) {
          setWorkouts(paginatedWorkouts);
        } else {
          setWorkouts(prev => [...prev, ...paginatedWorkouts]);
        }
        
        setHasMoreData(endIndex < allWorkouts.length);
        setCurrentPage(page);
        
        console.log(`Loaded ${paginatedWorkouts.length} workouts from storage`);
      } else {
        setWorkouts([]);
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      setWorkouts([]);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    setCurrentPage(1);
    setWorkouts([]);
    loadWorkouts(1, filterType, true);
  }, [filterType, searchQuery, sortBy, sortOrder]);

  // Focus listener for refresh
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });
    return unsubscribe;
  }, [navigation]);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setWorkouts([]);
    loadWorkouts(1, filterType, true);
  }, [filterType, loadWorkouts]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (hasMoreData && !loading) {
      loadWorkouts(currentPage + 1, filterType);
    }
  }, [currentPage, filterType, hasMoreData, loading, loadWorkouts]);

  // Delete workout handler
  const handleDeleteWorkout = async (workoutId) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutAPI.deleteWorkout(workoutId);
              
              // Remove from local state
              setWorkouts(prev => prev.filter(w => w._id !== workoutId));
              
              Alert.alert('Success', 'Workout deleted successfully');
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
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

  // Get workout distance with proper handling for different activity types
  const getWorkoutDistance = (workout) => {
    if (workout.running?.distance) return workout.running.distance;
    if (workout.cycling?.distance) return workout.cycling.distance;
    if (workout.swimming?.distance) return workout.swimming.distance;
    return workout.distance || 0;
  };

  // Handle workout item press
  const handleWorkoutPress = (workout) => {
    navigation.navigate('WorkoutDetail', { 
      workoutId: workout._id,
      workout: workout // Pass workout data as backup
    });
  };

  // Render workout item with enhanced UI
  const renderWorkoutItem = ({ item }) => {
    const distance = getWorkoutDistance(item);
    const workoutDate = new Date(item.startTime || item.date);
    const isToday = workoutDate.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        style={[styles.workoutItem, { backgroundColor: colors.surface }]}
        onPress={() => handleWorkoutPress(item)}
        onLongPress={() => handleDeleteWorkout(item._id)}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutTitleRow}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons 
                name={getWorkoutIcon(item.type)} 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.workoutTitleInfo}>
              <Text style={[styles.workoutTitle, { color: colors.text }]}>
                {item.name || `${item.type} Session`}
              </Text>
              <View style={styles.dateRow}>
                <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
                  {isToday ? 'Today' : workoutDate.toLocaleDateString()} • {workoutDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                {item.privacy === 'private' && (
                  <Ionicons name="lock-closed" size={14} color={colors.textSecondary} style={styles.privacyIcon} />
                )}
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => handleDeleteWorkout(item._id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
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

        {/* Achievement indicator */}
        {item.achievementsEarned && item.achievementsEarned.length > 0 && (
          <View style={styles.achievementIndicator}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={[styles.achievementText, { color: colors.text }]}>
              {item.achievementsEarned.length} achievement{item.achievementsEarned.length > 1 ? 's' : ''} earned
            </Text>
          </View>
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

  // Render sort options
  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <TouchableOpacity
        style={[styles.sortButton, { backgroundColor: colors.surface }]}
        onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
      >
        <Ionicons 
          name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
          size={16} 
          color={colors.primary} 
        />
        <Text style={[styles.sortText, { color: colors.text }]}>
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </Text>
      </TouchableOpacity>
    </View>
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
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

      {/* Sort Options */}
      {renderSortOptions()}

      {/* Workouts List */}
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? 'No workouts match your search' : 'No workouts found'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              {searchQuery 
                ? 'Try adjusting your search terms or filters' 
                : 'Start your fitness journey by recording your first workout!'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={[styles.startWorkoutButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('TrainingStack')}
              >
                <Text style={styles.startWorkoutButtonText}>Start First Workout</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListFooterComponent={
          loading && workouts.length > 0 ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading more workouts...
              </Text>
            </View>
          ) : null
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
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  sortText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  privacyIcon: {
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
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
  achievementIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  achievementText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
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
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default WorkoutHistoryScreen;