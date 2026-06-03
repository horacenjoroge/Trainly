package com.trainly.app.data.remote
import com.trainly.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface AuthApi {
    @POST("api/auth/login") suspend fun login(@Body r: LoginRequest): Response<AuthResponse>
    @POST("api/auth/register") suspend fun register(@Body r: RegisterRequest): Response<AuthResponse>
    @POST("api/auth/refresh") suspend fun refreshToken(@Body r: RefreshTokenRequest): Response<RefreshTokenResponse>
    @GET("api/auth/user") suspend fun getCurrentUser(): Response<UserDto>
}
