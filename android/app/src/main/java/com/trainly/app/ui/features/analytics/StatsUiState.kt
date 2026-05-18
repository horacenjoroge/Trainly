package com.trainly.app.ui.features.analytics

import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.ui.designsystem.theme.UiState

data class StatsData(
    val stats: ProgressStats = ProgressStats(),
    val selectedPeriod: String = "Week",
    val periods: List<String> = listOf("Week", "Month", "Year")
)

typealias StatsUiState = UiState<StatsData>
