package com.trainly.app.ui.designsystem.theme

sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(
        val message: String,
        val cause: Throwable? = null
    ) : UiState<Nothing>
}

sealed interface UiEvent

sealed interface UiEffect
