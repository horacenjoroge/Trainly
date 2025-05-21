// components/TrainingControls.js
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, Easing, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrainingControls({ 
  isTracking, 
  isPaused, 
  onStartPause, 
  onFinish, 
  onShare, 
  theme 
}) {
  // State for finish confirmation
  const [showingConfirmation, setShowingConfirmation] = useState(false);
  
  // Animation for pulsing effect on primary button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Start pulsing animation when tracking but paused
  useEffect(() => {
    if (isTracking && isPaused) {
      // Create pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      // Stop animation when not paused
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
    }
  }, [isTracking, isPaused]);
  
  // Handler for finish button
  const handleFinish = () => {
    // If very short workout (less than 10 seconds), no need for confirmation
    if (onFinish && showingConfirmation) {
      onFinish();
      setShowingConfirmation(false);
      return;
    }
    
    // Show confirmation dialog
    Alert.alert(
      'Finish Workout',
      'Do you want to save this workout?',
      [
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            // Navigate back without saving
            setShowingConfirmation(false);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setShowingConfirmation(false);
          }
        },
        {
          text: 'Save',
          style: 'default',
          onPress: () => {
            if (onFinish) {
              onFinish();
            }
            setShowingConfirmation(false);
          }
        },
      ],
      { cancelable: true }
    );
  };
  
  // Determine which buttons to show based on tracking state
  const buttonConfig = useMemo(() => {
    if (!isTracking) {
      // Not tracking: just show start button
      return [
        {
          icon: 'play',
          onPress: onStartPause,
          primary: true,
          label: 'Start'
        }
      ];
    } else if (isPaused) {
      // Paused: show resume, stop, and share buttons
      return [
        {
          icon: 'stop',
          onPress: handleFinish,
          color: theme.colors.error || '#ff3b30',
          label: 'Finish'
        },
        {
          icon: 'play',
          onPress: onStartPause,
          primary: true,
          label: 'Resume'
        },
        {
          icon: 'share-outline',
          onPress: onShare,
          color: theme.colors.primary,
          label: 'Share'
        }
      ];
    } else {
      // Tracking and active: show pause, stop, and share buttons
      return [
        {
          icon: 'stop',
          onPress: handleFinish,
          color: theme.colors.error || '#ff3b30',
          label: 'Finish'
        },
        {
          icon: 'pause',
          onPress: onStartPause,
          primary: true,
          label: 'Pause'
        },
        {
          icon: 'share-outline',
          onPress: onShare,
          color: theme.colors.primary,
          label: 'Share'
        }
      ];
    }
  }, [isTracking, isPaused, onStartPause, handleFinish, onShare, theme.colors, showingConfirmation]);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        {buttonConfig.map((button, index) => {
          const isPrimaryButton = button.primary;
          const buttonSize = isPrimaryButton ? { width: 80, height: 80 } : { width: 60, height: 60 };
          const iconSize = isPrimaryButton ? 40 : 28;
          
          // Apply animation to primary button when paused
          const animatedStyle = isPrimaryButton && isTracking && isPaused
            ? { transform: [{ scale: pulseAnim }] }
            : {};
          
          return (
            <View key={index} style={styles.buttonContainer}>
              <Animated.View style={animatedStyle}>
                <TouchableOpacity 
                  style={[
                    styles.controlButton, 
                    buttonSize,
                    { 
                      backgroundColor: button.color || (button.primary ? theme.colors.primary : theme.colors.surface),
                      borderColor: button.primary ? 'transparent' : theme.colors.border,
                      borderWidth: button.primary ? 0 : 1,
                      shadowColor: button.color || theme.colors.primary,
                    }
                  ]}
                  onPress={button.onPress}
                >
                  <Ionicons 
                    name={button.icon} 
                    size={iconSize} 
                    color={button.primary || button.color ? '#fff' : theme.colors.text} 
                  />
                </TouchableOpacity>
              </Animated.View>
              <Text style={[styles.buttonLabel, { color: theme.colors.textSecondary }]}>
                {button.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    gap: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    borderRadius: 40, // Half of the max width/height
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  }
});