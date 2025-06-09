// SplashScreen.js - Complete with Visual Test
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

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

const SplashScreenComponent = () => {
  console.log('🎨 SplashScreenComponent rendered at:', new Date().toISOString());
  
  const [animatedValue] = useState(new Animated.Value(0));
  const [textAnimated] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log('🎬 SplashScreen useEffect started - starting animations');
    
    // Start the animation sequence
    Animated.sequence([
      // Fade in the logo
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Fade in the text after a slight delay
      Animated.timing(textAnimated, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('✨ Splash screen animations completed');
    });

    // Optional: Add a subtle scale animation to the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    console.log('🔄 Looping scale animation started');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* VISUAL TEST - Red box to confirm splash is showing */}
      <View style={styles.testBox}>
        <Text style={styles.testText}>SPLASH SCREEN VISIBLE</Text>
        <Text style={styles.testSubText}>If you see this, splash is working!</Text>
      </View>
      
      {/* Animated Logo */}
      <Animated.View 
        style={[
          styles.logoContainer,
          { 
            opacity: animatedValue,
            transform: [{ scale: animatedValue }]
          }
        ]}
      >
        <RunningManSVG />
      </Animated.View>

      {/* Animated App Name */}
      <Animated.View 
        style={[
          styles.textContainer,
          { opacity: textAnimated }
        ]}
      >
        <Text style={styles.appName}>Trainly</Text>
        <Text style={styles.tagline}>Your Fitness Journey Starts Here</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View 
        style={[
          styles.loadingContainer,
          { opacity: textAnimated }
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View 
            style={[
              styles.loadingFill,
              { 
                transform: [{ 
                  scaleX: animatedValue 
                }] 
              }
            ]}
          />
        </View>
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
  testBox: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    zIndex: 9999,
    alignItems: 'center',
  },
  testText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testSubText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  logoContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    width: '60%',
  },
  loadingBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: 'orange',
    borderRadius: 2,
  },
});

export default SplashScreenComponent;