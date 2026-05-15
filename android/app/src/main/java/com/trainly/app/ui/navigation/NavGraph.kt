package com.trainly.app.ui.navigation
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.trainly.app.data.local.SessionManager
import com.trainly.app.ui.screens.auth.LoginScreen
import com.trainly.app.ui.screens.auth.RegisterScreen
import com.trainly.app.ui.screens.emergency.ContactScreen
import com.trainly.app.ui.screens.emergency.EmergencyServicesScreen
import com.trainly.app.ui.screens.profile.*
import com.trainly.app.ui.screens.social.*
import com.trainly.app.ui.screens.stats.StatsScreen
import com.trainly.app.ui.screens.training.*
import com.trainly.app.ui.screens.workout.*

@Composable fun NavGraph(sm: SessionManager) {
    val nav = rememberNavController()
    val as_ = sm.authState.collectAsState()
    NavHost(nav, when{as_.value.isLoading->Routes.Splash.route; as_.value.isAuthenticated->Routes.Main.route; else->Routes.Login.route}) {
        composable(Routes.Splash.route) {
            LaunchedEffect(Unit) { sm.checkAuth(); sm.authState.collect { if(!it.isLoading) nav.navigate(if(it.isAuthenticated) Routes.Main.route else Routes.Login.route) { popUpTo(Routes.Splash.route) { inclusive=true } } } }
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = MaterialTheme.colorScheme.primary, modifier = Modifier.size(48.dp)) }
        }
        composable(Routes.Login.route) { LoginScreen(onRegister={nav.navigate(Routes.Register.route)}, onSuccess={nav.navigate(Routes.Main.route){popUpTo(Routes.Login.route){inclusive=true}}}) }
        composable(Routes.Register.route) { RegisterScreen(onLogin={nav.popBackStack()}, onSuccess={nav.navigate(Routes.Main.route){popUpTo(Routes.Login.route){inclusive=true}}}) }
        composable(Routes.Main.route) { MainScreen(rootNav = nav) }
        composable(Routes.Stats.route) { StatsScreen(onBack={nav.popBackStack()}) }
        composable(Routes.Profile.route) { ProfileScreen(onBack={nav.popBackStack()}, onSettings={nav.navigate(Routes.Settings.route)}) }
        composable(Routes.Settings.route) { SettingsScreen(onBack={nav.popBackStack()}, onLogout={nav.navigate(Routes.Login.route){popUpTo(0){inclusive=true}}}) }
        composable(Routes.TrainingSelection.route) { TrainingSelectionScreen(onNavigateBack={nav.popBackStack()}, onSelectRunning={nav.navigate(Routes.Running.route)}, onSelectCycling={nav.navigate(Routes.Cycling.route)}, onSelectSwimming={nav.navigate(Routes.Swimming.route)}, onSelectGym={nav.navigate(Routes.GymWorkout.route)}) }
        composable(Routes.Running.route) { RunningScreen(onBack={nav.popBackStack()}) }
        composable(Routes.Cycling.route) { CyclingScreen(onBack={nav.popBackStack()}) }
        composable(Routes.Swimming.route) { SwimmingScreen(onBack={nav.popBackStack()}) }
        composable(Routes.GymWorkout.route) { GymWorkoutScreen(onBack={nav.popBackStack()}) }
        composable(Routes.WorkoutHistory.route) { WorkoutHistoryScreen(onNavigateBack={nav.popBackStack()}, onWorkoutClick={nav.navigate(Routes.WorkoutDetail.createRoute(it))}) }
        composable(Routes.WorkoutDetail.route, listOf(navArgument("workoutId"){type=NavType.StringType})) { WorkoutDetailScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.CommunityFeed.route) { CommunityFeedScreen(onNavigateBack={nav.popBackStack()}, onCreatePost={nav.navigate(Routes.CreatePost.route)}, onComment={nav.navigate(Routes.Comments.createRoute(it))}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.Achievements.route) { AchievementsScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.Emergency.route) { EmergencyServicesScreen(onBack={nav.popBackStack()}, onContacts={nav.navigate(Routes.EmergencyContacts.route)}) }
        composable(Routes.EmergencyContacts.route) { ContactScreen(onNavigateBack={nav.popBackStack()}) }
        composable(Routes.CreatePost.route) { CreatePostScreen(onBack={nav.popBackStack()}) }
        composable(Routes.Comments.route, listOf(navArgument("postId"){type=NavType.StringType})) { CommentScreen(postId=it.arguments?.getString("postId")?:return@composable, onNavigateBack={nav.popBackStack()}) }
        composable(Routes.UserProfile.route, listOf(navArgument("userId"){type=NavType.StringType})) { UserProfileScreen(userId=it.arguments?.getString("userId")?:return@composable, onNavigateBack={nav.popBackStack()}) }
        composable(Routes.FindFriends.route) { FindFriendsScreen(onNavigateBack={nav.popBackStack()}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.Followers.route) { FollowersListScreen(onNavigateBack={nav.popBackStack()}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.Following.route) { FollowingListScreen(onNavigateBack={nav.popBackStack()}, onUserClick={nav.navigate(Routes.UserProfile.createRoute(it))}) }
        composable(Routes.PersonalInfo.route) { PersonalInfoScreen(onBack={nav.popBackStack()}) }
        composable(Routes.EditStats.route) { EditStatsScreen(onBack={nav.popBackStack()}) }
    }
}
