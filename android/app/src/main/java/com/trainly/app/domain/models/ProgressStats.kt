package com.trainly.app.domain.models

data class ProgressStats(
    val totalWorkouts: Int = 0,
    val totalDistance: Double = 0.0,
    val totalDuration: Int = 0,
    val totalCalories: Int = 0,
    val averagePace: Double = 0.0,
    val weeklyStats: List<WeeklyStats> = emptyList(),
    val monthlyStats: List<MonthlyStats> = emptyList(),
    val activityBreakdown: List<ActivityBreakdown> = emptyList()
)

data class WeeklyStats(
    val week: String = "",
    val workouts: Int = 0,
    val distance: Double = 0.0,
    val duration: Int = 0
)

data class MonthlyStats(
    val month: String = "",
    val workouts: Int = 0,
    val distance: Double = 0.0,
    val duration: Int = 0,
    val calories: Int = 0
)

data class ActivityBreakdown(
    val type: String = "",
    val count: Int = 0,
    val totalDistance: Double = 0.0,
    val totalDuration: Int = 0
)
