package com.trainly.app.ui.designsystem.components.indicators

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    label: String? = null,
    showPercentage: Boolean = false
) {
    Column(modifier = modifier.fillMaxWidth()) {
        if (label != null || showPercentage) {
            val percent = (progress * 100).toInt()
            Text(
                text = buildString {
                    if (label != null) append(label)
                    if (label != null && showPercentage) append("  ")
                    if (showPercentage) append("$percent%")
                },
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Medium
            )
            Spacer(Modifier.height(Spacing.xs))
        }

        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .height(12.dp),
            shape = RoundedCornerShape(Radii.card),
            color = MaterialTheme.colorScheme.surfaceVariant,
            border = BorderStroke(BorderWidth.thin, MaterialTheme.colorScheme.outline)
        ) {
            Box(contentAlignment = Alignment.CenterStart) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth(progress.coerceIn(0f, 1f))
                        .height(12.dp),
                    shape = RoundedCornerShape(Radii.card),
                    color = MaterialTheme.colorScheme.primary
                ) {}
            }
        }
    }
}

@Preview
@Composable
private fun TrainlyProgressBarPreview() {
    TrainlyTheme {
        Column(modifier = Modifier.padding(Spacing.lg)) {
            TrainlyProgressBar(
                progress = 0.65f,
                label = "Weekly Goal",
                showPercentage = true
            )
        }
    }
}
