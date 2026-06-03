package com.trainly.app.ui.designsystem.components.buttons

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Elevation
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyColors
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

enum class TrainlyButtonVariant {
    PRIMARY,
    SECONDARY,
    OUTLINE,
    ERROR,
    GHOST
}

@Composable
fun TrainlyButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: TrainlyButtonVariant = TrainlyButtonVariant.PRIMARY,
    enabled: Boolean = true,
    isLoading: Boolean = false,
    contentDescription: String? = null
) {
    val containerColor = when (variant) {
        TrainlyButtonVariant.PRIMARY -> MaterialTheme.colorScheme.primary
        TrainlyButtonVariant.SECONDARY -> MaterialTheme.colorScheme.secondary
        TrainlyButtonVariant.ERROR -> MaterialTheme.colorScheme.error
        TrainlyButtonVariant.OUTLINE -> Color.Transparent
        TrainlyButtonVariant.GHOST -> Color.Transparent
    }

    val contentColor = when (variant) {
        TrainlyButtonVariant.PRIMARY -> MaterialTheme.colorScheme.onPrimary
        TrainlyButtonVariant.SECONDARY -> MaterialTheme.colorScheme.onSecondary
        TrainlyButtonVariant.ERROR -> MaterialTheme.colorScheme.onError
        TrainlyButtonVariant.OUTLINE -> MaterialTheme.colorScheme.primary
        TrainlyButtonVariant.GHOST -> MaterialTheme.colorScheme.primary
    }

    val border = when (variant) {
        TrainlyButtonVariant.OUTLINE -> BorderWidth.thick
        else -> BorderWidth.none
    }

    val shape = RoundedCornerShape(Radii.button)

    val buttonModifier = modifier
        .height(48.dp)
        .semantics {
            contentDescription?.let { this.contentDescription = it }
        }

    if (variant == TrainlyButtonVariant.GHOST) {
        TextButton(
            onClick = onClick,
            enabled = enabled && !isLoading,
            modifier = buttonModifier
        ) {
            ButtonContent(
                text = text,
                isLoading = isLoading,
                contentColor = contentColor
            )
        }
    } else if (variant == TrainlyButtonVariant.OUTLINE) {
        OutlinedButton(
            onClick = onClick,
            enabled = enabled && !isLoading,
            modifier = buttonModifier,
            shape = shape,
            colors = ButtonDefaults.outlinedButtonColors(
                contentColor = contentColor
            ),
            border = ButtonDefaults.outlinedButtonBorder.copy(
                width = border
            )
        ) {
            ButtonContent(
                text = text,
                isLoading = isLoading,
                contentColor = contentColor
            )
        }
    } else {
        Button(
            onClick = onClick,
            enabled = enabled && !isLoading,
            modifier = buttonModifier,
            shape = shape,
            colors = ButtonDefaults.buttonColors(
                containerColor = containerColor,
                contentColor = contentColor,
                disabledContainerColor = containerColor.copy(alpha = 0.5f),
                disabledContentColor = contentColor.copy(alpha = 0.5f)
            ),
            elevation = ButtonDefaults.buttonElevation(
                defaultElevation = Elevation.none,
                pressedElevation = Elevation.none
            )
        ) {
            ButtonContent(
                text = text,
                isLoading = isLoading,
                contentColor = contentColor
            )
        }
    }
}

@Composable
private fun ButtonContent(
    text: String,
    isLoading: Boolean,
    contentColor: Color
) {
    if (isLoading) {
        CircularProgressIndicator(
            modifier = Modifier.size(20.dp),
            strokeWidth = 2.dp,
            color = contentColor
        )
    } else {
        Text(
            text = text,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Preview
@Composable
private fun TrainlyButtonPreview() {
    TrainlyTheme {
        Column(
            modifier = Modifier.fillMaxWidth().padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            TrainlyButton(text = "Primary", onClick = {})
            TrainlyButton(text = "Secondary", onClick = {}, variant = TrainlyButtonVariant.SECONDARY)
            TrainlyButton(text = "Outline", onClick = {}, variant = TrainlyButtonVariant.OUTLINE)
            TrainlyButton(text = "Error", onClick = {}, variant = TrainlyButtonVariant.ERROR)
            TrainlyButton(text = "Ghost", onClick = {}, variant = TrainlyButtonVariant.GHOST)
            TrainlyButton(text = "Loading", onClick = {}, isLoading = true)
            TrainlyButton(text = "Disabled", onClick = {}, enabled = false)
        }
    }
}
