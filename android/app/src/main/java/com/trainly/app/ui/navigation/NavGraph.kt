package com.trainly.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import com.trainly.app.data.local.SessionManager
import com.trainly.app.ui.features.emergency.ContactScreen
import com.trainly.app.ui.features.emergency.EmergencyServicesScreen
import com.trainly.app.ui.features.onboarding.OnboardingScreen
import com.trainly.app.ui.features.profile.EditStatsScreen
import com.trainly.app.ui.features.profile.PersonalInfoScreen
import com.trainly.app.ui.features.profile.SettingsScreen
import com.trainly.app.ui.features.social.AchievementsScreen
import com.trainly.app.ui.navigation.graph.authGraph
import com.trainly.app.ui.navigation.graph.socialGraph
import com.trainly.app.ui.navigation.graph.workoutGraph

@Composable
fun NavGraph(sm: SessionManager) {
    val nav = rememberNavController()
    val authState by sm.authState.collectAsState()

    LaunchedEffect(Unit) {
        sm.checkAuth()
    }

    LaunchedEffect(authState.isLoading) {
        if (!authState.isLoading) {
            val onboardingDone = sm.isOnboardingComplete()
            val dest = when {
                !onboardingDone -> Routes.Onboarding.route
                authState.isAuthenticated -> Routes.Main.route
                else -> Routes.Login.route
            }
            nav.navigate(dest) {
                popUpTo(Routes.Splash.route) { inclusive = true }
            }
        }
    }

    val scope = rememberCoroutineScope()

    NavHost(
        navController = nav,
        startDestination = Routes.Splash.route
    ) {
        authGraph(nav)

        composable(Routes.Onboarding.route) {
            OnboardingScreen(
                onComplete = {
                    scope.launch {
                        sm.setOnboardingComplete()
                    }
                    val dest = if (authState.isAuthenticated) Routes.Main.route else Routes.Login.route
                    nav.navigate(dest) {
                        popUpTo(Routes.Onboarding.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.Main.route) {
            MainScreen(rootNav = nav)
        }

        composable(Routes.Settings.route) {
            SettingsScreen(
                onBack = { nav.popBackStack() },
                onLogout = {
                    nav.navigate(Routes.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onPersonalInfo = { nav.navigate(Routes.PersonalInfo.route) },
                onEditStats = { nav.navigate(Routes.EditStats.route) },
                onEmergencyContacts = { nav.navigate(Routes.EmergencyContacts.route) }
            )
        }

        composable(Routes.PersonalInfo.route) {
            PersonalInfoScreen(onBack = { nav.popBackStack() })
        }

        composable(Routes.EditStats.route) {
            EditStatsScreen(onBack = { nav.popBackStack() })
        }

        composable(Routes.Emergency.route) {
            EmergencyServicesScreen(
                onBack = { nav.popBackStack() },
                onContacts = { nav.navigate(Routes.EmergencyContacts.route) }
            )
        }

        composable(Routes.EmergencyContacts.route) {
            ContactScreen(onNavigateBack = { nav.popBackStack() })
        }

        composable(Routes.Achievements.route) {
            AchievementsScreen(onNavigateBack = { nav.popBackStack() })
        }

        workoutGraph(nav)
        socialGraph(nav)
    }
}
