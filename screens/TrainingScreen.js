// TrainingScreen.js
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Share, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';

import TrainingHeader from '../components/Trainheader';
import TrainingMap from '../components/Trainmap';
import TrainingStats from '../components/Trainingstats';
import TrainingControls from '../components/trainingcontrols';

export default function TrainingScreen({ navigation, route }) {
  const theme = useTheme();
  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const activityType = route.params?.activity || 'General Training';

  // Request location permission
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        
        // Check if we already have permission
        const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus(existingStatus);
        
        // If we already have permission, get the location
        if (existingStatus === 'granted') {
          await getCurrentLocation();
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Get current location after permission is granted
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      const initialLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(initialLocation);
      setCoordinates([initialLocation]);
      return true;
    } catch (error) {
      console.error('Error getting current location:', error);
      return false;
    }
  };

  // Request permission with improved handling for denied permissions
  const requestLocationPermission = async () => {
    try {
      // First check current permission status
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      
      // If already denied, we need to direct to settings
      if (currentStatus === 'denied') {
        Alert.alert(
          'Permission Required',
          'Location access is needed for tracking your workouts. Please enable location in your device settings.',
          [
            { 
              text: 'Open Settings', 
              onPress: () => Linking.openSettings()
            },
            { 
              text: 'Cancel', 
              style: 'cancel',
              onPress: () => navigation.goBack() 
            }
          ]
        );
        return false;
      }
      
      // If not yet denied, request normally
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        const locationObtained = await getCurrentLocation();
        return locationObtained;
      } else {
        Alert.alert(
          'Permission Required',
          'This app needs location permission to track your activity.',
          [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  useEffect(() => {
    let interval;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  useEffect(() => {
    let locationSubscription;
    
    const startLocationTracking = async () => {
      if (isTracking && !isPaused && permissionStatus === 'granted') {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            const newCoordinate = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setCurrentLocation(newCoordinate);
            setCoordinates(prev => [...prev, newCoordinate]);
            updateDistance(newCoordinate);
          }
        );
      }
    };

    startLocationTracking();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTracking, isPaused, permissionStatus]);

  const updateDistance = newCoordinate => {
    if (coordinates.length > 0) {
      const lastCoordinate = coordinates[coordinates.length - 1];
      const newDistance = calculateDistance(lastCoordinate, newCoordinate);
      setDistance(prev => prev + newDistance);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
      Math.cos(coord2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const shareRoute = async () => {
    try {
      const routeData = {
        type: activityType,
        duration: timer,
        distance: distance.toFixed(2),
        coordinates: coordinates,
        date: new Date().toISOString()
      };

      await Share.share({
        message: JSON.stringify(routeData, null, 2),
        title: `${activityType} Route`
      });
    } catch (error) {
      Alert.alert('Error sharing route', error.message);
    }
  };

  const handleStartPause = async () => {
    if (!isTracking) {
      // Check permission before starting
      if (permissionStatus !== 'granted') {
        const granted = await requestLocationPermission();
        if (!granted) return;
      }
      setIsTracking(true);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleFinish = async () => {
    try {
      const workoutData = {
        type: activityType,
        duration: timer,
        distance: distance.toFixed(2),
        calories: Math.floor(timer * 5),
        route: coordinates,
        date: new Date().toISOString()
      };

      setIsTracking(false);
      navigation.navigate('Home', { newWorkout: workoutData });
    } catch (error) {
      Alert.alert('Error saving workout', error.message);
    }
  };

  // Render permission request screen if permission isn't granted yet
  if (permissionStatus !== 'granted' && !isLoading) {
    return (
      <View style={[styles.container, styles.permissionContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.permissionText, { color: theme.colors.text }]}>
          Location permission is required to track your workout
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]}
          onPress={requestLocationPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: 'transparent', borderColor: theme.colors.border, borderWidth: 1 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.permissionButtonText, { color: theme.colors.text }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TrainingHeader 
        activityType={activityType}
        timer={timer}
        theme={theme}
      />
      
      <TrainingMap
        currentLocation={currentLocation}
        coordinates={coordinates}
        theme={theme}
      />
      
      <TrainingStats
        distance={distance}
        timer={timer}
        theme={theme}
      />
      
      <TrainingControls
        isTracking={isTracking}
        isPaused={isPaused}
        onStartPause={handleStartPause}
        onFinish={handleFinish}
        onShare={shareRoute}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120B42',
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});