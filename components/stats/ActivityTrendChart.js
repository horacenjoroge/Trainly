// components/stats/ActivityTrendChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * ActivityTrendChart component - Displays daily activity trends as a line chart.
 * 
 * @param {Object} props
 * @param {Array} props.trends - Array of trend data with _id (date) and count
 * @returns {JSX.Element|null} The rendered LineChart or null if no data
 */
const ActivityTrendChart = React.memo(({ trends }) => {
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
    if (!trends || trends.length === 0 || !trends.some(t => t.count > 0)) {
      return null;
    }

    const labels = trends.map(trend => {
      const date = new Date(trend._id);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    return {
      labels,
      datasets: [
        {
          data: trends.map(trend => trend.count),
          color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
          strokeWidth: 2,
        }
      ]
    };
  };

  const chartData = prepareData();

  if (!chartData) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Daily Activity (Last 7 Days)
      </Text>
      <LineChart
        data={chartData}
        width={width - 64}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
});

ActivityTrendChart.displayName = 'ActivityTrendChart';

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

export default ActivityTrendChart;

