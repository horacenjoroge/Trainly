package com.trainly.app.ui.features.profile

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
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
import com.trainly.app.ui.designsystem.components.buttons.TrainlyTextButton
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyFormLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.PersonalInfoViewModel

@Composable
fun PersonalInfoScreen(
    onBack: () -> Unit,
    vm: PersonalInfoViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Personal Info",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onBack,
        topBarStyle = TopBarStyle.DEFAULT,
        topBarActions = {
            TrainlyTextButton(
                onClick = { vm.save() }
            ) {
                Text(
                    text = "Save",
                    fontWeight = FontWeight.Bold
                )
            }
        }
    ) { padding ->
        if (state.isLoading) {
            com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading(
                modifier = Modifier.padding(padding)
            )
        } else {
            TrainlyFormLayout {
                TrainlyTextField(
                    value = state.name,
                    onValueChange = { vm.updateName(it) },
                    label = "Name",
                    singleLine = true
                )
                Spacer(Modifier.height(Spacing.md))
                TrainlyTextField(
                    value = state.bio,
                    onValueChange = { vm.updateBio(it) },
                    label = "Bio",
                    singleLine = false,
                    minLines = 3
                )
            }
        }
    }
}
