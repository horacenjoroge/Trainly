package com.trainly.app.ui.features.analytics

import androidx.compose.foundation.Canvas
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.domain.models.ActivityBreakdown
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.viewmodel.StatsViewModel

private val StBg = Color(0xFFFBFBF9)
private val StFg = Color(0xFF1C293C)
private val StMuted = Color(0xFF5A6B7E)
private val StAccent = Color(0xFFFDC800)
private val StBorderW = 3.dp
private val StShadow = 4.dp

private val BreakdownColors = mapOf(
    "Running" to StAccent,
    "Cycling" to Color(0xFF432DD7),
    "Swimming" to Color(0xFF16A34A),
    "Gym" to Color(0xFF5A6B7E)
)

private val periodLabels = listOf("7D", "30D", "90D", "1Y")
private val periodValues = listOf("week", "month", "year", "all")

private val dayOrder = mapOf(
    "Monday" to 0, "Tuesday" to 1, "Wednesday" to 2, "Thursday" to 3,
    "Friday" to 4, "Saturday" to 5, "Sunday" to 6
)

@Composable
fun StatsScreen(
    snackbarHostState: SnackbarHostState,
    onBack: () -> Unit,
    vm: StatsViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    Box(modifier = Modifier.fillMaxSize().background(StBg)) {
        when (val st = state) {
            is UiState.Loading -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Loading...", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = StMuted)
                }
            }
            is UiState.Error -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(st.message, fontSize = 15.sp, color = StMuted)
                    Spacer(Modifier.height(Spacing.md))
                    Box(
                        modifier = Modifier
                            .border(2.dp, StFg)
                            .background(StBg)
                            .clickable { vm.loadStats(periodValues.first()) }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                    ) {
                        Text("Retry", fontWeight = FontWeight.Bold, color = StFg)
                    }
                }
            }
            is UiState.Success -> {
                val data = st.data
                StatsContent(
                    stats = data.stats,
                    selectedPeriod = data.selectedPeriod,
                    onSelectPeriod = { vm.selectPeriod(it) },
                    onBack = onBack
                )
            }
        }
    }
}

@Composable
private fun StatsContent(
    stats: ProgressStats,
    selectedPeriod: String,
    onSelectPeriod: (String) -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(StBg)
                .border(StBorderW, StFg)
                .padding(horizontal = Spacing.lg, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .border(2.dp, StFg)
                    .background(StBg)
                    .clickable { onBack() },
                contentAlignment = Alignment.Center
            ) {
                Text("\u2190", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = StFg)
            }
            Spacer(Modifier.width(Spacing.md))
            Text(
                text = "\uD83D\uDCCA Workout Stats",
                fontSize = 17.sp,
                fontWeight = FontWeight.Black,
                color = StFg
            )
        }

        Spacer(Modifier.height(Spacing.md))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = Spacing.lg),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            periodLabels.forEachIndexed { idx, label ->
                val isActive = periodValues[idx] == selectedPeriod
                Box(
                    modifier = Modifier
                        .border(2.dp, StFg)
                        .background(if (isActive) StAccent else StBg)
                        .clickable { onSelectPeriod(periodValues[idx]) }
                        .padding(horizontal = Spacing.lg, vertical = 6.dp)
                ) {
                    Text(
                        text = label,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = StFg
                    )
                }
            }
        }

        Spacer(Modifier.height(Spacing.lg))

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MetricBlock(
                    value = "${stats.totalWorkouts}",
                    label = "Workouts",
                    isAccent = true,
                    modifier = Modifier.weight(1f)
                )
                val totalHours = stats.totalDuration / 3600.0
                val timeDisplay = if (totalHours >= 1)
                    "${"%.1f".format(totalHours)}<small>h</small>" else "${stats.totalDuration / 60}m"
                MetricBlock(
                    value = "${stats.totalDuration / 60}m",
                    label = "Total Time",
                    modifier = Modifier.weight(1f)
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val distKm = stats.totalDistance / 1000.0
                MetricBlock(
                    value = "${"%.1f".format(distKm)}",
                    unit = "km",
                    label = "Distance (km)",
                    modifier = Modifier.weight(1f)
                )
                MetricBlock(
                    value = "${stats.totalCalories}",
                    label = "Calories",
                    modifier = Modifier.weight(1f)
                )
            }
        }

        Spacer(Modifier.height(Spacing.lg))

        Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .offset(x = StShadow, y = StShadow)
                    .background(StFg)
            )
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(StBg)
                    .border(StBorderW, StFg)
                    .padding(Spacing.lg)
            ) {
                Text(
                    text = "Activity Breakdown",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = StFg
                )
                Spacer(Modifier.height(Spacing.md))

                val breakdown = stats.activityBreakdown
                val total = breakdown.sumOf { it.count }
                val sorted = breakdown.sortedByDescending { it.count }

                if (total > 0) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        DonutChart(
                            breakdown = sorted,
                            total = total,
                            modifier = Modifier.size(100.dp)
                        )
                        Spacer(Modifier.width(Spacing.xl))
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            sorted.forEach { item ->
                                val pct = item.count * 100 / total
                                val color = BreakdownColors[item.type] ?: StMuted
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(12.dp)
                                            .border(2.dp, StFg)
                                            .background(color)
                                    )
                                    Spacer(Modifier.width(8.dp))
                                    Text(
                                        text = "${item.type} ${pct}%",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = StFg
                                    )
                                }
                            }
                        }
                    }
                } else {
                    Text(
                        text = "No activity data yet",
                        fontSize = 13.sp,
                        color = StMuted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(vertical = Spacing.lg)
                    )
                }
            }
        }

        Spacer(Modifier.height(Spacing.lg))

        Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .offset(x = StShadow, y = StShadow)
                    .background(StFg)
            )
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(StBg)
                    .border(StBorderW, StFg)
                    .padding(Spacing.lg)
            ) {
                Text(
                    text = "Weekly Trend",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = StFg
                )
                Spacer(Modifier.height(Spacing.md))

                val weekly = stats.weeklyStats
                if (weekly.isNotEmpty()) {
                    val sortedWeekly = weekly.sortedBy { dayOrder[it.week] ?: 99 }
                    val maxVal = sortedWeekly.maxOf { it.workouts }.coerceAtLeast(1)

                    Row(
                        modifier = Modifier.fillMaxWidth().height(140.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.Bottom
                    ) {
                        sortedWeekly.forEach { day ->
                            val fraction = day.workouts.toFloat() / maxVal
                            val barH = (fraction * 100).coerceAtLeast(4f)
                            Column(
                                modifier = Modifier.weight(1f),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Bottom
                            ) {
                                Text(
                                    text = "${day.workouts}",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    color = StFg
                                )
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(barH.dp)
                                        .background(StAccent)
                                        .border(1.dp, StFg)
                                )
                                Text(
                                    text = day.week.take(3),
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = StMuted
                                )
                            }
                        }
                    }
                } else {
                    Text(
                        text = "No weekly data yet",
                        fontSize = 13.sp,
                        color = StMuted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(vertical = Spacing.lg)
                    )
                }
            }
        }

        Spacer(Modifier.height(Spacing.lg))

        Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .offset(x = StShadow, y = StShadow)
                    .background(StFg)
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(StBg)
                    .border(StBorderW, StFg)
                    .padding(Spacing.lg),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                FooterItem(value = "--", label = "Best Streak")
                FooterItem(value = "--", label = "PB\u2019s")
                FooterItem(value = "--", label = "Rank")
            }
        }

        Spacer(Modifier.height(Spacing.xl))
    }
}

@Composable
private fun MetricBlock(
    value: String,
    label: String,
    modifier: Modifier = Modifier,
    unit: String? = null,
    isAccent: Boolean = false
) {
    Box(modifier = modifier) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .offset(x = StShadow, y = StShadow)
                .background(StFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(StBg)
                .border(StBorderW, StFg)
                .padding(Spacing.lg),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = value,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = (-0.03).sp,
                    lineHeight = 32.sp,
                    color = if (isAccent) StAccent else StFg
                )
                if (unit != null) {
                    Spacer(Modifier.width(2.dp))
                    Text(
                        text = unit,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = StMuted
                    )
                }
            }
            Spacer(Modifier.height(4.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.04.sp,
                color = StMuted
            )
        }
    }
}

@Composable
private fun DonutChart(
    breakdown: List<ActivityBreakdown>,
    total: Int,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeW = 8.dp.toPx()
            val radius = (size.minDimension - strokeW) / 2f
            val topLeft = Offset(
                (size.width - radius * 2) / 2f,
                (size.height - radius * 2) / 2f
            )
            val arcSize = Size(radius * 2, radius * 2)

            var startAngle = -90f
            breakdown.forEach { item ->
                val sweep = (item.count.toFloat() / total) * 360f
                drawArc(
                    color = BreakdownColors[item.type] ?: StMuted,
                    startAngle = startAngle,
                    sweepAngle = sweep,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(width = strokeW)
                )
                startAngle += sweep
            }
            drawCircle(
                color = StFg,
                radius = strokeW / 2f,
                center = Offset(size.width / 2f, size.height / 2f)
            )
        }
        Box(
            modifier = Modifier
                .background(StBg)
                .border(2.dp, StFg)
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(
                text = "$total",
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                color = StFg
            )
        }
    }
}

@Composable
private fun FooterItem(
    value: String,
    label: String
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            fontSize = 17.sp,
            fontWeight = FontWeight.Black,
            color = StFg
        )
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.04.sp,
            color = StMuted
        )
    }
}

@Preview
@Composable
private fun StatsScreenPreview() {
    TrainlyTheme { StatsScreen(snackbarHostState = SnackbarHostState(), onBack = {}) }
}
