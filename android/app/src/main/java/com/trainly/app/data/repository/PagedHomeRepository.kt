package com.trainly.app.data.repository
import androidx.paging.*
import com.trainly.app.data.remote.*
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.domain.models.Post
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.domain.repository.HomeRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PagedHomeRepository @Inject constructor(private val api: ApiService) : HomeRepository {
    val pagedPosts: Flow<PagingData<Post>> = Pager(PagingConfig(pageSize = 20, enablePlaceholders = false)) { FeedPagingSource(api) }.flow
    val pagedWorkouts: Flow<PagingData<WorkoutDto>> = Pager(PagingConfig(pageSize = 20, enablePlaceholders = false)) { WorkoutHistoryPagingSource(api) }.flow
    override suspend fun getProgressStats(): NetworkResult<ProgressStats> = when (val r=api.getWorkoutStats("month")) { is NetworkResult.Success -> NetworkResult.Success(ProgressStats(totalWorkouts=r.data.totalWorkouts?:0)); else -> NetworkResult.Error(ApiError("fail")) }
    override suspend fun getPosts(): NetworkResult<List<Post>> = when (val r=api.getPosts()) {
        is NetworkResult.Success -> NetworkResult.Success(r.data.mapNotNull { it.toDomainPost() })
        is NetworkResult.Error -> NetworkResult.Error(r.error)
        is NetworkResult.Loading -> NetworkResult.Loading
    }
    override suspend fun likePost(id: String): NetworkResult<Post> = when (val r=api.likePost(id)) {
        is NetworkResult.Success -> {
            val post = r.data.toDomainPost()
            if (post != null) NetworkResult.Success(post) else NetworkResult.Error(ApiError("Invalid post response"))
        }
        is NetworkResult.Error -> NetworkResult.Error(r.error)
        is NetworkResult.Loading -> NetworkResult.Loading
    }
}
