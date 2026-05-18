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
    val bio: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class PersonalInfoViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(PersonalInfoFormState())
    val uiState: StateFlow<PersonalInfoFormState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            when (val r = api.getUserProfile()) {
                is NetworkResult.Success -> {
                    val d = r.data
                    _uiState.value = PersonalInfoFormState(
                        name = d.name ?: "",
                        bio = d.bio ?: ""
                    )
                }
                else -> {}
            }
        }
    }

    fun updateName(value: String) {
        _uiState.value = _uiState.value.copy(name = value)
    }

    fun updateBio(value: String) {
        _uiState.value = _uiState.value.copy(bio = value)
    }

    fun save() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = api.updateUserProfile(
                mapOf(
                    "name" to _uiState.value.name,
                    "bio" to _uiState.value.bio
                )
            )
            if (result is NetworkResult.Success) {
                _uiState.value = _uiState.value.copy(isLoading = false)
            } else {
                val msg = (result as? NetworkResult.Error)?.error?.message ?: "Failed to save"
                _uiState.value = _uiState.value.copy(isLoading = false, error = msg)
            }
        }
    }
}
