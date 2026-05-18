package com.trainly.app.ui.features.social

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.foundation.lazy.items
import com.trainly.app.ui.designsystem.cards.TrainlyListItemCard
import com.trainly.app.ui.designsystem.components.feedback.TrainlyEmpty
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyFeedLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.AchievementsUiState
import com.trainly.app.viewmodel.AchievementsViewModel

@Composable
fun AchievementsScreen(
    onNavigateBack: () -> Unit,
    viewModel: AchievementsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Achievements",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onNavigateBack,
        topBarStyle = TopBarStyle.DEFAULT
    ) { padding ->
        when (val st = uiState) {
            is AchievementsUiState.Loading -> {
                TrainlyLoading(modifier = Modifier.padding(padding))
            }
            is AchievementsUiState.Error -> {
                TrainlyError(
                    message = st.message,
                    onRetry = { viewModel.load() },
                    modifier = Modifier.padding(padding)
                )
            }
            is AchievementsUiState.Success -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                ) {
                    TabRow(
                        selectedTabIndex = when (st.selectedTab) {
                            "earned" -> 0
                            "progress" -> 1
                            else -> 2
                        },
                        containerColor = MaterialTheme.colorScheme.surface,
                        contentColor = MaterialTheme.colorScheme.primary
                    ) {
                        Tab(
                            selected = st.selectedTab == "earned",
                            onClick = { viewModel.selectTab("earned") }
                        ) {
                            Text(
                                text = "\uD83C\uDFC6 Earned",
                                modifier = Modifier.padding(Spacing.md),
                                fontWeight = if (st.selectedTab == "earned") FontWeight.SemiBold else FontWeight.Normal
                            )
                        }
                        Tab(
                            selected = st.selectedTab == "progress",
                            onClick = { viewModel.selectTab("progress") }
                        ) {
                            Text(
                                text = "\uD83D\uDCC8 Progress",
                                modifier = Modifier.padding(Spacing.md),
                                fontWeight = if (st.selectedTab == "progress") FontWeight.SemiBold else FontWeight.Normal
                            )
                        }
                        Tab(
                            selected = st.selectedTab == "leaderboard",
                            onClick = { viewModel.selectTab("leaderboard") }
                        ) {
                            Text(
                                text = "\uD83C\uDFC6 Leaderboard",
                                modifier = Modifier.padding(Spacing.md),
                                fontWeight = if (st.selectedTab == "leaderboard") FontWeight.SemiBold else FontWeight.Normal
                            )
                        }
                    }

                    when (st.selectedTab) {
                        "earned" -> {
                            if (st.achievements.isEmpty()) {
                                TrainlyEmpty(
                                    icon = "\uD83C\uDFC6",
                                    title = "No achievements yet"
                                )
                            } else {
                                TrainlyFeedLayout {
                                    items(st.achievements) { achievement ->
                                        TrainlyListItemCard(
                                            icon = achievement.icon,
                                            title = achievement.name,
                                            subtitle = achievement.description
                                        )
                                    }
                                }
                            }
                        }
                        else -> {
                            TrainlyEmpty(
                                icon = "\uD83D\uDCC8",
                                title = "Coming soon"
                            )
                        }
                    }
                }
            }
        }
    }
}
