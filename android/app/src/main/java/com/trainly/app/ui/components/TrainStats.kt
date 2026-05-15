package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.trainly.app.ui.screens.training.*

@Composable fun TrainStats(dist:Double, dur:Int, cal:Int, pace:Double, avg:Double, mod:Modifier=Modifier) {
    Card(mod.padding(16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Row(Modifier.fillMaxWidth().padding(20.dp), horizontalArrangement=Arrangement.SpaceEvenly) {
            Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("📍", style=MaterialTheme.typography.titleMedium); Text(formatDistance(dist), fontWeight=FontWeight.Bold); Text("Distance", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
            Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("⏱", style=MaterialTheme.typography.titleMedium); Text(formatPace(dist/1000, dur), fontWeight=FontWeight.Bold); Text("Pace", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
            Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("🔥", style=MaterialTheme.typography.titleMedium); Text("$cal", fontWeight=FontWeight.Bold); Text("Calories", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
        }
    }
}
