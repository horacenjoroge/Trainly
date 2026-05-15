package com.trainly.app.ui.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.trainly.app.ui.screens.home.HomeScreen
import com.trainly.app.ui.screens.profile.ProfileScreen
import com.trainly.app.ui.screens.social.CommunityFeedScreen
import com.trainly.app.ui.screens.stats.StatsScreen

data class Tab(val route: String, val label: String, val icon: String)

val tabs = listOf(
    Tab("tab_home", "Home", "\uD83C\uDFE0"),
    Tab("tab_stats", "Stats", "\uD83D\uDCCA"),
    Tab("tab_community", "Community", "\uD83D\uDC65"),
    Tab("tab_profile", "Profile", "\uD83D\uDC64"),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(rootNav: NavController) {
    val tabNav = rememberNavController()
    val navBackStackEntry by tabNav.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                tabs.forEach { tab ->
                    NavigationBarItem(
                        selected = currentRoute == tab.route,
                        onClick = {
                            if (currentRoute != tab.route) {
                                tabNav.navigate(tab.route) {
                                    popUpTo(tabNav.graph.startDestinationId) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        },
                        icon = { Text(tab.icon, style = MaterialTheme.typography.titleMedium) },
                        label = { Text(tab.label, fontWeight = if (currentRoute == tab.route) FontWeight.SemiBold else FontWeight.Normal) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.primary,
                            selectedTextColor = MaterialTheme.colorScheme.primary,
                            indicatorColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                        )
                    )
                }
            }
        }
    ) { padding ->
        NavHost(tabNav, startDestination = "tab_home", Modifier.padding(padding)) {
            composable("tab_home") {
                HomeScreen(
                    onStats = { rootNav.navigate(Routes.Stats.route) },
                    onProfile = { rootNav.navigate(Routes.Profile.route) },
                    onTrain = { rootNav.navigate(Routes.TrainingSelection.route) },
                    onWorkoutHistory = { rootNav.navigate(Routes.WorkoutHistory.route) },
                    onCommunity = { tabNav.navigate("tab_community") { popUpTo(tabNav.graph.startDestinationId) { saveState = true }; launchSingleTop = true; restoreState = true } },
                )
            }
            composable("tab_stats") { StatsScreen(onBack = {}) }
            composable("tab_community") {
                CommunityFeedScreen(
                    onNavigateBack = {},
                    onCreatePost = { rootNav.navigate(Routes.CreatePost.route) },
                    onComment = { rootNav.navigate(Routes.Comments.createRoute(it)) },
                    onUserClick = { rootNav.navigate(Routes.UserProfile.createRoute(it)) },
                )
            }
            composable("tab_profile") { ProfileScreen(onBack = {}, onSettings = { rootNav.navigate(Routes.Settings.route) }) }
        }
    }
}
