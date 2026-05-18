package com.trainly.app.ui.features.analytics

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.cards.TrainlyMetricCard
import com.trainly.app.ui.designsystem.cards.TrainlySectionCard
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.components.indicators.TrainlyChip
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyAnalyticsLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyFilterRow
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.utils.DateUtils
import com.trainly.app.viewmodel.StatsViewModel

@Composable
fun StatsScreen(
    snackbarHostState: SnackbarHostState,
    onBack: () -> Unit,
    vm: StatsViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Workout Stats",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onBack,
        topBarStyle = TopBarStyle.DEFAULT,
        snackbarHostState = snackbarHostState
    ) { padding ->
        when (val st = state) {
            is UiState.Loading -> {
                TrainlyLoading(modifier = Modifier.padding(padding))
            }
            is UiState.Success -> {
                val data = st.data
                TrainlyAnalyticsLayout(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    filterContent = {
                        val periods = vm.getPeriods()
                        TrainlyFilterRow {
                            periods.forEach { period ->
                                TrainlyChip(
                                    selected = data.selectedPeriod == period,
                                    onClick = { vm.selectPeriod(period) }
                                ) {
                                    Text(
                                        text = period,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                        }
                    }
                ) {
                    TrainlySectionCard(title = "Your Progress") {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.SpaceEvenly
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "\uD83C\uDFC3",
                                    style = MaterialTheme.typography.titleLarge
                                )
                                Text(
                                    text = "${data.stats.totalWorkouts}",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.headlineSmall,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "Workouts",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "\u23F1",
                                    style = MaterialTheme.typography.titleLarge
                                )
                                Text(
                                    text = DateUtils.formatDuration(data.stats.totalDuration / 60),
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.headlineSmall,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "Total Time",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(Spacing.md)
                    ) {
                        TrainlyMetricCard(
                            icon = "\uD83D\uDCCD",
                            value = formatDistance(data.stats.totalDistance),
                            label = "Distance",
                            modifier = Modifier.weight(1f)
                        )
                        TrainlyMetricCard(
                            icon = "\uD83D\uDD25",
                            value = "${data.stats.totalCalories}",
                            label = "Calories",
                            modifier = Modifier.weight(1f)
                        )
                    }

                    TrainlySectionCard(title = "Activity Breakdown") {
                        Text(
                            text = "Chart placeholder",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    TrainlySectionCard(title = "Weekly Trend") {
                        Text(
                            text = "Trend chart placeholder",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            is UiState.Error -> {
                TrainlyError(
                    message = st.message,
                    onRetry = { vm.loadStats(vm.getPeriods().first()) },
                    modifier = Modifier.padding(padding)
                )
            }
        }
    }
}

private fun formatDistance(m: Double): String {
    return if (m >= 1000) "%.1fkm".format(m / 1000) else "${m.toInt()}m"
}
