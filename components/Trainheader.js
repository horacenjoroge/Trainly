// components/TrainingHeader.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TrainingHeader({ activityType, timer, theme, isPaused }) {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseValue] = useState(new Animated.Value(1));
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Create pulsing animation for the timer when paused
  useEffect(() => {
    if (isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      // Stop animation when not paused
      pulseValue.setValue(1);
      Animated.timing(pulseValue).stop();
    }
  }, [isPaused, pulseValue]);
  
  // Format workout timer as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };
  
  // Format current time as HH:MM
  const formatCurrentTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get icon for activity type
  const getActivityIcon = () => {
    switch (activityType.toLowerCase()) {
      case 'run':
      case 'running':
        return 'walk';
      case 'cycle':
      case 'cycling':
      case 'bike':
        return 'bicycle';
      case 'swim':
      case 'swimming':
        return 'water';
      case 'gym':
      case 'workout':
        return 'barbell';
      case 'hike':
      case 'hiking':
        return 'trail-sign';
      default:
        return 'fitness';
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.colors.background }]}>
      {/* Status bar area */}
      <View style={[styles.statusBar, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
          {formatCurrentTime(currentTime)}
        </Text>
        <View style={styles.statusDot} />
        <Text style={[styles.statusText, { color: theme.colors.primary }]}>
          RECORDING
        </Text>
      </View>
      
      {/* Main header */}
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.primary + '50'
      }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              // Show confirmation if workout is in progress
              if (timer > 0) {
                navigation.navigate('Home');
              } else {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={styles.activityContainer}>
            <Ionicons
              name={getActivityIcon()}
              size={24}
              color={theme.colors.primary}
              style={styles.activityIcon}
            />
            <Text style={[styles.activityType, { 
              color: theme.colors.primary,
              textShadowColor: theme.colors.primary + '50'
            }]}>
              {activityType}
            </Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>
        
        <Animated.Text 
          style={[
            styles.timer, 
            { 
              color: theme.colors.text,
              textShadowColor: theme.colors.primary + '30',
              opacity: isPaused ? pulseValue : 1,
              transform: [{ scale: isPaused ? pulseValue : 1 }]
            }
          ]}
        >
          {formatTime(timer)}
        </Animated.Text>
        
        {isPaused && (
          <Text style={[styles.pausedText, { color: theme.colors.error || '#ff3b30' }]}>
            PAUSED
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff3b30',
    marginHorizontal: 6,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 28,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    marginRight: 8,
  },
  activityType: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timer: {
    fontSize: 42,
    fontWeight: '300',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: 6,
  },
  pausedText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 6,
  },
});