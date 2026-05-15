package com.trainly.app.ui.components.gym
import androidx.compose.animation.core.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable fun RestTimer(remaining:Int, onSkip:()->Unit, mod:Modifier=Modifier) {
    if(remaining<=0)return; val ta=rememberInfiniteTransition(); val pa by ta.animateFloat(.6f, 1f, infiniteRepeatable(tween(800), RepeatMode.Reverse))
    Card(mod.alpha(pa).padding(horizontal=16.dp, vertical=4.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.secondaryContainer)) {
        Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment=Alignment.CenterVertically) { Text("☕", style=MaterialTheme.typography.titleLarge); Spacer(Modifier.width(12.dp)); Column(Modifier.weight(1f)) { Text("Rest", style=MaterialTheme.typography.bodySmall); Text("${remaining/60}:${"%02d".format(remaining%60)}", fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.secondary) }; FilledTonalButton(onClick=onSkip){Text("Skip")} }
    }
}
