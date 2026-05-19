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
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.CreatePostViewModel

private val CpBg = Color(0xFFFBFBF9)
private val CpFg = Color(0xFF1C293C)
private val CpMuted = Color(0xFF5A6B7E)
private val CpAccent = Color(0xFFFDC800)
private val CpBorderW = 3.dp
private val CpShadow = 4.dp

@Composable
fun CreatePostScreen(
    onBack: () -> Unit,
    viewModel: CreatePostViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    var showWorkoutSection by remember { mutableStateOf(true) }
    var selectedWorkout by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        viewModel.postCreated.collect { created ->
            if (created) onBack()
        }
    }

    val placeholderWorkouts = listOf(
        Triple("\uD83C\uDFC3", "Morning Run", "Today \u00B7 5.2 km \u00B7 28 min"),
        Triple("\uD83C\uDFCB", "Push Day", "Yesterday \u00B7 8 exercises \u00B7 45 min")
    )

    Box(modifier = Modifier.fillMaxSize().background(CpBg)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CpBg)
                    .border(CpBorderW, CpFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, CpFg)
                        .background(CpBg)
                        .clickable { onBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = CpFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = "Create Post",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = CpFg,
                    modifier = Modifier.weight(1f)
                )
                Box(
                    modifier = Modifier
                        .border(2.dp, CpFg)
                        .background(if (state.content.isNotBlank()) CpAccent else CpBg)
                        .clickable(enabled = state.content.isNotBlank()) { viewModel.create() }
                        .padding(horizontal = Spacing.lg, vertical = 6.dp)
                ) {
                    Text(
                        text = "Post",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = if (state.content.isNotBlank()) CpFg else CpMuted
                    )
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.lg)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .border(2.dp, CpFg)
                            .background(CpAccent),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "AJ",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Black,
                            color = CpFg
                        )
                    }
                    Text(
                        text = "Alex Johnson",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = CpFg
                    )
                }

                Box(modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .offset(x = CpShadow, y = CpShadow)
                            .background(CpFg)
                    )
                    BasicTextField(
                        value = state.content,
                        onValueChange = { viewModel.update(it) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(CpBg)
                            .border(CpBorderW, CpFg)
                            .padding(Spacing.md)
                            .height(120.dp),
                        textStyle = androidx.compose.ui.text.TextStyle(
                            fontSize = 15.sp,
                            lineHeight = 24.sp,
                            color = CpFg
                        ),
                        cursorBrush = SolidColor(CpFg),
                        decorationBox = { innerTextField ->
                            Box {
                                if (state.content.isEmpty()) {
                                    Text(
                                        text = "What's your latest workout? Share your progress, route, or PR...",
                                        fontSize = 15.sp,
                                        lineHeight = 24.sp,
                                        color = CpMuted
                                    )
                                }
                                innerTextField()
                            }
                        }
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    AttachChip(text = "\uD83D\uDCF7 Photo", selected = false, onClick = { })
                    AttachChip(
                        text = "\uD83C\uDFC3 Attach Workout",
                        selected = showWorkoutSection,
                        onClick = { showWorkoutSection = !showWorkoutSection }
                    )
                    AttachChip(text = "\uD83D\uDCCD Location", selected = false, onClick = { })
                }

                if (showWorkoutSection) {
                    Box(modifier = Modifier.fillMaxWidth()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .offset(x = CpShadow, y = CpShadow)
                                .background(CpFg)
                        )
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(CpBg)
                                .border(CpBorderW, CpFg)
                                .padding(Spacing.lg)
                        ) {
                            Text(
                                text = "Select a recent workout",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Black,
                                color = CpFg
                            )
                            Spacer(Modifier.height(Spacing.md))
                            placeholderWorkouts.forEachIndexed { idx, (icon, name, meta) ->
                                val isSelected = selectedWorkout == idx
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(2.dp, CpFg)
                                        .background(if (isSelected) CpAccent else CpBg)
                                        .clickable { selectedWorkout = idx }
                                        .padding(Spacing.md),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(32.dp)
                                            .border(2.dp, CpFg)
                                            .background(CpBg),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(text = icon, fontSize = 16.sp)
                                    }
                                    Spacer(Modifier.width(Spacing.md))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = name,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = CpFg
                                        )
                                        Text(
                                            text = meta,
                                            fontSize = 12.sp,
                                            color = CpMuted
                                        )
                                    }
                                    Box(
                                        modifier = Modifier
                                            .size(24.dp)
                                            .border(2.dp, CpFg)
                                            .background(if (isSelected) CpAccent else CpBg),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        if (isSelected) {
                                            Text(
                                                text = "\u2713",
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Black,
                                                color = CpFg
                                            )
                                        }
                                    }
                                }
                                Spacer(Modifier.height(8.dp))
                            }
                        }
                    }
                }

                state.error?.let { error ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFDC2626))
                            .border(CpBorderW, CpFg)
                            .padding(Spacing.md)
                    ) {
                        Text(
                            text = error,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White
                        )
                    }
                }

                if (state.isLoading) {
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Posting...",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = CpMuted
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun AttachChip(
    text: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .border(2.dp, CpFg)
            .background(if (selected) CpAccent else CpBg)
            .clickable { onClick() }
            .padding(horizontal = Spacing.lg, vertical = 8.dp)
    ) {
        Text(
            text = text,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = CpFg
        )
    }
}

@Preview
@Composable
private fun CreatePostScreenPreview() {
    TrainlyTheme { CreatePostScreen(onBack = {}) }
}
