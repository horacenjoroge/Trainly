// screens/AchievementsScreen.js - User achievements
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Share,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/api';
import { logError } from '../utils/logger';

const AchievementsScreen = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // State
  const [achievements, setAchievements] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('earned'); // 'earned', 'progress', 'leaderboard'
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const tabs = [
    { key: 'earned', label: 'Earned', icon: 'trophy' },
    { key: 'progress', label: 'Progress', icon: 'trending-up' },
    { key: 'leaderboard', label: 'Leaderboard', icon: 'podium' },
  ];

  // Load data based on selected tab
  useEffect(() => {
    loadTabData();
  }, [selectedTab]);

  const loadTabData = useCallback(async (page = 1, isRefresh = false) => {
    if (loading && !isRefresh) return;
    
    setLoading(true);
    
    try {
      if (selectedTab === 'earned') {
        await loadAchievements(page, isRefresh);
      } else if (selectedTab === 'progress') {
        await loadProgress();
      } else if (selectedTab === 'leaderboard') {
        await loadLeaderboard();
      }
    } catch (error) {
      logError('Error loading tab data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedTab, loading]);

  const loadAchievements = async (page = 1, isRefresh = false) => {
    try {
      const params = {
        page,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const response = await apiClient.get('/achievements', { params });
      
      if (response.data.status === 'success') {
        const newAchievements = response.data.data.achievements;
        
        if (page === 1 || isRefresh) {
          setAchievements(newAchievements);
        } else {
          setAchievements(prev => [...prev, ...newAchievements]);
        }
        
        setHasMoreData(response.data.data.pagination.hasNextPage);
        setCurrentPage(page);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      logError('Error loading achievements:', error);
      Alert.alert('Error', 'Failed to load achievements');
    }
  };

  const loadProgress = async () => {
    try {
      const response = await apiClient.get('/achievements/progress');
      
      if (response.data.status === 'success') {
        setProgress(response.data.data.progress);
      }
    } catch (error) {
      logError('Error loading progress:', error);
      Alert.alert('Error', 'Failed to load achievement progress');
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await apiClient.get('/achievements/leaderboard?limit=50');
      
      if (response.data.status === 'success') {
        setLeaderboard(response.data.data.leaderboard);
      }
    } catch (error) {
      logError('Error loading leaderboard:', error);
      Alert.alert('Error', 'Failed to load leaderboard');
    }
  };

  // Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    loadTabData(1, true);
  }, [loadTabData]);

  // Load more (for achievements tab)
  const loadMore = useCallback(() => {
    if (selectedTab === 'earned' && hasMoreData && !loading) {
      loadTabData(currentPage + 1);
    }
  }, [selectedTab, currentPage, hasMoreData, loading, loadTabData]);

  // Share achievement
  const shareAchievement = async (achievement) => {
    try {
      await apiClient.post(`/achievements/${achievement._id}/share`);
      
      const message = `🎉 Just earned the "${achievement.title}" achievement!\n\n` +
        `${achievement.description}\n` +
        `💪 +${achievement.points} points\n\n` +
        `Tracked with Fitness App`;

      await Share.share({
        message,
        title: `Achievement Unlocked: ${achievement.title}`
      });
    } catch (error) {
      logError('Error sharing achievement:', error);
      Alert.alert('Error', 'Failed to share achievement');
    }
  };

  // Get rarity color
  const getRarityColor = (rarity) => {
    const rarityColors = {
      common: '#A0A0A0',
      rare: '#4A90E2',
      epic: '#9B59B6',
      legendary: '#F39C12',
    };
    return rarityColors[rarity] || rarityColors.common;
  };

  // Render achievement item
  const renderAchievementItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.achievementItem, { backgroundColor: colors.surface }]}
      onPress={() => shareAchievement(item)}
    >
      <View style={styles.achievementContent}>
        <Text style={styles.achievementEmoji}>{item.emoji}</Text>
        <View style={styles.achievementInfo}>
          <View style={styles.achievementHeader}>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
              <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <View style={styles.achievementFooter}>
            <Text style={[styles.achievementDate, { color: colors.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <View style={[styles.pointsBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.pointsText, { color: colors.primary }]}>
                +{item.points} pts
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render progress item
  const renderProgressItem = ({ item }) => (
    <View style={[styles.progressItem, { backgroundColor: colors.surface }]}>
      <View style={styles.progressContent}>
        <Text style={styles.progressEmoji}>{item.emoji}</Text>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.progressDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${item.progress.percentage}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {item.progress.current}/{item.progress.target} ({item.progress.percentage}%)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render leaderboard item
  const renderLeaderboardItem = ({ item, index }) => (
    <View style={[styles.leaderboardItem, { backgroundColor: colors.surface }]}>
      <View style={styles.leaderboardRank}>
        {index < 3 ? (
          <Text style={styles.leaderboardMedal}>
            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
          </Text>
        ) : (
          <Text style={[styles.leaderboardRankText, { color: colors.textSecondary }]}>
            #{index + 1}
          </Text>
        )}
      </View>
      <View style={styles.leaderboardUserInfo}>
        <Text style={[styles.leaderboardName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.leaderboardStats, { color: colors.textSecondary }]}>
          {item.totalAchievements} achievements • {item.categoriesCount} categories
        </Text>
      </View>
      <View style={styles.leaderboardPoints}>
        <Text style={[styles.leaderboardPointsText, { color: colors.primary }]}>
          {item.totalPoints}
        </Text>
        <Text style={[styles.leaderboardPointsLabel, { color: colors.textSecondary }]}>
          points
        </Text>
      </View>
    </View>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'earned':
        return (
          <FlatList
            data={achievements}
            renderItem={renderAchievementItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="trophy-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No achievements yet
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Start working out to earn your first achievement!
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContainer}
          />
        );

      case 'progress':
        return (
          <FlatList
            data={progress}
            renderItem={renderProgressItem}
            keyExtractor={(item, index) => `progress-${index}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="trending-up-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No progress to show
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Complete more workouts to see your progress!
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContainer}
          />
        );

      case 'leaderboard':
        return (
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.userId}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="podium-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No leaderboard data
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContainer}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Achievements</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stats Summary (for earned tab) */}
      {selectedTab === 'earned' && stats && (
        <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalPoints}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Points
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.recentCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              This Week
            </Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              selectedTab === tab.key && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={selectedTab === tab.key ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { color: selectedTab === tab.key ? colors.primary : colors.textSecondary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  achievementItem: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  achievementContent: {
    flexDirection: 'row',
    padding: 16,
  },
  achievementEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  achievementDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 20,
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  pointsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressItem: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressContent: {
    flexDirection: 'row',
    padding: 16,
  },
  progressEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  leaderboardRank: {
    width: 50,
    alignItems: 'center',
  },
  leaderboardMedal: {
    fontSize: 24,
  },
  leaderboardRankText: {
    fontSize: 16,
    fontWeight: '700',
  },
  leaderboardUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  leaderboardStats: {
    fontSize: 12,
    fontWeight: '500',
  },
  leaderboardPoints: {
    alignItems: 'flex-end',
  },
  leaderboardPointsText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  leaderboardPointsLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default AchievementsScreen;