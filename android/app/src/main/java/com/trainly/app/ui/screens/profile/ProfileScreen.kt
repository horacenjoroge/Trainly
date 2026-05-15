package com.trainly.app.ui.screens.profile
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.trainly.app.viewmodel.ProfileViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun ProfileScreen(onBack:()->Unit, onSettings:()->Unit, vm:ProfileViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={ TopAppBar(title={Text("Profile", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}}, actions={IconButton(onClick=onSettings){Text("⚙")}}) }){p->
        when(val st=s){ is ProfileUiState.Loading -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){CircularProgressIndicator()}
            is ProfileUiState.Success -> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) {
                Column(Modifier.fillMaxWidth().padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) { AsyncImage(st.avatar, "avatar", Modifier.size(120.dp).clip(CircleShape), contentScale=ContentScale.Crop); Spacer(Modifier.height(12.dp)); Text(st.userName, fontWeight=FontWeight.Bold); Text(st.userBio, color=MaterialTheme.colorScheme.onSurfaceVariant, textAlign=TextAlign.Center) }
                Spacer(Modifier.height(16.dp))
            }
            is ProfileUiState.Error -> Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center){Text(st.message)}
        }
    }
}
