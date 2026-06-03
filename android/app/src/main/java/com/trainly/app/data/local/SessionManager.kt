package com.trainly.app.data.local
import com.google.gson.Gson
import com.trainly.app.data.remote.dto.UserDto
import com.trainly.app.domain.models.User
import com.trainly.app.domain.models.UserStats
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

data class AuthState(val isAuthenticated: Boolean = false, val user: User? = null, val isLoading: Boolean = true, val error: String? = null)

@Singleton
class SessionManager @Inject constructor(
    private val tm: TokenManager,
    private val gson: Gson
) {
    private val _as = MutableStateFlow(AuthState()); val authState: StateFlow<AuthState> = _as.asStateFlow()
    suspend fun checkAuth() {
        val isAuthenticated = tm.hasValidToken()
        val user = tm.getUserData()
            ?.takeIf { it.isNotBlank() }
            ?.let { runCatching { gson.fromJson(it, UserDto::class.java) }.getOrNull() }
            ?.toDomainUser()
        _as.value = AuthState(isAuthenticated = isAuthenticated, user = if (isAuthenticated) user else null, isLoading = false)
    }
    suspend fun setAuthenticated(u: User) { _as.value = AuthState(isAuthenticated = true, user = u, isLoading = false) }
    suspend fun setLoading(l: Boolean) { _as.value = _as.value.copy(isLoading = l) }
    suspend fun setError(m: String) { _as.value = AuthState(error = m) }
    suspend fun clearSession() { tm.clearAll(); _as.value = AuthState() }
    suspend fun isAuthenticated(): Boolean = tm.hasValidToken()
    suspend fun setOnboardingComplete() { tm.setOnboardingComplete() }
    suspend fun isOnboardingComplete(): Boolean = tm.isOnboardingComplete()

    private fun UserDto.toDomainUser(): User? {
        val userId = id ?: return null
        return User(
            id = userId,
            name = name.orEmpty(),
            email = email.orEmpty(),
            avatar = avatar,
            bio = bio,
            location = location,
            stats = stats?.let {
                UserStats(
                    totalWorkouts = it.totalWorkouts ?: 0,
                    totalDistance = it.totalDistance ?: 0.0,
                    totalDuration = it.totalDuration ?: 0,
                    totalCalories = it.totalCalories ?: 0
                )
            }
        )
    }
}
