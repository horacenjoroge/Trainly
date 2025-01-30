// App.js
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreenComponent from './screens/SplashScreen';
import MainComponent from './screens/MainComponent';
import { theme } from './theme.js';

const RootStack = createStackNavigator();

export default function App() {
 return (
   <ThemeProvider>
     <StatusBar style="auto" />
     <NavigationContainer theme={theme}>
       <RootStack.Navigator screenOptions={{ headerShown: false }}>
         <RootStack.Screen name="Splash" component={SplashScreenComponent} />
         <RootStack.Screen name="MainApp" component={MainComponent} />
       </RootStack.Navigator>
     </NavigationContainer>
   </ThemeProvider>
 );
}