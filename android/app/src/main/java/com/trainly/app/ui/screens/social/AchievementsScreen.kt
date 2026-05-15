package com.trainly.app.ui.screens.social
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.viewmodel.AchievementsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun AchievementsScreen(onBack:()->Unit, vm:AchievementsViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Achievements", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, colors=TopAppBarDefaults.topAppBarColors(containerColor=MaterialTheme.colorScheme.surface))}){p->
        when(val st=s){ is AchievementsUiState.Loading -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
            is AchievementsUiState.Success -> Column(Modifier.fillMaxSize().padding(p)) {
                TabRow(selectedTabIndex=when(st.selectedTab){"earned"->0;"progress"->1;else->2}, containerColor=MaterialTheme.colorScheme.surface) {
                    Tab(st.selectedTab=="earned",{vm.selectTab("earned")}){Text("🏆 Earned")}; Tab(st.selectedTab=="progress",{vm.selectTab("progress")}){Text("📈 Progress")}; Tab(st.selectedTab=="leaderboard",{vm.selectTab("leaderboard")}){Text("🏆 Leaderboard")}
                }
                if(st.selectedTab=="earned") { if(st.achievements.isEmpty()) Box(Modifier.fillMaxSize(), contentAlignment=Alignment.Center){Text("No achievements yet")} else LazyColumn(contentPadding=PaddingValues(16.dp)) { items(st.achievements){ Card(Modifier.fillMaxWidth().padding(vertical=4.dp), shape=RoundedCornerShape(12.dp)) { Row(Modifier.padding(16.dp), verticalAlignment=Alignment.CenterVertically) { Text(it.icon, style=MaterialTheme.typography.displaySmall); Spacer(Modifier.width(12.dp)); Column(Modifier.weight(1f)){Text(it.name, fontWeight=FontWeight.Bold); Text(it.description, style=MaterialTheme.typography.bodySmall)} } } } } }
            }
            is AchievementsUiState.Error -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text(st.message, color=MaterialTheme.colorScheme.error)} }
    }
}
