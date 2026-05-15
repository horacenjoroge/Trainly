package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.domain.repository.StatsRepository
import com.trainly.app.ui.screens.stats.StatsUiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class StatsViewModel @Inject constructor(private val repo: StatsRepository) : ViewModel() {
    private val _s = MutableStateFlow<StatsUiState>(StatsUiState.Loading); val uiState: StateFlow<StatsUiState> = _s.asStateFlow()
    private val periods = listOf("week","month","year","all")
    init { loadStats("month") }
    fun loadStats(p: String) { viewModelScope.launch { _s.value=StatsUiState.Loading; loadAll(p) } }
    fun selectPeriod(p: String) { if (periods.contains(p)) loadStats(p) }
    fun refresh() { val c=_s.value; if(c is StatsUiState.Success) _s.value=c.copy(isRefreshing=true); viewModelScope.launch { loadAll((c as? StatsUiState.Success)?.selectedPeriod?:"month") } }
    fun getPeriods() = periods
    private suspend fun loadAll(p: String) { val sr=repo.getStats(p); val ar=repo.getAchievements(); val s=(sr as? NetworkResult.Success)?.data?:ProgressStats(); val a=(ar as? NetworkResult.Success)?.data?:emptyList(); _s.value=if(sr is NetworkResult.Error && s.totalWorkouts==0) StatsUiState.Error((sr as NetworkResult.Error).error.message, s) else StatsUiState.Success(s, a, selectedPeriod=p) }
}
