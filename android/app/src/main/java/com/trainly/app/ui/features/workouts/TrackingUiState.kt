package com.trainly.app.ui.features.workouts

data class TrackingUiState(
    val activityType: String = "",
    val isActive: Boolean = false,
    val isPaused: Boolean = false,
    val durationSeconds: Int = 0,
    val distance: Double = 0.0,
    val currentPace: Double = 0.0,
    val averagePace: Double = 0.0,
    val currentSpeed: Double = 0.0,
    val averageSpeed: Double = 0.0,
    val maxSpeed: Double = 0.0,
    val calories: Int = 0,
    val splitCount: Int = 0,
    val gpsPoints: List<GpsCoordinate> = emptyList(),
    val currentLocation: GpsCoordinate? = null,
    val isFinishing: Boolean = false,
    val error: String? = null
)
