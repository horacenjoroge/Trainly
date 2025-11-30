// components/cycling/CyclingPerformanceStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * CyclingPerformanceStats component - Displays performance statistics.
 * 
 * @param {Object} props
 * @param {number} props.avgSpeed - Average speed in m/s
 * @param {number} props.maxSpeed - Maximum speed in m/s
 * @param {number} props.elevationGain - Elevation gain in meters
 * @param {number} props.totalTime - Total time in seconds
 * @param {Function} props.formatSpeed - Function to format speed
 * @param {Function} props.formatElevation - Function to format elevation
 * @returns {JSX.Element} The rendered CyclingPerformanceStats component
 */
const CyclingPerformanceStats = React.memo(({ 
  avgSpeed, 
  maxSpeed, 
  elevationGain, 
  totalTime, 
  formatSpeed, 
  formatElevation 
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>🚴‍♂️ Performance</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {formatSpeed(avgSpeed)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Speed</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {formatSpeed(maxSpeed)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Max Speed</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {formatElevation(elevationGain)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Elevation ↗</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {Math.round(totalTime / 60)}min
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Time</Text>
        </View>
      </View>
    </View>
  );
});

CyclingPerformanceStats.displayName = 'CyclingPerformanceStats';

const styles = StyleSheet.create({
  statsCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CyclingPerformanceStats;

