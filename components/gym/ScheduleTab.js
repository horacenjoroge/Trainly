// components/gym/ScheduleTab.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const ScheduleTab = ({
  schedules,
  currentSchedule,
  toggleScheduleDay,
  selectSchedule,
  colors,
}) => {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Schedule</Text>
      
      <FlatList
        data={schedules}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.scheduleItem, { backgroundColor: colors.surface }]}>
            <View style={styles.scheduleHeader}>
              <Text style={[styles.scheduleName, { color: colors.text }]}>{item.name}</Text>
              <TouchableOpacity
                style={[
                  styles.scheduleSelectButton,
                  currentSchedule === item.id && { backgroundColor: colors.primary }
                ]}
                onPress={() => selectSchedule(item)}
              >
                <Text 
                  style={[
                    styles.scheduleSelectText,
                    { color: currentSchedule === item.id ? '#FFFFFF' : colors.primary }
                  ]}
                >
                  {currentSchedule === item.id ? 'Selected' : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.daysContainer}>
              {weekDays.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    item.days.includes(day) 
                      ? { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      : { borderColor: colors.border }
                  ]}
                  onPress={() => toggleScheduleDay(item.id, day)}
                >
                  <Text 
                    style={[
                      styles.dayText,
                      { 
                        color: item.days.includes(day) 
                          ? colors.primary 
                          : colors.textSecondary 
                      }
                    ]}
                  >
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
      
      <Text style={[styles.scheduleHint, { color: colors.textSecondary }]}>
        Tap on days to customize your workout schedule
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scheduleItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleSelectButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  scheduleSelectText: {
    fontSize: 12,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scheduleHint: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
});

export default ScheduleTab;