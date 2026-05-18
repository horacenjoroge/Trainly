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
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class EditStatsViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(EditStatsFormState())
    val uiState: StateFlow<EditStatsFormState> = _uiState.asStateFlow()

    fun updateWeight(value: String) {
        _uiState.value = _uiState.value.copy(weight = value)
    }

    fun updateHeight(value: String) {
        _uiState.value = _uiState.value.copy(height = value)
    }

    fun save(onOK: () -> Unit) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = api.updateUserStats(
                mapOf<String, Any>(
                    "weight" to (_uiState.value.weight.toDoubleOrNull() ?: 0.0),
                    "height" to (_uiState.value.height.toDoubleOrNull() ?: 0.0)
                )
            )
            if (result is NetworkResult.Success) {
                _uiState.value = _uiState.value.copy(isLoading = false)
                onOK()
            } else {
                val msg = (result as? NetworkResult.Error)?.error?.message ?: "Failed to save"
                _uiState.value = _uiState.value.copy(isLoading = false, error = msg)
            }
        }
    }
}
