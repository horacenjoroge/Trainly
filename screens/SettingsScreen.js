import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SettingItem = ({ icon, title, description, type, value, onValueChange }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.settingItem, { borderTopColor: theme.colors.border }]}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      {type === 'switch' && (
        <Switch value={value} onValueChange={onValueChange} />
      )}
      {type === 'chevron' && (
        <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
      )}
    </View>
  );
};

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [location, setLocation] = React.useState(true);
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            App Settings
          </Text>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            description="Get updates about your workouts"
            type="switch"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            description="Switch to dark theme"
            type="switch"
            value={theme.isDarkMode}
            onValueChange={theme.toggleDarkMode}
          />
          <SettingItem
            icon="location-outline"
            title="Location Services"
            description="For tracking outdoor workouts"
            type="switch"
            value={location}
            onValueChange={setLocation}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Account
          </Text>
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            type="chevron"
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            type="chevron"
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            description="English (US)"
            type="chevron"
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Support
          </Text>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            type="chevron"
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            type="chevron"
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            type="chevron"
          />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  settingIcon: {
    width: 40,
  },
  settingContent: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
});