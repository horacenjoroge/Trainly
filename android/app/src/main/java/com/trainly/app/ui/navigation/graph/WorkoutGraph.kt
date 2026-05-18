package com.trainly.app.ui.navigation.graph

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavType
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.trainly.app.ui.navigation.Routes

fun NavGraphBuilder.workoutGraph(nav: NavController) {
    composable(Routes.TrainingSelection.route) {
        com.trainly.app.ui.features.workouts.TrainingSelectionScreen(
            onNavigateBack = { nav.popBackStack() },
            onSelectRunning = { nav.navigate(Routes.Running.route) },
            onSelectCycling = { nav.navigate(Routes.Cycling.route) },
            onSelectSwimming = { nav.navigate(Routes.Swimming.route) },
            onSelectGym = { nav.navigate(Routes.GymWorkout.route) }
        )
    }

    composable(Routes.Running.route) {
        com.trainly.app.ui.features.workouts.RunningScreen(
            onBack = {
                nav.popBackStack(Routes.Main.route, inclusive = false)
            }
        )
    }

    composable(Routes.Cycling.route) {
        com.trainly.app.ui.features.workouts.CyclingScreen(
            onBack = {
                nav.popBackStack(Routes.Main.route, inclusive = false)
            }
        )
    }

    composable(Routes.Swimming.route) {
        com.trainly.app.ui.features.workouts.SwimmingScreen(
            onBack = {
                nav.popBackStack(Routes.Main.route, inclusive = false)
            }
        )
    }

    composable(Routes.GymWorkout.route) {
        com.trainly.app.ui.features.workouts.GymWorkoutScreen(
            onBack = {
                nav.popBackStack(Routes.Main.route, inclusive = false)
            }
        )
    }

    composable(Routes.WorkoutHistory.route) {
        com.trainly.app.ui.features.workouts.WorkoutHistoryScreen(
            onNavigateBack = { nav.popBackStack() },
            onWorkoutClick = { id ->
                nav.navigate(Routes.WorkoutDetail.createRoute(id))
            }
        )
    }

    composable(
        route = Routes.WorkoutDetail.route,
        arguments = listOf(
            navArgument("workoutId") { type = NavType.StringType }
        )
    ) {
        com.trainly.app.ui.features.workouts.WorkoutDetailScreen(
            onNavigateBack = { nav.popBackStack() }
        )
    }
}
