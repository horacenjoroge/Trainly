package com.trainly.app.ui.designsystem.components.indicators

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyChip(
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    removable: Boolean = false,
    onRemove: (() -> Unit)? = null,
    content: @Composable () -> Unit
) {
    val containerColor = if (selected) {
        MaterialTheme.colorScheme.primary
    } else {
        MaterialTheme.colorScheme.surface
    }
    val contentColor = if (selected) {
        MaterialTheme.colorScheme.onPrimary
    } else {
        MaterialTheme.colorScheme.onSurface
    }
    val borderColor = if (selected) {
        MaterialTheme.colorScheme.primary
    } else {
        MaterialTheme.colorScheme.outline
    }

    Surface(
        onClick = onClick,
        modifier = modifier,
        shape = RoundedCornerShape(Radii.full),
        color = containerColor,
        border = BorderStroke(BorderWidth.thin, borderColor)
    ) {
        Row(
            modifier = Modifier.padding(
                horizontal = Spacing.md,
                vertical = Spacing.sm
            ),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            content()
            if (removable && onRemove != null) {
                Spacer(Modifier.width(Spacing.xs))
                Text(
                    text = "\u00D7",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    color = contentColor,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun TrainlyChipGroup(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    androidx.compose.foundation.layout.FlowRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(Spacing.sm),
        verticalArrangement = Arrangement.spacedBy(Spacing.sm)
    ) {
        content()
    }
}

@Preview
@Composable
private fun TrainlyChipPreview() {
    TrainlyTheme {
        TrainlyChipGroup {
            TrainlyChip(selected = true, onClick = {}) {
                Text("Running", fontWeight = FontWeight.Medium)
            }
            TrainlyChip(selected = false, onClick = {}) {
                Text("Cycling", fontWeight = FontWeight.Medium)
            }
            TrainlyChip(selected = false, onClick = {}) {
                Text("Swimming", fontWeight = FontWeight.Medium)
            }
            TrainlyChip(selected = false, onClick = {}, removable = true, onRemove = {}) {
                Text("Strength", fontWeight = FontWeight.Medium)
            }
        }
    }
}
