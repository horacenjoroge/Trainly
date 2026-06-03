package com.trainly.app.ui.designsystem.components.feedback

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.trainly.app.ui.designsystem.theme.Spacing

@Composable
fun TrainlySnackbarContent(
    message: String,
    modifier: Modifier = Modifier
) {
    Snackbar(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
    ) {
        Text(text = message)
    }
}
