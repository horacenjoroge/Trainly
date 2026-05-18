package com.trainly.app.ui.designsystem.components.buttons

import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyIconButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    icon: @Composable () -> Unit
) {
    IconButton(
        onClick = onClick,
        modifier = modifier.semantics {
            contentDescription?.let { this.contentDescription = it }
        }
    ) {
        icon()
    }
}

@Preview
@Composable
private fun TrainlyIconButtonPreview() {
    TrainlyTheme {
        TrainlyIconButton(
            onClick = {},
            contentDescription = "Go back"
        ) {
            Text("\u2190", fontWeight = FontWeight.Bold)
        }
    }
}
