package com.trainly.app.ui.features.workouts

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.runtime.getValue
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.trainly.app.ui.designsystem.theme.Spacing

val TrackBg = Color(0xFF1C293C)
val TrackCardBg = Color(0xFF2A3A4C)
val TrackFg = Color(0xFFFFFFFF)
val TrackMuted = Color(0xFF9CA3AF)
val TrackAccent = Color(0xFFFDC800)
val TrackSuccess = Color(0xFF16A34A)
val TrackDanger = Color(0xFFDC2626)
val TrackWarning = Color(0xFFD97706)
val TrackBorder = Color(0xFF333333)
val TrackBorderW = 3.dp
val TrackShadowOffset = 4.dp

@Composable
fun TrackingTopBar(
    emoji: String,
    title: String,
    statusLabel: String = "GPS Active"
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(TrackBg)
            .border(TrackBorderW, TrackBorder)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = emoji, fontSize = 20.sp)
        Spacer(Modifier.width(8.dp))
        Text(
            text = title,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = TrackMuted,
            modifier = Modifier.weight(1f)
        )
        Box(
            modifier = Modifier
                .background(TrackDanger)
                .border(1.dp, TrackDanger)
                .padding(horizontal = 8.dp, vertical = 1.dp)
        ) {
            Text(
                text = "SOS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
        }
        Spacer(Modifier.width(Spacing.md))
        Text(
            text = statusLabel,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = TrackMuted
        )
    }
}

@Composable
fun TrackerTimer(
    durationSeconds: Int,
    isPaused: Boolean
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = formatDuration(durationSeconds),
            fontSize = 57.sp,
            fontWeight = FontWeight.Black,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
            letterSpacing = (-0.03).sp,
            color = TrackFg,
            textAlign = TextAlign.Center
        )
        Text(
            text = "Elapsed Time",
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = TrackMuted
        )
        if (isPaused) {
            Spacer(Modifier.height(Spacing.sm))
            Text(
                text = "\u23F8 Paused",
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 0.08.sp,
                color = TrackWarning
            )
        }
    }
}

@Composable
fun TrackerMapCard() {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 1f, targetValue = 0.4f,
        animationSpec = infiniteRepeatable(tween(1500), RepeatMode.Reverse),
        label = "pulseAlpha"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(160.dp)
            .padding(horizontal = Spacing.lg)
            .border(TrackBorderW, TrackBorder)
            .background(TrackCardBg),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = "\uD83D\uDCCD", fontSize = 28.sp)
            Spacer(Modifier.height(8.dp))
            Text(
                text = "GPS tracking active",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = TrackMuted
            )
        }
        Box(
            modifier = Modifier
                .align(Alignment.TopStart)
                .offset(x = 30.dp, y = 50.dp)
                .size(80.dp)
        ) { Box(Modifier.fillMaxSize().border(3.dp, TrackAccent)) }
        Box(
            modifier = Modifier
                .align(Alignment.TopStart)
                .offset(x = 50.dp, y = 90.dp)
                .size(60.dp)
        ) { Box(Modifier.fillMaxSize().border(3.dp, TrackAccent)) }
        Box(
            modifier = Modifier
                .size(10.dp)
                .offset(x = 48.dp, y = 58.dp)
                .alpha(pulseAlpha)
                .background(TrackAccent, RoundedCornerShape(5.dp))
                .border(2.dp, TrackFg, RoundedCornerShape(5.dp))
        )
    }
}

@Composable
fun TrackingStatBox(
    value: String,
    unit: String,
    label: String,
    isAccent: Boolean,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .border(TrackBorderW, TrackBorder)
            .background(TrackBg)
            .padding(Spacing.md),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(verticalAlignment = Alignment.Bottom) {
            Text(
                text = value,
                fontSize = 21.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-0.02).sp,
                color = if (isAccent) TrackAccent else TrackFg
            )
            Spacer(Modifier.width(2.dp))
            Text(
                text = unit,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = TrackMuted
            )
        }
        Spacer(Modifier.height(2.dp))
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.05.sp,
            color = TrackMuted
        )
    }
}

@Composable
fun TrackingCtaButton(
    text: String,
    bg: Color,
    textColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    borderColor: Color = Color(0xFF1C293C),
    shadowColor: Color = Color(0xFF1C293C)
) {
    Box(
        modifier = modifier
            .height(56.dp)
            .let { m -> if (enabled) m.clickable { onClick() } else m }
    ) {
        if (enabled) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .offset(x = TrackShadowOffset, y = TrackShadowOffset)
                    .background(shadowColor)
            )
        }
        Box(
            modifier = Modifier
                .fillMaxSize()
                .let { m ->
                    if (enabled) m.background(bg).border(TrackBorderW, borderColor)
                    else m.background(bg.copy(alpha = 0.4f)).border(TrackBorderW, borderColor.copy(alpha = 0.4f))
                },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                color = if (enabled) textColor else textColor.copy(alpha = 0.4f)
            )
        }
    }
}

@Composable
fun TrackingSaveDialog(
    summaryLine: String,
    onDiscard: () -> Unit,
    onSave: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0x99000000))
            .clickable(enabled = false) {},
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = Spacing.xl)
                .border(4.dp, Color(0xFF1C293C))
                .background(Color(0xFFFBFBF9))
                .padding(Spacing.xl)
        ) {
            Text(
                text = "Save Workout?",
                fontSize = 21.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFF1C293C)
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = summaryLine,
                fontSize = 14.sp,
                lineHeight = 21.sp,
                color = Color(0xFF5A6B7E)
            )
            Spacer(Modifier.height(Spacing.lg))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                DialogButton(text = "Discard", bg = Color(0xFFFBFBF9), onClick = onDiscard, Modifier.weight(1f))
                DialogButton(text = "Save", bg = TrackAccent, onClick = onSave, Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun DialogButton(
    text: String,
    bg: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.clickable { onClick() }) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = 3.dp, y = 3.dp)
                .background(Color(0xFF1C293C))
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(bg)
                .border(3.dp, Color(0xFF1C293C))
                .padding(vertical = Spacing.md),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                fontSize = 14.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFF1C293C)
            )
        }
    }
}

fun paceToDisplay(paceSec: Int?): String {
    if (paceSec == null || paceSec <= 0) return "--:--"
    return "${paceSec / 60}:${"%02d".format(paceSec % 60)}"
}

fun speedToDisplay(speedKmh: Double): String = "%.1f".format(speedKmh)

@Composable
fun SwimLapCard(
    lapCount: Int,
    poolLength: Int,
    onLapUp: () -> Unit,
    onLapDown: () -> Unit,
    onPoolLengthChange: (Int) -> Unit
) {
    val totalDist = lapCount * poolLength

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .border(TrackBorderW, TrackBorder)
            .background(TrackCardBg)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "$lapCount",
            fontSize = 64.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = (-0.03).sp,
            color = TrackAccent,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
        )
        Text(
            text = "Laps Completed",
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = TrackMuted
        )
        Spacer(Modifier.height(16.dp))
        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .border(3.dp, Color(0xFF555555))
                    .clickable(enabled = lapCount > 0, onClick = onLapDown),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "\u2212", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = TrackFg)
            }
            Spacer(Modifier.width(12.dp))
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .border(3.dp, Color(0xFF555555))
                    .clickable { onLapUp() },
                contentAlignment = Alignment.Center
            ) {
                Text(text = "+", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = TrackFg)
            }
        }
        Spacer(Modifier.height(12.dp))
        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Pool: ",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = TrackMuted
            )
            Row(
                modifier = Modifier.border(2.dp, Color(0xFF555555)),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .background(if (poolLength == 25) TrackCardBg else TrackBg)
                        .clickable { onPoolLengthChange(25) }
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("25m", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = TrackFg)
                }
                Box(
                    modifier = Modifier
                        .background(if (poolLength == 50) TrackCardBg else TrackBg)
                        .clickable { onPoolLengthChange(50) }
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("50m", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = TrackFg)
                }
            }
            Spacer(Modifier.width(16.dp))
            Text(
                text = "$totalDist m",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = TrackMuted
            )
        }
    }
}
