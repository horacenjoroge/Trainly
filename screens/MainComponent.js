import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrainingScreen from '../screens/TrainingScreen';
import TrainingSelectionScreen from './TrainingSelectionScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const colors = {
 background: '#120B42',
 primary: '#E57C0B',
 surface: '#1A144B',
 text: '#FFFFFF',
 textSecondary: '#A0A0A0'
};

const theme = {
 dark: true,
 colors: {
   primary: colors.primary,
   background: colors.background,
   surface: colors.surface,
   text: colors.text,
   textSecondary: colors.textSecondary,
   card: colors.surface,
   notification: colors.primary
 }
};

const HomeStack = () => {
 return (
   <Stack.Navigator
     screenOptions={{
       headerStyle: {
         backgroundColor: theme.colors.surface,
       },
       headerTintColor: theme.colors.text,
       cardStyle: { backgroundColor: theme.colors.background }
     }}
   >
     <Stack.Screen name="Home" component={HomeScreen} />
   </Stack.Navigator>
 );
};

const TrainingStack = () => {
 return (
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
};

const ProfileStack = () => {
 return (
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
};

const Main = () => {
 return (
   <NavigationContainer theme={theme}>
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
           title: 'Settings',
           drawerIcon: ({ color }) => (
             <Ionicons name="settings-outline" size={20} color={color} />
           ),
         }}
       />
     </Drawer.Navigator>
   </NavigationContainer>
 );
};

export default Main;