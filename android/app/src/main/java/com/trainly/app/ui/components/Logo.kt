package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable fun AppLogo(mod:Modifier=Modifier, tagline:Boolean=true) { Column(mod, horizontalAlignment=Alignment.CenterHorizontally) { Text("🏃", fontSize=64.sp); Text("Trainly", style=MaterialTheme.typography.headlineLarge, fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary); if(tagline) Text("Your Personal Fitness Companion", style=MaterialTheme.typography.bodyMedium, color=MaterialTheme.colorScheme.onSurfaceVariant) } }
