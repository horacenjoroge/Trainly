package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant
import com.trainly.app.ui.designsystem.dialogs.TrainlyConfirmDialog
import com.trainly.app.ui.designsystem.layouts.TrainlyTrackingControls
import com.trainly.app.ui.designsystem.layouts.TrainlyTrackingLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyTrackingStat
import com.trainly.app.ui.designsystem.layouts.TrainlyTrackingStats
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Elevation
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.features.workouts.formatDistance
import com.trainly.app.ui.features.workouts.formatDuration
import com.trainly.app.ui.features.workouts.formatPace
import com.trainly.app.viewmodel.TrackingViewModel

@Composable
fun RunningScreen(
    onBack: () -> Unit,
    vm: TrackingViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    var showSaveDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) { vm.initialize("Running") }

    TrainlyTrackingLayout(
        topContent = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.lg),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Running",
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
                if (state.isPaused) {
                    Text(
                        text = "PAUSED",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                        textAlign = TextAlign.Center
                    )
                }
            }
        },
        mapContent = {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                shape = RoundedCornerShape(Radii.card),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = Elevation.none),
                border = BorderStroke(BorderWidth.thin, MaterialTheme.colorScheme.outline)
            ) {
                if (state.gpsPoints.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "\uD83D\uDDFA\uFE0F Waiting for GPS...",
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                } else {
                    val pts = state.gpsPoints
                    val routeColor = MaterialTheme.colorScheme.primary
                    androidx.compose.foundation.Canvas(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .padding(Spacing.md)
                    ) {
                        val minLat = pts.minOf { it.latitude }
                        val maxLat = pts.maxOf { it.latitude }
                        val minLng = pts.minOf { it.longitude }
                        val maxLng = pts.maxOf { it.longitude }
                        val lr = (maxLat - minLat).coerceAtLeast(0.0001)
                        val lng = (maxLng - minLng).coerceAtLeast(0.0001)
                        val path = androidx.compose.ui.graphics.Path()
                        pts.forEachIndexed { i, pt ->
                            val x = ((pt.longitude - minLng) / lng * size.width).toFloat()
                            val y = ((1 - (pt.latitude - minLat) / lr) * size.height).toFloat()
                            if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
                        }
                        drawPath(
                            path,
                            routeColor,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(
                                3.dp.toPx(),
                                cap = androidx.compose.ui.graphics.StrokeCap.Round
                            )
                        )
                        val last = pts.last()
                        drawCircle(
                            routeColor,
                            6.dp.toPx(),
                            androidx.compose.ui.geometry.Offset(
                                ((last.longitude - minLng) / lng * size.width).toFloat(),
                                ((1 - (last.latitude - minLat) / lr) * size.height).toFloat()
                            )
                        )
                    }
                }
            }
        },
        statsContent = {
            TrainlyTrackingStats {
                TrainlyTrackingStat(
                    value = formatDistance(state.distance),
                    label = "Distance"
                )
                TrainlyTrackingStat(
                    value = formatPace(state.distance / 1000, state.durationSeconds),
                    label = "Pace"
                )
                TrainlyTrackingStat(
                    value = "${state.calories}",
                    label = "Calories"
                )
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
                        onClick = { showSaveDialog = true },
                        modifier = Modifier.weight(1f),
                        variant = TrainlyButtonVariant.SECONDARY
                    )
                    TrainlyButton(
                        text = "Split",
                        onClick = { vm.recordSplit() },
                        variant = TrainlyButtonVariant.OUTLINE
                    )
                }
            }
        }
    )

    if (showSaveDialog) {
        TrainlyConfirmDialog(
            title = "Save Workout",
            text = "You've completed ${formatDuration(state.durationSeconds)}. Save this session?",
            confirmText = "Save & End",
            onConfirm = {
                vm.saveWorkout(
                    onSuccess = onBack,
                    onError = {}
                )
                showSaveDialog = false
            },
            dismissText = "Cancel",
            onDismiss = { showSaveDialog = false }
        )
    }
}
