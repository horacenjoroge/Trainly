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
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
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
import com.trainly.app.viewmodel.AchievementsUiState
import com.trainly.app.viewmodel.AchievementsViewModel

private val AcBg = Color(0xFFFBFBF9)
private val AcFg = Color(0xFF1C293C)
private val AcMuted = Color(0xFF5A6B7E)
private val AcAccent = Color(0xFFFDC800)
private val AcSuccess = Color(0xFF16A34A)
private val AcBorderW = 3.dp
private val AcShadow = 4.dp

@Composable
fun AchievementsScreen(
    onNavigateBack: () -> Unit,
    viewModel: AchievementsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Box(modifier = Modifier.fillMaxSize().background(AcBg)) {
        when (val st = uiState) {
            is AchievementsUiState.Loading -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Loading...", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = AcMuted)
                }
            }
            is AchievementsUiState.Error -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(st.message, fontSize = 15.sp, color = AcMuted)
                    Spacer(Modifier.height(Spacing.md))
                    Box(
                        modifier = Modifier
                            .border(2.dp, AcFg)
                            .background(AcBg)
                            .clickable { viewModel.load() }
                            .padding(horizontal = Spacing.lg, vertical = Spacing.sm)
                    ) {
                        Text("Retry", fontWeight = FontWeight.Bold, color = AcFg)
                    }
                }
            }
            is AchievementsUiState.Success -> {
                val data = st.data
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(AcBg)
                            .border(AcBorderW, AcFg)
                            .padding(horizontal = Spacing.lg, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .border(2.dp, AcFg)
                                .background(AcBg)
                                .clickable { onNavigateBack() },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "\u2190",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = AcFg
                            )
                        }
                        Spacer(Modifier.width(Spacing.md))
                        Text(
                            text = "\uD83C\uDFC6 Achievements",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = AcFg
                        )
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(AcBorderW, AcFg)
                    ) {
                        TabItem(
                            text = "Earned",
                            isActive = st.selectedTab == "earned",
                            modifier = Modifier.weight(1f),
                            onClick = { viewModel.selectTab("earned") }
                        )
                        TabItem(
                            text = "Locked",
                            isActive = st.selectedTab == "locked",
                            modifier = Modifier.weight(1f),
                            onClick = { viewModel.selectTab("locked") }
                        )
                    }

                    Spacer(Modifier.height(Spacing.md))

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = Spacing.lg),
                        verticalArrangement = Arrangement.spacedBy(Spacing.md)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            StatBlock(
                                value = { Text("${data.earnedCount}", color = AcAccent, fontSize = 24.sp, fontWeight = FontWeight.Black) },
                                label = "Earned",
                                modifier = Modifier.weight(1f)
                            )
                            StatBlock(
                                value = { Text("${data.points}", fontSize = 24.sp, fontWeight = FontWeight.Black, color = AcFg) },
                                label = "Points",
                                modifier = Modifier.weight(1f)
                            )
                            StatBlock(
                                value = { Text("${data.level}", fontSize = 24.sp, fontWeight = FontWeight.Black, color = AcFg) },
                                label = "Level",
                                modifier = Modifier.weight(1f)
                            )
                        }

                        if (st.selectedTab == "earned") {
                            if (data.earned.isEmpty()) {
                                Box(
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("No achievements earned yet", fontSize = 14.sp, color = AcMuted)
                                }
                            } else {
                                data.earned.forEach { a ->
                                    AchievementCard(
                                        icon = a.icon,
                                        title = a.name,
                                        desc = a.description,
                                        isLocked = false
                                    )
                                }
                            }
                        } else {
                            if (data.locked.isEmpty()) {
                                Box(
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("No locked achievements", fontSize = 14.sp, color = AcMuted)
                                }
                            } else {
                                data.locked.forEach { la ->
                                    AchievementCard(
                                        icon = la.achievement.icon,
                                        title = la.achievement.name,
                                        desc = la.achievement.description,
                                        isLocked = true,
                                        progress = la.progress,
                                        max = la.max
                                    )
                                }
                            }
                        }

                        Spacer(Modifier.height(Spacing.lg))
                    }
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
            .background(if (isActive) AcAccent else AcBg)
            .clickable { onClick() }
            .padding(vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = AcFg
        )
    }
}

@Composable
private fun StatBlock(
    value: @Composable () -> Unit,
    label: String,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        Box(
            modifier = Modifier
                .matchParentSize()
                .offset(x = AcShadow, y = AcShadow)
                .background(AcFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(AcBg)
                .border(AcBorderW, AcFg)
                .padding(vertical = Spacing.md),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            value()
            Spacer(Modifier.height(2.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.04.sp,
                color = AcMuted
            )
        }
    }
}

@Composable
private fun AchievementCard(
    icon: String,
    title: String,
    desc: String,
    isLocked: Boolean,
    progress: Int = 0,
    max: Int = 100
) {
    val alpha = if (isLocked) 0.45f else 1f

    Box(modifier = Modifier.fillMaxWidth().alpha(alpha)) {
        Box(
            modifier = Modifier
                .matchParentSize()
                .offset(x = AcShadow, y = AcShadow)
                .background(AcFg)
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(AcBg)
                .border(AcBorderW, AcFg)
                .padding(Spacing.md),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .border(AcBorderW, AcFg)
                    .background(if (isLocked) AcMuted else AcAccent),
                contentAlignment = Alignment.Center
            ) {
                Text(text = icon, fontSize = 24.sp)
            }
            Spacer(Modifier.width(Spacing.md))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = AcFg
                )
                Text(
                    text = desc,
                    fontSize = 12.sp,
                    color = AcMuted,
                    lineHeight = 17.sp
                )
                if (isLocked) {
                    Spacer(Modifier.height(6.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(6.dp)
                                .border(1.dp, AcFg)
                                .background(AcBg)
                        ) {
                            val pct = (progress.toFloat() / max).coerceIn(0f, 1f)
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth(pct)
                                    .height(6.dp)
                                    .background(AcAccent)
                            )
                        }
                        Text(
                            text = "${progress}%",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                            color = AcMuted
                        )
                    }
                }
            }
            Spacer(Modifier.width(Spacing.md))
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .border(2.dp, AcFg)
                    .background(if (isLocked) AcMuted else AcSuccess),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = if (isLocked) "\uD83D\uDD12" else "\u2713",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    color = if (isLocked) AcBg else Color.White
                )
            }
        }
    }
}

@Preview
@Composable
private fun AchievementsScreenPreview() {
    TrainlyTheme { AchievementsScreen(onNavigateBack = {}) }
}
