package com.trainly.app.ui.designsystem.layouts

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Elevation
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlySettingsLayout(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(bottom = Spacing.xxl)
    ) {
        content()
    }
}

@Composable
fun TrainlySettingsSection(
    title: String,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Spacer(Modifier.height(Spacing.xl))
        Text(
            text = title,
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(horizontal = Spacing.lg)
        )
        Spacer(Modifier.height(Spacing.sm))
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = Spacing.lg),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(Radii.card),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            ),
            elevation = CardDefaults.cardElevation(
                defaultElevation = Elevation.none
            ),
            border = BorderStroke(BorderWidth.thin, MaterialTheme.colorScheme.outline)
        ) {
            Column {
                content()
            }
        }
    }
}

@Composable
fun TrainlySettingsDivider(modifier: Modifier = Modifier) {
    HorizontalDivider(
        modifier = modifier.padding(horizontal = Spacing.lg),
        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
    )
}

@Preview
@Composable
private fun TrainlySettingsLayoutPreview() {
    TrainlyTheme {
        TrainlySettingsLayout {
            TrainlySettingsSection(title = "General") {
                TrainlySettingsItemRow(
                    icon = "\uD83C\uDF1F",
                    title = "Theme",
                    subtitle = "System default"
                )
                TrainlySettingsDivider()
                TrainlySettingsItemRow(
                    icon = "\uD83D\uDD14",
                    title = "Notifications",
                    subtitle = "Workout reminders"
                )
            }
            TrainlySettingsSection(title = "Account") {
                TrainlySettingsItemRow(
                    icon = "\uD83D\uDC64",
                    title = "Personal Info",
                    subtitle = "Name, email, bio"
                )
            }
        }
    }
}
