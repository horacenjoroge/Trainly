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
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.data.remote.dto.ContactDto
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ContactsUiState(
    val contacts: List<ContactDto> = emptyList(),
    val showDialog: Boolean = false,
    val name: String = "",
    val phone: String = ""
)

@HiltViewModel
class ContactsViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(ContactsUiState())
    val uiState: StateFlow<ContactsUiState> = _uiState.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            when (val result = api.getContacts()) {
                is NetworkResult.Success -> _uiState.value = _uiState.value.copy(contacts = result.data)
                else -> { }
            }
        }
    }

    fun showAddDialog() {
        _uiState.value = _uiState.value.copy(showDialog = true, name = "", phone = "")
    }

    fun dismissDialog() {
        _uiState.value = _uiState.value.copy(showDialog = false)
    }

    fun updateName(n: String) { _uiState.value = _uiState.value.copy(name = n) }
    fun updatePhone(p: String) { _uiState.value = _uiState.value.copy(phone = p) }

    fun saveContact() {
        if (_uiState.value.name.isBlank() || _uiState.value.phone.isBlank()) return
        viewModelScope.launch {
            api.addContact(ContactDto(name = _uiState.value.name, phone = _uiState.value.phone))
            dismissDialog()
            load()
        }
    }

    fun deleteContact(id: String) {
        viewModelScope.launch {
            api.deleteContact(id)
            load()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ContactScreen(
    onNavigateBack: () -> Unit,
    viewModel: ContactsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Emergency Contacts", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onNavigateBack) { Text("\u2190") } },
                actions = { IconButton(onClick = { viewModel.showAddDialog() }) { Text("+", style = MaterialTheme.typography.titleLarge) } }
            )
        }
    ) { padding ->
        if (uiState.contacts.isEmpty()) {
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("No contacts")
                    Spacer(Modifier.height(8.dp))
                    Button(onClick = { viewModel.showAddDialog() }) { Text("Add Contact") }
                }
            }
        } else {
            LazyColumn(Modifier.fillMaxSize().padding(padding), contentPadding = PaddingValues(16.dp)) {
                items(uiState.contacts) { contact ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp), shape = RoundedCornerShape(12.dp)) {
                        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                            Column(Modifier.weight(1f)) {
                                Text(contact.name ?: "", fontWeight = FontWeight.Bold)
                                Text(contact.phone ?: "", style = MaterialTheme.typography.bodySmall)
                            }
                            IconButton(onClick = { contact.id?.let { viewModel.deleteContact(it) } }) {
                                Text("\u2716")
                            }
                        }
                    }
                }
            }
        }
    }

    if (uiState.showDialog) {
        AlertDialog(
            onDismissRequest = { viewModel.dismissDialog() },
            title = { Text("Add Contact") },
            text = {
                Column {
                    OutlinedTextField(uiState.name, { viewModel.updateName(it) }, label = { Text("Name") }, modifier = Modifier.fillMaxWidth())
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(uiState.phone, { viewModel.updatePhone(it) }, label = { Text("Phone") }, modifier = Modifier.fillMaxWidth())
                }
            },
            confirmButton = { Button(onClick = { viewModel.saveContact() }) { Text("Save") } },
            dismissButton = { TextButton(onClick = { viewModel.dismissDialog() }) { Text("Cancel") } }
        )
    }
}
