import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  TextInput,
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const MAX_CONTACTS = 5;
const CONTACTS_KEY = '@emergency_contacts';

export default function ContactsScreen({ navigation }) {
  const theme = useTheme();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const saved = await AsyncStorage.getItem(CONTACTS_KEY);
      if (saved) setContacts(JSON.parse(saved));
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const saveContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    if (contacts.length >= MAX_CONTACTS) {
      Alert.alert('Error', 'Maximum 5 emergency contacts allowed');
      return;
    }

    const formattedPhone = phone.replace(/[^\d+]/g, '');
    if (!formattedPhone.match(/^\+?[\d]{10,}$/)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      const newContacts = [...contacts, { id: Date.now(), name, phone: formattedPhone }];
      await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(newContacts));
      setContacts(newContacts);
      setName('');
      setPhone('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact');
    }
  };

  const deleteContact = async (id) => {
    try {
      const newContacts = contacts.filter(c => c.id !== id);
      await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(newContacts));
      setContacts(newContacts);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete contact');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          placeholder="Contact Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={theme.colors.text}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={theme.colors.text}
        />
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={saveContact}
        >
          <Text style={styles.buttonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contactsList}>
        {contacts.map(contact => (
          <View key={contact.id} style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
            <View>
              <Text style={[styles.contactName, { color: theme.colors.text }]}>{contact.name}</Text>
              <Text style={[styles.contactPhone, { color: theme.colors.text }]}>{contact.phone}</Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteContact(contact.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contactsList: {
    flex: 1,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  }
});