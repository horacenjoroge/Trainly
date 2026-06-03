package com.trainly.app.ui.designsystem.components.indicators

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlyBadge(
    count: Int,
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.error,
    contentColor: Color = MaterialTheme.colorScheme.onError,
    maxCount: Int = 99
) {
    if (count <= 0) return

    val displayText = if (count > maxCount) "$maxCount+" else count.toString()

    Box(
        modifier = modifier
            .size(if (displayText.length > 1) 20.dp else 18.dp)
            .background(color = color, shape = CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = displayText,
            color = contentColor,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 3.dp)
        )
    }
}

@Composable
fun TrainlyDotBadge(
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.error
) {
    Box(
        modifier = modifier
            .size(8.dp)
            .background(color = color, shape = CircleShape)
    )
}

@Preview
@Composable
private fun TrainlyBadgePreview() {
    TrainlyTheme {
        Box(modifier = Modifier.padding(Spacing.lg)) {
            TrainlyBadge(count = 3)
        }
    }
}

@Preview
@Composable
private fun TrainlyDotBadgePreview() {
    TrainlyTheme {
        Box(modifier = Modifier.padding(Spacing.lg)) {
            TrainlyDotBadge()
        }
    }
}
