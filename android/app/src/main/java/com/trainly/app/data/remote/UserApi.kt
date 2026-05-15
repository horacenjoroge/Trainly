package com.trainly.app.data.remote
import com.trainly.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface UserApi {
    @GET("api/users/profile") suspend fun getUserProfile(): Response<UserDto>
    @PUT("api/users/profile") suspend fun updateUserProfile(@Body d: Map<String,Any>): Response<UserDto>
    @PUT("api/users/stats") suspend fun updateUserStats(@Body d: Map<String,Any>): Response<UserDto>
    @GET("api/users/{id}") suspend fun getUserById(@Path("id") id: String): Response<UserDto>
    @GET("api/users/search") suspend fun searchUsers(@Query("q") q: String=""): Response<List<UserDto>>
    @GET("api/follow/followers") suspend fun getFollowers(@Query("userId") id: String?=null): Response<List<UserDto>>
    @GET("api/follow/following") suspend fun getFollowing(@Query("userId") id: String?=null): Response<List<UserDto>>
    @POST("api/follow/{userId}") suspend fun followUser(@Path("userId") id: String): Response<Unit>
    @DELETE("api/follow/{userId}") suspend fun unfollowUser(@Path("userId") id: String): Response<Unit>
}
