// components/stats/WorkoutTypeChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * WorkoutTypeChart component - Displays workout type distribution as a pie chart.
 * 
 * @param {Object} props
 * @param {Array} props.stats - Array of workout type stats with _id and count
 * @returns {JSX.Element|null} The rendered PieChart or null if no data
 */
const WorkoutTypeChart = React.memo(({ stats }) => {
  const theme = useTheme();
  const colors = theme.colors;

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.primary
    }
  };

  const prepareData = () => {
    if (!stats || stats.length === 0) {
      return null;
    }

    return stats.map(stat => ({
      name: stat._id || 'Unknown',
      population: stat.count || 0,
      color: `rgba(70, 183, 209, ${0.7 + (Math.random() * 0.3)})`,
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const chartData = prepareData();

  if (!chartData) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Workout Types
      </Text>
      <PieChart
        data={chartData}
        width={width - 64}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
});

WorkoutTypeChart.displayName = 'WorkoutTypeChart';

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default WorkoutTypeChart;

