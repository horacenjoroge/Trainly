package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.domain.repository.HomeRepository
import com.trainly.app.ui.features.home.HomeData
import com.trainly.app.ui.features.home.HomeUiState
import com.trainly.app.ui.designsystem.theme.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repo: HomeRepository,
    private val sm: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<HomeUiState>(UiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()


    private val _likedIds = MutableStateFlow<Set<String>>(emptySet())
    val likedPostIds: StateFlow<Set<String>> = _likedIds.asStateFlow()

    init { loadData() }

    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            loadAll()
        }
    }

    fun refresh() {
        viewModelScope.launch { loadAll() }
    }

    fun likePost(id: String) {
        viewModelScope.launch {
            when (val result = repo.likePost(id)) {
                is NetworkResult.Success -> {
                    val currentUserId = sm.authState.value.user?.id
                    val updated = _likedIds.value.toMutableSet()
                    if (currentUserId != null && result.data.likes.contains(currentUserId)) updated.add(id)
                    else updated.remove(id)
                    _likedIds.value = updated
                }
                else -> {}
            }
        }
    }

    private suspend fun loadAll() {
        val pr = repo.getProgressStats()
        val po = repo.getPosts()
        val ps = (pr as? NetworkResult.Success)?.data ?: ProgressStats()
        val pp = (po as? NetworkResult.Success)?.data ?: emptyList()
        val hasErr = pr is NetworkResult.Error || po is NetworkResult.Error
        val currentUserId = sm.authState.value.user?.id

        _likedIds.value = if (currentUserId != null) {
            pp.filter { it.likes.contains(currentUserId) }.mapTo(mutableSetOf()) { it.id }
        } else {
            emptySet()
        }

        _uiState.value = if (hasErr && pp.isEmpty()) {
            val errMsg = (pr as? NetworkResult.Error)?.error?.message
                ?: (po as? NetworkResult.Error)?.error?.message ?: ""
            UiState.Error(message = errMsg)
        } else {
            UiState.Success(HomeData(progressStats = ps, posts = pp))
        }
    }
}
