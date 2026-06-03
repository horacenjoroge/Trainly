package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.TrackingViewModel

@Composable
fun RunningScreen(
    onBack: () -> Unit,
    vm: TrackingViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    var showSaveDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) { vm.initialize("Running") }

    val distanceKm = state.distance / 1000.0

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(TrackBg)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TrackingTopBar(emoji = "\uD83C\uDFC3", title = "Running")

            Spacer(Modifier.height(24.dp))

            TrackerTimer(durationSeconds = state.durationSeconds, isPaused = state.isPaused)

            Spacer(Modifier.height(Spacing.lg))

            TrackerMapCard()

            Spacer(Modifier.height(Spacing.lg))

            val paceSec = if (distanceKm > 0 && state.durationSeconds > 0)
                (state.durationSeconds / distanceKm).toInt() else null

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                TrackingStatBox(
                    value = "%.1f".format(distanceKm),
                    unit = "km",
                    label = "DISTANCE",
                    isAccent = false,
                    modifier = Modifier.weight(1f)
                )
                TrackingStatBox(
                    value = paceToDisplay(paceSec),
                    unit = "/km",
                    label = "PACE",
                    isAccent = true,
                    modifier = Modifier.weight(1f)
                )
                TrackingStatBox(
                    value = "${state.calories}",
                    unit = "kcal",
                    label = "CALORIES",
                    isAccent = false,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(Modifier.weight(1f))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.lg),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md),
                verticalAlignment = Alignment.CenterVertically
            ) {
                val isRunning = state.isActive && !state.isPaused
                val btnText = if (!state.isActive) "\u25B6 Start"
                    else if (state.isPaused) "\u25B6 Resume" else "\u23F8 Pause"
                val btnBg = if (!state.isActive) TrackAccent
                    else if (state.isPaused) TrackSuccess else TrackAccent
                val btnTextColor = if (state.isPaused) TrackFg else Color(0xFF1C293C)

                TrackingCtaButton(
                    text = btnText, bg = btnBg, textColor = btnTextColor,
                    onClick = {
                        if (!state.isActive) vm.startTracking()
                        else if (state.isPaused) vm.resumeTracking()
                        else vm.pauseTracking()
                    },
                    enabled = !state.isFinishing,
                    modifier = Modifier.weight(2f)
                )
                TrackingCtaButton(
                    text = "Split", bg = Color.Transparent, textColor = TrackFg,
                    borderColor = TrackBorder, shadowColor = TrackBorder,
                    onClick = { vm.recordSplit() },
                    enabled = state.isActive && !state.isFinishing,
                    modifier = Modifier.weight(1f)
                )
                TrackingCtaButton(
                    text = "Finish", bg = TrackFg, textColor = Color(0xFF1C293C),
                    onClick = { showSaveDialog = true },
                    enabled = state.isActive && !state.isFinishing,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        if (showSaveDialog) {
            val paceStr = paceToDisplay(
                if (distanceKm > 0 && state.durationSeconds > 0)
                    (state.durationSeconds / distanceKm).toInt() else null
            )
            TrackingSaveDialog(
                summaryLine = "%.1f km in %s at %s pace. Save this workout to your history?"
                    .format(distanceKm, formatDuration(state.durationSeconds), paceStr),
                isSaving = state.isFinishing,
                onDiscard = { if (!state.isFinishing) showSaveDialog = false },
                onSave = {
                    vm.saveWorkout(onSuccess = onBack, onError = {})
                }
            )
        }

        state.error?.let { message ->
            TrackingErrorDialog(message = message, onDismiss = vm::clearError)
        }
    }
}

@Preview
@Composable
private fun RunningScreenPreview() {
    TrainlyTheme { RunningScreen(onBack = {}) }
}
