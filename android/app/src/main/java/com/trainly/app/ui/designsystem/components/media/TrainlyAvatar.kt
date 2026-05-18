package com.trainly.app.ui.designsystem.components.media

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import coil.compose.AsyncImage
import com.trainly.app.ui.designsystem.theme.BorderWidth
import com.trainly.app.ui.designsystem.theme.IconSize
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyAvatar(
    imageUrl: String?,
    name: String,
    modifier: Modifier = Modifier,
    size: Dp = IconSize.xl
) {
    if (imageUrl != null) {
        AsyncImage(
            model = imageUrl,
            contentDescription = "$name avatar",
            modifier = modifier
                .size(size)
                .clip(CircleShape),
            contentScale = ContentScale.Crop
        )
    } else {
        val initials = name.split(" ")
            .take(2)
            .mapNotNull { it.firstOrNull()?.uppercase() }
            .joinToString("")

        Surface(
            modifier = modifier.size(size),
            shape = CircleShape,
            color = MaterialTheme.colorScheme.primaryContainer,
            border = androidx.compose.foundation.BorderStroke(
                BorderWidth.thick,
                MaterialTheme.colorScheme.outline
            )
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text(
                    text = initials.ifEmpty { "?" },
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Preview
@Composable
private fun TrainlyAvatarPreview() {
    TrainlyTheme {
        Box(modifier = Modifier.padding(Spacing.lg)) {
            TrainlyAvatar(
                imageUrl = null,
                name = "John Doe",
                size = IconSize.xl
            )
        }
    }
}
