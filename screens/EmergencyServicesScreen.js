// EmergencyServicesScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Vibration,
  ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import EmergencyMap from '../components/EmergencyMap';

const EMERGENCY_CONTACTS_KEY = '@emergency_contacts';

export default function EmergencyServicesScreen({ navigation }) {
  const theme = useTheme();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [fallDetectionActive, setFallDetectionActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);

  // Initialize location and contacts
  useEffect(() => {
    const initializeServices = async () => {
      await setupLocation();
      await loadContacts();
    };

    initializeServices();
    return () => {
      stopFallDetection();
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const setupLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setCurrentLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Location setup error:', error);
      Alert.alert('Error', 'Failed to access location services');
    }
  };

  const loadContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem(EMERGENCY_CONTACTS_KEY);
      if (savedContacts) {
        setEmergencyContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const sendSOSMessage = async () => {
    if (!currentLocation) {
      Alert.alert('Location not available', 'Please wait for location access');
      return;
    }

    if (emergencyContacts.length === 0) {
      Alert.alert(
        'No Emergency Contacts', 
        'Please add emergency contacts first',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Contacts', onPress: () => navigation.navigate('EmergencyContacts') }
        ]
      );
      return;
    }

    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS service not available');
        return;
      }

      const sosMessage = `Emergency Alert! Location: https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
      
      for (const contact of emergencyContacts) {
        await SMS.sendSMSAsync([contact.phoneNumber], sosMessage);
      }

      Alert.alert('SOS Sent', 'Emergency contacts have been notified');
    } catch (error) {
      console.error('SOS Error:', error);
      Alert.alert('Error', 'Failed to send emergency messages');
    }
  };

  const initializeFallDetection = async () => {
    try {
      setFallDetectionActive(true);
      await Accelerometer.setUpdateInterval(100);
      Accelerometer.addListener(data => {
        setAccelerometerData(data);
        detectFall(data);
      });
    } catch (error) {
      console.error('Fall detection error:', error);
      Alert.alert('Error', 'Failed to start fall detection');
      setFallDetectionActive(false);
    }
  };

  const detectFall = (data) => {
    const acceleration = Math.sqrt(
      data.x * data.x + data.y * data.y + data.z * data.z
    );
    
    if (acceleration > 2.5) {
      Vibration.vibrate([500, 500, 500]);
      Alert.alert(
        'Fall Detected', 
        'Emergency contacts will be notified',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send Alert', onPress: sendSOSMessage }
        ]
      );
    }
  };

  const stopFallDetection = () => {
    Accelerometer.removeAllListeners();
    setFallDetectionActive(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={[styles.sosButton, { backgroundColor: theme.colors.error }]}
          onPress={sendSOSMessage}
        >
          <Ionicons name="alert-circle" size={50} color="white" />
          <Text style={styles.sosButtonText}>EMERGENCY SOS</Text>
        </TouchableOpacity>

        <EmergencyMap 
          currentLocation={currentLocation}
          theme={theme}
        />

        <View style={[styles.contactsPreview, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.contactsHeader}>
            <Text style={[styles.contactsTitle, { color: theme.colors.text }]}>
              Emergency Contacts ({emergencyContacts.length}/5)
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('EmergencyContacts')}
              style={styles.manageButton}
            >
              <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          {emergencyContacts.length === 0 ? (
            <TouchableOpacity
              style={styles.addContactButton}
              onPress={() => navigation.navigate('EmergencyContacts')}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.addContactText, { color: theme.colors.primary }]}>
                Add Emergency Contacts
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {emergencyContacts.slice(0, 2).map((contact) => (
                <Text key={contact.id} style={[styles.contactPreviewText, { color: theme.colors.text }]}>
                  {contact.name} - {contact.phoneNumber}
                </Text>
              ))}
              {emergencyContacts.length > 2 && (
                <Text style={[styles.moreContacts, { color: theme.colors.textSecondary }]}>
                  +{emergencyContacts.length - 2} more contacts
                </Text>
              )}
            </>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.fallDetectionButton, 
            { backgroundColor: fallDetectionActive ? theme.colors.primary : theme.colors.surface }
          ]}
          onPress={fallDetectionActive ? stopFallDetection : initializeFallDetection}
        >
          <Ionicons 
            name="body" 
            size={30} 
            color={fallDetectionActive ? 'white' : theme.colors.text} 
          />
          <Text style={[
            styles.fallDetectionText,
            { color: fallDetectionActive ? 'white' : theme.colors.text }
          ]}>
            {fallDetectionActive ? 'Stop Fall Detection' : 'Start Fall Detection'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  sosButton: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  contactsPreview: {
    width: '100%',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  manageButton: {
    padding: 5,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  addContactText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  contactPreviewText: {
    fontSize: 16,
    paddingVertical: 5,
  },
  moreContacts: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
  fallDetectionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  fallDetectionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});