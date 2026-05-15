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

@Composable fun LoginScreen(onRegister:()->Unit, onSuccess:()->Unit, vm:AuthViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle()
    LaunchedEffect(Unit){vm.setLoginForm()}; LaunchedEffect(Unit){vm.events.collect{if(it is AuthFormEvent.LoginSuccess)onSuccess()}}
    val f=s as? AuthUiState.LoginForm
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) {
        Spacer(Modifier.height(48.dp))
        Surface(Modifier.size(80.dp), shape=RoundedCornerShape(20.dp), color=MaterialTheme.colorScheme.primaryContainer) { Box(contentAlignment=Alignment.Center) { Text("\uD83C\uDFC3", style=MaterialTheme.typography.displayLarge) } }
        Spacer(Modifier.height(16.dp))
        Text("Trainly", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.headlineMedium, color=MaterialTheme.colorScheme.primary)
        Text("Welcome Back!", fontWeight=FontWeight.Bold, style=MaterialTheme.typography.titleLarge)
        Text("Sign in to continue", style=MaterialTheme.typography.bodyLarge, color=MaterialTheme.colorScheme.onSurfaceVariant, textAlign=TextAlign.Center)
        Spacer(Modifier.height(32.dp))
        f?.error?.let{ Surface(Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), color=MaterialTheme.colorScheme.error.copy(alpha=0.1f)){Text(it, Modifier.padding(12.dp), color=MaterialTheme.colorScheme.error)} }
        OutlinedTextField(f?.email?:"", {vm.updateLoginEmail(it)}, label={Text("Email")}, leadingIcon={Text("\u2709")}, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Email, imeAction=ImeAction.Next), singleLine=true)
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(f?.password?:"", {vm.updateLoginPassword(it)}, label={Text("Password")}, leadingIcon={Text("\uD83D\uDD12")}, trailingIcon={ TextButton(onClick={vm.toggleLoginPasswordVisibility()}){Text(if(f?.showPassword==true)"\uD83D\uDC41" else "\uD83D\uDC41\u200D\uD83D\uDDE8")} }, modifier=Modifier.fillMaxWidth(), shape=RoundedCornerShape(12.dp), visualTransformation=if(f?.showPassword==true)VisualTransformation.None else PasswordVisualTransformation(), keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Password, imeAction=ImeAction.Done), singleLine=true)
        Spacer(Modifier.height(24.dp))
        Button(onClick={vm.login()}, Modifier.fillMaxWidth().height(50.dp), enabled=f?.isLoading!=true, shape=RoundedCornerShape(12.dp)){ if(f?.isLoading==true) CircularProgressIndicator(Modifier.size(24.dp), strokeWidth=2.dp, color=MaterialTheme.colorScheme.onPrimary) else Text("Sign In", fontWeight=FontWeight.SemiBold) }
        Row(Modifier.fillMaxWidth().padding(top=24.dp), horizontalArrangement=Arrangement.Center) { Text("Don't have an account?"); TextButton(onClick=onRegister){Text("Sign Up", fontWeight=FontWeight.SemiBold)} }
    }
}
