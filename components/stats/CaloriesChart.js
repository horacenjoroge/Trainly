// components/stats/CaloriesChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * CaloriesChart component - Displays calories burned over time as a bar chart.
 * 
 * @param {Object} props
 * @param {Array} props.trends - Array of trend data with _id (date) and totalCalories
 * @returns {JSX.Element|null} The rendered BarChart or null if no data
 */
const CaloriesChart = React.memo(({ trends }) => {
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
    if (!trends || trends.length === 0 || !trends.some(t => t.totalCalories > 0)) {
      return null;
    }

    return {
      labels: trends.map(trend => {
        const date = new Date(trend._id);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{
        data: trends.map(trend => trend.totalCalories || 0),
      }]
    };
  };

  const chartData = prepareData();

  if (!chartData) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Calories Burned (Last 7 Days)
      </Text>
      <BarChart
        data={chartData}
        width={width - 64}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </View>
  );
});

CaloriesChart.displayName = 'CaloriesChart';

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
  chart: {
    borderRadius: 16,
  },
});

export default CaloriesChart;

