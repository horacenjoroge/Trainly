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
import coil.compose.AsyncImage
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.UserDto
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FLUiState(val users:List<UserDto>=emptyList(), val loading:Boolean=true)
@HiltViewModel class FollowListViewModel @Inject constructor(private val api:ApiService) : ViewModel() {
    private val _s=MutableStateFlow(FLUiState()); val uiState:StateFlow<FLUiState> = _s.asStateFlow()
    fun loadFollowers(){viewModelScope.launch{_s.value=FLUiState(loading=true); when(val r=api.getFollowers()){ is NetworkResult.Success -> _s.value=FLUiState(users=r.data); else->_s.value=FLUiState(loading=false) }}}
    fun loadFollowing(){viewModelScope.launch{_s.value=FLUiState(loading=true); when(val r=api.getFollowing()){ is NetworkResult.Success -> _s.value=FLUiState(users=r.data); else->_s.value=FLUiState(loading=false) }}}
}
@OptIn(ExperimentalMaterial3Api::class) @Composable fun FollowersListScreen(onBack:()->Unit, onUser:(String)->Unit, vm:FollowListViewModel= hiltViewModel()) { LaunchedEffect(Unit){vm.loadFollowers()}; FollowListContent("Followers", onBack, vm) }
@OptIn(ExperimentalMaterial3Api::class) @Composable fun FollowingListScreen(onBack:()->Unit, onUser:(String)->Unit, vm:FollowListViewModel= hiltViewModel()) { LaunchedEffect(Unit){vm.loadFollowing()}; FollowListContent("Following", onBack, vm) }
@Composable private fun FollowListContent(t:String, onBack:()->Unit, vm:FollowListViewModel) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text(t, fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}})}){p->
        if(s.loading) Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
        else if(s.users.isEmpty()) Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text("No users")}
        else LazyColumn(Modifier.fillMaxSize().padding(p), contentPadding=PaddingValues(16.dp)) { items(s.users){ Card(Modifier.fillMaxWidth().padding(vertical=4.dp), shape=RoundedCornerShape(12.dp)) { Row(Modifier.padding(12.dp), verticalAlignment=Alignment.CenterVertically) { AsyncImage(it.avatar, null, Modifier.size(48.dp).clip(CircleShape)); Spacer(Modifier.width(12.dp)); Text(it.name?:"", fontWeight=FontWeight.Bold) } } } } }
}
