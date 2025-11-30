// components/cycling/CyclingElevationCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * CyclingElevationCard component - Displays elevation statistics.
 * 
 * @param {Object} props
 * @param {Object} props.elevation - Elevation object with gain, loss, and current
 * @param {Function} props.formatElevation - Function to format elevation
 * @returns {JSX.Element} The rendered CyclingElevationCard component
 */
const CyclingElevationCard = React.memo(({ elevation, formatElevation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.elevationCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>📈 Elevation</Text>
      
      <View style={styles.elevationStats}>
        <View style={styles.elevationItem}>
          <Ionicons name="trending-up" size={20} color="#4CAF50" />
          <Text style={[styles.elevationValue, { color: colors.text }]}>
            {formatElevation(elevation.gain)}
          </Text>
          <Text style={[styles.elevationLabel, { color: colors.textSecondary }]}>
            Gain
          </Text>
        </View>
        
        <View style={styles.elevationItem}>
          <Ionicons name="trending-down" size={20} color="#FF5722" />
          <Text style={[styles.elevationValue, { color: colors.text }]}>
            {formatElevation(elevation.loss)}
          </Text>
          <Text style={[styles.elevationLabel, { color: colors.textSecondary }]}>
            Loss
          </Text>
        </View>
        
        <View style={styles.elevationItem}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={[styles.elevationValue, { color: colors.text }]}>
            {formatElevation(elevation.current)}
          </Text>
          <Text style={[styles.elevationLabel, { color: colors.textSecondary }]}>
            Current
          </Text>
        </View>
      </View>
    </View>
  );
});

CyclingElevationCard.displayName = 'CyclingElevationCard';

const styles = StyleSheet.create({
  elevationCard: {
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
  elevationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  elevationItem: {
    alignItems: 'center',
    flex: 1,
  },
  elevationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  elevationLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CyclingElevationCard;

