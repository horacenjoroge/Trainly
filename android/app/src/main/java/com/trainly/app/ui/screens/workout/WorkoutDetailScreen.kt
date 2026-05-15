package com.trainly.app.ui.screens.workout

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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

sealed class WDUiState {
    data object Loading : WDUiState()
    data class Success(val workout: WorkoutDto) : WDUiState()
    data class Error(val message: String) : WDUiState()
}

@HiltViewModel
class WorkoutDetailViewModel @Inject constructor(private val api: ApiService) : ViewModel() {
    private val _s = MutableStateFlow<WDUiState>(WDUiState.Loading); val uiState: StateFlow<WDUiState> = _s.asStateFlow()
    fun load(id: String) { viewModelScope.launch { _s.value = WDUiState.Loading; when (val r = api.getWorkout(id)) { is NetworkResult.Success -> _s.value = WDUiState.Success(r.data); is NetworkResult.Error -> _s.value = WDUiState.Error(r.error.message); else -> {} } } }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkoutDetailScreen(onNavigateBack: () -> Unit, viewModel: WorkoutDetailViewModel = hiltViewModel()) {
    val s by viewModel.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar = { TopAppBar(title = { Text("Workout Details", fontWeight = FontWeight.Bold) }, navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } }, colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)) }) { padding ->
        when (val st = s) {
            is WDUiState.Loading -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            is WDUiState.Error -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { Text(st.message, color = MaterialTheme.colorScheme.error) }
            is WDUiState.Success -> Column(Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(16.dp)) {
                val w = st.workout
                Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)) {
                    Column(Modifier.fillMaxWidth().padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        val icon = when (w.type) { "Running" -> "\uD83C\uDFC3"; "Cycling" -> "\uD83D\uDEB2"; "Swimming" -> "\uD83C\uDFCA"; "Gym" -> "\uD83C\uDFCB"; else -> "\uD83C\uDFC3" }
                        Text(icon, style = MaterialTheme.typography.displayMedium)
                        Spacer(Modifier.height(8.dp))
                        Text(w.name ?: w.type ?: "Workout", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        Text(DateUtils.formatTimeAgo(w.createdAt), style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f))
                    }
                }
                Spacer(Modifier.height(16.dp))
                Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Summary", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        Spacer(Modifier.height(12.dp))
                        Row(Modifier.fillMaxWidth()) {
                            DetailItem("\u23F1", "Duration", w.duration?.let { DateUtils.formatDurationSeconds(it) } ?: "--")
                            DetailItem("\uD83D\uDD25", "Calories", "${w.calories ?: 0}")
                        }
                        if (w.distance != null && w.distance!! > 0) { Spacer(Modifier.height(8.dp)); Row(Modifier.fillMaxWidth()) { DetailItem("\uD83D\uDCCD", "Distance", formatDist(w.distance!!)); DetailItem("\uD83D\uDCC5", "Date", DateUtils.formatDate(w.createdAt)) } }
                    }
                }
                if (w.notes != null) { Spacer(Modifier.height(12.dp)); Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) { Column(Modifier.padding(16.dp)) { Text("Notes", fontWeight = FontWeight.Bold); Spacer(Modifier.height(4.dp)); Text(w.notes!!, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant) } } }
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}

@Composable private fun DetailItem(icon: String, label: String, value: String) {
    Column(Modifier.padding(8.dp)) {
        Text("$icon $label", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.titleSmall)
    }
}

private fun formatDist(m: Double): String = if (m >= 1000) "%.2f km".format(m / 1000) else "${m.toInt()} m"
