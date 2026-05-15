package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable fun QuickActions(onTrain:()->Unit, onShare:()->Unit, mod:Modifier=Modifier) {
    Row(mod.padding(horizontal=16.dp, vertical=8.dp), horizontalArrangement=Arrangement.spacedBy(12.dp)) {
        OutlinedButton(onClick=onTrain, Modifier.weight(1f).height(56.dp), shape=RoundedCornerShape(16.dp), colors=ButtonDefaults.outlinedButtonColors(containerColor=MaterialTheme.colorScheme.surface)) { Text("🏋️", style=MaterialTheme.typography.titleMedium); Spacer(Modifier.width(8.dp)); Text("Start Training", fontWeight=FontWeight.SemiBold) }
        OutlinedButton(onClick=onShare, Modifier.weight(1f).height(56.dp), shape=RoundedCornerShape(16.dp), colors=ButtonDefaults.outlinedButtonColors(containerColor=MaterialTheme.colorScheme.surface)) { Text("📤", style=MaterialTheme.typography.titleMedium); Spacer(Modifier.width(8.dp)); Text("Share Progress", fontWeight=FontWeight.SemiBold) }
    }
}
