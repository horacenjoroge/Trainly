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

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Community", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onCreatePost, containerColor = MaterialTheme.colorScheme.primary) {
                Text("+", style = MaterialTheme.typography.titleLarge)
            }
        }
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            OutlinedTextField(
                searchQuery, { searchQuery = it; viewModel.search(it) },
                placeholder = { Text("Search...") },
                leadingIcon = { Text("\uD83D\uDD0D") },
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                shape = RoundedCornerShape(12.dp), singleLine = true
            )

            when (val st = uiState) {
                is CommunityFeedUiState.Loading -> {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
                }
                is CommunityFeedUiState.Success -> {
                    if (st.posts.isEmpty()) {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("No posts") }
                    } else {
                        LazyColumn(contentPadding = PaddingValues(16.dp)) {
                            items(st.posts, key = { it.id }) { post ->
                                PostCard(
                                    post = post,
                                    isLiked = likedIds.contains(post.id),
                                    onLike = { viewModel.likePost(post.id) },
                                    onComment = { onComment(post.id) },
                                    onUser = { onUserClick(post.userId) }
                                )
                            }
                        }
                    }
                }
                is CommunityFeedUiState.Error -> {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(st.message, color = MaterialTheme.colorScheme.error)
                    }
                }
            }
        }
    }
}
