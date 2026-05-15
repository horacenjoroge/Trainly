package com.trainly.app.ui.screens.social

import androidx.compose.foundation.layout.*
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

sealed class UPUiState {
    data object Loading : UPUiState()
    data class Success(val user: UserDto) : UPUiState()
    data class Error(val message: String) : UPUiState()
}

@HiltViewModel
class UserProfileViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {
    private val _isFollowing = MutableStateFlow(false)
    val isFollowing: StateFlow<Boolean> = _isFollowing.asStateFlow()

    private val _uiState = MutableStateFlow<UPUiState>(UPUiState.Loading)
    val uiState: StateFlow<UPUiState> = _uiState.asStateFlow()

    fun loadProfile(userId: String) {
        viewModelScope.launch {
            _uiState.value = UPUiState.Loading
            when (val r = api.getUserById(userId)) {
                is NetworkResult.Success -> _uiState.value = UPUiState.Success(r.data)
                is NetworkResult.Error -> _uiState.value = UPUiState.Error(r.error.message)
                is NetworkResult.Loading -> { }
            }
        }
    }

    fun toggleFollow(userId: String) {
        viewModelScope.launch {
            if (_isFollowing.value) api.unfollowUser(userId) else api.followUser(userId)
            _isFollowing.value = !_isFollowing.value
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserProfileScreen(
    userId: String,
    onNavigateBack: () -> Unit,
    viewModel: UserProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val isFollowing by viewModel.isFollowing.collectAsStateWithLifecycle()
    LaunchedEffect(userId) { viewModel.loadProfile(userId) }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Profile") }, navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } }) }
    ) { padding ->
        when (val st = uiState) {
            is UPUiState.Loading -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            is UPUiState.Error -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { Text(st.message) }
            is UPUiState.Success -> {
                Column(Modifier.fillMaxSize().padding(padding).padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    AsyncImage(st.user.avatar, null, Modifier.size(100.dp).clip(CircleShape))
                    Spacer(Modifier.height(16.dp))
                    Text(st.user.name ?: "User", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(16.dp))
                    Button(onClick = { viewModel.toggleFollow(userId) }) { Text(if (isFollowing) "Unfollow" else "Follow") }
                }
            }
        }
    }
}
