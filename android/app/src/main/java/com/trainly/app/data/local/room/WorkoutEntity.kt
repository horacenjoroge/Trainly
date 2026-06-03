package com.trainly.app.data.local.room
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "workouts")
data class WorkoutEntity(@PrimaryKey val id: String, val type: String, val name: String, val userId: String, val duration: Int, val calories: Int, val distance: Double, val sessionId: String?=null, val notes: String?=null, val privacy: String="public", val createdAt: String?=null, val isPendingSync: Boolean=false)
@Entity(tableName = "posts")
data class PostEntity(@PrimaryKey val id: String, val userId: String, val userName: String, val userAvatar: String?=null, val content: String?=null, val image: String?=null, val likes: Int=0, val comments: Int=0, val createdAt: String?=null, val isPendingSync: Boolean=false)
@Entity(tableName = "user_cache")
data class UserCacheEntity(@PrimaryKey val id: String, val name: String, val email: String, val avatar: String?=null, val bio: String?=null, val location: String?=null, val totalWorkouts: Int=0, val totalDistance: Double=0.0, val totalDuration: Int=0, val totalCalories: Int=0, val cachedAt: Long=System.currentTimeMillis())
