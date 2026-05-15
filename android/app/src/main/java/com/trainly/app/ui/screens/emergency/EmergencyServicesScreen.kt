package com.trainly.app.ui.screens.emergency
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.viewmodel.EmergencyViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun EmergencyServicesScreen(onBack:()->Unit, onContacts:()->Unit, vm:EmergencyViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Safety", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("←")}})})
    {p-> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState()).padding(16.dp), verticalArrangement=Arrangement.spacedBy(16.dp)) {
        Box(Modifier.fillMaxWidth(), contentAlignment=Alignment.Center) { Button(onClick={vm.sendSos()}, enabled=!s.isSendingSos, modifier=Modifier.size(160.dp), shape=CircleShape, colors=ButtonDefaults.buttonColors(containerColor=MaterialTheme.colorScheme.error), contentPadding=PaddingValues(0.dp)) { Column(horizontalAlignment=Alignment.CenterHorizontally) { if(s.isSendingSos) CircularProgressIndicator(color=MaterialTheme.colorScheme.onError) else { Text("SOS", fontSize=28.sp, fontWeight=FontWeight.Bold); Text("Emergency", fontSize=12.sp) } } } }
        Card(Modifier.fillMaxWidth(), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) { Column(Modifier.padding(16.dp)) { Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween, verticalAlignment=Alignment.CenterVertically) { Column { Text("Location Tracking"); Text(if(s.isLocationActive)"Active" else "Inactive", style=MaterialTheme.typography.bodySmall) }; Switch(s.isLocationActive, {vm.toggleLocationTracking()}) } } }
        Card(Modifier.fillMaxWidth(), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) { Column(Modifier.padding(16.dp)) { Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween, verticalAlignment=Alignment.CenterVertically) { Column { Text("Emergency Contacts"); Text("${s.contacts.size} contacts", style=MaterialTheme.typography.bodySmall) }; TextButton(onClick=onContacts){Text("Manage")} } } }
    } }
}
