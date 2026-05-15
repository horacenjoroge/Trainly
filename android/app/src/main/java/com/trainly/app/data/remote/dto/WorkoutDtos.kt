package com.trainly.app.data.remote.dto
import com.google.gson.annotations.SerializedName

data class WorkoutDto(@SerializedName("_id") val id: String?=null, val type: String?=null, val name: String?=null, val userId: String?=null, val startTime: String?=null, val endTime: String?=null, val duration: Int?=null, val calories: Int?=null, val distance: Double?=null, val notes: String?=null, val privacy: String?=null, val sessionId: String?=null, val createdAt: String?=null)
data class WorkoutStatsDto(val totalWorkouts: Int?=null, val totalDistance: Double?=null, val totalDuration: Int?=null, val totalCalories: Int?=null, val averagePace: Double?=null, val weeklyStats: List<WeeklyStatDto>?=null, val monthlyStats: List<MonthlyStatDto>?=null, val activityBreakdown: List<ActivityBreakdownDto>?=null)
data class WeeklyStatDto(val week: String?=null, val workouts: Int?=null, val distance: Double?=null, val duration: Int?=null)
data class MonthlyStatDto(val month: String?=null, val workouts: Int?=null, val distance: Double?=null, val duration: Int?=null, val calories: Int?=null)
data class ActivityBreakdownDto(val type: String?=null, val count: Int?=null, val totalDistance: Double?=null, val totalDuration: Int?=null)
data class WorkoutCreateResponse(val status: String?=null, val data: WorkoutDataDto?=null, val achievementsEarned: List<AchievementDto>?=null, val message: String?=null)
data class WorkoutDataDto(val workout: WorkoutDto?=null)
