package com.trainly.app.ui.components
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable fun AppCard(mod:Modifier=Modifier, onClick:(()->Unit)?=null, content:@Composable ()->Unit) {
    val s = RoundedCornerShape(16.dp); val c = CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface); val e = CardDefaults.cardElevation(2.dp)
    if(onClick!=null) Card(onClick=onClick, modifier=mod, shape=s, colors=c, elevation=e) { content() } else Card(modifier=mod, shape=s, colors=c, elevation=e) { content() }
}
