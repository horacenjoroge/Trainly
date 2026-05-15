package com.trainly.app.ui.components.cycling
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.trainly.app.ui.screens.training.GpsCoordinate

@Composable fun CyclingElevationCard(pts:List<GpsCoordinate>, gain:Double, loss:Double, mod:Modifier=Modifier) {
    Card(mod.padding(horizontal=16.dp, vertical=8.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(16.dp)) { Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween) { Text("↑ ${gain.toInt()}m", color=Color(0xFF4CAF50), fontWeight=FontWeight.SemiBold); Text("Elevation", fontWeight=FontWeight.Bold); Text("↓ ${loss.toInt()}m", color=Color(0xFFE53935), fontWeight=FontWeight.SemiBold) }; if(pts.size>=2){ val al=pts.map{it.altitude}; val mn=al.minOrNull()?:0.0; val mx=al.maxOrNull()?:1.0; val ra=(mx-mn).coerceAtLeast(1.0); Box(Modifier.fillMaxWidth().height(80.dp)) { Canvas(Modifier.fillMaxSize()) { val sx=size.width/(al.size-1).coerceAtLeast(1); val p=Path(); al.forEachIndexed{i,a-> val x=i*sx; val y=((1-(a-mn)/ra)*size.height).toFloat(); if(i==0)p.moveTo(x,y)else p.lineTo(x,y) }; drawPath(p, Color(0xFFE57C0B), style=Stroke(2.dp.toPx(), cap=StrokeCap.Round)) } } } }
    }
}
