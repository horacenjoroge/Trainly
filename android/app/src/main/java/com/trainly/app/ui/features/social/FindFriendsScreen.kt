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
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.FindFriendsViewModel

private val FfBg = Color(0xFFFBFBF9)
private val FfFg = Color(0xFF1C293C)
private val FfMuted = Color(0xFF5A6B7E)
private val FfAccent = Color(0xFFFDC800)
private val FfSuccess = Color(0xFF16A34A)
private val FfBorderW = 3.dp
private val FfShadow = 4.dp

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
fun FindFriendsScreen(
    onNavigateBack: () -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: FindFriendsViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val followedIds by viewModel.followedIds.collectAsStateWithLifecycle()
    var searchQuery by remember { mutableStateOf("") }

    Box(modifier = Modifier.fillMaxSize().background(FfBg)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(FfBg)
                    .border(FfBorderW, FfFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, FfFg)
                        .background(FfBg)
                        .clickable { onNavigateBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = FfFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = "Find Friends",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = FfFg
                )
            }

            Spacer(Modifier.height(Spacing.md))

            Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .offset(x = FfShadow, y = FfShadow)
                        .background(FfFg)
                )
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(FfBg)
                        .border(FfBorderW, FfFg)
                        .padding(horizontal = Spacing.md),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "\uD83D\uDD0D",
                        fontSize = 14.sp,
                        color = FfMuted
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
                            color = FfFg
                        ),
                        cursorBrush = SolidColor(FfFg),
                        decorationBox = { innerTextField ->
                            Box {
                                if (searchQuery.isEmpty()) {
                                    Text(
                                        "Search by name...",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = FfMuted
                                    )
                                }
                                innerTextField()
                            }
                        }
                    )
                }
            }

            Spacer(Modifier.height(Spacing.md))

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    horizontal = Spacing.lg,
                    vertical = 0.dp
                ),
                verticalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                item {
                    Text(
                        text = "Suggested Athletes",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.06.sp,
                        color = FfMuted,
                        modifier = Modifier.padding(bottom = 4.dp)
                    )
                }

                items(state.results) { user ->
                    val isFf = followedIds.contains(user.id)
                    val init = initials(user.name)
                    val colorIdx = user.id?.hashCode()?.let { kotlin.math.abs(it) % avatarColors.size } ?: 0
                    val avColor = avatarColors[colorIdx]
                    val avTextColor = if (avColor == FfAccent) FfFg else Color.White

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(2.dp, FfFg)
                            .background(FfBg)
                            .clickable { user.id?.let { onUserClick(it) } }
                            .padding(Spacing.md),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .border(2.dp, FfFg)
                                .background(avColor),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = init,
                                fontSize = 13.sp,
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
                                color = FfFg
                            )
                            if (!user.bio.isNullOrBlank()) {
                                Text(
                                    text = user.bio ?: "",
                                    fontSize = 12.sp,
                                    color = FfMuted
                                )
                            }
                        }
                        Box(
                            modifier = Modifier
                                .border(2.dp, if (isFf) FfSuccess else FfFg)
                                .background(if (isFf) FfSuccess else FfBg)
                                .clickable { user.id?.let { viewModel.toggleFollow(it) } }
                                .padding(horizontal = Spacing.lg, vertical = 6.dp)
                        ) {
                            Text(
                                text = if (isFf) "Following" else "Follow",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black,
                                color = if (isFf) Color.White else FfFg
                            )
                        }
                    }
                }

                item { Spacer(Modifier.height(Spacing.lg)) }
            }
        }
    }
}

@Preview
@Composable
private fun FindFriendsScreenPreview() {
    TrainlyTheme { FindFriendsScreen(onNavigateBack = {}, onUserClick = {}) }
}
