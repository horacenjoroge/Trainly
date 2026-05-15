package com.trainly.app.ui.screens.stats
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.components.*
import com.trainly.app.utils.DateUtils
import com.trainly.app.viewmodel.StatsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun StatsScreen(onBack:()->Unit, vm:StatsViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={ TopAppBar(title={Text("Workout Stats", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, colors=TopAppBarDefaults.topAppBarColors(containerColor=MaterialTheme.colorScheme.surface)) }){p->
        when(val st=s){ is StatsUiState.Loading -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
            is StatsUiState.Success -> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) {
                PeriodSelector(vm.getPeriods(), st.selectedPeriod, {vm.selectPeriod(it)})
                Row(Modifier.fillMaxWidth().padding(horizontal=16.dp), horizontalArrangement=Arrangement.spacedBy(8.dp)) { MetricsCard("🏋️","${st.stats.totalWorkouts}","Workouts", mod=Modifier.weight(1f)); MetricsCard("⏱",DateUtils.formatDuration(st.stats.totalDuration/60),"Time", mod=Modifier.weight(1f)) }
                Row(Modifier.fillMaxWidth().padding(horizontal=16.dp), horizontalArrangement=Arrangement.spacedBy(8.dp)) { MetricsCard("📍","${st.stats.totalDistance}","Distance", mod=Modifier.weight(1f)); MetricsCard("🔥","${st.stats.totalCalories}","Calories", mod=Modifier.weight(1f)) }
                WorkoutTypeChart(st.stats.activityBreakdown); ActivityTrendChart(st.stats.weeklyStats); GoalSection(st.stats)
            }
            is StatsUiState.Error -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text(st.message, color=MaterialTheme.colorScheme.error)}
        }
    }
}
