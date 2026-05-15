package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.repository.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class AchievementsUiState { data object Loading: AchievementsUiState(); data class Success(val achievements: List<Achievement>=emptyList(), val selectedTab: String="earned"): AchievementsUiState(); data class Error(val message: String): AchievementsUiState() }
@HiltViewModel
class AchievementsViewModel @Inject constructor(private val repo: StatsRepository) : ViewModel() {
    private val _s = MutableStateFlow<AchievementsUiState>(AchievementsUiState.Loading); val uiState: StateFlow<AchievementsUiState> = _s.asStateFlow()
    init { load() }
    fun selectTab(t: String) { val c=_s.value as? AchievementsUiState.Success?:return; _s.value=c.copy(selectedTab=t) }
    fun load() { viewModelScope.launch { _s.value=AchievementsUiState.Loading; when(val r=repo.getAchievements()){ is NetworkResult.Success -> _s.value=AchievementsUiState.Success(r.data); is NetworkResult.Error -> _s.value=AchievementsUiState.Error(r.error.message); else -> {} } } }
}
