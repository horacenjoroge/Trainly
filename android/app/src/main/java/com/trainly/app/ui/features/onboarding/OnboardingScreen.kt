package com.trainly.app.ui.features.onboarding

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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val AuthBg = Color(0xFFFBFBF9)
private val AuthFg = Color(0xFF1C293C)
private val AuthMuted = Color(0xFF5A6B7E)
private val AuthAccent = Color(0xFFFDC800)
private val AuthBorderWidth = 3.dp
private val AuthShadowOffset = 4.dp
private val AuthBtnShadowOffset = 6.dp

private data class SlideData(
    val emoji: @Composable () -> Unit,
    val headline: String,
    val body: String
)

@Composable
fun OnboardingScreen(
    onComplete: () -> Unit
) {
    var currentSlide by remember { mutableStateOf(1) }

    val slides = remember {
        listOf(
            SlideData(
                emoji = {
                    Text(
                        text = "\uD83C\uDFC3\u200D\u2642\uFE0F\uD83D\uDEB4\u200D\u2642\uFE0F\uD83C\uDFCA\u200D\u2642\uFE0F",
                        fontSize = 60.sp,
                        letterSpacing = (-8).sp
                    )
                },
                headline = "Track Every Move",
                body = "Running, cycling, swimming, or gym \u2014 log every rep, mile, and lap with GPS-powered precision."
            ),
            SlideData(
                emoji = {
                    Text("\uD83D\uDC65", fontSize = 72.sp)
                },
                headline = "Find Your Crew",
                body = "Share workouts, cheer friends on, and compete on leaderboards. Fitness is better together."
            ),
            SlideData(
                emoji = {
                    Text("\uD83D\uDEA8", fontSize = 72.sp)
                },
                headline = "Your Safety Net",
                body = "One-tap SOS alerts your emergency contacts with your real-time location. Run fearlessly."
            )
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AuthBg)
    ) {
        Text(
            text = "Skip \u2192",
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = AuthMuted,
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 16.dp, end = 16.dp)
                .clickable { onComplete() }
                .padding(8.dp)
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Spacer(Modifier.weight(1f))

            slides[currentSlide - 1].emoji()

            Spacer(Modifier.height(24.dp))

            Text(
                text = slides[currentSlide - 1].headline,
                fontSize = 35.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-0.03).sp,
                lineHeight = 37.sp,
                color = AuthFg,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(16.dp))

            Text(
                text = slides[currentSlide - 1].body,
                fontSize = 15.sp,
                color = AuthMuted,
                lineHeight = 22.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .width(320.dp)
                    .padding(horizontal = 8.dp)
            )

            Spacer(Modifier.height(16.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                for (i in 1..3) {
                    Box(
                        modifier = Modifier
                            .size(12.dp)
                            .then(
                                if (currentSlide == i) {
                                    Modifier.background(AuthAccent)
                                } else {
                                    Modifier
                                }
                            )
                            .border(2.dp, AuthFg)
                    )
                }
            }

            Spacer(Modifier.height(24.dp))

            OnboardingButton(
                text = if (currentSlide < 3) "Next" else "Get Started",
                onClick = {
                    if (currentSlide < 3) {
                        currentSlide++
                    } else {
                        onComplete()
                    }
                }
            )

            Spacer(Modifier.weight(1f))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Trainly v2.0",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = AuthMuted
                )
                Text(
                    text = "$currentSlide of 3",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = AuthMuted
                )
            }
        }
    }
}

@Composable
private fun OnboardingButton(
    text: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clickable { onClick() }
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .offset(x = AuthBtnShadowOffset, y = AuthBtnShadowOffset)
                .background(AuthFg, RoundedCornerShape(2.dp))
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(AuthAccent, RoundedCornerShape(2.dp))
                .border(AuthBorderWidth, AuthFg, RoundedCornerShape(2.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                fontSize = 17.sp,
                fontWeight = FontWeight.Black,
                color = AuthFg
            )
        }
    }
}
