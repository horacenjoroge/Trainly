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
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import EmergencyMap from '../components/EmergencyMap';
import { authService } from '../services/api';

const CONTACTS_URL = '/api/contacts';

export default function EmergencyServicesScreen({ navigation }) {
  const theme = useTheme();
  const { isAuthenticated, isLoading: authLoading, user, refreshAuth } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [fallDetectionActive, setFallDetectionActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const accelerometerSubscription = useRef(null);

  // State for adding/updating contacts
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  useEffect(() => {
    const initializeServices = async () => {
      await setupLocation();
      if (isAuthenticated) {
        await loadContacts();
      }
      setIsLoading(false);
    };
    initializeServices();
    return () => {
      stopFallDetection();
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isAuthenticated]);

  const setupLocation = async () => {
    try {
      console.log('Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }
      console.log('Fetching initial location...');
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const initialLocation = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      setCurrentLocation(initialLocation);
      console.log('Location fetched:', initialLocation);
      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (newLocation) => {
          const updatedLocation = { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude };
          setCurrentLocation(updatedLocation);
          console.log('Location updated:', updatedLocation);
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
      console.log('Sending request to GET /api/contacts...');
      const response = await authService.getContacts();
      console.log('Received response from GET /api/contacts:', response);
      setEmergencyContacts(response || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setEmergencyContacts([]);
      Alert.alert('Error', 'Failed to load contacts. Please log in again.');
      if (!authLoading && !isAuthenticated) navigation.navigate('Auth');
    }
  };

  const addOrUpdateContact = async () => {
    if (!newContactName || !newContactPhone) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }
    try {
      if (editingContact) {
        // Update existing contact
        console.log('Sending request to PUT /api/contacts/:id...', { id: editingContact._id, name: newContactName, phoneNumber: newContactPhone });
        const response = await authService.updateContact(editingContact._id, { name: newContactName, phoneNumber: newContactPhone });
        console.log('Received response from PUT /api/contacts/:id:', response);
        setEmergencyContacts(emergencyContacts.map(c => (c._id === editingContact._id ? response : c)));
        Alert.alert('Success', 'Contact updated');
      } else {
        // Add new contact
        console.log('Sending request to POST /api/contacts...', { name: newContactName, phoneNumber: newContactPhone });
        const response = await authService.addContact({ name: newContactName, phoneNumber: newContactPhone });
        console.log('Received response from POST /api/contacts:', response);
        setEmergencyContacts([...emergencyContacts, response]);
        Alert.alert('Success', 'Contact added');
      }
      setModalVisible(false);
      setNewContactName('');
      setNewContactPhone('');
      setEditingContact(null);
    } catch (error) {
      console.error('Error adding/updating contact:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save contact');
    }
  };

  const deleteContact = async (contactId) => {
    try {
      console.log('Sending request to DELETE /api/contacts/:id...', { id: contactId });
      await authService.deleteContact(contactId);
      console.log('Contact deleted:', contactId);
      setEmergencyContacts(emergencyContacts.filter(c => c._id !== contactId));
      Alert.alert('Success', 'Contact deleted');
    } catch (error) {
      console.error('Error deleting contact:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete contact');
    }
  };

  const openContactModal = (contact = null) => {
    setEditingContact(contact);
    setNewContactName(contact ? contact.name : '');
    setNewContactPhone(contact ? contact.phoneNumber : '');
    setModalVisible(true);
  };

  const sendSOSMessage = async () => {
    if (isSendingSOS || !isAuthenticated) return;
    setIsSendingSOS(true);
    try {
      if (!currentLocation) {
        Alert.alert('Location not available', 'Please wait for location access');
        return;
      }
      if (emergencyContacts.length === 0) {
        Alert.alert('No Contacts', 'No emergency contacts found. Please add contacts.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Contact', onPress: () => openContactModal() },
        ]);
        return;
      }
      const mapsUrl = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
      console.log('Sending request to POST /send-sos with location:', currentLocation);
      const response = await authService.sendSOS({ locationUrl: mapsUrl });
      console.log('Received response from POST /send-sos:', response);
      const results = response.data;
      let successCount = 0;
      let errorMessages = [];
      Object.entries(results).forEach(([phone, result]) => {
        if (result.startsWith('Sent')) successCount++;
        else errorMessages.push(`${phone}: ${result}`);
      });
      if (successCount === emergencyContacts.length) {
        Alert.alert('SOS Sent', 'Emergency alerts have been sent to all contacts');
      } else {
        Alert.alert('SOS Partially Sent', `Sent to ${successCount} of ${emergencyContacts.length} contacts.\n\nErrors:\n${errorMessages.join('\n')}`);
      }
    } catch (error) {
      console.error('SOS Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send emergency messages');
    } finally {
      setIsSendingSOS(false);
    }
  };

  const initializeFallDetection = async () => {
    try {
      console.log('Initializing fall detection...');
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
    if (acceleration > 2.5 && !isSendingSOS && isAuthenticated) {
      Vibration.vibrate([500, 500, 500]);
      Alert.alert('Fall Detected', 'Emergency contacts will be notified', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Alert', onPress: () => sendSOSMessage() },
      ], { onDismiss: () => Vibration.cancel() });
    }
  };

  const stopFallDetection = () => {
    console.log('Stopping fall detection...');
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
      accelerometerSubscription.current = null;
    }
    setFallDetectionActive(false);
    Vibration.cancel();
  };

  if (authLoading || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Setting up emergency services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Please log in to access emergency services.</Text>
          <TouchableOpacity style={[styles.authButton, { backgroundColor: theme.colors.primary }]} onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.authButtonText}>Go to Login</Text>
          </TouchableOpacity>
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
          {/* SOS Button */}
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
                <Text style={styles.sosDescription}>Alert your emergency contacts with your location</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Location Map */}
          <EmergencyMap currentLocation={currentLocation} theme={theme} />

          {/* Contacts Section */}
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
                  <View key={contact._id} style={styles.contactItem}>
                    <Ionicons name="person-circle-outline" size={20} color={theme.colors.textSecondary} style={styles.contactIcon} />
                    <Text style={[styles.contactText, { color: theme.colors.text }]}>
                      {contact.name} - {contact.phoneNumber}
                    </Text>
                    <View style={styles.contactActions}>
                      <TouchableOpacity onPress={() => openContactModal(contact)}>
                        <Ionicons name="pencil" size={20} color={theme.colors.primary} style={styles.actionIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteContact(contact._id)}>
                        <Ionicons name="trash" size={20} color={theme.colors.error || '#FF3B30'} style={styles.actionIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Fall Detection Section */}
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
              Automatically detect falls and send alerts to your emergency contacts. This feature uses your phone's motion sensors.
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

      {/* Modal for Adding/Updating Contacts */}
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
              placeholder="Phone Number (e.g., +1234567890)"
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
    borderBottomColor: 'rgba(229, 124, 11, 0.2)',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40 },
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
  authButton: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  authButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});