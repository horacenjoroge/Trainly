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

const ProfileOption = ({ icon, title, subtitle, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.option, { borderBottomColor: theme.colors.border }]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color={theme.colors.primary} />
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: theme.colors.text }]}>Horace</Text>
          <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
            Fitness enthusiast | Runner
          </Text>
        </View>

        <View style={[styles.statsRow, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>156</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Workouts</Text>
          </View>
          <View style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>32</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>48</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['🏃‍♂️', '🏋️‍♂️', '🎯', '🔥', '⚡️'].map((emoji, index) => (
              <View key={index} style={[styles.achievement, { backgroundColor: theme.colors.border }]}>
                <Text style={styles.achievementEmoji}>{emoji}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account Settings</Text>
          <ProfileOption
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your profile details"
          />
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your alerts"
          />
          <ProfileOption
            icon="lock-closed-outline"
            title="Privacy"
            subtitle="Control your privacy settings"
          />
          <ProfileOption
            icon="settings-outline"
            title="Preferences"
            subtitle="App settings and more"
          />
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
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    marginTop: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
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
  achievement: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 16,
  },
  optionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});