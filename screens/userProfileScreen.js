import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
 StyleSheet,
 View,
 Text,
 ScrollView,
 TouchableOpacity,
 Image,
 SafeAreaView,
 ActivityIndicator,
 Alert,
 FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { userService, postService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { log, logError } from '../utils/logger';
import { getSafeImageUri } from '../utils/imageUtils';

const USER_DATA_KEY = '@user_data';

export default function UserProfile({ route, onLogout }) {
 const { userId } = route?.params || {};
 const theme = useTheme();
 const navigation = useNavigation();
 const [loading, setLoading] = useState(true);
 const [userData, setUserData] = useState({
   name: '',
   bio: '',
   avatar: 'https://via.placeholder.com/150',
   stats: { workouts: 0, hours: 0, calories: 0 },
   followers: 0,
   following: 0,
 });
 const [userPosts, setUserPosts] = useState([]);
 const [isFollowing, setIsFollowing] = useState(false);
 const [currentUserId, setCurrentUserId] = useState(null);
 const [isCurrentUserLoaded, setIsCurrentUserLoaded] = useState(false);
 const [error, setError] = useState(null);

 // Load current user data from AsyncStorage
 const loadCurrentUser = useCallback(async () => {
   try {
     // Try userData first (new format)
     let data = await AsyncStorage.getItem('userData');
     if (!data) {
       // Fallback to USER_DATA_KEY (personal info format)
       data = await AsyncStorage.getItem(USER_DATA_KEY);
     }
     
     if (data) {
       const user = JSON.parse(data);
       const userId = user._id || user.id;
       if (userId) {
         setCurrentUserId(userId);
         log('✅ UserProfile: Loaded current user ID:', userId);
       } else {
         throw new Error('User data missing ID field');
       }
     } else {
       setError('User data not found. Please log in again.');
       if (onLogout) onLogout();
     }
   } catch (error) {
     logError('❌ UserProfile: Error loading current user:', error.message);
     setError('Failed to load user data');
     if (onLogout) onLogout();
   } finally {
     setIsCurrentUserLoaded(true);
   }
 }, [onLogout]);

 // Load user profile with dynamic bio support
 const loadUserProfile = useCallback(async () => {
   try {
     log('🔄 UserProfile: Loading profile for userId:', userId);
     
     // ALWAYS load from API first to get the user's actual data
     const profileData = await userService.getUserById(userId);
     profileData.stats = profileData.stats || { workouts: 0, hours: 0, calories: 0 };
     
     let finalUserData = {
       name: profileData.name || 'User',
       bio: profileData.bio || 'Fitness enthusiast',
       avatar: profileData.avatar || 'https://via.placeholder.com/150',
       stats: profileData.stats,
       followers: profileData.followers || 0,
       following: profileData.following || 0,
     };
     
     // If bio is empty or default, try to generate one from available data
     if (!finalUserData.bio || finalUserData.bio === 'Fitness enthusiast') {
       // For other users, we can only use API data to generate bio
       if (profileData.fitnessLevel || profileData.height || profileData.weight) {
         let bioParts = [];
         
         if (profileData.fitnessLevel) {
           bioParts.push(`${profileData.fitnessLevel} fitness enthusiast`);
         } else {
           bioParts.push('Fitness enthusiast');
         }
         
         if (profileData.height && profileData.weight) {
           const heightM = parseFloat(profileData.height) / 100;
           const bmi = (parseFloat(profileData.weight) / (heightM * heightM)).toFixed(1);
           bioParts.push(`BMI: ${bmi}`);
         }
         
         finalUserData.bio = bioParts.join(' • ');
       }
     }
     
     // ONLY if this is the current user, check for updated bio in AsyncStorage
     if (currentUserId === userId) {
       log('📱 UserProfile: This is current user, checking for updated bio in AsyncStorage');
       
       try {
         const localData = await AsyncStorage.getItem(USER_DATA_KEY);
         if (localData) {
           const parsedData = JSON.parse(localData);
           log('✅ UserProfile: Found local data for current user');
           
           // Only update specific fields, don't overwrite everything
           if (parsedData.bio) {
             finalUserData.bio = parsedData.bio;
             log('✅ UserProfile: Updated bio from local storage:', parsedData.bio);
           }
           
           if (parsedData.fullName) {
             finalUserData.name = parsedData.fullName;
             log('✅ UserProfile: Updated name from local storage:', parsedData.fullName);
           }
           
           // Keep API data for stats, followers, following
           // Don't overwrite these with local data
         }
       } catch (localError) {
         log('⚠️ UserProfile: No local data found, using API data only');
       }
     }
     
     log('🌐 UserProfile: Final user data:', finalUserData);
     setUserData(finalUserData);

     // Check follow status if different user
     if (currentUserId && currentUserId !== userId) {
       const followingData = await userService.getFollowing(currentUserId);
       setIsFollowing(Array.isArray(followingData) && followingData.some(user => user._id === userId || user.id === userId));
     }
   } catch (error) {
     logError('❌ UserProfile: Error loading user profile:', error.message);
     setError('Failed to load user profile');
   }
 }, [userId, currentUserId]);

 const fetchUserPosts = useCallback(async () => {
   try {
     log('📝 UserProfile: Fetching posts for userId:', userId);
     const allPosts = await postService.getPosts();
     if (allPosts && allPosts.length > 0) {
       const filteredPosts = allPosts.filter(post => {
         if (!post.user) return false;
         if (typeof post.user === 'string') return post.user === userId;
         if (post.user._id) return post.user._id === userId;
         if (post.user.id) return post.user.id === userId;
         return false;
       });
       setUserPosts(filteredPosts);
       log('✅ UserProfile: Found', filteredPosts.length, 'posts for user');
     } else {
       setUserPosts([]);
     }
   } catch (error) {
     logError('❌ UserProfile: Error fetching user posts:', error.message);
     setUserPosts([]);
   }
 }, [userId]);

 // Use useFocusEffect to reload data when screen comes into focus
 useFocusEffect(
   React.useCallback(() => {
     if (userId) {
       log('🎯 UserProfile: Screen focused, refreshing data for userId:', userId);
       const loadData = async () => {
         setLoading(true);
         try {
           await loadCurrentUser();
           await Promise.all([loadUserProfile(), fetchUserPosts()]);
         } catch (error) {
           logError('❌ UserProfile: Error loading data:', error.message);
           setError('Failed to load profile data');
           if (onLogout) onLogout();
         } finally {
           setLoading(false);
         }
       };
       loadData();
     } else {
       setLoading(false);
       setError('No user ID provided');
     }
   }, [userId, loadCurrentUser, loadUserProfile, fetchUserPosts, onLogout])
 );

 const handleFollowToggle = async () => {
   if (!currentUserId || !isCurrentUserLoaded || currentUserId === userId) {
     Alert.alert('Error', 'Cannot follow/unfollow this user.');
     return;
   }
 
   try {
     setLoading(true);
     if (isFollowing) {
       setIsFollowing(false);
       setUserData(prev => ({
         ...prev,
         followers: Math.max(0, (prev.followers || 0) - 1),
       }));
       await userService.unfollowUser(userId);
     } else {
       setIsFollowing(true);
       setUserData(prev => ({
         ...prev,
         followers: (prev.followers || 0) + 1,
       }));
       const response = await userService.followUser(userId);
       
       // Check if the response contains an error
       if (response && response.error) {
         throw new Error(response.error);
       }
     }
   } catch (error) {
     logError('❌ UserProfile: Error toggling follow:', error);
     // Revert UI changes
     setIsFollowing(!isFollowing);
     setUserData(prev => ({
       ...prev,
       followers: isFollowing ? (prev.followers || 0) + 1 : Math.max(0, (prev.followers || 0) - 1),
     }));
     
     // Show meaningful error
     const errorMessage = error.response?.data?.message || error.message || 'Could not perform this action. Please try again later.';
     Alert.alert('Follow Error', errorMessage);
   } finally {
     setLoading(false);
   }
 };

 const SkeletonLoader = () => (
   <View style={styles.skeletonContainer}>
     <View style={[styles.skeletonImage, { backgroundColor: theme.colors.border }]} />
     <View style={[styles.skeletonText, { backgroundColor: theme.colors.border, width: 150 }]} />
     <View style={[styles.skeletonText, { backgroundColor: theme.colors.border, width: 200 }]} />
     <View style={[styles.skeletonStatsRow, { backgroundColor: theme.colors.surface }]}>
       {[1, 2, 3, 4].map((_, index) => (
         <View key={index} style={styles.stat}>
           <View style={[styles.skeletonStatNumber, { backgroundColor: theme.colors.border }]} />
           <View style={[styles.skeletonStatLabel, { backgroundColor: theme.colors.border }]} />
         </View>
       ))}
     </View>
   </View>
 );

 const PostItem = ({ post }) => (
   <View style={[styles.activityItem, { borderColor: theme.colors.border }]}>
     {post.image && (
       <Image
         source={getSafeImageUri(post.image || 'https://via.placeholder.com/60')}
         style={styles.activityImage}
         resizeMode="cover"
       />
     )}
     <View style={styles.activityContent}>
       <Text style={[styles.activityText, { color: theme.colors.text }]} numberOfLines={2}>
         {post.content}
       </Text>
       <View style={styles.activityMeta}>
         <View style={styles.activityStats}>
           <Ionicons name="heart" size={16} color={theme.colors.primary} />
           <Text style={[styles.activityStatText, { color: theme.colors.textSecondary }]}>
             {post.likes || 0}
           </Text>
         </View>
         <View style={styles.activityStats}>
           <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
           <Text style={[styles.activityStatText, { color: theme.colors.textSecondary }]}>
             {post.comments || 0}
           </Text>
         </View>
       </View>
     </View>
   </View>
 );

 const memoizedPosts = useMemo(() => userPosts, [userPosts]);

 if (loading || !isCurrentUserLoaded) {
   return (
     <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
       <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
         </TouchableOpacity>
         <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
         <View style={{ width: 24 }} />
       </View>
       <SkeletonLoader />
     </SafeAreaView>
   );
 }

 if (error || !userId) {
   return (
     <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
       <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
         </TouchableOpacity>
         <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
         <View style={{ width: 24 }} />
       </View>
       <View style={styles.emptyContainer}>
         <Text style={[styles.emptyText, { color: theme.colors.text }]}>
           {error || 'User not found'}
         </Text>
       </View>
     </SafeAreaView>
   );
 }

 return (
   <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
     <View style={styles.header}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
         <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
       </TouchableOpacity>
       <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
         {currentUserId === userId ? 'My Profile' : 'Profile'}
       </Text>
       <View style={{ width: 24 }} />
     </View>

     <ScrollView>
       <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]}>
         <Image
           source={getSafeImageUri(userData.avatar || 'https://via.placeholder.com/150')}
           style={styles.profileImage}
           resizeMode="cover"
         />
         <Text style={[styles.name, { color: theme.colors.text }]}>{userData.name || 'User'}</Text>
         <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
           {userData.bio || 'Fitness enthusiast'}
         </Text>
         
         {/* Show edit button for current user, follow button for others */}
         {isCurrentUserLoaded && currentUserId === userId ? (
           <TouchableOpacity
             style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
             onPress={() => {
               // Navigate to PersonalInfo and specify return destination
               navigation.navigate('PersonalInfo', { 
                 returnTo: 'UserProfile',
                 userId: userId 
               });
             }}
           >
             <Text style={styles.editButtonText}>Edit Profile</Text>
           </TouchableOpacity>
         ) : currentUserId && currentUserId !== userId ? (
           <TouchableOpacity
             style={[
               styles.followButton,
               isFollowing
                 ? { borderColor: theme.colors.border, backgroundColor: 'transparent' }
                 : { backgroundColor: theme.colors.primary },
             ]}
             onPress={handleFollowToggle}
             disabled={loading}
           >
             <Text
               style={[
                 styles.followButtonText,
                 { color: isFollowing ? theme.colors.text : '#fff' },
               ]}
             >
               {isFollowing ? 'Following' : 'Follow'}
             </Text>
           </TouchableOpacity>
         ) : null}
       </View>

       <View style={[styles.statsRow, { backgroundColor: theme.colors.surface }]}>
         <View style={styles.stat}>
           <Text style={[styles.statNumber, { color: theme.colors.text }]}>
             {userData.stats?.workouts || 0}
           </Text>
           <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Workouts</Text>
         </View>
         <TouchableOpacity
           style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
           onPress={() => navigation.navigate('UserFollowers', { userId })}
           disabled={loading}
         >
           <Text style={[styles.statNumber, { color: theme.colors.text }]}>
             {userData.followers || 0}
           </Text>
           <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
         </TouchableOpacity>
         <TouchableOpacity
           style={[styles.stat, styles.statBorder, { borderColor: theme.colors.border }]}
           onPress={() => navigation.navigate('FollowingList', { userId })}
           disabled={loading}
         >
           <Text style={[styles.statNumber, { color: theme.colors.text }]}>
             {userData.following || 0}
           </Text>
           <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
         </TouchableOpacity>
         <View style={styles.stat}>
           <Text style={[styles.statNumber, { color: theme.colors.text }]}>
             {userData.stats?.calories || 0}
           </Text>
           <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Calories</Text>
         </View>
       </View>

       <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
         <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>
         {memoizedPosts.length > 0 ? (
           <FlatList
             data={memoizedPosts}
             renderItem={({ item }) => <PostItem post={item} />}
             keyExtractor={item => item.id || item._id || String(Math.random())}
             scrollEnabled={false}
             initialNumToRender={5}
           />
         ) : (
           <View style={styles.emptySection}>
             <Text style={{ color: theme.colors.textSecondary }}>
               {currentUserId === userId
                 ? "You haven't posted anything yet. Share your progress!"
                 : "This user hasn't posted anything yet."}
             </Text>
             {currentUserId === userId && (
               <TouchableOpacity
                 style={[styles.createPostButton, { backgroundColor: theme.colors.primary }]}
                 onPress={() => navigation.navigate('CreatePost')}
                 disabled={loading}
               >
                 <Text style={styles.createPostButtonText}>Create Post</Text>
               </TouchableOpacity>
             )}
           </View>
         )}
       </View>
     </ScrollView>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: { flex: 1 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   padding: 16,
   borderBottomWidth: 1,
   borderBottomColor: 'rgba(229, 124, 11, 0.2)',
 },
 headerTitle: { fontSize: 18, fontWeight: 'bold' },
 skeletonContainer: {
   alignItems: 'center',
   padding: 20,
   margin: 16,
 },
 skeletonImage: {
   width: 120,
   height: 120,
   borderRadius: 60,
   marginBottom: 16,
 },
 skeletonText: {
   height: 20,
   borderRadius: 4,
   marginBottom: 8,
 },
 skeletonStatsRow: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   paddingVertical: 20,
   margin: 16,
   borderRadius: 16,
   borderWidth: 1,
   borderColor: 'rgba(229, 124, 11, 0.2)',
 },
 skeletonStatNumber: {
   width: 40,
   height: 20,
   borderRadius: 4,
   marginBottom: 4,
 },
 skeletonStatLabel: {
   width: 60,
   height: 12,
   borderRadius: 4,
 },
 emptyContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 emptyText: { fontSize: 18, fontWeight: 'bold' },
 profileHeader: {
   alignItems: 'center',
   padding: 20,
   margin: 16,
   borderRadius: 16,
   borderWidth: 1,
   borderColor: 'rgba(229, 124, 11, 0.2)',
 },
 profileImage: {
   width: 120,
   height: 120,
   borderRadius: 60,
   borderWidth: 2,
   borderColor: '#E57C0B',
 },
 name: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
 bio: { 
   fontSize: 16, 
   marginTop: 8, 
   fontStyle: 'italic', 
   textAlign: 'center',
   paddingHorizontal: 20,
   lineHeight: 22,
 },
 editButton: {
   marginTop: 16,
   paddingVertical: 8,
   paddingHorizontal: 24,
   borderRadius: 20,
 },
 editButtonText: { 
   fontSize: 16, 
   fontWeight: '600', 
   color: '#fff' 
 },
 followButton: {
   marginTop: 16,
   paddingVertical: 8,
   paddingHorizontal: 32,
   borderRadius: 20,
   borderWidth: 1,
 },
 followButtonText: { fontSize: 16, fontWeight: '500' },
 statsRow: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   paddingVertical: 20,
   margin: 16,
   borderRadius: 16,
   borderWidth: 1,
   borderColor: 'rgba(229, 124, 11, 0.2)',
 },
 stat: { flex: 1, alignItems: 'center', paddingVertical: 10 },
 statBorder: { borderLeftWidth: 1, borderRightWidth: 1 },
 statNumber: { fontSize: 20, fontWeight: 'bold' },
 statLabel: { fontSize: 12, marginTop: 4, textTransform: 'uppercase' },
 section: {
   padding: 16,
   margin: 16,
   borderRadius: 16,
   borderWidth: 1,
   borderColor: 'rgba(229, 124, 11, 0.2)',
 },
 sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, letterSpacing: 0.5 },
 emptySection: { padding: 20, alignItems: 'center' },
 activityItem: {
   flexDirection: 'row',
   padding: 12,
   borderBottomWidth: 1,
   borderColor: 'rgba(229, 124, 11, 0.1)',
   marginBottom: 8,
 },
 activityImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
 activityContent: { flex: 1, justifyContent: 'space-between' },
 activityText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
 activityMeta: { flexDirection: 'row', justifyContent: 'flex-start' },
 activityStats: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
 activityStatText: { fontSize: 12, marginLeft: 4 },
 createPostButton: {
   marginTop: 16,
   paddingVertical: 8,
   paddingHorizontal: 16,
   borderRadius: 8,
 },
 createPostButtonText: { color: '#FFFFFF', fontWeight: '600' },
});