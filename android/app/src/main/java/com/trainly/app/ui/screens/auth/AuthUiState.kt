package com.trainly.app.ui.screens.auth
import com.trainly.app.domain.models.User
sealed class AuthUiState { data object Idle: AuthUiState()
    data class LoginForm(val email:String="", val password:String="", val showPassword:Boolean=false, val isLoading:Boolean=false, val error:String?=null): AuthUiState()
    data class RegisterForm(val name:String="", val email:String="", val password:String="", val showPassword:Boolean=false, val isLoading:Boolean=false, val error:String?=null): AuthUiState()
    data class Success(val user:User): AuthUiState(); data class Error(val message:String): AuthUiState(); data object Loading: AuthUiState()
}
sealed class AuthFormEvent { data object LoginSuccess: AuthFormEvent(); data object RegisterSuccess: AuthFormEvent(); data class Error(val message:String): AuthFormEvent() }
