import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import EmergencyMap from '../components/EmergencyMap';
import { debounce } from 'lodash';
import { log, logError, logWarn } from '../utils/logger';

const EMERGENCY_CONTACTS_KEY = '@emergency_contacts';

export default function EmergencyServicesScreen({ navigation }) {
  const theme = useTheme();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [fallDetectionActive, setFallDetectionActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [locationTrackingActive, setLocationTrackingActive] = useState(false);
  const [fallCountdown, setFallCountdown] = useState(0);
  const accelerometerSubscription = useRef(null);
  const lastFallDetected = useRef(0);
  const lastUpdate = useRef(0);
  const fallTimerRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const debouncedSetCurrentLocation = useCallback(
    debounce((newLocation) => {
      setCurrentLocation({ latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude });
    }, 500),
    []
  );

  useEffect(() => {
    const initializeServices = async () => {
      await loadContacts();
      setIsLoading(false);
    };
    initializeServices();

    return () => {
      stopFallDetection();
      stopLocationTracking();
      if (fallTimerRef.current) {
        clearInterval(fallTimerRef.current);
        fallTimerRef.current = null;
        log('Cleaned up fall timer on unmount');
      }
    };
  }, []);

  const setupLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        log('Location permission denied');
        setLocationTrackingActive(false);
        return false;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        debouncedSetCurrentLocation
      );
      setLocationSubscription(subscription);
      setLocationTrackingActive(true);
      log('Location tracking enabled');
      return true;
    } catch (error) {
      logError('Location setup error:', error);
      setLocationTrackingActive(false);
      return false;
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
    setLocationTrackingActive(false);
    setCurrentLocation(null);
    log('Location tracking stopped');
  };

  const toggleLocationTracking = async () => {
    if (locationTrackingActive) {
      stopLocationTracking();
    } else {
      await setupLocation();
    }
  };

  const loadContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem(EMERGENCY_CONTACTS_KEY);
      if (savedContacts) {
        const contacts = JSON.parse(savedContacts);
        setEmergencyContacts(Array.isArray(contacts) ? contacts : []);
      } else {
        setEmergencyContacts([]);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setEmergencyContacts([]);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const saveContacts = async (contacts) => {
    try {
      await AsyncStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts:', error);
      Alert.alert('Error', 'Failed to save contacts');
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+\d{10,}$/;
    return phoneRegex.test(phoneNumber);
  };

  const addOrUpdateContact = async () => {
    if (!newContactName || !newContactPhone) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    if (!validatePhoneNumber(newContactPhone)) {
      Alert.alert('Invalid Phone Number', 'Phone number must start with a country code (e.g., +254) and have at least 10 digits');
      return;
    }

    try {
      let updatedContacts;
      if (editingContact) {
        updatedContacts = emergencyContacts.map(c =>
          c.id === editingContact.id
            ? { ...c, name: newContactName, phoneNumber: newContactPhone }
            : c
        );
        Alert.alert('Success', 'Contact updated');
      } else {
        const newContact = {
          id: Date.now().toString(),
          name: newContactName,
          phoneNumber: newContactPhone,
        };
        updatedContacts = [...emergencyContacts, newContact];
        Alert.alert('Success', 'Contact added');
      }

      setEmergencyContacts(updatedContacts);
      await saveContacts(updatedContacts);
      setModalVisible(false);
      setNewContactName('');
      setNewContactPhone('');
      setEditingContact(null);
    } catch (error) {
      console.error('Error adding/updating contact:', error);
      Alert.alert('Error', 'Failed to save contact');
    }
  };

  const deleteContact = async (contactId) => {
    try {
      const updatedContacts = emergencyContacts.filter(c => c.id !== contactId);
      setEmergencyContacts(updatedContacts);
      await saveContacts(updatedContacts);
      Alert.alert('Success', 'Contact deleted');
    } catch (error) {
      console.error('Error deleting contact:', error);
      Alert.alert('Error', 'Failed to delete contact');
    }
  };

  const openContactModal = (contact = null) => {
    setEditingContact(contact);
    setNewContactName(contact ? contact.name : '');
    setNewContactPhone(contact ? contact.phoneNumber : '');
    setModalVisible(true);
  };

  const sendSOSMessage = async (skipLocationCheck = false, isAutoSOS = false) => {
    if (isSendingSOS) {
      console.log('SOS already in progress, skipping');
      return;
    }
    setIsSendingSOS(true);
    console.log('Attempting to send SOS', { skipLocationCheck, isAutoSOS, locationTrackingActive, hasLocation: !!currentLocation });

    try {
      // For auto-SOS, attempt to get location if not available
      let finalLocation = currentLocation;
      if (!skipLocationCheck && (!locationTrackingActive || !currentLocation)) {
        if (isAutoSOS) {
          console.log('Auto-SOS: Attempting to fetch location');
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            finalLocation = { latitude: location.coords.latitude, longitude: location.coords.longitude };
            console.log('Auto-SOS: Location fetched', finalLocation);
          } else {
            console.log('Auto-SOS: Location permission denied');
          }
        } else {
          console.log('Manual SOS: Location check failed, prompting user');
          setIsSendingSOS(false);
          Alert.alert(
            'Location Required',
            'Location tracking must be enabled to send emergency alerts with your location.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Enable Location',
                onPress: async () => {
                  const success = await setupLocation();
                  if (success) {
                    setTimeout(() => {
                      if (currentLocation) {
                        sendSOSMessage(false);
                      } else {
                        Alert.alert('Error', 'Unable to get current location.');
                      }
                    }, 2000);
                  }
                },
              },
              { text: 'Send Without Location', onPress: () => sendSOSMessage(true) },
            ]
          );
          return;
        }
      }

      const validContacts = emergencyContacts
        .filter(contact => contact && validatePhoneNumber(contact.phoneNumber || contact.phone))
        .map(contact => (contact.phoneNumber || contact.phone).trim());

      console.log('Valid contacts:', validContacts.length);
      if (validContacts.length === 0) {
        console.log('No valid contacts found');
        Alert.alert('No Contacts', 'No emergency contacts found. Please add contacts.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Contact', onPress: () => openContactModal() },
        ]);
        setIsSendingSOS(false);
        return;
      }

      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        console.log('SMS service not available');
        Alert.alert('Error', 'SMS service not available on this device');
        setIsSendingSOS(false);
        return;
      }

      let sosMessage;
      if (finalLocation) {
        const mapsUrl = `https://www.google.com/maps?q=${finalLocation.latitude},${finalLocation.longitude}`;
        sosMessage = `EMERGENCY ALERT! I need help. My location: ${mapsUrl}`;
      } else {
        sosMessage = `EMERGENCY ALERT! I need help. Location not available - please call me immediately!`;
      }

      console.log('Sending SOS message:', sosMessage);
      await Promise.all(
        validContacts.map(async number => {
          try {
            await SMS.sendSMSAsync([number], sosMessage);
            console.log(`SOS sent to ${number}`);
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
      console.log('SOS sending completed');
    }
  };

  const initializeFallDetection = async () => {
    try {
      const isAvailable = await Accelerometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Accelerometer not available on this device');
        setFallDetectionActive(false);
        return;
      }

      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.remove();
        accelerometerSubscription.current = null;
      }

      await Accelerometer.setUpdateInterval(300);
      accelerometerSubscription.current = Accelerometer.addListener(data => {
        try {
          if (!fallDetectionActive) return;

          const now = Date.now();
          if (now - lastUpdate.current < 600) return;
          lastUpdate.current = now;

          detectFall(data);
        } catch (error) {
          console.error('Accelerometer listener error:', error);
        }
      });

      setFallDetectionActive(true);
      console.log('Fall detection initialized');
    } catch (error) {
      console.error('Fall detection initialization error:', error);
      Alert.alert('Error', 'Failed to start fall detection');
      setFallDetectionActive(false);
    }
  };

  const detectFall = async (data) => {
    const now = Date.now();
    if (now - lastFallDetected.current < 5000) return;

    const acceleration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    if (acceleration > 2.5 && !isSendingSOS && fallCountdown === 0) {
      lastFallDetected.current = now;
      Vibration.vibrate([500, 500, 500]);
      console.log('Fall detected, starting countdown');

      // Attempt to enable location tracking if not active
      if (!locationTrackingActive || !currentLocation) {
        console.log('Attempting to enable location for fall detection');
        await setupLocation();
      }

      setFallCountdown(10);

      fallTimerRef.current = setInterval(() => {
        setFallCountdown(prev => {
          console.log('Countdown tick:', prev - 1);
          if (prev <= 1) {
            clearInterval(fallTimerRef.current);
            fallTimerRef.current = null;
            console.log('Countdown complete, sending SOS');
            sendSOSMessage(false, true); // Respect location check, mark as auto-SOS
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert(
        'Fall Detected',
        'SOS will be sent in 10 seconds. Tap "Cancel" to stop.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              if (fallTimerRef.current) {
                clearInterval(fallTimerRef.current);
                fallTimerRef.current = null;
              }
              setFallCountdown(0);
              Vibration.cancel();
              console.log('Fall countdown canceled');
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const stopFallDetection = () => {
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
      accelerometerSubscription.current = null;
      console.log('Fall detection stopped');
    }
    if (fallTimerRef.current) {
      clearInterval(fallTimerRef.current);
      fallTimerRef.current = null;
      console.log('Fall timer cleared');
    }
    setFallDetectionActive(false);
    setFallCountdown(0);
    Vibration.cancel();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Setting up emergency services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Emergency Services</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {fallCountdown > 0 && (
            <View style={[styles.countdownBanner, { backgroundColor: theme.colors.error || '#FF3B30' }]}>
              <Text style={styles.countdownText}>
                Fall detected! Sending SOS in {fallCountdown} seconds...
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (fallTimerRef.current) {
                    clearInterval(fallTimerRef.current);
                    fallTimerRef.current = null;
                  }
                  setFallCountdown(0);
                  Vibration.cancel();
                  console.log('Countdown banner canceled');
                }}
              >
                <Text style={styles.countdownCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.sosButton, { backgroundColor: theme.colors.error || '#FF3B30' }]}
            onPress={() => sendSOSMessage(false)}
            disabled={isSendingSOS}
          >
            {isSendingSOS ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <>
                <Ionicons name="alert-circle" size={50} color="white" />
                <Text style={styles.sosButtonText}>EMERGENCY SOS</Text>
                <Text style={styles.sosDescription}>Alert your emergency contacts with your location</Text>
              </>
            )}
          </TouchableOpacity>

          <EmergencyMap currentLocation={currentLocation} theme={theme} />

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="location" size={24} color={locationTrackingActive ? theme.colors.primary : theme.colors.text} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Location Tracking</Text>
              </View>
              {locationTrackingActive && (
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.statusText, { color: theme.colors.primary }]}>ACTIVE</Text>
                </View>
              )}
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
              Enable location tracking to share your exact location during emergencies.
            </Text>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor: locationTrackingActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: locationTrackingActive ? 0 : 1,
                },
              ]}
              onPress={toggleLocationTracking}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  { color: locationTrackingActive ? 'white' : theme.colors.text },
                ]}
              >
                {locationTrackingActive ? 'Disable Location Tracking' : 'Enable Location Tracking'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="people" size={24} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Emergency Contacts</Text>
              </View>
              <TouchableOpacity onPress={() => openContactModal()}>
                <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              {emergencyContacts.length === 0 ? (
                <Text style={[styles.noContactsText, { color: theme.colors.textSecondary }]}>
                  No emergency contacts found. Add a contact to get started.
                </Text>
              ) : (
                emergencyContacts.map((contact) => (
                  <View key={contact.id} style={styles.contactItem}>
                    <Ionicons name="person-circle-outline" size={20} color={theme.colors.textSecondary} style={styles.contactIcon} />
                    <Text style={[styles.contactText, { color: theme.colors.text }]}>
                      {contact.name} - {contact.phoneNumber}
                    </Text>
                    <View style={styles.contactActions}>
                      <TouchableOpacity onPress={() => openContactModal(contact)}>
                        <Ionicons name="pencil" size={20} color={theme.colors.primary} style={styles.actionIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteContact(contact.id)}>
                        <Ionicons name="trash" size={20} color={theme.colors.error || '#FF3B30'} style={styles.actionIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="body" size={24} color={fallDetectionActive ? theme.colors.primary : theme.colors.text} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Fall Detection</Text>
              </View>
              {fallDetectionActive && (
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.statusText, { color: theme.colors.primary }]}>ACTIVE</Text>
                </View>
              )}
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
              Automatically detect falls and send alerts to your emergency contacts.
            </Text>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor: fallDetectionActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: fallDetectionActive ? 0 : 1,
                },
              ]}
              onPress={fallDetectionActive ? stopFallDetection : initializeFallDetection}
            >
             <Text
  style={[
    styles.toggleButtonText,
    { color: fallDetectionActive ? 'white' : theme.colors.text },
  ]}
>
                {fallDetectionActive ? 'Disable Fall Detection' : 'Enable Fall Detection'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={newContactName}
              onChangeText={setNewContactName}
            />
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Phone Number (e.g., +254123456789)"
              placeholderTextColor={theme.colors.textSecondary}
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={addOrUpdateContact}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.error || '#FF3B30' }]}
                onPress={() => {
                  setModalVisible(false);
                  setNewContactName('');
                  setNewContactPhone('');
                  setEditingContact(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40 },
  countdownBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  countdownText: { color: 'white', fontSize: 16, fontWeight: 'bold', flex: 1 },
  countdownCancel: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
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
  sosButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  sosDescription: { color: 'white', fontSize: 14, textAlign: 'center', marginTop: 8, marginHorizontal: 20, opacity: 0.8 },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  cardTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
  cardContent: { padding: 16, paddingTop: 0 },
  cardDescription: { fontSize: 14, paddingHorizontal: 16, marginBottom: 16 },
  noContactsText: { fontSize: 16, textAlign: 'center' },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  contactIcon: { marginRight: 8 },
  contactText: { fontSize: 16, flex: 1 },
  contactActions: { flexDirection: 'row' },
  actionIcon: { marginLeft: 12 },
  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  toggleButtonText: { fontSize: 16, fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 122, 255, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});