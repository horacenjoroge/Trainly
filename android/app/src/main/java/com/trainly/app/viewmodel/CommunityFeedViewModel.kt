package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.Post
import com.trainly.app.domain.repository.HomeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class CommunityFeedUiState { data object Loading: CommunityFeedUiState(); data class Success(val posts: List<Post>): CommunityFeedUiState(); data class Error(val message: String): CommunityFeedUiState() }
@HiltViewModel
class CommunityFeedViewModel @Inject constructor(private val repo: HomeRepository) : ViewModel() {
    private val _s = MutableStateFlow<CommunityFeedUiState>(CommunityFeedUiState.Loading); val uiState: StateFlow<CommunityFeedUiState> = _s.asStateFlow()
    private val _l = MutableStateFlow<Set<String>>(emptySet()); val likedPostIds: StateFlow<Set<String>> = _l.asStateFlow()
    private var allPosts: List<Post> = emptyList()
    init { loadPosts() }
    fun loadPosts() { viewModelScope.launch { _s.value=CommunityFeedUiState.Loading; when(val r=repo.getPosts()){ is NetworkResult.Success -> { allPosts=r.data; _s.value=CommunityFeedUiState.Success(allPosts) }; is NetworkResult.Error -> _s.value=CommunityFeedUiState.Error(r.error.message); else -> {} } } }
    fun likePost(id: String) { viewModelScope.launch { if(repo.likePost(id) is NetworkResult.Success){ val s=_l.value.toMutableSet(); if(s.contains(id)) s.remove(id) else s.add(id); _l.value=s } } }
    fun search(q: String) { _s.value=CommunityFeedUiState.Success(if(q.isBlank()) allPosts else allPosts.filter{it.content?.contains(q, true)==true||it.userName.contains(q, true)}) }
}
