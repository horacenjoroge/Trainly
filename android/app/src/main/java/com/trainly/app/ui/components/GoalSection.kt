package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.trainly.app.domain.models.ProgressStats

@Composable fun GoalSection(stats:ProgressStats, mod:Modifier=Modifier) {
    Card(mod.padding(16.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(16.dp)) { Text("This Week's Progress", fontWeight=FontWeight.Bold); Spacer(Modifier.height(12.dp)); GoalRow("Workouts", stats.totalWorkouts, 5); GoalRow("Calories", stats.totalCalories, 2000) }
    }
}
@Composable private fun GoalRow(label:String, cur:Int, target:Int) {
    Column(Modifier.padding(vertical=6.dp)) { Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween) { Text(label); Text("$cur/$target", color=MaterialTheme.colorScheme.primary, fontWeight=FontWeight.SemiBold) }; Spacer(Modifier.height(4.dp)); LinearProgressIndicator({(cur.toFloat()/target).coerceIn(0f,1f)}, Modifier.fillMaxWidth().height(6.dp), color=MaterialTheme.colorScheme.primary, trackColor=MaterialTheme.colorScheme.primary.copy(alpha=0.2f)) }
}
