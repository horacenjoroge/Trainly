const loadWorkout = async () => {
  if (!actualWorkoutId) {
    Alert.alert('Error', 'No workout ID provided');
    navigation.goBack();
    return;
  }
  
  try {
    const response = await workoutAPI.getWorkout(actualWorkoutId);
    if (response.status === 'success') {
      setWorkout(response.data.workout || response.data);
    }
  } catch (error) {
    console.log('API failed, trying local storage...');
    try {
      const stored = await AsyncStorage.getItem('workoutHistory');
      const workouts = JSON.parse(stored || '[]');
      const found = workouts.find(w => w._id === actualWorkoutId || w.id === actualWorkoutId);
      if (found) setWorkout(found);
      else throw new Error('Not found');
    } catch {
      Alert.alert('Error', 'Workout not found');
      navigation.goBack();
    }
  } finally {
    setLoading(false);
  }
};alert// screens/WorkoutDetailScreen.js - Clean workout detail view
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
ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useTheme } from '../context/ThemeContext';
import { workoutAPI } from '../services/workoutAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutDetailScreen = ({ navigation, route }) => {
const theme = useTheme();
const colors = theme.colors;
const { workoutId, workout: initialWorkout } = route.params;

// Get workoutId from either params or workout object
const actualWorkoutId = workoutId || initialWorkout?._id || initialWorkout?.id;

const [workout, setWorkout] = useState(initialWorkout);
const [loading, setLoading] = useState(!initialWorkout);
const [liked, setLiked] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [editName, setEditName] = useState('');
const [editNotes, setEditNotes] = useState('');
const [editPrivacy, setEditPrivacy] = useState('public');

useEffect(() => {
  if (!workout) loadWorkout();
  else initializeData();
}, []);

const loadWorkout = async () => {
  try {
    const response = await workoutAPI.getWorkout(workoutId);
    if (response.status === 'success') {
      setWorkout(response.data.workout || response.data);
    }
  } catch (error) {
    try {
      const stored = await AsyncStorage.getItem('workoutHistory');
      const workouts = JSON.parse(stored || '[]');
      const found = workouts.find(w => w._id === workoutId);
      if (found) setWorkout(found);
      else throw new Error('Not found');
    } catch {
      Alert.alert('Error', 'Workout not found');
      navigation.goBack();
    }
  } finally {
    setLoading(false);
  }
};

const initializeData = () => {
  if (workout) {
    setEditName(workout.name || '');
    setEditNotes(workout.notes || '');
    setEditPrivacy(workout.privacy || 'public');
  }
};

const toggleLike = async () => {
  if (!actualWorkoutId) {
    Alert.alert('Error', 'Workout ID not found');
    return;
  }
  try {
    await workoutAPI.toggleLike(actualWorkoutId);
    setLiked(!liked);
  } catch (error) {
    Alert.alert('Error', 'Failed to update like');
  }
};

const shareWorkout = async () => {
  const distance = getWorkoutDistance();
  const message = `${workout.type} Workout!\n${formatDuration(workout.duration)} • ${formatDistance(distance)} • ${workout.calories || 0} calories`;
  Share.share({ message, title: `${workout.type} Workout` });
};

const updateWorkout = async () => {
  if (!actualWorkoutId) {
    Alert.alert('Error', 'Workout ID not found');
    return;
  }
  try {
    await workoutAPI.updateWorkout(actualWorkoutId, {
      name: editName.trim(),
      notes: editNotes.trim(),
      privacy: editPrivacy
    });
    setWorkout(prev => ({ ...prev, name: editName, notes: editNotes, privacy: editPrivacy }));
    setShowEditModal(false);
    Alert.alert('Success', 'Workout updated');
  } catch (error) {
    Alert.alert('Error', 'Failed to update workout');
  }
};

const deleteWorkout = () => {
  Alert.alert('Delete Workout', 'Are you sure?', [
    { text: 'Cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          await workoutAPI.deleteWorkout(actualWorkoutId);
          navigation.goBack();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete workout');
        }
      }
    }
  ]);
};

// Helper functions
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatDistance = (distance) => {
  if (!distance) return '0 km';
  return distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance}m`;
};

const getWorkoutDistance = () => {
  return workout?.running?.distance || workout?.cycling?.distance || workout?.swimming?.distance || 0;
};

const getRouteCoordinates = () => {
  return workout?.running?.route?.gpsPoints || workout?.cycling?.route?.gpsPoints || [];
};

if (loading) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}

if (!workout) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Text style={[styles.text, { color: colors.text }]}>Workout not found</Text>
      </View>
    </SafeAreaView>
  );
}

const distance = getWorkoutDistance();
const routeCoordinates = getRouteCoordinates();
const workoutDate = new Date(workout.startTime || workout.date);

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
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={[styles.title, { color: colors.text }]}>
              {workout.name || `${workout.type} Session`}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {workoutDate.toLocaleDateString()} • {workoutDate.toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
              <Ionicons name={liked ? "heart" : "heart-outline"} size={24} 
                color={liked ? colors.error : colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareWorkout} style={styles.actionBtn}>
              <Ionicons name="share-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {formatDuration(workout.duration)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
          </View>
          {distance > 0 && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {formatDistance(distance)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
            </View>
          )}
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {workout.calories || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
          </View>
        </View>
      </View>

      {/* Map */}
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
              <Polyline coordinates={routeCoordinates} strokeColor={colors.primary} strokeWidth={4} />
              <Marker coordinate={routeCoordinates[0]} title="Start" pinColor="green" />
              <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="Finish" pinColor="red" />
            </MapView>
          </View>
        </View>
      )}

      {/* Activity Details */}
      {workout.type === 'Running' && workout.running && (
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Running Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detail}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Avg Pace</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {Math.floor((workout.running.pace?.average || 0) / 60)}:{String(Math.floor((workout.running.pace?.average || 0) % 60)).padStart(2, '0')}/km
              </Text>
            </View>
            <View style={styles.detail}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Max Speed</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {(workout.running.speed?.max || 0).toFixed(1)} km/h
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Notes */}
      {workout.notes && (
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
          <Text style={[styles.notes, { color: colors.text }]}>{workout.notes}</Text>
        </View>
      )}

      {/* Delete Button */}
      <TouchableOpacity style={[styles.deleteBtn, { borderColor: colors.error }]} onPress={deleteWorkout}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
        <Text style={[styles.deleteBtnText, { color: colors.error }]}>Delete Workout</Text>
      </TouchableOpacity>
    </ScrollView>

    {/* Edit Modal */}
    <Modal visible={showEditModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Workout</Text>
          
          <Text style={[styles.label, { color: colors.textSecondary }]}>Name:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            value={editName}
            onChangeText={setEditName}
            placeholder="Workout name"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={[styles.label, { color: colors.textSecondary }]}>Notes:</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
            value={editNotes}
            onChangeText={setEditNotes}
            placeholder="Notes"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          
          <Text style={[styles.label, { color: colors.textSecondary }]}>Privacy:</Text>
          <View style={styles.privacyBtns}>
            <TouchableOpacity
              style={[styles.privacyBtn, editPrivacy === 'public' && { backgroundColor: colors.primary }]}
              onPress={() => setEditPrivacy('public')}
            >
              <Text style={[styles.privacyBtnText, { color: editPrivacy === 'public' ? '#FFF' : colors.text }]}>
                Public
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.privacyBtn, editPrivacy === 'private' && { backgroundColor: colors.primary }]}
              onPress={() => setEditPrivacy('private')}
            >
              <Text style={[styles.privacyBtnText, { color: editPrivacy === 'private' ? '#FFF' : colors.text }]}>
                Private
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBtns}>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.textSecondary + '20' }]} 
              onPress={() => setShowEditModal(false)}>
              <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={updateWorkout}>
              <Text style={styles.modalBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: { flex: 1 },
center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
text: { fontSize: 16, marginTop: 8 },
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
headerTitle: { fontSize: 18, fontWeight: 'bold' },
content: { flex: 1 },
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
sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
flex: { flex: 1 },
title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
subtitle: { fontSize: 14, fontWeight: '500' },
actions: { flexDirection: 'row' },
actionBtn: { padding: 8, marginLeft: 8 },
statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
stat: { alignItems: 'center' },
statValue: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
statLabel: { fontSize: 10, fontWeight: '500', textTransform: 'uppercase' },
mapContainer: { height: 200, borderRadius: 12, overflow: 'hidden' },
map: { flex: 1 },
detailsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
detail: { flex: 1 },
detailLabel: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', marginBottom: 4 },
detailValue: { fontSize: 16, fontWeight: '600' },
notes: { fontSize: 16, lineHeight: 24 },
deleteBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 16,
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
},
deleteBtnText: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modal: { width: '90%', padding: 20, borderRadius: 16 },
modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
label: { fontSize: 14, fontWeight: '500', marginBottom: 8, marginTop: 16 },
input: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 8, padding: 12, fontSize: 16 },
textArea: { height: 80, textAlignVertical: 'top' },
privacyBtns: { flexDirection: 'row', gap: 12, marginBottom: 16 },
privacyBtn: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.1)',
  alignItems: 'center',
},
privacyBtnText: { fontSize: 14, fontWeight: '600' },
modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
modalBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default WorkoutDetailScreen;