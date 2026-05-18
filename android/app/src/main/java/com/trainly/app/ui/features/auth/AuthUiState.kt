package com.trainly.app.ui.features.auth

sealed interface AuthUiState {
    data object Idle : AuthUiState
    data class LoginForm(
        val email: String = "",
        val password: String = "",
        val showPassword: Boolean = false,
        val isLoading: Boolean = false,
        val error: String? = null
    ) : AuthUiState

    data class RegisterForm(
        val name: String = "",
        val email: String = "",
        val password: String = "",
        val showPassword: Boolean = false,
        val isLoading: Boolean = false,
        val error: String? = null
    ) : AuthUiState
}

sealed interface AuthFormEvent {
    data object LoginSuccess : AuthFormEvent
    data object RegisterSuccess : AuthFormEvent
    data class Error(val message: String) : AuthFormEvent
}
