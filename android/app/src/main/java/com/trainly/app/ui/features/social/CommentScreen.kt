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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
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
import com.trainly.app.data.remote.dto.CommentDto
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.utils.DateUtils
import com.trainly.app.viewmodel.CommentsViewModel

private val CmBg = Color(0xFFFBFBF9)
private val CmFg = Color(0xFF1C293C)
private val CmMuted = Color(0xFF5A6B7E)
private val CmAccent = Color(0xFFFDC800)
private val CmBorderW = 3.dp
private val CmShadow = 4.dp

private val commenterColors = listOf(
    Color(0xFFFDC800),
    Color(0xFF432DD7),
    Color(0xFF16A34A),
    Color(0xFFDC2626),
    Color(0xFFD97706),
    Color(0xFF2979FF)
)

private fun initials(name: String): String {
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

private fun avatarColor(name: String): Color {
    val idx = kotlin.math.abs(name.hashCode()) % commenterColors.size
    return commenterColors[idx]
}

@Composable
fun CommentScreen(
    postId: String,
    onNavigateBack: () -> Unit,
    viewModel: CommentsViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(postId) { viewModel.loadComments(postId) }

    Box(modifier = Modifier.fillMaxSize().background(CmBg)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CmBg)
                    .border(CmBorderW, CmFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, CmFg)
                        .background(CmBg)
                        .clickable { onNavigateBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = CmFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = "Comments",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = CmFg
                )
            }

            when {
                state.isLoading && state.comments.isEmpty() -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(
                            text = "Loading...",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = CmMuted
                        )
                    }
                }
                state.error != null && state.comments.isEmpty() -> {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(state.error ?: "", fontSize = 15.sp, color = CmMuted)
                        Spacer(Modifier.height(Spacing.md))
                        Box(
                            modifier = Modifier
                                .border(2.dp, CmFg)
                                .background(CmBg)
                                .clickable { viewModel.loadComments(postId) }
                                .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                        ) {
                            Text("Retry", fontWeight = FontWeight.Bold, color = CmFg)
                        }
                    }
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(
                            horizontal = Spacing.lg,
                            vertical = Spacing.md
                        ),
                        verticalArrangement = Arrangement.spacedBy(Spacing.md)
                    ) {
                        item {
                            Text(
                                text = "\uD83D\uDCAC ${state.comments.size} comments",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = CmMuted
                            )
                        }

                        if (state.comments.isEmpty()) {
                            item {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 48.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(text = "\uD83D\uDCAC", fontSize = 48.sp)
                                    Spacer(Modifier.height(Spacing.md))
                                    Text(
                                        text = "No comments yet",
                                        fontSize = 17.sp,
                                        fontWeight = FontWeight.Black,
                                        color = CmFg
                                    )
                                    Spacer(Modifier.height(Spacing.sm))
                                    Text(
                                        text = "Be the first to comment!",
                                        fontSize = 13.sp,
                                        color = CmMuted,
                                        textAlign = TextAlign.Center
                                    )
                                }
                            }
                        } else {
                            items(state.comments) { comment ->
                                CommentCard(comment = comment)
                            }
                        }

                        item { Spacer(Modifier.height(8.dp)) }
                    }
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CmBg)
                    .border(CmBorderW, CmFg)
                    .padding(Spacing.md),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.weight(1f)) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .offset(x = CmShadow, y = CmShadow)
                            .background(CmFg)
                    )
                    BasicTextField(
                        value = state.newComment,
                        onValueChange = { viewModel.updateComment(it) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(CmBg)
                            .border(CmBorderW, CmFg)
                            .padding(Spacing.md),
                        textStyle = androidx.compose.ui.text.TextStyle(
                            fontSize = 14.sp,
                            color = CmFg
                        ),
                        cursorBrush = SolidColor(CmFg),
                        decorationBox = { innerTextField ->
                            Box {
                                if (state.newComment.isEmpty()) {
                                    Text(
                                        "Write a comment...",
                                        fontSize = 14.sp,
                                        color = CmMuted
                                    )
                                }
                                innerTextField()
                            }
                        }
                    )
                }
                Spacer(Modifier.width(8.dp))
                Box(modifier = Modifier) {
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .offset(x = CmShadow, y = CmShadow)
                            .background(CmFg)
                    )
                    Box(
                        modifier = Modifier
                            .background(CmAccent)
                            .border(CmBorderW, CmFg)
                            .clickable { viewModel.addComment(postId) }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.md)
                    ) {
                        Text(
                            text = "Send",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Black,
                            color = CmFg
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CommentCard(comment: CommentDto) {
    val name = comment.userId?.name ?: "User"
    val init = initials(name)
    val color = avatarColor(name)
    val isDark = color == Color(0xFF432DD7) || color == Color(0xFF16A34A) ||
        color == Color(0xFFDC2626) || color == Color(0xFFD97706) ||
        color == Color(0xFF2979FF)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(2.dp, CmFg)
            .background(CmBg)
            .padding(Spacing.md)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .border(2.dp, CmFg)
                    .background(color),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = init,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = if (isDark) Color.White else CmFg
                )
            }
            Spacer(Modifier.width(8.dp))
            Text(
                text = name,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = CmFg,
                modifier = Modifier.weight(1f)
            )
            Text(
                text = DateUtils.formatTimeAgo(comment.createdAt),
                fontSize = 11.sp,
                color = CmMuted
            )
        }
        Spacer(Modifier.height(6.dp))
        Text(
            text = comment.text ?: "",
            fontSize = 13.sp,
            lineHeight = 19.5.sp,
            color = CmFg
        )
        Spacer(Modifier.height(6.dp))
        Row(
            horizontalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Text(
                text = "\u2764\uFE0F 0",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = CmMuted
            )
            Text(
                text = "Reply",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = CmMuted
            )
        }
    }
}

@Preview
@Composable
private fun CommentScreenPreview() {
    TrainlyTheme { CommentScreen(postId = "1", onNavigateBack = {}) }
}
