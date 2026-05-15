package com.trainly.app.domain.models
data class User(val id: String, val name: String, val email: String, val avatar: String?=null, val bio: String?=null, val location: String?=null, val stats: UserStats?=null)
data class UserStats(val totalWorkouts: Int=0, val totalDistance: Double=0.0, val totalDuration: Int=0, val totalCalories: Int=0)
