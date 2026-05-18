package com.trainly.app.ui.features.social

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.cards.TrainlyUserCard
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.viewmodel.FollowListViewModel

@Composable
fun FollowersListScreen(
    onNavigateBack: () -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: FollowListViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) { viewModel.loadFollowers() }
    FollowListContent(
        title = "Followers",
        onNavigateBack = onNavigateBack,
        onUserClick = onUserClick,
        viewModel = viewModel
    )
}

@Composable
fun FollowingListScreen(
    onNavigateBack: () -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: FollowListViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) { viewModel.loadFollowing() }
    FollowListContent(
        title = "Following",
        onNavigateBack = onNavigateBack,
        onUserClick = onUserClick,
        viewModel = viewModel
    )
}

@Composable
private fun FollowListContent(
    title: String,
    onNavigateBack: () -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: FollowListViewModel
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = title,
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onNavigateBack,
        topBarStyle = TopBarStyle.DEFAULT
    ) { padding ->
        if (state.loading) {
            TrainlyLoading(modifier = Modifier.padding(padding))
        } else if (state.users.isEmpty()) {
            TrainlyEmpty(
                icon = "\uD83D\uDC65",
                title = "No users"
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                items(state.users) { user ->
                    TrainlyUserCard(
                        avatarUrl = user.avatar,
                        name = user.name ?: "",
                        onClick = { user.id?.let { onUserClick(it) } }
                    )
                }
            }
        }
    }
}
