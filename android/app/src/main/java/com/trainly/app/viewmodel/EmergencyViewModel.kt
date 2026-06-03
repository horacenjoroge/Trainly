package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.ContactDto
import com.trainly.app.data.remote.dto.SosRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EmergencyUiState(
    val isSendingSos: Boolean = false,
    val isSosActive: Boolean = false,
    val sosCountdown: Int = 10,
    val sosSent: Boolean = false,
    val contacts: List<ContactDto> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class EmergencyViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(EmergencyUiState())
    val uiState: StateFlow<EmergencyUiState> = _uiState.asStateFlow()

    init { load() }

    private fun load() {
        viewModelScope.launch {
            when (val result = api.getContacts()) {
                is NetworkResult.Success -> {
                    _uiState.value = _uiState.value.copy(contacts = result.data)
                }
                else -> {}
            }
        }
    }

    fun triggerSos() {
        _uiState.value = _uiState.value.copy(isSosActive = true, sosCountdown = 10, sosSent = false)
        viewModelScope.launch {
            for (i in 10 downTo 0) {
                _uiState.value = _uiState.value.copy(sosCountdown = i)
                if (i == 0) {
                    sendSos()
                }
                delay(1000L)
            }
        }
    }

    fun cancelSos() {
        _uiState.value = _uiState.value.copy(
            isSosActive = false,
            sosCountdown = 10,
            sosSent = false
        )
    }

    private suspend fun sendSos() {
        _uiState.value = _uiState.value.copy(isSendingSos = true)
        when (val result = api.sendSos(SosRequest(message = "SOS Emergency!"))) {
            is NetworkResult.Success -> {
                _uiState.value = _uiState.value.copy(
                    isSendingSos = false,
                    sosSent = true
                )
            }
            is NetworkResult.Error -> {
                _uiState.value = _uiState.value.copy(
                    isSendingSos = false,
                    error = result.error.message
                )
            }
            else -> {}
        }
    }
}
