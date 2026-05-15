package com.trainly.app.ui.components.cycling
import androidx.compose.runtime.Composable
@Composable fun CyclingStatsModal(visible:Boolean, stats:CyclingStats, onClose:()->Unit) { }
data class CyclingStats(val movingTime:Int=0, val avgMovingSpeed:Double=0.0, val totalElevationChange:Double=0.0, val maxSpeed:Double=0.0, val avgPower:Double=0.0)
