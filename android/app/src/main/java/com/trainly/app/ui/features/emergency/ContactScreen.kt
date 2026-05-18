package com.trainly.app.ui.features.emergency

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.foundation.lazy.items
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyIconButton
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.dialogs.TrainlyFormDialog
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyFeedLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.ContentPadding
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.ContactsViewModel

@Composable
fun ContactScreen(
    onNavigateBack: () -> Unit,
    viewModel: ContactsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Emergency Contacts",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onNavigateBack,
        topBarStyle = TopBarStyle.DEFAULT,
        topBarActions = {
            TrainlyIconButton(
                onClick = { viewModel.showAddDialog() },
                contentDescription = "Add contact"
            ) {
                Text("+", style = MaterialTheme.typography.titleLarge)
            }
        }
    ) { padding ->
        if (uiState.contacts.isEmpty()) {
            TrainlyEmpty(
                icon = "\uD83D\uDCDE",
                title = "No contacts",
                actionLabel = "Add Contact",
                onAction = { viewModel.showAddDialog() }
            )
        } else {
            TrainlyFeedLayout(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            ) {
                items(uiState.contacts) { contact ->
                    TrainlyCard {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(ContentPadding.card),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = contact.name ?: "",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleSmall
                                )
                                Text(
                                    text = contact.phone ?: "",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            TrainlyIconButton(
                                onClick = { contact.id?.let { viewModel.deleteContact(it) } },
                                contentDescription = "Delete contact"
                            ) {
                                Text("\u2716")
                            }
                        }
                    }
                }
            }
        }
    }

    if (uiState.showDialog) {
        TrainlyFormDialog(
            title = "Add Contact",
            onDismiss = { viewModel.dismissDialog() },
            onConfirm = { viewModel.saveContact() },
            confirmText = "Save",
            confirmEnabled = uiState.name.isNotBlank() && uiState.phone.isNotBlank()
        ) {
            Column {
                TrainlyTextField(
                    value = uiState.name,
                    onValueChange = { viewModel.updateName(it) },
                    label = "Name"
                )
                Spacer(Modifier.height(Spacing.md))
                TrainlyTextField(
                    value = uiState.phone,
                    onValueChange = { viewModel.updatePhone(it) },
                    label = "Phone"
                )
            }
        }
    }
}
