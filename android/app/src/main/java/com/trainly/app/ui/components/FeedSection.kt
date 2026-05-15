package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.trainly.app.domain.models.Post

@Composable fun FeedSection(posts:List<Post>, likedIds:Set<String>, onLike:(String)->Unit, onComment:(String)->Unit, onUser:(String)->Unit, onCreate:()->Unit, mod:Modifier=Modifier) {
    Card(mod.padding(horizontal=16.dp, vertical=8.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.padding(20.dp)) {
            Text("Community Feed", fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary)
            if(posts.isEmpty()) { Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment=Alignment.Center) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("No posts yet."); Spacer(Modifier.height(12.dp)); Button(onClick=onCreate, shape=RoundedCornerShape(24.dp)) { Text("Create Post") } } } }
            else posts.forEach { PostCard(it, likedIds.contains(it.id), { onLike(it.id) }, { onComment(it.id) }, { onUser(it.userId) }) }
        }
    }
}
