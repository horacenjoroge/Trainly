package com.trainly.app.ui.screens.profile
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.trainly.app.viewmodel.SettingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun SettingsScreen(onBack:()->Unit, onLogout:()->Unit, vm:SettingsViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    Scaffold(topBar={TopAppBar(title={Text("Settings", fontWeight=FontWeight.Bold)}, navigationIcon={IconButton(onClick=onBack){Text("\u2190")}})})
    {p-> Column(Modifier.fillMaxSize().padding(p).verticalScroll(rememberScrollState())) {
        Spacer(Modifier.height(16.dp))
        Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(16.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
            Row(Modifier.padding(16.dp), verticalAlignment=Alignment.CenterVertically) {
                AsyncImage(s.avatar, null, Modifier.size(56.dp).clip(CircleShape), contentScale=ContentScale.Crop)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) { Text(s.displayName, fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleMedium); Text(s.email, style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
                Text("\u203A", style=MaterialTheme.typography.titleLarge, color=MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Spacer(Modifier.height(24.dp))
        Text("General", style=MaterialTheme.typography.labelLarge, color=MaterialTheme.colorScheme.primary, modifier=Modifier.padding(horizontal=16.dp))
        Spacer(Modifier.height(8.dp))
        Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
            Column {
                SettingsItem("\uD83C\uDF1F", "Theme", "System default")
                HorizontalDivider(modifier=Modifier.padding(horizontal=16.dp))
                SettingsItem("\uD83D\uDD14", "Notifications", "Workout reminders")
                HorizontalDivider(modifier=Modifier.padding(horizontal=16.dp))
                SettingsItem("\uD83D\uDCCD", "Units", "Metric")
                HorizontalDivider(modifier=Modifier.padding(horizontal=16.dp))
                SettingsItem("\uD83D\uDD12", "Privacy", "Manage data")
            }
        }
        Spacer(Modifier.height(24.dp))
        Text("Account", style=MaterialTheme.typography.labelLarge, color=MaterialTheme.colorScheme.primary, modifier=Modifier.padding(horizontal=16.dp))
        Spacer(Modifier.height(8.dp))
        Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
            Column {
                SettingsItem("\uD83D\uDC64", "Personal Info", "Name, email, bio")
                HorizontalDivider(modifier=Modifier.padding(horizontal=16.dp))
                SettingsItem("\uD83C\uDFCB\uFE0F", "Fitness Stats", "Height, weight, goals")
                HorizontalDivider(modifier=Modifier.padding(horizontal=16.dp))
                SettingsItem("\uD83D\uDE91", "Emergency Contacts", "SOS numbers")
            }
        }
        Spacer(Modifier.height(24.dp))
        Text("Support", style=MaterialTheme.typography.labelLarge, color=MaterialTheme.colorScheme.primary, modifier=Modifier.padding(horizontal=16.dp))
        Spacer(Modifier.height(8.dp))
        Card(Modifier.fillMaxWidth().padding(horizontal=16.dp), shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) {
            Column {
                SettingsItem("\u2753", "Help Center", "FAQs and support")
                HorizontalDivider(modifier=Modifier.padding(horizontal=16.dp))
                SettingsItem("\uD83D\uDCEB", "Contact Us", "Send feedback")
                HorizontalDivider(modifier=Modifier.padding(horizontal=16.dp))
                SettingsItem("\u2139\uFE0F", "About", "Version 1.0.0")
            }
        }
        Spacer(Modifier.height(24.dp))
        Button(onClick={vm.logout(); onLogout()}, Modifier.fillMaxWidth().padding(horizontal=16.dp).height(48.dp), colors=ButtonDefaults.buttonColors(containerColor=MaterialTheme.colorScheme.error), shape=RoundedCornerShape(12.dp)) {
            if(s.isLoggingOut) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth=2.dp, color=MaterialTheme.colorScheme.onError) else Text("Log Out", fontWeight=FontWeight.SemiBold)
        }
        Spacer(Modifier.height(32.dp))
    }}
}

@Composable private fun SettingsItem(icon:String, title:String, subtitle:String) {
    Row(Modifier.fillMaxWidth().clickable {}.padding(16.dp), verticalAlignment=Alignment.CenterVertically) {
        Text(icon, style=MaterialTheme.typography.titleMedium); Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) { Text(title, fontWeight=FontWeight.Medium); Text(subtitle, style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant) }
        Text("\u203A", color=MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
