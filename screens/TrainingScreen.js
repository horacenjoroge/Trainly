// TrainingScreen.js
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Share } from 'react-native';
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

const activityType = route.params?.activity || 'General Training';

useEffect(() => {
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    const initialLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentLocation(initialLocation);
    setCoordinates([initialLocation]);
  })();
}, []);

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
    if (isTracking && !isPaused) {
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
}, [isTracking, isPaused]);

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

const handleStartPause = () => {
  if (!isTracking) {
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
 }
});