package com.trainly.app.ui.components.cycling
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

data class CyclingStats(val movingTime:Int=0, val avgMovingSpeed:Double=0.0, val totalElevationChange:Double=0.0, val maxSpeed:Double=0.0, val avgPower:Double=0.0)
@Composable fun CyclingStatsModal(visible:Boolean, stats:CyclingStats, onClose:()->Unit, mod:Modifier=Modifier) {
    if(!visible)return; Dialog(onDismissRequest=onClose) { Surface(RoundedCornerShape(16.dp), color=MaterialTheme.colorScheme.surface, tonalElevation=8.dp) { Column(Modifier.padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("Detailed Statistics", fontWeight=FontWeight.Bold); Spacer(Modifier.height(16.dp)); Row(Modifier.fillMaxWidth()){Text("Moving Time");Text("${stats.movingTime/60}:${"%02d".format(stats.movingTime%60)}", fontWeight=FontWeight.SemiBold)}; Spacer(Modifier.height(16.dp)); Button(onClick=onClose, Modifier.fillMaxWidth()){Text("Close")} } } }
}
