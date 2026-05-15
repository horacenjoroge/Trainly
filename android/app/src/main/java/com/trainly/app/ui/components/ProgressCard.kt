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
import com.trainly.app.utils.DateUtils

@Composable fun ProgressCard(stats:ProgressStats, loading:Boolean, onView:()->Unit, mod:Modifier=Modifier) {
    Card(mod.padding(horizontal=16.dp, vertical=8.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.padding(16.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween, verticalAlignment=Alignment.CenterVertically) { Text("My Progress", fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary); TextButton(onClick=onView){Text("View Stats")} }
            if(loading) { Box(Modifier.fillMaxWidth().padding(20.dp), contentAlignment=Alignment.Center) { CircularProgressIndicator(Modifier.size(24.dp)) } } else {
                Row(Modifier.fillMaxWidth().padding(vertical=12.dp), horizontalArrangement=Arrangement.SpaceEvenly) {
                    Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("${stats.totalWorkouts}", style=MaterialTheme.typography.titleLarge, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary); Text("Workouts", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
                    Column(horizontalAlignment=Alignment.CenterHorizontally) { Text(DateUtils.formatDuration(stats.totalDuration/60), style=MaterialTheme.typography.titleLarge, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary); Text("Time", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
                    Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("${stats.totalCalories}", style=MaterialTheme.typography.titleLarge, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary); Text("Calories", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
                }
            }
        }
    }
}
