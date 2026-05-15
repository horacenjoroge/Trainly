package com.trainly.app.ui.screens.training

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class TrainingOption(
    val name: String,
    val desc: String,
    val icon: String
)

private val options = listOf(
    TrainingOption("Running Trail", "High-intensity cardio", "\uD83C\uDFC3"),
    TrainingOption("Bike Trail", "Endurance ride", "\uD83D\uDEB2"),
    TrainingOption("Swimming", "Full body workout", "\uD83C\uDFCA"),
    TrainingOption("Gym Session", "Strength training", "\uD83C\uDFCB")
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrainingSelectionScreen(
    onNavigateBack: () -> Unit,
    onSelectRunning: () -> Unit,
    onSelectCycling: () -> Unit,
    onSelectSwimming: () -> Unit,
    onSelectGym: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Choose Your Training", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary) },
                navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            options.forEach { option ->
                val onClick = when (option.name) {
                    "Running Trail" -> onSelectRunning
                    "Bike Trail" -> onSelectCycling
                    "Swimming" -> onSelectSwimming
                    "Gym Session" -> onSelectGym
                    else -> onSelectRunning
                }
                Card(
                    modifier = Modifier.fillMaxWidth().height(120.dp).clickable { onClick() },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxSize().padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                            modifier = Modifier.size(56.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(option.icon, style = MaterialTheme.typography.headlineMedium)
                            }
                        }
                        Spacer(Modifier.width(16.dp))
                        Column(Modifier.weight(1f)) {
                            Text(option.name, fontWeight = FontWeight.Bold)
                            Text(option.desc, style = MaterialTheme.typography.bodySmall)
                        }
                        Text("\u203A", style = MaterialTheme.typography.headlineMedium, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }
    }
}
