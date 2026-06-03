package com.trainly.app.data.remote.dto
import com.google.gson.annotations.SerializedName

data class WorkoutSummaryDto(val type: String?=null, val duration: Int?=null, val calories: Int?=null, val distance: Double?=null)
data class PostDto(@SerializedName("_id") val id: String?=null, val userId: UserDto?=null, val content: String?=null, val image: String?=null, val likes: List<String>?=null, val comments: List<CommentDto>?=null, val createdAt: String?=null, val privacy: String?=null, val workoutDetails: WorkoutSummaryDto?=null)
data class CommentDto(@SerializedName("_id") val id: String?=null, val userId: UserDto?=null, val text: String?=null, val createdAt: String?=null)
data class CreatePostRequest(val content: String?=null, val privacy: String?=null)
data class CreateCommentRequest(val text: String)
data class AchievementDto(@SerializedName("_id") val id: String?=null, val name: String?=null, val description: String?=null, val icon: String?=null, val category: String?=null, val earnedAt: String?=null)
data class ContactDto(@SerializedName("_id") val id: String?=null, val name: String?=null, val phone: String?=null, val relationship: String?=null)
data class SosRequest(val location: SosLocationDto?=null, val message: String?=null)
data class SosLocationDto(val latitude: Double?=null, val longitude: Double?=null)
