package com.trainly.app.ui.screens.auth
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.viewmodel.AuthViewModel

@Composable fun RegisterScreen(onLogin:()->Unit, onSuccess:()->Unit, vm:AuthViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    LaunchedEffect(Unit){vm.setRegisterForm()}; LaunchedEffect(Unit){vm.events.collect{if(it is AuthFormEvent.RegisterSuccess)onSuccess()}}
    val f=s as? AuthUiState.RegisterForm
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) {
        Spacer(Modifier.height(48.dp))
        Surface(Modifier.size(80.dp), shape=RoundedCornerShape(20.dp), color=MaterialTheme.colorScheme.primaryContainer) { Box(contentAlignment=Alignment.Center) { Text("\uD83C\uDFC3", style=MaterialTheme.typography.displayLarge) } }
        Spacer(Modifier.height(16.dp))
        Text("Trainly", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.headlineMedium, color=MaterialTheme.colorScheme.primary)
        Text("Create Account", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleLarge)
        Text("Join to start your journey", style=MaterialTheme.typography.bodyLarge, color=MaterialTheme.colorScheme.onSurfaceVariant, textAlign=TextAlign.Center)
        Spacer(Modifier.height(32.dp))
        f?.error?.let{ Surface(Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), color=MaterialTheme.colorScheme.error.copy(alpha=0.1f)){Text(it, Modifier.padding(12.dp), color=MaterialTheme.colorScheme.error)} }
        OutlinedTextField(f?.name?:"", {vm.updateRegisterName(it)}, label={Text("Name")}, leadingIcon={Text("\uD83D\uDC64")}, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), keyboardOptions=KeyboardOptions(imeAction=ImeAction.Next), singleLine=true)
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(f?.email?:"", {vm.updateRegisterEmail(it)}, label={Text("Email")}, leadingIcon={Text("\u2709")}, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Email, imeAction=ImeAction.Next), singleLine=true)
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(f?.password?:"", {vm.updateRegisterPassword(it)}, label={Text("Password")}, leadingIcon={Text("\uD83D\uDD12")}, trailingIcon={ TextButton(onClick={vm.toggleRegisterPasswordVisibility()}){Text(if(f?.showPassword==true)"\uD83D\uDC41" else "\uD83D\uDC41\u200D\uD83D\uDDE8")} }, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), visualTransformation=if(f?.showPassword==true)VisualTransformation.None else PasswordVisualTransformation(), keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Password, imeAction=ImeAction.Done), singleLine=true)
        Spacer(Modifier.height(24.dp))
        Button(onClick={vm.register()}, Modifier.fillMaxWidth().height(50.dp), enabled=f?.isLoading!=true, shape=RoundedCornerShape(12.dp)){ if(f?.isLoading==true) CircularProgressIndicator(Modifier.size(24.dp), strokeWidth=2.dp, color=MaterialTheme.colorScheme.onPrimary) else Text("Create Account", fontWeight=FontWeight.SemiBold) }
        Row(Modifier.fillMaxWidth().padding(top=24.dp), horizontalArrangement=Arrangement.Center) { Text("Already have an account?"); TextButton(onClick=onLogin){Text("Sign In", fontWeight=FontWeight.SemiBold)} }
    }
}
