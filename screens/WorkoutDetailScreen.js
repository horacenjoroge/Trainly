// screens/WorkoutDetailScreen.js - Single workout view
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/api';

const WorkoutDetailScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { workoutId } = route.params;

  // State
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPrivacy, setEditPrivacy] = useState('public');

  // Load workout
  useEffect(() => {
    loadWorkout();
  }, [workoutId]);

  const loadWorkout = async () => {
    try {
      const response = await apiClient.get(`/workouts/${workoutId}`);
      
      if (response.data.status === 'success') {
        const workoutData = response.data.data.workout;
        setWorkout(workoutData);
        setLiked(workoutData.likes?.some(like => like._id === 'current-user-id')); // Replace with actual user ID
        setEditName(workoutData.name || '');
        setEditNotes(workoutData.notes || '');
        setEditPrivacy(workoutData.privacy || 'public');
      }
    } catch (error) {
      console.error('Error loading workout:', error);
      Alert.alert('Error', 'Failed to load workout details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Toggle like
  const toggleLike = async () => {
    try {
      const response = await apiClient.post(`/workouts/${workoutId}/like`);
      
      if (response.data.status === 'success') {
        setLiked(response.data.data.action === 'liked');
        // Update workout likes count
        setWorkout(prev => ({
          ...prev,
          likes: response.data.data.action === 'liked' 
            ? [...(prev.likes || []), { _id: 'current-user-id' }]
            : (prev.likes || []).filter(like => like._id !== 'current-user-id')
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like');
    }
  };

  // Share workout
  const shareWorkout = async () => {
    if (!workout) return;

    try {
      const distance = getWorkoutDistance(workout);
      const message = `Check out my ${workout.type.toLowerCase()} workout!\n\n` +
        `📊 ${formatDuration(workout.duration)} • ${formatDistance(distance, workout.type)} • ${workout.calories || 0} calories\n` +
        `💪 Tracked with Fitness App`;

      await Share.share({
        message,
        title: `${workout.type} Workout`
      });
    } catch (error) {
      console.error('Error sharing workout:', error);
    }
  };

  // Update workout
  const updateWorkout = async () => {
    try {
      const updateData = {
        name: editName.trim() || undefined,
        notes: editNotes.trim() || undefined,
        privacy: editPrivacy,
      };

      const response = await apiClient.patch(`/workouts/${workoutId}`, updateData);
      
      if (response.data.status === 'success') {
        setWorkout(prev => ({
          ...prev,
          ...updateData
        }));
        setShowEditModal(false);
        Alert.alert('Success', 'Workout updated successfully');
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      Alert.alert('Error', 'Failed to update workout');
    }
  };

  // Delete workout
  const deleteWorkout = () => {
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
              await apiClient.delete(`/workouts/${workoutId}`);
              Alert.alert('Success', 'Workout deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
            }
          }
        }
      ]
    );
  };

  // Helper functions
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (distance, type) => {
    if (!distance) return '0 km';
    
    if (type === 'Swimming') {
      return `${distance}m`;
    }
    
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  const formatPace = (pace) => {
    if (!pace || pace === 0) return '--:--';
    const minutes = Math.floor(pace / 60);
    const seconds = Math.floor(pace % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const getRouteCoordinates = (workout) => {
    switch (workout.type) {
      case 'Running':
        return workout.running?.route?.gpsPoints || [];
      case 'Cycling':
        return workout.cycling?.route?.gpsPoints || [];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Workout not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const distance = getWorkoutDistance(workout);
  const routeCoordinates = getRouteCoordinates(workout);
  const workoutDate = new Date(workout.startTime);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Workout Details</Text>
        <TouchableOpacity onPress={() => setShowEditModal(true)}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Basic Info */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.workoutHeader}>
            <View>
              <Text style={[styles.workoutTitle, { color: colors.text }]}>
                {workout.name || `${workout.type} Session`}
              </Text>
              <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
                {workoutDate.toLocaleDateString()} • {workoutDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            <View style={styles.workoutActions}>
              <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
                <Ionicons 
                  name={liked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={liked ? colors.error : colors.textSecondary} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={shareWorkout}>
                <Ionicons name="share-outline" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Stats */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {formatDuration(workout.duration)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
            </View>

            {distance > 0 && (
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {formatDistance(distance, workout.type)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
              </View>
            )}

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {workout.calories || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {workout.likes?.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Likes</Text>
            </View>
          </View>
        </View>

        {/* Map for Running/Cycling */}
        {routeCoordinates.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Route</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: routeCoordinates[0].latitude,
                  longitude: routeCoordinates[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor={colors.primary}
                  strokeWidth={4}
                />
                <Marker
                  coordinate={{
                    latitude: routeCoordinates[0].latitude,
                    longitude: routeCoordinates[0].longitude,
                  }}
                  title="Start"
                  pinColor="green"
                />
                <Marker
                  coordinate={{
                    latitude: routeCoordinates[routeCoordinates.length - 1].latitude,
                    longitude: routeCoordinates[routeCoordinates.length - 1].longitude,
                  }}
                  title="Finish"
                  pinColor="red"
                />
              </MapView>
            </View>
          </View>
        )}

        {/* Activity-specific details */}
        {workout.type === 'Running' && workout.running && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Running Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Avg Pace</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatPace(workout.running.pace?.average)}/km
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Max Speed</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.running.speed?.max?.toFixed(1) || 0} km/h
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Elevation</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  +{Math.round(workout.running.elevation?.gain || 0)}m
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Splits</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.running.splits?.length || 0}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Cycling Details */}
        {workout.type === 'Cycling' && workout.cycling && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cycling Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Avg Speed</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.cycling.speed?.average?.toFixed(1) || 0} km/h
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Max Speed</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.cycling.speed?.max?.toFixed(1) || 0} km/h
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Elevation</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  +{Math.round(workout.cycling.elevation?.gain || 0)}m
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Intervals</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.cycling.intervals?.length || 0}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Swimming Details */}
        {workout.type === 'Swimming' && workout.swimming && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Swimming Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Pool Length</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.swimming.poolLength}m
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Stroke Type</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.swimming.strokeType}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Laps</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.swimming.laps?.length || 0}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Avg SWOLF</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.swimming.technique?.averageSwolf?.toFixed(0) || '--'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Gym Details */}
        {workout.type === 'Gym' && workout.gym && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Gym Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Exercises</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.gym.exercises?.length || 0}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Sets</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.gym.stats?.totalSets || 0}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Reps</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.gym.stats?.totalReps || 0}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Total Weight</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {workout.gym.stats?.totalWeight || 0} kg
                </Text>
              </View>
            </View>

            {/* Exercise List */}
            {workout.gym.exercises && workout.gym.exercises.length > 0 && (
              <View style={styles.exercisesList}>
                <Text style={[styles.exercisesTitle, { color: colors.text }]}>Exercises</Text>
                {workout.gym.exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>
                      {exercise.name}
                    </Text>
                    <Text style={[styles.exerciseDetails, { color: colors.textSecondary }]}>
                      {exercise.sets?.length || 0} sets • {exercise.category}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Notes */}
        {workout.notes && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
            <Text style={[styles.notesText, { color: colors.text }]}>
              {workout.notes}
            </Text>
          </View>
        )}

        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.error + '20', borderColor: colors.error }]}
          onPress={deleteWorkout}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={[styles.deleteButtonText, { color: colors.error }]}>
            Delete Workout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Workout</Text>
            
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
              Workout Name:
            </Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter workout name"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
              Notes:
            </Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea, { backgroundColor: colors.background, color: colors.text }]}
              value={editNotes}
              onChangeText={setEditNotes}
              placeholder="Add notes about your workout"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
            
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
              Privacy:
            </Text>
            <View style={styles.privacyButtons}>
              <TouchableOpacity
                style={[
                  styles.privacyButton,
                  editPrivacy === 'public' && { backgroundColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setEditPrivacy('public')}
              >
                <Text style={[
                  styles.privacyButtonText,
                  { color: editPrivacy === 'public' ? '#FFFFFF' : colors.text }
                ]}>
                  Public
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.privacyButton,
                  editPrivacy === 'private' && { backgroundColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setEditPrivacy('private')}
              >
                <Text style={[
                  styles.privacyButtonText,
                  { color: editPrivacy === 'private' ? '#FFFFFF' : colors.text }
                ]}>
                  Private
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.textSecondary + '20' }]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={updateWorkout}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '22%',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  exercisesList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  exerciseItem: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  privacyButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  privacyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  privacyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutDetailScreen;