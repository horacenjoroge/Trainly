package com.trainly.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.repository.Achievement
import com.trainly.app.domain.repository.StatsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class AchievementsUiState {
    data object Loading : AchievementsUiState()
    data class Success(
        val achievements: List<Achievement> = emptyList(),
        val selectedTab: String = "earned"
    ) : AchievementsUiState()
    data class Error(val message: String) : AchievementsUiState()
}

@HiltViewModel
class AchievementsViewModel @Inject constructor(
    private val repo: StatsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AchievementsUiState>(AchievementsUiState.Loading)
    val uiState: StateFlow<AchievementsUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun selectTab(tab: String) {
        val current = _uiState.value as? AchievementsUiState.Success ?: return
        _uiState.value = current.copy(selectedTab = tab)
    }

    fun load() {
        viewModelScope.launch {
            _uiState.value = AchievementsUiState.Loading
            when (val result = repo.getAchievements()) {
                is NetworkResult.Success -> {
                    _uiState.value = AchievementsUiState.Success(achievements = result.data)
                }
                is NetworkResult.Error -> {
                    _uiState.value = AchievementsUiState.Error(message = result.error.message)
                }
                is NetworkResult.Loading -> { }
            }
        }
    }
}
