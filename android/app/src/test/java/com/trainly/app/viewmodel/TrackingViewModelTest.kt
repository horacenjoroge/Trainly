package com.trainly.app.viewmodel
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.*
import com.trainly.app.ui.features.workouts.GpsCoordinate
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.*

@OptIn(ExperimentalCoroutinesApi::class)
class TrackingViewModelTest {
    private lateinit var api:ApiService; private lateinit var vm:TrackingViewModel
    @BeforeEach fun setup() { Dispatchers.setMain(StandardTestDispatcher()); api=mockk(); vm=TrackingViewModel(api) }
    @Test fun `initialize sets type`() { vm.initialize("Running"); assertEquals("Running",vm.uiState.value.activityType) }
    @Test fun `start sets active`() { vm.initialize("Running"); vm.startTracking(); assertTrue(vm.uiState.value.isActive) }
    @Test fun `pause and resume`() { vm.initialize("Running"); vm.startTracking(); vm.pauseTracking(); assertTrue(vm.uiState.value.isPaused); vm.resumeTracking(); assertFalse(vm.uiState.value.isPaused) }
    @Test fun `stop clears`() { vm.initialize("Running"); vm.startTracking(); vm.stopTracking(); assertFalse(vm.uiState.value.isActive) }
    @Test fun `gps adds points`() { vm.initialize("Running"); vm.updateGpsPoint(GpsCoordinate(40.0,-74.0)); assertEquals(1,vm.uiState.value.gpsPoints.size) }
    @Test fun `record split`() { vm.initialize("Running"); vm.recordSplit(); assertEquals(1,vm.uiState.value.splitCount) }
    @Test fun `save calls api`() = runTest { vm.initialize("Running"); coEvery{api.createWorkout(any())}returns NetworkResult.Success(WorkoutCreateResponse()); var ok=false; vm.saveWorkout({ok=true},{}); advanceUntilIdle(); assertTrue(ok) }
}
