import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Vibration,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView
} from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import EmergencyMap from '../components/EmergencyMap';

const EMERGENCY_CONTACTS_KEY = '@emergency_contacts';
const FALL_DETECTION_KEY = '@fall_detection_active';

export default function EmergencyServicesScreen({ navigation }) {
  const theme = useTheme();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [fallDetectionActive, setFallDetectionActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    const initializeServices = async () => {
      await setupLocation();
      await loadContacts();
      setIsLoading(false);
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
        const contacts = JSON.parse(savedContacts);
        console.log('Raw saved contacts:', savedContacts);
        console.log('Parsed contacts:', JSON.stringify(contacts, null, 2));
        const validContacts = Array.isArray(contacts) ? contacts : [];
        setEmergencyContacts(validContacts);
        if (validContacts.length === 0) {
          console.log('No valid contacts found after parsing');
        } else {
          console.log('Contacts loaded successfully:', validContacts);
        }
      } else {
        console.log('No contacts found in AsyncStorage');
        setEmergencyContacts([]);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setEmergencyContacts([]);
      Alert.alert('Error', 'Failed to load contacts, starting with empty list');
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+\d{10,}$/;
    return phoneRegex.test(phoneNumber);
  };

  const refreshContacts = async () => {
    await loadContacts();
    Alert.alert('Success', 'Contacts refreshed');
  };

  const sendSOSMessage = async () => {
    if (isSendingSOS) return;

    setIsSendingSOS(true);
    try {
      if (!currentLocation) {
        Alert.alert('Location not available', 'Please wait for location access');
        return;
      }

      console.log('Current emergency contacts before filtering:', JSON.stringify(emergencyContacts, null, 2));
      const validContacts = emergencyContacts
        .filter(contact => {
          if (!contact) {
            console.log('Invalid contact (null or undefined):', contact);
            return false;
          }
          const phone = contact.phoneNumber || contact.phone;
          if (!phone) {
            console.log('Invalid contact (missing phone/phoneNumber):', contact);
            return false;
          }
          const trimmedPhone = phone.trim();
          const isValid = validatePhoneNumber(trimmedPhone);
          console.log(`Phone number ${trimmedPhone} is ${isValid ? 'valid' : 'invalid'}`);
          return isValid;
        })
        .map(contact => (contact.phoneNumber || contact.phone).trim());

      console.log('Valid contacts after filtering:', validContacts);

      if (validContacts.length === 0) {
        Alert.alert(
          'No Valid Contacts',
          'No valid emergency contacts found. Please ensure contacts have phone numbers starting with a country code (e.g., +254) and at least 10 digits.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Add Contacts', onPress: () => navigation.navigate('EmergencyContacts') }
          ]
        );
        return;
      }

      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS service not available on this device');
        return;
      }

      const mapsUrl = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
      const sosMessage = `EMERGENCY ALERT! I need help. My location: ${mapsUrl}`;

      await Promise.all(
        validContacts.map(async (number) => {
          try {
            console.log(`Sending SOS to ${number}`);
            await SMS.sendSMSAsync([number], sosMessage);
          } catch (err) {
            console.error(`Failed to send to ${number}:`, err);
          }
        })
      );
      Alert.alert('SOS Sent', 'Emergency alerts have been sent to your contacts');
    } catch (error) {
      console.error('SOS Error:', error);
      Alert.alert('Error', 'Failed to send emergency messages');
    } finally {
      setIsSendingSOS(false);
    }
  };

  const initializeFallDetection = async () => {
    try {
      setFallDetectionActive(true);
      await Accelerometer.setUpdateInterval(200);
      accelerometerSubscription.current = Accelerometer.addListener(data => {
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
    const acceleration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    if (acceleration > 2.5 && !isSendingSOS) {
      Vibration.vibrate([500, 500, 500]);
      Alert.alert(
        'Fall Detected',
        'Emergency contacts will be notified',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send Alert', onPress: () => sendSOSMessage() }
        ],
        { onDismiss: () => Vibration.cancel() }
      );
    }
  };

  const stopFallDetection = () => {
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
      accelerometerSubscription.current = null;
    }
    setFallDetectionActive(false);
    Vibration.cancel();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Setting up emergency services...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Emergency Services
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <TouchableOpacity 
            style={[styles.sosButton, { backgroundColor: theme.colors.error || '#FF3B30' }]}
            onPress={sendSOSMessage}
            disabled={isSendingSOS}
          >
            {isSendingSOS ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <>
                <Ionicons name="alert-circle" size={50} color="white" />
                <Text style={styles.sosButtonText}>EMERGENCY SOS</Text>
                <Text style={styles.sosDescription}>
                  Alert your emergency contacts with your location
                </Text>
              </>
            )}
          </TouchableOpacity>

          <EmergencyMap 
            currentLocation={currentLocation}
            theme={theme}
          />

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="people" size={24} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Emergency Contacts
                </Text>
              </View>
              <TouchableOpacity onPress={refreshContacts}>
                <Text style={[styles.cardSubtitle, { color: theme.colors.primary }]}>Refresh</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardContent}>
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
                  {emergencyContacts.slice(0, 2).map((contact, index) => (
                    <View key={contact.id || index} style={styles.contactItem}>
                      <Ionicons 
                        name="person-circle-outline" 
                        size={20} 
                        color={theme.colors.textSecondary} 
                        style={styles.contactIcon}
                      />
                      <Text style={[styles.contactText, { color: theme.colors.text }]}>
                        {contact.name} - {contact.phoneNumber || contact.phone || 'No phone number'}
                      </Text>
                    </View>
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
              style={[styles.manageButton, { borderTopColor: theme.colors.border }]}
              onPress={() => navigation.navigate('EmergencyContacts')}
            >
              <Text style={[styles.manageButtonText, { color: theme.colors.primary }]}>
                {emergencyContacts.length === 0 ? 'Add Contacts' : 'Manage Contacts'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Ionicons 
                  name="body" 
                  size={24} 
                  color={fallDetectionActive ? theme.colors.primary : theme.colors.text} 
                />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Fall Detection
                </Text>
              </View>
              {fallDetectionActive && (
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.statusText, { color: theme.colors.primary }]}>ACTIVE</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
              Automatically detect falls and send alerts to your emergency contacts. This feature uses your phone's motion sensors.
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                { 
                  backgroundColor: fallDetectionActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: fallDetectionActive ? 0 : 1
                }
              ]}
              onPress={fallDetectionActive ? stopFallDetection : initializeFallDetection}
            >
              <Text style={[
                styles.toggleButtonText,
                { color: fallDetectionActive ? 'white' : theme.colors.text }
              ]}>
                {fallDetectionActive ? 'Disable Fall Detection' : 'Enable Fall Detection'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 124, 11, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sosButton: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
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
  sosDescription: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 20,
    opacity: 0.8,
  },
  card: {
    borderRadius: 16,
    marginVertical: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardDescription: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 16,
  },
  moreContacts: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  manageButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    marginTop: 8,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});