package com.trainly.app.ui.designsystem.components.indicators

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.trainly.app.ui.designsystem.theme.IconSize
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyCircularLoader(
    modifier: Modifier = Modifier,
    size: Dp = IconSize.lg,
    strokeWidth: Dp = 3.dp,
    color: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.primary
) {
    Box(
        modifier = modifier.size(size),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(
            modifier = Modifier.size(size),
            color = color,
            strokeWidth = strokeWidth
        )
    }
}

@Preview
@Composable
private fun TrainlyCircularLoaderPreview() {
    TrainlyTheme {
        TrainlyCircularLoader()
    }
}
