package com.trainly.app.ui.designsystem.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.unit.dp

object Radii {
    val none = 0.dp
    val sm = 4.dp
    val md = 8.dp
    val card = 0.dp
    val button = 0.dp
    val full = 9999.dp
}

val TrainlyCardShape = RoundedCornerShape(Radii.card)
val TrainlyButtonShape = RoundedCornerShape(Radii.button)
val TrainlyTextFieldShape = RoundedCornerShape(Radii.md)
val TrainlyChipShape = RoundedCornerShape(Radii.full)
