package com.trainly.app.ui.features.profile

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.foundation.layout.width
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.layouts.TrainlySettingsDivider
import com.trainly.app.ui.designsystem.layouts.TrainlySettingsLayout
import com.trainly.app.ui.designsystem.layouts.TrainlySettingsSection
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.viewmodel.SettingsViewModel

@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    onLogout: () -> Unit,
    vm: SettingsViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Settings",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onBack,
        topBarStyle = TopBarStyle.DEFAULT
    ) { padding ->
        TrainlySettingsLayout {
            Spacer(Modifier.height(Spacing.lg))

            com.trainly.app.ui.designsystem.cards.TrainlyCard {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.lg),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = state.avatar,
                        contentDescription = "Profile avatar",
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop
                    )
                    Spacer(Modifier.width(Spacing.md))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = state.displayName,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = state.email,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Text(
                        text = "\u203A",
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(Modifier.height(Spacing.lg))

            TrainlySettingsSection(title = "General") {
                SettingsItem(
                    icon = "\uD83C\uDF1F",
                    title = "Theme",
                    subtitle = "System default"
                )
                TrainlySettingsDivider()
                SettingsItem(
                    icon = "\uD83D\uDD14",
                    title = "Notifications",
                    subtitle = "Workout reminders"
                )
                TrainlySettingsDivider()
                SettingsItem(
                    icon = "\uD83D\uDCCD",
                    title = "Units",
                    subtitle = "Metric"
                )
                TrainlySettingsDivider()
                SettingsItem(
                    icon = "\uD83D\uDD12",
                    title = "Privacy",
                    subtitle = "Manage data"
                )
            }

            TrainlySettingsSection(title = "Account") {
                SettingsItem(
                    icon = "\uD83D\uDC64",
                    title = "Personal Info",
                    subtitle = "Name, email, bio"
                )
                TrainlySettingsDivider()
                SettingsItem(
                    icon = "\uD83C\uDFCB\uFE0F",
                    title = "Fitness Stats",
                    subtitle = "Height, weight, goals"
                )
                TrainlySettingsDivider()
                SettingsItem(
                    icon = "\uD83D\uDE91",
                    title = "Emergency Contacts",
                    subtitle = "SOS numbers"
                )
            }

            TrainlySettingsSection(title = "Support") {
                SettingsItem(
                    icon = "\u2753",
                    title = "Help Center",
                    subtitle = "FAQs and support"
                )
                TrainlySettingsDivider()
                SettingsItem(
                    icon = "\uD83D\uDCEB",
                    title = "Contact Us",
                    subtitle = "Send feedback"
                )
                TrainlySettingsDivider()
                SettingsItem(
                    icon = "\u2139\uFE0F",
                    title = "About",
                    subtitle = "Version 1.0.0"
                )
            }

            Spacer(Modifier.height(Spacing.xl))

            TrainlyButton(
                text = "Log Out",
                onClick = {
                    vm.logout()
                    onLogout()
                },
                variant = TrainlyButtonVariant.ERROR,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg)
                    .height(48.dp),
                isLoading = state.isLoggingOut
            )

            Spacer(Modifier.height(Spacing.xxl))
        }
    }
}

@Composable
private fun SettingsItem(
    icon: String,
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable {}
            .padding(Spacing.lg),
        verticalAlignment = Alignment.CenterVertically
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
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Text(
            text = "\u203A",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            style = MaterialTheme.typography.titleLarge
        )
    }
}
