package com.trainly.app.data.repository

import com.trainly.app.data.remote.dto.CommentDto
import com.trainly.app.data.remote.dto.PostDto
import com.trainly.app.data.remote.dto.WorkoutSummaryDto
import com.trainly.app.domain.models.Comment
import com.trainly.app.domain.models.Post
import com.trainly.app.domain.models.Workout

internal fun PostDto.toDomainPost(): Post? {
    val postId = id ?: return null
    val author = userId

    return Post(
        id = postId,
        userId = author?.id ?: "",
        userName = author?.name ?: "User",
        userAvatar = author?.avatar,
        content = content,
        image = image,
        likes = likes ?: emptyList(),
        comments = comments?.mapNotNull { it.toDomainComment() } ?: emptyList(),
        createdAt = createdAt.orEmpty(),
        workout = workoutDetails?.toDomainWorkout(),
        privacy = privacy,
    )
}

internal fun CommentDto.toDomainComment(): Comment? {
    val commentId = id ?: return null
    val author = userId

    return Comment(
        id = commentId,
        userId = author?.id ?: "",
        userName = author?.name ?: "User",
        userAvatar = author?.avatar,
        text = text.orEmpty(),
        createdAt = createdAt.orEmpty(),
    )
}

private fun WorkoutSummaryDto.toDomainWorkout(): Workout {
    return Workout(
        id = "",
        type = type.orEmpty(),
        name = type.orEmpty(),
        userId = "",
        duration = duration ?: 0,
        calories = calories ?: 0,
        distance = distance ?: 0.0,
    )
}
