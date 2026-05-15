package com.trainly.app.ui.screens.home
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.components.*
import com.trainly.app.viewmodel.HomeViewModel

@Composable fun HomeScreen(onStats:()->Unit, onProfile:()->Unit, onTrain:()->Unit, vm:HomeViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle(); val l by vm.likedPostIds.collectAsStateWithLifecycle()
    Scaffold(topBar={ when(val st=s){ is HomeUiState.Success-> HomeHeader(st.userName, {}, {}); is HomeUiState.Error-> HomeHeader(st.userName, {}, {}); is HomeUiState.Loading-> HomeHeader("User", {}, {}) } }){p->
        when(val st=s){ is HomeUiState.Loading -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
            is HomeUiState.Success -> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) { ProgressCard(st.progressStats, false, onStats); QuickActions(onTrain, {}); FeedSection(st.posts, l, {vm.likePost(it)},{},{},{}) }
            is HomeUiState.Error -> Column(Modifier.fillMaxSize().padding(p)) { Text(st.message, color=MaterialTheme.colorScheme.error) }
        }
    }
}
