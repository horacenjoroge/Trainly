package com.trainly.app.ui.designsystem.previews

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.cards.TrainlyMetricCard
import com.trainly.app.ui.designsystem.cards.TrainlySectionCard
import com.trainly.app.ui.designsystem.cards.TrainlyUserCard
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Preview(showBackground = true, backgroundColor = 0xFFF5F5F5)
@Composable
fun DesignSystemShowcase() {
    TrainlyTheme {
        Column(
            modifier = Modifier.padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Text(
                text = "Trainly Design System",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Black
            )

            Text(
                text = "Typography",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Text("Display Large", style = MaterialTheme.typography.displayLarge)
            Text("Display Medium", style = MaterialTheme.typography.displayMedium)
            Text("Headline Large", style = MaterialTheme.typography.headlineLarge)
            Text("Headline Medium", style = MaterialTheme.typography.headlineMedium)
            Text("Title Large", style = MaterialTheme.typography.titleLarge)
            Text("Title Medium", style = MaterialTheme.typography.titleMedium)
            Text("Body Large", style = MaterialTheme.typography.bodyLarge)
            Text("Body Medium", style = MaterialTheme.typography.bodyMedium)
            Text("Body Small", style = MaterialTheme.typography.bodySmall)
            Text("Label Large", style = MaterialTheme.typography.labelLarge)

            Text(
                text = "Buttons",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            TrainlyButton(text = "Primary", onClick = {})
            TrainlyButton(text = "Secondary", onClick = {}, variant = TrainlyButtonVariant.SECONDARY)
            TrainlyButton(text = "Outline", onClick = {}, variant = TrainlyButtonVariant.OUTLINE)
            TrainlyButton(text = "Error", onClick = {}, variant = TrainlyButtonVariant.ERROR)
            TrainlyButton(text = "Ghost", onClick = {}, variant = TrainlyButtonVariant.GHOST)

            Text(
                text = "Cards",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            TrainlyCard {
                Column(modifier = Modifier.padding(Spacing.lg)) {
                    Text("Neo-Brutalist Card", fontWeight = FontWeight.Bold)
                    Text(
                        "Zero radius, thick borders",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            TrainlySectionCard(title = "Section Card") {
                Text("Content inside section card")
            }

            Text(
                text = "Metrics",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            androidx.compose.foundation.layout.Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                TrainlyMetricCard(
                    icon = "\uD83D\uDCCD",
                    value = "5.2",
                    label = "Distance",
                    modifier = Modifier.weight(1f)
                )
                TrainlyMetricCard(
                    icon = "\uD83D\uDD25",
                    value = "420",
                    label = "Calories",
                    modifier = Modifier.weight(1f)
                )
            }

            Text(
                text = "Feedback States",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(Spacing.sm))
            Text("Loading:", fontWeight = FontWeight.SemiBold)
        }
    }
}
