package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.repository.AuthRepository
import com.trainly.app.ui.screens.auth.AuthFormEvent
import com.trainly.app.ui.screens.auth.AuthUiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val repo: AuthRepository, private val sm: SessionManager
) : ViewModel() {
    private val _s = MutableStateFlow<AuthUiState>(AuthUiState.LoginForm()); val uiState: StateFlow<AuthUiState> = _s.asStateFlow()
    private val _e = Channel<AuthFormEvent>(Channel.BUFFERED); val events = _e.receiveAsFlow()
    init { viewModelScope.launch { if (sm.isAuthenticated()) _e.send(AuthFormEvent.LoginSuccess) } }
    fun setLoginForm() { _s.value = AuthUiState.LoginForm() }
    fun setRegisterForm() { _s.value = AuthUiState.RegisterForm() }
    fun updateLoginEmail(v: String) { (_s.value as? AuthUiState.LoginForm)?.let { _s.value = it.copy(email = v, error = null) } }
    fun updateLoginPassword(v: String) { (_s.value as? AuthUiState.LoginForm)?.let { _s.value = it.copy(password = v, error = null) } }
    fun toggleLoginPasswordVisibility() { (_s.value as? AuthUiState.LoginForm)?.let { _s.value = it.copy(showPassword = !it.showPassword) } }
    fun updateRegisterName(v: String) { (_s.value as? AuthUiState.RegisterForm)?.let { _s.value = it.copy(name = v, error = null) } }
    fun updateRegisterEmail(v: String) { (_s.value as? AuthUiState.RegisterForm)?.let { _s.value = it.copy(email = v, error = null) } }
    fun updateRegisterPassword(v: String) { (_s.value as? AuthUiState.RegisterForm)?.let { _s.value = it.copy(password = v, error = null) } }
    fun toggleRegisterPasswordVisibility() { (_s.value as? AuthUiState.RegisterForm)?.let { _s.value = it.copy(showPassword = !it.showPassword) } }
    fun login() { val f=_s.value as? AuthUiState.LoginForm?:return; val err=validateLogin(f); if(err!=null){_s.value=f.copy(error=err);return}; _s.value=f.copy(isLoading=true); viewModelScope.launch { when(val r=repo.login(f.email,f.password)){ is NetworkResult.Success -> _e.send(AuthFormEvent.LoginSuccess); is NetworkResult.Error -> _s.value=(_s.value as AuthUiState.LoginForm).copy(isLoading=false, error=r.error.message ?: "Login failed"); else -> {} } } }
    fun register() { val f=_s.value as? AuthUiState.RegisterForm?:return; val err=validateRegister(f); if(err!=null){_s.value=f.copy(error=err);return}; _s.value=f.copy(isLoading=true); viewModelScope.launch { when(val r=repo.register(f.name,f.email,f.password)){ is NetworkResult.Success -> _e.send(AuthFormEvent.RegisterSuccess); is NetworkResult.Error -> _s.value=(_s.value as AuthUiState.RegisterForm).copy(isLoading=false, error=r.error.message ?: "Registration failed"); else -> {} } } }
    private fun validateLogin(f: AuthUiState.LoginForm): String? = when { f.email.isBlank() -> "Email is required"; f.password.isBlank() -> "Password is required"; !android.util.Patterns.EMAIL_ADDRESS.matcher(f.email).matches() -> "Invalid email"; f.password.length<8 -> "Min 8 characters"; else -> null }
    private fun validateRegister(f: AuthUiState.RegisterForm): String? = when { f.name.isBlank() -> "Name is required"; f.email.isBlank() -> "Email is required"; f.password.isBlank() -> "Password is required"; !android.util.Patterns.EMAIL_ADDRESS.matcher(f.email).matches() -> "Invalid email"; f.password.length<8 -> "Min 8 characters"; !f.password.any{it.isLetter()} -> "Need a letter"; !f.password.any{it.isDigit()} -> "Need a number"; else -> null }
}
