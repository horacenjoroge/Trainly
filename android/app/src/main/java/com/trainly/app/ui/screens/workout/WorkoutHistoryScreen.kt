package com.trainly.app.ui.screens.workout

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.utils.DateUtils
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class WHUiState {
    data object Loading : WHUiState()
    data class Success(val workouts: List<WorkoutDto>) : WHUiState()
    data class Error(val message: String) : WHUiState()
}

@HiltViewModel
class WorkoutHistoryViewModel @Inject constructor(private val api: ApiService) : ViewModel() {
    private val _s = MutableStateFlow<WHUiState>(WHUiState.Loading); val uiState: StateFlow<WHUiState> = _s.asStateFlow()
    init { load() }
    fun load() { viewModelScope.launch { _s.value = WHUiState.Loading; when (val r = api.getWorkouts(mapOf("sortBy" to "createdAt", "sortOrder" to "desc", "limit" to "50"))) { is NetworkResult.Success -> _s.value = WHUiState.Success(r.data); is NetworkResult.Error -> _s.value = WHUiState.Error(r.error.message); else -> {} } } }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkoutHistoryScreen(onNavigateBack: () -> Unit, onWorkoutClick: (String) -> Unit, viewModel: WorkoutHistoryViewModel = hiltViewModel()) {
    val s by viewModel.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar = { TopAppBar(title = { Text("Workout History", fontWeight = FontWeight.Bold) }, navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } }, colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)) }) { padding ->
        when (val st = s) {
            is WHUiState.Loading -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            is WHUiState.Error -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { Text(st.message, color = MaterialTheme.colorScheme.error) }
            is WHUiState.Success -> {
                if (st.workouts.isEmpty()) Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("\uD83C\uDFC3", style=MaterialTheme.typography.displayMedium); Text("No workouts yet", fontWeight=FontWeight.SemiBold); Text("Start your fitness journey!", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) } }
                else LazyColumn(Modifier.fillMaxSize().padding(padding), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(st.workouts, key = { it.id ?: it.hashCode().toString() }) { w ->
                        Card(onClick = { w.id?.let { onWorkoutClick(it) } }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), elevation = CardDefaults.cardElevation(1.dp)) {
                            Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                                Surface(shape = RoundedCornerShape(12.dp), color = MaterialTheme.colorScheme.primaryContainer, modifier = Modifier.size(48.dp)) {
                                    Box(contentAlignment = Alignment.Center) {
                                        val icon = when (w.type) { "Running" -> "\uD83C\uDFC3"; "Cycling" -> "\uD83D\uDEB2"; "Swimming" -> "\uD83C\uDFCA"; "Gym" -> "\uD83C\uDFCB"; else -> "\uD83C\uDFC3" }
                                        Text(icon, style = MaterialTheme.typography.titleLarge)
                                    }
                                }
                                Spacer(Modifier.width(12.dp))
                                Column(Modifier.weight(1f)) {
                                    Text(w.name ?: w.type ?: "Workout", fontWeight = FontWeight.Bold)
                                    Text(DateUtils.formatTimeAgo(w.createdAt), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    if (w.distance != null && w.distance!! > 0) Text(formatDist(w.distance!!), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary)
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text(w.duration?.let { DateUtils.formatDurationSeconds(it) } ?: "--", fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.titleSmall)
                                    Text("${w.calories ?: 0} cal", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun formatDist(m: Double): String = if (m >= 1000) "%.2f km".format(m / 1000) else "${m.toInt()} m"
