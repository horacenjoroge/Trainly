package com.trainly.app.ui.components
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

@Composable fun TrainHeader(type:String, dur:Int, paused:Boolean, onBack:()->Unit, mod:Modifier=Modifier) {
    val ta = rememberInfiniteTransition(); val pa by ta.animateFloat(0.6f, 1f, infiniteRepeatable(tween(1000), RepeatMode.Reverse))
    Column(mod.background(MaterialTheme.colorScheme.surface, RoundedCornerShape(bottomStart=20.dp, bottomEnd=20.dp)).padding(16.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween, verticalAlignment=Alignment.CenterVertically) { IconButton(onClick=onBack){Text("←")}; Column(horizontalAlignment=Alignment.CenterHorizontally) { Text(type, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary) }; Box(Modifier.size(48.dp)) }
        Text(formatDuration(dur), style=MaterialTheme.typography.displayLarge, fontWeight=FontWeight.Bold, textAlign=TextAlign.Center, modifier=Modifier.fillMaxWidth().alpha(if(paused)pa else 1f), color=if(paused)MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface)
        if(paused) Text("PAUSED", fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary, textAlign=TextAlign.Center, modifier=Modifier.fillMaxWidth().alpha(pa))
    }
}
