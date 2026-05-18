package com.trainly.app.ui.designsystem.components.feedback

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyEmpty(
    icon: String = "\uD83D\uDCEB",
    title: String = "Nothing here",
    subtitle: String = "",
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(Spacing.xl),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = icon,
                style = MaterialTheme.typography.displayMedium
            )
            Spacer(Modifier.height(Spacing.md))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center
            )
            if (subtitle.isNotBlank()) {
                Spacer(Modifier.height(Spacing.sm))
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )
            }
            if (actionLabel != null && onAction != null) {
                Spacer(Modifier.height(Spacing.lg))
                TrainlyButton(
                    text = actionLabel,
                    onClick = onAction
                )
            }
        }
    }
}

@Preview
@Composable
private fun TrainlyEmptyPreview() {
    TrainlyTheme {
        TrainlyEmpty(
            icon = "\uD83C\uDFC3",
            title = "No workouts yet",
            subtitle = "Start your fitness journey!",
            actionLabel = "Start Training",
            onAction = {}
        )
    }
}
