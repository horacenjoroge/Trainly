package com.trainly.app.ui.screens.stats
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.components.*
import com.trainly.app.utils.DateUtils
import com.trainly.app.viewmodel.StatsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun StatsScreen(onBack:()->Unit, vm:StatsViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={ TopAppBar(title={Text("Workout Stats", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("\u2190")}}, colors=TopAppBarDefaults.topAppBarColors(containerColor=MaterialTheme.colorScheme.surface)) }){p->
        when(val st=s){ is StatsUiState.Loading -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
            is StatsUiState.Success -> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) {
                Spacer(Modifier.height(8.dp))
                PeriodSelector(vm.getPeriods(), st.selectedPeriod, {vm.selectPeriod(it)})
                Spacer(Modifier.height(12.dp))
                Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(20.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.primaryContainer)) {
                    Column(Modifier.fillMaxWidth().padding(20.dp), horizontalAlignment=Alignment.CenterHorizontally) {
                        Text("Your Progress", style=MaterialTheme.typography.titleMedium, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.onPrimaryContainer)
                        Spacer(Modifier.height(12.dp))
                        Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceEvenly) {
                            Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("\uD83C\uDFC3", style=MaterialTheme.typography.titleLarge); Text("${st.stats.totalWorkouts}", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.headlineSmall); Text("Workouts", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha=0.7f)) }
                            Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("\u23F1", style=MaterialTheme.typography.titleLarge); Text(DateUtils.formatDuration(st.stats.totalDuration/60), fontWeight=FontWeight.Bold, style=MaterialTheme.typography.headlineSmall); Text("Total Time", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha=0.7f)) }
                        }
                    }
                }
                Spacer(Modifier.height(12.dp))
                Row(Modifier.fillMaxWidth().padding(horizontal=16.dp), horizontalArrangement=Arrangement.spacedBy(12.dp)) {
                    MetricsCard("\uD83D\uDCCD", formatDistance(st.stats.totalDistance), "Distance", mod=Modifier.weight(1f))
                    MetricsCard("\uD83D\uDD25", "${st.stats.totalCalories}", "Calories", mod=Modifier.weight(1f))
                }
                Spacer(Modifier.height(12.dp))
                Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Activity Breakdown", fontWeight=FontWeight.Bold); Spacer(Modifier.height(8.dp))
                        WorkoutTypeChart(st.stats.activityBreakdown)
                    }
                }
                Spacer(Modifier.height(12.dp))
                Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Weekly Trend", fontWeight=FontWeight.Bold); Spacer(Modifier.height(8.dp))
                        ActivityTrendChart(st.stats.weeklyStats)
                    }
                }
                Spacer(Modifier.height(12.dp))
                Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Goals", fontWeight=FontWeight.Bold); Spacer(Modifier.height(8.dp))
                        GoalSection(st.stats)
                    }
                }
                Spacer(Modifier.height(24.dp))
            }
            is StatsUiState.Error -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text(st.message, color=MaterialTheme.colorScheme.error)}
        }
    }
}

private fun formatDistance(m: Double): String = if (m >= 1000) "%.1fkm".format(m / 1000) else "${m.toInt()}m"
