
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrainingScreen from '../screens/TrainingScreen';
import TrainingSelectionScreen from '../screens/TrainingSelectionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { theme } from '../theme';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
  </Stack.Navigator>
);

const MainComponent = () => {
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
    </Drawer.Navigator>
  );
};

export default MainComponent;
