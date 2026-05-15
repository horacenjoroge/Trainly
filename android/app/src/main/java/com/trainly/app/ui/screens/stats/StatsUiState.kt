package com.trainly.app.ui.screens.stats
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.domain.repository.Achievement
sealed class StatsUiState { data object Loading: StatsUiState()
    data class Success(val stats:ProgressStats=ProgressStats(), val achievements:List<Achievement>=emptyList(), val selectedPeriod:String="month", val isRefreshing:Boolean=false): StatsUiState()
    data class Error(val message:String, val stats:ProgressStats=ProgressStats()): StatsUiState()
}
