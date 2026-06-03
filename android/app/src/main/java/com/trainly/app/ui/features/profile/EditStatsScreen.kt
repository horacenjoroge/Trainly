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
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.EditStatsViewModel

private val EsBg = Color(0xFFFBFBF9)
private val EsFg = Color(0xFF1C293C)
private val EsMuted = Color(0xFF5A6B7E)
private val EsAccent = Color(0xFFFDC800)
private val EsBorderW = 3.dp
private val EsShadow = 4.dp

@Composable
fun EditStatsScreen(
    onBack: () -> Unit,
    vm: EditStatsViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    Box(modifier = Modifier.fillMaxSize().background(EsBg)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(EsBg)
                    .border(EsBorderW, EsFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, EsFg)
                        .background(EsBg)
                        .clickable { onBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = EsFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = "Edit Stats",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = EsFg,
                    modifier = Modifier.weight(1f)
                )
                Box(
                    modifier = Modifier
                        .border(2.dp, EsFg)
                        .background(EsAccent)
                        .clickable(enabled = !state.isLoading) { vm.save(onOK = onBack) }
                        .padding(horizontal = Spacing.lg, vertical = 6.dp)
                ) {
                    Text(
                        text = if (state.isLoading) "Saving..." else "Save",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = EsFg
                    )
                }
            }

            Spacer(Modifier.height(Spacing.md))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.lg)
            ) {
                SectionLabel("Body Metrics")

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                ) {
                    NeoField(
                        label = "Height (cm)",
                        value = state.height,
                        onValueChange = { vm.updateHeight(it) },
                        modifier = Modifier.weight(1f)
                    )
                    NeoField(
                        label = "Weight (kg)",
                        value = state.weight,
                        onValueChange = { vm.updateWeight(it) },
                        modifier = Modifier.weight(1f)
                    )
                }

                NeoField(
                    label = "Date of Birth",
                    value = state.dob,
                    onValueChange = { vm.updateDob(it) },
                    placeholder = "YYYY-MM-DD"
                )

                NeoSelect(
                    label = "Sex",
                    selected = state.sex,
                    options = state.sexOptions,
                    onSelect = { vm.updateSex(it) }
                )

                SectionLabel("Fitness Goals")

                state.goalOptions.forEach { (goal, pair) ->
                    val (icon, desc) = pair
                    val selected = state.goal == goal
                    Box(modifier = Modifier.fillMaxWidth()) {
                        Box(
                            modifier = Modifier
                                .matchParentSize()
                                .offset(x = EsShadow, y = EsShadow)
                                .background(EsFg)
                        )
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(EsBg)
                                .border(EsBorderW, EsFg)
                                .clickable { vm.selectGoal(goal) }
                                .padding(Spacing.lg),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier.width(40.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = icon, fontSize = 28.sp)
                            }
                            Spacer(Modifier.width(Spacing.md))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = goal,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Black,
                                    color = EsFg
                                )
                                Text(
                                    text = desc,
                                    fontSize = 12.sp,
                                    color = EsMuted
                                )
                            }
                            Spacer(Modifier.width(Spacing.md))
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .border(2.dp, EsFg)
                                    .background(if (selected) EsAccent else EsBg),
                                contentAlignment = Alignment.Center
                            ) {
                                if (selected) {
                                    Text(
                                        text = "\u2713",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Black,
                                        color = EsFg
                                    )
                                }
                            }
                        }
                    }
                }

                SectionLabel("Weekly Target")

                NeoSelect(
                    label = "Workouts per week",
                    selected = state.weeklyTarget,
                    options = state.weeklyOptions,
                    onSelect = { vm.updateWeeklyTarget(it) }
                )

                if (state.error != null) {
                    Text(
                        text = state.error ?: "",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFDC2626)
                    )
                }

                if (state.saved) {
                    Text(
                        text = "Stats updated!",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF16A34A)
                    )
                }

                Spacer(Modifier.height(Spacing.xl))
            }
        }
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(
        text = text,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 0.08.sp,
        color = EsMuted,
        modifier = Modifier.padding(top = Spacing.sm)
    )
}

@Composable
private fun NeoField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String? = null
) {
    Column(modifier = modifier) {
        Text(
            text = label.uppercase(),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.03.sp,
            color = EsMuted
        )
        Spacer(Modifier.height(Spacing.sm))
        Box {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .offset(x = EsShadow, y = EsShadow)
                    .background(EsFg)
            )
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                singleLine = true,
                textStyle = TextStyle(
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = EsFg
                ),
                cursorBrush = SolidColor(EsFg),
                modifier = Modifier
                    .fillMaxWidth()
                    .background(EsBg)
                    .border(EsBorderW, EsFg)
                    .padding(horizontal = Spacing.md, vertical = 12.dp),
                decorationBox = { innerTextField ->
                    Box {
                        if (value.isEmpty()) {
                            Text(
                                text = placeholder ?: label,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Medium,
                                color = EsMuted
                            )
                        }
                        innerTextField()
                    }
                }
            )
        }
    }
}

@Composable
private fun NeoSelect(
    label: String,
    selected: String,
    options: List<String>,
    onSelect: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Column {
        Text(
            text = label.uppercase(),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.03.sp,
            color = EsMuted
        )
        Spacer(Modifier.height(Spacing.sm))
        Box {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .offset(x = EsShadow, y = EsShadow)
                    .background(EsFg)
            )
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(EsBg)
                    .border(EsBorderW, EsFg)
                    .clickable { expanded = true }
                    .padding(horizontal = Spacing.md, vertical = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = selected,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = EsFg
                    )
                    Text(
                        text = "\u25BC",
                        fontSize = 10.sp,
                        color = EsMuted
                    )
                }
            }
            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier
                    .fillMaxWidth(0.85f)
                    .background(EsBg)
                    .border(2.dp, EsFg)
            ) {
                options.forEach { opt ->
                    DropdownMenuItem(
                        text = {
                            Text(
                                text = opt,
                                fontSize = 14.sp,
                                fontWeight = if (opt == selected) FontWeight.Bold else FontWeight.Medium,
                                color = EsFg
                            )
                        },
                        onClick = { onSelect(opt); expanded = false }
                    )
                }
            }
        }
    }
}

@Preview
@Composable
private fun EditStatsScreenPreview() {
    TrainlyTheme { EditStatsScreen(onBack = {}) }
}
