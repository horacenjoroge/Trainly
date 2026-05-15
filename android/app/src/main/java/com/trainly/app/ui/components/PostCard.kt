package com.trainly.app.ui.components
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.trainly.app.domain.models.Post
import com.trainly.app.utils.DateUtils

@Composable fun PostCard(post:Post, isLiked:Boolean, onLike:()->Unit, onComment:()->Unit, onUser:()->Unit, mod:Modifier=Modifier) {
    Card(mod.padding(bottom=12.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.padding(16.dp)) {
            Row(Modifier.fillMaxWidth().clickable(onClick=onUser), verticalAlignment=Alignment.CenterVertically) {
                AsyncImage(post.userAvatar, "avatar", Modifier.size(40.dp).clip(CircleShape), contentScale=ContentScale.Crop)
                Spacer(Modifier.width(12.dp)); Column { Text(post.userName, fontWeight=FontWeight.SemiBold); Text(DateUtils.formatTimeAgo(post.createdAt), style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
            }
            if(!post.content.isNullOrBlank()){ Spacer(Modifier.height(8.dp)); Text(post.content) }
            Spacer(Modifier.height(8.dp))
            Row { TextButton(onClick=onLike, colors=ButtonDefaults.textButtonColors(contentColor=if(isLiked) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant)) { Text(if(isLiked)"♥" else "♡"); Spacer(Modifier.width(4.dp)); Text("${post.likes.size}") }; TextButton(onClick=onComment, colors=ButtonDefaults.textButtonColors(contentColor=MaterialTheme.colorScheme.onSurfaceVariant)) { Text("💬"); Spacer(Modifier.width(4.dp)); Text("${post.comments.size}") } }
        }
    }
}
