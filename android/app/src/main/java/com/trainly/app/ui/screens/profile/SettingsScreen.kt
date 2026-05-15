package com.trainly.app.ui.screens.profile
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.viewmodel.SettingsViewModel

@OptIn(ExperimentalMaterial3Api::class) @Composable fun SettingsScreen(onBack:()->Unit, onLogout:()->Unit, vm:SettingsViewModel= hiltViewModel()) { val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Settings", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}})})
    {p-> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) { Spacer(Modifier.height(16.dp))
            Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) { Row(Modifier.padding(16.dp), verticalAlignment=Alignment.CenterVertically) { Column(Modifier.weight(1f)) { Text(s.displayName, fontWeight=FontWeight.Bold); Text(s.email, style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) } } }
            Spacer(Modifier.height(24.dp)); Button(onClick={vm.logout(); onLogout()}, Modifier.fillMaxWidth().padding(horizontal=16.dp).height(48.dp), colors=ButtonDefaults.buttonColors(containerColor=MaterialTheme.colorScheme.error), shape=RoundedCornerShape(12.dp)){Text("Log Out", fontWeight=FontWeight.SemiBold)} } }
}
