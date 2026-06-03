package com.trainly.app.ui.designsystem.dialogs

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyAlertDialog(
    title: String,
    text: String,
    onDismiss: () -> Unit,
    confirmText: String = "OK",
    onConfirm: () -> Unit,
    dismissText: String? = "Cancel",
    modifier: Modifier = Modifier
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleLarge
            )
        },
        text = {
            Text(
                text = text,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        },
        confirmButton = {
            TrainlyButton(
                text = confirmText,
                onClick = onConfirm
            )
        },
        dismissButton = {
            if (dismissText != null) {
                TextButton(onClick = onDismiss) {
                    Text(
                        text = dismissText,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        },
        modifier = modifier,
    shape = RoundedCornerShape(Radii.card)
    )
}

@Composable
fun TrainlyConfirmDialog(
    title: String,
    text: String,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit,
    confirmText: String = "Confirm",
    dismissText: String = "Cancel",
    isDestructive: Boolean = false,
    modifier: Modifier = Modifier
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleLarge
            )
        },
        text = {
            Text(
                text = text,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        },
        confirmButton = {
            TrainlyButton(
                text = confirmText,
                onClick = onConfirm,
                variant = if (isDestructive) {
                    com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant.ERROR
                } else {
                    com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant.PRIMARY
                }
            )
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(
                    text = dismissText,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        },
        modifier = modifier,
        shape = RoundedCornerShape(Radii.card)
    )
}

@Preview
@Composable
private fun TrainlyAlertDialogPreview() {
    TrainlyTheme {
        TrainlyAlertDialog(
            title = "Delete Workout",
            text = "Are you sure you want to delete this workout? This action cannot be undone.",
            onDismiss = {},
            onConfirm = {},
            confirmText = "Delete",
            dismissText = "Cancel"
        )
    }
}
