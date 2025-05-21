// App.js
import './global.js';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplashScreenComponent from './screens/SplashScreen';
import MainComponent from './screens/MainComponent';
import AuthScreen from './screens/AuthScreen';
import { theme } from './theme.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.getSafeImageUri = (uri) => {
 if (uri === null || uri === undefined) return '';
 return String(uri);
};

global.onLogout = null;

const RootStack = createStackNavigator();

const MainComponentWrapper = ({ navigation }) => {
 const { logout, isAuthenticated } = useAuth();
 
 const handleLogout = async () => {
   try {
     await logout();
     console.log('Logout successful from MainComponentWrapper');
   } catch (error) {
     console.error('Logout failed:', error);
   }
 };

 return <MainComponent navigation={navigation} onLogout={handleLogout} />;
};

const AuthScreenWrapper = ({ navigation }) => {
 const { login, register, isAuthenticated } = useAuth();
 
 const enhancedLogin = async (credentials) => {
   console.log('Enhanced login handler called with:', credentials);
   
   if (!credentials || !credentials.email || !credentials.password) {
     console.error('Invalid credentials format:', credentials);
     return { success: false, message: 'Invalid email or password format' };
   }
   
   try {
     const result = await login(credentials);
     console.log('Login result:', result);
     
     if (result && result.success) {
       console.log('Login successful, navigation should handle screen change');
     }
     
     return result;
   } catch (error) {
     console.error('Login error in wrapper:', error);
     return { 
       success: false, 
       message: error.response?.data?.message || 'Login failed' 
     };
   }
 };
 
 const enhancedRegister = async (userData) => {
   console.log('Enhanced register handler called with:', userData);
   
   if (!userData || !userData.email || !userData.password || !userData.name) {
     console.error('Invalid registration data format:', userData);
     return { success: false, message: 'Please provide all required fields' };
   }
   
   try {
     const result = await register(userData);
     console.log('Registration result:', result);
     
     if (result && result.success) {
       console.log('Registration successful, navigation should handle screen change');
     }
     
     return result;
   } catch (error) {
     console.error('Registration error in wrapper:', error);
     return { 
       success: false, 
       message: error.response?.data?.message || 'Registration failed' 
     };
   }
 };
 
 const handleAuthSuccess = (userData) => {
   console.log('Authentication successful:', userData);
 };

 return (
   <AuthScreen 
     navigation={navigation} 
     onLogin={enhancedLogin} 
     onRegister={enhancedRegister}
     onAuthSuccess={handleAuthSuccess}
   />
 );
};

const AppContent = () => {
 const { isAuthenticated, isLoading, refreshAuth, authStateVersion } = useAuth();
 const [showSplash, setShowSplash] = useState(true);
 
 console.log('AppContent render - Auth state:', { isAuthenticated, isLoading, authStateVersion });

 useEffect(() => {
   const diagnoseAsyncStorage = async () => {
     try {
       // Get all keys
       const keys = await AsyncStorage.getAllKeys();
       console.log('All AsyncStorage keys:', keys);
       
       // Find numeric keys that indicate corruption
       const numericKeys = keys.filter(key => /^\d+$/.test(key));
       if (numericKeys.length > 0) {
         console.log(`Found ${numericKeys.length} numeric keys (corrupted data)`);
         
         // Remove all numeric keys
         for (const key of numericKeys) {
           await AsyncStorage.removeItem(key);
         }
         console.log('Removed all numeric keys');
         
         // Force a clean slate
         await AsyncStorage.removeItem('userData');
         await AsyncStorage.removeItem('token');
         await AsyncStorage.removeItem('refreshToken');
         
         // Force refresh auth state after cleanup
         console.log('Forcing app state refresh');
         setTimeout(() => refreshAuth(), 500);
       }
     } catch (error) {
       console.error('AsyncStorage diagnosis error:', error);
     }
   };
   
   diagnoseAsyncStorage();
 }, [refreshAuth]);

 useEffect(() => {
   const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000));
   minSplashTime.then(() => setShowSplash(false));
 }, []);

 useEffect(() => {
   global.onLogout = async () => {
     console.log('Global logout handler triggered');
     await refreshAuth();
   };
   
   return () => {
     global.onLogout = null;
   };
 }, [refreshAuth]);

 if (isLoading || showSplash) {
   return <SplashScreenComponent />;
 }

 console.log('Navigation state decision:', isAuthenticated ? 'MainApp' : 'Auth');

 return (
   <>
     <StatusBar style="auto" />
     <NavigationContainer theme={theme}>
       <RootStack.Navigator screenOptions={{ headerShown: false }}>
         {isAuthenticated ? (
           <RootStack.Screen 
             name="MainApp" 
             component={MainComponentWrapper}
             key={`main-${authStateVersion || 0}`}
           />
         ) : (
           <RootStack.Screen 
             name="Auth" 
             component={AuthScreenWrapper}
             key={`auth-${authStateVersion || 0}`}
           />
         )}
       </RootStack.Navigator>
     </NavigationContainer>
   </>
 );
};

export default function App() {
 return (
   <ThemeProvider>
     <AuthProvider>
       <AppContent />
     </AuthProvider>
   </ThemeProvider>
 );
}