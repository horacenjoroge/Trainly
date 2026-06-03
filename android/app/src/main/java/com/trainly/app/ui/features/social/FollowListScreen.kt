package com.trainly.app.ui.features.social

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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.FollowListViewModel

private val FlBg = Color(0xFFFBFBF9)
private val FlFg = Color(0xFF1C293C)
private val FlMuted = Color(0xFF5A6B7E)
private val FlAccent = Color(0xFFFDC800)

private val avatarColors = listOf(
    Color(0xFF432DD7), Color(0xFF16A34A), Color(0xFFD97706),
    Color(0xFFDC2626), Color(0xFFFDC800), Color(0xFF0891B2),
    Color(0xFF7C3AED), Color(0xFFDB2777)
)

private fun initials(name: String?): String {
    if (name.isNullOrBlank()) return "?"
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

@Composable
fun FollowersListScreen(
    onNavigateBack: () -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: FollowListViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) { viewModel.load() }
    FollowListContent(
        initialTab = 0,
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
    LaunchedEffect(Unit) { viewModel.load() }
    FollowListContent(
        initialTab = 1,
        onNavigateBack = onNavigateBack,
        onUserClick = onUserClick,
        viewModel = viewModel
    )
}

@Composable
private fun FollowListContent(
    initialTab: Int,
    onNavigateBack: () -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: FollowListViewModel
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val followedIds by viewModel.followedIds.collectAsStateWithLifecycle()
    var selectedTab by rememberSaveable { mutableIntStateOf(initialTab) }

    val title = if (selectedTab == 0) "Followers" else "Following"
    val users = if (selectedTab == 0) state.followers else state.following
    val count = users.size

    Box(modifier = Modifier.fillMaxSize().background(FlBg)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(FlBg)
                    .border(3.dp, FlFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, FlFg)
                        .background(FlBg)
                        .clickable { onNavigateBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = FlFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = title,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = FlFg
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(3.dp, FlFg)
            ) {
                TabItem(
                    text = "Followers $count",
                    isActive = selectedTab == 0,
                    modifier = Modifier.weight(1f),
                    onClick = { selectedTab = 0 }
                )
                TabItem(
                    text = "Following $count",
                    isActive = selectedTab == 1,
                    modifier = Modifier.weight(1f),
                    onClick = { selectedTab = 1 }
                )
            }

            if (state.loading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Loading...", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = FlMuted)
                }
            } else if (users.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No users",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = FlMuted
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(
                        horizontal = Spacing.lg,
                        vertical = Spacing.md
                    ),
                    verticalArrangement = Arrangement.spacedBy(Spacing.sm)
                ) {
                    items(users) { user ->
                        val isFl = followedIds.contains(user.id)
                        val init = initials(user.name)
                        val colorIdx = user.id?.hashCode()?.let { kotlin.math.abs(it) % avatarColors.size } ?: 0
                        val avColor = avatarColors[colorIdx]
                        val avTextColor = if (avColor == FlAccent) FlFg else Color.White

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(2.dp, FlFg)
                                .background(FlBg)
                                .clickable { user.id?.let { onUserClick(it) } }
                                .padding(horizontal = Spacing.md, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .border(2.dp, FlFg)
                                    .background(avColor),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = init,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Black,
                                    color = avTextColor
                                )
                            }
                            Spacer(Modifier.width(Spacing.md))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = user.name ?: "Unknown",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = FlFg
                                )
                                if (!user.bio.isNullOrBlank()) {
                                    Text(
                                        text = user.bio ?: "",
                                        fontSize = 11.sp,
                                        color = FlMuted
                                    )
                                }
                            }
                            Box(
                                modifier = Modifier
                                    .border(2.dp, FlFg)
                                    .background(if (isFl) FlAccent else FlBg)
                                    .clickable { user.id?.let { viewModel.toggleFollow(it) } }
                                    .padding(horizontal = Spacing.lg, vertical = 4.dp)
                            ) {
                                Text(
                                    text = if (isFl) "Following" else "Follow",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Black,
                                    color = FlFg
                                )
                            }
                        }
                    }
                    item { Spacer(Modifier.height(Spacing.md)) }
                }
            }
        }
    }
}

@Composable
private fun TabItem(
    text: String,
    isActive: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .background(if (isActive) FlAccent else FlBg)
            .clickable { onClick() }
            .padding(vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = FlFg
        )
    }
}

@Preview
@Composable
private fun FollowersListScreenPreview() {
    TrainlyTheme { FollowersListScreen(onNavigateBack = {}, onUserClick = {}) }
}
