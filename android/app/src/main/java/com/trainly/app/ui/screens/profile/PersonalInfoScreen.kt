package com.trainly.app.ui.screens.profile
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PIUiState(val name:String="", val bio:String="", val location:String="", val isLoading:Boolean=true, val isSaving:Boolean=false)
@HiltViewModel class PersonalInfoViewModel @Inject constructor(private val api:ApiService):ViewModel(){
    private val _s=MutableStateFlow(PIUiState());val uiState:StateFlow<PIUiState> = _s.asStateFlow()
    init { load() }
    fun load() {
        viewModelScope.launch {
            when (val result = api.getUserProfile()) {
                is NetworkResult.Success -> {
                    val d = result.data
                    _s.value = PIUiState(name = d.name ?: "", bio = d.bio ?: "", isLoading = false)
                }
                else -> _s.value = _s.value.copy(isLoading = false)
            }
        }
    }
    fun updateName(n:String){_s.value=_s.value.copy(name=n)};fun updateBio(b:String){_s.value=_s.value.copy(bio=b)}
    fun save(){viewModelScope.launch{_s.value=_s.value.copy(isSaving=true);when(api.updateUserProfile(mapOf("name" to _s.value.name,"bio" to _s.value.bio))){is NetworkResult.Success->_s.value=_s.value.copy(isSaving=false);else->_s.value=_s.value.copy(isSaving=false)}}}
}
@OptIn(ExperimentalMaterial3Api::class) @Composable fun PersonalInfoScreen(onBack:()->Unit, vm:PersonalInfoViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Personal Info", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, actions={TextButton(onClick={vm.save()}){Text("Save", fontWeight=FontWeight.Bold)}})})
    {p-> if(s.isLoading)Box(Modifier.fillMaxSize().padding(p), contentAlignment=androidx.compose.ui.Alignment.Center){CircularProgressIndicator()} else Column(Modifier.fillMaxSize().padding(p).padding(16.dp), verticalArrangement=Arrangement.spacedBy(12.dp)){
        OutlinedTextField(s.name, {vm.updateName(it)}, label={Text("Name")}, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp)); OutlinedTextField(s.bio, {vm.updateBio(it)}, label={Text("Bio")}, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), minLines=3) } }
}
