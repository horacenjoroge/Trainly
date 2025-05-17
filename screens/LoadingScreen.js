// screens/LoadingScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Svg, { Circle, Path } from 'react-native-svg';

export default function LoadingScreen() {
  const theme = useTheme();
  const spinValue = new Animated.Value(0);

  // Set up rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Map 0-1 to 0-360
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Logo with animation
  const AnimatedLogo = () => (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width="120" height="120" viewBox="0 0 200 200">
        <Circle cx="100" cy="40" r="15" fill={theme.colors.primary}/>
        <Path d="M100 55 L100 95" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
        <Path d="M100 65 L130 85" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
        <Path d="M100 65 L80 50" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
        <Path d="M100 95 L120 140" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
        <Path d="M100 95 L80 135" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
        <Path d="M120 140 L135 135" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
        <Path d="M80 135 L65 140" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
      </Svg>
    </Animated.View>
  );

  // Pulsating dot animation
  const PulsatingDots = () => {
    const dot1Opacity = new Animated.Value(0.3);
    const dot2Opacity = new Animated.Value(0.3);
    const dot3Opacity = new Animated.Value(0.3);
    
    useEffect(() => {
      // Animate dot 1
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Animate dot 2 with delay
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot2Opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Opacity, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 200);
      
      // Animate dot 3 with delay
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot3Opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Opacity, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 400);
    }, []);
    
    return (
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { backgroundColor: theme.colors.primary, opacity: dot1Opacity }]} />
        <Animated.View style={[styles.dot, { backgroundColor: theme.colors.primary, opacity: dot2Opacity }]} />
        <Animated.View style={[styles.dot, { backgroundColor: theme.colors.primary, opacity: dot3Opacity }]} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedLogo />
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Fitness App
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Loading your fitness journey
      </Text>
      <PulsatingDots />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});