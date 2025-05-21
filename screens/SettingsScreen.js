// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';

// Setting section component
const SettingSection = ({ title, children, theme }) => (
  <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
      {title}
    </Text>
    {children}
  </View>
);

// Individual setting item component
const SettingItem = ({ icon, title, description, type, value, onValueChange, onPress, theme }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        { borderBottomColor: theme.colors.border }
      ]} 
      onPress={type === 'chevron' ? onPress : null}
      disabled={type !== 'chevron'}
    >
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
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
          thumbColor={value ? theme.colors.primary : '#f4f3f4'}
          ios_backgroundColor={theme.colors.border}
        />
      )}
      {type === 'chevron' && (
        <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { logout, user } = useAuth();
  
  // State for various settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [userData, setUserData] = useState({});
  
  // Load user profile and settings from storage
  useEffect(() => {
    const loadProfileAndSettings = async () => {
      // Load settings
      try {
        const pushSetting = await AsyncStorage.getItem('settings_push_notifications');
        
        if (pushSetting !== null) setPushNotifications(pushSetting === 'true');
        
        // Load user profile data
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setDisplayName(parsedData.name || 'User');
          setProfileImage(parsedData.avatar);
          setUserData(parsedData);
        }
        
        // Try to get profile from API
        if (user) {
          try {
            const profileData = await userService.getUserProfile();
            if (profileData) {
              setDisplayName(profileData.name || user.name || 'User');
              setProfileImage(profileData.avatar);
              setUserData(prev => ({...prev, ...profileData}));
              
              // Save updated profile data to AsyncStorage
              await AsyncStorage.setItem('userData', JSON.stringify({
                ...userData,  // Use the current userData state
                ...profileData
              }));
            }
          } catch (apiError) {
            console.error('Error fetching profile from API:', apiError);
          }
        }
      } catch (error) {
        console.error('Error loading profile and settings:', error);
      }
    };
    
    loadProfileAndSettings();
  }, [user]);
  
  // Save setting to AsyncStorage
  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };
  
  // Handle setting toggles
  const handlePushNotificationsToggle = (value) => {
    setPushNotifications(value);
    saveSetting('settings_push_notifications', value);
  };
  
  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Safely get image URI
  const getSafeImageUri = (imageSource) => {
    if (typeof imageSource !== 'string') {
      return imageSource;
    }
    
    if (!imageSource) {
      return require('../assets/images/bike.jpg');
    }
    
    if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
      return { uri: imageSource };
    }
    
    return require('../assets/images/bike.jpg');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* User Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={() => navigation.navigate('ProfileStack')}
          >
            <Image 
              source={getSafeImageUri(profileImage)}
              style={styles.profileImage}
            />
            <View style={[styles.editButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.profileName, { color: theme.colors.text }]}>
            {displayName}
          </Text>
          
          <TouchableOpacity
            style={[styles.viewProfileButton, { borderColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('ProfileStack')}
          >
            <Text style={[styles.viewProfileText, { color: theme.colors.primary }]}>
              View Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <SettingSection title="App Settings" theme={theme}>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            description="Get updates about your workouts"
            type="switch"
            value={pushNotifications}
            onValueChange={handlePushNotificationsToggle}
            theme={theme}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            description="Switch to dark theme"
            type="switch"
            value={theme.isDarkMode}
            onValueChange={theme.toggleDarkMode}
            theme={theme}
          />
        </SettingSection>

        {/* Account Section */}
        <SettingSection title="Account" theme={theme}>
          <SettingItem
            icon="lock-closed-outline"
            title="Security"
            description="Change password and security settings"
            type="chevron"
            onPress={() => navigation.navigate('SecuritySettings')}
            theme={theme}
          />
          <SettingItem
            icon="globe-outline"
            title="Language"
            description="English (US)"
            type="chevron"
            onPress={() => navigation.navigate('LanguageSettings')}
            theme={theme}
          />
        </SettingSection>

        {/* Health & Safety */}
        <SettingSection title="Health & Safety" theme={theme}>
          <SettingItem
            icon="alert-circle-outline"
            title="Emergency Services"
            description="Set up emergency contacts and alerts"
            type="chevron"
            onPress={() => navigation.navigate('EmergencyStack', { screen: 'EmergencyServices' })}
            theme={theme}
          />
          <SettingItem
            icon="heart-outline"
            title="Heart Rate Zones"
            description="Configure your training zones"
            type="chevron"
            onPress={() => navigation.navigate('HeartRateZones')}
            theme={theme}
          />
        </SettingSection>

        {/* Privacy & Sharing */}
        <SettingSection title="Privacy & Sharing" theme={theme}>
          <SettingItem
            icon="share-social-outline"
            title="Social Sharing"
            description="Manage sharing preferences"
            type="chevron"
            onPress={() => navigation.navigate('SocialSharing')}
            theme={theme}
          />
          <SettingItem
            icon="people-outline"
            title="Find Friends"
            description="Connect with other fitness enthusiasts"
            type="chevron"
            onPress={() => navigation.navigate('FindFriends')}
            theme={theme}
          />
          <SettingItem
            icon="shield-outline"
            title="Privacy Settings"
            description="Control who can see your activities"
            type="chevron"
            onPress={() => navigation.navigate('PrivacySettings')}
            theme={theme}
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="Support" theme={theme}>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            description="Get help and support"
            type="chevron"
            onPress={() => {/* Navigate to Help Center */}}
            theme={theme}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            type="chevron"
            onPress={() => {/* Show Terms of Service */}}
            theme={theme}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            type="chevron"
            onPress={() => {/* Show Privacy Policy */}}
            theme={theme}
          />
          <SettingItem
            icon="information-circle-outline"
            title="About"
            description="Version 1.0.0"
            type="chevron"
            onPress={() => {/* Show About Screen */}}
            theme={theme}
          />
        </SettingSection>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.error || '#ff3b30' }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#E57C0B',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  viewProfileButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
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

export default SettingsScreen;