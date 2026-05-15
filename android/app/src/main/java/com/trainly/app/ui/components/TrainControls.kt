package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable fun TrainControls(active:Boolean, paused:Boolean, finishing:Boolean, onStart:()->Unit, onFinish:()->Unit, onShare:()->Unit, onSplit:(()->Unit)?=null, mod:Modifier=Modifier) {
    var conf by remember{mutableStateOf(false)}
    Card(mod.padding(16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.fillMaxWidth().padding(20.dp), horizontalAlignment=Alignment.CenterHorizontally) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceEvenly) {
                if(onSplit!=null&&active) OutlinedButton(onClick=onSplit, shape=CircleShape, Modifier.size(56.dp), contentPadding=PaddingValues(0.dp)) { Text("📍") }
                Button(onClick=onStart, Modifier.size(72.dp), shape=CircleShape, colors=ButtonDefaults.buttonColors(containerColor=if(paused)MaterialTheme.colorScheme.primary else if(active)MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary), contentPadding=PaddingValues(0.dp)) { Text(if(paused)"▶" else if(active)"⏸" else "▶", style=MaterialTheme.typography.headlineMedium) }
                if(active) Button(onClick={if(conf){onFinish();conf=false}else conf=true}, Modifier.size(56.dp), shape=CircleShape, colors=ButtonDefaults.buttonColors(containerColor=MaterialTheme.colorScheme.error.copy(alpha=0.8f)), contentPadding=PaddingValues(0.dp)) { Text("⏹") }
            }
            if(conf) { Spacer(Modifier.height(8.dp)); Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceEvenly) { TextButton(onClick={conf=false}){Text("Cancel")}; Button(onClick={onFinish();conf=false}, colors=ButtonDefaults.buttonColors(containerColor=MaterialTheme.colorScheme.error)){Text("Save")} } }
        }
    }
}
