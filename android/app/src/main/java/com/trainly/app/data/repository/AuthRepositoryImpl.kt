package com.trainly.app.data.repository
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.local.TokenManager
import com.trainly.app.data.remote.*
import com.trainly.app.data.remote.dto.LoginRequest
import com.trainly.app.data.remote.dto.RegisterRequest
import com.trainly.app.data.remote.dto.RefreshTokenRequest
import com.trainly.app.domain.models.User
import com.trainly.app.domain.models.UserStats
import com.trainly.app.domain.repository.AuthRepository
import com.google.gson.Gson
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val api: ApiService, private val tm: TokenManager, private val sm: SessionManager, private val gson: Gson
) : AuthRepository {
    override suspend fun login(e: String, p: String): NetworkResult<User> = mapResult(api.login(LoginRequest(e, p)))
    override suspend fun register(n: String, e: String, p: String): NetworkResult<User> = mapResult(api.register(RegisterRequest(n, e, p)))
    override suspend fun logout() { sm.clearSession() }
    override suspend fun getCurrentUser(): NetworkResult<User> = when (val r = api.getCurrentUser()) {
        is NetworkResult.Success -> { val u = r.data.let { User(it.id?:return NetworkResult.Error(ApiError("Missing id")), it.name?:"", it.email?:"", it.avatar, it.bio, it.location) }; tm.saveUserData(gson.toJson(r.data)); sm.setAuthenticated(u); NetworkResult.Success(u) }
        is NetworkResult.Error -> NetworkResult.Error(r.error); is NetworkResult.Loading -> NetworkResult.Loading
    }
    override suspend fun isAuthenticated(): Boolean = sm.isAuthenticated()
    override suspend fun refreshToken(): Boolean = when (val r = api.refreshToken(RefreshTokenRequest(tm.getRefreshToken()?:return false))) {
        is NetworkResult.Success -> { r.data.token?.let { tm.saveAccessToken(it) }; r.data.refreshToken?.let { tm.saveRefreshToken(it) }; true }
        else -> { tm.clearAll(); false }
    }
    private suspend fun mapResult(r: NetworkResult<com.trainly.app.data.remote.dto.AuthResponse>): NetworkResult<User> = when (r) {
        is NetworkResult.Success -> { val d = r.data; d.token?.let { tm.saveAccessToken(it) }; d.refreshToken?.let { tm.saveRefreshToken(it) }; val u = d.user?.let { User(it.id?:return NetworkResult.Error(ApiError("Missing id")), it.name?:"", it.email?:"", it.avatar, it.bio, it.location, it.stats?.let { s-> UserStats(s.totalWorkouts?:0, s.totalDistance?:0.0, s.totalDuration?:0, s.totalCalories?:0) }) }; u?.let { sm.setAuthenticated(it) }; NetworkResult.Success(u!!) }
        is NetworkResult.Error -> NetworkResult.Error(r.error); is NetworkResult.Loading -> NetworkResult.Loading
    }
}
