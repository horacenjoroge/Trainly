package com.trainly.app.data.local
import com.trainly.app.domain.models.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

data class AuthState(val isAuthenticated: Boolean = false, val user: User? = null, val isLoading: Boolean = true, val error: String? = null)

@Singleton
class SessionManager @Inject constructor(private val tm: TokenManager) {
    private val _as = MutableStateFlow(AuthState()); val authState: StateFlow<AuthState> = _as.asStateFlow()
    suspend fun checkAuth() { _as.value = AuthState(isAuthenticated = tm.hasValidToken(), isLoading = false) }
    suspend fun setAuthenticated(u: User) { _as.value = AuthState(isAuthenticated = true, user = u, isLoading = false) }
    suspend fun setLoading(l: Boolean) { _as.value = _as.value.copy(isLoading = l) }
    suspend fun setError(m: String) { _as.value = AuthState(error = m) }
    suspend fun clearSession() { tm.clearAll(); _as.value = AuthState() }
    suspend fun isAuthenticated(): Boolean = tm.hasValidToken()
}
