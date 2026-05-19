package com.trainly.app.ui.features.emergency

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.data.remote.dto.ContactDto
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.viewmodel.EmergencyViewModel

private val EmBg = Color(0xFFFBFBF9)
private val EmFg = Color(0xFF1C293C)
private val EmMuted = Color(0xFF5A6B7E)
private val EmAccent = Color(0xFFFDC800)
private val EmDanger = Color(0xFFDC2626)

private fun initials(name: String?): String {
    if (name.isNullOrBlank()) return "?"
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

@Composable
fun EmergencyServicesScreen(
    onBack: () -> Unit,
    onContacts: () -> Unit,
    vm: EmergencyViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    Box(modifier = Modifier.fillMaxSize().background(EmBg)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(EmBg)
                    .border(3.dp, EmFg)
                    .padding(horizontal = Spacing.lg, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "\uD83D\uDEA8 Emergency SOS",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = EmFg
                )
            }

            Spacer(Modifier.height(Spacing.lg))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.lg)
            ) {
                if (!state.isSosActive) {
                    SosHero()
                    SosTriggerButton(onClick = { vm.triggerSos() })
                } else {
                    SosActiveCard(
                        countdown = state.sosCountdown,
                        sent = state.sosSent,
                        onCancel = { vm.cancelSos() }
                    )
                }

                ContactPreviewCard(
                    contacts = state.contacts,
                    onManage = onContacts
                )

                InfoCard()
            }

            Spacer(Modifier.height(Spacing.xl))
        }
    }
}

@Composable
private fun SosHero() {
    val infiniteTransition = rememberInfiniteTransition(label = "sosPulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.1f,
        animationSpec = infiniteRepeatable(
            animation = tween(600),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .border(4.dp, EmDanger)
            .background(Color(0xFFFEF2F2))
            .padding(32.dp, 24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier.graphicsLayer(scaleX = scale, scaleY = scale),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "\uD83D\uDEA8",
                    fontSize = 64.sp
                )
            }
            Spacer(Modifier.height(Spacing.md))
            Text(
                text = "SOS",
                fontSize = 35.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-0.02).sp,
                color = EmDanger
            )
            Spacer(Modifier.height(Spacing.sm))
            Text(
                text = "One tap alerts your emergency contacts with your real-time location",
                fontSize = 14.sp,
                color = EmMuted,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(0.8f)
            )
        }
    }
}

@Composable
private fun SosTriggerButton(onClick: () -> Unit) {
    Box {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = 8.dp, y = 8.dp)
                .background(EmFg)
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .border(4.dp, EmFg)
                .background(EmDanger)
                .clickable { onClick() }
                .padding(vertical = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "\uD83D\uDEA8 Activate SOS",
                fontSize = 24.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 0.05.sp,
                color = Color.White
            )
        }
    }
}

@Composable
private fun SosActiveCard(
    countdown: Int,
    sent: Boolean,
    onCancel: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(4.dp, EmDanger)
            .background(Color(0xFFFEF2F2))
            .padding(32.dp, 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = if (countdown > 0) "$countdown" else if (sent) "ALERT" else "...",
            fontSize = 57.sp,
            fontWeight = FontWeight.Black,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
            color = EmDanger
        )
        Spacer(Modifier.height(Spacing.md))
        Text(
            text = if (sent) "\u2705 Emergency contacts notified" else "\uD83D\uDEA8 SOS Alert Active",
            fontSize = 17.sp,
            fontWeight = FontWeight.Black,
            color = EmFg,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(Spacing.sm))
        Text(
            text = if (sent) "Your location is being shared. Stay safe."
                  else "Your emergency contacts are being notified with your location.",
            fontSize = 13.sp,
            color = EmMuted,
            textAlign = TextAlign.Center
        )
        if (!sent) {
            Spacer(Modifier.height(Spacing.lg))
            Box {
                Box(
                    modifier = Modifier
                        .offset(x = 4.dp, y = 4.dp)
                        .background(EmFg)
                )
                Box(
                    modifier = Modifier
                        .border(3.dp, EmFg)
                        .background(EmBg)
                        .clickable { onCancel() }
                        .padding(horizontal = 32.dp, vertical = 12.dp)
                ) {
                    Text(
                        text = "Cancel Alert",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Black,
                        color = EmFg
                    )
                }
            }
        }
    }
}

@Composable
private fun ContactPreviewCard(
    contacts: List<ContactDto>,
    onManage: () -> Unit
) {
    Box {
        Box(
            modifier = Modifier
                .matchParentSize()
                .offset(x = 4.dp, y = 4.dp)
                .background(EmFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(EmBg)
                .border(3.dp, EmFg)
                .padding(Spacing.lg)
        ) {
            Text(
                text = "\uD83D\uDC65 Emergency Contacts",
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                color = EmFg
            )
            Spacer(Modifier.height(Spacing.md))

            val displayContacts = contacts.take(2)
            displayContacts.forEach { contact ->
                val init = initials(contact.name)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .border(2.dp, EmFg)
                            .background(EmAccent),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = init,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Black,
                            color = EmFg
                        )
                    }
                    Spacer(Modifier.width(Spacing.md))
                    Column {
                        Text(
                            text = contact.name ?: "",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = EmFg
                        )
                        Text(
                            text = contact.phone ?: "",
                            fontSize = 12.sp,
                            color = EmMuted
                        )
                    }
                }
                if (contact != displayContacts.last()) {
                    Box(Modifier.fillMaxWidth().height(2.dp).background(EmFg))
                }
            }

            if (contacts.isEmpty()) {
                Text(
                    text = "No emergency contacts set",
                    fontSize = 13.sp,
                    color = EmMuted,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
            }

            Spacer(Modifier.height(Spacing.sm))
            Box(
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .clickable { onManage() }
                    .padding(vertical = 4.dp)
            ) {
                Text(
                    text = "Manage Contacts \u2192",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = EmFg
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(2.dp)
                        .align(Alignment.BottomCenter)
                        .background(EmAccent)
                )
            }
        }
    }
}

@Composable
private fun InfoCard() {
    Box {
        Box(
            modifier = Modifier
                .matchParentSize()
                .offset(x = 4.dp, y = 4.dp)
                .background(EmFg)
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(EmBg)
                .border(3.dp, EmFg)
                .padding(Spacing.lg),
            verticalAlignment = Alignment.Top
        ) {
            Text(
                text = "\u2139\uFE0F",
                fontSize = 24.sp,
                modifier = Modifier.padding(end = Spacing.md)
            )
            Text(
                text = "When activated, Trainly will send your live GPS location to your emergency contacts via SMS and app notification. Location sharing continues for 30 minutes after activation.",
                fontSize = 13.sp,
                lineHeight = 20.sp,
                color = EmFg
            )
        }
    }
}

@Preview
@Composable
private fun EmergencyServicesScreenPreview() {
    TrainlyTheme { EmergencyServicesScreen(onBack = {}, onContacts = {}) }
}
