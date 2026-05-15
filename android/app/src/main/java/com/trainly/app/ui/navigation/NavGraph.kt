package com.trainly.app.ui.navigation
import androidx.compose.runtime.*
import androidx.navigation.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.trainly.app.data.local.SessionManager
import com.trainly.app.ui.screens.auth.LoginScreen
import com.trainly.app.ui.screens.auth.RegisterScreen
import com.trainly.app.ui.screens.emergency.ContactScreen
import com.trainly.app.ui.screens.emergency.EmergencyServicesScreen
import com.trainly.app.ui.screens.home.HomeScreen
import com.trainly.app.ui.screens.profile.*
import com.trainly.app.ui.screens.social.*
import com.trainly.app.ui.screens.stats.StatsScreen
import com.trainly.app.ui.screens.training.*
import com.trainly.app.ui.screens.workout.*

@Composable fun NavGraph(sm: SessionManager) {
    val nav = rememberNavController(); val as_ = sm.authState.collectAsState()
    NavHost(nav, when{as_.value.isLoading->Routes.Splash.route; as_.value.isAuthenticated->Routes.Home.route; else->Routes.Login.route}) {
        composable(Routes.Splash.route) { LaunchedEffect(Unit) { sm.authState.collect { if(!it.isLoading) nav.navigate(if(it.isAuthenticated) Routes.Home.route else Routes.Login.route) { popUpTo(Routes.Splash.route) { inclusive=true } } } } }
        composable(Routes.Login.route) { LoginScreen(onNavigateToRegister={nav.navigate(Routes.Register.route)}, onLoginSuccess={nav.navigate(Routes.Home.route){popUpTo(Routes.Login.route){inclusive=true}}}) }
        composable(Routes.Register.route) { RegisterScreen(onNavigateToLogin={nav.popBackStack()}, onRegisterSuccess={nav.navigate(Routes.Home.route){popUpTo(Routes.Login.route){inclusive=true}}}) }
        composable(Routes.Home.route) { HomeScreen(onNavigateToStats={nav.navigate(Routes.Stats.route)}, onNavigateToProfile={nav.navigate(Routes.Profile.route)}, onNavigateToTraining={nav.navigate(Routes.TrainingSelection.route)}) }
        composable(Routes.Stats.route) { StatsScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.Profile.route) { ProfileScreen(onNavigateBack={nav.popBackStack()}, onNavigateToSettings={nav.navigate(Routes.Settings.route)}) }
        composable(Routes.Settings.route) { SettingsScreen(onNavigateBack={nav.popBackStack()}, onLogout={nav.navigate(Routes.Login.route){popUpTo(0){inclusive=true}}}) }
        composable(Routes.TrainingSelection.route) { TrainingSelectionScreen(onNavigateBack={nav.popBackStack()}, onSelectRunning={nav.navigate(Routes.Running.route)}, onSelectCycling={nav.navigate(Routes.Cycling.route)}, onSelectSwimming={nav.navigate(Routes.Swimming.route)}, onSelectGym={nav.navigate(Routes.GymWorkout.route)}) }
        composable(Routes.Running.route) { RunningScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.Cycling.route) { CyclingScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.Swimming.route) { SwimmingScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.GymWorkout.route) { GymWorkoutScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.WorkoutHistory.route) { WorkoutHistoryScreen(onNavigateBack={nav.popBackStack()}, onWorkoutClick={nav.navigate(Routes.WorkoutDetail.createRoute(it))}) }
        composable(Routes.WorkoutDetail.route, listOf(navArgument("workoutId"){type=NavType.StringType})) { WorkoutDetailScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.CommunityFeed.route) { CommunityFeedScreen(onNavigateBack={nav.popBackStack()}, onCreatePost={nav.navigate(Routes.CreatePost.route)}, onComment={nav.navigate(Routes.Comments.createRoute(it))}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.Achievements.route) { AchievementsScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.Emergency.route) { EmergencyServicesScreen(onNavigateBack={nav.popBackStack()}, onManageContacts={nav.navigate(Routes.EmergencyContacts.route)}) }
        composable(Routes.EmergencyContacts.route) { ContactScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.CreatePost.route) { CreatePostScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.Comments.route, listOf(navArgument("postId"){type=NavType.StringType})) { CommentScreen(postId=it.arguments?.getString("postId")?:return@composable, onNavigateBack={nav.popBackStack()}) }
        composable(Routes.UserProfile.route, listOf(navArgument("userId"){type=NavType.StringType})) { UserProfileScreen(userId=it.arguments?.getString("userId")?:return@composable, onNavigateBack={nav.popBackStack()}) }
        composable(Routes.FindFriends.route) { FindFriendsScreen(onNavigateBack={nav.popBackStack()}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.Followers.route) { FollowersListScreen(onNavigateBack={nav.popBackStack()}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.Following.route) { FollowingListScreen(onNavigateBack={nav.popBackStack()}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.PersonalInfo.route) { PersonalInfoScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.EditStats.route) { EditStatsScreen(onNavigateBack={nav.popBackStack()}) }
    }
}
