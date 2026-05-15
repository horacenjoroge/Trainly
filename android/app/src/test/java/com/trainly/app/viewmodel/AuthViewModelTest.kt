package com.trainly.app.viewmodel
import com.trainly.app.data.local.SessionManager
import com.trainly.app.domain.models.User
import com.trainly.app.domain.models.UserStats
import com.trainly.app.domain.repository.AuthRepository
import com.trainly.app.ui.screens.auth.AuthUiState
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class AuthViewModelTest {
    private lateinit var repo:AuthRepository; private lateinit var sm:SessionManager; private lateinit var vm:AuthViewModel
    @BeforeEach fun setup() { Dispatchers.setMain(StandardTestDispatcher()); repo=mockk(); sm=mockk(relaxed=true); coEvery{sm.isAuthenticated()}returns false }
    @Test fun `initial state is login form`() { vm=AuthViewModel(repo,sm); assertTrue(vm.uiState.value is AuthUiState.LoginForm) }
    @Test fun `toggle to register`() { vm=AuthViewModel(repo,sm); vm.setRegisterForm(); assertTrue(vm.uiState.value is AuthUiState.RegisterForm) }
    @Test fun `login blank email validation`() = runTest { vm=AuthViewModel(repo,sm); vm.login(); assertTrue((vm.uiState.value as AuthUiState.LoginForm).error?.contains("Email")==true) }
    @Test fun `register short password validation`() = runTest { vm=AuthViewModel(repo,sm); vm.setRegisterForm(); vm.updateRegisterName("T"); vm.updateRegisterEmail("t@t.com"); vm.updateRegisterPassword("s"); vm.register(); assertTrue((vm.uiState.value as AuthUiState.RegisterForm).error?.contains("8")==true) }
}
