package com.trainly.app.data.remote.dto
import com.google.gson.annotations.SerializedName

data class LoginRequest(val email: String, val password: String)
data class RegisterRequest(val name: String, val email: String, val password: String)
data class AuthResponse(val token: String?, val refreshToken: String?, val user: UserDto?)
data class RefreshTokenRequest(val refreshToken: String)
data class RefreshTokenResponse(val token: String?, val refreshToken: String?)
data class UserDto(val id: String?, val name: String?, val email: String?, val avatar: String?, val bio: String?, val location: String?, val stats: UserStatsDto?)
data class UserStatsDto(val totalWorkouts: Int?, val totalDistance: Double?, val totalDuration: Int?, val totalCalories: Int?)
