package com.trainly.app.ui.designsystem.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = TrainlyColors.Orange,
    onPrimary = TrainlyColors.White,
    primaryContainer = TrainlyColors.OrangeDark,
    onPrimaryContainer = TrainlyColors.White,
    secondary = TrainlyColors.OrangeDark,
    onSecondary = TrainlyColors.White,
    background = TrainlyColors.DarkBackground,
    onBackground = TrainlyColors.White,
    surface = TrainlyColors.DarkSurface,
    onSurface = TrainlyColors.White,
    surfaceVariant = TrainlyColors.DarkSurfaceVariant,
    onSurfaceVariant = Color(0xFF999999),
    error = TrainlyColors.Error,
    onError = TrainlyColors.White,
    outline = Color(0xFF333333),
    outlineVariant = Color(0xFF2A2A2A)
)

private val LightColorScheme = lightColorScheme(
    primary = TrainlyColors.Orange,
    onPrimary = TrainlyColors.White,
    primaryContainer = TrainlyColors.Orange.copy(alpha = 0.15f),
    onPrimaryContainer = TrainlyColors.OrangeDark,
    secondary = TrainlyColors.OrangeDark,
    onSecondary = TrainlyColors.White,
    background = TrainlyColors.LightBackground,
    onBackground = TrainlyColors.Black,
    surface = TrainlyColors.LightSurface,
    onSurface = TrainlyColors.Black,
    surfaceVariant = TrainlyColors.LightSurfaceVariant,
    onSurfaceVariant = TrainlyColors.Gray600,
    error = TrainlyColors.Error,
    onError = TrainlyColors.White,
    outline = TrainlyColors.Gray200,
    outlineVariant = Color(0xFFDDDDDD)
)

@Composable
fun TrainlyTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme,
        typography = TrainlyTypography,
        content = content
    )
}
