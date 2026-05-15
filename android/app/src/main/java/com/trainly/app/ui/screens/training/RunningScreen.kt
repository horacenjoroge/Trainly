package com.trainly.app.ui.screens.training
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.components.*
import com.trainly.app.viewmodel.TrackingViewModel

@Composable fun RunningScreen(onBack:()->Unit, vm:TrackingViewModel= hiltViewModel()) { val s by vm.uiState.collectAsStateWithLifecycle(); LaunchedEffect(Unit){vm.initialize("Running")}
    Scaffold{p-> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) { TrainHeader("Running", s.durationSeconds, s.isPaused, onBack); TrainStats(s.distance, s.durationSeconds, s.calories, s.currentPace, s.averagePace); TrainMap(s.currentLocation, s.gpsPoints); TrainControls(s.isActive, s.isPaused, s.isFinishing, {if(!s.isActive)vm.startTracking() else if(s.isPaused)vm.resumeTracking() else vm.pauseTracking()}, {vm.saveWorkout(onSuccess=onBack, onError={})}, {}, {vm.recordSplit()}) } }
}

@Composable fun CyclingScreen(onBack:()->Unit, vm:TrackingViewModel= hiltViewModel()) { val s by vm.uiState.collectAsStateWithLifecycle(); LaunchedEffect(Unit){vm.initialize("Cycling")}
    Scaffold{p-> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) { TrainHeader("Cycling", s.durationSeconds, s.isPaused, onBack); TrainStats(s.distance, s.durationSeconds, s.calories, s.currentPace, s.averagePace); TrainMap(s.currentLocation, s.gpsPoints); TrainControls(s.isActive, s.isPaused, s.isFinishing, {if(!s.isActive)vm.startTracking() else if(s.isPaused)vm.resumeTracking() else vm.pauseTracking()}, {vm.saveWorkout(onSuccess=onBack, onError={})}, {}) } }
}

@Composable fun SwimmingScreen(onBack:()->Unit, vm:TrackingViewModel= hiltViewModel()) { val s by vm.uiState.collectAsStateWithLifecycle(); var laps by remember{mutableStateOf(0)}; LaunchedEffect(Unit){vm.initialize("Swimming")}
    Scaffold{p-> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) { TrainHeader("Swimming", s.durationSeconds, s.isPaused, onBack); TrainMap(s.currentLocation, s.gpsPoints); TrainControls(s.isActive, s.isPaused, s.isFinishing, {if(!s.isActive)vm.startTracking() else if(s.isPaused)vm.resumeTracking() else vm.pauseTracking()}, {vm.saveWorkout(onSuccess=onBack, onError={})}, {}) } }
}
