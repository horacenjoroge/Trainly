package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant
import com.trainly.app.ui.designsystem.components.indicators.TrainlyChip
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.dialogs.TrainlyFormDialog
import com.trainly.app.ui.designsystem.layouts.TrainlyTrackingControls
import com.trainly.app.ui.designsystem.layouts.TrainlyTrackingLayout
import com.trainly.app.ui.designsystem.theme.ContentPadding
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.features.workouts.formatDuration
import com.trainly.app.viewmodel.TrackingViewModel

data class GymExercise(
    val name: String,
    val muscleGroup: String,
    val sets: MutableList<GymSet> = mutableListOf()
)
data class GymSet(val reps: Int, val weight: Double)

@Composable
fun GymWorkoutScreen(
    onBack: () -> Unit,
    vm: TrackingViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    var exercises by remember { mutableStateOf<List<GymExercise>>(emptyList()) }
    var showDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) { vm.initialize("Gym") }

    Box(modifier = Modifier.fillMaxSize()) {
        TrainlyTrackingLayout(
            topContent = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.lg),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Gym Workout",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(Modifier.height(Spacing.sm))
                    Text(
                        text = formatDuration(state.durationSeconds),
                        style = MaterialTheme.typography.displayLarge,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                        color = if (state.isPaused) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.onSurface
                    )
                }
            },
            mapContent = {
                if (exercises.isEmpty()) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "\uD83C\uDFCB\uFE0F",
                                style = MaterialTheme.typography.displayLarge
                            )
                            Spacer(Modifier.height(Spacing.md))
                            Text(
                                text = "Add exercises",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(Spacing.lg),
                        verticalArrangement = Arrangement.spacedBy(Spacing.md)
                    ) {
                        items(exercises) { exercise ->
                            TrainlyCard {
                                Column(modifier = Modifier.padding(ContentPadding.card)) {
                                    Text(
                                        text = exercise.name,
                                        fontWeight = FontWeight.Bold,
                                        style = MaterialTheme.typography.titleSmall
                                    )
                                    Text(
                                        text = exercise.muscleGroup,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    exercise.sets.forEachIndexed { index, set ->
                                        Text(
                                            text = "Set ${index + 1}: ${set.reps} reps @ ${set.weight}kg",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                    Spacer(Modifier.height(Spacing.sm))
                                    TrainlyButton(
                                        text = "+ Add Set",
                                        onClick = { },
                                        variant = TrainlyButtonVariant.OUTLINE
                                    )
                                }
                            }
                        }
                    }
                }
            },
            controlsContent = {
                TrainlyTrackingControls {
                    TrainlyButton(
                        text = if (!state.isActive) "Start"
                               else if (state.isPaused) "Resume"
                               else "Pause",
                        onClick = {
                            if (!state.isActive) vm.startTracking()
                            else if (state.isPaused) vm.resumeTracking()
                            else vm.pauseTracking()
                        },
                        modifier = Modifier.weight(1f),
                        variant = if (state.isActive && !state.isPaused) TrainlyButtonVariant.ERROR
                                  else TrainlyButtonVariant.PRIMARY
                    )
                    if (state.isActive) {
                        TrainlyButton(
                            text = "Finish",
                            onClick = { },
                            modifier = Modifier.weight(1f),
                            variant = TrainlyButtonVariant.SECONDARY
                        )
                    }
                }
            }
        )

        TrainlyButton(
            text = "+",
            onClick = { showDialog = true },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .size(56.dp)
                .padding(Spacing.md),
            variant = TrainlyButtonVariant.PRIMARY
        )
    }

    if (showDialog) {
        var exerciseName by remember { mutableStateOf("") }
        var muscleGroup by remember { mutableStateOf("Chest") }

        TrainlyFormDialog(
            title = "Add Exercise",
            onDismiss = { showDialog = false },
            onConfirm = {
                exercises = exercises + GymExercise(exerciseName, muscleGroup)
                showDialog = false
            },
            confirmText = "Add",
            confirmEnabled = exerciseName.isNotBlank()
        ) {
            Column {
                TrainlyTextField(
                    value = exerciseName,
                    onValueChange = { exerciseName = it },
                    label = "Name"
                )
                Spacer(Modifier.height(Spacing.md))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(Spacing.sm)
                ) {
                    listOf("Chest", "Back", "Legs").forEach { group ->
                        TrainlyChip(
                            selected = muscleGroup == group,
                            onClick = { muscleGroup = group }
                        ) {
                            Text(group, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }
        }
    }
}
