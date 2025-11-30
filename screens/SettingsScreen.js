// screens/SettingsScreen.js - Modern Redesign
import React, { useState, useEffect, useCallback } from 'react';
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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { log, logError } from '../utils/logger';

const USER_DATA_KEY = '@user_data';

// Modern setting item component
const SettingItem = ({ icon, title, description, type, value, onValueChange, onPress, theme, iconColor, showChevron = true }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        { backgroundColor: theme.colors.surface }
      ]} 
      onPress={type === 'chevron' ? onPress : null}
      disabled={type !== 'chevron'}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={22} color={iconColor || theme.colors.primary} />
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
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
          thumbColor={value ? theme.colors.primary : '#f4f3f4'}
          ios_backgroundColor={theme.colors.border}
        />
      )}
      {type === 'chevron' && showChevron && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { logout, user } = useAuth();
  
  // State for various settings
  const [profileImage, setProfileImage] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Load user profile from storage - ORIGINAL CODE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Load from AsyncStorage first
        const localData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (localData) {
          const parsedData = JSON.parse(localData);
          setDisplayName(parsedData.fullName || parsedData.name || 'User');
          setUserEmail(parsedData.email || '');
          setProfileImage(parsedData.avatar);
          setUserData(parsedData);
        }
        
        // Load from regular userData storage
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setDisplayName(prev => parsedData.name || prev || 'User');
          setUserEmail(prev => parsedData.email || prev || '');
          setProfileImage(prev => parsedData.avatar || prev);
          setUserData(prev => ({...prev, ...parsedData}));
        }
        
        // Try to get profile from API for latest data
        if (user) {
          try {
            const profileData = await userService.getUserProfile();
            if (profileData) {
              setDisplayName(profileData.name || displayName || 'User');
              setUserEmail(profileData.email || userEmail || '');
              setProfileImage(profileData.avatar || profileImage);
              setUserData(prev => ({...prev, ...profileData}));
            }
          } catch (apiError) {
            log('Using cached profile data');
          }
        }
      } catch (error) {
        logError('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [user]);

  // ONLY FIX: Simple focus refresh without dependencies to prevent infinite loop
  useFocusEffect(
    useCallback(() => {
      const refreshProfile = async () => {
        try {
          // Load from AsyncStorage first
          const localData = await AsyncStorage.getItem(USER_DATA_KEY);
          if (localData) {
            const parsedData = JSON.parse(localData);
            setDisplayName(parsedData.fullName || parsedData.name || 'User');
            setUserEmail(parsedData.email || '');
            setProfileImage(parsedData.avatar);
            setUserData(parsedData);
          }
          
          // Load from regular userData storage
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            setDisplayName(prev => parsedData.name || prev || 'User');
            setUserEmail(prev => parsedData.email || prev || '');
            setProfileImage(prev => parsedData.avatar || prev);
            setUserData(prev => ({...prev, ...parsedData}));
          }
        } catch (error) {
          logError('Error refreshing profile:', error);
        }
      };
      
      refreshProfile();
    }, []) // Empty dependency array prevents infinite loop
  );
  
  // Handle logout with proper cleanup and navigation - ORIGINAL CODE
  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              log('🚪 Starting logout process from Settings...');
              
              // Clear user data and preferences first
              await AsyncStorage.multiRemove([
                'userData',
                USER_DATA_KEY,
                'token',
                'refreshToken',
                'settings_push_notifications'
              ]);
              
              log('🧹 Cleared local storage');
              
              // Call the auth logout function
              await logout();
              
              log('✅ Settings logout completed successfully');
              
              // Force navigation to auth screen immediately
              // Don't rely on the auth context navigation
              setTimeout(() => {
                log('🔄 Force navigating to Auth screen');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                });
              }, 100);
              
            } catch (error) {
              logError('❌ Settings logout error:', error);
              setIsLoggingOut(false);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Handle opening external links
  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      logError('Error opening link:', error);
      Alert.alert('Error', 'Failed to open link');
    }
  };

  // Safely get image URI - UPDATED to use production backend
  const getSafeImageUri = (imageSource) => {
    if (typeof imageSource !== 'string') {
      return imageSource;
    }
    
    if (!imageSource) {
      return require('../assets/images/bike.jpg');
    }
    
    if (imageSource.startsWith('/uploads/')) {
      return { uri: `https://trainingapp-api-production.up.railway.app${imageSource}` };
    }
    
    if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
      return { uri: imageSource };
    }
    
    return require('../assets/images/bike.jpg');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Settings
          </Text>
        </View>

        {/* User Profile Card */}
        <View 
          style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}
        >
          <Image 
            source={getSafeImageUri(profileImage)}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
              {userEmail || 'Fitness enthusiast'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('PersonalInfo')}
            style={styles.editProfileButton}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preferences
          </Text>
          
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            description={theme.isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
            type="switch"
            value={theme.isDarkMode}
            onValueChange={theme.toggleDarkMode}
            theme={theme}
            iconColor="#6366f1"
          />
        </View>

        {/* Health & Safety */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Safety
          </Text>
          
          <SettingItem
            icon="shield-outline"
            title="Emergency Contacts"
            description="Manage emergency contacts and services"
            type="chevron"
            onPress={() => navigation.navigate('EmergencyServices')}
            theme={theme}
            iconColor="#ef4444"
          />
        </View>

        {/* Account Management */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>
          
          <SettingItem
            icon="lock-closed-outline"
            title="Security"
            description="Password and security settings"
            type="chevron"
            onPress={() => navigation.navigate('SecuritySettings')}
            theme={theme}
            iconColor="#f59e0b"
          />
          
          <SettingItem
            icon="people-outline"
            title="Find Friends"
            description="Connect with other users"
            type="chevron"
            onPress={() => navigation.navigate('FindFriends')}
            theme={theme}
            iconColor="#10b981"
          />
        </View>

        {/* Support & Legal */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Support
          </Text>
          
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            description="Get help and support"
            type="chevron"
            onPress={() => {
              Alert.alert('Help Center', 'Contact support at: support@trainlyapp.com');
            }}
            theme={theme}
            iconColor="#8b5cf6"
          />
          
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            description="View our terms and conditions"
            type="chevron"
            onPress={() => {
              openExternalLink('https://horacenjoroge.github.io/trainly-legal-docs/terms.html');
            }}
            theme={theme}
            iconColor="#6b7280"
          />
          
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            description="How we protect your data"
            type="chevron"
            onPress={() => {
              openExternalLink('https://horacenjoroge.github.io/trainly-legal-docs/privacy.html');
            }}
            theme={theme}
            iconColor="#6b7280"
          />
          
          <SettingItem
            icon="information-circle-outline"
            title="About Trainly"
            description="Version 1.0.0"
            type="chevron"
            onPress={() => {
              Alert.alert(
                'About Trainly', 
                'Trainly v1.0.0\n\nYour personal fitness companion designed to help you achieve your health and fitness goals.\n\nDeveloped with ❤️ for fitness enthusiasts.',
                [{ text: 'OK' }]
              );
            }}
            theme={theme}
            iconColor="#64748b"
            showChevron={false}
          />
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={[styles.signOutButton, { 
            backgroundColor: theme.colors.error || '#ef4444',
            opacity: isLoggingOut ? 0.6 : 1
          }]}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.signOutText}>
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
            Trainly • Version 1.0.0
          </Text>
          <Text style={[styles.appCopyright, { color: theme.colors.textSecondary }]}>
            © 2025 Trainly. All rights reserved.
          </Text>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editProfileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 124, 11, 0.1)',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
  },
});

export default SettingsScreen;