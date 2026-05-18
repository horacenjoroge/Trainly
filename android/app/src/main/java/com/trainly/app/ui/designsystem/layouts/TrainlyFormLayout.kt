package com.trainly.app.ui.designsystem.layouts

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyFormLayout(
    modifier: Modifier = Modifier,
    verticalArrangement: Arrangement.Vertical = Arrangement.spacedBy(Spacing.md),
    content: @Composable () -> Unit
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = Spacing.lg, vertical = Spacing.lg),
        verticalArrangement = verticalArrangement
    ) {
        content()
    }
}

@Composable
fun TrainlyFormSection(
    title: String? = null,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Column(modifier = modifier.fillMaxWidth()) {
        if (title != null) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(Modifier.height(Spacing.sm))
        }
        content()
    }
}

@Composable
fun TrainlySettingsItemRow(
    icon: String,
    title: String,
    subtitle: String? = null,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {},
    trailing: @Composable (() -> Unit)? = { Text("\u203A", color = MaterialTheme.colorScheme.onSurfaceVariant) }
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = Spacing.lg, horizontal = Spacing.lg),
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
    ) {
                Text(
                    text = icon,
                    style = MaterialTheme.typography.titleMedium
                )
                Spacer(Modifier.width(Spacing.md))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        fontWeight = FontWeight.Medium,
                        style = MaterialTheme.typography.bodyLarge
                    )
                    if (subtitle != null) {
                        Text(
                            text = subtitle,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                if (trailing != null) {
                    trailing()
                }
            }
    }

@Preview
@Composable
private fun TrainlyFormLayoutPreview() {
    TrainlyTheme {
        TrainlyFormLayout {
            TrainlyFormSection(title = "Personal Information") {
                TrainlyTextField(
                    value = "",
                    onValueChange = {},
                    label = "Name",
                    placeholder = "Enter your name"
                )
            }
            Spacer(Modifier.height(Spacing.md))
            TrainlyFormSection(title = "Account") {
                TrainlyTextField(
                    value = "",
                    onValueChange = {},
                    label = "Email",
                    placeholder = "Enter your email"
                )
            }
        }
    }
}
