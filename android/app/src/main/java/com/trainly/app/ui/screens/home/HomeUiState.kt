package com.trainly.app.ui.screens.home

import com.trainly.app.domain.models.Post
import com.trainly.app.domain.models.ProgressStats

sealed class HomeUiState {
    data object Loading : HomeUiState()
    data class Success(
        val posts: List<Post> = emptyList(),
        val progressStats: ProgressStats = ProgressStats(),
        val userName: String = "User",
        val isRefreshing: Boolean = false
    ) : HomeUiState()
    data class Error(
        val message: String,
        val posts: List<Post> = emptyList(),
        val progressStats: ProgressStats = ProgressStats(),
        val userName: String = "User"
    ) : HomeUiState()
}
