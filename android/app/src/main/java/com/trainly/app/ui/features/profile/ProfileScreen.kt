package com.trainly.app.ui.features.profile

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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.cards.TrainlyCard
import com.trainly.app.ui.designsystem.cards.TrainlyMetricCard
import com.trainly.app.ui.designsystem.cards.TrainlySectionCard
import com.trainly.app.ui.designsystem.components.buttons.TrainlyIconButton
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.components.media.TrainlyAvatar
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyDashboardLayout
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.IconSize
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.ui.features.profile.ProfileUiState
import com.trainly.app.viewmodel.ProfileViewModel

@Composable
fun ProfileScreen(
    snackbarHostState: SnackbarHostState,
    onSettings: () -> Unit,
    onWorkoutHistory: () -> Unit = {},
    onAchievements: () -> Unit = {},
    onStats: () -> Unit = {},
    vm: ProfileViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    TrainlyScaffold(
        topBarTitle = "Profile",
        topBarStyle = TopBarStyle.DEFAULT,
        topBarActions = {
            TrainlyIconButton(
                onClick = onSettings,
                contentDescription = "Settings"
            ) {
                Text("\u2699\uFE0F")
            }
        },
        snackbarHostState = snackbarHostState
    ) { padding ->
        when (val st = state) {
            is UiState.Loading -> {
                TrainlyLoading(modifier = Modifier.padding(padding))
            }
            is UiState.Success -> {
                val data = st.data
                TrainlyDashboardLayout(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(Spacing.xl),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        TrainlyAvatar(
                            imageUrl = data.avatar,
                            name = data.userName,
                            size = IconSize.hero
                        )
                        Spacer(Modifier.height(Spacing.md))
                        Text(
                            text = data.userName,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = data.userBio,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center,
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Spacer(Modifier.height(Spacing.lg))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "${data.followers}",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "Followers",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "${data.following}",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "Following",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "${data.workouts}",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "Workouts",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                    ) {
                        TrainlyCard(
                            onClick = onWorkoutHistory,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(Spacing.md),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text("\uD83D\uDCCB", style = MaterialTheme.typography.titleLarge)
                                Spacer(Modifier.height(Spacing.xs))
                                Text("History", style = MaterialTheme.typography.bodySmall)
                            }
                        }
                        TrainlyCard(
                            onClick = onAchievements,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(Spacing.md),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text("\uD83C\uDFC6", style = MaterialTheme.typography.titleLarge)
                                Spacer(Modifier.height(Spacing.xs))
                                Text("Achievements", style = MaterialTheme.typography.bodySmall)
                            }
                        }
                        TrainlyCard(
                            onClick = onStats,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(Spacing.md),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text("\uD83D\uDCCA", style = MaterialTheme.typography.titleLarge)
                                Spacer(Modifier.height(Spacing.xs))
                                Text("Stats", style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }

                    TrainlySectionCard(title = "Quick Stats") {
                        Row(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "\uD83D\uDD25 Calories",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = "${data.calories}",
                                    fontWeight = FontWeight.SemiBold,
                                    style = MaterialTheme.typography.titleSmall
                                )
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "\u23F1 Hours",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = "${data.hours}h",
                                    fontWeight = FontWeight.SemiBold,
                                    style = MaterialTheme.typography.titleSmall
                                )
                            }
                        }
                    }
                }
            }
            is UiState.Error -> {
                TrainlyError(
                    message = st.message,
                    onRetry = { vm.loadProfile() },
                    modifier = Modifier.padding(padding)
                )
            }
        }
    }
}
