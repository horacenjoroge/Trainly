// components/stats/StatCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * StatCard component for displaying workout statistics.
 * 
 * @param {Object} props
 * @param {string} props.icon - Ionicons icon name
 * @param {string|number} props.value - The stat value to display
 * @param {string} props.label - The label for the stat
 * @param {Function} [props.onPress] - Optional onPress handler (makes card pressable)
 * @returns {JSX.Element} The rendered StatCard component
 */
const StatCard = React.memo(({ icon, value, label, onPress }) => {
  const theme = useTheme();
  const colors = theme.colors;

  const cardContent = (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={[styles.value, { color: colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
});

StatCard.displayName = 'StatCard';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default StatCard;

