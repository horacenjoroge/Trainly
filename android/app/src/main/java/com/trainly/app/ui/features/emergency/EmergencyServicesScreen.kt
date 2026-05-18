package com.trainly.app.ui.features.emergency

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant
import com.trainly.app.ui.designsystem.components.buttons.TrainlyTextButton
import com.trainly.app.ui.designsystem.components.indicators.TrainlyCircularLoader
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.ContentPadding
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.viewmodel.EmergencyViewModel

@Composable
fun EmergencyServicesScreen(
    onBack: () -> Unit,
    onContacts: () -> Unit,
    vm: EmergencyViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Safety",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onBack,
        topBarStyle = TopBarStyle.DEFAULT
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                TrainlyButton(
                    text = if (state.isSendingSos) "" else "SOS",
                    onClick = { vm.sendSos() },
                    enabled = !state.isSendingSos,
                    modifier = Modifier.size(160.dp),
                    variant = TrainlyButtonVariant.ERROR
                )
                if (state.isSendingSos) {
                    TrainlyCircularLoader(
                        modifier = Modifier.size(24.dp),
                        size = 24.dp,
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.onError
                    )
                }
            }

            TrainlyCard {
                Column(modifier = Modifier.padding(ContentPadding.card)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Location Tracking",
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = if (state.isLocationActive) "Active" else "Inactive",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Switch(
                            checked = state.isLocationActive,
                            onCheckedChange = { vm.toggleLocationTracking() }
                        )
                    }
                }
            }

            TrainlyCard {
                Column(modifier = Modifier.padding(ContentPadding.card)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Emergency Contacts",
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = "${state.contacts.size} contacts",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        TrainlyTextButton(onClick = onContacts) {
                            Text(
                                text = "Manage",
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}
