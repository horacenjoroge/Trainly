package com.trainly.app.ui.screens.social
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.CreatePostRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CPUiState(val content:String="", val isLoading:Boolean=false, val error:String?=null)
@HiltViewModel class CreatePostViewModel @Inject constructor(private val api:ApiService) : ViewModel() {
    private val _s=MutableStateFlow(CPUiState()); val uiState:StateFlow<CPUiState> = _s.asStateFlow()
    private val _p=MutableStateFlow(false); val postCreated:StateFlow<Boolean> = _p.asStateFlow()
    fun update(t:String){_s.value=_s.value.copy(content=t)}; fun create(){val c=_s.value.content.trim(); if(c.isBlank()){_s.value=_s.value.copy(error="Content required");return}; _s.value=_s.value.copy(isLoading=true); viewModelScope.launch { when(api.createPost(CreatePostRequest(c))){ is NetworkResult.Success -> _p.value=true; is NetworkResult.Error -> _s.value=_s.value.copy(isLoading=false, error="Failed to post"); else->{} } } }
}
@OptIn(ExperimentalMaterial3Api::class)
@Composable fun CreatePostScreen(onBack:()->Unit, vm:CreatePostViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle(); val p by vm.postCreated.collectAsStateWithLifecycle()
    LaunchedEffect(p){if(p)onBack()}
    Scaffold(topBar={TopAppBar(title={Text("Create Post", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("\u2190")}}, actions={TextButton(onClick={vm.create()}, enabled=!s.isLoading&&s.content.isNotBlank()){Text("Share", fontWeight=FontWeight.Bold)}}, colors=TopAppBarDefaults.topAppBarColors(containerColor=MaterialTheme.colorScheme.surface))}){pad->
        Column(Modifier.fillMaxSize().padding(pad).padding(16.dp)) {
            s.error?.let{ Surface(Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), color=MaterialTheme.colorScheme.error.copy(alpha=0.1f)){Text(it, Modifier.padding(12.dp), color=MaterialTheme.colorScheme.error)} }
            OutlinedTextField(s.content, {vm.update(it)}, placeholder={Text("What's on your mind?")}, modifier=Modifier.fillMaxWidth().heightIn(min=200.dp), shape=RoundedCornerShape(12.dp))
            if(s.isLoading) LinearProgressIndicator(Modifier.fillMaxWidth().padding(top=16.dp))
        }
    }
}
