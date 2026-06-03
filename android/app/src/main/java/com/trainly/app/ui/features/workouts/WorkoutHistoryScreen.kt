package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.trainly.app.viewmodel.WorkoutHistoryViewModel

private val HistBg = Color(0xFFFBFBF9)
private val HistFg = Color(0xFF1C293C)
private val HistMuted = Color(0xFF5A6B7E)
private val HistAccent = Color(0xFFFDC800)
private val HistBorderW = 3.dp
private val HistShadow = 4.dp

private data class WorkoutFilter(val value: String?, val label: String)

@Composable
fun WorkoutHistoryScreen(
    onNavigateBack: () -> Unit,
    onWorkoutClick: (String) -> Unit,
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() },
    viewModel: WorkoutHistoryViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    var selectedFilter by remember { mutableStateOf<String?>(null) }

    val filters = listOf(
        WorkoutFilter(null, "All"),
        WorkoutFilter("Running", "\uD83C\uDFC3 Running"),
        WorkoutFilter("Cycling", "\uD83D\uDEB2 Cycling"),
        WorkoutFilter("Swimming", "\uD83C\uDFCA Swimming"),
        WorkoutFilter("Gym", "\uD83C\uDFCB Gym")
    )

    Box(modifier = Modifier.fillMaxSize().background(HistBg)) {
        when (val st = state) {
            is UiState.Loading -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Loading...", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = HistMuted)
                }
            }
            is UiState.Error -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(st.message, fontSize = 15.sp, color = HistMuted)
                    Spacer(Modifier.height(Spacing.md))
                    Box(
                        modifier = Modifier
                            .border(2.dp, HistFg)
                            .clickable { viewModel.load() }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                    ) {
                        Text("Retry", fontWeight = FontWeight.Bold, color = HistFg)
                    }
                }
            }
            is UiState.Success -> {
                val filtered = selectedFilter?.let { type -> st.data.filter { it.type == type } } ?: st.data

                val totalCount = filtered.size
                val totalDurationSec = filtered.sumOf { it.duration ?: 0 }
                val totalCalories = filtered.sumOf { it.calories ?: 0 }

                Column(modifier = Modifier.fillMaxSize()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(HistBg)
                            .border(HistBorderW, HistFg)
                            .padding(horizontal = Spacing.lg, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .border(2.dp, HistFg)
                                .background(HistBg)
                                .clickable { onNavigateBack() },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "\u2190",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = HistFg
                            )
                        }
                        Spacer(Modifier.width(Spacing.md))
                        Text(
                            text = "Workout History",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = HistFg
                        )
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = Spacing.lg, vertical = Spacing.md),
                        horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                    ) {
                        SummaryCard(
                            value = "$totalCount",
                            label = "Total",
                            isAccent = true,
                            modifier = Modifier.weight(1f)
                        )
                        SummaryCard(
                            value = "${totalDurationSec / 3600}h",
                            label = "Duration",
                            modifier = Modifier.weight(1f)
                        )
                        val calDisplay = if (totalCalories >= 1000)
                            "${"%.1f".format(totalCalories / 1000.0)}k" else "$totalCalories"
                        SummaryCard(
                            value = calDisplay,
                            label = "Calories",
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState())
                            .padding(horizontal = Spacing.lg)
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            filters.forEach { filter ->
                                val isActive = selectedFilter == filter.value
                                Box(
                                    modifier = Modifier
                                        .border(2.dp, HistFg)
                                        .background(if (isActive) HistAccent else HistBg)
                                        .clickable {
                                            selectedFilter = filter.value
                                        }
                                        .padding(horizontal = Spacing.lg, vertical = 6.dp)
                                ) {
                                    Text(
                                        text = filter.label,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = HistFg
                                    )
                                }
                            }
                        }
                    }

                    Spacer(Modifier.height(Spacing.md))

                    if (filtered.isEmpty()) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = Spacing.xl, vertical = 48.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(text = "\uD83C\uDFC3", fontSize = 48.sp)
                            Spacer(Modifier.height(Spacing.md))
                            Text(
                                text = "No workouts yet",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Black,
                                color = HistFg
                            )
                            Spacer(Modifier.height(Spacing.sm))
                            Text(
                                text = "Start your fitness journey!",
                                fontSize = 13.sp,
                                color = HistMuted,
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(
                                horizontal = Spacing.lg,
                                vertical = 0.dp
                            ),
                            verticalArrangement = Arrangement.spacedBy(Spacing.md)
                        ) {
                            items(filtered) { workout ->
                                HistoryCard(
                                    workout = workout,
                                    onClick = { workout.id?.let { onWorkoutClick(it) } }
                                )
                            }
                            item { Spacer(Modifier.height(Spacing.lg)) }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SummaryCard(
    value: String,
    label: String,
    modifier: Modifier = Modifier,
    isAccent: Boolean = false
) {
    Box(modifier = modifier) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = HistShadow, y = HistShadow)
                .background(HistFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(HistBg)
                .border(HistBorderW, HistFg)
                .padding(Spacing.md),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                fontSize = 24.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-0.02).sp,
                color = if (isAccent) HistAccent else HistFg,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(2.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.04.sp,
                color = HistMuted
            )
        }
    }
}

@Composable
private fun HistoryCard(
    workout: WorkoutDto,
    onClick: () -> Unit
) {
    val type = workout.type ?: ""
    val icon = when (type) {
        "Running" -> "\uD83C\uDFC3"
        "Cycling" -> "\uD83D\uDEB2"
        "Swimming" -> "\uD83C\uDFCA"
        "Gym" -> "\uD83C\uDFCB"
        else -> "\uD83C\uDFC3"
    }
    val iconBg: Color? = when (type) {
        "Cycling" -> Color(0xFF432DD7)
        "Gym" -> Color(0xFF16A34A)
        else -> null
    }
    val iconTextColor: Color = when (type) {
        "Cycling", "Gym" -> Color.White
        else -> HistFg
    }

    val dateStr = (workout.startTime ?: workout.createdAt)?.let { DateUtils.formatTimeAgo(it) } ?: ""
    val durationStr = workout.duration?.let { DateUtils.formatDurationSeconds(it) } ?: "--"

    Box(modifier = Modifier.fillMaxWidth().clickable { onClick() }) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = HistShadow, y = HistShadow)
                .background(HistFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(HistBg)
                .border(HistBorderW, HistFg)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(2.dp, HistFg)
                    .padding(Spacing.md),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .border(2.dp, HistFg)
                        .then(if (iconBg != null) Modifier.background(iconBg) else Modifier.background(HistBg)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = icon, fontSize = 20.sp)
                }
                Spacer(Modifier.width(Spacing.md))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = workout.name ?: type,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Black,
                        color = HistFg
                    )
                    Text(
                        text = dateStr,
                        fontSize = 12.sp,
                        color = HistMuted
                    )
                }
                Text(
                    text = "\u2192",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = HistMuted
                )
            }

            Row(modifier = Modifier.fillMaxWidth()) {
                val distKm = workout.distanceMeters() / 1000.0
                val pace = workout.averagePaceSeconds()
                val speed = workout.averageSpeedKmh()

                val stats = when (type) {
                    "Running" -> listOf(
                        "${"%.1f".format(distKm)}" to "km",
                        durationStr to "min",
                        paceToDisplay(pace) to "/km",
                        "${workout.calories ?: 0}" to "kcal"
                    )
                    "Cycling" -> listOf(
                        "${"%.1f".format(distKm)}" to "km",
                        durationStr to "min",
                        speedToDisplay(speed ?: 0.0) to "km/h",
                        "${workout.calories ?: 0}" to "kcal"
                    )
                    "Swimming" -> listOf(
                        "--" to "laps",
                        durationStr to "min",
                        "${workout.distanceMeters().toInt()}" to "m",
                        "${workout.calories ?: 0}" to "kcal"
                    )
                    "Gym" -> listOf(
                        "--" to "exercises",
                        "--" to "sets",
                        durationStr to "min",
                        "${workout.calories ?: 0}" to "kcal"
                    )
                    else -> listOf(
                        "${"%.1f".format(distKm)}" to "km",
                        durationStr to "min",
                        "${workout.calories ?: 0}" to "kcal",
                        "" to ""
                    )
                }

                val visibleStats = stats.filter { it.second.isNotEmpty() }
                visibleStats.forEachIndexed { idx, (value, label) ->
                    HistoryStatCell(
                        value = value,
                        label = label,
                        modifier = Modifier.weight(1f)
                    )
                    if (idx < visibleStats.size - 1) {
                        Box(
                            modifier = Modifier
                                .width(2.dp)
                                .height(40.dp)
                                .background(HistFg)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun HistoryStatCell(
    value: String,
    label: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            fontSize = 15.sp,
            fontWeight = FontWeight.Black,
            color = HistFg,
            textAlign = TextAlign.Center
        )
        Text(
            text = label,
            fontSize = 9.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.04.sp,
            color = HistMuted,
            textAlign = TextAlign.Center
        )
    }
}

@Preview
@Composable
private fun WorkoutHistoryScreenPreview() {
    TrainlyTheme { WorkoutHistoryScreen(onNavigateBack = {}, onWorkoutClick = {}) }
}
