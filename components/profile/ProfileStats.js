// components/profile/ProfileStats.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * StatItem component - Displays a single stat with label and value.
 * 
 * @param {Object} props
 * @param {string} props.label - The stat label
 * @param {string|number} props.value - The stat value
 * @param {Function} [props.onPress] - Optional onPress handler
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} The rendered StatItem component
 */
const StatItem = React.memo(({ label, value, onPress, colors }) => (
  <TouchableOpacity 
    style={styles.statItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <Text style={[styles.statValue, { color: colors.text }]}>
      {value}
    </Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
      {label}
    </Text>
  </TouchableOpacity>
));

StatItem.displayName = 'StatItem';

/**
 * ProfileStats component - Displays user statistics in a horizontal row.
 * 
 * @param {Object} props
 * @param {Object} props.stats - Stats object with workouts, hours, calories
 * @param {number} props.followers - Number of followers
 * @param {number} props.following - Number of following
 * @param {Function} props.onWorkoutsPress - Callback when workouts stat is pressed
 * @param {Function} props.onFollowersPress - Callback when followers stat is pressed
 * @param {Function} props.onFollowingPress - Callback when following stat is pressed
 * @returns {JSX.Element} The rendered ProfileStats component
 */
const ProfileStats = React.memo(({ 
  stats, 
  followers, 
  following, 
  onWorkoutsPress, 
  onFollowersPress, 
  onFollowingPress 
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.statsContainer, { 
      backgroundColor: colors.surface,
      borderColor: colors.border
    }]}>
      <StatItem 
        label="Workouts" 
        value={stats?.workouts || 0} 
        onPress={onWorkoutsPress}
        colors={colors}
      />
      <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
      
      <StatItem 
        label="Followers" 
        value={followers || 0} 
        onPress={onFollowersPress}
        colors={colors}
      />
      <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
      
      <StatItem 
        label="Following" 
        value={following || 0} 
        onPress={onFollowingPress}
        colors={colors}
      />
      <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
      
      <StatItem 
        label="Calories" 
        value={stats?.calories || 0} 
        colors={colors}
      />
    </View>
  );
});

ProfileStats.displayName = 'ProfileStats';

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
});

export default ProfileStats;

