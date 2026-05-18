package com.trainly.app.ui.navigation

import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.navigation.BottomNavItem
import com.trainly.app.ui.designsystem.navigation.TrainlyBottomNav
import com.trainly.app.ui.features.analytics.StatsScreen
import com.trainly.app.ui.features.home.HomeScreen
import com.trainly.app.ui.features.profile.ProfileScreen
import com.trainly.app.ui.features.social.CommunityFeedScreen

private val bottomNavItems = listOf(
    BottomNavItem("tab_home", "Home", { Text("\uD83C\uDFE0") }),
    BottomNavItem("tab_stats", "Stats", { Text("\uD83D\uDCCA") }),
    BottomNavItem("tab_community", "Community", { Text("\uD83D\uDC65") }),
    BottomNavItem("tab_profile", "Profile", { Text("\uD83D\uDC64") })
)

@Composable
fun MainScreen(rootNav: NavController) {
    val tabNav = rememberNavController()
    val navBackStackEntry by tabNav.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val snackbarHostState = remember { SnackbarHostState() }

    TrainlyScaffold(
        topBarStyle = TopBarStyle.NONE,
        bottomBar = {
            TrainlyBottomNav(
                items = bottomNavItems,
                currentRoute = currentRoute,
                onItemClick = { route ->
                    if (currentRoute != route) {
                        tabNav.navigate(route) {
                            popUpTo(tabNav.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                }
            )
        },
        snackbarHostState = snackbarHostState
    ) { padding ->
        NavHost(
            navController = tabNav,
            startDestination = "tab_home",
            modifier = Modifier.padding(padding)
        ) {
            composable("tab_home") {
                HomeScreen(
                    snackbarHostState = snackbarHostState,
                    onStats = { rootNav.navigate(Routes.Stats.route) },
                    onProfile = { rootNav.navigate(Routes.Profile.route) },
                    onTrain = { rootNav.navigate(Routes.TrainingSelection.route) },
                    onWorkoutHistory = { rootNav.navigate(Routes.WorkoutHistory.route) },
                    onCommunity = {
                        tabNav.navigate("tab_community") {
                            popUpTo(tabNav.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }

            composable("tab_stats") {
                StatsScreen(
                    snackbarHostState = snackbarHostState,
                    onBack = { rootNav.popBackStack() }
                )
            }

            composable("tab_community") {
                CommunityFeedScreen(
                    snackbarHostState = snackbarHostState,
                    onCreatePost = { rootNav.navigate(Routes.CreatePost.route) },
                    onComment = { postId ->
                        rootNav.navigate(Routes.Comments.createRoute(postId))
                    },
                    onUserClick = { userId ->
                        rootNav.navigate(Routes.UserProfile.createRoute(userId))
                    }
                )
            }

            composable("tab_profile") {
                ProfileScreen(
                    snackbarHostState = snackbarHostState,
                    onSettings = { rootNav.navigate(Routes.Settings.route) },
                    onWorkoutHistory = { rootNav.navigate(Routes.WorkoutHistory.route) },
                    onAchievements = { rootNav.navigate(Routes.Achievements.route) },
                    onStats = { rootNav.navigate(Routes.Stats.route) }
                )
            }
        }
    }
}
