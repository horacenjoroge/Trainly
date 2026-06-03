package com.trainly.app.viewmodel

import androidx.lifecycle.SavedStateHandle
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
class WorkoutDetailViewModel @Inject constructor(
    private val api: ApiService,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val workoutId: String? = savedStateHandle["workoutId"]

    private val _uiState = MutableStateFlow<UiState<WorkoutDto>>(UiState.Loading)
    val uiState: StateFlow<UiState<WorkoutDto>> = _uiState.asStateFlow()

    init {
        load()
    }

    fun reload() {
        load()
    }

    private fun load() {
        val id = workoutId
        if (id.isNullOrBlank()) {
            _uiState.value = UiState.Error("Workout not found")
            return
        }
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            when (val r = api.getWorkout(id)) {
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
}
