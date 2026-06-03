package com.trainly.app.ui.designsystem.theme

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.ui.unit.dp

object ContentPadding {
    val screen = PaddingValues(horizontal = Spacing.lg, vertical = 0.dp)
    val card = PaddingValues(Spacing.lg)
    val cardCompact = PaddingValues(Spacing.md)
    val hero = PaddingValues(Spacing.xl)
    val list = PaddingValues(horizontal = Spacing.lg, vertical = Spacing.sm)
}
