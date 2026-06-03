package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.ui.features.profile.ProfileData
import com.trainly.app.ui.features.profile.ProfileUiState
import com.trainly.app.ui.designsystem.theme.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val api: ApiService, private val sm: SessionManager
) : ViewModel() {
    private val _s = MutableStateFlow<ProfileUiState>(UiState.Loading); val uiState: StateFlow<ProfileUiState> = _s.asStateFlow()
    init { loadProfile() }
    fun loadProfile() { viewModelScope.launch { _s.value = UiState.Loading; loadAll() } }
    private suspend fun loadAll() {
        val name = sm.authState.value.user?.name ?: "User"
        when (val r = api.getUserProfile()) {
            is NetworkResult.Success -> {
                val d = r.data
                val stats = d.stats
                val workouts = stats?.totalWorkouts ?: 0
                val cals = stats?.totalCalories ?: 0
                val durMin = stats?.totalDuration ?: 0
                val hours = durMin / 60
                val fc = (api.getFollowers().let { if (it is NetworkResult.Success) it.data.size else 0 })
                val fg = (api.getFollowing().let { if (it is NetworkResult.Success) it.data.size else 0 })
                _s.value = UiState.Success(
                    ProfileData(
                        userName = d.name ?: name,
                        userBio = d.bio ?: "Fitness enthusiast",
                        followers = fc,
                        following = fg,
                        workouts = workouts,
                        calories = cals,
                        hours = hours,
                        bestRun = "",
                        memberSince = ""
                    )
                )
            }
            is NetworkResult.Error -> _s.value = UiState.Error(r.error.message)
            else -> {}
        }
    }
}
