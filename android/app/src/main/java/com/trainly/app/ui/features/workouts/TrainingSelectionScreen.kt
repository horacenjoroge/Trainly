package com.trainly.app.ui.features.workouts

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

private val CardBg = Color(0xFFFBFBF9)
private val CardFg = Color(0xFF1C293C)
private val CardMuted = Color(0xFF5A6B7E)
private val BorderW = 3.dp
private val ShadowOffset = 5.dp

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
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CardBg)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardBg)
                .border(BorderW, CardFg)
                .padding(horizontal = Spacing.lg, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .border(2.dp, CardFg)
                    .background(CardBg)
                    .clickable { onNavigateBack() },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "\u2190",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = CardFg
                )
            }
            Spacer(Modifier.width(Spacing.md))
            Text(
                text = "Choose Your Training",
                fontSize = 17.sp,
                fontWeight = FontWeight.Black,
                color = CardFg
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            trainingOptions.forEach { option ->
                val onClick = when (option.name) {
                    "Running Trail" -> onSelectRunning
                    "Bike Trail" -> onSelectCycling
                    "Swimming" -> onSelectSwimming
                    "Gym Session" -> onSelectGym
                    else -> onSelectRunning
                }
                TrainingCard(option = option, onClick = onClick)
            }
            Spacer(Modifier.height(Spacing.md))
        }
    }
}

@Composable
private fun TrainingCard(
    option: TrainingOption,
    onClick: () -> Unit
) {
    Box(modifier = Modifier.fillMaxWidth().clickable { onClick() }) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = ShadowOffset, y = ShadowOffset)
                .background(CardFg)
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardBg)
                .border(BorderW, CardFg)
                .padding(Spacing.xl),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .border(BorderW, CardFg)
                    .background(CardBg),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = option.icon,
                    fontSize = 28.sp
                )
            }
            Spacer(Modifier.width(Spacing.lg))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = option.name,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = CardFg
                )
                Text(
                    text = option.desc,
                    fontSize = 13.sp,
                    color = CardMuted
                )
            }
            Text(
                text = "\u2192",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = CardMuted
            )
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
