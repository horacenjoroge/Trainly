package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.ui.designsystem.theme.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class WorkoutHistoryViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState<List<WorkoutDto>>>(UiState.Loading)
    val uiState: StateFlow<UiState<List<WorkoutDto>>> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            when (val r = api.getWorkouts()) {
                is NetworkResult.Success -> {
                    val list = r.data.sortedByDescending { it.createdAt }
                    _uiState.value = UiState.Success(list)
                }
                is NetworkResult.Error -> {
                    _uiState.value = UiState.Error(r.error.message)
                }
                else -> {}
            }
        }
    }
}
