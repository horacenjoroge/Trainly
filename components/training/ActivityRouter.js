// components/training/ActivityRouter.js
import React from 'react';
import GymWorkoutScreen from '../../screens/GymWorkoutScreen';
import RunningScreen from '../../screens/RunningScreen';
import CyclingScreen from '../../screens/CyclingScreen';
import SwimmingScreen from '../../screens/SwimmingScreen';

// Activity configuration with features and settings
export const ACTIVITY_CONFIG = {
  Gym: {
    id: 'gym',
    name: 'Gym Workout',
    icon: 'barbell',
    color: '#FF6B35',
    implemented: true,
    features: {
      exercises: true,
      sets: true,
      weights: true,
      restTimer: true,
      gps: false,
      heartRate: true,
    },
    defaultSettings: {
      restTime: 60, // seconds
      autoSave: true,
      vibration: true,
    },
    component: GymWorkoutScreen,
  },
  
  Running: {
    id: 'running',
    name: 'Running',
    icon: 'walk',
    color: '#4ECDC4',
    implemented: true, // Now implemented!
    features: {
      gps: true,
      pace: true,
      splits: true,
      elevation: true,
      autoLap: true,
      voiceCoaching: false, // Future
      heartRate: true,
    },
    defaultSettings: {
      gpsAccuracy: 10, // meters
      autoLapDistance: 1000, // meters (1km)
      units: 'metric', // metric/imperial
      voiceAnnouncements: true,
    },
    component: RunningScreen,
  },
  
  Cycling: {
    id: 'cycling',
    name: 'Cycling',
    icon: 'bicycle',
    color: '#45B7D1',
    implemented: false, // Week 4
    features: {
      gps: true,
      speed: true,
      cadence: true,
      power: false, // Future
      elevation: true,
      heartRate: true,
    },
    defaultSettings: {
      wheelSize: 700, // mm
      autoLapDistance: 5000, // 5km for cycling
      units: 'metric',
    },
    component: CyclingScreen,
  },
  
  Swimming: {
    id: 'swimming',
    name: 'Swimming',
    icon: 'water',
    color: '#96CEB4',
    implemented: true,
    features: {
      poolMode: true,
      openWater: false, // Future
      strokeAnalysis: true,
      intervals: true,
      heartRate: false, // Difficult underwater
    },
    defaultSettings: {
      poolLength: 25, // meters
      strokeType: 'freestyle',
      autoRest: true,
    },
    component: SwimmingScreen,
  },
};

// Activity selection logic
export class ActivityManager {
  static getAvailableActivities() {
    return Object.values(ACTIVITY_CONFIG).filter(activity => activity.implemented);
  }

  static getActivityConfig(activityType) {
    return ACTIVITY_CONFIG[activityType] || null;
  }

  static getActivityComponent(activityType) {
    const config = this.getActivityConfig(activityType);
    return config?.component || null;
  }

  static isActivityImplemented(activityType) {
    const config = this.getActivityConfig(activityType);
    return config?.implemented || false;
  }

  static getActivityFeatures(activityType) {
    const config = this.getActivityConfig(activityType);
    return config?.features || {};
  }

  static getDefaultSettings(activityType) {
    const config = this.getActivityConfig(activityType);
    return config?.defaultSettings || {};
  }

  // Create workout data structure based on activity type
  static createWorkoutTemplate(activityType, userId) {
    const baseTemplate = {
      id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: activityType,
      startTime: null,
      endTime: null,
      duration: 0,
      calories: 0,
      notes: '',
      synced: false,
      createdAt: new Date().toISOString(),
    };

    // Add activity-specific fields
    switch (activityType) {
      case 'Gym':
        return {
          ...baseTemplate,
          exercises: [],
          stats: {
            totalSets: 0,
            totalWeight: 0,
            exerciseCount: 0,
          },
        };

      case 'Running':
        return {
          ...baseTemplate,
          distance: 0,
          pace: {
            current: 0,
            average: 0,
          },
          speed: {
            current: 0,
            max: 0,
            average: 0,
          },
          elevation: {
            gain: 0,
            loss: 0,
            current: 0,
          },
          splits: [],
          route: {
            gpsPoints: [],
            compressed: [],
          },
        };

      case 'Cycling':
        return {
          ...baseTemplate,
          distance: 0,
          speed: {
            current: 0,
            max: 0,
            average: 0,
          },
          cadence: {
            current: 0,
            average: 0,
          },
          power: {
            current: 0,
            average: 0,
            max: 0,
          },
          elevation: {
            gain: 0,
            loss: 0,
            current: 0,
          },
          route: {
            gpsPoints: [],
            compressed: [],
          },
        };

      case 'Swimming':
        return {
          ...baseTemplate,
          poolLength: 25,
          distance: 0, // in meters
          strokeType: 'freestyle',
          laps: [],
          intervals: [],
          technique: {
            strokeRate: 0,
            strokeCount: 0,
            swolf: 0,
          },
        };

      default:
        return baseTemplate;
    }
  }

  // Validate workout data based on activity type
  static validateWorkoutData(workoutData) {
    const { type } = workoutData;
    const config = this.getActivityConfig(type);
    
    if (!config) {
      return { valid: false, errors: ['Unknown activity type'] };
    }

    const errors = [];

    // Basic validation
    if (!workoutData.duration || workoutData.duration < 30) {
      errors.push('Workout too short (minimum 30 seconds)');
    }

    // Activity-specific validation
    switch (type) {
      case 'Gym':
        if (!workoutData.exercises || workoutData.exercises.length === 0) {
          errors.push('No exercises recorded');
        }
        if (workoutData.stats?.totalSets === 0) {
          errors.push('No sets completed');
        }
        break;

      case 'Running':
        if (!workoutData.distance || workoutData.distance < 100) {
          errors.push('Distance too short (minimum 100m)');
        }
        if (!workoutData.route?.gpsPoints || workoutData.route.gpsPoints.length < 10) {
          errors.push('Insufficient GPS data');
        }
        break;

      case 'Cycling':
        if (!workoutData.distance || workoutData.distance < 500) {
          errors.push('Distance too short (minimum 500m)');
        }
        break;

      case 'Swimming':
        if (!workoutData.laps || workoutData.laps.length === 0) {
          errors.push('No laps recorded');
        }
        if (!workoutData.poolLength || workoutData.poolLength < 10) {
          errors.push('Invalid pool length');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Calculate activity-specific statistics
  static calculateStats(workoutData) {
    const { type } = workoutData;
    
    switch (type) {
      case 'Gym':
        return this.calculateGymStats(workoutData);
      case 'Running':
        return this.calculateRunningStats(workoutData);
      case 'Cycling':
        return this.calculateCyclingStats(workoutData);
      case 'Swimming':
        return this.calculateSwimmingStats(workoutData);
      default:
        return {};
    }
  }

  static calculateGymStats(workoutData) {
    const { exercises, duration } = workoutData;
    
    let totalWeight = 0;
    let totalSets = 0;
    let completedSets = 0;

    exercises.forEach(exercise => {
      if (exercise.sets) {
        exercise.sets.forEach(set => {
          totalSets++;
          if (set.completed) {
            completedSets++;
            totalWeight += (set.weight || 0) * (set.actualReps || 0);
          }
        });
      }
    });

    return {
      totalWeight,
      totalSets,
      completedSets,
      exerciseCount: exercises.length,
      completionRate: totalSets > 0 ? (completedSets / totalSets) * 100 : 0,
      averageRestTime: duration > 0 ? Math.round(duration / Math.max(completedSets, 1)) : 0,
    };
  }

  static calculateRunningStats(workoutData) {
    const { distance, duration, splits, elevation } = workoutData;
    
    const distanceKm = distance / 1000;
    const durationHours = duration / 3600;
    const averageSpeed = durationHours > 0 ? distanceKm / durationHours : 0;
    const averagePace = averageSpeed > 0 ? 60 / averageSpeed : 0;

    return {
      distanceKm,
      averageSpeed,
      averagePace,
      splitCount: splits?.length || 0,
      elevationGain: elevation?.gain || 0,
      elevationLoss: elevation?.loss || 0,
      caloriesPerKm: distanceKm > 0 ? (workoutData.calories || 0) / distanceKm : 0,
    };
  }

  static calculateCyclingStats(workoutData) {
    const { distance, duration, elevation } = workoutData;
    
    const distanceKm = distance / 1000;
    const durationHours = duration / 3600;
    const averageSpeed = durationHours > 0 ? distanceKm / durationHours : 0;

    return {
      distanceKm,
      averageSpeed,
      elevationGain: elevation?.gain || 0,
      elevationLoss: elevation?.loss || 0,
      averageCadence: workoutData.cadence?.average || 0,
      averagePower: workoutData.power?.average || 0,
    };
  }

  static calculateSwimmingStats(workoutData) {
    const { laps, distance, duration, poolLength } = workoutData;
    
    const totalLaps = laps?.length || 0;
    const averageLapTime = totalLaps > 0 ? duration / totalLaps : 0;
    const pace100m = averageLapTime > 0 ? (averageLapTime * 100) / poolLength : 0;

    // Calculate SWOLF (stroke count + time for one pool length)
    let averageSwolf = 0;
    if (laps && laps.length > 0) {
      const swolfScores = laps.map(lap => (lap.strokeCount || 0) + (lap.time || 0));
      averageSwolf = swolfScores.reduce((sum, score) => sum + score, 0) / swolfScores.length;
    }

    return {
      totalLaps,
      averageLapTime,
      pace100m,
      averageSwolf,
      distanceMeters: distance,
      strokeRate: workoutData.technique?.strokeRate || 0,
    };
  }

  // Format stats for display
  static formatStatsForDisplay(workoutData) {
    const stats = this.calculateStats(workoutData);
    const { type } = workoutData;

    switch (type) {
      case 'Gym':
        return {
          primary: `${stats.totalWeight}kg total weight`,
          secondary: `${stats.completedSets}/${stats.totalSets} sets • ${stats.exerciseCount} exercises`,
          details: [
            { label: 'Completion', value: `${Math.round(stats.completionRate)}%` },
            { label: 'Avg Rest', value: `${stats.averageRestTime}s` },
          ],
        };

      case 'Running':
        return {
          primary: `${stats.distanceKm.toFixed(2)} km`,
          secondary: `${this.formatPace(stats.averagePace)} pace • ${stats.splitCount} splits`,
          details: [
            { label: 'Speed', value: `${stats.averageSpeed.toFixed(1)} km/h` },
            { label: 'Elevation', value: `↑${Math.round(stats.elevationGain)}m` },
          ],
        };

      case 'Cycling':
        return {
          primary: `${stats.distanceKm.toFixed(2)} km`,
          secondary: `${stats.averageSpeed.toFixed(1)} km/h average`,
          details: [
            { label: 'Elevation', value: `↑${Math.round(stats.elevationGain)}m` },
            { label: 'Cadence', value: `${Math.round(stats.averageCadence)} rpm` },
          ],
        };

      case 'Swimming':
        return {
          primary: `${stats.totalLaps} laps`,
          secondary: `${Math.round(stats.distanceMeters)}m • ${this.formatTime(stats.pace100m)} /100m`,
          details: [
            { label: 'Avg Lap', value: this.formatTime(stats.averageLapTime) },
            { label: 'SWOLF', value: Math.round(stats.averageSwolf) },
          ],
        };

      default:
        return {
          primary: this.formatDuration(workoutData.duration),
          secondary: `${workoutData.calories || 0} calories`,
          details: [],
        };
    }
  }

  // Utility formatting methods
  static formatPace(paceMinPerKm) {
    if (!paceMinPerKm || paceMinPerKm === 0) return '0:00';
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  static formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// React component for routing to correct activity screen
export const ActivityRouter = ({ activityType, navigation, route }) => {
  const ActivityComponent = ActivityManager.getActivityComponent(activityType);
  
  if (!ActivityComponent) {
    return (
      <ComingSoonScreen 
        activityType={activityType}
        navigation={navigation}
        route={route}
      />
    );
  }

  return (
    <ActivityComponent
      navigation={navigation}
      route={route}
      activityConfig={ActivityManager.getActivityConfig(activityType)}
    />
  );
};

// Coming Soon placeholder screen
const ComingSoonScreen = ({ activityType, navigation }) => {
  const config = ActivityManager.getActivityConfig(activityType);
  
  return (
    <View style={styles.comingSoonContainer}>
      <View style={styles.comingSoonContent}>
        <Ionicons 
          name={config?.icon || 'fitness'} 
          size={64} 
          color={config?.color || '#666'} 
        />
        <Text style={styles.comingSoonTitle}>
          {config?.name || activityType} Coming Soon!
        </Text>
        <Text style={styles.comingSoonDescription}>
          We're working hard to bring you the best {activityType.toLowerCase()} tracking experience.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  comingSoonContent: {
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ActivityManager;