import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TrainingCard = ({ title, duration, level, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.colors.surface }]} 
      onPress={onPress}
    >
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.cardMetaText, { color: theme.colors.textSecondary }]}>{duration}</Text>
          <Ionicons name="fitness-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.cardMetaText, { color: theme.colors.textSecondary }]}>{level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  
  const handleTrainingPress = () => {
    navigation.navigate('Training');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>Welcome back, Horace!</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Ready for today's training?</Text>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>5.2</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Hours</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>324</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Calories</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Workouts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TrainingCard
              title="Full Body Strength"
              duration="45 min"
              level="Intermediate"
              onPress={handleTrainingPress}
            />
            <TrainingCard
              title="HIIT Cardio"
              duration="30 min"
              level="Advanced"
              onPress={handleTrainingPress}
            />
          </ScrollView>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activities</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    width: 280,
    borderRadius: 15,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cardMetaText: {
    fontSize: 14,
    marginLeft: 4,
    marginRight: 12,
  },
});