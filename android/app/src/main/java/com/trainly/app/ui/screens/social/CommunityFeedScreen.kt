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
import com.trainly.app.ui.components.PostCard
import com.trainly.app.viewmodel.CommunityFeedUiState
import com.trainly.app.viewmodel.CommunityFeedViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CommunityFeedScreen(
    onNavigateBack: () -> Unit,
    onCreatePost: () -> Unit,
    onComment: (String) -> Unit,
    onUserClick: (String) -> Unit,
    viewModel: CommunityFeedViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val likedIds by viewModel.likedPostIds.collectAsStateWithLifecycle()
    var searchQuery by remember { mutableStateOf("") }
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Community", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onCreatePost, containerColor = MaterialTheme.colorScheme.primary, shape = RoundedCornerShape(16.dp)) {
                Text("+", style = MaterialTheme.typography.titleLarge)
            }
        }
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            OutlinedTextField(
                searchQuery, { searchQuery = it; viewModel.search(it) },
                placeholder = { Text("Search users...") },
                leadingIcon = { Text("\uD83D\uDD0D") },
                modifier = Modifier.fillMaxWidth().padding(horizontal=16.dp, vertical=8.dp),
                shape = RoundedCornerShape(12.dp), singleLine = true, colors = OutlinedTextFieldDefaults.colors(unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha=0.5f))
            )
            TabRow(selectedTabIndex = selectedTab, containerColor = MaterialTheme.colorScheme.surface, contentColor = MaterialTheme.colorScheme.primary) {
                Tab(selectedTab == 0, { selectedTab = 0 }) { Text("\uD83D\uDCA5 Feed", Modifier.padding(12.dp), fontWeight = if (selectedTab == 0) FontWeight.SemiBold else FontWeight.Normal) }
                Tab(selectedTab == 1, { selectedTab = 1 }) { Text("\uD83C\uDFC6 Achievements", Modifier.padding(12.dp), fontWeight = if (selectedTab == 1) FontWeight.SemiBold else FontWeight.Normal) }
                Tab(selectedTab == 2, { selectedTab = 2 }) { Text("\uD83D\uDC65 Friends", Modifier.padding(12.dp), fontWeight = if (selectedTab == 2) FontWeight.SemiBold else FontWeight.Normal) }
            }
            when (selectedTab) {
                0 -> when (val st = uiState) {
                    is CommunityFeedUiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
                    is CommunityFeedUiState.Success -> {
                        if (st.posts.isEmpty()) Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("\uD83D\uDC4B", style=MaterialTheme.typography.displayMedium); Text("No posts yet", fontWeight=FontWeight.SemiBold); Text("Be the first to share!", style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) } }
                        else LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            items(st.posts, key = { it.id }) { post ->
                                PostCard(post = post, isLiked = likedIds.contains(post.id), onLike = { viewModel.likePost(post.id) }, onComment = { onComment(post.id) }, onUser = { onUserClick(post.userId) })
                            }
                        }
                    }
                    is CommunityFeedUiState.Error -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text(st.message, color = MaterialTheme.colorScheme.error) }
                }
                1 -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("Achievements", fontWeight=FontWeight.SemiBold) }
                2 -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("Friends", fontWeight=FontWeight.SemiBold) }
            }
        }
    }
}
