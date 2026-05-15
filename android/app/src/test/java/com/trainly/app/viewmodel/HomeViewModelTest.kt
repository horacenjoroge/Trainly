package com.trainly.app.viewmodel
import com.trainly.app.data.local.AuthState
import com.trainly.app.data.local.SessionManager
import com.trainly.app.data.remote.ApiError
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.*
import com.trainly.app.domain.repository.HomeRepository
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
class HomeViewModelTest {
    private lateinit var repo:HomeRepository; private lateinit var sm:SessionManager; private lateinit var vm:HomeViewModel
    @BeforeEach fun setup() { Dispatchers.setMain(StandardTestDispatcher()); repo=mockk(); sm=mockk(relaxed=true); coEvery{sm.authState}returns MutableStateFlow(AuthState(user=User("1","T","t@t",null,null,null,null), isAuthenticated=true, isLoading=false)) }
    @Test fun `success state after data loads`() = runTest { coEvery{repo.getPosts()}returns NetworkResult.Success(listOf(Post(id="1",userId="1",userName="T",comments=emptyList(),likes=emptyList(),createdAt=""))); coEvery{repo.getProgressStats()}returns NetworkResult.Success(ProgressStats()); vm=HomeViewModel(repo,sm); advanceUntilIdle(); assertTrue(vm.uiState.value is com.trainly.app.ui.screens.home.HomeUiState.Success) }
    @Test fun `error state when both fail`() = runTest { coEvery{repo.getPosts()}returns NetworkResult.Error(ApiError("n")); coEvery{repo.getProgressStats()}returns NetworkResult.Error(ApiError("n")); vm=HomeViewModel(repo,sm); advanceUntilIdle(); assertTrue(vm.uiState.value is com.trainly.app.ui.screens.home.HomeUiState.Error) }
}
