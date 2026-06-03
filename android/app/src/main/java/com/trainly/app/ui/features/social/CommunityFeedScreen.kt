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
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.viewmodel.CommunityFeedUiState
import com.trainly.app.viewmodel.CommunityFeedViewModel
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

private val CmBg = Color(0xFFFBFBF9)
private val CmFg = Color(0xFF1C293C)
private val CmMuted = Color(0xFF5A6B7E)
private val CmBorderW = 3.dp
private val CmShadow = 4.dp

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
    var searchQuery by remember { mutableStateOf("") }

    Box(modifier = Modifier.fillMaxSize().background(CmBg)) {
        when (val st = uiState) {
            is CommunityFeedUiState.Loading -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Loading...", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = CmMuted)
                }
            }
            is CommunityFeedUiState.Error -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(st.message, fontSize = 15.sp, color = CmMuted)
                    Spacer(Modifier.height(Spacing.md))
                    Box(
                        modifier = Modifier
                            .border(2.dp, CmFg)
                            .background(CmBg)
                            .clickable { viewModel.loadPosts() }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                    ) {
                        Text("Retry", fontWeight = FontWeight.Bold, color = CmFg)
                    }
                }
            }
            is CommunityFeedUiState.Success -> {
                val posts = st.posts
                Column(modifier = Modifier.fillMaxSize()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(CmBg)
                            .border(CmBorderW, CmFg)
                            .padding(horizontal = Spacing.lg, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "\uD83D\uDC65 Community",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = CmFg,
                            modifier = Modifier.weight(1f)
                        )
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .border(2.dp, CmFg)
                                .background(CmBg)
                                .clickable { onCreatePost() },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "+",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = CmFg
                            )
                        }
                    }

                    Spacer(Modifier.height(Spacing.md))

                    Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .offset(x = CmShadow, y = CmShadow)
                                .background(CmFg)
                        )
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(CmBg)
                                .border(CmBorderW, CmFg)
                                .padding(horizontal = Spacing.md),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "\uD83D\uDD0D",
                                fontSize = 14.sp,
                                color = CmMuted
                            )
                            Spacer(Modifier.width(8.dp))
                            BasicTextField(
                                value = searchQuery,
                                onValueChange = {
                                    searchQuery = it
                                    viewModel.search(it)
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(vertical = 12.dp),
                                textStyle = androidx.compose.ui.text.TextStyle(
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = CmFg
                                ),
                                cursorBrush = SolidColor(CmFg),
                                decorationBox = { innerTextField ->
                                    Box {
                                        if (searchQuery.isEmpty()) {
                                            Text(
                                                "Search users...",
                                                fontSize = 14.sp,
                                                fontWeight = FontWeight.Medium,
                                                color = CmMuted
                                            )
                                        }
                                        innerTextField()
                                    }
                                }
                            )
                        }
                    }

                    Spacer(Modifier.height(Spacing.md))

                    if (posts.isEmpty()) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = Spacing.xl, vertical = 48.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(text = "\uD83D\uDC4B", fontSize = 48.sp)
                            Spacer(Modifier.height(Spacing.md))
                            Text(
                                text = "No posts yet",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Black,
                                color = CmFg
                            )
                            Spacer(Modifier.height(Spacing.sm))
                            Text(
                                text = "Be the first to share!",
                                fontSize = 13.sp,
                                color = CmMuted,
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(
                                horizontal = Spacing.lg,
                                vertical = 0.dp
                            ),
                            verticalArrangement = Arrangement.spacedBy(Spacing.md)
                        ) {
                            items(posts) { post ->
                                PostCard(
                                    post = post,
                                    isLiked = likedIds.contains(post.id),
                                    onLike = { viewModel.likePost(post.id) },
                                    onComment = { onComment(post.id) },
                                    onUser = { onUserClick(post.userId) }
                                )
                            }
                            item { Spacer(Modifier.height(Spacing.lg)) }
                        }
                    }
                }
            }
        }
    }
}

@Preview
@Composable
private fun CommunityFeedScreenPreview() {
    TrainlyTheme { CommunityFeedScreen(snackbarHostState = SnackbarHostState(), onCreatePost = {}, onComment = {}, onUserClick = {}) }
}
