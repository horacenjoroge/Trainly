package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.ui.screens.profile.ProfileUiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val api: ApiService, private val sm: SessionManager
) : ViewModel() {
    private val _s = MutableStateFlow<ProfileUiState>(ProfileUiState.Loading); val uiState: StateFlow<ProfileUiState> = _s.asStateFlow()
    init { loadProfile() }
    fun loadProfile() { viewModelScope.launch { _s.value=ProfileUiState.Loading; loadAll() } }
    private suspend fun loadAll() { val name=sm.authState.value.user?.name?:"User"; when(val r=api.getUserProfile()){ is NetworkResult.Success -> { val d=r.data; val fc=(api.getFollowers().let{if(it is NetworkResult.Success)it.data.size else 0}); val fg=(api.getFollowing().let{if(it is NetworkResult.Success)it.data.size else 0}); _s.value=ProfileUiState.Success(userName=d.name?:name, userBio=d.bio?:"Fitness enthusiast", avatar=d.avatar, followers=fc, following=fg) }; is NetworkResult.Error -> _s.value=ProfileUiState.Error(r.error.message, name); else -> {} } }
}
