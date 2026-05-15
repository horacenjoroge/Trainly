package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.WorkoutDto
import com.trainly.app.ui.screens.training.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

@HiltViewModel
class TrackingViewModel @Inject constructor(private val api: ApiService) : ViewModel() {
    private val _s = MutableStateFlow(TrackingUiState()); val uiState: StateFlow<TrackingUiState> = _s.asStateFlow()
    private var timerJob: Job? = null; private var sessionId = ""; private var startTime = 0L; private var pausedDur = 0L; private var pauseStart = 0L
    fun initialize(t: String) { _s.value=_s.value.copy(activityType=t); sessionId="${t.lowercase()}_${System.currentTimeMillis()}_${UUID.randomUUID().toString().take(9)}" }
    fun startTracking() { if(_s.value.isActive)return; startTime=System.currentTimeMillis(); _s.value=_s.value.copy(isActive=true); timerJob=viewModelScope.launch { while(true){ delay(1000); val e=((System.currentTimeMillis()-startTime-pausedDur)/1000).toInt(); _s.value=_s.value.copy(durationSeconds=e, calories=((e/60)*5).coerceAtLeast(0)) } } }
    fun pauseTracking() { if(!_s.value.isActive||_s.value.isPaused)return; pauseStart=System.currentTimeMillis(); _s.value=_s.value.copy(isPaused=true) }
    fun resumeTracking() { if(!_s.value.isActive||!_s.value.isPaused)return; pausedDur+=System.currentTimeMillis()-pauseStart; _s.value=_s.value.copy(isPaused=false) }
    fun stopTracking() { timerJob?.cancel(); timerJob=null; _s.value=_s.value.copy(isActive=false, isPaused=false) }
    fun updateGpsPoint(p: GpsCoordinate) { val pts=_s.value.gpsPoints.toMutableList(); val last=pts.lastOrNull(); val nd=if(last!=null)_s.value.distance+calculateDistance(last, p) else 0.0; pts.add(p); _s.value=_s.value.copy(gpsPoints=pts, currentLocation=p, distance=nd) }
    fun recordSplit() { _s.value=_s.value.copy(splitCount=_s.value.splitCount+1) }
    fun saveWorkout(onSuccess:()->Unit, onError:(String)->Unit) { viewModelScope.launch { val s=_s.value; _s.value=s.copy(isFinishing=true); when(api.createWorkout(WorkoutDto(type=s.activityType, name="${s.activityType} Session", duration=s.durationSeconds, calories=s.calories, distance=s.distance, sessionId=sessionId, privacy="public"))){ is NetworkResult.Success -> { stopTracking(); onSuccess() }; is NetworkResult.Error -> { _s.value=_s.value.copy(isFinishing=false); onError(it.error.message) }; else -> {} } } }
    override fun onCleared() { super.onCleared(); timerJob?.cancel() }
}
