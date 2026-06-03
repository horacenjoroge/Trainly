package com.trainly.app.ui.designsystem.dialogs

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
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
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyFormDialog(
    title: String,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit,
    confirmText: String = "Save",
    dismissText: String = "Cancel",
    confirmEnabled: Boolean = true,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
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
            content()
        },
        confirmButton = {
            TrainlyButton(
                text = confirmText,
                onClick = onConfirm,
                enabled = confirmEnabled
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
private fun TrainlyFormDialogPreview() {
    TrainlyTheme {
        TrainlyFormDialog(
            title = "Add Contact",
            onDismiss = {},
            onConfirm = {}
        ) {
            Column {
                TrainlyTextField(
                    value = "",
                    onValueChange = {},
                    label = "Name"
                )
                Spacer(Modifier.height(Spacing.md))
                TrainlyTextField(
                    value = "",
                    onValueChange = {},
                    label = "Phone"
                )
            }
        }
    }
}
