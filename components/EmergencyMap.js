import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function EmergencyMap({ currentLocation, theme }) {
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
      >
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <View style={styles.currentLocationMarker}>
              <View style={[styles.currentLocationDot, { backgroundColor: theme.colors.error }]} />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    overflow: 'hidden',
    width: '100%',
    borderRadius: 16,
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
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
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