package com.trainly.app.ui.features.home

import com.trainly.app.domain.models.Post
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.ui.designsystem.theme.UiState

data class HomeData(
    val progressStats: ProgressStats = ProgressStats(),
    val posts: List<Post> = emptyList(),
    val likedPostIds: Set<String> = emptySet()
)

typealias HomeUiState = UiState<HomeData>
