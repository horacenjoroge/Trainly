package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.ContentPadding
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

data class TrainingOption(
    val name: String,
    val desc: String,
    val icon: String
)

private val trainingOptions = listOf(
    TrainingOption("Running Trail", "High-intensity cardio", "\uD83C\uDFC3"),
    TrainingOption("Bike Trail", "Endurance ride", "\uD83D\uDEB2"),
    TrainingOption("Swimming", "Full body workout", "\uD83C\uDFCA"),
    TrainingOption("Gym Session", "Strength training", "\uD83C\uDFCB")
)

@Composable
fun TrainingSelectionScreen(
    onNavigateBack: () -> Unit,
    onSelectRunning: () -> Unit,
    onSelectCycling: () -> Unit,
    onSelectSwimming: () -> Unit,
    onSelectGym: () -> Unit
) {
    TrainlyScaffold(
        topBarTitle = "Choose Your Training",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onNavigateBack,
        topBarStyle = TopBarStyle.DEFAULT
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(ContentPadding.screen),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            trainingOptions.forEach { option ->
                val onClick = when (option.name) {
                    "Running Trail" -> onSelectRunning
                    "Bike Trail" -> onSelectCycling
                    "Swimming" -> onSelectSwimming
                    "Gym Session" -> onSelectGym
                    else -> onSelectRunning
                }

                TrainlyCard(onClick = onClick) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(120.dp)
                            .padding(ContentPadding.card),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        androidx.compose.material3.Surface(
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(Radii.md),
                            color = MaterialTheme.colorScheme.primaryContainer,
                            modifier = Modifier.size(56.dp)
                        ) {
                            androidx.compose.foundation.layout.Box(
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = option.icon,
                                    style = MaterialTheme.typography.headlineMedium
                                )
                            }
                        }
                        Spacer(Modifier.width(Spacing.lg))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = option.name,
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.titleMedium
                            )
                            Text(
                                text = option.desc,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(
                            text = "\u203A",
                            style = MaterialTheme.typography.headlineMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }
    }
}

@Preview
@Composable
private fun TrainingSelectionScreenPreview() {
    TrainlyTheme {
        TrainingSelectionScreen(
            onNavigateBack = {},
            onSelectRunning = {},
            onSelectCycling = {},
            onSelectSwimming = {},
            onSelectGym = {}
        )
    }
}
