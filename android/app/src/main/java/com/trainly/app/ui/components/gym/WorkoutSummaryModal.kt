package com.trainly.app.ui.components.gym
import androidx.compose.runtime.Composable
data class WorkoutSummary(val exercises:Int=0, val sets:Int=0, val reps:Int=0, val weight:Double=0.0, val durMin:Int=0, val cal:Int=0)
@Composable fun WorkoutSummaryModal(visible:Boolean, s:WorkoutSummary, onSave:()->Unit, onDiscard:()->Unit) { }
