package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.UserDto
import com.trainly.app.ui.designsystem.theme.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class UserProfileViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState<UserDto>>(UiState.Loading)
    val uiState: StateFlow<UiState<UserDto>> = _uiState.asStateFlow()

    private val _isFollowing = MutableStateFlow(false)
    val isFollowing: StateFlow<Boolean> = _isFollowing.asStateFlow()

    fun loadProfile(userId: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            when (val r = api.getUserById(userId)) {
                is NetworkResult.Success -> {
                    _uiState.value = UiState.Success(r.data)
                }
                is NetworkResult.Error -> {
                    _uiState.value = UiState.Error(r.error.message)
                }
                else -> {}
            }
        }
    }

    fun toggleFollow(userId: String) {
        viewModelScope.launch {
            if (_isFollowing.value) {
                api.unfollowUser(userId)
                _isFollowing.value = false
            } else {
                api.followUser(userId)
                _isFollowing.value = true
            }
        }
    }
}
