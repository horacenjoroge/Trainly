package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyDetailItem
import com.trainly.app.ui.designsystem.layouts.TrainlyDetailLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyDetailSection
import com.trainly.app.ui.designsystem.layouts.TrainlyHeroCard
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.ContentPadding
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.utils.DateUtils
import com.trainly.app.viewmodel.WorkoutDetailViewModel

@Composable
fun WorkoutDetailScreen(
    onNavigateBack: () -> Unit,
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() },
    viewModel: WorkoutDetailViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Workout Details",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onNavigateBack,
        topBarStyle = TopBarStyle.DEFAULT,
        snackbarHostState = snackbarHostState
    ) { padding ->
        when (val st = state) {
            is UiState.Loading -> {
                TrainlyLoading(modifier = Modifier.padding(padding))
            }
            is UiState.Error -> {
                TrainlyError(
                    message = st.message,
                    modifier = Modifier.padding(padding)
                )
            }
            is UiState.Success -> {
                val workout = st.data

                val icon = when (workout.type) {
                    "Running" -> "\uD83C\uDFC3"
                    "Cycling" -> "\uD83D\uDEB2"
                    "Swimming" -> "\uD83C\uDFCA"
                    "Gym" -> "\uD83C\uDFCB"
                    else -> "\uD83C\uDFC3"
                }

                TrainlyDetailLayout {
                    TrainlyHeroCard(
                        icon = icon,
                        title = workout.name ?: workout.type ?: "Workout",
                        subtitle = DateUtils.formatTimeAgo(workout.createdAt)
                    )

                    TrainlyDetailSection(title = "Summary") {
                        Row(modifier = Modifier.fillMaxWidth()) {
                            TrainlyDetailItem(
                                icon = "\u23F1",
                                label = "Duration",
                                value = workout.duration?.let { DateUtils.formatDurationSeconds(it) } ?: "--",
                                modifier = Modifier.weight(1f)
                            )
                            TrainlyDetailItem(
                                icon = "\uD83D\uDD25",
                                label = "Calories",
                                value = "${workout.calories ?: 0}",
                                modifier = Modifier.weight(1f)
                            )
                        }
                        if (workout.distance != null && workout.distance > 0) {
                            Spacer(Modifier.height(Spacing.sm))
                            Row(modifier = Modifier.fillMaxWidth().padding(top = Spacing.xs)) {
                                TrainlyDetailItem(
                                    icon = "\uD83D\uDCCD",
                                    label = "Distance",
                                    value = workout.distance?.let { formatDistance(it) } ?: "--",
                                    modifier = Modifier.weight(1f)
                                )
                                TrainlyDetailItem(
                                    icon = "\uD83D\uDCC5",
                                    label = "Date",
                                    value = workout.createdAt?.let { DateUtils.formatDate(it) } ?: "--",
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }

                    if (workout.notes != null) {
                        TrainlyDetailSection(title = "Notes") {
                            Text(
                                text = workout.notes,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.padding(ContentPadding.card)
                            )
                        }
                    }
                }
            }
        }
    }
}

