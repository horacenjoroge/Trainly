package com.trainly.app.ui.designsystem.components.inputs

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    placeholder: String? = null,
    singleLine: Boolean = true,
    minLines: Int = 1,
    error: String? = null,
    enabled: Boolean = true
) {
    val shape = RoundedCornerShape(Radii.md)

    val colors = OutlinedTextFieldDefaults.colors(
        focusedBorderColor = MaterialTheme.colorScheme.primary,
        unfocusedBorderColor = MaterialTheme.colorScheme.outline,
        errorBorderColor = MaterialTheme.colorScheme.error,
        cursorColor = MaterialTheme.colorScheme.primary,
        focusedLabelColor = MaterialTheme.colorScheme.primary,
        unfocusedLabelColor = MaterialTheme.colorScheme.onSurfaceVariant,
        errorLabelColor = MaterialTheme.colorScheme.error
    )

    Column(modifier = modifier) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(label, fontWeight = FontWeight.Medium) },
            placeholder = placeholder?.let { { Text(it) } },
            leadingIcon = leadingIcon,
            trailingIcon = trailingIcon,
            singleLine = singleLine,
            minLines = minLines,
            isError = error != null,
            enabled = enabled,
            modifier = Modifier
                .fillMaxWidth()
                .semantics {
                    if (error != null) {
                        this.error(error)
                    }
                },
            shape = shape,
            colors = colors
        )

        if (error != null) {
            Spacer(Modifier.height(Spacing.xs))
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(start = Spacing.lg)
            )
        }
    }
}

@Preview
@Composable
private fun TrainlyTextFieldPreview() {
    TrainlyTheme {
        Column(modifier = Modifier.padding(Spacing.lg)) {
            TrainlyTextField(
                value = "",
                onValueChange = {},
                label = "Email",
                placeholder = "Enter your email"
            )
            Spacer(Modifier.height(Spacing.md))
            TrainlyTextField(
                value = "user@example.com",
                onValueChange = {},
                label = "Email",
                leadingIcon = { Text("\u2709") }
            )
            Spacer(Modifier.height(Spacing.md))
            TrainlyTextField(
                value = "invalid",
                onValueChange = {},
                label = "Email",
                error = "Please enter a valid email"
            )
        }
    }
}
