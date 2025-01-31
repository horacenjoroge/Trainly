
// components/TrainingMap.js
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

export default function TrainingMap({ currentLocation, coordinates, theme }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  }, [currentLocation]);

  const fitCoordinates = () => {
    if (coordinates.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true
      });
    }
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
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        customMapStyle={mapStyle}
        onLayout={fitCoordinates}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <View style={styles.currentLocationMarker}>
              <View style={[styles.currentLocationDot, { backgroundColor: theme.colors.primary }]} />
            </View>
          </Marker>
        )}
        
        {coordinates.length > 1 && (
          <Polyline
            coordinates={coordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
      </MapView>
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
