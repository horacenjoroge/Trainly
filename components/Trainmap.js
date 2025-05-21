// components/TrainingMap.js
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function TrainingMap({ currentLocation, coordinates, theme }) {
  const mapRef = useRef(null);
  const [mapType, setMapType] = useState('standard');
  const [showMilestones, setShowMilestones] = useState(true);
  const [region, setRegion] = useState(null);

  // Calculate distance from start (in km)
  const calculateDistanceFromStart = (index) => {
    let distance = 0;
    for (let i = 1; i <= index; i++) {
      distance += calculateDistance(coordinates[i-1], coordinates[i]);
    }
    return distance.toFixed(2);
  };

  // Distance calculation helper
  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth radius in km
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

  // Get milestone markers (every km)
  const getMilestoneMarkers = () => {
    if (!showMilestones || coordinates.length < 10) return [];
    
    const milestones = [];
    let accumulatedDistance = 0;
    let lastMilestone = 0;
    
    for (let i = 1; i < coordinates.length; i++) {
      accumulatedDistance += calculateDistance(coordinates[i-1], coordinates[i]);
      
      // If we've passed another km milestone
      if (Math.floor(accumulatedDistance) > lastMilestone) {
        lastMilestone = Math.floor(accumulatedDistance);
        milestones.push({
          coordinate: coordinates[i],
          distance: lastMilestone,
          index: i
        });
      }
    }
    
    return milestones;
  };

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      // Only animate if region hasn't been manually changed by user
      if (!region || region.longitudeDelta <= 0.01) {
        mapRef.current.animateToRegion({
          ...currentLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    }
  }, [currentLocation, region]);

  const fitCoordinates = () => {
    if (coordinates.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true
      });
    }
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const toggleMilestones = () => {
    setShowMilestones(!showMilestones);
  };

  // Handle region change
  const onRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={[styles.map, { borderColor: theme.colors.primary + '30' }]}
        initialRegion={currentLocation ? {
          ...currentLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        } : null}
        showsUserLocation={true}
        followsUserLocation={false} // Changed to false to allow user control
        showsMyLocationButton={false} // Hide default buttons, we have our own
        showsCompass={true}
        mapType={mapType}
        customMapStyle={mapType === 'standard' ? mapStyle : []}
        onLayout={fitCoordinates}
        onRegionChangeComplete={onRegionChange}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <View style={styles.currentLocationMarker}>
              <View style={[styles.currentLocationDot, { backgroundColor: theme.colors.primary }]} />
            </View>
          </Marker>
        )}
        
        {coordinates.length > 1 && (
          <>
            {/* Start marker */}
            <Marker coordinate={coordinates[0]}>
              <View style={[styles.markerContainer, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="flag" size={16} color="#fff" />
              </View>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>Start</Text>
                </View>
              </Callout>
            </Marker>
            
            {/* Route line */}
            <Polyline
              coordinates={coordinates}
              strokeColor={theme.colors.primary}
              strokeWidth={4}
              lineDashPattern={[0]}
            />
            
            {/* Milestone markers */}
            {showMilestones && getMilestoneMarkers().map((milestone, index) => (
              <Marker 
                key={`milestone-${index}`}
                coordinate={milestone.coordinate}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={[styles.milestoneMarker, { backgroundColor: theme.colors.primary + 'CC' }]}>
                  <Text style={styles.milestoneText}>{milestone.distance}km</Text>
                </View>
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{milestone.distance} km</Text>
                    <Text>Distance from start</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </>
        )}
      </MapView>
      
      {/* Map-specific controls only */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.surface }]} 
          onPress={toggleMapType}
        >
          <Ionicons 
            name={mapType === 'standard' ? 'map' : 'map-outline'} 
            size={20} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.surface }]} 
          onPress={toggleMilestones}
        >
          <Ionicons 
            name={showMilestones ? 'location' : 'location-outline'} 
            size={20} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.surface }]} 
          onPress={fitCoordinates}
        >
          <Ionicons name="expand" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.surface }]} 
          onPress={() => mapRef.current?.animateToRegion({
            ...currentLocation,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000)}
        >
          <Ionicons name="navigate" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  currentLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(229, 124, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mapControls: {
    position: 'absolute',
    top: 26,
    right: 26,
    flexDirection: 'column',
    alignItems: 'center',
  },
  mapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  markerContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  milestoneMarker: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  milestoneText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  callout: {
    width: 120,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
});

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{"color": "#120B42"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#E57C0B"}]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#120B42"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{"color": "#1A144B"}]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#E57C0B"}]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{"color": "#1A144B"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#120B42"}]
  }
];