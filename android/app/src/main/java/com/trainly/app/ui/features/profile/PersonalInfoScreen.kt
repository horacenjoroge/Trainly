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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
import com.trainly.app.viewmodel.PersonalInfoViewModel

private val PiBg = Color(0xFFFBFBF9)
private val PiFg = Color(0xFF1C293C)
private val PiMuted = Color(0xFF5A6B7E)
private val PiAccent = Color(0xFFFDC800)
private val PiBorderW = 3.dp
private val PiShadow = 4.dp

private fun initials(name: String): String {
    if (name.isBlank()) return "?"
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

@Composable
fun PersonalInfoScreen(
    onBack: () -> Unit,
    vm: PersonalInfoViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    Box(modifier = Modifier.fillMaxSize().background(PiBg)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PiBg)
                    .border(PiBorderW, PiFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, PiFg)
                        .background(PiBg)
                        .clickable { onBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = PiFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = "Personal Info",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = PiFg,
                    modifier = Modifier.weight(1f)
                )
                Box(
                    modifier = Modifier
                        .border(2.dp, PiFg)
                        .background(PiAccent)
                        .clickable(enabled = !state.isSaving) { vm.save() }
                        .padding(horizontal = Spacing.lg, vertical = 6.dp)
                ) {
                    Text(
                        text = if (state.isSaving) "Saving..." else "Save",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = PiFg
                    )
                }
            }

            Spacer(Modifier.height(Spacing.lg))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.lg)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .border(PiBorderW, PiFg)
                            .background(PiAccent),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = initials(state.name),
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = PiFg
                        )
                    }
                    Spacer(Modifier.height(Spacing.sm))
                    Box(
                        modifier = Modifier
                            .border(2.dp, PiFg)
                            .background(PiBg)
                            .clickable { }
                            .padding(horizontal = Spacing.lg, vertical = 6.dp)
                    ) {
                        Text(
                            text = "Change Photo",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = PiFg
                        )
                    }
                }

                NeoField(
                    label = "Full Name",
                    value = state.name,
                    onValueChange = { vm.updateName(it) },
                    singleLine = true
                )
                NeoField(
                    label = "Email",
                    value = state.email,
                    onValueChange = { vm.updateEmail(it) },
                    singleLine = true
                )
                NeoField(
                    label = "Bio",
                    value = state.bio,
                    onValueChange = { vm.updateBio(it) },
                    singleLine = false,
                    minHeight = 60
                )
                NeoField(
                    label = "Location",
                    value = state.location,
                    onValueChange = { vm.updateLocation(it) },
                    singleLine = true
                )

                Column {
                    Text(
                        text = "YOUR SPORTS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.03.sp,
                        color = PiMuted
                    )
                    Spacer(Modifier.height(Spacing.sm))
                    val rows = state.allSports.chunked(3)
                    rows.forEach { row ->
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.padding(bottom = 6.dp)
                        ) {
                            row.forEach { sport ->
                                val selected = sport in state.selectedSports
                                Box(
                                    modifier = Modifier
                                        .border(2.dp, PiFg)
                                        .background(if (selected) PiAccent else PiBg)
                                        .clickable { vm.toggleSport(sport) }
                                        .padding(horizontal = Spacing.md, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = sport,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PiFg
                                    )
                                }
                            }
                        }
                    }
                }

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
                        text = "Changes saved!",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF16A34A)
                    )
                }

                Spacer(Modifier.height(Spacing.lg))
            }
        }
    }
}

@Composable
private fun NeoField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    singleLine: Boolean,
    minHeight: Int = 0
) {
    Column {
        Text(
            text = label.uppercase(),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.03.sp,
            color = PiMuted
        )
        Spacer(Modifier.height(Spacing.sm))
        Box {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .offset(x = PiShadow, y = PiShadow)
                    .background(PiFg)
            )
            val heightMod = if (singleLine) Modifier else Modifier.height(minHeight.dp)
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                singleLine = singleLine,
                textStyle = TextStyle(
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PiFg
                ),
                cursorBrush = SolidColor(PiFg),
                modifier = Modifier
                    .fillMaxWidth()
                    .then(heightMod)
                    .background(PiBg)
                    .border(PiBorderW, PiFg)
                    .padding(horizontal = Spacing.md, vertical = 12.dp),
                decorationBox = { innerTextField ->
                    Box {
                        if (value.isEmpty()) {
                            Text(
                                text = label,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Medium,
                                color = PiMuted
                            )
                        }
                        innerTextField()
                    }
                }
            )
        }
    }
}

@Preview
@Composable
private fun PersonalInfoScreenPreview() {
    TrainlyTheme { PersonalInfoScreen(onBack = {}) }
}
