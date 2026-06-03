package com.trainly.app.ui.features.profile

import com.trainly.app.ui.designsystem.theme.UiState

data class ProfileData(
    val userName: String = "",
    val userBio: String = "",
    val followers: Int = 0,
    val following: Int = 0,
    val workouts: Int = 0,
    val calories: Int = 0,
    val hours: Int = 0,
    val bestRun: String = "",
    val memberSince: String = ""
)

typealias ProfileUiState = UiState<ProfileData>
