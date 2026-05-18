package com.trainly.app.ui.theme

import androidx.compose.runtime.Composable

@Composable
fun TrainlyTheme(
    darkTheme: Boolean = androidx.compose.foundation.isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    com.trainly.app.ui.designsystem.theme.TrainlyTheme(
        darkTheme = darkTheme,
        content = content
    )
}
