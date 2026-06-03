package com.trainly.app.data.remote
import com.trainly.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface AchievementApi {
    @GET("api/achievements/user") suspend fun getUserAchievements(): Response<List<AchievementDto>>
    @GET("api/achievements/progress") suspend fun getAchievementProgress(): Response<Map<String,Any>>
}
