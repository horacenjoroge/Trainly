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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
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
import com.trainly.app.ui.designsystem.theme.UiState
import com.trainly.app.viewmodel.UserProfileViewModel

private val PrBg = Color(0xFFFBFBF9)
private val PrFg = Color(0xFF1C293C)
private val PrMuted = Color(0xFF5A6B7E)
private val PrAccent = Color(0xFFFDC800)
private val PrSuccess = Color(0xFF16A34A)
private val PrBorderW = 3.dp
private val PrShadow = 5.dp

private fun initials(name: String?): String {
    if (name.isNullOrBlank()) return "?"
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

@Composable
fun UserProfileScreen(
    userId: String,
    onNavigateBack: () -> Unit,
    viewModel: UserProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val isFollowing by viewModel.isFollowing.collectAsStateWithLifecycle()

    LaunchedEffect(userId) { viewModel.loadProfile(userId) }

    Box(modifier = Modifier.fillMaxSize().background(PrBg)) {
        when (val st = uiState) {
            is UiState.Loading -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Loading...", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = PrMuted)
                }
            }
            is UiState.Error -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(st.message, fontSize = 15.sp, color = PrMuted)
                    Spacer(Modifier.height(Spacing.md))
                    Box(
                        modifier = Modifier
                            .border(2.dp, PrFg)
                            .background(PrBg)
                            .clickable { viewModel.loadProfile(userId) }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                    ) {
                        Text("Retry", fontWeight = FontWeight.Bold, color = PrFg)
                    }
                }
            }
            is UiState.Success -> {
                val user = st.data
                val init = initials(user.name)
                val workouts = user.stats?.totalWorkouts ?: 0

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(PrBg)
                            .border(PrBorderW, PrFg)
                            .padding(horizontal = Spacing.lg, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .border(2.dp, PrFg)
                                .background(PrBg)
                                .clickable { onNavigateBack() },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "\u2190",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrFg
                            )
                        }
                        Spacer(Modifier.width(Spacing.md))
                        Text(
                            text = "Profile",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = PrFg
                        )
                    }

                    Spacer(Modifier.height(Spacing.lg))

                    Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .offset(x = PrShadow, y = PrShadow)
                                .background(PrFg)
                        )
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(PrBg)
                                .border(PrBorderW, PrFg)
                                .padding(Spacing.xl),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(72.dp)
                                    .border(PrBorderW, PrFg)
                                    .background(PrAccent),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = init,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Black,
                                    color = PrFg
                                )
                            }
                            Spacer(Modifier.height(Spacing.md))
                            Text(
                                text = user.name ?: "User",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-0.02).sp,
                                color = PrFg
                            )
                            if (!user.bio.isNullOrBlank()) {
                                Spacer(Modifier.height(Spacing.sm))
                                Text(
                                    text = user.bio ?: "",
                                    fontSize = 13.sp,
                                    color = PrMuted,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.fillMaxWidth(0.7f)
                                )
                            }
                            Spacer(Modifier.height(Spacing.md))
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .border(2.dp, PrFg)
                                        .background(if (isFollowing) PrSuccess else PrAccent)
                                        .clickable { viewModel.toggleFollow(userId) }
                                        .padding(horizontal = Spacing.lg, vertical = 8.dp)
                                ) {
                                    Text(
                                        text = if (isFollowing) "Following \u2713" else "+ Follow",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Black,
                                        color = if (isFollowing) Color.White else PrFg
                                    )
                                }
                                Box(
                                    modifier = Modifier
                                        .border(2.dp, PrFg)
                                        .background(PrBg)
                                        .clickable { }
                                        .padding(horizontal = Spacing.lg, vertical = 8.dp)
                                ) {
                                    Text(
                                        text = "Message",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Black,
                                        color = PrFg
                                    )
                                }
                            }
                        }
                    }

                    Spacer(Modifier.height(Spacing.lg))

                    Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .offset(x = 4.dp, y = 4.dp)
                                .background(PrFg)
                        )
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(PrBg)
                                .border(PrBorderW, PrFg)
                        ) {
                            StatCell(value = "--", label = "Followers", modifier = Modifier.weight(1f))
                            Box(Modifier.width(2.dp).height(48.dp).background(PrFg))
                            StatCell(value = "--", label = "Following", modifier = Modifier.weight(1f))
                            Box(Modifier.width(2.dp).height(48.dp).background(PrFg))
                            StatCell(value = "$workouts", label = "Workouts", modifier = Modifier.weight(1f))
                        }
                    }

                    Spacer(Modifier.height(Spacing.lg))

                    Text(
                        text = "Recent Activity",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.06.sp,
                        color = PrMuted,
                        modifier = Modifier.padding(horizontal = Spacing.lg)
                    )

                    Spacer(Modifier.height(Spacing.md))

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = Spacing.lg),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "\uD83C\uDFC3",
                            fontSize = 32.sp
                        )
                        Spacer(Modifier.height(Spacing.sm))
                        Text(
                            text = "No recent activity",
                            fontSize = 14.sp,
                            color = PrMuted
                        )
                    }

                    Spacer(Modifier.height(Spacing.xl))
                }
            }
        }
    }
}

@Composable
private fun StatCell(
    value: String,
    label: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(vertical = Spacing.md),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            fontSize = 21.sp,
            fontWeight = FontWeight.Black,
            color = PrFg
        )
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.05.sp,
            color = PrMuted
        )
    }
}

@Preview
@Composable
private fun UserProfileScreenPreview() {
    TrainlyTheme { UserProfileScreen(userId = "1", onNavigateBack = {}) }
}
