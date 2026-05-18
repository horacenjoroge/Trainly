package com.trainly.app.ui.features.auth

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val AuthBg = Color(0xFFFBFBF9)
private val AuthFg = Color(0xFF1C293C)
private val AuthMuted = Color(0xFF5A6B7E)
private val AuthAccent = Color(0xFFFDC800)
private val AuthBorderThick = 4.dp

@Composable
fun SplashScreen(
    onNavigateToAuth: () -> Unit,
    onNavigateToMain: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "splash")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    val barOffsetPx by infiniteTransition.animateFloat(
        initialValue = -48f,
        targetValue = 168f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Restart
        ),
        label = "barMove"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AuthBg),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(24.dp),
            modifier = Modifier.padding(24.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .rotate(12f)
                    .scale(pulseScale)
                    .background(AuthAccent, RoundedCornerShape(2.dp))
                    .border(AuthBorderThick, AuthFg, RoundedCornerShape(2.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "T",
                    fontWeight = FontWeight.Black,
                    fontSize = 32.sp,
                    color = AuthFg
                )
            }

            Text(
                text = "Trainly",
                fontWeight = FontWeight.Black,
                fontSize = 35.sp,
                letterSpacing = (-0.03).sp,
                color = AuthFg
            )

            Text(
                text = "Your training, untamed.\nGPS routes, analytics, and community.",
                fontSize = 15.sp,
                color = AuthMuted,
                textAlign = TextAlign.Center
            )

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .width(120.dp)
                        .height(4.dp)
                        .background(AuthFg)
                ) {
                    Box(
                        modifier = Modifier
                            .offset(x = barOffsetPx.dp)
                            .width(48.dp)
                            .height(4.dp)
                            .background(AuthAccent)
                    )
                }

                Text(
                    text = "Checking account...",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = AuthMuted
                )
            }
        }
    }
}

@Preview
@Composable
private fun SplashScreenPreview() {
    SplashScreen(
        onNavigateToAuth = {},
        onNavigateToMain = {}
    )
}
