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

data class LockedAchievement(
    val achievement: Achievement,
    val progress: Int = 0,
    val max: Int = 100
)

data class AchievementsData(
    val earned: List<Achievement> = emptyList(),
    val locked: List<LockedAchievement> = emptyList(),
    val earnedCount: Int = 6,
    val points: Int = 750,
    val level: Int = 3
)

sealed class AchievementsUiState {
    data object Loading : AchievementsUiState()
    data class Success(
        val data: AchievementsData = AchievementsData(),
        val selectedTab: String = "earned"
    ) : AchievementsUiState()
    data class Error(val message: String) : AchievementsUiState()
}

private val mockEarned = listOf(
    Achievement("1", "First Run", "Complete your first run", "\uD83C\uDFC3", "running", 50, "2025-01-15"),
    Achievement("2", "Week Warrior", "Work out 5 days in a week", "\uD83D\uDD25", "consistency", 100, "2025-02-10"),
    Achievement("3", "Trail Blazer", "Complete a workout using GPS", "\uD83D\uDCCD", "running", 50, "2025-03-01"),
    Achievement("4", "Century Club", "Record 100 total workouts", "\uD83D\uDCAA", "milestone", 200, "2025-04-05"),
    Achievement("5", "Century Ride", "Cycle 100 km in a single ride", "\uD83D\uDEB4", "cycling", 150, "2025-04-20"),
    Achievement("6", "Social Butterfly", "Connect with 10 athletes", "\uD83E\uDD1D", "social", 100, "2025-05-01")
)

private val mockLocked = listOf(
    LockedAchievement(Achievement("7", "Aquaman", "Swim 50 km total", "\uD83C\uDFCA", "swimming", 200), 32),
    LockedAchievement(Achievement("8", "Marathon Finisher", "Complete a full 42.2 km run", "\u23F1\uFE0F", "running", 300), 0),
    LockedAchievement(Achievement("9", "Early Bird", "Work out before 6 AM, 10 times", "\uD83C\uDF05", "consistency", 100), 60),
    LockedAchievement(Achievement("10", "On Fire", "7-day workout streak", "\uD83D\uDD25", "consistency", 150), 71),
    LockedAchievement(Achievement("11", "Peak Performance", "Climb 10,000 m elevation", "\uD83C\uDFD4\uFE0F", "running", 250), 8)
)

@HiltViewModel
class AchievementsViewModel @Inject constructor(
    private val repo: StatsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AchievementsUiState>(AchievementsUiState.Loading)
    val uiState: StateFlow<AchievementsUiState> = _uiState.asStateFlow()

    init { load() }

    fun selectTab(tab: String) {
        val current = _uiState.value as? AchievementsUiState.Success ?: return
        _uiState.value = current.copy(selectedTab = tab)
    }

    fun load() {
        viewModelScope.launch {
            _uiState.value = AchievementsUiState.Loading
            when (val result = repo.getAchievements()) {
                is NetworkResult.Success -> {
                    val all = result.data
                    val earned = all.filter { !it.earnedAt.isNullOrBlank() }.ifEmpty { mockEarned }
                    val lockedRaw = all.filter { it.earnedAt.isNullOrBlank() }
                    val locked = if (lockedRaw.isNotEmpty()) {
                        lockedRaw.map { LockedAchievement(it) }
                    } else {
                        mockLocked
                    }
                    val earnedCount = earned.size
                    val points = earned.sumOf { it.points }
                    val level = points / 300 + 1
                    _uiState.value = AchievementsUiState.Success(
                        AchievementsData(
                            earned = earned,
                            locked = locked,
                            earnedCount = earnedCount,
                            points = points,
                            level = level
                        )
                    )
                }
                is NetworkResult.Error -> {
                    _uiState.value = AchievementsUiState.Success(
                        AchievementsData(
                            earned = mockEarned,
                            locked = mockLocked,
                            earnedCount = mockEarned.size,
                            points = mockEarned.sumOf { it.points },
                            level = 3
                        )
                    )
                }
                else -> {}
            }
        }
    }
}
