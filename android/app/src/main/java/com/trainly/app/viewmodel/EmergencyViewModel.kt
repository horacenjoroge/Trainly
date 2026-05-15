package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.ContactDto
import com.trainly.app.data.remote.dto.SosRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EmergencyUiState(val isSendingSos: Boolean=false, val isLocationActive: Boolean=false, val isFallDetectionActive: Boolean=false, val contacts: List<ContactDto>=emptyList(), val error: String?=null)
@HiltViewModel
class EmergencyViewModel @Inject constructor(private val api: ApiService) : ViewModel() {
    private val _s = MutableStateFlow(EmergencyUiState()); val uiState: StateFlow<EmergencyUiState> = _s.asStateFlow()
    init { load() }
    private fun load() { viewModelScope.launch { when(val r=api.getContacts()){ is NetworkResult.Success -> _s.value=_s.value.copy(contacts=r.data); else -> {} } } }
    fun sendSos() { viewModelScope.launch { _s.value=_s.value.copy(isSendingSos=true); when(api.sendSos(SosRequest(message="SOS Emergency!"))){ is NetworkResult.Success -> _s.value=_s.value.copy(isSendingSos=false); is NetworkResult.Error -> _s.value=_s.value.copy(isSendingSos=false, error=it.error.message); else -> {} } } }
    fun toggleLocationTracking() { _s.value=_s.value.copy(isLocationActive=!_s.value.isLocationActive) }
    fun toggleFallDetection() { _s.value=_s.value.copy(isFallDetectionActive=!_s.value.isFallDetectionActive) }
}
