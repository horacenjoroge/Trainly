package com.trainly.app.ui.features.social

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.foundation.lazy.items
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.components.inputs.TrainlySearchBar
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyFeedLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.CommunityFeedUiState
import com.trainly.app.viewmodel.CommunityFeedViewModel

@Composable
fun CommunityFeedScreen(
    snackbarHostState: SnackbarHostState,
    onCreatePost: () -> Unit,
    onComment: (String) -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: CommunityFeedViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val likedIds by viewModel.likedPostIds.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Community",
        topBarStyle = TopBarStyle.DEFAULT,
        topBarActions = {
            TrainlyButton(
                text = "+",
                onClick = onCreatePost,
                modifier = Modifier.padding(end = Spacing.sm)
            )
        },
        snackbarHostState = snackbarHostState
    ) { padding ->
        when (val st = uiState) {
            is CommunityFeedUiState.Loading -> {
                TrainlyLoading(modifier = Modifier.padding(padding))
            }
            is CommunityFeedUiState.Success -> {
                Column(modifier = Modifier.fillMaxSize().padding(padding)) {
                    TrainlySearchBar(
                        query = "",
                        onQueryChange = { viewModel.search(it) },
                        placeholder = "Search users..."
                    )

                    if (st.posts.isEmpty()) {
                        TrainlyEmpty(
                            icon = "\uD83D\uDC4B",
                            title = "No posts yet",
                            subtitle = "Be the first to share!"
                        )
                    } else {
                        TrainlyFeedLayout {
                            items(st.posts) { post ->
                                PostCard(
                                    post = post,
                                    isLiked = likedIds.contains(post.id),
                                    onLike = { viewModel.likePost(post.id) },
                                    onComment = { onComment(post.id) },
                                    onUser = { onUserClick(post.userId) }
                                )
                            }
                        }
                    }
                }
            }
            is CommunityFeedUiState.Error -> {
                TrainlyError(
                    message = st.message,
                    onRetry = { viewModel.loadPosts() },
                    modifier = Modifier.padding(padding)
                )
            }
        }
    }
}
