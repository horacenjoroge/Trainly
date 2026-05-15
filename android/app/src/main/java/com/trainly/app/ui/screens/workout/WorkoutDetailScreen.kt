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
class WorkoutDetailViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {
    private val _s = MutableStateFlow<WDUiState>(WDUiState.Loading)
    val uiState: StateFlow<WDUiState> = _s.asStateFlow()

    fun load(id: String) {
        viewModelScope.launch {
            _s.value = WDUiState.Loading
            when (val r = api.getWorkout(id)) {
                is NetworkResult.Success -> _s.value = WDUiState.Success(r.data)
                is NetworkResult.Error -> _s.value = WDUiState.Error(r.error.message)
                is NetworkResult.Loading -> { }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkoutDetailScreen(
    onNavigateBack: () -> Unit,
    viewModel: WorkoutDetailViewModel = hiltViewModel()
) {
    val s by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Workout Details", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } }
            )
        }
    ) { padding ->
        when (val st = s) {
            is WDUiState.Loading -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            is WDUiState.Error -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { Text(st.message, color = MaterialTheme.colorScheme.error) }
            is WDUiState.Success -> {
                Column(Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(16.dp)) {
                    Text(st.workout.type ?: "Workout", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(16.dp))
                    Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                        Column(Modifier.padding(16.dp)) {
                            DetailRow("\u23F1", "Duration", st.workout.duration?.let { DateUtils.formatDurationSeconds(it) } ?: "--")
                            DetailRow("\uD83D\uDD25", "Calories", "${st.workout.calories ?: 0}")
                            DetailRow("\uD83D\uDCC5", "Date", DateUtils.formatTimeAgo(st.workout.createdAt))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DetailRow(icon: String, label: String, value: String) {
    Row(Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(icon); Spacer(Modifier.width(8.dp))
        Text(label, Modifier.weight(1f), color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontWeight = FontWeight.SemiBold)
    }
}
