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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.utils.DateUtils
import com.trainly.app.viewmodel.WorkoutDetailViewModel

private val DtlBg = Color(0xFFFBFBF9)
private val DtlFg = Color(0xFF1C293C)
private val DtlMuted = Color(0xFF5A6B7E)
private val DtlAccent = Color(0xFFFDC800)
private val DtlBorderW = 3.dp
private val DtlShadow = 5.dp
@Composable
fun WorkoutDetailScreen(
    onNavigateBack: () -> Unit,
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() },
    viewModel: WorkoutDetailViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    Box(modifier = Modifier.fillMaxSize().background(DtlBg)) {
        when (val st = state) {
            is UiState.Loading -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Loading...", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = DtlMuted)
                }
            }
            is UiState.Error -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(st.message, fontSize = 15.sp, color = DtlMuted)
                    Spacer(Modifier.height(Spacing.md))
                    Box(
                        modifier = Modifier
                            .border(2.dp, DtlFg)
                            .clickable { viewModel.reload() }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                    ) {
                        Text("Retry", fontWeight = FontWeight.Bold, color = DtlFg)
                    }
                }
            }
            is UiState.Success -> {
                val workout = st.data
                WorkoutDetailContent(workout = workout, onNavigateBack = onNavigateBack)
            }
        }
    }
}

@Composable
private fun WorkoutDetailContent(
    workout: WorkoutDto,
    onNavigateBack: () -> Unit
) {
    val type = workout.type ?: ""
    val icon = when (type) {
        "Running" -> "\uD83C\uDFC3"
        "Cycling" -> "\uD83D\uDEB2"
        "Swimming" -> "\uD83C\uDFCA"
        "Gym" -> "\uD83C\uDFCB"
        else -> "\uD83C\uDFC3"
    }

    val distanceMeters = workout.distanceMeters()
    val distKm = distanceMeters / 1000.0
    val paceSec = workout.averagePaceSeconds()
    val speedKmh = workout.averageSpeedKmh()

    val dateLine = buildString {
        append(DateUtils.formatTimeAgo(workout.startTime ?: workout.createdAt))
        if (distKm > 0) {
            append(" · ${"%.1f".format(distKm)} km")
        }
    }

    val actualSplits = workout.running?.splits.orEmpty()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(DtlBg)
                .border(DtlBorderW, DtlFg)
                .padding(horizontal = Spacing.lg, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .border(2.dp, DtlFg)
                    .background(DtlBg)
                    .clickable { onNavigateBack() },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "\u2190",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = DtlFg
                )
            }
            Spacer(Modifier.width(Spacing.md))
            Text(
                text = "Workout Details",
                fontSize = 17.sp,
                fontWeight = FontWeight.Black,
                color = DtlFg
            )
        }

        Spacer(Modifier.height(Spacing.lg))

        Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .offset(x = 5.dp, y = 5.dp)
                    .background(DtlFg)
            )
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DtlAccent)
                    .border(DtlBorderW, DtlFg)
                    .padding(Spacing.xl),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(text = icon, fontSize = 40.sp)
                Spacer(Modifier.height(8.dp))
                Text(
                    text = workout.name ?: type,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = (-0.02).sp,
                    color = DtlFg
                )
                Spacer(Modifier.height(Spacing.sm))
                Text(
                    text = dateLine,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = DtlMuted
                )
                Spacer(Modifier.height(Spacing.lg))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    ActionButton(text = "\uD83D\uDCE4 Share", onClick = { })
                    ActionButton(text = "\u2B07 Export", onClick = { })
                }
            }
        }

        Spacer(Modifier.height(Spacing.lg))

        Column(modifier = Modifier.padding(horizontal = Spacing.lg)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MetricCard(
                    value = workout.duration?.let { DateUtils.formatDurationSeconds(it) } ?: "--",
                    label = "Duration",
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    value = "${"%.1f".format(distKm)}",
                    unit = "km",
                    label = "Distance",
                    modifier = Modifier.weight(1f)
                )
            }
            Spacer(Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MetricCard(
                    value = paceToDisplay(paceSec),
                    label = "Avg Pace",
                    modifier = Modifier.weight(1f),
                    accent = true
                )
                MetricCard(
                    value = "${workout.calories ?: 0}",
                    label = "Calories",
                    modifier = Modifier.weight(1f)
                )
            }
            if (type == "Running" || type == "Cycling") {
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MetricCard(
                        value = "--",
                        label = "Avg HR",
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        value = "--",
                        unit = "m",
                        label = "Elevation",
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        Spacer(Modifier.height(Spacing.lg))

        if (type == "Running" || type == "Cycling") {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Route",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = DtlFg,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = "View Full",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = DtlMuted
                )
            }

            Spacer(Modifier.height(Spacing.sm))

            Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .border(DtlBorderW, DtlFg)
                        .background(Color(0xFFF0F0F0)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (workout.hasRouteData()) "\uD83D\uDCCD GPS Route Available" else "\uD83D\uDCCD Route not available",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = DtlMuted
                    )
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .offset(x = 20.dp, y = 45.dp)
                            .size(80.dp)
                    ) { Box(Modifier.fillMaxSize().border(3.dp, DtlAccent)) }
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .offset(x = 40.dp, y = 70.dp)
                            .size(60.dp)
                    ) { Box(Modifier.fillMaxSize().border(3.dp, DtlAccent)) }
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .offset(x = 18.dp, y = 43.dp)
                            .size(8.dp)
                            .background(DtlAccent, shape = androidx.compose.foundation.shape.CircleShape)
                            .border(2.dp, DtlFg, shape = androidx.compose.foundation.shape.CircleShape)
                    )
                }
            }

            Spacer(Modifier.height(Spacing.lg))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Splits",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = DtlFg,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = paceToDisplay(paceSec),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = DtlMuted
                )
            }

            Spacer(Modifier.height(Spacing.sm))

            if (actualSplits.isNotEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = Spacing.lg),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    actualSplits.forEach { split ->
                        val label = split.number?.let { "KM $it" } ?: "Split"
                        val timeSec = split.time ?: 0
                        val paceSecVal = split.pace?.toInt() ?: 0
                        val timeStr = if (timeSec > 0) "${timeSec / 60}:${"%02d".format(timeSec % 60)}" else "\u2014"
                        val paceStr = if (paceSecVal > 0) "${paceSecVal / 60}:${"%02d".format(paceSecVal % 60)}" else "\u2014"
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(2.dp, DtlFg)
                                .background(DtlBg)
                                .padding(horizontal = Spacing.md, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = label,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = DtlMuted,
                                modifier = Modifier.width(50.dp)
                            )
                            Text(
                                text = timeStr,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                color = if (paceSecVal > 0 && paceSec != null && paceSecVal <= paceSec) Color(0xFF16A34A) else DtlFg,
                                modifier = Modifier.weight(1f)
                            )
                            Text(
                                text = paceStr,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = DtlMuted
                            )
                        }
                    }
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = Spacing.lg)
                        .border(2.dp, DtlFg)
                        .background(DtlBg)
                        .padding(Spacing.md)
                ) {
                    Text(
                        text = "No split data recorded for this workout.",
                        fontSize = 13.sp,
                        color = DtlMuted
                    )
                }
            }

            Spacer(Modifier.height(Spacing.lg))
        }

        if (workout.notes != null && workout.notes.isNotBlank()) {
            Spacer(Modifier.height(Spacing.sm))
            Text(
                text = "Notes",
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                color = DtlFg,
                modifier = Modifier.padding(horizontal = Spacing.lg)
            )
            Spacer(Modifier.height(Spacing.sm))
            Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .offset(x = 3.dp, y = 3.dp)
                        .background(DtlFg)
                )
                Text(
                    text = workout.notes,
                    fontSize = 14.sp,
                    color = DtlMuted,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DtlBg)
                        .border(2.dp, DtlFg)
                        .padding(Spacing.md)
                )
            }
            Spacer(Modifier.height(Spacing.lg))
        }

        Spacer(Modifier.height(Spacing.lg))
    }
}

@Composable
private fun MetricCard(
    value: String,
    label: String,
    modifier: Modifier = Modifier,
    unit: String? = null,
    accent: Boolean = false
) {
    Column(
        modifier = modifier
            .border(2.dp, DtlFg)
            .background(DtlBg)
            .padding(Spacing.lg),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(verticalAlignment = Alignment.Bottom) {
            Text(
                text = value,
                fontSize = 27.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-0.02).sp,
                color = if (accent) DtlAccent else DtlFg
            )
            if (unit != null) {
                Spacer(Modifier.width(2.dp))
                Text(
                    text = unit,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = DtlMuted
                )
            }
        }
        Spacer(Modifier.height(2.dp))
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.04.sp,
            color = DtlMuted
        )
    }
}

@Composable
private fun ActionButton(
    text: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .border(2.dp, DtlFg)
            .background(DtlBg)
            .clickable { onClick() }
            .padding(horizontal = Spacing.lg, vertical = 6.dp)
    ) {
        Text(
            text = text,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = DtlFg
        )
    }
}

@Preview
@Composable
private fun WorkoutDetailScreenPreview() {
    TrainlyTheme { WorkoutDetailScreen(onNavigateBack = {}) }
}
