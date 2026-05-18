package com.trainly.app.ui.designsystem.sheets

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyConfirmSheet(
    title: String,
    message: String,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit,
    confirmText: String = "Confirm",
    dismissText: String = "Cancel",
    isDestructive: Boolean = false,
    modifier: Modifier = Modifier
) {
    TrainlyBottomSheet(
        onDismiss = onDismiss,
        title = title,
        modifier = modifier
    ) {
        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(Spacing.xl))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            TrainlyButton(
                text = dismissText,
                onClick = onDismiss,
                variant = TrainlyButtonVariant.OUTLINE,
                modifier = Modifier.weight(1f)
            )
            TrainlyButton(
                text = confirmText,
                onClick = onConfirm,
                variant = if (isDestructive) TrainlyButtonVariant.ERROR else TrainlyButtonVariant.PRIMARY,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Preview
@Composable
private fun TrainlyConfirmSheetPreview() {
    TrainlyTheme {
        TrainlyConfirmSheet(
            title = "Delete Workout",
            message = "Are you sure you want to delete this workout?",
            onDismiss = {},
            onConfirm = {},
            isDestructive = true
        )
    }
}
