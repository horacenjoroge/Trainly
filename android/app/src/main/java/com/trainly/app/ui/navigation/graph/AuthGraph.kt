package com.trainly.app.ui.navigation.graph

import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.trainly.app.ui.features.auth.LoginScreen
import com.trainly.app.ui.features.auth.RegisterScreen
import com.trainly.app.ui.navigation.Routes

fun NavGraphBuilder.authGraph(nav: NavController) {
    composable(Routes.Splash.route) {
        com.trainly.app.ui.features.auth.SplashScreen(
            onNavigateToAuth = {
                nav.navigate(Routes.Login.route) {
                    popUpTo(Routes.Splash.route) { inclusive = true }
                }
            },
            onNavigateToMain = {
                nav.navigate(Routes.Main.route) {
                    popUpTo(0) { inclusive = true }
                }
            }
        )
    }

    composable(Routes.Login.route) {
        LoginScreen(
            onRegister = { nav.navigate(Routes.Register.route) },
            onSuccess = {
                nav.navigate(Routes.Main.route) {
                    popUpTo(0) { inclusive = true }
                }
            }
        )
    }

    composable(Routes.Register.route) {
        RegisterScreen(
            onLogin = { nav.popBackStack() },
            onSuccess = {
                nav.navigate(Routes.Main.route) {
                    popUpTo(0) { inclusive = true }
                }
            }
        )
    }
}
