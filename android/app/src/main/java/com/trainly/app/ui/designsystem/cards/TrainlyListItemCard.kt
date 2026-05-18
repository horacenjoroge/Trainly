package com.trainly.app.ui.designsystem.cards

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.ContentPadding
import com.trainly.app.ui.designsystem.theme.Elevation
import com.trainly.app.ui.designsystem.theme.IconSize
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyListItemCard(
    icon: String,
    title: String,
    subtitle: String? = null,
    trailing: String? = null,
    trailingLabel: String? = null,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null
) {
    Card(
        onClick = onClick ?: {},
        enabled = onClick != null,
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(Radii.card),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = Elevation.none
        ),
        border = BorderStroke(BorderWidth.thin, MaterialTheme.colorScheme.outline)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(ContentPadding.cardCompact),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(Radii.md),
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.size(IconSize.xl)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = icon,
                        style = MaterialTheme.typography.titleLarge
                    )
                }
            }
            Spacer(Modifier.width(Spacing.md))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.titleSmall
                )
                if (subtitle != null) {
                    Text(
                        text = subtitle,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            if (trailing != null) {
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = trailing,
                        fontWeight = FontWeight.SemiBold,
                        style = MaterialTheme.typography.titleSmall
                    )
                    if (trailingLabel != null) {
                        Text(
                            text = trailingLabel,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Preview
@Composable
private fun TrainlyListItemCardPreview() {
    TrainlyTheme {
        Column(
            modifier = Modifier.padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.sm)
        ) {
            TrainlyListItemCard(
                icon = "\uD83C\uDFC3",
                title = "Morning Run",
                subtitle = "2 hours ago",
                trailing = "5.2 km",
                trailingLabel = "320 cal"
            )
            TrainlyListItemCard(
                icon = "\uD83D\uDEB2",
                title = "Evening Cycle",
                subtitle = "Yesterday",
                trailing = "15.0 km",
                trailingLabel = "450 cal"
            )
        }
    }
}
