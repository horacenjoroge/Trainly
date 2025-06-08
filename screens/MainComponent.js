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
import EditStatsScreen from '../screens/EditStatsScreen';
import CommentScreen from '../screens/CommentScreen';
import FollowersList from '../screens/followersListScreen';
import FollowingList from '../screens/followingListScreen';
import UserProfile from '../screens/userProfileScreen';
import FindFriends from '../screens/FindFriendsScreen';
import GymWorkoutScreen from '../screens/GymWorkoutScreen';
import { useTheme } from '../context/ThemeContext';
import RunningScreen from '../screens/RunningScreen'; // Enhanced Running Screen
import SwimmingScreen from '../screens/SwimmingScreen'; // Enhanced Swimming Screen
import CyclingScreen from '../screens/CyclingScreen'; // Enhanced Cycling Screen
import { authService } from '../services/api';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
 const theme = useTheme();
 const colors = theme.colors;
 
 return (
   <Stack.Navigator
     screenOptions={{
       headerStyle: {
         backgroundColor: colors.surface,
         elevation: 2,
         shadowOpacity: 0.1,
       },
       headerTintColor: colors.text,
       cardStyle: { backgroundColor: colors.background },
     }}
   >
     <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
     <Stack.Screen name="TrainingSelection" component={TrainingSelectionScreen} options={{ title: 'Select Training' }} />
     
     {/* ADD ENHANCED SCREENS TO HOMESTACK - THIS FIXES THE NAVIGATION */}
     <Stack.Screen 
       name="RunningScreen" 
       component={RunningScreen}
       options={{ 
         title: 'Running',
         headerShown: false,
       }} 
     />
     <Stack.Screen 
       name="CyclingScreen" 
       component={CyclingScreen}
       options={{ 
         title: 'Cycling',
         headerShown: false,
       }} 
     />
     <Stack.Screen 
       name="SwimmingScreen" 
       component={SwimmingScreen}
       options={{ 
         title: 'Swimming',
         headerShown: false,
       }} 
     />
     
     <Stack.Screen name="CreatePost" component={CreateProgressPostScreen} options={{ title: 'Share Progress', presentation: 'modal' }} />
     <Stack.Screen name="EditStats" component={EditStatsScreen} options={{ title: 'Edit Progress', presentation: 'modal' }} />
     <Stack.Screen
       name="Comments"
       component={CommentScreen}
       options={{
         title: 'Comments',
         presentation: 'modal',
         cardStyle: { backgroundColor: 'transparent' },
         animationEnabled: true,
         headerShown: false,
       }}
     />
     <Stack.Screen
       name="UserProfile"
       component={UserProfile}
       options={({ route }) => ({
         title: 'User Profile',
         headerShown: false,
       })}
     />
     <Stack.Screen
       name="UserFollowers"
       component={FollowersList}
       options={({ route }) => ({
         title: 'Followers',
         headerShown: true,
       })}
     />
     <Stack.Screen
       name="FollowingList"
       component={FollowingList}
       options={({ route }) => ({
         title: 'Following',
         headerShown: true,
       })}
     />
   </Stack.Navigator>
 );
};

const TrainingStack = () => {
  const theme = useTheme();
  const colors = theme.colors;
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 2,
          shadowOpacity: 0.1,
        },
        headerTintColor: colors.text,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      {/* FIRST SCREEN: Your training selection - this should be the initial route */}
      <Stack.Screen 
        name="TrainingSelection" 
        component={TrainingSelectionScreen} 
        options={{ title: 'Select Training' }} 
      />
      
      {/* Enhanced Running Screen */}
      <Stack.Screen 
        name="RunningScreen" 
        component={RunningScreen}
        options={{ 
          title: 'Running',
          headerShown: false,
        }} 
      />
      
      {/* Enhanced Swimming Screen */}
      <Stack.Screen 
        name="SwimmingScreen" 
        component={SwimmingScreen}
        options={{ 
          title: 'Swimming',
          headerShown: false,
        }} 
      />
      
      {/* Enhanced Cycling Screen */}
      <Stack.Screen 
        name="CyclingScreen" 
        component={CyclingScreen}
        options={{ 
          title: 'Cycling',
          headerShown: false,
        }} 
      />
      
      {/* Your original training screen for other outdoor activities */}
      <Stack.Screen 
        name="Training" 
        component={TrainingScreen} 
        options={{ 
          title: 'Training',
          headerShown: false,
        }} 
      />
      
      {/* Your gym workout screen */}
      <Stack.Screen 
        name="GymWorkout" 
        component={GymWorkoutScreen} 
        options={{ 
          title: 'Gym Workout', 
          headerShown: false 
        }} 
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
 const theme = useTheme();
 const colors = theme.colors;
 
 return (
   <Stack.Navigator
     screenOptions={{
       headerStyle: {
         backgroundColor: colors.surface,
         elevation: 2,
         shadowOpacity: 0.1,
       },
       headerTintColor: colors.text,
       cardStyle: { backgroundColor: colors.background },
       headerShown: false,
     }}
   >
     <Stack.Screen name="ProfileMain" component={ProfileScreen} />
     <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ title: 'Personal Information', headerShown: true }} />
     <Stack.Screen name="FollowersList" component={FollowersList} />
     <Stack.Screen name="FollowingList" component={FollowingList} />
     <Stack.Screen
       name="UserProfile"
       component={UserProfile}
       options={({ route }) => ({
         title: 'User Profile',
       })}
     />
     <Stack.Screen name="FindFriends" component={FindFriends} options={{ title: 'Find Friends', headerShown: true }} />
     <Stack.Screen
       name="UserFollowers"
       component={FollowersList}
       options={({ route }) => ({
         title: 'Followers',
         headerShown: true,
       })}
     />
   </Stack.Navigator>
 );
};

const SettingsStack = () => {
 const theme = useTheme();
 const colors = theme.colors;
 
 return (
   <Stack.Navigator
     screenOptions={{
       headerStyle: {
         backgroundColor: colors.surface,
         elevation: 2,
         shadowOpacity: 0.1,
       },
       headerTintColor: colors.text,
       cardStyle: { backgroundColor: colors.background },
     }}
   >
     <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: 'Settings' }} />
     <Stack.Screen name="SecuritySettings" component={PersonalInfoScreen} options={{ title: 'Security Settings' }} />
     <Stack.Screen name="LanguageSettings" component={PersonalInfoScreen} options={{ title: 'Language Settings' }} />
     <Stack.Screen name="HeartRateZones" component={PersonalInfoScreen} options={{ title: 'Heart Rate Zones' }} />
     <Stack.Screen name="SocialSharing" component={PersonalInfoScreen} options={{ title: 'Social Sharing' }} />
     <Stack.Screen name="PrivacySettings" component={PersonalInfoScreen} options={{ title: 'Privacy Settings' }} />
     <Stack.Screen name="FindFriends" component={FindFriends} options={{ title: 'Find Friends' }} />
   </Stack.Navigator>
 );
};

const EmergencyStack = () => {
 const theme = useTheme();
 const colors = theme.colors;
 
 return (
   <Stack.Navigator
     screenOptions={{
       headerStyle: {
         backgroundColor: colors.surface,
         elevation: 2,
         shadowOpacity: 0.1,
       },
       headerTintColor: colors.text,
       cardStyle: { backgroundColor: colors.background },
     }}
   >
     <Stack.Screen name="EmergencyServices" component={EmergencyServicesScreen} options={{ title: 'Emergency Services' }} />
     <Stack.Screen
       name="EmergencyContacts"
       component={ContactsScreen}
       options={{
         title: 'Emergency Contacts',
         headerRight: () => (
           <Ionicons name="person-add-outline" size={24} color={colors.text} style={{ marginRight: 16 }} />
         ),
       }}
     />
   </Stack.Navigator>
 );
};

const EmptyComponent = () => null;

const MainComponent = (props) => {
 const theme = useTheme();
 const colors = theme.colors;
 
 const handleLogout = async () => {
   try {
     await authService.logout();
     if (props && props.onLogout) {
       props.onLogout();
     }
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
         backgroundColor: colors.surface,
         elevation: 2,
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 3,
         borderBottomWidth: 0,
       },
       headerTintColor: colors.text,
       drawerStyle: {
         backgroundColor: colors.surface,
         width: 260,
       },
       drawerActiveTintColor: colors.primary,
       drawerInactiveTintColor: colors.textSecondary,
       drawerActiveBackgroundColor: `${colors.primary}15`,
       drawerInactiveBackgroundColor: 'transparent',
       drawerLabelStyle: {
         marginLeft: -10,
         fontSize: 15,
         fontWeight: '500',
       },
       drawerItemStyle: {
         borderRadius: 8,
         marginHorizontal: 5,
         marginVertical: 2,
       },
       sceneContainerStyle: {
         backgroundColor: colors.background,
       },
     }}
   >
     <Drawer.Screen
       name="HomeStack"
       component={HomeStack}
       options={{
         headerTitle: 'Home',
         title: 'Home',
         drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
       }}
     />
     <Drawer.Screen
       name="ProfileStack"
       component={ProfileStack}
       options={{
         headerTitle: 'Profile',
         title: 'Profile',
         drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
       }}
     />
     <Drawer.Screen
       name="TrainingStack"
       component={TrainingStack}
       options={{
         headerTitle: 'Training',
         title: 'Training',
         drawerIcon: ({ color }) => <Ionicons name="fitness-outline" size={22} color={color} />,
       }}
     />
     <Drawer.Screen
       name="EmergencyStack"
       component={EmergencyStack}
       options={{
         headerTitle: 'Emergency Services',
         title: 'Emergency Services',
         drawerIcon: ({ color }) => <Ionicons name="alert-circle-outline" size={22} color={color} />,
       }}
     />
     <Drawer.Screen
       name="SettingsStack"
       component={SettingsStack}
       options={{
         headerTitle: 'Settings',
         title: 'Settings',
         drawerIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
       }}
     />
     <Drawer.Screen
       name="Logout"
       component={EmptyComponent}
       options={{
         title: 'Logout',
         drawerIcon: ({ color }) => <Ionicons name="log-out-outline" size={22} color={color} />,
       }}
       listeners={{
         drawerItemPress: () => {
           handleLogout();
           return false;
         },
       }}
     />
   </Drawer.Navigator>
 );
};

export default MainComponent;