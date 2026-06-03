package com.trainly.app.domain.repository
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.User
interface AuthRepository {
    suspend fun login(e: String, p: String): NetworkResult<User>
    suspend fun register(n: String, e: String, p: String): NetworkResult<User>
    suspend fun logout(); suspend fun getCurrentUser(): NetworkResult<User>
    suspend fun isAuthenticated(): Boolean; suspend fun refreshToken(): Boolean
}
