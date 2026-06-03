package com.trainly.app.viewmodel

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
    val phone: String = "",
    val relationship: String = "",
    val isLoading: Boolean = false
)

@HiltViewModel
class ContactsViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(ContactsUiState())
    val uiState: StateFlow<ContactsUiState> = _uiState.asStateFlow()

    init { load() }

    private fun load() {
        viewModelScope.launch {
            when (val result = api.getContacts()) {
                is NetworkResult.Success -> {
                    _uiState.value = _uiState.value.copy(contacts = result.data)
                }
                else -> {}
            }
        }
    }

    fun showAddDialog() {
        _uiState.value = _uiState.value.copy(showDialog = true, name = "", phone = "", relationship = "")
    }

    fun dismissDialog() {
        _uiState.value = _uiState.value.copy(showDialog = false)
    }

    fun updateName(value: String) { _uiState.value = _uiState.value.copy(name = value) }
    fun updatePhone(value: String) { _uiState.value = _uiState.value.copy(phone = value) }
    fun updateRelationship(value: String) { _uiState.value = _uiState.value.copy(relationship = value) }

    fun saveContact() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            val s = _uiState.value
            val contact = ContactDto(
                name = s.name,
                phone = s.phone,
                relationship = s.relationship.ifBlank { null }
            )
            when (api.addContact(contact)) {
                is NetworkResult.Success -> {
                    _uiState.value = _uiState.value.copy(showDialog = false, isLoading = false)
                    load()
                }
                else -> {
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
            }
        }
    }

    fun deleteContact(id: String) {
        viewModelScope.launch {
            api.deleteContact(id)
            load()
        }
    }
}
