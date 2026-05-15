package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.domain.repository.HomeRepository
import com.trainly.app.ui.screens.home.HomeUiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repo: HomeRepository, private val sm: SessionManager
) : ViewModel() {
    private val _s = MutableStateFlow<HomeUiState>(HomeUiState.Loading); val uiState: StateFlow<HomeUiState> = _s.asStateFlow()
    private val _l = MutableStateFlow<Set<String>>(emptySet()); val likedPostIds: StateFlow<Set<String>> = _l.asStateFlow()
    init { loadData() }
    fun loadData() { viewModelScope.launch { _s.value=HomeUiState.Loading; loadAll() } }
    fun refresh() { (_s.value as? HomeUiState.Success)?.let { _s.value=it.copy(isRefreshing=true) }; viewModelScope.launch { loadAll() } }
    fun likePost(id: String) { viewModelScope.launch { if (repo.likePost(id) is NetworkResult.Success) { val s=_l.value.toMutableSet(); if (s.contains(id)) s.remove(id) else s.add(id); _l.value=s } } }
    private suspend fun loadAll() { val name=sm.authState.value.user?.name?:"User"; val pr=repo.getProgressStats(); val po=repo.getPosts(); val ps=(pr as? NetworkResult.Success)?.data?:ProgressStats(); val pp=(po as? NetworkResult.Success)?.data?:emptyList(); val hasErr=pr is NetworkResult.Error||po is NetworkResult.Error; _s.value=if(hasErr&&pp.isEmpty()) HomeUiState.Error((pr as? NetworkResult.Error)?.error?.message?:(po as? NetworkResult.Error)?.error?.message?:"" , ps, name) else HomeUiState.Success(pp, ps, name) }
}
