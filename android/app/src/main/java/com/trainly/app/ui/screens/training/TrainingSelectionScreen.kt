package com.trainly.app.ui.screens.training
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class TOption(val name:String, val desc:String, val icon:String)
private val opts = listOf(TOption("Running Trail","High-intensity cardio","🏃"), TOption("Bike Trail","Endurance ride","🚴"), TOption("Swimming","Full body workout","🏊"), TOption("Gym Session","Strength training","🏋️"))

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun TrainingSelectionScreen(onBack:()->Unit, onRun:()->Unit, onCycle:()->Unit, onSwim:()->Unit, onGym:()->Unit) {
    Scaffold(topBar={TopAppBar(title={Text("Choose Training", fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, colors=TopAppBarDefaults.topAppBarColors(containerColor=MaterialTheme.colorScheme.surface))}){p->
        Column(Modifier.fillMaxSize().padding(p).padding(16.dp), verticalArrangement=Arrangement.spacedBy(16.dp)) {
            opts.forEach{ Card(Modifier.fillMaxWidth().height(120.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) { Box(Modifier.fillMaxSize().padding(20.dp)) { Row(verticalAlignment=Alignment.CenterVertically) { Surface(RoundedCornerShape(12.dp), color=MaterialTheme.colorScheme.primary.copy(alpha=0.2f), modifier=Modifier.size(56.dp)) { Box(contentAlignment=Alignment.Center){Text(it.icon, style=MaterialTheme.typography.headlineMedium)} }; Spacer(Modifier.width(16.dp)); Column(Modifier.weight(1f)) { Text(it.name, fontWeight=FontWeight.Bold); Text(it.desc, style=MaterialTheme.typography.bodySmall) }; Text("›", style=MaterialTheme.typography.headlineMedium, color=MaterialTheme.colorScheme.primary) } } } }
        }
    }
}
