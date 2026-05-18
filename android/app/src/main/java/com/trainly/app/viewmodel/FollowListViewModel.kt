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
    val users: List<UserDto> = emptyList(),
    val loading: Boolean = false
)

@HiltViewModel
class FollowListViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(FollowListUiState())
    val uiState: StateFlow<FollowListUiState> = _uiState.asStateFlow()

    fun loadFollowers() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true)
            when (val r = api.getFollowers()) {
                is NetworkResult.Success -> {
                    _uiState.value = FollowListUiState(users = r.data)
                }
                else -> {
                    _uiState.value = _uiState.value.copy(loading = false)
                }
            }
        }
    }

    fun loadFollowing() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true)
            when (val r = api.getFollowing()) {
                is NetworkResult.Success -> {
                    _uiState.value = FollowListUiState(users = r.data)
                }
                else -> {
                    _uiState.value = _uiState.value.copy(loading = false)
                }
            }
        }
    }
}
