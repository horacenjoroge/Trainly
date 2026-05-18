package com.trainly.app.ui.features.social

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import coil.compose.AsyncImage
import com.trainly.app.domain.models.Post
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.Elevation
import com.trainly.app.ui.designsystem.theme.IconSize
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.utils.DateUtils

@Composable
fun PostCard(
    post: Post,
    isLiked: Boolean,
    onLike: () -> Unit,
    onComment: () -> Unit,
    onUser: () -> Unit,
    modifier: Modifier = Modifier
) {
    val shape = androidx.compose.foundation.shape.RoundedCornerShape(Radii.card)

    Card(
        onClick = {},
        modifier = modifier.fillMaxWidth(),
        shape = shape,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = Elevation.none
        ),
        border = BorderStroke(BorderWidth.thin, MaterialTheme.colorScheme.outline)
    ) {
        Column(modifier = Modifier.padding(Spacing.lg)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                AsyncImage(
                    model = post.userAvatar,
                    contentDescription = "${post.userName} avatar",
                    modifier = Modifier
                        .size(IconSize.xl)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )
                Spacer(Modifier.width(Spacing.md))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = post.userName,
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleSmall
                    )
                    Text(
                        text = DateUtils.formatTimeAgo(post.createdAt),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            if (!post.content.isNullOrBlank()) {
                Spacer(Modifier.height(Spacing.sm))
                Text(
                    text = post.content ?: "",
                    style = MaterialTheme.typography.bodyMedium
                )
            }

            Spacer(Modifier.height(Spacing.sm))
            Row {
                TextButton(onClick = onLike) {
                    Text(
                        text = if (isLiked) "\u2764\uFE0F" else "\uD83E\uDD0D",
                        style = MaterialTheme.typography.titleSmall
                    )
                    Spacer(Modifier.width(Spacing.xs))
                    Text(
                        text = "${post.likes}",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                TextButton(onClick = onComment) {
                    Text(
                        text = "\uD83D\uDCAC",
                        style = MaterialTheme.typography.titleSmall
                    )
                    Spacer(Modifier.width(Spacing.xs))
                    Text(
                        text = "${post.comments}",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }
    }
}
