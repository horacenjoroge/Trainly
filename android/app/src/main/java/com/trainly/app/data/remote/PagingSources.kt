package com.trainly.app.data.remote
import androidx.paging.PagingSource
import androidx.paging.PagingState
import com.trainly.app.data.repository.toDomainPost
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.domain.models.Post

class FeedPagingSource(private val api: ApiService) : PagingSource<Int, Post>() {
    override fun getRefreshKey(s: PagingState<Int,Post>): Int? = s.anchorPosition
    override suspend fun load(params: LoadParams<Int>): LoadResult<Int, Post> = try {
        val page = params.key ?: 1
        when (val r = api.getPosts()) {
            is NetworkResult.Success -> LoadResult.Page(r.data.mapNotNull { it.toDomainPost() }, prevKey=if(page==1)null else page-1, nextKey=if(r.data.isEmpty())null else page+1)
            is NetworkResult.Error -> LoadResult.Error(Exception(r.error.message))
            is NetworkResult.Loading -> LoadResult.Page(emptyList(), null, null)
        }
    } catch (e: Exception) { LoadResult.Error(e) }
}

class WorkoutHistoryPagingSource(private val api: ApiService) : PagingSource<Int, WorkoutDto>() {
    override fun getRefreshKey(s: PagingState<Int,WorkoutDto>): Int? = s.anchorPosition
    override suspend fun load(params: LoadParams<Int>): LoadResult<Int, WorkoutDto> = try {
        val page = params.key ?: 1
        when (val r = api.getWorkouts(mapOf("page" to "$page", "limit" to "20", "sortBy" to "createdAt", "sortOrder" to "desc"))) {
            is NetworkResult.Success -> LoadResult.Page(r.data, if(page==1)null else page-1, if(r.data.isEmpty())null else page+1)
            is NetworkResult.Error -> LoadResult.Error(Exception(r.error.message))
            is NetworkResult.Loading -> LoadResult.Page(emptyList(), null, null)
        }
    } catch (e: Exception) { LoadResult.Error(e) }
}
