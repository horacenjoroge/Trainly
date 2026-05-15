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
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.utils.DateUtils
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class WHUiState{data object Loading:WHUiState();data class Success(val w:List<WorkoutDto>):WHUiState();data class Error(val m:String):WHUiState()}
@HiltViewModel class WorkoutHistoryViewModel @Inject constructor(private val api:ApiService):ViewModel(){private val _s=MutableStateFlow<WHUiState>(WHUiState.Loading);val uiState:StateFlow<WHUiState> = _s.asStateFlow();init{load()};fun load(){viewModelScope.launch{_s.value=WHUiState.Loading;when(api.getWorkouts(mapOf("sortBy" to "createdAt","sortOrder" to "desc","limit" to "50"))){is NetworkResult.Success->_s.value=WHUiState.Success(it.data);is NetworkResult.Error->_s.value=WHUiState.Error(it.error.message);else->{}}}}}
@OptIn(ExperimentalMaterial3Api::class) @Composable fun WorkoutHistoryScreen(onBack:()->Unit, onClick:(String)->Unit, vm:WorkoutHistoryViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Workout History")}, navigationIcon={IconButton(onClick=onBack){Text("←")}})})
    {p-> when(val st=s){is WHUiState.Loading->Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}; is WHUiState.Error->Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text(st.m, color=MaterialTheme.colorScheme.error)}
        is WHUiState.Success-> if(st.w.isEmpty()) Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text("No workouts yet")} else LazyColumn(Modifier.fillMaxSize().padding(p), contentPadding=PaddingValues(16.dp)){ items(st.w){ Card(onClick={it.id?.let(onClick)}, Modifier.fillMaxWidth().padding(vertical=4.dp), shape=RoundedCornerShape(12.dp)) { Row(Modifier.padding(16.dp), verticalAlignment=Alignment.CenterVertically) { Text( when(it.type){"Running"->"🏃";"Cycling"->"🚴";"Swimming"->"🏊";"Gym"->"🏋️";else->"🏃"}, style=MaterialTheme.typography.titleLarge ); Spacer(Modifier.width(12.dp)); Column(Modifier.weight(1f)){Text(it.name?:it.type?:"Workout", fontWeight=FontWeight.Bold); Text(DateUtils.formatTimeAgo(it.createdAt), style=MaterialTheme.typography.bodySmall)}; Column(horizontalAlignment=Alignment.End){Text(it.duration?.let{DateUtils.formatDurationSeconds(it)}?:"--", fontWeight=FontWeight.SemiBold);Text("${it.calories?:0} cal", style=MaterialTheme.typography.bodySmall)} } } } } } }
}
