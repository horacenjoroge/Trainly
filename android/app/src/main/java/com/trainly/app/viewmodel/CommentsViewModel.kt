package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.CommentDto
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CommentsUiState(
    val comments: List<CommentDto> = emptyList(),
    val newComment: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class CommentsViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(CommentsUiState())
    val uiState: StateFlow<CommentsUiState> = _uiState.asStateFlow()

    fun loadComments(postId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            when (val r = api.getPostComments(postId)) {
                is NetworkResult.Success -> {
                    _uiState.value = _uiState.value.copy(
                        comments = r.data,
                        isLoading = false
                    )
                }
                is NetworkResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = r.error.message
                    )
                }
                else -> {}
            }
        }
    }

    fun updateComment(value: String) {
        _uiState.value = _uiState.value.copy(newComment = value)
    }

    fun addComment(postId: String) {
        val text = _uiState.value.newComment
        if (text.isBlank()) return
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(newComment = "", isLoading = true)
            when (val r = api.addPostComment(postId, text)) {
                is NetworkResult.Success -> {
                    loadComments(postId)
                }
                is NetworkResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = r.error.message
                    )
                }
                else -> {}
            }
        }
    }
}
