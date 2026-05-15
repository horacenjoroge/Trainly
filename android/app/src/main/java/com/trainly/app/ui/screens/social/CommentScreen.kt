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
import com.trainly.app.data.remote.dto.CommentDto
import com.trainly.app.utils.DateUtils
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CmtUiState(val comments:List<CommentDto>=emptyList(), val newComment:String="", val isLoading:Boolean=false)
@HiltViewModel class CommentsViewModel @Inject constructor(private val api:ApiService) : ViewModel() {
    private val _s=MutableStateFlow(CmtUiState()); val uiState:StateFlow<CmtUiState> = _s.asStateFlow()
    fun load(id:String){viewModelScope.launch{_s.value=_s.value.copy(isLoading=true); when(val r=api.getPostComments(id)){ is NetworkResult.Success -> _s.value=_s.value.copy(comments=r.data, isLoading=false); else->_s.value=_s.value.copy(isLoading=false) }}}
    fun update(t:String){_s.value=_s.value.copy(newComment=t)}; fun add(id:String){val t=_s.value.newComment.trim(); if(t.isBlank())return; viewModelScope.launch{ when(api.addPostComment(id,t)){ is NetworkResult.Success -> _s.value=_s.value.copy(comments=_s.value.comments+it.data, newComment=""); else->{} } } }
}
@OptIn(ExperimentalMaterial3Api::class)
@Composable fun CommentScreen(postId:String, onBack:()->Unit, vm:CommentsViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle(); LaunchedEffect(postId){vm.load(postId)}
    Scaffold(topBar={TopAppBar(title={Text("Comments", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}})}, bottomBar={ Surface(shadowElevation=8.dp){ Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment=Alignment.CenterVertically) { OutlinedTextField(s.newComment, {vm.update(it)}, placeholder={Text("Comment...")}, modifier=Modifier.weight(1f), shape=RoundedCornerShape(24.dp), singleLine=true); Spacer(Modifier.width(8.dp)); IconButton(onClick={vm.add(postId)}){Text("➡️")} } } }){p-> if(s.comments.isEmpty()) Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text("No comments")} else LazyColumn(Modifier.fillMaxSize().padding(p), contentPadding=PaddingValues(16.dp)){ items(s.comments){ Card(Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp)) { Row(Modifier.padding(12.dp)) { AsyncImage(it.userId?.avatar, null, Modifier.size(36.dp).clip(CircleShape)); Spacer(Modifier.width(8.dp)); Column{ Text(it.userId?.name?:"User", fontWeight=FontWeight.Bold); Text(it.text?:"") } } } } } }
}
