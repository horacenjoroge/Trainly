package com.trainly.app.ui.navigation.graph

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavType
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.trainly.app.ui.navigation.Routes

fun NavGraphBuilder.socialGraph(nav: NavController) {
    composable(Routes.CreatePost.route) {
        com.trainly.app.ui.features.social.CreatePostScreen(
            onBack = { nav.popBackStack() }
        )
    }

    composable(
        route = Routes.Comments.route,
        arguments = listOf(
            navArgument("postId") { type = NavType.StringType }
        )
    ) { backStackEntry ->
        val postId = backStackEntry.arguments?.getString("postId") ?: return@composable
        com.trainly.app.ui.features.social.CommentScreen(
            postId = postId,
            onNavigateBack = { nav.popBackStack() }
        )
    }

    composable(
        route = Routes.UserProfile.route,
        arguments = listOf(
            navArgument("userId") { type = NavType.StringType }
        )
    ) { backStackEntry ->
        val userId = backStackEntry.arguments?.getString("userId") ?: return@composable
        com.trainly.app.ui.features.social.UserProfileScreen(
            userId = userId,
            onNavigateBack = { nav.popBackStack() }
        )
    }

    composable(Routes.FindFriends.route) {
        com.trainly.app.ui.features.social.FindFriendsScreen(
            onNavigateBack = { nav.popBackStack() },
            onUserClick = { userId ->
                nav.navigate(Routes.UserProfile.createRoute(userId))
            }
        )
    }

    composable(Routes.Followers.route) {
        com.trainly.app.ui.features.social.FollowersListScreen(
            onNavigateBack = { nav.popBackStack() },
            onUserClick = { userId ->
                nav.navigate(Routes.UserProfile.createRoute(userId))
            }
        )
    }

    composable(Routes.Following.route) {
        com.trainly.app.ui.features.social.FollowingListScreen(
            onNavigateBack = { nav.popBackStack() },
            onUserClick = { userId ->
                nav.navigate(Routes.UserProfile.createRoute(userId))
            }
        )
    }
}
