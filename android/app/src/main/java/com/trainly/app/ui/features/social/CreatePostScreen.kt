package com.trainly.app.ui.features.social

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.components.buttons.TrainlyTextButton
import com.trainly.app.ui.designsystem.components.feedback.TrainlyErrorBanner
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.CreatePostViewModel

@Composable
fun CreatePostScreen(
    onBack: () -> Unit,
    viewModel: CreatePostViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) {
        viewModel.postCreated.collect { created ->
            if (created) onBack()
        }
    }

    TrainlyScaffold(
        topBarTitle = "Create Post",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onBack,
        topBarStyle = TopBarStyle.DEFAULT,
        topBarActions = {
            TrainlyTextButton(
                onClick = { viewModel.create() },
                enabled = !state.isLoading && state.content.isNotBlank()
            ) {
                Text(
                    text = "Share",
                    fontWeight = FontWeight.Bold
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(Spacing.lg)
        ) {
            state.error?.let { error ->
                TrainlyErrorBanner(message = error)
                Spacer(Modifier.height(Spacing.md))
            }

            TrainlyTextField(
                value = state.content,
                onValueChange = { viewModel.update(it) },
                label = "Post content",
                placeholder = "What's on your mind?",
                minLines = 5,
                singleLine = false
            )

            if (state.isLoading) {
                Spacer(Modifier.height(Spacing.lg))
                TrainlyLoading(message = "Posting...")
            }
        }
    }
}
