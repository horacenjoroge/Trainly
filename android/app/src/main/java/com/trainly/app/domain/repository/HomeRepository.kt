package com.trainly.app.domain.repository
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.Post
import com.trainly.app.domain.models.ProgressStats
interface HomeRepository {
    suspend fun getProgressStats(): NetworkResult<ProgressStats>
    suspend fun getPosts(): NetworkResult<List<Post>>
    suspend fun likePost(postId: String): NetworkResult<Post>
}
