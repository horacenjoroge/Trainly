package com.trainly.app.domain.models
data class Workout(val id: String, val type: String, val name: String, val userId: String, val startTime: String?=null, val endTime: String?=null, val duration: Int=0, val calories: Int=0, val distance: Double=0.0, val notes: String?=null, val privacy: String="public", val sessionId: String?=null, val createdAt: String?=null)
