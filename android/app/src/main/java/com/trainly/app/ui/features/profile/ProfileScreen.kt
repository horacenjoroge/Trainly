package com.trainly.app.ui.features.profile

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
import com.trainly.app.viewmodel.ProfileViewModel

private val PrBg = Color(0xFFFBFBF9)
private val PrFg = Color(0xFF1C293C)
private val PrMuted = Color(0xFF5A6B7E)
private val PrAccent = Color(0xFFFDC800)
private val PrBorderW = 3.dp
private val PrShadow = 5.dp

private fun initials(name: String): String {
    if (name.isBlank()) return "?"
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

@Composable
fun ProfileScreen(
    snackbarHostState: SnackbarHostState,
    onSettings: () -> Unit,
    onWorkoutHistory: () -> Unit = {},
    onAchievements: () -> Unit = {},
    onStats: () -> Unit = {},
    onFollowers: () -> Unit = {},
    onFollowing: () -> Unit = {},
    vm: ProfileViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    Box(modifier = Modifier.fillMaxSize().background(PrBg)) {
        when (val st = state) {
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
                            .clickable { vm.loadProfile() }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                    ) {
                        Text("Retry", fontWeight = FontWeight.Bold, color = PrFg)
                    }
                }
            }
            is UiState.Success -> {
                val data = st.data
                val init = initials(data.userName)

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
                        Text(
                            text = "Profile",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = PrFg,
                            modifier = Modifier.weight(1f)
                        )
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .border(2.dp, PrFg)
                                .background(PrBg)
                                .clickable { onSettings() },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "\u2699\uFE0F",
                                fontSize = 16.sp,
                                color = PrFg
                            )
                        }
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
                                    .size(80.dp)
                                    .border(4.dp, PrFg)
                                    .background(PrAccent),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = init,
                                    fontSize = 28.sp,
                                    fontWeight = FontWeight.Black,
                                    color = PrFg
                                )
                            }
                            Spacer(Modifier.height(Spacing.md))
                            Text(
                                text = data.userName,
                                fontSize = 27.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-0.02).sp,
                                color = PrFg
                            )
                            if (data.userBio.isNotBlank()) {
                                Spacer(Modifier.height(Spacing.sm))
                                Text(
                                    text = data.userBio,
                                    fontSize = 13.sp,
                                    color = PrMuted,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.fillMaxWidth(0.7f)
                                )
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
                            StatCell(
                                value = "${data.followers}",
                                label = "Followers",
                                onClick = onFollowers,
                                modifier = Modifier.weight(1f)
                            )
                            Box(Modifier.width(2.dp).height(48.dp).background(PrFg))
                            StatCell(
                                value = "${data.following}",
                                label = "Following",
                                onClick = onFollowing,
                                modifier = Modifier.weight(1f)
                            )
                            Box(Modifier.width(2.dp).height(48.dp).background(PrFg))
                            StatCell(
                                value = "${data.workouts}",
                                label = "Workouts",
                                onClick = onWorkoutHistory,
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }

                    Spacer(Modifier.height(Spacing.lg))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = Spacing.lg),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        QuickLinkCard(
                            icon = "\uD83D\uDCCB",
                            label = "History",
                            onClick = onWorkoutHistory,
                            modifier = Modifier.weight(1f)
                        )
                        QuickLinkCard(
                            icon = "\uD83C\uDFC6",
                            label = "Achievements",
                            onClick = onAchievements,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(Modifier.height(Spacing.lg))

                    Box(modifier = Modifier.padding(horizontal = Spacing.lg)) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .offset(x = 4.dp, y = 4.dp)
                                .background(PrFg)
                        )
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(PrBg)
                                .border(PrBorderW, PrFg)
                                .padding(Spacing.lg)
                        ) {
                            Text(
                                text = "Quick Stats",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Black,
                                color = PrFg
                            )
                            Spacer(Modifier.height(Spacing.md))
                            QuickStatRow(label = "\uD83D\uDD25 Calories", value = formatCals(data.calories))
                            Box(Modifier.fillMaxWidth().height(2.dp).background(PrFg))
                            QuickStatRow(label = "\u23F1 Total Hours", value = "${data.hours}h")
                            Box(Modifier.fillMaxWidth().height(2.dp).background(PrFg))
                            QuickStatRow(label = "\uD83C\uDFC3 Best Run", value = data.bestRun.ifBlank { "—" })
                            Box(Modifier.fillMaxWidth().height(2.dp).background(PrFg))
                            QuickStatRow(label = "\uD83D\uDCC5 Member Since", value = data.memberSince.ifBlank { "—" })
                        }
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
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clickable { onClick() }
            .padding(vertical = Spacing.md),
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

@Composable
private fun QuickLinkCard(
    icon: String,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        Box(
            modifier = Modifier
                .matchParentSize()
                .offset(x = 4.dp, y = 4.dp)
                .background(PrFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(PrBg)
                .border(PrBorderW, PrFg)
                .clickable { onClick() }
                .padding(Spacing.lg),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = icon,
                fontSize = 28.sp
            )
            Spacer(Modifier.height(Spacing.sm))
            Text(
                text = label,
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                color = PrFg
            )
        }
    }
}

@Composable
private fun QuickStatRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = PrMuted
        )
        Text(
            text = value,
            fontSize = 15.sp,
            fontWeight = FontWeight.Black,
            color = PrFg
        )
    }
}

private fun formatCals(cals: Int): String {
    return if (cals >= 1000) "${cals / 1000},${(cals % 1000) / 100}00" else "$cals"
}

@Preview
@Composable
private fun ProfileScreenPreview() {
    TrainlyTheme { ProfileScreen(snackbarHostState = SnackbarHostState(), onSettings = {}) }
}
