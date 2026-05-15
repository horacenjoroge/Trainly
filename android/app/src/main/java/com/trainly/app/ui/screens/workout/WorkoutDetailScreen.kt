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

sealed class WDUiState{data object Loading:WDUiState();data class Success(val w:WorkoutDto):WDUiState();data class Error(val m:String):WDUiState()}
@HiltViewModel class WorkoutDetailViewModel @Inject constructor(private val api:ApiService):ViewModel(){private val _s=MutableStateFlow<WDUiState>(WDUiState.Loading);val uiState:StateFlow<WDUiState> = _s.asStateFlow();fun load(id:String){viewModelScope.launch{_s.value=WDUiState.Loading;when(api.getWorkout(id)){is NetworkResult.Success->_s.value=WDUiState.Success(it.data);is NetworkResult.Error->_s.value=WDUiState.Error(it.error.message);else->{}}}}}
@OptIn(ExperimentalMaterial3Api::class) @Composable fun WorkoutDetailScreen(onBack:()->Unit, vm:WorkoutDetailViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Workout Details")}, navigationIcon={IconButton(onClick=onBack){Text("←")}})})
    {p-> when(val st=s){is WDUiState.Loading->Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}; is WDUiState.Error->Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text(st.m)}
        is WDUiState.Success->Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState()).padding(16.dp)){ Text(st.w.type?:"Workout", fontWeight=FontWeight.Bold); Card(Modifier.fillMaxWidth().padding(top=16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) { Column(Modifier.padding(16.dp)) { WDtlRow("⏱","Duration",st.w.duration?.let{DateUtils.formatDurationSeconds(it)}?:"--"); WDtlRow("🔥","Calories","${st.w.calories?:0}"); WDtlRow("📅","Date",DateUtils.formatTimeAgo(st.w.createdAt)) } } } } }
}
@Composable private fun WDtlRow(i:String,l:String,v:String){Row(Modifier.fillMaxWidth().padding(vertical=6.dp), verticalAlignment=Alignment.CenterVertically){Text(i);Spacer(Modifier.width(8.dp));Text(l, Modifier.weight(1f), color=MaterialTheme.colorScheme.onSurfaceVariant);Text(v, fontWeight=FontWeight.SemiBold)}}
