package com.trainly.app.data.repository
import com.trainly.app.data.local.room.PostEntity
import com.trainly.app.data.remote.*
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.local.room.AppDatabase
import com.trainly.app.domain.models.*
import com.trainly.app.domain.repository.HomeRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OfflineHomeRepository @Inject constructor(
    private val api: ApiService, private val db: AppDatabase
) : HomeRepository {
    override suspend fun getProgressStats(): NetworkResult<ProgressStats> = when (val r = api.getWorkoutStats("month")) {
        is NetworkResult.Success -> { val d=r.data; NetworkResult.Success(ProgressStats(totalWorkouts=d.totalWorkouts?:0, totalDistance=d.totalDistance?:0.0, totalDuration=d.totalDuration?:0, totalCalories=d.totalCalories?:0)) }
        is NetworkResult.Error -> NetworkResult.Error(r.error); is NetworkResult.Loading -> NetworkResult.Loading
    }
    override suspend fun getPosts(): NetworkResult<List<Post>> = when (val r = api.getPosts()) {
        is NetworkResult.Success -> {
            val posts = r.data.mapNotNull { it.toDomainPost() }
            db.postDao().deleteAll()
            db.postDao().insertAll(posts.map {
                PostEntity(
                    id = it.id,
                    userId = it.userId,
                    userName = it.userName,
                    userAvatar = it.userAvatar,
                    content = it.content,
                    image = it.image,
                    likes = it.likes.size,
                    comments = it.comments.size,
                    createdAt = it.createdAt
                )
            })
            NetworkResult.Success(posts)
        }
        is NetworkResult.Error -> NetworkResult.Error(r.error); is NetworkResult.Loading -> NetworkResult.Loading
    }
    override suspend fun likePost(id: String): NetworkResult<Post> = when (val r = api.likePost(id)) {
        is NetworkResult.Success -> {
            val post = r.data.toDomainPost()
            if (post != null) NetworkResult.Success(post) else NetworkResult.Error(ApiError("Invalid post response"))
        }
        is NetworkResult.Error -> NetworkResult.Error(r.error); is NetworkResult.Loading -> NetworkResult.Loading
    }
}
