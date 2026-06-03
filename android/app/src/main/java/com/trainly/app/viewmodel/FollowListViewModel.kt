package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.UserDto
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FollowListUiState(
    val followers: List<UserDto> = emptyList(),
    val following: List<UserDto> = emptyList(),
    val loading: Boolean = false
)

@HiltViewModel
class FollowListViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(FollowListUiState())
    val uiState: StateFlow<FollowListUiState> = _uiState.asStateFlow()

    private val _followedIds = MutableStateFlow<Set<String>>(emptySet())
    val followedIds: StateFlow<Set<String>> = _followedIds.asStateFlow()

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true)
            val f1 = api.getFollowers()
            val f2 = api.getFollowing()
            val followers = if (f1 is NetworkResult.Success) f1.data else emptyList()
            val following = if (f2 is NetworkResult.Success) f2.data else emptyList()
            _uiState.value = FollowListUiState(
                followers = followers,
                following = following,
                loading = false
            )
        }
    }

    fun toggleFollow(userId: String) {
        val current = _followedIds.value
        _followedIds.value = if (userId in current) current - userId else current + userId
        viewModelScope.launch {
            api.followUser(userId)
        }
    }
}
