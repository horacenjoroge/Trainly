// MainComponent.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrainingScreen from '../screens/TrainingScreen';
import TrainingSelectionScreen from '../screens/TrainingSelectionScreen';
import EmergencyServicesScreen from '../screens/EmergencyServicesScreen';
import ContactsScreen from '../screens/contactScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import CreateProgressPostScreen from '../screens/CreatePostScreen';
import CommunityFeedScreen from '../screens/CommunityFeedScreen';
import { theme } from '../theme';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack navigators configuration
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      cardStyle: { backgroundColor: theme.colors.background }
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Home' }}  
    />
    <Stack.Screen 
      name="TrainingSelection" 
      component={TrainingSelectionScreen}
      options={{ 
        title: 'Select Training',
      }}
    />
    <Stack.Screen 
      name="CreatePost" 
      component={CreateProgressPostScreen}
      options={{ 
        title: 'Share Progress',
        presentation: 'modal'
      }}
    />
  </Stack.Navigator>
);

const CommunityStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      cardStyle: { backgroundColor: theme.colors.background }
    }}
  >
    <Stack.Screen 
      name="CommunityFeed" 
      component={CommunityFeedScreen}
      options={{ title: 'Community' }}
    />
    <Stack.Screen 
      name="CreatePost" 
      component={CreateProgressPostScreen}
      options={{ 
        title: 'Share Progress',
        presentation: 'modal'
      }}
    />
  </Stack.Navigator>
);

const TrainingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      cardStyle: { backgroundColor: theme.colors.background }
    }}
  >
    <Stack.Screen 
      name="TrainingSelection" 
      component={TrainingSelectionScreen} 
      options={{ title: 'Select Training' }}
    />
    <Stack.Screen 
      name="Training" 
      component={TrainingScreen} 
      options={{ title: 'Start Training' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      cardStyle: { backgroundColor: theme.colors.background }
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen 
      name="PersonalInfo" 
      component={PersonalInfoScreen}
      options={{ title: 'Personal Information' }}
    />
  </Stack.Navigator>
);

const EmergencyStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      cardStyle: { backgroundColor: theme.colors.background }
    }}
  >
    <Stack.Screen 
      name="EmergencyServices" 
      component={EmergencyServicesScreen}
      options={{ title: 'Emergency Services' }}
    />
    <Stack.Screen 
      name="EmergencyContacts" 
      component={ContactsScreen}
      options={{
        title: 'Emergency Contacts',
        headerRight: () => (
          <Ionicons 
            name="person-add-outline" 
            size={24} 
            color={theme.colors.text}
            style={{ marginRight: 16 }}
          />
        ),
      }}
    />
  </Stack.Navigator>
);

// Empty component for logout menu item
const EmptyComponent = () => null;

const MainComponent = () => {
  // Add logout handler
  const handleLogout = async () => {
    try {
      // Just clear the authentication token - App.js will handle the rest
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      
      // No navigation needed here - App.js will detect token removal
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 240,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerActiveBackgroundColor: `${theme.colors.primary}20`,
        drawerInactiveBackgroundColor: 'transparent',
        drawerLabelStyle: {
          marginLeft: -10,
          fontSize: 14,
          fontWeight: '500',
        },
        sceneContainerStyle: {
          backgroundColor: theme.colors.background,
        }
      }}
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          headerTitle: 'Home',
          title: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          headerTitle: 'Community',
          title: 'Community',
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TrainingStack"
        component={TrainingStack}
        options={{
          headerTitle: 'Training',
          title: 'Training',
          drawerIcon: ({ color }) => (
            <Ionicons name="fitness-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          headerTitle: 'Profile',
          title: 'Profile',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="EmergencyStack"
        component={EmergencyStack}
        options={{
          headerTitle: 'Emergency Services',
          title: 'Emergency Services',
          drawerIcon: ({ color }) => (
            <Ionicons name="alert-circle-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={EmptyComponent} // Empty component
        options={{
          title: 'Logout',
          drawerIcon: ({ color }) => (
            <Ionicons name="log-out-outline" size={20} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: () => {
            handleLogout();
            return false; // Prevent default navigation
          }
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainComponent;