package com.trainly.app.ui.components.cycling
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class CyclingPerf(val avgSpeed:Double=0.0, val maxSpeed:Double=0.0, val avgPower:Double=0.0, val avgCadence:Int=0, val movingTime:Int=0, val stoppedTime:Int=0)
@Composable fun CyclingPerformanceStats(p:CyclingPerf, mod:Modifier=Modifier) {
    Card(mod.padding(horizontal=16.dp, vertical=8.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(16.dp)) { Text("Performance", fontWeight=FontWeight.Bold); Spacer(Modifier.height(8.dp)); Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceEvenly) { PerfItem("Avg", "${p.avgSpeed.toInt()}"); PerfItem("Max", "${p.maxSpeed.toInt()}"); PerfItem("Power", "${p.avgPower.toInt()}W") } }
    }
}
@Composable private fun PerfItem(l:String, v:String) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text(v, fontWeight=FontWeight.Bold); Text(l, style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) } }
