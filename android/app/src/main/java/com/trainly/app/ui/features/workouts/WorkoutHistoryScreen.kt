package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyFeedLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.utils.DateUtils
import com.trainly.app.viewmodel.WorkoutHistoryViewModel

@Composable
fun WorkoutHistoryScreen(
    onNavigateBack: () -> Unit,
    onWorkoutClick: (String) -> Unit,
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() },
    viewModel: WorkoutHistoryViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Workout History",
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
                    onRetry = { viewModel.load() },
                    modifier = Modifier.padding(padding)
                )
            }
            is UiState.Success -> {
                if (st.data.isEmpty()) {
                    TrainlyEmpty(
                        icon = "\uD83C\uDFC3",
                        title = "No workouts yet",
                        subtitle = "Start your fitness journey!"
                    )
                } else {
                    TrainlyFeedLayout(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(padding)
                    ) {
                        items(st.data) { workout ->
                            val icon = when (workout.type) {
                                "Running" -> "\uD83C\uDFC3"
                                "Cycling" -> "\uD83D\uDEB2"
                                "Swimming" -> "\uD83C\uDFCA"
                                "Gym" -> "\uD83C\uDFCB"
                                else -> "\uD83C\uDFC3"
                            }

                            com.trainly.app.ui.designsystem.cards.TrainlyListItemCard(
                                icon = icon,
                                title = workout.name ?: workout.type ?: "Workout",
                                subtitle = workout.createdAt?.let { DateUtils.formatTimeAgo(it) } ?: "",
                                trailing = workout.duration?.let { DateUtils.formatDurationSeconds(it) } ?: "--",
                                trailingLabel = "${workout.calories ?: 0} cal",
                                onClick = { workout.id?.let { onWorkoutClick(it) } }
                            )
                        }
                    }
                }
            }
        }
    }
}
