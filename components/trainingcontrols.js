// components/TrainingControls.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrainingControls({ 
  isTracking, 
  isPaused, 
  onStartPause, 
  onFinish, 
  onShare, 
  theme 
}) {
  return (
    <View style={styles.controls}>
      <TouchableOpacity 
        style={[styles.controlButton, { 
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
        }]}
        onPress={onStartPause}
      >
        <Ionicons 
          name={isTracking ? (isPaused ? 'play' : 'pause') : 'play'} 
          size={32} 
          color={theme.colors.text} 
        />
      </TouchableOpacity>
      
      {isTracking && (
        <>
          <TouchableOpacity 
            style={[styles.controlButton, { 
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
            }]}
            onPress={onFinish}
          >
            <Ionicons name="stop" size={32} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, { 
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
            }]}
            onPress={onShare}
          >
            <Ionicons name="share-outline" size={32} color={theme.colors.text} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 15,
    paddingHorizontal: 10,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});