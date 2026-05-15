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

data class ESUiState(val weight:String="", val height:String="", val level:String="Beginner", val saving:Boolean=false)
@HiltViewModel class EditStatsViewModel @Inject constructor(private val api:ApiService):ViewModel(){
    private val _s=MutableStateFlow(ESUiState());val uiState:StateFlow<ESUiState> = _s.asStateFlow()
    fun updateWeight(w:String){_s.value=_s.value.copy(weight=w)};fun updateHeight(h:String){_s.value=_s.value.copy(height=h)};fun updateLevel(l:String){_s.value=_s.value.copy(level=l)}
    fun save(onOK:()->Unit){viewModelScope.launch{_s.value=_s.value.copy(saving=true);when(api.updateUserStats(mapOf("weight" to _s.value.weight,"height" to _s.value.height,"fitnessLevel" to _s.value.level))){is NetworkResult.Success->onOK();else->_s.value=_s.value.copy(saving=false)}}}
}
@OptIn(ExperimentalMaterial3Api::class) @Composable fun EditStatsScreen(onBack:()->Unit, vm:EditStatsViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Edit Stats", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, actions={TextButton(onClick={vm.save(onSuccess=onBack)}){Text("Save", fontWeight=FontWeight.Bold)}})})
    {p-> Column(Modifier.fillMaxSize().padding(p).padding(16.dp), verticalArrangement=Arrangement.spacedBy(12.dp)){ OutlinedTextField(s.weight, {vm.updateWeight(it)}, label={Text("Weight (kg)")}, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp)); OutlinedTextField(s.height, {vm.updateHeight(it)}, label={Text("Height (cm)")}, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp)) } }
}
