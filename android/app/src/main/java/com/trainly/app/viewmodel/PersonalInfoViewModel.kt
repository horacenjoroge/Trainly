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

data class PersonalInfoFormState(
    val name: String = "",
    val email: String = "",
    val bio: String = "",
    val location: String = "",
    val selectedSports: Set<String> = emptySet(),
    val isLoading: Boolean = false,
    val isSaving: Boolean = false,
    val error: String? = null,
    val saved: Boolean = false
) {
    val allSports = listOf("Running", "Cycling", "Swimming", "Strength", "Yoga")
    fun toggleSport(s: String) =
        copy(selectedSports = if (s in selectedSports) selectedSports - s else selectedSports + s)
}

@HiltViewModel
class PersonalInfoViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(PersonalInfoFormState())
    val uiState: StateFlow<PersonalInfoFormState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            when (val r = api.getUserProfile()) {
                is NetworkResult.Success -> {
                    val d = r.data
                    _uiState.value = _uiState.value.copy(
                        name = d.name ?: "",
                        email = d.email ?: "",
                        bio = d.bio ?: "",
                        location = d.location ?: "",
                        isLoading = false
                    )
                }
                else -> _uiState.value = _uiState.value.copy(isLoading = false)
            }
        }
    }

    fun updateName(value: String) { _uiState.value = _uiState.value.copy(name = value, saved = false) }
    fun updateEmail(value: String) { _uiState.value = _uiState.value.copy(email = value, saved = false) }
    fun updateBio(value: String) { _uiState.value = _uiState.value.copy(bio = value, saved = false) }
    fun updateLocation(value: String) { _uiState.value = _uiState.value.copy(location = value, saved = false) }
    fun toggleSport(s: String) { _uiState.value = _uiState.value.toggleSport(s).copy(saved = false) }

    fun save() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSaving = true, error = null, saved = false)
            val s = _uiState.value
            val result = api.updateUserProfile(
                mapOf(
                    "name" to s.name,
                    "email" to s.email,
                    "bio" to s.bio,
                    "location" to s.location
                )
            )
            if (result is NetworkResult.Success) {
                _uiState.value = _uiState.value.copy(isSaving = false, saved = true)
            } else {
                val msg = (result as? NetworkResult.Error)?.error?.message ?: "Failed to save"
                _uiState.value = _uiState.value.copy(isSaving = false, error = msg)
            }
        }
    }
}
