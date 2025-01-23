import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useTheme } from '../context/ThemeContext';

const TrainingScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const activityType = route.params?.activity || 'General Training';

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
    if (isTracking && !isPaused) {
      const watchId = Geolocation.watchPosition(
        position => {
          const newCoordinate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(prev => [...prev, newCoordinate]);
          updateDistance(newCoordinate);
        },
        error => Alert.alert('GPS Error', error.message),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );
      return () => Geolocation.clearWatch(watchId);
    }
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

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (!isTracking) {
      setIsTracking(true);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleFinish = () => {
    setIsTracking(false);
    navigation.navigate('Home', {
      newWorkout: {
        type: activityType,
        duration: timer,
        distance: distance.toFixed(2),
        calories: Math.floor(timer * 5),
        route: coordinates
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.primary + '50'
      }]}>
        <Text style={[styles.activityType, { 
          color: theme.colors.primary,
          textShadowColor: theme.colors.primary + '50',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10
        }]}>{activityType}</Text>
        <Text style={[styles.timer, { 
          color: theme.colors.text,
          textShadowColor: theme.colors.primary + '30',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10
        }]}>{formatTime(timer)}</Text>
      </View>

      {/* Map View */}
      <MapView
        style={[styles.map, { borderColor: theme.colors.primary + '30' }]}
        initialRegion={{
          latitude: coordinates[0]?.latitude || 37.78825,
          longitude: coordinates[0]?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={mapStyle}
      >
        <Polyline
          coordinates={coordinates}
          strokeColor={theme.colors.primary}
          strokeWidth={4}
        />
      </MapView>

      {/* Stats Container */}
      <View style={[styles.statsContainer, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.primary + '20'
      }]}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {distance.toFixed(2)} km
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            DISTANCE
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {(distance * 1000 / timer).toFixed(2) || 0} m/s
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            PACE
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {Math.floor(timer * 5)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            CALORIES
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, { 
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
          }]}
          onPress={handleStartPause}
        >
          <Ionicons 
            name={isTracking ? (isPaused ? 'play' : 'pause') : 'play'} 
            size={32} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
        
        {isTracking && (
          <TouchableOpacity 
            style={[styles.controlButton, { 
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
            }]}
            onPress={handleFinish}
          >
            <Ionicons name="stop" size={32} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Custom Map Styling
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#120B42" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#E57C0B" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#120B42" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#1A144B" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#E57C0B" }]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{ "color": "#1A144B" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#120B42" }]
  }
];

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  activityType: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 32,
    fontWeight: '300',
    marginTop: 10,
  },
  map: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default TrainingScreen;