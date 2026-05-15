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
import com.trainly.app.viewmodel.CommunityFeedViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun CommunityFeedScreen(onBack:()->Unit, onCreate:()->Unit, onComment:(String)->Unit, onUser:(String)->Unit, vm:CommunityFeedViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle(); val l by vm.likedPostIds.collectAsStateWithLifecycle(); var q by remember{mutableStateOf("")}
    Scaffold(topBar={TopAppBar(title={Text("Community", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, colors=TopAppBarDefaults.topAppBarColors(containerColor=MaterialTheme.colorScheme.surface))}, floatingActionButton={FloatingActionButton(onClick=onCreate, containerColor=MaterialTheme.colorScheme.primary){Text("+")}}){p->
        Column(Modifier.fillMaxSize().padding(p)) {
            OutlinedTextField(q, {q=it; vm.search(it)}, placeholder={Text("Search...")}, leadingIcon={Text("🔍")}, modifier=Modifier.fillMaxWidth().padding(16.dp), shape=RoundedCornerShape(12.dp), singleLine=true)
            when(val st=s){ is CommunityFeedUiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment=Alignment.Center){CircularProgressIndicator()}
                is CommunityFeedUiState.Success -> if(st.posts.isEmpty()) Box(Modifier.fillMaxSize(), contentAlignment=Alignment.Center){Text("No posts")} else LazyColumn(contentPadding=PaddingValues(16.dp)) { items(st.posts){ PostCard(it, l.contains(it.id), {vm.likePost(it.id)}, {onComment(it.id)}, {onUser(it.userId)}) } }
                is CommunityFeedUiState.Error -> Box(Modifier.fillMaxSize(), contentAlignment=Alignment.Center){Text(st.message, color=MaterialTheme.colorScheme.error)} }
        }
    }
}
