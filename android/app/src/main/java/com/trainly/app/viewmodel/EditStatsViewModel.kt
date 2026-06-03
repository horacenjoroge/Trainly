package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EditStatsFormState(
    val weight: String = "",
    val height: String = "",
    val dob: String = "",
    val sex: String = "Male",
    val goal: String = "Improve Fitness",
    val weeklyTarget: String = "4-5 workouts",
    val isLoading: Boolean = false,
    val error: String? = null,
    val saved: Boolean = false
) {
    val sexOptions = listOf("Male", "Female", "Other", "Prefer not to say")
    val goalOptions = listOf(
        "Improve Fitness" to ("🔥" to "General health & conditioning"),
        "Lose Weight" to ("⚖️" to "Calorie-focused training"),
        "Build Strength" to ("💪" to "Progressive overload"),
        "Race Training" to ("🏆" to "Event-specific preparation")
    )
    val weeklyOptions = listOf("2-3 workouts", "4-5 workouts", "6-7 workouts")
}

@HiltViewModel
class EditStatsViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(EditStatsFormState())
    val uiState: StateFlow<EditStatsFormState> = _uiState.asStateFlow()

    fun updateWeight(value: String) { _uiState.value = _uiState.value.copy(weight = value, saved = false) }
    fun updateHeight(value: String) { _uiState.value = _uiState.value.copy(height = value, saved = false) }
    fun updateDob(value: String) { _uiState.value = _uiState.value.copy(dob = value, saved = false) }
    fun updateSex(value: String) { _uiState.value = _uiState.value.copy(sex = value, saved = false) }
    fun selectGoal(value: String) { _uiState.value = _uiState.value.copy(goal = value, saved = false) }
    fun updateWeeklyTarget(value: String) { _uiState.value = _uiState.value.copy(weeklyTarget = value, saved = false) }

    fun save(onOK: () -> Unit) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null, saved = false)
            val s = _uiState.value
            val result = api.updateUserStats(
                mapOf<String, Any>(
                    "weight" to (s.weight.toDoubleOrNull() ?: 0.0),
                    "height" to (s.height.toDoubleOrNull() ?: 0.0),
                    "dob" to s.dob,
                    "sex" to s.sex,
                    "goal" to s.goal,
                    "weeklyTarget" to s.weeklyTarget
                )
            )
            if (result is NetworkResult.Success) {
                _uiState.value = _uiState.value.copy(isLoading = false, saved = true)
            } else {
                val msg = (result as? NetworkResult.Error)?.error?.message ?: "Failed to save"
                _uiState.value = _uiState.value.copy(isLoading = false, error = msg)
            }
        }
    }
}
