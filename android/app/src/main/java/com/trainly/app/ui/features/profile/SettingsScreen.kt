package com.trainly.app.ui.features.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.SettingsViewModel

private val StBg = Color(0xFFFBFBF9)
private val StFg = Color(0xFF1C293C)
private val StMuted = Color(0xFF5A6B7E)
private val StAccent = Color(0xFFFDC800)
private val StDanger = Color(0xFFDC2626)

@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    onLogout: () -> Unit,
    onPersonalInfo: () -> Unit = {},
    onEditStats: () -> Unit = {},
    onEmergencyContacts: () -> Unit = {},
    vm: SettingsViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    if (state.showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { vm.dismissLogoutDialog() },
            title = {
                Text("Log Out", fontWeight = FontWeight.Black, color = StFg, fontSize = 17.sp)
            },
            text = {
                Text("Are you sure you want to log out of Trainly?", color = StMuted, fontSize = 14.sp)
            },
            confirmButton = {
                TextButton(onClick = { vm.logout(); onLogout() }) {
                    Text("Log Out", color = StDanger, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { vm.dismissLogoutDialog() }) {
                    Text("Cancel", color = StFg, fontWeight = FontWeight.Bold)
                }
            },
            containerColor = StBg
        )
    }

    Box(modifier = Modifier.fillMaxSize().background(StBg)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(StBg)
                    .border(3.dp, StFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, StFg)
                        .background(StBg)
                        .clickable { onBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = StFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = "Settings",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = StFg
                )
            }

            Spacer(Modifier.height(Spacing.md))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                SectionLabel("Account")

                SettingNavItem(
                    icon = "\uD83D\uDC64",
                    title = "Personal Info",
                    desc = "Name, email, bio",
                    onClick = onPersonalInfo
                )
                SettingNavItem(
                    icon = "\uD83D\uDCCA",
                    title = "Edit Stats",
                    desc = "Height, weight, goals",
                    onClick = onEditStats
                )

                SectionLabel("Preferences")

                SettingNavItem(
                    icon = "\uD83D\uDD14",
                    title = "Notifications",
                    desc = "Workout reminders, social alerts"
                )
                SettingToggleItem(
                    icon = "\uD83C\uDF19",
                    title = "Dark Mode",
                    desc = "Switch to dark theme",
                    isOn = state.darkMode,
                    onToggle = { vm.toggleDarkMode() }
                )
                SettingToggleItem(
                    icon = "\uD83D\uDCE1",
                    title = "GPS Accuracy",
                    desc = "High precision mode",
                    isOn = state.gpsAccuracy,
                    onToggle = { vm.toggleGpsAccuracy() }
                )
                SettingNavItem(
                    icon = "\uD83D\uDCCF",
                    title = "Units",
                    desc = "Metric / Imperial"
                )

                SectionLabel("Privacy & Safety")

                SettingNavItem(
                    icon = "\uD83D\uDEA8",
                    title = "Emergency Contacts",
                    desc = "Manage SOS contacts",
                    iconBg = StDanger,
                    iconFg = Color.White,
                    onClick = onEmergencyContacts
                )
                SettingNavItem(
                    icon = "\uD83D\uDD12",
                    title = "Privacy",
                    desc = "Profile visibility, data sharing"
                )

                SectionLabel("Support")

                SettingNavItem(
                    icon = "\u2753",
                    title = "Help Center",
                    desc = "FAQs, contact support"
                )
                SettingNavItem(
                    icon = "\u2139\uFE0F",
                    title = "About Trainly",
                    desc = "Version 2.0.0"
                )

                Spacer(Modifier.height(Spacing.md))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(3.dp, StDanger)
                        .padding(Spacing.md)
                ) {
                    Column {
                        Text(
                            text = "\u26A0\uFE0F Danger Zone",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Black,
                            color = StDanger
                        )
                        Spacer(Modifier.height(Spacing.sm))
                        SettingItem(
                            icon = "\uD83D\uDEAA",
                            title = "Log Out",
                            desc = null,
                            iconBg = StDanger,
                            iconFg = StDanger,
                            titleColor = StDanger,
                            borderColor = StDanger,
                            onClick = { vm.showLogoutDialog() }
                        )
                    }
                }

                Spacer(Modifier.height(Spacing.xl))
            }
        }
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(
        text = text,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 0.08.sp,
        color = StMuted,
        modifier = Modifier.padding(top = Spacing.md, bottom = 4.dp)
    )
}

@Composable
private fun SettingNavItem(
    icon: String,
    title: String,
    desc: String?,
    iconBg: Color = StBg,
    iconFg: Color = StFg,
    onClick: () -> Unit = {}
) {
    SettingItem(
        icon = icon,
        title = title,
        desc = desc,
        iconBg = iconBg,
        iconFg = iconFg,
        showArrow = true,
        onClick = onClick
    )
}

@Composable
private fun SettingToggleItem(
    icon: String,
    title: String,
    desc: String?,
    isOn: Boolean,
    onToggle: () -> Unit
) {
    SettingItem(
        icon = icon,
        title = title,
        desc = desc,
        showArrow = false,
        trailing = {
            Box(
                modifier = Modifier
                    .width(44.dp)
                    .height(24.dp)
                    .border(2.dp, StFg)
                    .background(if (isOn) StAccent else StBg)
                    .clickable { onToggle() }
                    .padding(2.dp),
                contentAlignment = if (isOn) Alignment.CenterEnd else Alignment.CenterStart
            ) {
                Box(
                    modifier = Modifier
                        .size(16.dp)
                        .background(StFg)
                )
            }
        },
        onClick = onToggle
    )
}

@Composable
private fun SettingItem(
    icon: String,
    title: String,
    desc: String?,
    iconBg: Color = StBg,
    iconFg: Color = StFg,
    titleColor: Color = StFg,
    borderColor: Color = StFg,
    showArrow: Boolean = false,
    trailing: @Composable (() -> Unit)? = null,
    onClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .border(2.dp, borderColor)
            .background(StBg)
            .clickable { onClick() }
            .padding(horizontal = Spacing.md, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .border(2.dp, borderColor)
                .background(iconBg),
            contentAlignment = Alignment.Center
        ) {
            Text(text = icon, fontSize = 16.sp)
        }
        Spacer(Modifier.width(Spacing.md))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = titleColor
            )
            if (desc != null) {
                Text(
                    text = desc,
                    fontSize = 12.sp,
                    color = StMuted
                )
            }
        }
        if (trailing != null) {
            trailing()
        } else if (showArrow) {
            Text(
                text = "\u2192",
                fontSize = 14.sp,
                color = StMuted
            )
        }
    }
}

@Preview
@Composable
private fun SettingsScreenPreview() {
    TrainlyTheme { SettingsScreen(onBack = {}, onLogout = {}) }
}
