package com.trainly.app.ui.screens.emergency
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
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.ContactDto
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CUiState(val contacts:List<ContactDto>=emptyList(), val showDialog:Boolean=false, val name:String="", val phone:String="")
@HiltViewModel class ContactsViewModel @Inject constructor(private val api:ApiService) : ViewModel() {
    private val _s=MutableStateFlow(CUiState()); val uiState:StateFlow<CUiState> = _s.asStateFlow()
    init{load()}; fun load(){viewModelScope.launch{when(api.getContacts()){is NetworkResult.Success->_s.value=_s.value.copy(contacts=it.data); else->{}}}}
    fun showAdd(){_s.value=_s.value.copy(showDialog=true,name="",phone="")}; fun dismiss(){_s.value=_s.value.copy(showDialog=false)}
    fun updateName(n:String){_s.value=_s.value.copy(name=n)}; fun updatePhone(p:String){_s.value=_s.value.copy(phone=p)}
    fun save(){if(_s.value.name.isBlank()||_s.value.phone.isBlank())return; viewModelScope.launch{api.addContact(ContactDto(name=_s.value.name, phone=_s.value.phone)); dismiss(); load()}}
    fun delete(id:String){viewModelScope.launch{api.deleteContact(id); load()}}
}
@OptIn(ExperimentalMaterial3Api::class) @Composable fun ContactScreen(onBack:()->Unit, vm:ContactsViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Emergency Contacts", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, actions={IconButton(onClick={vm.showAdd()}){Text("+", style=MaterialTheme.typography.titleLarge)}})})
    {p-> if(s.contacts.isEmpty()) Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Column(horizontalAlignment=Alignment.CenterHorizontally){Text("No contacts"); Spacer(Modifier.height(8.dp)); Button(onClick={vm.showAdd()}){Text("Add Contact")}}}
    else LazyColumn(Modifier.fillMaxSize().padding(p), contentPadding=PaddingValues(16.dp)){ items(s.contacts){ Card(Modifier.fillMaxWidth().padding(vertical=4.dp), shape=RoundedCornerShape(12.dp)) { Row(Modifier.padding(16.dp), verticalAlignment=Alignment.CenterVertically) { Column(Modifier.weight(1f)){Text(it.name?:"", fontWeight=FontWeight.Bold); Text(it.phone?:"", style=MaterialTheme.typography.bodySmall)}; IconButton(onClick={it.id?.let{vm.delete(it)}}){Text("✖")} } } } }
    if(s.showDialog) AlertDialog(onDismissRequest={vm.dismiss()}, title={Text("Add Contact")}, text={Column { OutlinedTextField(s.name, {vm.updateName(it)}, label={Text("Name")}, modifier=Modifier.fillMaxWidth()); Spacer(Modifier.height(8.dp)); OutlinedTextField(s.phone, {vm.updatePhone(it)}, label={Text("Phone")}, modifier=Modifier.fillMaxWidth()) } }, confirmButton={Button(onClick={vm.save()}){Text("Save")}}, dismissButton={TextButton(onClick={vm.dismiss()}){Text("Cancel")}}) }
}
