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
import androidx.compose.ui.unit.dp
import com.trainly.app.ui.screens.training.GpsCoordinate

@Composable fun TrainMap(loc:GpsCoordinate?, pts:List<GpsCoordinate>, mod:Modifier=Modifier) {
    Card(mod.height(200.dp).padding(16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surfaceVariant), elevation=CardDefaults.cardElevation(2.dp)) {
        if(pts.isEmpty()) Box(Modifier.fillMaxSize(), contentAlignment=androidx.compose.ui.Alignment.Center) { Text("🗺️ Waiting for GPS...", color=MaterialTheme.colorScheme.onSurfaceVariant) }
        else Canvas(Modifier.fillMaxSize().padding(16.dp)) {
            val minLat=pts.minOf{it.latitude}; val maxLat=pts.maxOf{it.latitude}; val minLng=pts.minOf{it.longitude}; val maxLng=pts.maxOf{it.longitude}
            val lr=(maxLat-minLat).coerceAtLeast(0.0001); val lng=(maxLng-minLng).coerceAtLeast(0.0001)
            val p=Path(); pts.forEachIndexed{i,pt-> val x=((pt.longitude-minLng)/lng*size.width).toFloat(); val y=((1-(pt.latitude-minLat)/lr)*size.height).toFloat(); if(i==0)p.moveTo(x,y)else p.lineTo(x,y) }
            drawPath(p, Color(0xFFE57C0B), style=Stroke(3.dp.toPx(), cap=StrokeCap.Round)); val lst=pts.last(); drawCircle(Color(0xFFE57C0B), 6.dp.toPx(), Offset(((lst.longitude-minLng)/lng*size.width).toFloat(), ((1-(lst.latitude-minLat)/lr)*size.height).toFloat()))
        }
    }
}
