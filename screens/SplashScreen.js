// SplashScreen.js - Using PNG Image
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const RunningPersonImage = ({ scaleValue, fadeValue }) => (
  <Animated.View 
    style={{ 
      transform: [{ scale: scaleValue }],
      opacity: fadeValue
    }}
  >
    <Image
      source={require('../assets/images/running-person.png')} // Update this path to match your file location
      style={styles.runningPersonImage}
      resizeMode="contain"
    />
  </Animated.View>
);

const SplashScreenComponent = () => {
  const [fadeValue] = useState(new Animated.Value(0));
  const [textFadeValue] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));
  const [progressValue] = useState(new Animated.Value(0));
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    
    // Animation sequence
    const animationSequence = Animated.sequence([
      // Scale in the logo
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Fade in text
      Animated.timing(textFadeValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Animate progress bar
      Animated.timing(progressValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false, // Can't use native driver for width changes
      }),
    ]);

    // Breathing animation for the logo
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Start the animations
    animationSequence.start(() => {
      if (mounted) {
        breathingAnimation.start();
      }
    });

    // Cleanup function
    return () => {
      setMounted(false);
      animationSequence.stop();
      breathingAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* DEBUG OVERLAY - Remove this in production */}
     
      
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Main Content Container */}
      <View style={styles.contentContainer}>
        {/* Animated Logo */}
        <Animated.View style={styles.logoContainer}>
          <RunningPersonImage scaleValue={scaleValue} fadeValue={fadeValue} />
        </Animated.View>

        {/* Animated App Name */}
        <Animated.View 
          style={[
            styles.textContainer,
            { opacity: textFadeValue }
          ]}
        >
          <Text style={styles.appName}>Trainly</Text>
          <Text style={styles.tagline}>Your Fitness Journey Starts Here</Text>
        </Animated.View>
      </View>

      {/* Loading indicator */}
      <Animated.View 
        style={[
          styles.loadingContainer,
          { opacity: textFadeValue }
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View 
            style={[
              styles.loadingFill,
              { 
                width: progressValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]}
          />
        </View>
        <Text style={styles.loadingText}>Loading your fitness app...</Text>
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#120B42',
    opacity: 0.95,
  },
  debugOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    zIndex: 9999,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'red',
  },
  debugText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugSubText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // Add a subtle shadow/glow effect
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  runningPersonImage: {
    width: 180,
    height: 180,
    // Add a subtle filter effect if needed
    tintColor: undefined, // Remove this line if you want original colors
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 30,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#E91E63', // Match the pink color from your image
    marginBottom: 12,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(233, 30, 99, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 120,
    width: '70%',
    alignItems: 'center',
  },
  loadingBar: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#E91E63', // Match the pink theme
    borderRadius: 3,
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '300',
  },
});

export default SplashScreenComponent;