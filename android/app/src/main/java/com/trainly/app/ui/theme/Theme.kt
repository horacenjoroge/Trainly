package com.trainly.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Orange = Color(0xFFE57C0B)
val DarkBg = Color(0xFF120B42)
val DarkSurface = Color(0xFF1A144B)

private val Dark = darkColorScheme(
    primary = Orange,
    onPrimary = Color.White,
    background = DarkBg,
    onBackground = Color.White,
    surface = DarkSurface,
    onSurface = Color.White
)

private val Light = lightColorScheme(
    primary = Orange,
    background = Color(0xFFF5F5F5),
    surface = Color.White
)

@Composable
fun TrainlyTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) Dark else Light,
        content = content
    )
}
