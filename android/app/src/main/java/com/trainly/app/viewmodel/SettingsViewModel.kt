package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SettingsUiState(
    val displayName: String = "User",
    val email: String = "",
    val avatar: String? = null,
    val darkMode: Boolean = false,
    val gpsAccuracy: Boolean = true,
    val isLoggingOut: Boolean = false,
    val showLogoutDialog: Boolean = false
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val api: ApiService, private val sm: SessionManager
) : ViewModel() {
    private val _s = MutableStateFlow(SettingsUiState())
    val uiState: StateFlow<SettingsUiState> = _s.asStateFlow()

    init { loadProfile() }

    fun loadProfile() {
        viewModelScope.launch {
            val a = sm.authState.value.user
            _s.value = SettingsUiState(
                displayName = a?.name ?: "User",
                email = a?.email ?: "",
                avatar = a?.avatar
            )
            when (val r = api.getUserProfile()) {
                is NetworkResult.Success -> {
                    val d = r.data
                    _s.value = _s.value.copy(
                        displayName = d.name ?: _s.value.displayName,
                        email = d.email ?: _s.value.email,
                        avatar = d.avatar ?: _s.value.avatar
                    )
                }
                else -> {}
            }
        }
    }

    fun toggleDarkMode() { _s.value = _s.value.copy(darkMode = !_s.value.darkMode) }
    fun toggleGpsAccuracy() { _s.value = _s.value.copy(gpsAccuracy = !_s.value.gpsAccuracy) }
    fun showLogoutDialog() { _s.value = _s.value.copy(showLogoutDialog = true) }
    fun dismissLogoutDialog() { _s.value = _s.value.copy(showLogoutDialog = false) }

    fun logout() {
        viewModelScope.launch {
            _s.value = _s.value.copy(isLoggingOut = true, showLogoutDialog = false)
            sm.clearSession()
        }
    }
}
