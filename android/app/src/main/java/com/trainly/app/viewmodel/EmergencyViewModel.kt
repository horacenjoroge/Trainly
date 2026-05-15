package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.ContactDto
import com.trainly.app.data.remote.dto.SosRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EmergencyUiState(
    val isSendingSos: Boolean = false,
    val isLocationActive: Boolean = false,
    val isFallDetectionActive: Boolean = false,
    val contacts: List<ContactDto> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class EmergencyViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(EmergencyUiState())
    val uiState: StateFlow<EmergencyUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    private fun load() {
        viewModelScope.launch {
            when (val result = api.getContacts()) {
                is NetworkResult.Success -> {
                    _uiState.value = _uiState.value.copy(contacts = result.data)
                }
                else -> { }
            }
        }
    }

    fun sendSos() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSendingSos = true)
            when (val result = api.sendSos(SosRequest(message = "SOS Emergency!"))) {
                is NetworkResult.Success -> {
                    _uiState.value = _uiState.value.copy(isSendingSos = false)
                }
                is NetworkResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isSendingSos = false,
                        error = result.error.message
                    )
                }
                is NetworkResult.Loading -> { }
            }
        }
    }

    fun toggleLocationTracking() {
        _uiState.value = _uiState.value.copy(isLocationActive = !_uiState.value.isLocationActive)
    }

    fun toggleFallDetection() {
        _uiState.value = _uiState.value.copy(isFallDetectionActive = !_uiState.value.isFallDetectionActive)
    }
}
