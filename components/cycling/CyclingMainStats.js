// components/cycling/CyclingMainStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * CyclingMainStats component - Displays main cycling statistics (current speed and distance).
 * 
 * @param {Object} props
 * @param {number} props.currentSpeed - Current cycling speed in m/s
 * @param {number} props.distance - Total distance in meters
 * @param {Function} props.formatSpeed - Function to format speed
 * @param {Function} props.formatDistance - Function to format distance
 * @returns {JSX.Element} The rendered CyclingMainStats component
 */
const CyclingMainStats = React.memo(({ currentSpeed, distance, formatSpeed, formatDistance }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.mainStatsCard, { backgroundColor: colors.surface }]}>
      <View style={styles.mainStatsGrid}>
        <View style={styles.mainStatItem}>
          <Text style={[styles.mainStatNumber, { color: colors.primary }]}>
            {formatSpeed(currentSpeed)}
          </Text>
          <Text style={[styles.mainStatLabel, { color: colors.textSecondary }]}>
            Current Speed
          </Text>
        </View>
        
        <View style={styles.mainStatItem}>
          <Text style={[styles.mainStatNumber, { color: colors.primary }]}>
            {formatDistance(distance)}
          </Text>
          <Text style={[styles.mainStatLabel, { color: colors.textSecondary }]}>
            Distance
          </Text>
        </View>
      </View>
    </View>
  );
});

CyclingMainStats.displayName = 'CyclingMainStats';

const styles = StyleSheet.create({
  mainStatsCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  mainStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mainStatLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CyclingMainStats;

