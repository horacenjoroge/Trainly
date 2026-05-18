package com.trainly.app.ui.features.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.cards.TrainlyMetricCard
import com.trainly.app.ui.designsystem.cards.TrainlySectionCard
import com.trainly.app.ui.designsystem.components.buttons.TrainlyIconButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyTextButton
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyDashboardLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.ui.features.home.HomeUiState
import com.trainly.app.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    snackbarHostState: SnackbarHostState,
    onStats: () -> Unit,
    onProfile: () -> Unit,
    onTrain: () -> Unit,
    onWorkoutHistory: () -> Unit,
    onCommunity: () -> Unit,
    vm: HomeViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    val likedIds by vm.likedPostIds.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Trainly",
        topBarStyle = TopBarStyle.DEFAULT,
        topBarActions = {
            TrainlyIconButton(
                onClick = { },
                contentDescription = "Notifications"
            ) {
                Text("\uD83D\uDD14")
            }
            TrainlyIconButton(
                onClick = onProfile,
                contentDescription = "Profile"
            ) {
                Text("\uD83D\uDC64")
            }
        },
        snackbarHostState = snackbarHostState
    ) { padding ->
        when (val st = state) {
            is UiState.Loading -> {
                TrainlyLoading(
                    message = "Loading your dashboard...",
                    modifier = Modifier.padding(padding)
                )
            }
            is UiState.Success -> {
                val data = st.data
                TrainlyDashboardLayout(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                ) {
                    TrainlySectionCard(title = "My Progress") {
                        Text(
                            text = "${data.progressStats.totalWorkouts} workouts",
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.headlineSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "${data.progressStats.totalDuration}h total",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        TrainlyTextButton(onClick = onStats) {
                            Text(
                                "View Stats",
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                    ) {
                        TrainlyCard(
                            onClick = onTrain,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(Spacing.lg),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "\u25B6\uFE0F",
                                    style = MaterialTheme.typography.titleLarge
                                )
                                Spacer(Modifier.height(Spacing.xs))
                                Text(
                                    text = "Start Training",
                                    fontWeight = FontWeight.SemiBold,
                                    style = MaterialTheme.typography.labelLarge
                                )
                            }
                        }

                        TrainlyCard(
                            onClick = onWorkoutHistory,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(Spacing.lg),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "\uD83D\uDCCB",
                                    style = MaterialTheme.typography.titleLarge
                                )
                                Spacer(Modifier.height(Spacing.xs))
                                Text(
                                    text = "History",
                                    fontWeight = FontWeight.SemiBold,
                                    style = MaterialTheme.typography.labelLarge
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Community Feed",
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(Modifier.weight(1f))
                        TrainlyTextButton(onClick = onCommunity) {
                            Text(
                                text = "See All",
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }

                    if (data.posts.isEmpty()) {
                        com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty(
                            icon = "\uD83D\uDC4B",
                            title = "No posts yet",
                            subtitle = "Be the first to share!"
                        )
                    } else {
                        val topPosts = data.posts.take(3)
                        for (post in topPosts) {
                            com.trainly.app.ui.features.social.PostCard(
                                post = post,
                                isLiked = likedIds.contains(post.id),
                                onLike = { vm.likePost(post.id) },
                                onComment = {},
                                onUser = {}
                            )
                        }
                    }

                    Spacer(Modifier.height(Spacing.xxl))
                }
            }
            is UiState.Error -> {
                TrainlyError(
                    message = st.message,
                    onRetry = { vm.loadData() },
                    modifier = Modifier.padding(padding)
                )
            }
        }
    }
}
