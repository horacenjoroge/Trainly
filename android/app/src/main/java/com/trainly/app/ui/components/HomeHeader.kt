package com.trainly.app.ui.components
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable fun HomeHeader(name:String, onPost:()->Unit, onNotif:()->Unit, mod:Modifier=Modifier) {
    Box(mod.fillMaxWidth().background(MaterialTheme.colorScheme.primary, RoundedCornerShape(bottomStart=20.dp, bottomEnd=20.dp)).padding(20.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween, verticalAlignment=Alignment.CenterVertically) {
            Text("Welcome back, $name!", style=MaterialTheme.typography.headlineSmall, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.onPrimary, modifier=Modifier.weight(1f))
            Row { IconButton(onClick=onPost){Text("+", color=MaterialTheme.colorScheme.onPrimary, style=MaterialTheme.typography.titleLarge)}; IconButton(onClick=onNotif){Text("🔔")} }
        }
    }
}
