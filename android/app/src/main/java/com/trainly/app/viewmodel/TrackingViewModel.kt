package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.ui.features.workouts.GpsCoordinate
import com.trainly.app.ui.features.workouts.TrackingUiState
import com.trainly.app.ui.features.workouts.calculateDistance
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.Instant
import java.util.UUID
import javax.inject.Inject

@HiltViewModel
class TrackingViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(TrackingUiState())
    val uiState: StateFlow<TrackingUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null
    private var sessionId = ""
    private var startTime = 0L
    private var pausedDuration = 0L
    private var pauseStartTime = 0L

    fun initialize(type: String) {
        timerJob?.cancel()
        timerJob = null
        startTime = 0L
        pausedDuration = 0L
        pauseStartTime = 0L
        _uiState.value = TrackingUiState(activityType = type)
        sessionId = "${type.lowercase()}_${System.currentTimeMillis()}_${UUID.randomUUID().toString().take(9)}"
    }

    fun startTracking() {
        if (_uiState.value.isActive) return
        startTime = System.currentTimeMillis()
        _uiState.value = _uiState.value.copy(isActive = true, error = null)
        timerJob = viewModelScope.launch {
            while (true) {
                delay(1000)
                if (_uiState.value.isPaused) continue
                val elapsed = ((System.currentTimeMillis() - startTime - pausedDuration) / 1000).toInt()
                _uiState.value = _uiState.value.copy(
                    durationSeconds = elapsed,
                    calories = ((elapsed / 60) * 5).coerceAtLeast(0)
                )
            }
        }
    }

    fun pauseTracking() {
        if (!_uiState.value.isActive || _uiState.value.isPaused) return
        pauseStartTime = System.currentTimeMillis()
        _uiState.value = _uiState.value.copy(isPaused = true)
    }

    fun resumeTracking() {
        if (!_uiState.value.isActive || !_uiState.value.isPaused) return
        pausedDuration += System.currentTimeMillis() - pauseStartTime
        _uiState.value = _uiState.value.copy(isPaused = false)
    }

    fun stopTracking() {
        timerJob?.cancel()
        timerJob = null
        _uiState.value = _uiState.value.copy(isActive = false, isPaused = false)
    }

    fun updateGpsPoint(point: GpsCoordinate) {
        val pts = _uiState.value.gpsPoints.toMutableList()
        val last = pts.lastOrNull()
        val newDist = if (last != null) _uiState.value.distance + calculateDistance(last, point) else 0.0
        pts.add(point)
        _uiState.value = _uiState.value.copy(
            gpsPoints = pts,
            currentLocation = point,
            distance = newDist
        )
    }

    fun updateDistanceMeters(distanceMeters: Double) {
        _uiState.value = _uiState.value.copy(distance = distanceMeters.coerceAtLeast(0.0))
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun recordSplit() {
        _uiState.value = _uiState.value.copy(splitCount = _uiState.value.splitCount + 1)
    }

    fun saveWorkout(onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            val s = _uiState.value
            _uiState.value = s.copy(isFinishing = true, error = null)
            val result = api.createWorkout(
                WorkoutDto(
                    type = s.activityType,
                    name = "${s.activityType} Session",
                    startTime = Instant.ofEpochMilli(startTime).toString(),
                    endTime = Instant.now().toString(),
                    duration = s.durationSeconds,
                    calories = s.calories,
                    distance = s.distance,
                    sessionId = sessionId,
                    privacy = "public"
                )
            )
            when (result) {
                is NetworkResult.Success -> {
                    stopTracking()
                    onSuccess()
                }
                is NetworkResult.Error -> {
                    _uiState.value = _uiState.value.copy(isFinishing = false, error = result.error.message)
                    onError(result.error.message)
                }
                is NetworkResult.Loading -> { }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}
