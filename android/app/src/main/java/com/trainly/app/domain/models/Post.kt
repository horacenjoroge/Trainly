package com.trainly.app.domain.models
data class Post(val id: String, val userId: String, val userName: String, val userAvatar: String?=null, val content: String?=null, val image: String?=null, val likes: List<String>, val comments: List<Comment>, val createdAt: String, val workout: Workout?=null, val privacy: String?=null)
data class Comment(val id: String, val userId: String, val userName: String, val userAvatar: String?=null, val text: String, val createdAt: String)
