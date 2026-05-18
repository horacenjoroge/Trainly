package com.trainly.app.ui.features.social

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.foundation.lazy.items
import com.trainly.app.ui.designsystem.cards.TrainlyUserCard
import com.trainly.app.ui.designsystem.components.buttons.TrainlyIconButton
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.components.inputs.TrainlyTextField
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyFeedLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.CommentsViewModel
import com.trainly.app.viewmodel.CommentsUiState

@Composable
fun CommentScreen(
    postId: String,
    onNavigateBack: () -> Unit,
    viewModel: CommentsViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(postId) { viewModel.loadComments(postId) }

    TrainlyScaffold(
        topBarTitle = "Comments",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onNavigateBack,
        topBarStyle = TopBarStyle.DEFAULT,
        bottomBar = {
            androidx.compose.material3.Surface(
                tonalElevation = 0.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.md),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TrainlyTextField(
                        value = state.newComment,
                        onValueChange = { viewModel.updateComment(it) },
                        label = "Comment",
                        placeholder = "Comment...",
                        singleLine = true,
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(Modifier.width(Spacing.sm))
                    TrainlyIconButton(
                        onClick = { viewModel.addComment(postId) },
                        contentDescription = "Send comment"
                    ) {
                        Text("\u27A1", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    ) { padding ->
        when {
            state.isLoading && state.comments.isEmpty() -> {
                TrainlyLoading(modifier = Modifier.padding(padding))
            }
            state.error != null -> {
                TrainlyError(
                    message = state.error ?: "",
                    modifier = Modifier.padding(padding)
                )
            }
            state.comments.isEmpty() -> {
                TrainlyEmpty(
                    icon = "\uD83D\uDCAC",
                    title = "No comments yet",
                    subtitle = "Be the first to comment!"
                )
            }
            else -> {
                TrainlyFeedLayout(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                ) {
                    items(state.comments) { comment ->
                        TrainlyUserCard(
                            avatarUrl = comment.userId?.avatar,
                            name = comment.userId?.name ?: "User",
                            subtitle = comment.text ?: ""
                        )
                    }
                }
            }
        }
    }
}
