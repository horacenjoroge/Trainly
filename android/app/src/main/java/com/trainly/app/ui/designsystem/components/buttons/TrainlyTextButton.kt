package com.trainly.app.ui.designsystem.components.buttons

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyTextButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable () -> Unit
) {
    TextButton(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
    ) {
        content()
    }
}

@Preview
@Composable
private fun TrainlyTextButtonPreview() {
    TrainlyTheme {
        TrainlyTextButton(onClick = {}) {
            Text(
                text = "Cancel",
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
