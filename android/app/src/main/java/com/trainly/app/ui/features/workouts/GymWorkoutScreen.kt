package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.TrackingViewModel

private val GymBg = Color(0xFFFBFBF9)
private val GymFg = Color(0xFF1C293C)
private val GymMuted = Color(0xFF5A6B7E)
private val GymAccent = Color(0xFFFDC800)
private val GymDanger = Color(0xFFDC2626)
private val GymBorderW = 3.dp
private val GymShadow = 4.dp
data class GymSet(
    val reps: Int,
    val weight: Double,
    val completed: Boolean = false
)

data class GymExercise(
    val name: String,
    val muscleGroup: String,
    val sets: List<GymSet> = emptyList()
)

@Composable
fun GymWorkoutScreen(
    onBack: () -> Unit,
    vm: TrackingViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    var exercises by remember { mutableStateOf<List<GymExercise>>(emptyList()) }
    var showAddDialog by remember { mutableStateOf(false) }
    var showEndConfirm by remember { mutableStateOf(false) }
    var showAddSetForExercise by remember { mutableStateOf(-1) }
    var showCompleteConfirm by remember { mutableStateOf(-1) }

    LaunchedEffect(Unit) {
        vm.initialize("Gym")
        vm.startTracking()
    }

    val formatShortDuration: (Int) -> String = { totalSecs ->
        val m = totalSecs / 60
        val s = totalSecs % 60
        "%02d:%02d".format(m, s)
    }

    Box(modifier = Modifier.fillMaxSize().background(GymBg)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GymBg)
                    .border(GymBorderW, GymFg)
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "\uD83C\uDFCB\uFE0F Gym Session",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = GymFg,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = formatShortDuration(state.durationSeconds),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                    color = GymMuted
                )
            }

            LazyColumn(
                modifier = Modifier.weight(1f).padding(Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                item {
                    DashedAddButton(onClick = { showAddDialog = true })
                }

                itemsIndexed(exercises) { idx, exercise ->
                    GymExerciseCard(
                        index = idx,
                        exercise = exercise,
                        onAddSet = { showAddSetForExercise = idx },
                        onCompleteAll = {
                            exercises = exercises.mapIndexed { i, ex ->
                                if (i == idx) ex.copy(
                                    sets = ex.sets.map { s -> s.copy(completed = true) }
                                ) else ex
                            }
                        },
                        onToggleSet = { setIdx ->
                            exercises = exercises.mapIndexed { i, ex ->
                                if (i == idx) ex.copy(
                                    sets = ex.sets.mapIndexed { j, s ->
                                        if (j == setIdx) s.copy(completed = !s.completed) else s
                                    }
                                ) else ex
                            }
                        }
                    )
                }

                item { Spacer(Modifier.height(Spacing.sm)) }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.lg),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                GymCtaButton(
                    text = "End",
                    bg = GymDanger,
                    textColor = Color.White,
                    borderColor = GymDanger,
                    onClick = { showEndConfirm = true },
                    modifier = Modifier.weight(1f)
                )
                GymCtaButton(
                    text = "Finish Workout",
                    bg = GymAccent,
                    textColor = GymFg,
                    onClick = {
                        vm.stopTracking()
                        vm.saveWorkout(onSuccess = onBack, onError = {})
                    },
                    modifier = Modifier.weight(2f)
                )
            }
        }
    }

    if (showAddDialog) {
        AddExerciseDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { name, group ->
                exercises = exercises + GymExercise(name, group)
                showAddDialog = false
            }
        )
    }

    if (showEndConfirm) {
        ConfirmEndDialog(
            onDismiss = { showEndConfirm = false },
            onConfirm = {
                showEndConfirm = false
                vm.stopTracking()
                onBack()
            }
        )
    }

    if (showAddSetForExercise >= 0) {
        AddSetDialog(
            onDismiss = { showAddSetForExercise = -1 },
            onAdd = { reps, weight ->
                exercises = exercises.mapIndexed { i, ex ->
                    if (i == showAddSetForExercise) ex.copy(
                        sets = ex.sets + GymSet(reps, weight)
                    ) else ex
                }
                showAddSetForExercise = -1
            }
        )
    }
}

@Composable
private fun DashedAddButton(onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .border(3.dp, GymFg)
            .clickable { onClick() }
            .padding(vertical = 16.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = "+",
                fontSize = 20.sp,
                fontWeight = FontWeight.Light,
                color = GymMuted
            )
            Spacer(Modifier.width(8.dp))
            Text(
                text = "Add Exercise",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = GymMuted
            )
        }
    }
}

@Composable
private fun GymExerciseCard(
    index: Int,
    exercise: GymExercise,
    onAddSet: () -> Unit,
    onCompleteAll: () -> Unit,
    onToggleSet: (Int) -> Unit
) {
    Box(modifier = Modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = GymShadow, y = GymShadow)
                .background(GymFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(GymBg)
                .border(GymBorderW, GymFg)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(2.dp, GymFg)
                    .padding(horizontal = Spacing.md, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .border(2.dp, GymFg)
                        .background(GymAccent),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${index + 1}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = GymFg
                    )
                }
                Spacer(Modifier.width(8.dp))
                Text(
                    text = exercise.name,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = GymFg,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = "\u22EF",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = GymMuted
                )
            }

            Column(modifier = Modifier.padding(horizontal = Spacing.md)) {
                exercise.sets.forEachIndexed { setIdx, set ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, GymFg.copy(alpha = 0.3f))
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${setIdx + 1}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = GymMuted,
                            modifier = Modifier.width(36.dp)
                        )
                        Text(
                            text = if (set.weight > 0) "%.0f kg".format(set.weight) else "BW",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Black,
                            color = GymFg,
                            modifier = Modifier.weight(1f)
                        )
                        Text(
                            text = "${set.reps} reps",
                            fontSize = 13.sp,
                            color = GymMuted,
                            modifier = Modifier.weight(1f)
                        )
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .border(2.dp, GymFg)
                                .background(if (set.completed) GymAccent else Color.Transparent)
                                .clickable { onToggleSet(setIdx) },
                            contentAlignment = Alignment.Center
                        ) {
                            if (set.completed) {
                                Text(
                                    text = "\u2713",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = GymFg
                                )
                            }
                        }
                    }
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(2.dp, GymFg)
                    .padding(horizontal = Spacing.md, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                GymFootButton(text = "+ Set", onClick = onAddSet, modifier = Modifier.weight(1f))
                GymFootButton(text = "Complete", onClick = onCompleteAll, modifier = Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun GymFootButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .border(2.dp, GymFg)
            .clickable { onClick() }
            .padding(vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = GymFg
        )
    }
}

@Composable
private fun GymCtaButton(
    text: String,
    bg: Color,
    textColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    borderColor: Color = GymFg
) {
    Box(modifier = modifier.clickable { onClick() }) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .offset(x = GymShadow, y = GymShadow)
                .background(GymFg)
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(bg)
                .border(GymBorderW, borderColor)
                .padding(vertical = 16.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                color = textColor
            )
        }
    }
}

@Composable
private fun OverlayDialog(
    onDismiss: () -> Unit,
    content: @Composable () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0x99000000))
            .clickable(onClick = onDismiss),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .clickable(enabled = false) {}
        ) {
            content()
        }
    }
}

@Composable
private fun AddExerciseDialog(
    onDismiss: () -> Unit,
    onAdd: (name: String, muscleGroup: String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var group by remember { mutableStateOf("Chest") }
    val groups = listOf("Chest", "Back", "Legs", "Shoulders", "Arms", "Core")

    OverlayDialog(onDismiss = onDismiss) {
        Column(
            modifier = Modifier
                .border(4.dp, GymFg)
                .background(GymBg)
                .padding(Spacing.xl)
        ) {
            Text(
                text = "Add Exercise",
                fontSize = 21.sp,
                fontWeight = FontWeight.Black,
                color = GymFg
            )
            Spacer(Modifier.height(Spacing.lg))
            BasicTextField(
                value = name,
                onValueChange = { name = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .border(GymBorderW, GymFg)
                    .background(GymBg)
                    .padding(Spacing.md),
                textStyle = androidx.compose.ui.text.TextStyle(
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = GymFg
                ),
                cursorBrush = SolidColor(GymFg),
                decorationBox = { innerTextField ->
                    Box {
                        if (name.isEmpty()) {
                            Text(
                                "Exercise name",
                                fontSize = 15.sp,
                                color = GymMuted,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        innerTextField()
                    }
                }
            )
            Spacer(Modifier.height(Spacing.md))
            Text(
                text = "Muscle Group",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = GymMuted
            )
            Spacer(Modifier.height(Spacing.sm))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                groups.take(3).forEach { g ->
                    GroupChip(selected = group == g, label = g, onClick = { group = g })
                }
            }
            Spacer(Modifier.height(Spacing.sm))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                groups.drop(3).forEach { g ->
                    GroupChip(selected = group == g, label = g, onClick = { group = g })
                }
            }
            Spacer(Modifier.height(Spacing.xl))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                DialogButton(text = "Cancel", bg = GymBg, onClick = onDismiss, modifier = Modifier.weight(1f))
                DialogButton(
                    text = "Add",
                    bg = GymAccent,
                    onClick = { if (name.isNotBlank()) onAdd(name.trim(), group) },
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun AddSetDialog(
    onDismiss: () -> Unit,
    onAdd: (reps: Int, weight: Double) -> Unit
) {
    var repsText by remember { mutableStateOf("") }
    var weightText by remember { mutableStateOf("") }

    OverlayDialog(onDismiss = onDismiss) {
        Column(
            modifier = Modifier
                .border(4.dp, GymFg)
                .background(GymBg)
                .padding(Spacing.xl)
        ) {
            Text(
                text = "Add Set",
                fontSize = 21.sp,
                fontWeight = FontWeight.Black,
                color = GymFg
            )
            Spacer(Modifier.height(Spacing.lg))
            LabeledField(label = "Reps", value = repsText, onValueChange = { repsText = it })
            Spacer(Modifier.height(Spacing.md))
            LabeledField(label = "Weight (kg)", value = weightText, onValueChange = { weightText = it })
            Spacer(Modifier.height(Spacing.xl))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                DialogButton(text = "Cancel", bg = GymBg, onClick = onDismiss, modifier = Modifier.weight(1f))
                DialogButton(
                    text = "Add",
                    bg = GymAccent,
                    onClick = {
                        val reps = repsText.toIntOrNull()
                        val weight = weightText.toDoubleOrNull() ?: 0.0
                        if (reps != null && reps > 0) {
                            onAdd(reps, weight)
                        }
                    },
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun LabeledField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit
) {
    Column {
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = GymMuted
        )
        Spacer(Modifier.height(Spacing.xs))
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .border(GymBorderW, GymFg)
                .background(GymBg)
                .padding(Spacing.md),
            textStyle = androidx.compose.ui.text.TextStyle(
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = GymFg
            ),
            cursorBrush = SolidColor(GymFg),
            decorationBox = { innerTextField ->
                Box {
                    if (value.isEmpty()) {
                        Text(
                            label,
                            fontSize = 15.sp,
                            color = GymMuted,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    innerTextField()
                }
            }
        )
    }
}

@Composable
private fun GroupChip(
    selected: Boolean,
    label: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .border(2.dp, GymFg)
            .background(if (selected) GymAccent else GymBg)
            .clickable { onClick() }
            .padding(horizontal = Spacing.md, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = GymFg
        )
    }
}

@Composable
private fun ConfirmEndDialog(
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    OverlayDialog(onDismiss = onDismiss) {
        Column(
            modifier = Modifier
                .border(4.dp, GymFg)
                .background(GymBg)
                .padding(Spacing.xl)
        ) {
            Text(
                text = "End Workout?",
                fontSize = 21.sp,
                fontWeight = FontWeight.Black,
                color = GymFg
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "This will discard your session. Are you sure?",
                fontSize = 14.sp,
                lineHeight = 21.sp,
                color = GymMuted
            )
            Spacer(Modifier.height(Spacing.lg))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                DialogButton(text = "Cancel", bg = GymBg, onClick = onDismiss, modifier = Modifier.weight(1f))
                DialogButton(text = "End", bg = GymDanger, textColor = Color.White, onClick = onConfirm, modifier = Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun DialogButton(
    text: String,
    bg: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    textColor: Color = GymFg
) {
    Box(modifier = modifier.clickable { onClick() }) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .offset(x = 3.dp, y = 3.dp)
                .background(GymFg)
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(bg)
                .border(3.dp, GymFg)
                .padding(vertical = Spacing.md),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                fontSize = 14.sp,
                fontWeight = FontWeight.Black,
                color = textColor
            )
        }
    }
}

@Preview
@Composable
private fun GymWorkoutScreenPreview() {
    TrainlyTheme { GymWorkoutScreen(onBack = {}) }
}
