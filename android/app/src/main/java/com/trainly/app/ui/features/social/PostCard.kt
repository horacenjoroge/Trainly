package com.trainly.app.ui.features.social

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.trainly.app.domain.models.Post
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.utils.DateUtils

private val CardFg = Color(0xFF1C293C)
private val CardMuted = Color(0xFF5A6B7E)
private val CardAccent = Color(0xFFFDC800)
private val CardBg = Color(0xFFFBFBF9)
private val CardBorderWidth = 3.dp
private val CardShadowOffset = 4.dp

private val avatarColors = listOf(
    Color(0xFFFDC800),
    Color(0xFF432DD7),
    Color(0xFF16A34A),
    Color(0xFFDC2626),
    Color(0xFFE57C0B),
    Color(0xFF2979FF)
)

private fun getInitials(name: String): String {
    val parts = name.trim().split("\\s+".toRegex())
    return parts.take(2).joinToString("") { it.firstOrNull()?.uppercase() ?: "" }
}

private fun avatarColor(name: String): Color {
    val idx = kotlin.math.abs(name.hashCode()) % avatarColors.size
    return avatarColors[idx]
}

@Composable
fun PostCard(
    post: Post,
    isLiked: Boolean,
    onLike: () -> Unit,
    onComment: () -> Unit,
    onUser: () -> Unit,
    modifier: Modifier = Modifier
) {
    val initials = getInitials(post.userName)
    val avatarBg = avatarColor(post.userName)
    val initialsColor = if (avatarBg == CardAccent) CardFg else Color.White

    Box(modifier = modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(x = CardShadowOffset, y = CardShadowOffset)
                .background(CardFg)
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardBg)
                .border(CardBorderWidth, CardFg)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 12.dp, end = 12.dp, top = 12.dp, bottom = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .background(avatarBg)
                        .border(2.dp, CardFg),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = initials,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = initialsColor
                    )
                }
                Spacer(Modifier.width(10.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = post.userName,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = CardFg,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = DateUtils.formatTimeAgo(post.createdAt),
                        fontSize = 11.sp,
                        color = CardMuted
                    )
                }
                post.workout?.let { w ->
                    val emoji = when (w.type) {
                        "Running" -> "\uD83C\uDFC3"
                        "Cycling" -> "\uD83D\uDEB2"
                        "Swimming" -> "\uD83C\uDFCA"
                        "Gym" -> "\uD83C\uDFCB"
                        else -> ""
                    }
                    Text(
                        text = emoji,
                        fontSize = 16.sp
                    )
                }
            }

            if (!post.content.isNullOrBlank()) {
                Text(
                    text = post.content ?: "",
                    fontSize = 14.sp,
                    lineHeight = 21.sp,
                    color = CardFg,
                    modifier = Modifier.padding(start = 12.dp, end = 12.dp, bottom = 8.dp)
                )
            }

            post.workout?.let { w ->
                val badgeText = buildString {
                    append(w.type?.let { when (it) {
                        "Running" -> "\uD83C\uDFC3"
                        "Cycling" -> "\uD83D\uDEB2"
                        "Swimming" -> "\uD83C\uDFCA"
                        "Gym" -> "\uD83C\uDFCB"
                        else -> ""
                    } } ?: "")
                    val dist = w.distance ?: 0.0
                    val dur = w.duration ?: 0
                    if (dist > 0) {
                        val d = if (dist >= 1000) "%.1f km".format(dist / 1000) else "${dist.toInt()} m"
                        append(" $d")
                    }
                    if (dur > 0) {
                        val min = dur / 60
                        if (dist > 0) append(" \u00B7")
                        if (min >= 60) append(" ${min / 60}h ${min % 60}min")
                        else append(" ${min}min")
                    }
                }.trim()
                if (badgeText.isNotBlank()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 12.dp, end = 12.dp, bottom = 8.dp)
                            .border(2.dp, CardFg)
                            .background(CardAccent)
                            .padding(horizontal = 10.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = badgeText,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = CardFg
                        )
                    }
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(2.dp, CardFg)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier
                        .weight(1f)
                        .border(0.dp, CardFg) // right border via Box divider
                        .clickable { onLike() }
                        .padding(vertical = 10.dp)
                ) {
                    Text(
                        text = if (isLiked) "\u2764\uFE0F" else "\u2764\uFE0F",
                        fontSize = 13.sp,
                        color = if (isLiked) Color(0xFFDC2626) else CardMuted,
                        fontWeight = if (isLiked) FontWeight.Black else FontWeight.Normal
                    )
                    Spacer(Modifier.width(4.dp))
                    Text(
                        text = "${post.likes.size}",
                        fontSize = 13.sp,
                        fontWeight = if (isLiked) FontWeight.Black else FontWeight.SemiBold,
                        color = if (isLiked) Color(0xFFDC2626) else CardMuted
                    )
                }
                Box(
                    modifier = Modifier
                        .width(2.dp)
                        .height(44.dp)
                        .background(CardFg)
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onComment() }
                        .padding(vertical = 10.dp)
                ) {
                    Text(
                        text = "\uD83D\uDCAC",
                        fontSize = 13.sp
                    )
                    Spacer(Modifier.width(4.dp))
                    Text(
                        text = "${post.comments.size}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = CardMuted
                    )
                }
            }
        }
    }
}

@Preview
@Composable
private fun PostCardPreview() {
    TrainlyTheme {
        PostCard(
            post = Post(
                id = "1",
                userId = "u1",
                userName = "Alex Chen",
                content = "New PB on the trail today! Felt strong the whole way.",
                likes = listOf("a", "b", "c"),
                comments = listOf(),
                createdAt = "2026-01-15T10:30:00.000Z"
            ),
            isLiked = false,
            onLike = {},
            onComment = {},
            onUser = {}
        )
    }
}
