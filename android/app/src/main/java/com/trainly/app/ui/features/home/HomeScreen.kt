package com.trainly.app.ui.features.home

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
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.ui.features.social.PostCard
import com.trainly.app.viewmodel.HomeViewModel

private val HomeBg = Color(0xFFFBFBF9)
private val HomeFg = Color(0xFF1C293C)
private val HomeMuted = Color(0xFF5A6B7E)
private val HomeAccent = Color(0xFFFDC800)
private val BorderW = 3.dp
private val ShadowA = 5.dp
private val ShadowB = 4.dp

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
        topBarStyle = TopBarStyle.NONE,
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
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .background(HomeBg)
                        .verticalScroll(rememberScrollState())
                ) {
                    HomeTopBar(onProfile = onProfile)

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = Spacing.lg),
                        verticalArrangement = Arrangement.spacedBy(Spacing.lg)
                    ) {
                        ProgressCard(
                            totalWorkouts = data.progressStats.totalWorkouts,
                            totalDuration = data.progressStats.totalDuration,
                            totalCalories = data.progressStats.totalCalories,
                            onViewStats = onStats
                        )

                        QuickActions(
                            onStartTraining = onTrain,
                            onHistory = onWorkoutHistory
                        )

                        SectionHeader(
                            label = "Community Feed",
                            actionText = "See All",
                            onAction = onCommunity
                        )

                        if (data.posts.isEmpty()) {
                            TrainlyEmpty(
                                icon = "\uD83D\uDC4B",
                                title = "No posts yet",
                                subtitle = "Be the first to share!"
                            )
                        } else {
                            data.posts.take(3).forEach { post ->
                                PostCard(
                                    post = post,
                                    isLiked = likedIds.contains(post.id),
                                    onLike = { vm.likePost(post.id) },
                                    onComment = {},
                                    onUser = {}
                                )
                                Spacer(Modifier.height(Spacing.md))
                            }
                        }

                        Spacer(Modifier.height(Spacing.lg))
                    }
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

@Composable
private fun HomeTopBar(onProfile: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(HomeBg)
            .border(BorderW, HomeFg)
            .padding(horizontal = Spacing.lg, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(10.dp)
                .rotate(12f)
                .background(HomeAccent)
                .border(2.dp, HomeFg)
        )
        Spacer(Modifier.width(8.dp))
        Text(
            text = "Trainly",
            fontSize = 21.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = (-0.02).sp,
            color = HomeFg,
            modifier = Modifier.weight(1f)
        )
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.md)) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .border(2.dp, HomeFg)
                    .background(HomeBg),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "\uD83D\uDD14", fontSize = 14.sp)
            }
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .border(2.dp, HomeFg)
                    .background(HomeBg)
                    .clickable { onProfile() },
                contentAlignment = Alignment.Center
            ) {
                Text(text = "\uD83D\uDC64", fontSize = 14.sp)
            }
        }
    }
}

@Composable
private fun ProgressCard(
    totalWorkouts: Int,
    totalDuration: Int,
    totalCalories: Int,
    onViewStats: () -> Unit
) {
    Box(modifier = Modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = ShadowA, y = ShadowA)
                .background(HomeFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(HomeBg)
                .border(BorderW, HomeFg)
                .padding(Spacing.lg)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "My Progress",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = HomeFg,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = "View Stats \u2192",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = HomeFg,
                    modifier = Modifier.clickable { onViewStats() }
                )
            }

            Spacer(Modifier.height(Spacing.md))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                StatCell(
                    value = {
                        Text(
                            "$totalWorkouts",
                            fontSize = 27.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-0.02).sp,
                            color = HomeAccent
                        )
                    },
                    label = "WORKOUTS",
                    modifier = Modifier.weight(1f)
                )
                StatCell(
                    value = {
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                "${totalDuration / 60}",
                                fontSize = 27.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-0.02).sp,
                                color = HomeFg
                            )
                            Text(
                                "h",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = HomeMuted,
                                modifier = Modifier.padding(bottom = 3.dp)
                            )
                        }
                    },
                    label = "TOTAL TIME",
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(Modifier.height(Spacing.sm))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(2.dp, HomeFg)
                    .padding(horizontal = Spacing.md, vertical = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            "$totalCalories",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-0.02).sp,
                            color = HomeFg
                        )
                        Text(
                            "CALORIES BURNED",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = HomeMuted,
                            letterSpacing = 0.04.sp
                        )
                    }
                    Text(
                        "\uD83D\uDD25 on fire",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = HomeMuted
                    )
                }
            }
        }
    }
}

@Composable
private fun StatCell(
    value: @Composable () -> Unit,
    label: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .border(2.dp, HomeFg)
            .padding(Spacing.md),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        value()
        Spacer(Modifier.height(4.dp))
        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = HomeMuted,
            letterSpacing = 0.04.sp
        )
    }
}

@Composable
private fun QuickActions(
    onStartTraining: () -> Unit,
    onHistory: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(Spacing.md)
    ) {
        QuickActionCard(
            icon = "\u25B6",
            iconBg = HomeAccent,
            label = "Start Training",
            onClick = onStartTraining,
            modifier = Modifier.weight(1f)
        )
        QuickActionCard(
            icon = "\uD83D\uDCCB",
            iconBg = HomeBg,
            label = "History",
            onClick = onHistory,
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun QuickActionCard(
    icon: String,
    iconBg: Color,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.clickable { onClick() }) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = ShadowB, y = ShadowB)
                .background(HomeFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(HomeBg)
                .border(BorderW, HomeFg)
                .padding(Spacing.lg),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(Spacing.sm)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .border(2.dp, HomeFg)
                    .background(iconBg),
                contentAlignment = Alignment.Center
            ) {
                Text(text = icon, fontSize = 20.sp)
            }
            Text(
                text = label,
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                color = HomeFg
            )
        }
    }
}

@Composable
private fun SectionHeader(
    label: String,
    actionText: String,
    onAction: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label.uppercase(),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.06.sp,
            color = HomeMuted,
            modifier = Modifier.weight(1f)
        )
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.clickable { onAction() }
        ) {
            Text(
                text = actionText,
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                color = HomeFg
            )
            Box(
                modifier = Modifier
                    .width(32.dp)
                    .height(2.dp)
                    .background(HomeAccent)
            )
        }
    }
}

@Preview
@Composable
private fun HomeScreenPreview() {
    TrainlyTheme {
        HomeScreen(
            snackbarHostState = SnackbarHostState(),
            onStats = {},
            onProfile = {},
            onTrain = {},
            onWorkoutHistory = {},
            onCommunity = {}
        )
    }
}
