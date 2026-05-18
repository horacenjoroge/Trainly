package com.trainly.app.ui.features.social

import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButton
import com.trainly.app.ui.designsystem.components.buttons.TrainlyButtonVariant
import com.trainly.app.ui.designsystem.components.feedback.TrainlyError
import com.trainly.app.ui.designsystem.components.feedback.TrainlyLoading
import com.trainly.app.ui.designsystem.components.media.TrainlyAvatar
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.IconSize
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.viewmodel.UserProfileViewModel

@Composable
fun UserProfileScreen(
    userId: String,
    onNavigateBack: () -> Unit,
    viewModel: UserProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val isFollowing by viewModel.isFollowing.collectAsStateWithLifecycle()

    LaunchedEffect(userId) { viewModel.loadProfile(userId) }

    TrainlyScaffold(
        topBarTitle = "Profile",
        topBarIcon = { Text("\u2190") },
        topBarIconContentDescription = "Go back",
        onTopBarIconClick = onNavigateBack,
        topBarStyle = TopBarStyle.DEFAULT
    ) { padding ->
        when (val st = uiState) {
            is UiState.Loading -> {
                TrainlyLoading(modifier = Modifier.padding(padding))
            }
            is UiState.Error -> {
                TrainlyError(
                    message = st.message,
                    modifier = Modifier.padding(padding)
                )
            }
            is UiState.Success -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(Spacing.xl),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    TrainlyAvatar(
                        imageUrl = st.data.avatar,
                        name = st.data.name ?: "User",
                        size = IconSize.hero
                    )
                    Spacer(Modifier.height(Spacing.lg))
                    Text(
                        text = st.data.name ?: "User",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                    Spacer(Modifier.height(Spacing.lg))
                    TrainlyButton(
                        text = if (isFollowing) "Unfollow" else "Follow",
                        onClick = { viewModel.toggleFollow(userId) },
                        variant = if (isFollowing) TrainlyButtonVariant.OUTLINE
                                  else TrainlyButtonVariant.PRIMARY
                    )
                }
            }
        }
    }
}
