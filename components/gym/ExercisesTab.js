// components/gym/ExercisesTab.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders'];

const ExercisesTab = ({
  exercises,
  categoryFilter,
  setCategoryFilter,
  addExercise,
  colors,
}) => {
  // Filter exercises by category
  const getFilteredExercises = () => {
    if (categoryFilter === 'All') return exercises;
    return exercises.filter(ex => ex.category === categoryFilter);
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                categoryFilter === category && [
                  styles.categoryButtonActive,
                  { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                ]
              ]}
              onPress={() => setCategoryFilter(category)}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  { color: categoryFilter === category ? colors.primary : colors.textSecondary }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={getFilteredExercises()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.exerciseItem, { backgroundColor: colors.surface }]}
            onPress={() => addExercise(item)}
          >
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.exerciseDetail, { color: colors.textSecondary }]}>
                {item.category} • {item.sets} sets × {item.reps} reps
              </Text>
            </View>
            <View style={styles.exerciseAddButton}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 16,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
  },
  exerciseAddButton: {
    padding: 4,
  },
});

export default ExercisesTab;