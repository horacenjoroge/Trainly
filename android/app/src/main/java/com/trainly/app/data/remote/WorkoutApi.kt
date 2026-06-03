package com.trainly.app.data.remote
import com.trainly.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface WorkoutApi {
    @POST("api/workouts") suspend fun createWorkout(@Body d: WorkoutDto): Response<WorkoutCreateResponse>
    @GET("api/workouts") suspend fun getWorkouts(@QueryMap p: Map<String,String>): Response<ApiEnvelopeDto<List<WorkoutDto>>>
    @GET("api/workouts/{id}") suspend fun getWorkout(@Path("id") id: String): Response<ApiEnvelopeDto<WorkoutDto>>
    @PATCH("api/workouts/{id}") suspend fun updateWorkout(@Path("id") id: String, @Body d: Map<String,Any>): Response<ApiEnvelopeDto<WorkoutDto>>
    @DELETE("api/workouts/{id}") suspend fun deleteWorkout(@Path("id") id: String): Response<ApiEnvelopeDto<Unit>>
    @GET("api/workouts/stats/summary") suspend fun getWorkoutStats(@Query("period") p: String="month"): Response<ApiEnvelopeDto<WorkoutStatsDto>>
    @GET("api/workouts/public/feed") suspend fun getPublicWorkouts(@QueryMap p: Map<String,String>): Response<ApiEnvelopeDto<List<WorkoutDto>>>
    @POST("api/workouts/{id}/like") suspend fun toggleLike(@Path("id") id: String): Response<ApiEnvelopeDto<WorkoutDto>>
    @POST("api/workouts/{id}/comments") suspend fun addComment(@Path("id") id: String, @Body r: CreateCommentRequest): Response<ApiEnvelopeDto<WorkoutDto>>
}
