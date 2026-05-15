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
import com.trainly.app.viewmodel.AchievementsUiState
import com.trainly.app.viewmodel.AchievementsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AchievementsScreen(
    onNavigateBack: () -> Unit,
    viewModel: AchievementsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Achievements", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { padding ->
        when (val st = uiState) {
            is AchievementsUiState.Loading -> {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            }
            is AchievementsUiState.Success -> {
                Column(Modifier.fillMaxSize().padding(padding)) {
                    TabRow(
                        selectedTabIndex = when (st.selectedTab) { "earned" -> 0; "progress" -> 1; else -> 2 },
                        containerColor = MaterialTheme.colorScheme.surface
                    ) {
                        Tab(st.selectedTab == "earned", { viewModel.selectTab("earned") }) { Text("\uD83C\uDFC6 Earned") }
                        Tab(st.selectedTab == "progress", { viewModel.selectTab("progress") }) { Text("\uD83D\uDCC8 Progress") }
                        Tab(st.selectedTab == "leaderboard", { viewModel.selectTab("leaderboard") }) { Text("\uD83C\uDFC6 Leaderboard") }
                    }
                    if (st.selectedTab == "earned") {
                        if (st.achievements.isEmpty()) {
                            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("No achievements yet") }
                        } else {
                            LazyColumn(contentPadding = PaddingValues(16.dp)) {
                                items(st.achievements) { a ->
                                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp), shape = RoundedCornerShape(12.dp)) {
                                        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                                            Text(a.icon, style = MaterialTheme.typography.displaySmall)
                                            Spacer(Modifier.width(12.dp))
                                            Column(Modifier.weight(1f)) {
                                                Text(a.name, fontWeight = FontWeight.Bold)
                                                Text(a.description, style = MaterialTheme.typography.bodySmall)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            is AchievementsUiState.Error -> {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Text(st.message, color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }
}
