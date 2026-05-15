package com.trainly.app.ui.screens.social

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import coil.compose.AsyncImage
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.UserDto
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FFUiState(val q: String = "", val results: List<UserDto> = emptyList())

@HiltViewModel
class FindFriendsViewModel @Inject constructor(private val api: ApiService) : ViewModel() {
    private val _s = MutableStateFlow(FFUiState())
    val uiState: StateFlow<FFUiState> = _s.asStateFlow()

    fun search(query: String) {
        _s.value = _s.value.copy(q = query)
        if (query.length < 2) { _s.value = _s.value.copy(results = emptyList()); return }
        viewModelScope.launch {
            when (val r = api.searchUsers(query)) {
                is NetworkResult.Success -> _s.value = _s.value.copy(results = r.data)
                else -> { }
            }
        }
    }

    fun followUser(id: String) { viewModelScope.launch { api.followUser(id) } }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FindFriendsScreen(onNavigateBack: () -> Unit, onUserClick: (String) -> Unit, vm: FindFriendsViewModel = hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(
        topBar = { TopAppBar(title = { Text("Find Friends") }, navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } }) }
    ) { p ->
        Column(Modifier.fillMaxSize().padding(p)) {
            OutlinedTextField(s.q, { vm.search(it) }, placeholder = { Text("Search...") }, leadingIcon = { Text("\uD83D\uDD0D") }, modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(12.dp), singleLine = true)
            LazyColumn(contentPadding = PaddingValues(horizontal = 16.dp)) {
                items(s.results) { user ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp), shape = RoundedCornerShape(12.dp)) {
                        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            AsyncImage(user.avatar, null, Modifier.size(48.dp).clip(CircleShape))
                            Spacer(Modifier.width(12.dp))
                            Column(Modifier.weight(1f)) { Text(user.name ?: "", fontWeight = FontWeight.Bold) }
                            Button(onClick = { user.id?.let { vm.followUser(it) } }, shape = RoundedCornerShape(20.dp)) { Text("Follow") }
                        }
                    }
                }
            }
        }
    }
}
