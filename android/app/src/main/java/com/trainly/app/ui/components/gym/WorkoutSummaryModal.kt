package com.trainly.app.ui.components.gym
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

data class WorkoutSummary(val exercises:Int=0, val sets:Int=0, val reps:Int=0, val weight:Double=0.0, val durMin:Int=0, val cal:Int=0)
@Composable fun WorkoutSummaryModal(visible:Boolean, s:WorkoutSummary, onSave:()->Unit, onDiscard:()->Unit) {
    if(!visible)return; Dialog(onDismissRequest={}) { Surface(RoundedCornerShape(20.dp), color=MaterialTheme.colorScheme.surface, tonalElevation=8.dp) { Column(Modifier.padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("🏋️", style=MaterialTheme.typography.displayMedium); Text("Workout Complete!", fontWeight=FontWeight.Bold); Spacer(Modifier.height(16.dp)); SumRow("Exercises","${s.exercises}"); SumRow("Sets","${s.sets}"); SumRow("Reps","${s.reps}"); SumRow("Weight","${s.weight.toInt()} kg"); SumRow("Duration","${s.durMin} min"); Spacer(Modifier.height(16.dp)); Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.spacedBy(12.dp)) { OutlinedButton(onClick=onDiscard, Modifier.weight(1f)){Text("Discard")}; Button(onClick=onSave, Modifier.weight(1f)){Text("Save")} } } } }
}
@Composable private fun SumRow(l:String, v:String) { Row(Modifier.fillMaxWidth().padding(vertical=2.dp), verticalAlignment=Alignment.CenterVertically) { Text(l, Modifier.weight(1f)); Text(v, fontWeight=FontWeight.Bold) } }
