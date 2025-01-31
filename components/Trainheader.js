// components/TrainingHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TrainingHeader({ activityType, timer, theme }) {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.header, { 
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.primary + '50'
    }]}>
      <Text style={[styles.activityType, { 
        color: theme.colors.primary,
        textShadowColor: theme.colors.primary + '50'
      }]}>{activityType}</Text>
      <Text style={[styles.timer, { 
        color: theme.colors.text,
        textShadowColor: theme.colors.primary + '30'
      }]}>{formatTime(timer)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  activityType: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timer: {
    fontSize: 32,
    fontWeight: '300',
    marginTop: 10,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});