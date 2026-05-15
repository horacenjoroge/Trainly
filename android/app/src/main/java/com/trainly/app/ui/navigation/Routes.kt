package com.trainly.app.ui.navigation
sealed class Routes(val route: String) {
    data object Splash: Routes("splash"); data object Login: Routes("login"); data object Register: Routes("register")
    data object Home: Routes("home"); data object Stats: Routes("stats"); data object Profile: Routes("profile"); data object Settings: Routes("settings")
    data object TrainingSelection: Routes("training_selection"); data object Running: Routes("running"); data object Cycling: Routes("cycling")
    data object Swimming: Routes("swimming"); data object GymWorkout: Routes("gym_workout")
    data object WorkoutHistory: Routes("workout_history"); data object WorkoutDetail: Routes("workout_detail/{workoutId}") { fun createRoute(id:String)="workout_detail/$id" }
    data object CommunityFeed: Routes("community_feed"); data object CreatePost: Routes("create_post")
    data object Comments: Routes("comments/{postId}") { fun createRoute(id:String)="comments/$id" }
    data object Achievements: Routes("achievements"); data object Emergency: Routes("emergency"); data object EmergencyContacts: Routes("emergency_contacts")
    data object FindFriends: Routes("find_friends"); data object UserProfile: Routes("user_profile/{userId}") { fun createRoute(id:String)="user_profile/$id" }
    data object Followers: Routes("followers"); data object Following: Routes("following")
    data object PersonalInfo: Routes("personal_info"); data object EditStats: Routes("edit_stats")
}
