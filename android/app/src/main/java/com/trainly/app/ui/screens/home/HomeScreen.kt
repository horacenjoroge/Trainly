package com.trainly.app.ui.screens.home
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.components.*
import com.trainly.app.viewmodel.HomeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun HomeScreen(onStats:()->Unit, onProfile:()->Unit, onTrain:()->Unit, onWorkoutHistory:()->Unit, onCommunity:()->Unit, vm:HomeViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle(); val l by vm.likedPostIds.collectAsStateWithLifecycle()
    Scaffold(topBar={
        when(val st=s){ is HomeUiState.Success-> TopAppBar(title={Text("Trainly", fontWeight=FontWeight.Bold, color=MaterialTheme.colorScheme.primary)}, actions={IconButton(onClick={}){Text("\uD83D\uDD14")}; IconButton(onClick=onProfile){Text("\uD83D\uDC64")}}); is HomeUiState.Error-> TopAppBar(title={Text("Trainly", fontWeight=FontWeight.Bold)}, actions={IconButton(onClick=onProfile){Text("\uD83D\uDC64")}}); is HomeUiState.Loading-> TopAppBar(title={Text("Trainly", fontWeight=FontWeight.Bold)}, actions={IconButton(onClick=onProfile){Text("\uD83D\uDC64")}}) }
    }){p->
        when(val st=s){ is HomeUiState.Loading -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
            is HomeUiState.Success -> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) {
                ProgressCard(st.progressStats, false, onStats)
                Spacer(Modifier.height(12.dp))
                Row(Modifier.fillMaxWidth().padding(horizontal=16.dp), horizontalArrangement=Arrangement.spacedBy(12.dp)) {
                    Card(onClick=onTrain, Modifier.weight(1f), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.primary)) {
                        Column(Modifier.fillMaxWidth().padding(16.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("\u25B6\uFE0F", style=MaterialTheme.typography.titleLarge); Spacer(Modifier.height(4.dp)); Text("Start Training", color=MaterialTheme.colorScheme.onPrimary, fontWeight=FontWeight.SemiBold, style=MaterialTheme.typography.labelLarge) }
                    }
                    Card(onClick=onWorkoutHistory, Modifier.weight(1f), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.secondaryContainer)) {
                        Column(Modifier.fillMaxWidth().padding(16.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("\uD83D\uDCCB", style=MaterialTheme.typography.titleLarge); Spacer(Modifier.height(4.dp)); Text("History", fontWeight=FontWeight.SemiBold, style=MaterialTheme.typography.labelLarge) }
                    }
                }
                Spacer(Modifier.height(12.dp))
                Row(Modifier.fillMaxWidth().padding(horizontal=16.dp), horizontalArrangement=Arrangement.SpaceBetween, verticalAlignment=Alignment.CenterVertically) {
                    Text("Community Feed", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleMedium)
                    TextButton(onClick=onCommunity){ Text("See All", color=MaterialTheme.colorScheme.primary) }
                }
                FeedSection(st.posts, l, {vm.likePost(it)},{},{},{})
            }
            is HomeUiState.Error -> Column(Modifier.fillMaxSize().padding(p)) { Text(st.message, color=MaterialTheme.colorScheme.error) }
        }
    }
}
