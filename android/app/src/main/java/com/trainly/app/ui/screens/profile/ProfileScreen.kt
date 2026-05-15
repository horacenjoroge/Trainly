package com.trainly.app.ui.screens.profile
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.trainly.app.viewmodel.ProfileViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun ProfileScreen(onBack:()->Unit, onSettings:()->Unit, vm:ProfileViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={ TopAppBar(title={Text("Profile", fontWeight=FontWeight.Bold)}, actions={IconButton(onClick=onSettings){Text("\u2699\uFE0F")}}) }){p->
        when(val st=s){ is ProfileUiState.Loading -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
            is ProfileUiState.Success -> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) {
                Column(Modifier.fillMaxWidth().padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) {
                    AsyncImage(st.avatar, "avatar", Modifier.size(100.dp).clip(CircleShape), contentScale=ContentScale.Crop)
                    Spacer(Modifier.height(12.dp)); Text(st.userName, fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleLarge)
                    Text(st.userBio, color=MaterialTheme.colorScheme.onSurfaceVariant, textAlign=TextAlign.Center, style=MaterialTheme.typography.bodyMedium)
                    Spacer(Modifier.height(16.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceEvenly) {
                        Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("${st.followers}", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleMedium); Text("Followers", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
                        Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("${st.following}", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleMedium); Text("Following", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
                        Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("${st.stats.workouts}", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleMedium); Text("Workouts", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
                    }
                }
                Spacer(Modifier.height(8.dp))
                Row(Modifier.fillMaxWidth().padding(horizontal=16.dp), horizontalArrangement=Arrangement.spacedBy(12.dp)) {
                    Card(Modifier.weight(1f), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surfaceVariant)) {
                        Column(Modifier.fillMaxWidth().padding(12.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("\uD83D\uDCCB", style=MaterialTheme.typography.titleLarge); Text("History", style=MaterialTheme.typography.bodySmall) }
                    }
                    Card(Modifier.weight(1f), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surfaceVariant)) {
                        Column(Modifier.fillMaxWidth().padding(12.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("\uD83C\uDFC6", style=MaterialTheme.typography.titleLarge); Text("Achievements", style=MaterialTheme.typography.bodySmall) }
                    }
                    Card(Modifier.weight(1f), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surfaceVariant)) {
                        Column(Modifier.fillMaxWidth().padding(12.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("\uD83D\uDCCA", style=MaterialTheme.typography.titleLarge); Text("Stats", style=MaterialTheme.typography.bodySmall) }
                    }
                }
                Spacer(Modifier.height(16.dp))
                Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Quick Stats", fontWeight=FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        Row(Modifier.fillMaxWidth()) {
                            Column(Modifier.weight(1f)) { Text("\uD83D\uDD25 Calories", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant); Text("${st.stats.calories}", fontWeight=FontWeight.SemiBold) }
                            Column(Modifier.weight(1f)) { Text("\u23F1 Hours", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant); Text("${st.stats.hours}h", fontWeight=FontWeight.SemiBold) }
                        }
                    }
                }
            }
            is ProfileUiState.Error -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text(st.message)}
        }
    }
}
