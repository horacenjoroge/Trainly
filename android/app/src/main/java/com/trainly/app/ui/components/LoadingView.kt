package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable fun LoadingView(msg:String="Loading...", mod:Modifier=Modifier) { Box(mod.fillMaxSize(), contentAlignment=Alignment.Center) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("🏃", style=MaterialTheme.typography.displayLarge); Spacer(Modifier.height(8.dp)); Text(msg, style=MaterialTheme.typography.bodyMedium, color=MaterialTheme.colorScheme.onSurfaceVariant) } } }
@Composable fun ErrorView(msg:String, onRetry:(()->Unit)?=null, mod:Modifier=Modifier) { Box(mod.fillMaxSize(), contentAlignment=Alignment.Center) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("⚠️", style=MaterialTheme.typography.displayLarge); Spacer(Modifier.height(8.dp)); Text(msg); onRetry?.let{ Spacer(Modifier.height(12.dp)); Button(onClick=it){Text("Retry")} } } } }
@Composable fun EmptyStateView(icon:String="📭", title:String="Nothing here", subtitle:String="", actionLabel:String?=null, onAction:(()->Unit)?=null, mod:Modifier=Modifier) { Box(mod.fillMaxSize(), contentAlignment=Alignment.Center) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text(icon, style=MaterialTheme.typography.displayLarge); Spacer(Modifier.height(8.dp)); Text(title, style=MaterialTheme.typography.titleMedium, color=MaterialTheme.colorScheme.onSurfaceVariant); if(subtitle.isNotBlank()){Spacer(Modifier.height(4.dp));Text(subtitle, style=MaterialTheme.typography.bodySmall)}; if(actionLabel!=null&&onAction!=null){Spacer(Modifier.height(12.dp));Button(onClick=onAction){Text(actionLabel)}} } } }
