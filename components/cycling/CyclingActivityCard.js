// components/cycling/CyclingActivityCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * CyclingActivityCard component - Displays intervals and segments activity.
 * 
 * @param {Object} props
 * @param {Array} props.intervals - Array of intervals
 * @param {Array} props.segments - Array of segments
 * @param {Function} props.onStatsPress - Callback when stats icon is pressed
 * @returns {JSX.Element} The rendered CyclingActivityCard component
 */
const CyclingActivityCard = React.memo(({ intervals, segments, onStatsPress }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Don't render if no intervals or segments
  if (intervals.length === 0 && segments.length === 0) {
    return null;
  }

  return (
    <View style={[styles.segmentsCard, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📊 Activity</Text>
        <TouchableOpacity onPress={onStatsPress}>
          <Ionicons name="stats-chart-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.activityStats}>
        <View style={styles.activityItem}>
          <Text style={[styles.activityNumber, { color: colors.primary }]}>
            {segments.length}
          </Text>
          <Text style={[styles.activityLabel, { color: colors.textSecondary }]}>
            Segments
          </Text>
        </View>
        
        <View style={styles.activityItem}>
          <Text style={[styles.activityNumber, { color: colors.primary }]}>
            {intervals.length}
          </Text>
          <Text style={[styles.activityLabel, { color: colors.textSecondary }]}>
            Intervals
          </Text>
        </View>
      </View>
    </View>
  );
});

CyclingActivityCard.displayName = 'CyclingActivityCard';

const styles = StyleSheet.create({
  segmentsCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CyclingActivityCard;

