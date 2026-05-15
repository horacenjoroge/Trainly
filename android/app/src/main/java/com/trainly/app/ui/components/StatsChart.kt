package com.trainly.app.ui.components
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.trainly.app.domain.models.ActivityBreakdown
import com.trainly.app.domain.models.WeeklyStats

@Composable fun WorkoutTypeChart(data:List<ActivityBreakdown>, mod:Modifier=Modifier) {
    if(data.isEmpty())return; val colors=listOf(Color(0xFFE57C0B),Color(0xFF4CAF50),Color(0xFF2196F3),Color(0xFF9C27B0))
    Card(mod.padding(16.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.padding(16.dp)) { Text("Workout Distribution", fontWeight=FontWeight.Bold); Spacer(Modifier.height(12.dp));
            Box(Modifier.fillMaxWidth().height(150.dp)) { val m=data.maxOf{it.count}.toFloat(); Canvas(Modifier.fillMaxSize()) { data.forEachIndexed{i,b-> val bw=size.width/(data.size*2f); val bh=if(m>0)(b.count/m)*size.height*0.8f else 0f; drawRect(colors[i%colors.size], Offset(i*bw*2f+bw/2f, size.height-bh), androidx.compose.ui.geometry.Size(bw*0.8f, bh)) } } }
        }
    }
}
@Composable fun ActivityTrendChart(data:List<WeeklyStats>, mod:Modifier=Modifier) {
    if(data.isEmpty())return; val m=data.maxOfOrNull{it.workouts}?.toFloat()?:1f
    Card(mod.padding(16.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.padding(16.dp)) { Text("Weekly Trend", fontWeight=FontWeight.Bold); Spacer(Modifier.height(12.dp));
        }
    }
}
