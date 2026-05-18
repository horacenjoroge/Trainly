package com.trainly.app.ui.designsystem.layouts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import com.trainly.app.ui.designsystem.cards.TrainlySectionCard
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyColors

@Composable
fun TrainlyDetailLayout(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = Spacing.lg),
        verticalArrangement = Arrangement.spacedBy(Spacing.md)
    ) {
        content()
        Spacer(Modifier.height(Spacing.xl))
    }
}

@Composable
fun TrainlyHeroCard(
    icon: String,
    title: String,
    subtitle: String? = null,
    modifier: Modifier = Modifier
) {
    val shape = androidx.compose.foundation.shape.RoundedCornerShape(com.trainly.app.ui.designsystem.theme.Radii.card)

    androidx.compose.material3.Card(
        modifier = modifier.fillMaxWidth(),
        shape = shape,
        colors = androidx.compose.material3.CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        ),
        elevation = androidx.compose.material3.CardDefaults.cardElevation(
            defaultElevation = com.trainly.app.ui.designsystem.theme.Elevation.none
        ),
        border = androidx.compose.foundation.BorderStroke(
            com.trainly.app.ui.designsystem.theme.BorderWidth.heavy,
            MaterialTheme.colorScheme.primary
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(com.trainly.app.ui.designsystem.theme.ContentPadding.hero),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = icon,
                style = MaterialTheme.typography.displayMedium
            )
            Spacer(Modifier.height(Spacing.sm))
            Text(
                text = title,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                textAlign = TextAlign.Center
            )
            if (subtitle != null) {
                Spacer(Modifier.height(Spacing.xs))
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Composable
fun TrainlyDetailSection(
    title: String,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    TrainlySectionCard(
        title = title,
        modifier = modifier
    ) {
        content()
    }
}

@Composable
fun TrainlyDetailItem(
    icon: String,
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(vertical = Spacing.xs)
    ) {
        Text(
            text = "$icon $label",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            fontWeight = FontWeight.SemiBold,
            style = MaterialTheme.typography.titleSmall
        )
    }
}
