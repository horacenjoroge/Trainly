package com.trainly.app.ui.designsystem.forms

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyFormField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    placeholder: String? = null,
    error: String? = null,
    enabled: Boolean = true,
    singleLine: Boolean = true,
    minLines: Int = 1,
    helperText: String? = null
) {
    Column(modifier = modifier.fillMaxWidth()) {
        TrainlyTextField(
            value = value,
            onValueChange = onValueChange,
            label = label,
            leadingIcon = leadingIcon,
            trailingIcon = trailingIcon,
            placeholder = placeholder,
            error = error,
            enabled = enabled,
            singleLine = singleLine,
            minLines = minLines
        )
        if (helperText != null && error == null) {
            Spacer(Modifier.height(Spacing.xs))
            Text(
                text = helperText,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(start = Spacing.lg)
            )
        }
    }
}

@Preview
@Composable
private fun TrainlyFormFieldPreview() {
    TrainlyTheme {
        Column(modifier = Modifier.padding(Spacing.lg)) {
            TrainlyFormField(
                value = "",
                onValueChange = {},
                label = "Full Name",
                placeholder = "Enter your name"
            )
        }
    }
}
