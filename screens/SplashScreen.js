// SplashScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

const RunningManSVG = () => (
 <Svg width="150" height="150" viewBox="0 0 200 200">
   <Circle cx="100" cy="40" r="15" fill="orange"/>
   <Path d="M100 55 L100 95" stroke="orange" strokeWidth="5" fill="none"/>
   <Path d="M100 65 L130 85" stroke="orange" strokeWidth="5" fill="none"/>
   <Path d="M100 65 L80 50" stroke="orange" strokeWidth="5" fill="none"/>
   <Path d="M100 95 L120 140" stroke="orange" strokeWidth="5" fill="none"/>
   <Path d="M100 95 L80 135" stroke="orange" strokeWidth="5" fill="none"/>
   <Path d="M120 140 L135 135" stroke="orange" strokeWidth="5" fill="none"/>
   <Path d="M80 135 L65 140" stroke="orange" strokeWidth="5" fill="none"/>
 </Svg>
);

const SplashScreenComponent = ({ navigation }) => {
 const [animatedValue] = useState(new Animated.Value(0));

 useEffect(() => {
   const loadApp = async () => {
     try {
       await SplashScreen.preventAutoHideAsync();

       Animated.timing(animatedValue, {
         toValue: 1,
         duration: 1000,
         useNativeDriver: true,
       }).start();

       await new Promise(resolve => setTimeout(resolve, 3000));

       Animated.timing(animatedValue, {
         toValue: 0,
         duration: 1000,
         useNativeDriver: true,
       }).start(async () => {
         await SplashScreen.hideAsync();
         navigation.replace('MainApp');
       });

     } catch (e) {
       console.warn(e);
       navigation.replace('MainApp');
     }
   };

   loadApp();
 }, []);

 return (
   <View style={styles.container}>
     <StatusBar style="auto" />
     <Animated.View style={{ opacity: animatedValue }}>
       <RunningManSVG />
     </Animated.View>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#120B42',
   justifyContent: 'center',
   alignItems: 'center',
 },
});

export default SplashScreenComponent;