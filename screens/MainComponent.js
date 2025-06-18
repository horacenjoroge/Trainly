import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
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
import RunningScreen from '../screens/RunningScreen';
import SwimmingScreen from '../screens/SwimmingScreen';
import CyclingScreen from '../screens/CyclingScreen';
// NEW IMPORTS
import StatsScreen from '../screens/StatsScreen'; // Main stats dashboard
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen'; // Workout history
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen'; // Individual workout details
import { authService } from '../services/api';

const Tab = createBottomTabNavigator();
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
      
      {/* ADDED: Stats screen for quick access from HomeScreen progress card */}
      <Stack.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ title: 'Your Stats' }} 
      />
      
      {/* ADDED: Workout History accessible from Stats */}
      <Stack.Screen 
        name="WorkoutHistory" 
        component={WorkoutHistoryScreen} 
        options={{ title: 'Workout History' }} 
      />
      
      <Stack.Screen name="TrainingSelection" component={TrainingSelectionScreen} options={{ title: 'Select Training' }} />
      
      {/* Enhanced Training Screens */}
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
      <Stack.Screen 
        name="GymWorkout" 
        component={GymWorkoutScreen} 
        options={{ 
          title: 'Gym Workout', 
          headerShown: false 
        }} 
      />
      
      {/* Workout Detail - accessible from multiple places */}
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ 
          title: 'Workout Details',
          presentation: 'modal',
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
      {/* Main Training Selection */}
      <Stack.Screen 
        name="TrainingSelection" 
        component={TrainingSelectionScreen} 
        options={{ title: 'Select Training' }} 
      />
      
      {/* Enhanced Training Screens */}
      <Stack.Screen 
        name="RunningScreen" 
        component={RunningScreen}
        options={{ 
          title: 'Running',
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
      <Stack.Screen 
        name="CyclingScreen" 
        component={CyclingScreen}
        options={{ 
          title: 'Cycling',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="Training" 
        component={TrainingScreen} 
        options={{ 
          title: 'Training',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="GymWorkout" 
        component={GymWorkoutScreen} 
        options={{ 
          title: 'Gym Workout', 
          headerShown: false 
        }} 
      />
      
      {/* Workout Detail - accessible after training completion */}
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ 
          title: 'Workout Summary',
          presentation: 'modal',
        }} 
      />
    </Stack.Navigator>
  );
};

// Stats Stack with workout history
const StatsStack = () => {
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
      {/* Main Stats Dashboard */}
      <Stack.Screen 
        name="StatsMain" 
        component={StatsScreen} 
        options={{ title: 'Your Stats' }} 
      />
      
      {/* Workout History - accessible from stats */}
      <Stack.Screen 
        name="WorkoutHistory" 
        component={WorkoutHistoryScreen} 
        options={{ title: 'Workout History' }} 
      />
      
      {/* Individual Workout Detail */}
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ 
          title: 'Workout Details',
          presentation: 'modal',
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
      
      {/* Workout History - accessible from profile */}
      <Stack.Screen 
        name="WorkoutHistory" 
        component={WorkoutHistoryScreen} 
        options={{ title: 'My Workouts', headerShown: true }} 
      />
      
      {/* Workout Detail - accessible from profile workout history */}
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ 
          title: 'Workout Details',
          headerShown: true,
        }} 
      />
      
      {/* ADD EMERGENCY SERVICES TO PROFILE STACK */}
      <Stack.Screen 
        name="EmergencyServices" 
        component={EmergencyServicesScreen} 
        options={{ title: 'Emergency Services', headerShown: true }} 
      />
      <Stack.Screen
        name="EmergencyContacts"
        component={ContactsScreen}
        options={{
          title: 'Emergency Contacts',
          headerShown: true,
          headerRight: () => (
            <Ionicons name="person-add-outline" size={24} color={colors.text} style={{ marginRight: 16 }} />
          ),
        }}
      />
      
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

const MoreStack = () => {
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
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ title: 'Personal Information' }} />
      <Stack.Screen name="SecuritySettings" component={PersonalInfoScreen} options={{ title: 'Security Settings' }} />
      <Stack.Screen name="LanguageSettings" component={PersonalInfoScreen} options={{ title: 'Language Settings' }} />
      <Stack.Screen name="HeartRateZones" component={PersonalInfoScreen} options={{ title: 'Heart Rate Zones' }} />
      <Stack.Screen name="SocialSharing" component={PersonalInfoScreen} options={{ title: 'Social Sharing' }} />
      <Stack.Screen name="PrivacySettings" component={PersonalInfoScreen} options={{ title: 'Privacy Settings' }} />
      <Stack.Screen name="FindFriends" component={FindFriends} options={{ title: 'Find Friends' }} />
      
      {/* Emergency Services */}
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

const MainComponent = (props) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              if (props && props.onLogout) {
                props.onLogout();
              }
              console.log('Logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TrainingStack') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'StatsStack') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'MoreStack') {
            iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="TrainingStack"
        component={TrainingStack}
        options={{
          title: 'Training',
          tabBarLabel: 'Training',
        }}
      />
      <Tab.Screen
        name="StatsStack"
        component={StatsStack}
        options={{
          title: 'Stats',
          tabBarLabel: 'Stats',
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="MoreStack"
        component={MoreStack}
        options={{
          title: 'More',
          tabBarLabel: 'More',
        }}
        listeners={{
          tabPress: (e) => {
            // You can add more options here or handle logout differently
            // For now, we'll just navigate to More screen which includes settings
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainComponent;