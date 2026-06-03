package com.trainly.app.ui.designsystem.sheets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

data class ActionSheetItem(
    val label: String,
    val icon: String = "",
    val isDestructive: Boolean = false,
    val onClick: () -> Unit
)

@Composable
fun TrainlyActionSheet(
    title: String? = null,
    items: List<ActionSheetItem>,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    TrainlyBottomSheet(
        onDismiss = onDismiss,
        title = title,
        modifier = modifier
    ) {
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(Radii.card),
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(BorderWidth.thin, MaterialTheme.colorScheme.outline)
        ) {
            Column {
                items.forEachIndexed { index, item ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable(onClick = item.onClick)
                            .padding(Spacing.lg),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (item.icon.isNotEmpty()) {
                            Text(text = item.icon, style = MaterialTheme.typography.titleMedium)
                            Spacer(Modifier.width(Spacing.md))
                        }
                        Text(
                            text = item.label,
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Medium,
                            color = if (item.isDestructive)
                                MaterialTheme.colorScheme.error
                            else
                                MaterialTheme.colorScheme.onSurface
                        )
                    }
                    if (index < items.lastIndex) {
                        HorizontalDivider(
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                        )
                    }
                }
            }
        }
    }
}

@Preview
@Composable
private fun TrainlyActionSheetPreview() {
    TrainlyTheme {
        TrainlyActionSheet(
            title = "Options",
            items = listOf(
                ActionSheetItem("Edit", "\u270F", onClick = {}),
                ActionSheetItem("Share", "\uD83D\uDD17", onClick = {}),
                ActionSheetItem("Delete", isDestructive = true, onClick = {})
            ),
            onDismiss = {}
        )
    }
}
