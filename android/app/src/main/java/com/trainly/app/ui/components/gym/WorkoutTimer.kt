package com.trainly.app.ui.components.gym
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable fun WorkoutTimer(sec:Int, paused:Boolean, mod:Modifier=Modifier) {
    Row(mod.padding(horizontal=16.dp, vertical=8.dp), horizontalArrangement=Arrangement.Center, verticalAlignment=Alignment.CenterVertically) {
        Card(shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
            Row(Modifier.padding(horizontal=20.dp, vertical=12.dp), verticalAlignment=Alignment.CenterVertically) { Text("⏱", style=MaterialTheme.typography.titleMedium); Spacer(Modifier.width(8.dp)); Text("${sec/60}:${"%02d".format(sec%60)}", style=MaterialTheme.typography.headlineSmall, fontWeight=FontWeight.Bold); if(paused){Spacer(Modifier.width(8.dp)); Text("PAUSED", style=MaterialTheme.typography.labelSmall, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary)} }
        }
    }
}
