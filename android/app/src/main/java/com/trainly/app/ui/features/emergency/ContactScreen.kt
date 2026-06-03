package com.trainly.app.ui.features.emergency

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
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import com.trainly.app.viewmodel.ContactsViewModel

private val CtBg = Color(0xFFFBFBF9)
private val CtFg = Color(0xFF1C293C)
private val CtMuted = Color(0xFF5A6B7E)
private val CtAccent = Color(0xFFFDC800)
private val CtDanger = Color(0xFFDC2626)
private val CtBorderW = 3.dp
private val CtShadow = 4.dp

private fun initials(name: String?): String {
    if (name.isNullOrBlank()) return "?"
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

@Composable
fun ContactScreen(
    onNavigateBack: () -> Unit,
    viewModel: ContactsViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    if (state.showDialog) {
        AlertDialog(
            onDismissRequest = { viewModel.dismissDialog() },
            title = {
                Text("Add Contact", fontWeight = FontWeight.Black, color = CtFg, fontSize = 17.sp)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(Spacing.md)) {
                    Column {
                        Text(
                            text = "NAME",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.03.sp,
                            color = CtMuted
                        )
                        Spacer(Modifier.height(4.dp))
                        Box {
                            Box(
                                modifier = Modifier
                                    .matchParentSize()
                                    .offset(x = CtShadow, y = CtShadow)
                                    .background(CtFg)
                            )
                            BasicTextField(
                                value = state.name,
                                onValueChange = { viewModel.updateName(it) },
                                singleLine = true,
                                textStyle = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = CtFg),
                                cursorBrush = SolidColor(CtFg),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CtBg)
                                    .border(2.dp, CtFg)
                                    .padding(horizontal = Spacing.md, vertical = 10.dp),
                                decorationBox = { inner ->
                                    Box { if (state.name.isEmpty()) Text("Name", fontSize = 15.sp, color = CtMuted); inner() }
                                }
                            )
                        }
                    }
                    Column {
                        Text(
                            text = "PHONE",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.03.sp,
                            color = CtMuted
                        )
                        Spacer(Modifier.height(4.dp))
                        Box {
                            Box(
                                modifier = Modifier
                                    .matchParentSize()
                                    .offset(x = CtShadow, y = CtShadow)
                                    .background(CtFg)
                            )
                            BasicTextField(
                                value = state.phone,
                                onValueChange = { viewModel.updatePhone(it) },
                                singleLine = true,
                                textStyle = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = CtFg),
                                cursorBrush = SolidColor(CtFg),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CtBg)
                                    .border(2.dp, CtFg)
                                    .padding(horizontal = Spacing.md, vertical = 10.dp),
                                decorationBox = { inner ->
                                    Box { if (state.phone.isEmpty()) Text("Phone", fontSize = 15.sp, color = CtMuted); inner() }
                                }
                            )
                        }
                    }
                    Column {
                        Text(
                            text = "RELATIONSHIP",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.03.sp,
                            color = CtMuted
                        )
                        Spacer(Modifier.height(4.dp))
                        Box {
                            Box(
                                modifier = Modifier
                                    .matchParentSize()
                                    .offset(x = CtShadow, y = CtShadow)
                                    .background(CtFg)
                            )
                            BasicTextField(
                                value = state.relationship,
                                onValueChange = { viewModel.updateRelationship(it) },
                                singleLine = true,
                                textStyle = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = CtFg),
                                cursorBrush = SolidColor(CtFg),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CtBg)
                                    .border(2.dp, CtFg)
                                    .padding(horizontal = Spacing.md, vertical = 10.dp),
                                decorationBox = { inner ->
                                    Box { if (state.relationship.isEmpty()) Text("Relationship", fontSize = 15.sp, color = CtMuted); inner() }
                                }
                            )
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(
                    onClick = { viewModel.saveContact() },
                    enabled = state.name.isNotBlank() && state.phone.isNotBlank() && !state.isLoading
                ) {
                    Text("Save", fontWeight = FontWeight.Bold, color = CtFg)
                }
            },
            dismissButton = {
                TextButton(onClick = { viewModel.dismissDialog() }) {
                    Text("Cancel", fontWeight = FontWeight.Bold, color = CtMuted)
                }
            },
            containerColor = CtBg
        )
    }

    Box(modifier = Modifier.fillMaxSize().background(CtBg)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CtBg)
                    .border(CtBorderW, CtFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .border(2.dp, CtFg)
                        .background(CtBg)
                        .clickable { onNavigateBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "\u2190",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = CtFg
                    )
                }
                Spacer(Modifier.width(Spacing.md))
                Text(
                    text = "Emergency Contacts",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = CtFg,
                    modifier = Modifier.weight(1f)
                )
                Box(
                    modifier = Modifier
                        .border(2.dp, CtFg)
                        .background(CtAccent)
                        .clickable { viewModel.showAddDialog() }
                        .padding(horizontal = Spacing.lg, vertical = 6.dp)
                ) {
                    Text(
                        text = "+ Add",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = CtFg
                    )
                }
            }

            Spacer(Modifier.height(Spacing.md))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                Box {
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .offset(x = CtShadow, y = CtShadow)
                            .background(CtDanger)
                    )
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFFEF2F2))
                            .border(CtBorderW, CtDanger)
                            .padding(Spacing.md),
                        verticalAlignment = Alignment.Top
                    ) {
                        Text(
                            text = "\uD83D\uDEA8",
                            fontSize = 20.sp,
                            modifier = Modifier.padding(end = Spacing.md)
                        )
                        Text(
                            text = "When you activate SOS, your emergency contacts receive your live GPS location and a notification.",
                            fontSize = 13.sp,
                            lineHeight = 18.sp,
                            color = CtFg
                        )
                    }
                }

                Text(
                    text = "YOUR CONTACTS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.08.sp,
                    color = CtMuted
                )

                state.contacts.forEach { contact ->
                    val init = initials(contact.name)
                    Box {
                        Box(
                            modifier = Modifier
                                .matchParentSize()
                                .offset(x = CtShadow, y = CtShadow)
                                .background(CtFg)
                        )
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(CtBg)
                                .border(CtBorderW, CtFg)
                                .padding(Spacing.md),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .border(2.dp, CtFg)
                                    .background(CtAccent),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = init,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black,
                                    color = CtFg
                                )
                            }
                            Spacer(Modifier.width(Spacing.md))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = contact.name ?: "",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Black,
                                    color = CtFg
                                )
                                Text(
                                    text = contact.phone ?: "",
                                    fontSize = 13.sp,
                                    color = CtMuted
                                )
                                if (!contact.relationship.isNullOrBlank()) {
                                    Text(
                                        text = contact.relationship ?: "",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = CtMuted
                                    )
                                }
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .border(2.dp, CtFg)
                                        .background(CtBg)
                                        .clickable { },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = "\u2709", fontSize = 14.sp, color = CtFg)
                                }
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .border(2.dp, CtFg)
                                        .background(CtBg)
                                        .clickable { contact.id?.let { viewModel.deleteContact(it) } },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = "\u2715", fontSize = 14.sp, color = CtFg)
                                }
                            }
                        }
                    }
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(3.dp, CtFg.copy(alpha = 0.5f))
                        .background(CtBg)
                        .clickable { viewModel.showAddDialog() }
                        .padding(vertical = 20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "+",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Light,
                            color = CtMuted
                        )
                        Spacer(Modifier.width(Spacing.sm))
                        Text(
                            text = "Add Emergency Contact",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = CtMuted
                        )
                    }
                }

                Spacer(Modifier.height(Spacing.lg))
            }
        }
    }
}

@Preview
@Composable
private fun ContactScreenPreview() {
    TrainlyTheme { ContactScreen(onNavigateBack = {}) }
}
