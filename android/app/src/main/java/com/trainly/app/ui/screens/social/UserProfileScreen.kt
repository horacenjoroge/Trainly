package com.trainly.app.ui.screens.social
import com.trainly.app.ui.components.LoadingView
// UserProfile screen stub - inline in NavGraph is complex, this handles navigation target
@com.drakeet.base.Opt(com.drakeet.base.Opt.Companion::class)
@OptIn(ExperimentalMaterial3Api::class)
@androidx.compose.material3.ExperimentalMaterial3Api
@androidx.compose.runtime.Composable
fun UserProfileScreen(userId:String, onBack:()->Unit) { androidx.compose.material3.Scaffold(topBar={ androidx.compose.material3.TopAppBar(title={androidx.compose.material3.Text("Profile")}, navigationIcon={androidx.compose.material3.IconButton(onClick=onBack){androidx.compose.material3.Text("←")}}) }){ androidx.compose.material3.Text("User $userId") } }
