package com.trainly.app.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.ProgressStats
import com.trainly.app.domain.repository.StatsRepository
import com.trainly.app.ui.features.analytics.StatsData
import com.trainly.app.ui.features.analytics.StatsUiState
import com.trainly.app.ui.designsystem.theme.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class StatsViewModel @Inject constructor(private val repo: StatsRepository) : ViewModel() {
    private val _s = MutableStateFlow<StatsUiState>(UiState.Loading); val uiState: StateFlow<StatsUiState> = _s.asStateFlow()
    private val periods = listOf("week","month","year","all")
    init { loadStats("month") }
    fun loadStats(p: String) { viewModelScope.launch { _s.value = UiState.Loading; loadAll(p) } }
    fun selectPeriod(p: String) { if (periods.contains(p)) loadStats(p) }
    fun refresh() { val c=_s.value; if(c is UiState.Success) viewModelScope.launch { loadAll((c.data as StatsData).selectedPeriod) } else viewModelScope.launch { loadAll("month") } }
    fun getPeriods() = periods
    private suspend fun loadAll(p: String) { val sr=repo.getStats(p); val s=(sr as? NetworkResult.Success)?.data?:ProgressStats(); _s.value=if(sr is NetworkResult.Error && s.totalWorkouts==0) UiState.Error((sr as NetworkResult.Error).error.message) else UiState.Success(StatsData(stats = s, selectedPeriod = p)) }
}
